import { PrismaClient, UserRole, CourseLevel, CourseStatus, ProductType, ProductStatus } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding admin account...");

  const email = "admin@sagarcoachingcentre.com";
  const password = "Admin@123456";
  const adminPassword = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: {
      firstName: "Shrvan Kumar",
      lastName: "Sagar",
      name: "Shrvan Kumar Sagar",
      role: UserRole.ADMIN,
      passwordHash: adminPassword,
    },
    create: {
      email,
      firstName: "Shrvan Kumar",
      lastName: "Sagar",
      name: "Shrvan Kumar Sagar",
      role: UserRole.ADMIN,
      passwordHash: adminPassword,
    },
  });

  console.log(`✅ Admin user ensured: ${email}`);

  // Seed Categories
  console.log("Seeding categories...");
  const categoriesToSeed = [
    { name: "Scholarship Exams",          slug: "scholarship-exams" },
    { name: "Residential School Entrance", slug: "residential-school-entrance" },
    { name: "SC Scholarships",             slug: "sc-scholarships" }
  ];

  for (const cat of categoriesToSeed) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug }
    });
  }
  console.log("✅ Categories seeded successfully");

  // Seed Courses
  console.log("Seeding courses...");

  const coursesToSeed = [
    {
      title: "NMMS Exam Complete Preparation 2025-26",
      slug: "nmms-exam-complete-preparation",
      priceCents: 49900,
      currency: "INR",
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      language: "Hindi",
      description: `राष्ट्रीय आय सह मेधा छात्रवृत्ति परीक्षा (NMMS) की सम्पूर्ण तैयारी। Class 8 के छात्रों के लिए। Select होने पर Class 9–12 तक ₹12,000 प्रति वर्ष की Government Scholarship। सभी राज्यों के Pattern को cover करता है।

इस course में शामिल है:
• MAT — Analogy, Classification, Numerical Series, Pattern, Hidden Figures
• SAT — Science, Mathematics, Social Science (Class 7 & 8 NCERT)
• Bihar, UP, MP, Rajasthan, Maharashtra NMMS Previous Year Papers
• Full Mock Tests & Model Papers
• Shrvan Kumar Sagar Sir द्वारा Live Classes`,
      metadata: {
        isFeatured: true,
        level: "BEGINNER",
        language: "Hindi",
        targetAudience: "Class 8 students of government schools — all states of India",
        requirements: ["Class 7 pass with 55% marks (50% for SC/ST)", "Family income below ₹3.5 lakh/year", "Government or government-aided school student"],
        outcomes: ["NMMS Scholarship ₹12,000/year (Class 9-12)", "MAT & SAT complete mastery", "Previous year paper practice"],
        tags: ["NMMS", "Scholarship", "Class 8", "All India", "MAT", "SAT", "Megha Chhatravriti"],
      }
    },
    {
      title: "Navodaya Vidyalaya Entrance (JNVST) Class 6",
      slug: "navodaya-vidyalaya-class-6-jnvst",
      priceCents: 49900,
      currency: "INR",
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      language: "Hindi",
      description: `Jawahar Navodaya Vidyalaya Selection Test (JNVST) Class 6 की सम्पूर्ण तैयारी। Select होने पर Class 6–12 तक Free Residential Education — Board, Lodging, Uniform, Books सब Free। All India level exam।

इस course में शामिल है:
• Mental Ability Test (40 Questions, 50 Marks)
• Arithmetic Test (20 Questions, 25 Marks)
• Language Test (20 Questions, 25 Marks)
• All India JNVST Previous Year Papers
• Mock Tests & Model Papers
• Shrvan Kumar Sagar Sir द्वारा Live Classes`,
      metadata: {
        isFeatured: true,
        level: "BEGINNER",
        language: "Hindi",
        targetAudience: "Class 5 students — all states of India",
        requirements: ["Currently studying in Class 5", "Government or recognised school student"],
        outcomes: ["Free residential education Class 6-12", "CBSE curriculum at zero cost", "All India exposure & migration policy"],
        tags: ["Navodaya", "JNVST", "Class 6", "All India", "Free Education", "Residential School"],
      }
    },
    {
      title: "Sainik School & Simultala Awasiya Entrance",
      slug: "sainik-school-simultala-entrance",
      priceCents: 49900,
      currency: "INR",
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      language: "Hindi",
      description: `Sainik School Entrance Exam (AISSEE) और Simultala Awasiya Vidyalaya Entrance की तैयारी। Sainik School एक All India level NTA conducted exam है।

इस course में शामिल है:
• Mathematics — Number System, Algebra, Geometry
• General Knowledge & Current Affairs
• Language — Hindi & English
• Intelligence Test
• Simultala Bihar Board Entrance Pattern
• AISSEE Previous Year Papers & Mock Tests`,
      metadata: {
        isFeatured: false,
        level: "BEGINNER",
        language: "Hindi",
        targetAudience: "Class 5-6 students — all states of India",
        requirements: ["Currently in Class 5 or 6"],
        outcomes: ["Sainik School admission", "Military school quality education", "Foundation for NDA career"],
        tags: ["Sainik School", "AISSEE", "Simultala", "Class 5", "Class 6", "All India"],
      }
    },
    {
      title: "Shrestha NETS & CMMSS Scholarship Preparation",
      slug: "shrestha-nets-cmmss-scholarship",
      priceCents: 49900,
      currency: "INR",
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      language: "Hindi",
      description: `Shrestha NETS (SC students के लिए Top CBSE Residential Schools में Full Scholarship) और CMMSS Exam की तैयारी।

Shrestha NETS:
• SC Community के Class 8 और Class 10 के छात्रों के लिए
• Select होने पर Top Private CBSE Schools में Full Scholarship (Fees + Hostel Free)
• All India level exam

CMMSS Exam:
• Class 8 के छात्रों के लिए ₹12,000/year Scholarship

इस course में शामिल है:
• MAT & SAT Complete Preparation
• Shrestha NETS Previous Papers
• CMMSS Model Papers
• Shrvan Kumar Sagar Sir द्वारा Live Classes`,
      metadata: {
        isFeatured: false,
        level: "BEGINNER",
        language: "Hindi",
        targetAudience: "SC Category Class 8 and Class 10 students — all states",
        requirements: ["SC Category student", "Class 8 or Class 10"],
        outcomes: ["Full scholarship in top CBSE school", "Free hostel + tuition fees", "Quality residential education"],
        tags: ["Shrestha NETS", "CMMSS", "SC Scholarship", "Class 8", "Class 10", "All India"],
      }
    }
  ];

  for (const course of coursesToSeed) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        title: course.title,
        description: course.description,
        priceCents: course.priceCents,
        currency: course.currency,
        level: course.level,
        status: course.status,
        language: course.language,
        metadata: course.metadata,
      },
      create: {
        title: course.title,
        slug: course.slug,
        description: course.description,
        priceCents: course.priceCents,
        currency: course.currency,
        level: course.level,
        status: course.status,
        language: course.language,
        metadata: course.metadata,
      },
    });
  }

  console.log("✅ 4 Courses seeded successfully");

  // Seed store products
  console.log("Seeding store products...");
  
  const bookProduct = {
    title: "BIHAR NMMSE — Bihar Exam Book 2026",
    slug: "bihar-nmmse-exam-book-2026",
    description: `Bihar NMMS Scholarship Exam की सबसे Best Book। Shrvan Kumar Sagar Sir द्वारा co-authored।

📚 Book Details:
• Publisher: Raghav Prakashan
• Authors: Shrvan Kumar Sagar, Vinod Kumar, Ajay Kumar
• Pages: 350 | ISBN: 9789360136772
• Language: Hindi | Edition: 2025

📖 इस Book में क्या है:
• MAT (Mental Ability Test) — Complete Chapter-wise Theory
• SAT — Science, Mathematics, Social Science (NCERT Based)
• Bihar NMMS Previous Year Solved Papers (5+ years)
• 1000+ Practice Questions with Solutions
• 5 Full Model Test Papers`,
    priceCents: 39500, // ₹395
    originalPriceCents: 50000, // ₹500
    currency: "INR",
    productType: ProductType.PHYSICAL,
    status: ProductStatus.ACTIVE,
    stockQuantity: 100,
    shippingRequired: true,
    metadata: {
      isFeatured: true,
      isActive: true,
      weight: 400,
      tags: ["NMMS Book", "Bihar", "Class 8", "Scholarship", "Study Material", "Hindi Medium"],
    }
  };

  await prisma.product.upsert({
    where: { slug: bookProduct.slug },
    update: {
      title: bookProduct.title,
      description: bookProduct.description,
      priceCents: bookProduct.priceCents,
      originalPriceCents: bookProduct.originalPriceCents,
      currency: bookProduct.currency,
      productType: bookProduct.productType,
      status: bookProduct.status,
      stockQuantity: bookProduct.stockQuantity,
      shippingRequired: bookProduct.shippingRequired,
      metadata: bookProduct.metadata,
    },
    create: {
      title: bookProduct.title,
      slug: bookProduct.slug,
      description: bookProduct.description,
      priceCents: bookProduct.priceCents,
      originalPriceCents: bookProduct.originalPriceCents,
      currency: bookProduct.currency,
      productType: bookProduct.productType,
      status: bookProduct.status,
      stockQuantity: bookProduct.stockQuantity,
      shippingRequired: bookProduct.shippingRequired,
      metadata: bookProduct.metadata,
    },
  });

  console.log("✅ Store products seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
