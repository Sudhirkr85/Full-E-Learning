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

  // Seed Courses
  console.log("Seeding courses...");

  const coursesToSeed = [
    {
      title: "NMMS Exam Complete Preparation 2025-26",
      slug: "nmms-exam-complete-preparation",
      description: `राष्ट्रीय आय सह मेधा छात्रवृत्ति परीक्षा (NMMS) की सम्पूर्ण तैयारी। Class 8 के छात्रों के लिए MAT (Mental Ability Test) और SAT (Scholastic Aptitude Test) दोनों papers की विस्तृत तैयारी। Select होने पर Class 9–12 तक ₹12,000 प्रति वर्ष की Government Scholarship।

  इस course में शामिल है:
  • MAT — Analogy, Classification, Numerical Series, Pattern, Hidden Figures
  • SAT — Science, Mathematics, Social Science (Class 7 & 8 syllabus)
  • Bihar NMMS Previous Year Question Papers
  • Mock Tests & Model Papers
  • Shrvan Kumar Sagar Sir द्वारा Live Classes`,
      priceCents: 49900, // ₹499
      currency: "INR",
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      language: "Hindi",
      metadata: {
        isFeatured: true,
        originalPrice: 999, // ₹999 original
        targetAudience: "Class 8 Students of Bihar Government Schools",
        requirements: ["Class 7 pass with 55% marks", "Family income below ₹3.5 lakh/year", "Government school student"],
        outcomes: ["NMMS Scholarship ₹12,000/year", "Class 9-12 financial support", "MAT & SAT mastery"],
        tags: ["NMMS", "Scholarship", "Class 8", "Bihar", "MAT", "SAT", "Megha Chhatravriti"],
      }
    },
    {
      title: "Navodaya Vidyalaya Entrance Exam (JNVST) Class 6",
      slug: "navodaya-vidyalaya-class-6-preparation",
      description: `Jawahar Navodaya Vidyalaya Selection Test (JNVST) Class 6 की सम्पूर्ण तैयारी। Class 5 के छात्रों के लिए। Select होने पर Class 6–12 तक Free Residential Education (Board, Lodging, Uniform, Books सब Free)।

  इस course में शामिल है:
  • Mental Ability Test (40 Questions, 50 Marks)
  • Arithmetic Test (20 Questions, 25 Marks)
  • Language Test (20 Questions, 25 Marks)
  • Previous Year Question Papers
  • Mock Tests
  • Shrvan Kumar Sagar Sir द्वारा Live Classes`,
      priceCents: 49900,
      currency: "INR",
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      language: "Hindi",
      metadata: {
        isFeatured: true,
        originalPrice: 999,
        targetAudience: "Class 5 Students preparing for JNV Class 6 Entrance",
        requirements: ["Currently studying in Class 5", "Government/recognized school student"],
        outcomes: ["Free residential education Class 6-12", "CBSE curriculum", "All India exposure"],
        tags: ["Navodaya", "JNVST", "Class 6", "Bihar", "Residential School", "Free Education"],
      }
    },
    {
      title: "Sainik School & Simultala Awasiya Vidyalaya Entrance",
      slug: "sainik-school-simultala-entrance",
      description: `Sainik School Entrance Exam और Simultala Awasiya Vidyalaya Entrance की तैयारी। Class 5 और Class 8 के छात्रों के लिए। 

  इस course में शामिल है:
  • Mathematics — Number System, Algebra, Geometry
  • General Knowledge & Current Affairs
  • Language (Hindi & English)
  • Intelligence Test
  • Simultala Bihar Board Entrance Pattern
  • Previous Year Papers & Mock Tests`,
      priceCents: 49900,
      currency: "INR",
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      language: "Hindi",
      metadata: {
        isFeatured: false,
        originalPrice: 999,
        targetAudience: "Class 5-6 students of Bihar",
        requirements: ["Currently in Class 5 or Class 6"],
        outcomes: ["Sainik School admission", "Military school education", "Career in defence"],
        tags: ["Sainik School", "Simultala", "Bihar", "Class 5", "Class 6", "Defence"],
      }
    },
    {
      title: "Shrestha NETS & CMMSS Scholarship Exam Preparation",
      slug: "shrestha-nets-cmmss-scholarship",
      description: `Shrestha NETS (SC Students के लिए Top CBSE Residential Schools में Full Scholarship) और CMMSS Exam की तैयारी।

  Shrestha NETS:
  • SC Community के Class 8 और Class 10 के छात्रों के लिए
  • Select होने पर Top Private CBSE Schools में Full Scholarship (Fees + Hostel)
  
  CMMSS Exam:
  • Class 8 के छात्रों के लिए ₹12,000/year Scholarship
  • 5,000 students selected each year

  इस course में शामिल है:
  • MAT & SAT Complete Preparation
  • Shrestha NETS Previous Papers
  • CMMSS Model Papers
  • Live Classes by Shrvan Kumar Sagar Sir`,
      priceCents: 49900,
      currency: "INR",
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      language: "Hindi",
      metadata: {
        isFeatured: false,
        originalPrice: 999,
        targetAudience: "SC Community Class 8 and Class 10 students",
        requirements: ["SC Category student", "Class 8 or Class 10"],
        outcomes: ["Full scholarship in top CBSE school", "Free hostel + fees", "Quality education"],
        tags: ["Shrestha NETS", "CMMSS", "SC Scholarship", "Bihar", "Class 8", "CBSE Residential"],
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
  • Pages: 350
  • Edition: 1st, 2025
  • ISBN: 9789360136772
  • Language: Hindi

  📖 इस Book में क्या है:
  • MAT (Mental Ability Test) — Complete Chapter-wise Theory
  • SAT — Science, Mathematics, Social Science
  • Bihar NMMS Previous Year Solved Papers
  • 1000+ Practice Questions
  • Model Test Papers`,
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
      tags: ["NMMS Book", "Bihar", "Scholarship", "Class 8", "Study Material"],
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
