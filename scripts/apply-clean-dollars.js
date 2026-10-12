const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SUPERSCRIPTS = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  'n': 'ⁿ', 'i': 'ⁱ'
};

const SUBSCRIPTS = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  'a': 'ₐ', 'e': 'ₑ', 'o': 'ₒ', 'x': 'ₓ'
};

function toSuper(str) {
  return str.split('').map(ch => SUPERSCRIPTS[ch] || ch).join('');
}

function toSub(str) {
  return str.split('').map(ch => SUBSCRIPTS[ch] || ch).join('');
}

function cleanLatexMath(text) {
  if (!text || typeof text !== 'string') return text;

  let s = text;

  // 1. Degrees
  s = s.replace(/\^\{\\circ\}|\^\\circ/g, '°');

  // 2. Text wrappers: \text{...} or \mathrm{...}
  s = s.replace(/\\(text|mathrm)\{([^{}]+)\}/g, '$2');

  // 3. Parentheses wrappers: \left( \right) etc.
  s = s.replace(/\\left\(/g, '(');
  s = s.replace(/\\right\)/g, ')');
  s = s.replace(/\\left\[/g, '[');
  s = s.replace(/\\right\]/g, ']');
  s = s.replace(/\\left|\\right/g, '');

  // 4. Arrows & Relations
  s = s.replace(/\\xrightarrow\{([^{}]+)\}/g, '―($1)→');
  s = s.replace(/\\xrightarrow\b/g, '→');
  s = s.replace(/\\leftrightarrow\b/g, '↔');
  s = s.replace(/\\implies\b/g, '⇒');
  s = s.replace(/\\to\b|\\rightarrow\b/g, '→');

  // 5. Greek & common math symbols
  s = s.replace(/\\times/g, '×');
  s = s.replace(/\\div/g, '÷');
  s = s.replace(/\\cdot/g, '·');
  s = s.replace(/\\pm/g, '±');
  s = s.replace(/\\le(q)?\b/g, '≤');
  s = s.replace(/\\ge(q)?\b/g, '≥');
  s = s.replace(/\\ne(q)?\b/g, '≠');
  s = s.replace(/\\approx\b/g, '≈');
  s = s.replace(/\\pi\b/g, 'π');
  s = s.replace(/\\theta\b/g, 'θ');
  s = s.replace(/\\lambda\b/g, 'λ');
  s = s.replace(/\\mu\b/g, 'μ');
  s = s.replace(/\\delta\b/g, 'δ');
  s = s.replace(/\\(triangle|Delta)\b/g, '△');
  s = s.replace(/\\angle\b/g, '∠');
  s = s.replace(/\\(dots|ldots)\b/g, '...');
  s = s.replace(/\\%/g, '%');
  s = s.replace(/\\sin\b/g, 'sin');
  s = s.replace(/\\cos\b/g, 'cos');

  // 6. Square roots: \sqrt{...} (do inner to outer)
  for (let iter = 0; iter < 4; iter++) {
    s = s.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');
  }
  s = s.replace(/\\sqrt\b/g, '√');

  // 7. Superscripts: ^{...} or ^digit / ^character
  s = s.replace(/\^\{([0-9+\-ni]+)\}/g, (match, p1) => toSuper(p1));
  s = s.replace(/\^([0-9])/g, (match, p1) => toSuper(p1));

  // 8. Subscripts: _{...} or _digit
  s = s.replace(/_\{([0-9+\-a-z]+)\}/g, (match, p1) => toSub(p1));
  s = s.replace(/_([0-9])/g, (match, p1) => toSub(p1));

  // 9. Simplify single digit/number root: √(10) -> √10, √(x) -> √x, √(3) -> √3
  s = s.replace(/√\(([0-9a-zA-Z]+)\)/g, '√$1');

  // 10. Space before frac if adjacent to digits (e.g. 16\frac{2}{3} -> 16 2/3)
  s = s.replace(/(\d+)\\frac\{/g, '$1 \\frac{');

  // 11. Fractions: \frac{num}{den} (now inner roots/powers already resolved)
  for (let iter = 0; iter < 4; iter++) {
    s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (match, num, den) => {
      const cleanNum = (/[+\-]/.test(num) && !num.startsWith('(')) ? `(${num})` : num;
      const cleanDen = (/[+\-]/.test(den) && !den.startsWith('(')) ? `(${den})` : den;
      return `${cleanNum}/${cleanDen}`;
    });
  }

  // 12. Remove $$ and $ math delimiters
  s = s.replace(/\$\$([^\$]+)\$\$/g, '$1');
  s = s.replace(/\$([^\$]+)\$/g, '$1');

  // Strip any remaining lone $
  s = s.replace(/\$/g, '');

  // 13. Clean up non-newline whitespace only, preserve \n
  s = s.replace(/[^\S\r\n]+/g, ' ');
  // Clean empty lines down to max 2 newlines
  s = s.replace(/\n\s*\n\s*\n+/g, '\n\n');
  s = s.trim();

  return s;
}

async function applyClean() {
  const SKIP_ID = '612c7a36-840f-45d6-9508-be1b5e8422ce';

  const questions = await prisma.question.findMany({
    where: {
      id: { not: SKIP_ID },
      OR: [
        { prompt: { contains: '$' } },
        { explanation: { contains: '$' } },
        { options: { some: { label: { contains: '$' } } } }
      ]
    },
    include: { options: true }
  });

  console.log(`Starting update for ${questions.length} questions...`);

  let updatedQuestions = 0;
  let updatedOptions = 0;

  for (const q of questions) {
    const updateData = {};
    if (q.prompt.includes('$')) {
      updateData.prompt = cleanLatexMath(q.prompt);
    }
    if (q.explanation && q.explanation.includes('$')) {
      updateData.explanation = cleanLatexMath(q.explanation);
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.question.update({
        where: { id: q.id },
        data: updateData
      });
      updatedQuestions++;
    }

    for (const opt of q.options) {
      if (opt.label.includes('$')) {
        const cleanLabel = cleanLatexMath(opt.label);
        await prisma.option.update({
          where: { id: opt.id },
          data: { label: cleanLabel }
        });
        updatedOptions++;
      }
    }
  }

  console.log(`Successfully updated ${updatedQuestions} questions and ${updatedOptions} options!`);
}

applyClean()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
