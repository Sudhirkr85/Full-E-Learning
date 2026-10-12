const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function scan() {
  const questions = await prisma.question.findMany({
    where: {
      OR: [
        { prompt: { contains: '$' } },
        { explanation: { contains: '$' } },
        { options: { some: { label: { contains: '$' } } } }
      ]
    },
    include: {
      test: { select: { title: true, slug: true } },
      options: true
    }
  });

  console.log('Total questions with dollar sign:', questions.length);
  
  const results = [];
  for (const q of questions) {
    const dollarOpts = q.options.filter(o => o.label.includes('$'));
    results.push({
      id: q.id,
      test: q.test.title,
      prompt: q.prompt,
      hasInPrompt: q.prompt.includes('$'),
      hasInExplanation: q.explanation ? q.explanation.includes('$') : false,
      dollarOpts: dollarOpts.map(o => ({ id: o.id, label: o.label }))
    });
  }

  // Print first 20 examples to inspect
  for (let i = 0; i < Math.min(20, results.length); i++) {
    const r = results[i];
    console.log(`\n[#${i + 1}] Test: ${r.test}`);
    console.log(`Prompt: ${r.prompt}`);
    if (r.dollarOpts.length > 0) {
      console.log(`Dollar options:`, r.dollarOpts.map(o => o.label).join(' | '));
    }
  }

  console.log('\n--- Summary by Test ---');
  const countsByTest = {};
  for (const r of results) {
    countsByTest[r.test] = (countsByTest[r.test] || 0) + 1;
  }
  console.log(countsByTest);
}

scan()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
