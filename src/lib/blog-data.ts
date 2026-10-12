export interface BlogPost {
  slug: string;
  title: string;
  hindiTitle: string;
  excerpt: string;
  category: string;
  tags: string[];
  year: string;
  state: string;
  examName: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  pdfUrl: string;
  pdfFileName: string;
  pdfPages: number;
  pdfSize: string;
  overview: { label: string; value: string }[];
  pattern: {
    paper: string;
    subjects: string;
    questions: number;
    marks: number;
    duration: string;
  }[];
  contentSections: {
    heading: string;
    subheading?: string;
    paragraphs: string[];
    bulletPoints?: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  metaKeywords: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "bihar-nmms-2024-question-paper-answer-key-pdf",
    title: "Bihar NMMS 2024 Question Paper with Answer Key PDF Download (MAT + SAT)",
    hindiTitle: "बिहार NMMS 2024 ओरिजिनल प्रश्न पत्र और ऑफिशियल आंसर की PDF",
    excerpt:
      "बिहार राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2024) का ओरिजिनल प्रश्न पत्र और आंसर की PDF डाउनलोड करें। MAT और SAT दोनों पेपर्स का संपूर्ण विश्लेषण सागर सर द्वारा।",
    category: "Previous Year Papers",
    tags: ["Bihar NMMS", "NMMS 2024", "Answer Key", "MAT", "SAT", "Sagar Coaching Centre"],
    year: "2024",
    state: "Bihar",
    examName: "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2024)",
    author: "श्रवण कुमार 'सागर' (Sagar Sir)",
    authorRole: "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    publishedAt: "2024-01-22",
    updatedAt: "2026-10-12",
    readTime: "5 min read",
    pdfUrl: "https://pub-4be7eebfa4c74e57885efd8680e4d52e.r2.dev/pyq/bihar-nmms-2024-question-paper-answer-key.pdf",
    pdfFileName: "Bihar NMMS 2024 Question Paper with Answer Key.pdf",
    pdfPages: 49,
    pdfSize: "8.26 MB",
    overview: [
      { label: "परीक्षा का नाम", value: "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2024)" },
      { label: "आयोजक संस्था", value: "SCERT बिहार (राज्य शिक्षा शोध एवं प्रशिक्षण परिषद्, पटना)" },
      { label: "पात्रता कक्षा", value: "कक्षा 8वीं (सरकारी / सहायता प्राप्त विद्यालयों के छात्र)" },
      { label: "कुल प्रश्न / पूर्णांक", value: "180 प्रश्न (180 अंक) — 90 MAT + 90 SAT" },
      { label: "परीक्षा का माध्यम", value: "द्विभाषी (हिंदी एवं अंग्रेजी)" },
      { label: "नकारात्मक अंकन (Negative Marking)", value: "कोई नेगेटिव मार्किंग नहीं (No Negative Marking)" },
      { label: "छात्रवृत्ति राशि", value: "₹12,000 प्रति वर्ष (कक्षा 9वीं से 12वीं तक कुल ₹48,000)" },
    ],
    pattern: [
      {
        paper: "भाग - I: मानसिक योग्यता परीक्षा (MAT)",
        subjects: "रीजनिंग, कोडिंग-डिकोडिंग, श्रेणी (Series), सादृश्यता, वेन आरेख, दिशा परीक्षण",
        questions: 90,
        marks: 90,
        duration: "90 मिनट (सामान्य) / 120 मिनट (नेत्रहीन/दिव्यांग)",
      },
      {
        paper: "भाग - II: शैक्षिक योग्यता परीक्षा (SAT)",
        subjects: "विज्ञान (35), सामाजिक विज्ञान (35), गणित (20) — कक्षा 7 व 8 का NCERT/SCERT पाठ्यक्रम",
        questions: 90,
        marks: 90,
        duration: "90 मिनट (सामान्य) / 120 मिनट (नेत्रहीन/दिव्यांग)",
      },
    ],
    contentSections: [
      {
        heading: "बिहार NMMS 2024 परीक्षा का विस्तृत विश्लेषण",
        subheading: "पेपर का स्तर और पूछे गए प्रश्नों की रूपरेखा",
        paragraphs: [
          "बिहार राज्य शिक्षा शोध एवं प्रशिक्षण परिषद् (SCERT पटना) द्वारा आयोजित राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा 2024 में राज्य भर के हजारों मेधावी छात्रों ने भाग लिया। इस परीक्षा का उद्देश्य आर्थिक रूप से कमजोर एवं प्रतिभाशाली विद्यार्थियों को आगे की पढ़ाई जारी रखने हेतु प्रतिवर्ष ₹12,000 की छात्रवृत्ति प्रदान करना है।",
          "2024 के प्रश्न पत्र का समग्र स्तर 'मध्यम से संतुलित' रहा। MAT (मानसिक योग्यता) में लॉजिकल रीजनिंग और सीरीज के प्रश्न आसान से मध्यम स्तर के थे, जबकि SAT (शैक्षिक योग्यता) में विज्ञान और गणित के कुछ प्रश्नों में NCERT/SCERT कक्षा 7 और 8 की गहरी समझ की आवश्यकता थी।",
        ],
        bulletPoints: [
          "MAT में एनालॉजी, क्लासिफिकेशन, नंबर सीरीज, और अल्फाबेट टेस्ट से 40+ प्रश्न सीधे पूछे गए।",
          "विज्ञान खंड (35 अंक) में भौतिकी, रसायन और जीवविज्ञान के बुनियादी सिद्धांतों पर आधारित व्यवहारिक प्रश्न आए।",
          "सामाजिक विज्ञान (35 अंक) में इतिहास (स्वतंत्रता संग्राम), भूगोल और नागरिक शास्त्र के तथ्य-आधारित प्रश्न थे।",
          "गणित (20 अंक) में परिमेय संख्याएँ, ज्यामिति, गुणनखंड और समीकरणों से संबंधित प्रश्न शामिल थे।",
        ],
      },
      {
        heading: "NMMS 2024 प्रश्न पत्र हल करने का सही तरीका",
        subheading: "सागर सर द्वारा सुझाए गए महत्वपूर्ण तैयारी सूत्र",
        paragraphs: [
          "पिछले वर्षों के प्रश्न पत्रों (PYQ) को हल करना NMMS परीक्षा में सफलता की पहली और सबसे मजबूत सीढ़ी है। इससे छात्र न केवल परीक्षा के पैटर्न और समय प्रबंधन (Time Management) को समझ पाते हैं, बल्कि बार-बार दोहराए जाने वाले महत्वपूर्ण टॉपिक्स की भी पहचान कर पाते हैं।",
          "हमने इस PDF को विशेष रूप से छात्रों की सुविधा के लिए पूरी तरह साफ और पठनीय बनाया है। इसके साथ ही प्रत्येक प्रश्न की प्रामाणिक उत्तर कुंजी (Official Answer Key) भी सम्मिलित की गई है ताकि आप अपनी तैयारी का सटीक स्व-मूल्यांकन (Self-Assessment) कर सकें।",
        ],
        bulletPoints: [
          "प्रश्न पत्र को हल करते समय स्टॉपवॉच का उपयोग करें और 90 मिनट में 90 प्रश्न हल करने का अभ्यास करें।",
          "नेगेटिव मार्किंग नहीं होने के कारण किसी भी प्रश्न को खाली न छोड़ें।",
          "गलत हुए प्रश्नों के कॉन्सेप्ट को तुरंत अपनी रिवीजन नोटबुक में नोट करें।",
        ],
      },
    ],
    faqs: [
      {
        question: "बिहार NMMS परीक्षा में पास होने के लिए कितने अंक चाहिए?",
        answer:
          "सामान्य (General) और OBC वर्ग के छात्रों को दोनों पेपर्स (MAT + SAT) में मिलाकर न्यूनतम 40% अंक प्राप्त करने होते हैं। अनुसूचित जाति (SC), अनुसूचित जनजाति (ST) एवं दिव्यांग (PH) छात्रों के लिए न्यूनतम कट-ऑफ 32% है। हालांकि मेरिट लिस्ट में आने के लिए 120-130+ का सुरक्षित स्कोर आवश्यक माना जाता है।",
      },
      {
        question: "क्या बिहार NMMS परीक्षा में नेगेटिव मार्किंग (ऋणात्मक अंकन) होती है?",
        answer: "नहीं, NMMS परीक्षा में कोई नेगेटिव मार्किंग नहीं होती है। प्रत्येक सही उत्तर पर 1 अंक मिलता है।",
      },
      {
        question: "NMMS छात्रवृत्ति के तहत कुल कितने रुपये मिलते हैं?",
        answer:
          "चयनित छात्रों को कक्षा 9वीं से 12वीं तक 4 वर्षों के दौरान ₹1,000 प्रति माह के हिसाब से कुल ₹12,000 प्रति वर्ष (कुल ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) दिए जाते हैं।",
      },
      {
        question: "इस प्रश्न पत्र की आंसर की कहाँ से चेक कर सकते हैं?",
        answer:
          "डाउनलोड की गई PDF के अंत में SCERT द्वारा जारी आधिकारिक आंसर की जोड़ी गई है, जिससे आप अपने उत्तरों की जांच कर सकते हैं।",
      },
    ],
    metaKeywords: [
      "Bihar NMMS 2024 Question Paper PDF",
      "NMMS Bihar 2024 Answer Key PDF Download",
      "Bihar NMMS Previous Year Papers",
      "SCERT Bihar NMMS 2024 Paper Solved",
      "NMMS MAT SAT Question Paper 2024",
      "Sagar Coaching Centre Bhagwanpur NMMS",
      "Shrvan Kumar Sagar NMMS King",
      "Bihar National Means cum Merit Scholarship 2024",
    ],
  },
  {
    slug: "bihar-nmms-2023-question-paper-answer-key-pdf",
    title: "Bihar NMMS 2023 Question Paper with Answer Key PDF Download (MAT + SAT)",
    hindiTitle: "बिहार NMMS 2023 ओरिजिनल प्रश्न पत्र और ऑफिशियल आंसर की PDF",
    excerpt:
      "बिहार राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा 2023 का पूरा प्रश्न पत्र उत्तर कुंजी सहित PDF में निःशुल्क डाउनलोड करें। मानसिक एवं शैक्षिक योग्यता परीक्षा की तैयारी के लिए सबसे उपयोगी पेपर।",
    category: "Previous Year Papers",
    tags: ["Bihar NMMS", "NMMS 2023", "Answer Key", "MAT", "SAT", "Sagar Coaching Centre"],
    year: "2023",
    state: "Bihar",
    examName: "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2023)",
    author: "श्रवण कुमार 'सागर' (Sagar Sir)",
    authorRole: "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    publishedAt: "2023-01-25",
    updatedAt: "2026-10-12",
    readTime: "5 min read",
    pdfUrl: "https://pub-4be7eebfa4c74e57885efd8680e4d52e.r2.dev/pyq/bihar-nmms-2023-question-paper-answer-key.pdf",
    pdfFileName: "Bihar NMMS 2023 Question Paper with Answer Key.pdf",
    pdfPages: 51,
    pdfSize: "7.41 MB",
    overview: [
      { label: "परीक्षा का नाम", value: "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2023)" },
      { label: "आयोजक संस्था", value: "SCERT बिहार, पटना" },
      { label: "पात्रता", value: "कक्षा 8वीं के नियमित छात्र (राजकीय विद्यालय)" },
      { label: "कुल प्रश्न", value: "180 प्रश्न (MAT 90 + SAT 90)" },
      { label: "पूर्णांक", value: "180 अंक" },
      { label: "परीक्षा अवधि", value: "3 घंटे (180 मिनट)" },
      { label: "छात्रवृत्ति", value: "₹48,000 कुल (4 वर्षों में)" },
    ],
    pattern: [
      {
        paper: "भाग - I: MAT (मानसिक योग्यता)",
        subjects: "रीजनिंग, संख्या श्रेणी, रक्त संबंध, दिशा ज्ञान, जल एवं दर्पण प्रतिबिंब",
        questions: 90,
        marks: 90,
        duration: "90 मिनट",
      },
      {
        paper: "भाग - II: SAT (शैक्षिक योग्यता)",
        subjects: "विज्ञान (35 अंक) + सामाजिक विज्ञान (35 अंक) + गणित (20 अंक)",
        questions: 90,
        marks: 90,
        duration: "90 मिनट",
      },
    ],
    contentSections: [
      {
        heading: "बिहार NMMS 2023 प्रश्न पत्र का मुख्य आकर्षण",
        subheading: "परीक्षा में पूछे गए विषयों का विस्तृत ब्योरा",
        paragraphs: [
          "2023 की NMMS परीक्षा में गणित और विज्ञान के प्रश्नों का स्तर काफी स्तरीय था। सामान्य विज्ञान में दैनिक जीवन में विज्ञान के अनुप्रयोग, प्रकाश, ध्वनि, कोशिका, अम्ल-क्षार और धातु-अधातु जैसे अध्यायों से सीधे प्रश्न पूछे गए थे।",
          "सामाजिक अध्ययन खंड में भारतीय संविधान, मौलिक अधिकार, संसद, भारत का भूगोल और आधुनिक भारत के इतिहास से महत्वपूर्ण प्रश्न आए थे। इस प्रश्न पत्र को हल करने से छात्रों का आत्मविश्वास कई गुना बढ़ जाता है।",
        ],
        bulletPoints: [
          "कुल 50 पेज का विस्तृत ओरिजिनल प्रश्न पत्र उपलब्ध है।",
          "आधिकारिक उत्तर कुंजी के साथ स्व-जांच की पूरी सुविधा।",
          "सारे प्रश्न स्पष्ट, उच्च गुणवत्ता और वॉटरमार्क-मुक्त फॉर्मेट में हैं।",
        ],
      },
      {
        heading: "NMMS परीक्षा में 140+ अंक लाने की स्मार्ट रणनीति",
        subheading: "सागर सर के विशेष अनुभव और टिप्स",
        paragraphs: [
          "NMMS परीक्षा केवल ज्ञान की नहीं, बल्कि समय प्रबंधन और एकाग्रता की परीक्षा है। MAT के 90 प्रश्नों में से कम से कम 75+ प्रश्न सही करना बेहद आसान होता है अगर आपने कोडिंग-डिकोडिंग, सादृश्यता और सीरीज का पर्याप्त अभ्यास किया हो।",
          "SAT खंड के लिए कक्षा 7 और 8 की सरकारी स्कूल की किताबों (विज्ञान और सामाजिक विज्ञान) का गहराई से अध्ययन करें। प्रतिदिन कम से कम 1 पिछला प्रश्न पत्र टाइमर लगाकर हल करें।",
        ],
      },
    ],
    faqs: [
      {
        question: "क्या 2023 का यह पेपर आगामी NMMS परीक्षा के लिए उपयोगी है?",
        answer:
          "हाँ, बिल्कुल! NMMS परीक्षा का सिलेबस और एग्जाम पैटर्न हमेशा समान रहता है। पिछले 5 वर्षों के पेपर हल करने से लगभग 30-40% कॉन्सेप्ट्स सीधे रिपीट होते हैं।",
      },
      {
        question: "NMMS परीक्षा का फॉर्म कौन भर सकता है?",
        answer:
          "सरकारी या सरकारी सहायता प्राप्त विद्यालय में कक्षा 8 में अध्ययनरत वे छात्र जिनके परिवार की वार्षिक आय ₹3.5 लाख से कम है और जिन्होंने कक्षा 7 में न्यूनतम 55% अंक (SC/ST के लिए 50%) प्राप्त किए हों, वे इस परीक्षा के पात्र हैं।",
      },
    ],
    metaKeywords: [
      "Bihar NMMS 2023 Question Paper PDF Download",
      "NMMS Bihar 2023 Answer Key PDF",
      "Bihar NMMS 2023 Solved Paper",
      "SCERT Bihar NMMS Old Papers",
      "MAT SAT Question Paper NMMS Bihar",
      "Sagar Coaching Centre Study Material",
    ],
  },
  {
    slug: "bihar-nmms-2019-question-paper-answer-key-pdf",
    title: "Bihar NMMS 2019 Question Paper with Answer Key PDF Download (MAT + SAT)",
    hindiTitle: "बिहार NMMS 2019 ओरिजिनल प्रश्न पत्र और ऑफिशियल आंसर की PDF",
    excerpt:
      "बिहार राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा 2019 का प्रामाणिक प्रश्न पत्र और आधिकारिक उत्तर कुंजी डाउनलोड करें। कक्षा 8 के छात्रों के लिए उत्कृष्ट अभ्यास सामग्री।",
    category: "Previous Year Papers",
    tags: ["Bihar NMMS", "NMMS 2019", "Answer Key", "MAT", "SAT", "Sagar Coaching Centre"],
    year: "2019",
    state: "Bihar",
    examName: "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2019)",
    author: "श्रवण कुमार 'सागर' (Sagar Sir)",
    authorRole: "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    publishedAt: "2019-11-20",
    updatedAt: "2026-10-12",
    readTime: "4 min read",
    pdfUrl: "https://pub-4be7eebfa4c74e57885efd8680e4d52e.r2.dev/pyq/bihar-nmms-2019-question-paper-answer-key.pdf",
    pdfFileName: "Bihar NMMS 2019 Question Paper with Answer Key.pdf",
    pdfPages: 42,
    pdfSize: "13.12 MB",
    overview: [
      { label: "परीक्षा का नाम", value: "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2019)" },
      { label: "परीक्षा राज्य", value: "बिहार (Bihar State Level)" },
      { label: "कुल प्रश्न", value: "180 बहुविकल्पीय प्रश्न (MCQ)" },
      { label: "अंक", value: "180 अंक" },
      { label: "उत्तर कुंजी", value: "आधिकारिक आंसर की संलग्न है (Page 41-42)" },
      { label: "सुविधा", value: "HD डिजिटल ओरिजिनल वेक्टर फॉर्मेट" },
    ],
    pattern: [
      {
        paper: "मानसिक योग्यता परीक्षा (Mental Ability Test - MAT)",
        subjects: "रीजनिंग, सादृश्यता, वर्गीकरण, संख्या पैटर्न, लुप्त पद",
        questions: 90,
        marks: 90,
        duration: "90 मिनट",
      },
      {
        paper: "शैक्षिक योग्यता परीक्षा (Scholastic Ability Test - SAT)",
        subjects: "विज्ञान (35), सामाजिक विज्ञान (35), गणित (20)",
        questions: 90,
        marks: 90,
        duration: "90 मिनट",
      },
    ],
    contentSections: [
      {
        heading: "2019 NMMS प्रश्न पत्र का महत्व",
        subheading: "फाउंडेशन मजबूत करने के लिए आदर्श पेपर",
        paragraphs: [
          "2019 का NMMS प्रश्न पत्र बेसिक कॉन्सेप्ट्स को परखने के लिए सबसे बेहतरीन पेपर्स में से एक माना जाता है। इसमें बेसिक गणित जैसे लाभ-हानि, प्रतिशत, साधारण ब्याज और रेखागणित के बहुत ही सटीक प्रश्न पूछे गए थे।",
          "इस पेपर को हल करने से कमजोर छात्रों को भी यह समझने में आसानी होती है कि प्रश्न किस प्रकार के आते हैं और कैसे कम समय में सटीक उत्तर तक पहुंचा जाता है।",
        ],
      },
    ],
    faqs: [
      {
        question: "क्या 2019 की उत्तर कुंजी (Answer Key) इस PDF में है?",
        answer: "हाँ, इस PDF के पृष्ठ 42 पर SCERT द्वारा जारी मूल आंसर-की तालिका दी गई है।",
      },
      {
        question: "इस PDF को मोबाइल में कैसे खोलें?",
        answer:
          "आप नीचे दिए गए 'डाउनलोड PDF' बटन पर क्लिक करके इसे सीधे अपने फोन में सेव कर सकते हैं और किसी भी PDF Reader ऐप या Google Drive में खोल सकते हैं।",
      },
    ],
    metaKeywords: [
      "Bihar NMMS 2019 Question Paper PDF",
      "NMMS Bihar 2019 Official Answer Key",
      "Old NMMS Question Papers Bihar",
      "Bihar Scholarship Exam PYQ",
      "Sagar Sir NMMS King Bhagwanpur",
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
