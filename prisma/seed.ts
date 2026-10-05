import dns from "node:dns";
import { PrismaClient, UserRole, CourseLevel, CourseStatus, ProductType, ProductStatus } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("Seeding admin account...");

  const email = "admin@sagarcoaching.tech";
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

  // Unpublish / hide any courses (as requested: no courses right now, only book for sale)
  console.log("Setting any existing courses to DRAFT...");
  await prisma.course.updateMany({
    data: {
      status: CourseStatus.DRAFT,
    },
  });
  console.log("✅ All courses set to DRAFT (hidden from public store & catalog)");

  // Seed store products
  console.log("Seeding official NMMS 2027-28 Guide Book...");

  // Archive any old placeholder product slugs
  await prisma.product.updateMany({
    where: {
      slug: { not: "bihar-nmms-exam-book-2027-28" }
    },
    data: {
      status: ProductStatus.ARCHIVED
    }
  });

  const nmmsBookProduct = {
    title: "Bihar NMMS Exam Book 2027-28 — राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (तृतीय संशोधित संस्करण)",
    slug: "bihar-nmms-exam-book-2027-28",
    shortDescription: "बिहार राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) एवं मॉडल स्कूल प्रवेश परीक्षा 2027-28 के लिए सम्पूर्ण गाइड बुक। MAT एवं SAT का सम्पूर्ण पाठ्यक्रम, 2021-2026 के 6 वर्षों के हल प्रश्न पत्र।",
    description: `राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा 2027-28 (Bihar NMMS Exam & Model School Exam) की सबसे सम्पूर्ण एवं प्रामाणिक गाइड बुक। 

कक्षा 8 में अध्ययनरत् विद्यार्थियों के लिए विशेष रूप से तैयार की गई यह पुस्तक परीक्षा में शत-प्रतिशत सफलता दिलाने में सहायक है। इस पुस्तक में नवीनतम पाठ्यक्रम के आधार पर मानसिक योग्यता (MAT) और शैक्षिक अभिरुचि (SAT) के सभी विषयों का विस्तृत विवरण दिया गया है।

📚 पुस्तक की मुख्य विशेषताएँ (Key Highlights):
• नवीनतम पाठ्यक्रम पर आधारित राज्य स्तरीय (बिहार व अन्य राज्य) अध्ययन सामग्री
• भाग 1: मानसिक योग्यता परीक्षण (MAT) — सादृश्यता, वर्गीकरण, संख्या व अक्षर श्रृंखला, कोडिंग-डिकोडिंग, वेन आरेख, रक्त संबंध, दिशा ज्ञान एवं अशाब्दिक तर्कशक्ति (Non-Verbal Reasoning)
• भाग 2: शैक्षिक अभिरुचि परीक्षण (SAT) — विज्ञान (भौतिकी, रसायन, जीव विज्ञान), गणित, सामाजिक विज्ञान (इतिहास, भूगोल, नागरिक शास्त्र) — NCERT कक्षा 7 एवं 8 पर आधारित
• 2021, 2022, 2023, 2024, 2025, 2026 (6 वर्षों) के सम्पूर्ण हल प्रश्न पत्र (Solved Previous Years Papers)
• 1000+ अभ्यास प्रश्न विस्तृत व्याख्या एवं शॉर्टकट ट्रिक्स सहित
• 5 फुल लेंथ मॉडल प्रैक्टिस टेस्ट पेपर्स

📖 पुस्तक विवरण (Book Specifications):
• प्रकाशक (Publisher): राघव प्रकाशन (Raghav Prakashan) / सागर कोचिंग सेंटर
• लेखक (Authors): श्रवण कुमार सागर (Shrvan Kumar Sagar), विनोद कुमार (Vinod Kumar), अजय कुमार (Ajay Kumar)
• संस्करण (Edition): तृतीय संशोधित संस्करण 2027-28 (3rd Revised Edition)
• भाषा (Language): हिंदी (Hindi Medium)
• लक्षित वर्ग (Target Group): कक्षा 8 के विद्यार्थी (Class 8 Students)
• डिलीवरी (Delivery): पूरे भारत में सुरक्षित होम डिलीवरी (Fast Home Delivery Across India)`,
    priceCents: 35000, // ₹350
    originalPriceCents: 49900, // ₹499 (MRP)
    currency: "INR",
    productType: ProductType.PHYSICAL,
    status: ProductStatus.ACTIVE,
    stockQuantity: 500,
    shippingRequired: true,
    coverImageUrl: "/images/products/bihar-nmms-guide-book-2027-28.webp",
    metadata: {
      isFeatured: true,
      isActive: true,
      edition: "3rd Revised Edition 2027-28",
      publisher: "Raghav Prakashan",
      authors: ["Shrvan Kumar Sagar", "Vinod Kumar", "Ajay Kumar"],
      language: "Hindi",
      targetExam: "NMMS Scholarship Exam & Model School Entrance",
      targetClass: "Class 8",
      weightGrams: 450,
      tags: [
        "NMMS Book",
        "Bihar NMMS 2027-28",
        "Rashtriya Aay Sah Medha Chhatravriti",
        "Shrvan Kumar Sagar",
        "MAT SAT Solved Papers",
        "NMMS Guide Book",
        "Class 8 Scholarship Book",
        "Raghav Prakashan"
      ],
      features: [
        "MAT & SAT Complete NCERT Syllabus",
        "2021-2026 6 Years Solved Papers",
        "1000+ Practice MCQs with Step-by-Step Solutions",
        "Special Shortcuts & Tricks by Sagar Sir",
        "Fast Home Delivery Across All States"
      ]
    }
  };

  await prisma.product.upsert({
    where: { slug: nmmsBookProduct.slug },
    update: {
      title: nmmsBookProduct.title,
      description: nmmsBookProduct.description,
      shortDescription: nmmsBookProduct.shortDescription,
      priceCents: nmmsBookProduct.priceCents,
      originalPriceCents: nmmsBookProduct.originalPriceCents,
      currency: nmmsBookProduct.currency,
      productType: nmmsBookProduct.productType,
      status: nmmsBookProduct.status,
      stockQuantity: nmmsBookProduct.stockQuantity,
      shippingRequired: nmmsBookProduct.shippingRequired,
      coverImageUrl: nmmsBookProduct.coverImageUrl,
      metadata: nmmsBookProduct.metadata,
    },
    create: {
      title: nmmsBookProduct.title,
      slug: nmmsBookProduct.slug,
      description: nmmsBookProduct.description,
      shortDescription: nmmsBookProduct.shortDescription,
      priceCents: nmmsBookProduct.priceCents,
      originalPriceCents: nmmsBookProduct.originalPriceCents,
      currency: nmmsBookProduct.currency,
      productType: nmmsBookProduct.productType,
      status: nmmsBookProduct.status,
      stockQuantity: nmmsBookProduct.stockQuantity,
      shippingRequired: nmmsBookProduct.shippingRequired,
      coverImageUrl: nmmsBookProduct.coverImageUrl,
      metadata: nmmsBookProduct.metadata,
    },
  });

  console.log("✅ Official NMMS Book (₹350, WebP) seeded successfully as active product");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
