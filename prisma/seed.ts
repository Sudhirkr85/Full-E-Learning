import { PrismaClient, ProductType, ProductStatus, CouponType } from "@prisma/client";
import { SUPER_ADMIN_EMAIL } from "../src/lib/admin-config";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding store products and coupons...");

  // 1. Fetch existing courses
  const courses = await prisma.course.findMany();
  console.log(`Found ${courses.length} courses in the database.`);

  // 2. Create products for each course (COURSE_ACCESS)
  for (const course of courses) {
    const slug = `${course.slug}-access`;
    await prisma.product.upsert({
      where: { slug },
      update: {
        courseId: course.id,
        priceCents: course.priceCents || 4900, // $49.00 default if 0
      },
      create: {
        title: `${course.title} — Premium Access`,
        slug,
        description: `Get full unrestricted lifetime access to ${course.title}. Includes all video lectures, reading materials, quizzes, interactive assessments, and a shareable digital certificate upon 100% completion.`,
        productType: ProductType.COURSE_ACCESS,
        status: ProductStatus.ACTIVE,
        priceCents: course.priceCents || 4900,
        currency: "USD",
        coverImageUrl: course.coverImageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
        metadata: {
          courseId: course.id,
          benefits: ["Lifetime access", "Digital Certificate", "Quizzes & Graded Exams", "Teacher Support"],
        },
      },
    });
  }

  // 3. Create independent digital resources
  await prisma.product.upsert({
    where: { slug: "nextjs-architecture-playbook" },
    update: {
      originalPriceCents: 9900,
    },
    create: {
      title: "Next.js 15+ Advanced Architecture Playbook",
      slug: "nextjs-architecture-playbook",
      description: "An expert-level PDF guide detailing robust enterprise folder structures, Next.js server action patterns, transaction handling, robust React Server Component (RSC) caching strategies, and multi-tenant security layers.",
      productType: ProductType.DIGITAL_RESOURCE,
      status: ProductStatus.ACTIVE,
      priceCents: 1900, // $19.00
      originalPriceCents: 9900,
      currency: "USD",
      coverImageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=80",
      assetUrl: "https://r2.e-learning.academy/books/nextjs-architecture-playbook.pdf",
      inventoryCount: null, // Unlimited
      metadata: {
        format: "PDF",
        pageCount: 142,
        author: "Academicians Team",
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "tailwind-glassmorphic-ui-kit" },
    update: {
      originalPriceCents: 19900,
    },
    create: {
      title: "Tailwind CSS Premium Glassmorphic UI Dashboard Kit",
      slug: "tailwind-glassmorphic-ui-kit",
      description: "A complete bundle of beautiful, fully responsive dashboard pages, widgets, and charts styled with harmonic HSL colors, glassmorphism filters, smooth CSS transitions, and full Tailwind CSS configurations.",
      productType: ProductType.DIGITAL_RESOURCE,
      status: ProductStatus.ACTIVE,
      priceCents: 2900, // $29.00
      originalPriceCents: 19900,
      currency: "USD",
      coverImageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
      assetUrl: "https://r2.e-learning.academy/assets/tailwind-glassmorphic-ui-kit.zip",
      inventoryCount: 150, // Physical/Limited quantity example
      metadata: {
        format: "ZIP (HTML/JS/React)",
        componentsCount: 85,
      },
    },
  });

  // 4. Create a bundle product
  await prisma.product.upsert({
    where: { slug: "complete-fullstack-dev-bundle" },
    update: {
      originalPriceCents: 29900,
    },
    create: {
      title: "The Complete Full-Stack Developer Starter Bundle",
      slug: "complete-fullstack-dev-bundle",
      description: "Gain the ultimate coding toolset. This bundle combines the Next.js Architecture Playbook, the Tailwind Glassmorphic Dashboard Kit, and unlocks full enrollment access for our top 2 beginner & advanced backend programming courses.",
      productType: ProductType.BUNDLE,
      status: ProductStatus.ACTIVE,
      priceCents: 5900, // $59.00
      originalPriceCents: 29900,
      currency: "USD",
      coverImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
      inventoryCount: null,
      metadata: {
        includes: ["Next.js Architecture Playbook (PDF)", "Tailwind UI Kit (ZIP)", "Course Access Vouchers"],
      },
    },
  });

  // 5. Create promotional coupons
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: { isActive: true },
    create: {
      code: "WELCOME10",
      name: "Welcome Discount",
      description: "Get 10% off your entire order with this introductory coupon code.",
      couponType: CouponType.PERCENTAGE,
      discountValue: 10, // 10%
      minimumOrderAmountCents: 1000, // Min $10
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "BIGDEAL5" },
    update: { isActive: true },
    create: {
      code: "BIGDEAL5",
      name: "Big Promo Discount",
      description: "Enjoy a flat $5.00 off on any purchase above $15.00.",
      couponType: CouponType.FIXED_AMOUNT,
      discountValue: 500, // $5.00
      minimumOrderAmountCents: 1500, // Min $15
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "SUPER90" },
    update: { isActive: true },
    create: {
      code: "SUPER90",
      name: "Special Developer Discount",
      description: "Enjoy a massive 90% discount on any purchase.",
      couponType: CouponType.PERCENTAGE,
      discountValue: 90, // 90%
      isActive: true,
    },
  });

  // Seed super admin (upsert — safe to run multiple times)
  const adminPassword = await hashPassword("Admin@123456"); // change before production

  await prisma.user.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    update: {}, // never overwrite existing admin data on re-seed
    create: {
      email: SUPER_ADMIN_EMAIL,
      name: "Super Admin",
      role: "ADMIN",
      passwordHash: adminPassword,
    },
  });

  console.log(`✅ Super admin ensured: ${SUPER_ADMIN_EMAIL}`);

  console.log("Seeding complete! Store products and coupons are ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
