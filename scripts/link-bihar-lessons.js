const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const biharCourse = await prisma.course.findUnique({
    where: { slug: 'bihar-nmms-scholarship-test-series' },
    include: {
      sections: true,
      tests: true,
    }
  });

  if (!biharCourse) {
    console.error('Bihar course not found');
    return;
  }

  console.log('Found Bihar course:', biharCourse.title);

  for (const test of biharCourse.tests) {
    if (!test.sectionId) {
      console.warn(`Test ${test.title} has no sectionId, skipping`);
      continue;
    }

    // Check if lesson already exists
    const existing = await prisma.lesson.findFirst({
      where: {
        sectionId: test.sectionId,
        slug: test.slug,
      }
    });

    const isPartA = test.slug.includes('mat');
    const orderIndex = isPartA ? 0 : 1;

    const data = {
      sectionId: test.sectionId,
      title: test.title,
      slug: test.slug,
      description: test.description || `${test.title} - संपूर्ण 90 वस्तुनिष्ठ प्रश्न, हल एवं रैंकिंग।`,
      orderIndex: orderIndex,
      contentType: 'QUIZ',
      thumbnailUrl: '/images/courses/bihar-nmms-mock-test-series.webp',
      isPreview: true,
      isPublished: true,
      metadata: {
        testId: test.id,
        accessType: 'FREE',
        sessionType: 'RECORDED'
      }
    };

    if (existing) {
      console.log(`Updating existing lesson for test: ${test.title}`);
      await prisma.lesson.update({
        where: { id: existing.id },
        data
      });
    } else {
      console.log(`Creating lesson for test: ${test.title}`);
      await prisma.lesson.create({
        data
      });
    }
  }

  console.log('Successfully linked all Bihar tests as lessons!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
