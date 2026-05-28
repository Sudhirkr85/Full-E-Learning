"use server";

import { prisma } from "@/lib/prisma";
import { ProductStatus, ProductType, OrderStatus, CouponType } from "@prisma/client";

/**
 * Fetch active products from the database with optional filters.
 */
export async function getProductsAction(filters?: {
  productType?: ProductType;
  query?: string;
}) {
  try {
    const whereClause: any = {
      status: ProductStatus.ACTIVE,
    };

    if (filters?.productType) {
      whereClause.productType = filters.productType;
    }

    if (filters?.query) {
      whereClause.OR = [
        { title: { contains: filters.query, mode: "insensitive" } },
        { description: { contains: filters.query, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      products,
    };
  } catch (err: any) {
    console.error("[GET_PRODUCTS_ERROR]", err);
    return {
      success: false,
      error: err.message ?? "Failed to fetch products.",
      products: [],
    };
  }
}

/**
 * Fetch a single product by its unique slug.
 */
export async function getProductBySlugAction(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImageUrl: true,
          },
        },
      },
    });

    if (!product || product.status !== ProductStatus.ACTIVE) {
      return {
        success: false,
        error: "Product not found or currently unavailable.",
        product: null,
      };
    }

    return {
      success: true,
      product,
    };
  } catch (err: any) {
    console.error("[GET_PRODUCT_BY_SLUG_ERROR]", err);
    return {
      success: false,
      error: err.message ?? "Failed to fetch product details.",
      product: null,
    };
  }
}

/**
 * Validates a coupon code.
 */
export async function validateCouponAction(code: string, subtotalCents: number) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return {
        success: false,
        error: "Coupon code is invalid or has expired.",
        coupon: null,
      };
    }

    const now = new Date();
    if (coupon.startsAt && now < coupon.startsAt) {
      return {
        success: false,
        error: "This coupon is not active yet.",
        coupon: null,
      };
    }

    if (coupon.endsAt && now > coupon.endsAt) {
      return {
        success: false,
        error: "This coupon has expired.",
        coupon: null,
      };
    }

    if (coupon.maxRedemptions !== null && coupon.redeemedCount >= coupon.maxRedemptions) {
      return {
        success: false,
        error: "This coupon has reached its maximum redemptions limit.",
        coupon: null,
      };
    }

    if (coupon.minimumOrderAmountCents !== null && subtotalCents < coupon.minimumOrderAmountCents) {
      return {
        success: false,
        error: `Minimum order amount of ${(coupon.minimumOrderAmountCents / 100).toFixed(2)} is required to use this coupon.`,
        coupon: null,
      };
    }

    // Compute discount value
    let discountCents = 0;
    if (coupon.couponType === CouponType.PERCENTAGE) {
      discountCents = Math.round((subtotalCents * coupon.discountValue) / 100);
    } else {
      discountCents = coupon.discountValue; // Value stored in cents
    }

    // Discount cannot exceed subtotal
    discountCents = Math.min(discountCents, subtotalCents);

    return {
      success: true,
      coupon,
      discountCents,
    };
  } catch (err: any) {
    console.error("[VALIDATE_COUPON_ERROR]", err);
    return {
      success: false,
      error: err.message ?? "Failed to validate coupon.",
      coupon: null,
    };
  }
}

interface CartItemInput {
  productId: string;
  quantity: number;
}

/**
 * Creates a new Order inside a secure Prisma transaction.
 * Performs stock verification, coupon validation, subtotal calculation, and creates items.
 */
export async function createOrderAction(params: {
  userId?: string | null;
  billingEmail: string;
  cartItems: CartItemInput[];
  couponCode?: string;
  notes?: string;
  metadata?: any;
}) {
  try {
    const { userId, billingEmail, cartItems, couponCode, notes, metadata } = params;

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cannot create an order with an empty cart.");
    }

    if (!billingEmail) {
      throw new Error("Billing email is required.");
    }

    // Execute order creation in a single isolation-safe transaction
    const result = await prisma.$transaction(async (tx) => {
      let subtotalCents = 0;
      const verifiedItems: any[] = [];

      // 1. Fetch products and check inventory
      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || product.status !== ProductStatus.ACTIVE) {
          throw new Error(`Product with ID ${item.productId} is not available.`);
        }

        // Verify physical inventory stock if applicable
        if (product.inventoryCount !== null) {
          if (product.inventoryCount < item.quantity) {
            throw new Error(`Insufficient stock for product "${product.title}". Only ${product.inventoryCount} items left.`);
          }

          // Decrement stock in transaction
          await tx.product.update({
            where: { id: product.id },
            data: {
              inventoryCount: {
                decrement: item.quantity,
              },
            },
          });
        }

        const itemTotal = product.priceCents * item.quantity;
        subtotalCents += itemTotal;

        verifiedItems.push({
          productId: product.id,
          productName: product.title,
          productSlug: product.slug,
          productType: product.productType,
          quantity: item.quantity,
          unitPriceCents: product.priceCents,
          totalPriceCents: itemTotal,
          currency: product.currency,
        });
      }

      // 2. Process Coupon discount
      let couponId: string | null = null;
      let discountCents = 0;

      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode.toUpperCase() },
        });

        if (!coupon || !coupon.isActive) {
          throw new Error("Coupon code is invalid or has expired.");
        }

        const now = new Date();
        if (coupon.startsAt && now < coupon.startsAt) {
          throw new Error("This coupon is not active yet.");
        }
        if (coupon.endsAt && now > coupon.endsAt) {
          throw new Error("This coupon has expired.");
        }
        if (coupon.maxRedemptions !== null && coupon.redeemedCount >= coupon.maxRedemptions) {
          throw new Error("This coupon has reached its redemptions limit.");
        }
        if (coupon.minimumOrderAmountCents !== null && subtotalCents < coupon.minimumOrderAmountCents) {
          throw new Error(`Minimum order amount of ${(coupon.minimumOrderAmountCents / 100).toFixed(2)} is required to use this coupon.`);
        }

        couponId = coupon.id;
        if (coupon.couponType === CouponType.PERCENTAGE) {
          discountCents = Math.round((subtotalCents * coupon.discountValue) / 100);
        } else {
          discountCents = coupon.discountValue;
        }

        discountCents = Math.min(discountCents, subtotalCents);

        // Increment coupon redeemed count in transaction
        await tx.coupon.update({
          where: { id: coupon.id },
          data: {
            redeemedCount: {
              increment: 1,
            },
          },
        });
      }

      // 3. Compute final values
      const taxCents = 0; // Standard 0% tax or customizable
      const totalCents = Math.max(0, subtotalCents - discountCents + taxCents);

      // 4. Generate unique order number (ORD-YEAR-MONTH-DAY-[RANDOM])
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      const orderNumber = `ORD-${dateStr}-${randomPart}`;

      // 5. Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          couponId,
          billingEmail,
          status: OrderStatus.PENDING,
          subtotalCents,
          discountCents,
          taxCents,
          totalCents,
          currency: verifiedItems[0]?.currency || "USD",
          notes,
          metadata: metadata || {},
          items: {
            create: verifiedItems.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              productSlug: item.productSlug,
              productType: item.productType,
              quantity: item.quantity,
              unitPriceCents: item.unitPriceCents,
              totalPriceCents: item.totalPriceCents,
              currency: item.currency,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 6. Write Audit Log in transaction
      await tx.auditLog.create({
        data: {
          userId: userId || null,
          action: "CREATE",
          entityType: "Order",
          entityId: order.id,
          afterState: JSON.parse(JSON.stringify(order)),
          metadata: {
            reason: "Checkout order creation",
            couponCode: couponCode || null,
          },
        },
      });

      return order;
    });

    return {
      success: true,
      order: result,
    };
  } catch (err: any) {
    console.error("[CREATE_ORDER_ACTION_ERROR]", err);
    return {
      success: false,
      error: err.message ?? "Failed to create order.",
      order: null,
    };
  }
}

/**
 * Offline simulation helper executing full paid-order fulfillment state changes.
 * Used strictly for local developer sandboxes or when testing without tunnels.
 */
export async function simulatePaymentSuccessAction(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    if (order.status === OrderStatus.PAID) {
      return { success: true, message: "Order is already paid." };
    }

    const simPaymentId = `sim_pay_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    let isNewUserCreated = false;
    let studentName = order.billingEmail.split("@")[0];
    let studentEmail = order.billingEmail;
    const coursesEnrolled: { title: string; slug: string }[] = [];

    await prisma.$transaction(async (tx) => {
      // 1. Update Order status
      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PAID },
      });

      // 2. Upsert completed Payment
      await tx.payment.upsert({
        where: { providerPaymentId: simPaymentId },
        update: {},
        create: {
          orderId: order.id,
          provider: "MANUAL",
          providerPaymentId: simPaymentId,
          status: "SUCCEEDED",
          amountCents: order.totalCents,
          currency: order.currency,
          paidAt: new Date(),
        },
      });

      // 3. Resolve user mapping
      let studentUserId = order.userId;
      if (!studentUserId) {
        const existingUser = await tx.user.findUnique({
          where: { email: order.billingEmail },
        });

        if (existingUser) {
          studentUserId = existingUser.id;
          studentName = existingUser.name || existingUser.email.split("@")[0];
          studentEmail = existingUser.email;
          await tx.order.update({
            where: { id: order.id },
            data: { userId: studentUserId },
          });
        } else {
          // Generate new user
          const newUser = await tx.user.create({
            data: {
              email: order.billingEmail,
              name: order.billingEmail.split("@")[0],
              passwordHash: "AUTOMATIC_SIMULATED_USER_123",
              role: "STUDENT",
            },
          });
          studentUserId = newUser.id;
          studentName = newUser.name || newUser.email.split("@")[0];
          studentEmail = newUser.email;
          isNewUserCreated = true;
          await tx.order.update({
            where: { id: order.id },
            data: { userId: studentUserId },
          });
        }
      } else {
        const existingUser = await tx.user.findUnique({
          where: { id: studentUserId },
        });
        if (existingUser) {
          studentName = existingUser.name || existingUser.email.split("@")[0];
          studentEmail = existingUser.email;
        }
      }

      // 4. Grant learning upgrades
      for (const item of order.items) {
        const product = item.product;
        if (!product) continue;

        if (product.productType === "COURSE_ACCESS" && product.courseId) {
          const course = await tx.course.findUnique({
            where: { id: product.courseId },
            include: {
              sections: {
                include: {
                  lessons: true,
                },
              },
            },
          });

          if (course) {
            coursesEnrolled.push({ title: course.title, slug: course.slug });
            const totalLessons = course.sections.reduce((sum, sec) => sum + sec.lessons.length, 0);

            await tx.enrollment.upsert({
              where: {
                userId_courseId: {
                  userId: studentUserId,
                  courseId: course.id,
                },
              },
              update: {
                status: "ACTIVE",
                lastAccessedAt: new Date(),
              },
              create: {
                userId: studentUserId,
                courseId: course.id,
                status: "ACTIVE",
                progress: {
                  create: {
                    progressPercent: 0,
                    completedLessonsCount: 0,
                    totalLessonsCount: totalLessons,
                  },
                },
              },
            });

            await tx.notification.create({
              data: {
                userId: studentUserId,
                type: "COURSE",
                title: "Simulated Course Activated! 🚀",
                message: `You now have active access to course "${course.title}". Start studying.`,
                linkUrl: `/student/courses`,
              },
            });
          }
        }

        if (product.productType === "DIGITAL_RESOURCE") {
          await tx.notification.create({
            data: {
              userId: studentUserId,
              type: "ORDER",
              title: "Digital PDF Unlocked! 📚",
              message: `Your playbook "${product.title}" is ready in your purchases listing.`,
              linkUrl: `/student/orders`,
            },
          });
        }
      }

      // 5. Write audit log
      await tx.auditLog.create({
        data: {
          userId: studentUserId,
          action: "UPDATE",
          entityType: "Order",
          entityId: order.id,
          afterState: { status: "PAID", simulation: true, simPaymentId },
          metadata: {
            reason: "Sandbox Offline Checkout simulation success",
            orderNumber: order.orderNumber,
          },
        },
      });
    });

    // Post-commit background email dispatching
    const { 
      dispatchEmailBackground, 
      sendCombinedWelcomePaymentEmail, 
      sendPaymentSuccessEmail, 
      sendEnrollmentEmail 
    } = await import("@/lib/email");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const supportEmail = process.env.BREVO_SENDER_EMAIL || "support@e-learning.in";

    const itemsSummary = order.items.map(item => ({
      productName: item.productName,
      quantity: item.quantity,
      totalPriceCents: item.totalPriceCents
    }));

    if (isNewUserCreated) {
      // First-time user checkout: single unified welcome + payment receipt email
      dispatchEmailBackground(() =>
        sendCombinedWelcomePaymentEmail(studentEmail, studentName, {
          name: studentName,
          appUrl,
          orderNumber: order.orderNumber,
          totalAmountCents: order.totalCents,
          currency: order.currency,
          items: itemsSummary,
          supportEmail
        })
      );
    } else {
      // Existing user checkout: payment receipt + individual course activation emails
      dispatchEmailBackground(() =>
        sendPaymentSuccessEmail(studentEmail, studentName, {
          name: studentName,
          orderNumber: order.orderNumber,
          totalAmountCents: order.totalCents,
          currency: order.currency,
          items: itemsSummary,
          supportEmail
        })
      );

      for (const course of coursesEnrolled) {
        dispatchEmailBackground(() =>
          sendEnrollmentEmail(studentEmail, studentName, {
            name: studentName,
            courseTitle: course.title,
            courseSlug: course.slug,
            appUrl
          })
        );
      }
    }

    return {
      success: true,
      message: "Order payment successfully simulated! Course access is active.",
    };
  } catch (err: any) {
    console.error("[SIMULATE_PAYMENT_ERROR]", err);
    return {
      success: false,
      error: err.message ?? "Simulation failed.",
    };
  }
}
