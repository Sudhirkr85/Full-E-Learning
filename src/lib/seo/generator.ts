export interface State {
  slug: string;
  name: string;
  nameHi: string;
}

export interface Exam {
  slug: string;
  name: string;
  nameHi: string;
}

export interface Material {
  slug: string;
  name: string;
  nameHi: string;
}

export interface Topic {
  slug: string;
  name: string;
  nameHi: string;
  category: string;
}

export const STATES: State[] = [
  { slug: "bihar", name: "Bihar", nameHi: "बिहार" },
  { slug: "uttar-pradesh", name: "Uttar Pradesh", nameHi: "उत्तर प्रदेश" },
  { slug: "madhya-pradesh", name: "Madhya Pradesh", nameHi: "मध्य प्रदेश" },
  { slug: "rajasthan", name: "Rajasthan", nameHi: "राजस्थान" },
  { slug: "maharashtra", name: "Maharashtra", nameHi: "महाराष्ट्र" },
  { slug: "jharkhand", name: "Jharkhand", nameHi: "झारखंड" },
  { slug: "haryana", name: "Haryana", nameHi: "हरियाणा" },
  { slug: "delhi", name: "Delhi", nameHi: "दिल्ली" },
  { slug: "chhattisgarh", name: "Chhattisgarh", nameHi: "छत्तीसगढ़" },
  { slug: "uttarakhand", name: "Uttarakhand", nameHi: "उत्तराखंड" }
];

export const EXAMS: Exam[] = [
  { slug: "nmms-scholarship", name: "NMMS Scholarship Exam", nameHi: "राष्ट्रीय आय सह मेधा छात्रवृत्ति परीक्षा" },
  { slug: "jnvst-navodaya", name: "JNVST Navodaya Vidyalaya Entrance", nameHi: "जवाहर नवोदय विद्यालय प्रवेश परीक्षा" },
  { slug: "sainik-school-aissee", name: "Sainik School AISSEE Entrance", nameHi: "सैनिक स्कूल प्रवेश परीक्षा" },
  { slug: "simultala-entrance", name: "Simultala Awasiya Entrance", nameHi: "सिमुलतला आवासीय विद्यालय प्रवेश परीक्षा" },
  { slug: "shrestha-nets", name: "Shrestha NETS Scholarship", nameHi: "श्रेष्ठ योजना परीक्षा" },
  { slug: "cmmss-exam", name: "CMMSS Scholarship Exam", nameHi: "मुख्यमंत्री मेधा छात्रवृत्ति परीक्षा" },
  { slug: "ntse-scholarship", name: "NTSE Scholarship Exam", nameHi: "राष्ट्रीय प्रतिभा खोज परीक्षा" },
  { slug: "olympiad-exam", name: "School Olympiad Exams", nameHi: "स्कूल ओलंपियाड परीक्षा" },
  { slug: "class-6-entrance", name: "Class 6 Entrance Exam", nameHi: "कक्षा 6 प्रवेश परीक्षा" },
  { slug: "class-8-scholarship", name: "Class 8 Scholarship Exam", nameHi: "कक्षा 8 छात्रवृत्ति परीक्षा" }
];

export const MATERIALS: Material[] = [
  { slug: "previous-year-question-paper", name: "Previous Year Question Paper", nameHi: "पिछले वर्ष के प्रश्न पत्र" },
  { slug: "syllabus", name: "Exam Syllabus & Chapter Weightage", nameHi: "सिलेबस और महत्वपूर्ण टॉपिक्स" },
  { slug: "study-notes", name: "Chapter Study Notes & Summary", nameHi: "अध्ययन नोट्स और सारांश" },
  { slug: "mock-test-series", name: "Online Mock Test Series", nameHi: "ऑनलाइन मॉक टेस्ट" },
  { slug: "online-coaching-classes", name: "Online Coaching Classes & Live Batch", nameHi: "ऑनलाइन कोचिंग क्लास" },
  { slug: "important-questions", name: "Most Important Questions & Answers", nameHi: "महत्वपूर्ण प्रश्नोत्तरी" },
  { slug: "sample-model-papers", name: "Sample Model Question Papers", nameHi: "मॉडल प्रश्न पत्र" },
  { slug: "solved-answer-key", name: "Solved Answer Key & Explanations", nameHi: "सॉल्व्ड उत्तर कुंजी" },
  { slug: "chapter-wise-solutions", name: "NCERT Chapter-wise Solutions", nameHi: "अध्याय-वार समाधान" },
  { slug: "free-pdf-download", name: "Free Study Material PDF Download", nameHi: "फ्री पीडीएफ डाउनलोड" },
  { slug: "practice-sets", name: "Daily Practice Sets & Worksheets", nameHi: "प्रैक्टिस सेट" },
  { slug: "video-lectures-course", name: "Video Lectures & Animated Classes", nameHi: "वीडियो लेक्चर्स" },
  { slug: "preparation-books", name: "Recommended Preparation Books", nameHi: "बेस्ट बुक्स" },
  { slug: "admission-form-details", name: "Admission Form & Registration Details", nameHi: "प्रवेश परीक्षा फॉर्म" },
  { slug: "eligibility-criteria", name: "Eligibility Criteria & Age Limits", nameHi: "योग्यता और आयु सीमा" },
  { slug: "cut-off-marks", name: "Expected Cut-off Marks & Merit List", nameHi: "कट-ऑफ मार्क्स" },
  { slug: "exam-date-notifications", name: "Exam Date Sheets & Notifications", nameHi: "परीक्षा तिथि" },
  { slug: "result-announcement", name: "Exam Results & Selected Merit List", nameHi: "परीक्षा परिणाम" },
  { slug: "admit-card-download", name: "Admit Card Download & Centre Info", nameHi: "एडमिट कार्ड डाउनलोड" },
  { slug: "study-plan-tips", name: "30 Days Study Plan & Topper Tips", nameHi: "तैयारी की रणनीति" },
  { slug: "mental-ability-mat-test", name: "Mental Ability Test (MAT) Solved Papers", nameHi: "मैट परीक्षा तैयारी" },
  { slug: "scholastic-aptitude-sat-test", name: "Scholastic Aptitude Test (SAT) Prep", nameHi: "सैट परीक्षा तैयारी" },
  { slug: "ncert-solutions", name: "Class 6-8 NCERT Solutions & Books", nameHi: "एनसीईआरटी सॉल्यूशंस" },
  { slug: "mcq-quiz-practice", name: "Chapter-wise MCQ Quiz Test Online", nameHi: "एमसीक्यू क्विज टेस्ट" },
  { slug: "live-class-schedule", name: "Live Doubt Classes & Schedule", nameHi: "लाइव क्लास शेड्यूल" },
  { slug: "question-bank", name: "Topic-wise Question Bank & Solutions", nameHi: "प्रश्नों का संग्रह" },
  { slug: "crash-course", name: "Short Term Crash Course & Revision", nameHi: "क्रैश कोर्स" },
  { slug: "solved-examples", name: "Solved Examples & Explanations", nameHi: "हल किए गए उदाहरण" },
  { slug: "formulas-cheat-sheet", name: "Important Formulas & Cheat Sheet", nameHi: "महत्वपूर्ण सूत्र" },
  { slug: "revision-notes", name: "Quick Revision Notes & Mind Maps", nameHi: "क्विक रिवीजन नोट्स" }
];

const BASE_TOPICS = [
  // Math (40 Topics)
  { slug: "number-system", name: "Number System", nameHi: "संख्या पद्धति", category: "Mathematics" },
  { slug: "rational-numbers", name: "Rational Numbers", nameHi: "परिमेय संख्याएँ", category: "Mathematics" },
  { slug: "linear-equations", name: "Linear Equations in One Variable", nameHi: "एक चर वाले रैखिक समीकरण", category: "Mathematics" },
  { slug: "understanding-quadrilaterals", name: "Understanding Quadrilaterals", nameHi: "चतुर्भुजों को समझना", category: "Mathematics" },
  { slug: "practical-geometry", name: "Practical Geometry", nameHi: "प्रायोगिक ज्यामिति", category: "Mathematics" },
  { slug: "data-handling", name: "Data Handling", nameHi: "आँकड़ों का प्रबंधन", category: "Mathematics" },
  { slug: "squares-and-square-roots", name: "Squares and Square Roots", nameHi: "वर्ग और वर्गमूल", category: "Mathematics" },
  { slug: "cubes-and-cube-roots", name: "Cubes and Cube Roots", nameHi: "घन और घनमूल", category: "Mathematics" },
  { slug: "comparing-quantities", name: "Comparing Quantities", nameHi: "राशियों की तुलना", category: "Mathematics" },
  { slug: "algebraic-expressions", name: "Algebraic Expressions", nameHi: "बीजीय व्यंजक और सर्वसमिकाएँ", category: "Mathematics" },
  { slug: "visualising-solid-shapes", name: "Visualising Solid Shapes", nameHi: "ठोस आकारों का चित्रण", category: "Mathematics" },
  { slug: "mensuration", name: "Mensuration", nameHi: "क्षेत्रमिति", category: "Mathematics" },
  { slug: "exponents-and-powers", name: "Exponents and Powers", nameHi: "घातांक और घात", category: "Mathematics" },
  { slug: "direct-and-inverse-proportions", name: "Direct and Inverse Proportions", nameHi: "सीधा और प्रतिलोम समानुपात", category: "Mathematics" },
  { slug: "factorisation", name: "Factorisation", nameHi: "गुणनखंडन", category: "Mathematics" },
  { slug: "introduction-to-graphs", name: "Introduction to Graphs", nameHi: "आलेखों से परिचय", category: "Mathematics" },
  { slug: "playing-with-numbers", name: "Playing with Numbers", nameHi: "संख्याओं के साथ खेलना", category: "Mathematics" },
  { slug: "fractions-and-decimals", name: "Fractions and Decimals", nameHi: "भिन्न एवं दशमलव", category: "Mathematics" },
  { slug: "integers", name: "Integers", nameHi: "पूर्णांक", category: "Mathematics" },
  { slug: "simple-interest", name: "Simple Interest", nameHi: "साधारण ब्याज", category: "Mathematics" },
  { slug: "compound-interest", name: "Compound Interest", nameHi: "चक्रवृद्धि ब्याज", category: "Mathematics" },
  { slug: "profit-and-loss", name: "Profit and Loss", nameHi: "लाभ और हानि", category: "Mathematics" },
  { slug: "percentage", name: "Percentage", nameHi: "प्रतिशत", category: "Mathematics" },
  { slug: "ratio-and-proportion", name: "Ratio and Proportion", nameHi: "अनुपात और समानुपात", category: "Mathematics" },
  { slug: "time-and-work", name: "Time and Work", nameHi: "समय और कार्य", category: "Mathematics" },
  { slug: "time-speed-and-distance", name: "Speed, Distance and Time", nameHi: "चाल, दूरी और समय", category: "Mathematics" },
  { slug: "average", name: "Average", nameHi: "औसत", category: "Mathematics" },
  { slug: "hcf-and-lcm", name: "HCF and LCM", nameHi: "महत्तम समापवर्तक और लघुत्तम समापवर्त्य", category: "Mathematics" },
  { slug: "lines-and-angles", name: "Lines and Angles", nameHi: "रेखाएँ और कोण", category: "Mathematics" },
  { slug: "triangles-and-properties", name: "Triangles and their Properties", nameHi: "त्रिभुज और उसके गुण", category: "Mathematics" },
  { slug: "congruence-of-triangles", name: "Congruence of Triangles", nameHi: "त्रिभुजों की सर्वांगसमता", category: "Mathematics" },
  { slug: "perimeter-and-area", name: "Perimeter and Area", nameHi: "परिमाप और क्षेत्रफल", category: "Mathematics" },
  { slug: "symmetry", name: "Symmetry", nameHi: "सममिति", category: "Mathematics" },
  { slug: "bodmas-rule", name: "BODMAS Rule & Simplification", nameHi: "सरलीकरण", category: "Mathematics" },
  { slug: "probability", name: "Probability", nameHi: "प्रायिकता", category: "Mathematics" },
  { slug: "surface-area-and-volume", name: "Surface Area and Volume", nameHi: "पृष्ठीय क्षेत्रफल और आयतन", category: "Mathematics" },
  { slug: "number-series", name: "Number Series", nameHi: "संख्या श्रृंखला", category: "Mathematics" },
  { slug: "unitary-method", name: "Unitary Method", nameHi: "ऐकिक नियम", category: "Mathematics" },
  { slug: "decimal-fractions", name: "Decimal Fractions", nameHi: "दशमलव भिन्न", category: "Mathematics" },
  { slug: "square-root-tricks", name: "Square Root Tricks", nameHi: "वर्गमूल निकालने की ट्रिक", category: "Mathematics" },

  // Science (30 Topics)
  { slug: "crop-production", name: "Crop Production and Management", nameHi: "फसल उत्पादन एवं प्रबंध", category: "Science" },
  { slug: "microorganisms", name: "Microorganisms: Friend and Foe", nameHi: "सूक्ष्मजीव: मित्र एवं शत्रु", category: "Science" },
  { slug: "synthetic-fibres", name: "Synthetic Fibres and Plastics", nameHi: "संश्लेषित रेशे और प्लास्टिक", category: "Science" },
  { slug: "metals-and-non-metals", name: "Materials: Metals and Non-Metals", nameHi: "पदार्थ: धातु और अधातु", category: "Science" },
  { slug: "coal-and-petroleum", name: "Coal and Petroleum", nameHi: "कोयला और पेट्रोलियम", category: "Science" },
  { slug: "combustion-and-flame", name: "Combustion and Flame", nameHi: "दहन और ज्वाला", category: "Science" },
  { slug: "conservation-plants-animals", name: "Conservation of Plants and Animals", nameHi: "पौधों एवं जंतुओं का संरक्षण", category: "Science" },
  { slug: "cell-structure-function", name: "Cell - Structure and Functions", nameHi: "कोशिका - संरचना एवं प्रकार्य", category: "Science" },
  { slug: "reproduction-in-animals", name: "Reproduction in Animals", nameHi: "जंतुओं में जनन", category: "Science" },
  { slug: "reaching-adolescence", name: "Reaching the Age of Adolescence", nameHi: "किशोरावस्था की ओर", category: "Science" },
  { slug: "force-and-pressure", name: "Force and Pressure", nameHi: "बल तथा दाब", category: "Science" },
  { slug: "friction", name: "Friction", nameHi: "घर्षण", category: "Science" },
  { slug: "sound", name: "Sound", nameHi: "ध्वनि", category: "Science" },
  { slug: "chemical-effects-current", name: "Chemical Effects of Electric Current", nameHi: "विद्युत धारा के रासायनिक प्रभाव", category: "Science" },
  { slug: "natural-phenomena", name: "Some Natural Phenomena", nameHi: "कुछ प्राकृतिक परिघटनाएँ", category: "Science" },
  { slug: "light", name: "Light", nameHi: "प्रकाश", category: "Science" },
  { slug: "stars-solar-system", name: "Stars and the Solar System", nameHi: "तारे एवं सौर परिवार", category: "Science" },
  { slug: "pollution-air-water", name: "Pollution of Air and Water", nameHi: "वायु तथा जल का प्रदूषण", category: "Science" },
  { slug: "heat", name: "Heat", nameHi: "ऊष्मा", category: "Science" },
  { slug: "acids-bases-salts", name: "Acids, Bases and Salts", nameHi: "अम्ल, क्षारक और लवण", category: "Science" },
  { slug: "physical-chemical-changes", name: "Physical and Chemical Changes", nameHi: "भौतिक एवं रासायनिक परिवर्तन", category: "Science" },
  { slug: "weather-climate", name: "Weather and Climate", nameHi: "मौसम, जलवायु तथा अनुकूलन", category: "Science" },
  { slug: "winds-storms-cyclones", name: "Winds, Storms and Cyclones", nameHi: "पवन, तूफान और चक्रवात", category: "Science" },
  { slug: "soil", name: "Soil", nameHi: "मृदा", category: "Science" },
  { slug: "respiration-in-organisms", name: "Respiration in Organisms", nameHi: "जीवों में श्वसन", category: "Science" },
  { slug: "transportation-animals-plants", name: "Transportation in Animals and Plants", nameHi: "जंतुओं और पादपों में परिवहन", category: "Science" },
  { slug: "reproduction-in-plants", name: "Reproduction in Plants", nameHi: "पादप में जनन", category: "Science" },
  { slug: "motion-and-time", name: "Motion and Time", nameHi: "गति एवं समय", category: "Science" },
  { slug: "electric-current-effects", name: "Electric Current and its Effects", nameHi: "विद्युत धारा और इसके प्रभाव", category: "Science" },
  { slug: "wastewater-story", name: "Wastewater Story", nameHi: "अपशिष्ट जल की कहानी", category: "Science" },

  // Social Science (20 Topics)
  { slug: "how-when-and-where", name: "How, When and Where", nameHi: "कब, कहाँ और कैसे", category: "Social Science" },
  { slug: "trade-to-territory", name: "From Trade to Territory", nameHi: "व्यापार से साम्राज्य तक", category: "Social Science" },
  { slug: "ruling-the-countryside", name: "Ruling the Countryside", nameHi: "ग्रामीण क्षेत्र पर शासन चलाना", category: "Social Science" },
  { slug: "tribals-dikus-golden-age", name: "Tribals, Dikus and Golden Age", nameHi: "आदिवासी, दीकु और एक स्वर्ण युग", category: "Social Science" },
  { slug: "rebel-1857", name: "When People Rebel: 1857", nameHi: "जब जनता बगावत करती है: 1857", category: "Social Science" },
  { slug: "colonialism-and-the-city", name: "Colonialism and the City", nameHi: "उपनिवेशवाद और शहर", category: "Social Science" },
  { slug: "weavers-iron-smelters", name: "Weavers, Iron Smelters and Factory Owners", nameHi: "बुनकर, लोहा पिघलाने वाले और फैक्ट्री मालिक", category: "Social Science" },
  { slug: "civilising-the-native", name: "Civilising the Native, Educating the Nation", nameHi: "देशी जनता को सभ्य बनाना, राष्ट्र को शिक्षित करना", category: "Social Science" },
  { slug: "women-caste-reform", name: "Women, Caste and Reform", nameHi: "महिलाएँ, जाति एवं सुधार", category: "Social Science" },
  { slug: "national-movement-1870-1947", name: "The Making of the National Movement", nameHi: "राष्ट्रीय आंदोलन का संघटन: 1870 के दशक से 1947", category: "Social Science" },
  { slug: "india-after-independence", name: "India After Independence", nameHi: "स्वतंत्रता के बाद का भारत", category: "Social Science" },
  { slug: "types-of-resources", name: "Resources and Types", nameHi: "संसाधन एवं उसके प्रकार", category: "Social Science" },
  { slug: "land-soil-water-resources", name: "Land, Soil, Water Resources", nameHi: "भूमि, मृदा, जल, प्राकृतिक वनस्पति और वन्य जीवन", category: "Social Science" },
  { slug: "mineral-power-resources", name: "Mineral and Power Resources", nameHi: "खनिज और शक्ति संसाधन", category: "Social Science" },
  { slug: "agriculture-types", name: "Agriculture and Farming Types", nameHi: "कृषि", category: "Social Science" },
  { slug: "major-industries", name: "Industries", nameHi: "उद्योग", category: "Social Science" },
  { slug: "human-resources", name: "Human Resources", nameHi: "मानव संसाधन", category: "Social Science" },
  { slug: "indian-constitution", name: "The Indian Constitution", nameHi: "भारतीय संविधान", category: "Social Science" },
  { slug: "secularism-understanding", name: "Understanding Secularism", nameHi: "धर्मनिरपेक्षता की समझ", category: "Social Science" },
  { slug: "parliament-need", name: "Why Do We Need a Parliament?", nameHi: "हमें संसद क्यों चाहिए?", category: "Social Science" },

  // Reasoning & English/Hindi Grammar / General Knowledge (10 Topics)
  { slug: "analogy-reasoning", name: "Analogy Reasoning", nameHi: "सादृश्यता", category: "Reasoning" },
  { slug: "classification-reasoning", name: "Classification Reasoning", nameHi: "वर्गीकरण", category: "Reasoning" },
  { slug: "coding-decoding", name: "Coding-Decoding", nameHi: "कोडिंग-डिकोडिंग", category: "Reasoning" },
  { slug: "blood-relations", name: "Blood Relations", nameHi: "रक्त संबंध", category: "Reasoning" },
  { slug: "direction-sense-test", name: "Direction Sense Test", nameHi: "दिशा ज्ञान परीक्षण", category: "Reasoning" },
  { slug: "nouns-english", name: "Nouns and Types", nameHi: "संज्ञा और उसके भेद", category: "English Grammar" },
  { slug: "verbs-tenses", name: "Verbs and Tenses", nameHi: "क्रिया और काल", category: "English Grammar" },
  { slug: "sangya-hindi", name: "संज्ञा और उसके भेद", nameHi: "Noun in Hindi (संज्ञा)", category: "Hindi Grammar" },
  { slug: "sandhi-hindi", name: "संधि और संधि विच्छेद", nameHi: "Sandhi in Hindi (संधि)", category: "Hindi Grammar" },
  { slug: "indian-history-gk", name: "Indian History GK", nameHi: "भारतीय इतिहास सामान्य ज्ञान", category: "General Knowledge" }
];

// Generate exactly 400 topics dynamically from 100 base topics * 4 variations
export const TOPICS: Topic[] = [];

BASE_TOPICS.forEach((base) => {
  // Variation 1: Standard Topic
  TOPICS.push({
    slug: base.slug,
    name: base.name,
    nameHi: base.nameHi,
    category: base.category
  });

  // Variation 2: Important Questions
  TOPICS.push({
    slug: `${base.slug}-important-questions`,
    name: `${base.name} Important Questions`,
    nameHi: `${base.nameHi} महत्वपूर्ण प्रश्नोत्तर`,
    category: base.category
  });

  // Variation 3: Solved Mock Test
  TOPICS.push({
    slug: `${base.slug}-solved-mock-test`,
    name: `${base.name} Solved Mock Test`,
    nameHi: `${base.nameHi} सॉल्व्ड मॉक टेस्ट`,
    category: base.category
  });

  // Variation 4: Syllabus & Notes
  TOPICS.push({
    slug: `${base.slug}-syllabus-notes`,
    name: `${base.name} Syllabus & Notes`,
    nameHi: `${base.nameHi} सिलेबस और नोट्स`,
    category: base.category
  });
});

/**
 * Returns structured metadata for a programmatic SEO slug in O(1) time
 */
export function getTopicBySlug(slug: string): {
  state: State;
  exam: Exam;
  topic: Topic;
  material: Material;
  index: number;
} | null {
  // Check that slug fits the minimum pattern
  if (!slug) return null;

  // Let's identify the State from the beginning of the slug (longest match first)
  let foundState: State | null = null;
  const sortedStates = [...STATES].sort((a, b) => b.slug.length - a.slug.length);
  for (const s of sortedStates) {
    if (slug.startsWith(`${s.slug}-`)) {
      foundState = s;
      break;
    }
  }
  if (!foundState) return null;

  // Let's identify the Material from the end of the slug
  let foundMaterial: Material | null = null;
  const sortedMaterials = [...MATERIALS].sort((a, b) => b.slug.length - a.slug.length);
  for (const m of sortedMaterials) {
    if (slug.endsWith(`-${m.slug}`)) {
      foundMaterial = m;
      break;
    }
  }
  if (!foundMaterial) return null;

  // Now, strip State prefix and Material suffix to extract the exam + topic content
  const middle = slug.slice(foundState.slug.length + 1, slug.length - foundMaterial.slug.length - 1);

  // Now identify the Exam from the beginning of the middle string
  let foundExam: Exam | null = null;
  const sortedExams = [...EXAMS].sort((a, b) => b.slug.length - a.slug.length);
  for (const e of sortedExams) {
    if (middle.startsWith(`${e.slug}-`)) {
      foundExam = e;
      break;
    }
  }
  if (!foundExam) return null;

  // The remaining portion of the middle string is the Topic slug
  const topicSlug = middle.slice(foundExam.slug.length + 1);
  const foundTopic = TOPICS.find((t) => t.slug === topicSlug);
  if (!foundTopic) return null;

  // Re-calculate the original index of this combination
  const stateIdx = STATES.indexOf(foundState);
  const examIdx = EXAMS.indexOf(foundExam);
  const topicIdx = TOPICS.indexOf(foundTopic);
  const materialIdx = MATERIALS.indexOf(foundMaterial);

  // Index formula
  const index = stateIdx + (10 * examIdx) + (100 * topicIdx) + (40000 * materialIdx);

  return {
    state: foundState,
    exam: foundExam,
    topic: foundTopic,
    material: foundMaterial,
    index
  };
}

/**
 * Returns dynamic SEO data for a specific index from 0 to 119,999
 */
export function getKeywordByIndex(i: number): {
  slug: string;
  state: State;
  exam: Exam;
  topic: Topic;
  material: Material;
} {
  const stateIdx = i % 10;
  const examIdx = Math.floor(i / 10) % 10;
  const topicIdx = Math.floor(i / 100) % 400;
  const materialIdx = Math.floor(i / 40000) % 30;

  const state = STATES[stateIdx]!;
  const exam = EXAMS[examIdx]!;
  const topic = TOPICS[topicIdx]!;
  const material = MATERIALS[materialIdx]!;

  const slug = `${state.slug}-${exam.slug}-${topic.slug}-${material.slug}`;

  return {
    slug,
    state,
    exam,
    topic,
    material
  };
}

/**
 * Generates semantic related links (e.g. 15 other topic landing pages) deterministically
 */
export function getRelatedSlugs(currentIndex: number, count = 15): string[] {
  const related: string[] = [];
  
  const stateIdx = currentIndex % 10;
  const examIdx = Math.floor(currentIndex / 10) % 10;
  const topicIdx = Math.floor(currentIndex / 100) % 400;
  const materialIdx = Math.floor(currentIndex / 40000) % 30;

  // 1. Same topic, same exam, different states (5 links)
  for (let s = 1; s <= 5; s++) {
    const nextStateIdx = (stateIdx + s) % 10;
    const nextIdx = nextStateIdx + (10 * examIdx) + (100 * topicIdx) + (40000 * materialIdx);
    related.push(getKeywordByIndex(nextIdx).slug);
  }

  // 2. Same state, same exam, different topics (5 links)
  for (let t = 1; t <= 5; t++) {
    const nextTopicIdx = (topicIdx + t * 7) % 400;
    const nextIdx = stateIdx + (10 * examIdx) + (100 * nextTopicIdx) + (40000 * materialIdx);
    related.push(getKeywordByIndex(nextIdx).slug);
  }

  // 3. Same state, same topic, different materials (5 links)
  for (let m = 1; m <= 5; m++) {
    const nextMaterialIdx = (materialIdx + m * 3) % 30;
    const nextIdx = stateIdx + (10 * examIdx) + (100 * topicIdx) + (40000 * nextMaterialIdx);
    related.push(getKeywordByIndex(nextIdx).slug);
  }

  const currentSlug = getKeywordByIndex(currentIndex).slug;
  return Array.from(new Set(related)).filter(slug => slug !== currentSlug).slice(0, count);
}
