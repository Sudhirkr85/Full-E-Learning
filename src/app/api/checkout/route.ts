import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { OrderStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await request.json();
    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required." }, { status: 400 });
    }

    // 1. Fetch the course
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    // 2. Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: "Already enrolled in this course." }, { status: 400 });
    }

    const priceCents = course.priceCents;
    if (priceCents <= 0) {
      return NextResponse.json({ error: "Course is free. Use free checkout endpoint instead." }, { status: 400 });
    }

    // 3. Create a unique local receipt orderNumber
    const orderNumber = `ORD_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // 4. Create Razorpay order
    const rzpOrder = await razorpay.orders.create({
      amount: priceCents, // Price is already stored in cents/paise in DB
      currency: "INR",
      receipt: orderNumber,
      notes: {
        courseId: courseId,
        userId: session.user.id
      }
    });

    // Find the storefront Product linked to this course
    let product = await prisma.product.findFirst({
      where: { courseId: course.id }
    });

    if (!product) {
      const baseSlug = `${course.slug}-access`;
      let productSlug = baseSlug;
      const existingProductSlug = await prisma.product.findUnique({
        where: { slug: productSlug }
      });
      if (existingProductSlug) {
        productSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
      }
      product = await prisma.product.create({
        data: {
          title: course.title,
          slug: productSlug,
          productType: "COURSE_ACCESS",
          status: "PUBLISHED",
          priceCents: course.priceCents,
          currency: "INR",
          courseId: course.id
        }
      });
    }

    // 5. Save the Order and pending Payment in local database inside a transaction
    const order = await prisma.order.create({
      data: {
        orderNumber: rzpOrder.id, // Store Razorpay Order ID as the unique orderNumber key
        userId: session.user.id,
        billingEmail: session.user.email || "billing@example.com",
        status: OrderStatus.PENDING,
        subtotalCents: priceCents,
        discountCents: 0,
        taxCents: 0,
        totalCents: priceCents,
        currency: "INR",
        notes: `Course Access Order: ${course.title}`,
        items: {
          create: [{
            productName: course.title,
            productSlug: course.slug,
            productType: "COURSE_ACCESS" as any, // We are buying course access
            quantity: 1,
            unitPriceCents: priceCents,
            totalPriceCents: priceCents,
            currency: "INR",
            productId: product.id // Link the valid product ID
          }]
        }
      }
    });

    // Create corresponding pending Payment record for Webhook correlation
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "STRIPE", // Match standard credit/merchant card logs
        providerPaymentId: rzpOrder.id, // Maps to order_id in payment webhook payload
        status: "PENDING",
        amountCents: priceCents,
        currency: "INR",
        metadata: {
          rzpOrderId: rzpOrder.id
        }
      }
    });

    // 6. Return payload to initialize Razorpay checkout widget
    return NextResponse.json({
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
      courseName: course.title,
      userEmail: session.user.email,
      userName: session.user.name
    });
  } catch (err: any) {
    console.error("[COURSE_CHECKOUT_API_ERROR]", err);
    return NextResponse.json(
      { error: err.message || "Failed to initialize payment." },
      { status: 500 }
    );
  }
}
