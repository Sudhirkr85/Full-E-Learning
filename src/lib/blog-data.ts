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
  canonicalSlug?: string;
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
  sampleQuestions?: {
    questionNumber: number;
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  metaKeywords: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    "slug": "bihar-nmms-2024-question-paper-answer-key-pdf",
    "title": "Bihar NMMS 2024 Question Paper with Answer Key PDF Download (MAT + SAT)",
    "hindiTitle": "बिहार NMMS 2024 ओरिजिनल प्रश्न पत्र और ऑफिशियल आंसर की PDF",
    "excerpt": "बिहार राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2024) का ओरिजिनल प्रश्न पत्र और आंसर की PDF डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS 2024",
      "Answer Key",
      "MAT",
      "SAT",
      "Sagar Coaching Centre"
    ],
    "year": "2024",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2024)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-22",
    "updatedAt": "2026-10-12",
    "readTime": "5 min read",
    "pdfUrl": "pyq/bihar-nmms-2024-question-paper-answer-key.pdf",
    "pdfFileName": "Bihar NMMS 2024 Question Paper with Answer Key.pdf",
    "pdfPages": 49,
    "pdfSize": "8.26 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2024)"
      },
      {
        "label": "आयोजक संस्था",
        "value": "SCERT बिहार (राज्य शिक्षा शोध एवं प्रशिक्षण परिषद्, पटना)"
      },
      {
        "label": "पात्रता कक्षा",
        "value": "कक्षा 8वीं (सरकारी / सहायता प्राप्त विद्यालयों के छात्र)"
      },
      {
        "label": "कुल प्रश्न / पूर्णांक",
        "value": "180 प्रश्न (180 अंक) — 90 MAT + 90 SAT"
      },
      {
        "label": "परीक्षा का माध्यम",
        "value": "द्विभाषी (हिंदी एवं अंग्रेजी)"
      },
      {
        "label": "नकारात्मक अंकन (Negative Marking)",
        "value": "कोई नेगेटिव मार्किंग नहीं (No Negative Marking)"
      },
      {
        "label": "छात्रवृत्ति राशि",
        "value": "₹12,000 प्रति वर्ष (कक्षा 9वीं से 12वीं तक कुल ₹48,000)"
      }
    ],
    "pattern": [
      {
        "paper": "भाग - I: मानसिक योग्यता परीक्षा (MAT)",
        "subjects": "रीजनिंग, कोडिंग-डिकोडिंग, श्रेणी (Series), सादृश्यता, वेन आरेख, दिशा परीक्षण",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट (सामान्य) / 120 मिनट (नेत्रहीन/दिव्यांग)"
      },
      {
        "paper": "भाग - II: शैक्षिक योग्यता परीक्षा (SAT)",
        "subjects": "विज्ञान (35), सामाजिक विज्ञान (35), गणित (20) — कक्षा 7 व 8 का NCERT/SCERT पाठ्यक्रम",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट (सामान्य) / 120 मिनट (नेत्रहीन/दिव्यांग)"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS 2024 Question Paper with Answer Key PDF Download (MAT + SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) के अंतर्गत राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित इस प्रश्न पत्र का मुख्य उद्देश्य सरकारी एवं राजकीय सहायता प्राप्त विद्यालयों के मेधावी छात्र-छात्राओं को पहचानकर उन्हें आगे की पढ़ाई जारी रखने हेतु प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) की छात्रवृत्ति प्रदान करना है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT अधिकृत पाठ्यक्रम पर आधारित ओरिजिनल प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS 2024 Question Paper PDF",
      "NMMS Bihar 2024 Answer Key PDF Download",
      "Bihar NMMS Previous Year Papers",
      "SCERT Bihar NMMS 2024 Paper Solved",
      "NMMS MAT SAT Question Paper 2024",
      "Sagar Coaching Centre Bhagwanpur NMMS",
      "Shrvan Kumar Sagar NMMS King",
      "Bihar National Means cum Merit Scholarship 2024"
    ]
  },
  {
    "slug": "bihar-nmms-2023-question-paper-answer-key-pdf",
    "title": "Bihar NMMS 2023 Question Paper with Answer Key PDF Download (MAT + SAT)",
    "hindiTitle": "बिहार NMMS 2023 ओरिजिनल प्रश्न पत्र और ऑफिशियल आंसर की PDF",
    "excerpt": "बिहार राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा 2023 का पूरा प्रश्न पत्र उत्तर कुंजी सहित PDF में निःशुल्क डाउनलोड करें। मानसिक एवं शैक्षिक योग्यता परीक्षा की तैयारी के लिए सबसे उपयोगी पेपर।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS 2023",
      "Answer Key",
      "MAT",
      "SAT",
      "Sagar Coaching Centre"
    ],
    "year": "2023",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2023)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2023-01-25",
    "updatedAt": "2026-10-12",
    "readTime": "5 min read",
    "pdfUrl": "pyq/bihar-nmms-2023-question-paper-answer-key.pdf",
    "pdfFileName": "Bihar NMMS 2023 Question Paper with Answer Key.pdf",
    "pdfPages": 51,
    "pdfSize": "7.41 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2023)"
      },
      {
        "label": "आयोजक संस्था",
        "value": "SCERT बिहार, पटना"
      },
      {
        "label": "पात्रता",
        "value": "कक्षा 8वीं के नियमित छात्र (राजकीय विद्यालय)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "180 प्रश्न (MAT 90 + SAT 90)"
      },
      {
        "label": "पूर्णांक",
        "value": "180 अंक"
      },
      {
        "label": "परीक्षा अवधि",
        "value": "3 घंटे (180 मिनट)"
      },
      {
        "label": "छात्रवृत्ति",
        "value": "₹48,000 कुल (4 वर्षों में)"
      }
    ],
    "pattern": [
      {
        "paper": "भाग - I: MAT (मानसिक योग्यता)",
        "subjects": "रीजनिंग, संख्या श्रेणी, रक्त संबंध, दिशा ज्ञान, जल एवं दर्पण प्रतिबिंब",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      },
      {
        "paper": "भाग - II: SAT (शैक्षिक योग्यता)",
        "subjects": "विज्ञान (35 अंक) + सामाजिक विज्ञान (35 अंक) + गणित (20 अंक)",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS 2023 Question Paper with Answer Key PDF Download (MAT + SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) के अंतर्गत राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित इस प्रश्न पत्र का मुख्य उद्देश्य सरकारी एवं राजकीय सहायता प्राप्त विद्यालयों के मेधावी छात्र-छात्राओं को पहचानकर उन्हें आगे की पढ़ाई जारी रखने हेतु प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) की छात्रवृत्ति प्रदान करना है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT अधिकृत पाठ्यक्रम पर आधारित ओरिजिनल प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS 2023 Question Paper PDF Download",
      "NMMS Bihar 2023 Answer Key PDF",
      "Bihar NMMS 2023 Solved Paper",
      "SCERT Bihar NMMS Old Papers",
      "MAT SAT Question Paper NMMS Bihar",
      "Sagar Coaching Centre Study Material"
    ]
  },
  {
    "slug": "bihar-nmms-2019-question-paper-answer-key-pdf",
    "title": "Bihar NMMS 2019 Question Paper with Answer Key PDF Download (MAT + SAT)",
    "hindiTitle": "बिहार NMMS 2019 ओरिजिनल प्रश्न पत्र और ऑफिशियल आंसर की PDF",
    "excerpt": "बिहार राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा 2019 का प्रामाणिक प्रश्न पत्र और आधिकारिक उत्तर कुंजी डाउनलोड करें। कक्षा 8 के छात्रों के लिए उत्कृष्ट अभ्यास सामग्री।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS 2019",
      "Answer Key",
      "MAT",
      "SAT",
      "Sagar Coaching Centre"
    ],
    "year": "2019",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2019)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2019-11-20",
    "updatedAt": "2026-10-12",
    "readTime": "4 min read",
    "pdfUrl": "pyq/bihar-nmms-2019-question-paper-answer-key.pdf",
    "pdfFileName": "Bihar NMMS 2019 Question Paper with Answer Key.pdf",
    "pdfPages": 42,
    "pdfSize": "13.12 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2019)"
      },
      {
        "label": "परीक्षा राज्य",
        "value": "बिहार (Bihar State Level)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "180 बहुविकल्पीय प्रश्न (MCQ)"
      },
      {
        "label": "अंक",
        "value": "180 अंक"
      },
      {
        "label": "उत्तर कुंजी",
        "value": "आधिकारिक आंसर की संलग्न है (Page 41-42)"
      },
      {
        "label": "सुविधा",
        "value": "HD डिजिटल ओरिजिनल वेक्टर फॉर्मेट"
      }
    ],
    "pattern": [
      {
        "paper": "मानसिक योग्यता परीक्षा (Mental Ability Test - MAT)",
        "subjects": "रीजनिंग, सादृश्यता, वर्गीकरण, संख्या पैटर्न, लुप्त पद",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      },
      {
        "paper": "शैक्षिक योग्यता परीक्षा (Scholastic Ability Test - SAT)",
        "subjects": "विज्ञान (35), सामाजिक विज्ञान (35), गणित (20)",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS 2019 Question Paper with Answer Key PDF Download (MAT + SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) के अंतर्गत राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित इस प्रश्न पत्र का मुख्य उद्देश्य सरकारी एवं राजकीय सहायता प्राप्त विद्यालयों के मेधावी छात्र-छात्राओं को पहचानकर उन्हें आगे की पढ़ाई जारी रखने हेतु प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) की छात्रवृत्ति प्रदान करना है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT अधिकृत पाठ्यक्रम पर आधारित ओरिजिनल प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS 2019 Question Paper PDF",
      "NMMS Bihar 2019 Official Answer Key",
      "Old NMMS Question Papers Bihar",
      "Bihar Scholarship Exam PYQ",
      "Sagar Sir NMMS King Bhagwanpur"
    ]
  },
  {
    "slug": "bihar-nmms-2009-mat-8p-sagarsir",
    "title": "Bihar NMMS 2009 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS 2009 ओरिजिनल प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2009) का ओरिजिनल MAT प्रश्न पत्र और हल PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS 2009",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "2009",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2009)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_2009_MAT_8p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_2009_MAT_8p_SagarSir.pdf",
    "pdfPages": 8,
    "pdfSize": "10.21 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "2009"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS 2009 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) के अंतर्गत राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित इस प्रश्न पत्र का मुख्य उद्देश्य सरकारी एवं राजकीय सहायता प्राप्त विद्यालयों के मेधावी छात्र-छात्राओं को पहचानकर उन्हें आगे की पढ़ाई जारी रखने हेतु प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) की छात्रवृत्ति प्रदान करना है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT अधिकृत पाठ्यक्रम पर आधारित ओरिजिनल प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS 2009 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-2010-mat-8p-sagarsir",
    "title": "Bihar NMMS 2010 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS 2010 ओरिजिनल प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2010) का ओरिजिनल MAT प्रश्न पत्र और हल PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS 2010",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "2010",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2010)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_2010_MAT_8p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_2010_MAT_8p_SagarSir.pdf",
    "pdfPages": 8,
    "pdfSize": "8.49 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "2010"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS 2010 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) के अंतर्गत राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित इस प्रश्न पत्र का मुख्य उद्देश्य सरकारी एवं राजकीय सहायता प्राप्त विद्यालयों के मेधावी छात्र-छात्राओं को पहचानकर उन्हें आगे की पढ़ाई जारी रखने हेतु प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) की छात्रवृत्ति प्रदान करना है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT अधिकृत पाठ्यक्रम पर आधारित ओरिजिनल प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS 2010 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-2012-mat-8p-sagarsir",
    "title": "Bihar NMMS 2012 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS 2012 ओरिजिनल प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2012) का ओरिजिनल MAT प्रश्न पत्र और हल PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS 2012",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "2012",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2012)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_2012_MAT_8p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_2012_MAT_8p_SagarSir.pdf",
    "pdfPages": 8,
    "pdfSize": "7.74 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "2012"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS 2012 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) के अंतर्गत राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित इस प्रश्न पत्र का मुख्य उद्देश्य सरकारी एवं राजकीय सहायता प्राप्त विद्यालयों के मेधावी छात्र-छात्राओं को पहचानकर उन्हें आगे की पढ़ाई जारी रखने हेतु प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) की छात्रवृत्ति प्रदान करना है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT अधिकृत पाठ्यक्रम पर आधारित ओरिजिनल प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS 2012 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-2017-mat-6p-sagarsir",
    "title": "Bihar NMMS 2017 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS 2017 ओरिजिनल प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2017) का ओरिजिनल MAT प्रश्न पत्र और हल PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS 2017",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "2017",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2017)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_2017_MAT_6p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_2017_MAT_6p_SagarSir.pdf",
    "pdfPages": 6,
    "pdfSize": "4.73 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "2017"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS 2017 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) के अंतर्गत राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित इस प्रश्न पत्र का मुख्य उद्देश्य सरकारी एवं राजकीय सहायता प्राप्त विद्यालयों के मेधावी छात्र-छात्राओं को पहचानकर उन्हें आगे की पढ़ाई जारी रखने हेतु प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) की छात्रवृत्ति प्रदान करना है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT अधिकृत पाठ्यक्रम पर आधारित ओरिजिनल प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS 2017 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-2017-mat-7p-sagarsir",
    "title": "Bihar NMMS 2017 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS 2017 ओरिजिनल प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2017) का ओरिजिनल MAT प्रश्न पत्र और हल PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS 2017",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "2017",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2017)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_2017_MAT_7p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_2017_MAT_7p_SagarSir.pdf",
    "pdfPages": 7,
    "pdfSize": "9.99 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "2017"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "इस प्रश्न पत्र की मुख्य विशेषताएं",
        "paragraphs": [
          "यह प्रश्न पत्र Bihar सरकार के राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित NMMS परीक्षा का वास्तविक प्रश्न पत्र है।",
          "Sagar Coaching Centre Bhagwanpur द्वारा सभी प्रश्नों को डिजिटल रूप से साफ़ करके छात्रों के अभ्यास हेतु प्रस्तुत किया गया है।"
        ],
        "bulletPoints": [
          "100% ओरिजिनल प्रश्न पत्र",
          "सागर सर द्वारा तैयार विशेष वॉटरमार्क युक्त आधिकारिक कॉपी"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस Bihar NMMS 2017 पेपर को ऑनलाइन पढ़ सकते हैं?",
        "answer": "हाँ! आप वेबसाइट पर बिना किसी शुल्क के पूरा प्रश्न पत्र पेज-दर-पेज ऑनलाइन पढ़ सकते हैं।"
      },
      {
        "question": "क्या PDF को ऑफलाइन डाउनलोड किया जा सकता है?",
        "answer": "हाँ, ₹49 का न्यूनतम सहयोग शुल्क देकर आप इसकी उच्च-गुणवत्ता वाली प्रिंट-रेडी PDF तुरंत डाउनलोड कर सकते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS 2017 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ],
    "canonicalSlug": "bihar-nmms-2017-mat-6p-sagarsir"
  },
  {
    "slug": "bihar-nmms-2023-sat-24p-sagarsir",
    "title": "Bihar NMMS 2023 Question Paper with Answer Key PDF Download (SAT)",
    "hindiTitle": "Bihar NMMS 2023 ओरिजिनल प्रश्न पत्र और आंसर की PDF (SAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2023) का ओरिजिनल SAT प्रश्न पत्र और हल PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS 2023",
      "SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "2023",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2023)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_2023_SAT_24p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_2023_SAT_24p_SagarSir.pdf",
    "pdfPages": 24,
    "pdfSize": "12.60 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "2023"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "शैक्षिक योग्यता परीक्षा (Science, SST, Math - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "SAT",
        "subjects": "विज्ञान, सामाजिक विज्ञान, गणित",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "इस प्रश्न पत्र की मुख्य विशेषताएं",
        "paragraphs": [
          "यह प्रश्न पत्र Bihar सरकार के राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित NMMS परीक्षा का वास्तविक प्रश्न पत्र है।",
          "Sagar Coaching Centre Bhagwanpur द्वारा सभी प्रश्नों को डिजिटल रूप से साफ़ करके छात्रों के अभ्यास हेतु प्रस्तुत किया गया है।"
        ],
        "bulletPoints": [
          "100% ओरिजिनल प्रश्न पत्र",
          "सागर सर द्वारा तैयार विशेष वॉटरमार्क युक्त आधिकारिक कॉपी"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस Bihar NMMS 2023 पेपर को ऑनलाइन पढ़ सकते हैं?",
        "answer": "हाँ! आप वेबसाइट पर बिना किसी शुल्क के पूरा प्रश्न पत्र पेज-दर-पेज ऑनलाइन पढ़ सकते हैं।"
      },
      {
        "question": "क्या PDF को ऑफलाइन डाउनलोड किया जा सकता है?",
        "answer": "हाँ, ₹49 का न्यूनतम सहयोग शुल्क देकर आप इसकी उच्च-गुणवत्ता वाली प्रिंट-रेडी PDF तुरंत डाउनलोड कर सकते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS 2023 question paper",
      "NMMS SAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ],
    "canonicalSlug": "bihar-nmms-2023-question-paper-answer-key-pdf"
  },
  {
    "slug": "bihar-nmms-2024-mat-11p-sagarsir",
    "title": "Bihar NMMS 2024 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS 2024 ओरिजिनल प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2024) का ओरिजिनल MAT प्रश्न पत्र और हल PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS 2024",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "2024",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2024)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_2024_MAT_11p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_2024_MAT_11p_SagarSir.pdf",
    "pdfPages": 11,
    "pdfSize": "3.38 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "2024"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "इस प्रश्न पत्र की मुख्य विशेषताएं",
        "paragraphs": [
          "यह प्रश्न पत्र Bihar सरकार के राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित NMMS परीक्षा का वास्तविक प्रश्न पत्र है।",
          "Sagar Coaching Centre Bhagwanpur द्वारा सभी प्रश्नों को डिजिटल रूप से साफ़ करके छात्रों के अभ्यास हेतु प्रस्तुत किया गया है।"
        ],
        "bulletPoints": [
          "100% ओरिजिनल प्रश्न पत्र",
          "सागर सर द्वारा तैयार विशेष वॉटरमार्क युक्त आधिकारिक कॉपी"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस Bihar NMMS 2024 पेपर को ऑनलाइन पढ़ सकते हैं?",
        "answer": "हाँ! आप वेबसाइट पर बिना किसी शुल्क के पूरा प्रश्न पत्र पेज-दर-पेज ऑनलाइन पढ़ सकते हैं।"
      },
      {
        "question": "क्या PDF को ऑफलाइन डाउनलोड किया जा सकता है?",
        "answer": "हाँ, ₹49 का न्यूनतम सहयोग शुल्क देकर आप इसकी उच्च-गुणवत्ता वाली प्रिंट-रेडी PDF तुरंत डाउनलोड कर सकते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS 2024 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ],
    "canonicalSlug": "bihar-nmms-2024-question-paper-answer-key-pdf"
  },
  {
    "slug": "bihar-nmms-2024-mat-7p-sagarsir",
    "title": "Bihar NMMS 2024 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS 2024 ओरिजिनल प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2024) का ओरिजिनल MAT प्रश्न पत्र और हल PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS 2024",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "2024",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2024)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_2024_MAT_7p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_2024_MAT_7p_SagarSir.pdf",
    "pdfPages": 7,
    "pdfSize": "10.10 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "2024"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "इस प्रश्न पत्र की मुख्य विशेषताएं",
        "paragraphs": [
          "यह प्रश्न पत्र Bihar सरकार के राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित NMMS परीक्षा का वास्तविक प्रश्न पत्र है।",
          "Sagar Coaching Centre Bhagwanpur द्वारा सभी प्रश्नों को डिजिटल रूप से साफ़ करके छात्रों के अभ्यास हेतु प्रस्तुत किया गया है।"
        ],
        "bulletPoints": [
          "100% ओरिजिनल प्रश्न पत्र",
          "सागर सर द्वारा तैयार विशेष वॉटरमार्क युक्त आधिकारिक कॉपी"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस Bihar NMMS 2024 पेपर को ऑनलाइन पढ़ सकते हैं?",
        "answer": "हाँ! आप वेबसाइट पर बिना किसी शुल्क के पूरा प्रश्न पत्र पेज-दर-पेज ऑनलाइन पढ़ सकते हैं।"
      },
      {
        "question": "क्या PDF को ऑफलाइन डाउनलोड किया जा सकता है?",
        "answer": "हाँ, ₹49 का न्यूनतम सहयोग शुल्क देकर आप इसकी उच्च-गुणवत्ता वाली प्रिंट-रेडी PDF तुरंत डाउनलोड कर सकते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS 2024 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ],
    "canonicalSlug": "bihar-nmms-2024-question-paper-answer-key-pdf"
  },
  {
    "slug": "bihar-nmms-2025-full-paper-2p-sagarsir",
    "title": "Bihar NMMS 2025 Question Paper with Answer Key PDF Download (MAT + SAT)",
    "hindiTitle": "Bihar NMMS 2025 ओरिजिनल प्रश्न पत्र और आंसर की PDF (MAT + SAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2025) का ओरिजिनल MAT + SAT प्रश्न पत्र और हल PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS 2025",
      "MAT + SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "2025",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2025)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_2025_Full_Paper_2p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_2025_Full_Paper_2p_SagarSir.pdf",
    "pdfPages": 2,
    "pdfSize": "3.35 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "2025"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता एवं शैक्षिक योग्यता परीक्षा (Mental Ability & Scholastic Aptitude)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "180 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "180 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT + SAT",
        "subjects": "रीजनिंग + विज्ञान + सामाजिक + गणित",
        "questions": 180,
        "marks": 180,
        "duration": "180 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS 2025 Question Paper with Answer Key PDF Download (MAT + SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) के अंतर्गत राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित इस प्रश्न पत्र का मुख्य उद्देश्य सरकारी एवं राजकीय सहायता प्राप्त विद्यालयों के मेधावी छात्र-छात्राओं को पहचानकर उन्हें आगे की पढ़ाई जारी रखने हेतु प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) की छात्रवृत्ति प्रदान करना है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT अधिकृत पाठ्यक्रम पर आधारित ओरिजिनल प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS 2025 question paper",
      "NMMS MAT + SAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-2025-sat-18p-sagarsir",
    "title": "Bihar NMMS 2025 Question Paper with Answer Key PDF Download (SAT)",
    "hindiTitle": "Bihar NMMS 2025 ओरिजिनल प्रश्न पत्र और आंसर की PDF (SAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2025) का ओरिजिनल SAT प्रश्न पत्र और हल PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS 2025",
      "SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "2025",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2025)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_2025_SAT_18p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_2025_SAT_18p_SagarSir.pdf",
    "pdfPages": 18,
    "pdfSize": "13.84 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "2025"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "शैक्षिक योग्यता परीक्षा (Science, SST, Math - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "SAT",
        "subjects": "विज्ञान, सामाजिक विज्ञान, गणित",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "इस प्रश्न पत्र की मुख्य विशेषताएं",
        "paragraphs": [
          "यह प्रश्न पत्र Bihar सरकार के राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित NMMS परीक्षा का वास्तविक प्रश्न पत्र है।",
          "Sagar Coaching Centre Bhagwanpur द्वारा सभी प्रश्नों को डिजिटल रूप से साफ़ करके छात्रों के अभ्यास हेतु प्रस्तुत किया गया है।"
        ],
        "bulletPoints": [
          "100% ओरिजिनल प्रश्न पत्र",
          "सागर सर द्वारा तैयार विशेष वॉटरमार्क युक्त आधिकारिक कॉपी"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस Bihar NMMS 2025 पेपर को ऑनलाइन पढ़ सकते हैं?",
        "answer": "हाँ! आप वेबसाइट पर बिना किसी शुल्क के पूरा प्रश्न पत्र पेज-दर-पेज ऑनलाइन पढ़ सकते हैं।"
      },
      {
        "question": "क्या PDF को ऑफलाइन डाउनलोड किया जा सकता है?",
        "answer": "हाँ, ₹49 का न्यूनतम सहयोग शुल्क देकर आप इसकी उच्च-गुणवत्ता वाली प्रिंट-रेडी PDF तुरंत डाउनलोड कर सकते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS 2025 question paper",
      "NMMS SAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ],
    "canonicalSlug": "bihar-nmms-2025-full-paper-2p-sagarsir"
  },
  {
    "slug": "bihar-nmms-set-01-full-paper-36p-sagarsir",
    "title": "Bihar NMMS Model Set 01 Question Paper with Answer Key PDF Download (MAT + SAT)",
    "hindiTitle": "Bihar NMMS Model Set 01 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT + SAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 01) का मॉडल MAT + SAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 01",
      "MAT + SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 01",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 01)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_01_Full_Paper_36p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_01_Full_Paper_36p_SagarSir.pdf",
    "pdfPages": 36,
    "pdfSize": "12.95 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 01"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता एवं शैक्षिक योग्यता परीक्षा (Mental Ability & Scholastic Aptitude)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "180 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "180 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT + SAT",
        "subjects": "रीजनिंग + विज्ञान + सामाजिक + गणित",
        "questions": 180,
        "marks": 180,
        "duration": "180 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 01 Question Paper with Answer Key PDF Download (MAT + SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 01 question paper",
      "NMMS MAT + SAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-02-full-paper-6p-sagarsir",
    "title": "Bihar NMMS Model Set 02 Question Paper with Answer Key PDF Download (MAT + SAT)",
    "hindiTitle": "Bihar NMMS Model Set 02 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT + SAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 02) का मॉडल MAT + SAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 02",
      "MAT + SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 02",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 02)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_02_Full_Paper_6p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_02_Full_Paper_6p_SagarSir.pdf",
    "pdfPages": 6,
    "pdfSize": "4.49 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 02"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता एवं शैक्षिक योग्यता परीक्षा (Mental Ability & Scholastic Aptitude)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "180 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "180 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT + SAT",
        "subjects": "रीजनिंग + विज्ञान + सामाजिक + गणित",
        "questions": 180,
        "marks": 180,
        "duration": "180 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 02 Question Paper with Answer Key PDF Download (MAT + SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 02 question paper",
      "NMMS MAT + SAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-03-full-paper-17p-sagarsir",
    "title": "Bihar NMMS Model Set 03 Question Paper with Answer Key PDF Download (MAT + SAT)",
    "hindiTitle": "Bihar NMMS Model Set 03 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT + SAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 03) का मॉडल MAT + SAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 03",
      "MAT + SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 03",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 03)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_03_Full_Paper_17p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_03_Full_Paper_17p_SagarSir.pdf",
    "pdfPages": 17,
    "pdfSize": "4.96 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 03"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता एवं शैक्षिक योग्यता परीक्षा (Mental Ability & Scholastic Aptitude)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "180 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "180 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT + SAT",
        "subjects": "रीजनिंग + विज्ञान + सामाजिक + गणित",
        "questions": 180,
        "marks": 180,
        "duration": "180 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 03 Question Paper with Answer Key PDF Download (MAT + SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 03 question paper",
      "NMMS MAT + SAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-04-mat-12p-sagarsir",
    "title": "Bihar NMMS Model Set 04 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS Model Set 04 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 04) का मॉडल MAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 04",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 04",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 04)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_04_MAT_12p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_04_MAT_12p_SagarSir.pdf",
    "pdfPages": 12,
    "pdfSize": "4.69 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 04"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 04 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 04 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-05-mat-13p-sagarsir",
    "title": "Bihar NMMS Model Set 05 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS Model Set 05 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 05) का मॉडल MAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 05",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 05",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 05)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_05_MAT_13p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_05_MAT_13p_SagarSir.pdf",
    "pdfPages": 13,
    "pdfSize": "4.85 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 05"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 05 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 05 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-06-mat-6p-sagarsir",
    "title": "Bihar NMMS Model Set 06 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS Model Set 06 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 06) का मॉडल MAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 06",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 06",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 06)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_06_MAT_6p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_06_MAT_6p_SagarSir.pdf",
    "pdfPages": 6,
    "pdfSize": "4.03 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 06"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 06 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 06 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-07-mat-7p-sagarsir",
    "title": "Bihar NMMS Model Set 07 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS Model Set 07 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 07) का मॉडल MAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 07",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 07",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 07)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_07_MAT_7p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_07_MAT_7p_SagarSir.pdf",
    "pdfPages": 7,
    "pdfSize": "7.94 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 07"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 07 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 07 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-08-mat-7p-sagarsir",
    "title": "Bihar NMMS Model Set 08 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS Model Set 08 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 08) का मॉडल MAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 08",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 08",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 08)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_08_MAT_7p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_08_MAT_7p_SagarSir.pdf",
    "pdfPages": 7,
    "pdfSize": "7.70 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 08"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 08 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 08 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-09-mat-7p-sagarsir",
    "title": "Bihar NMMS Model Set 09 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS Model Set 09 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 09) का मॉडल MAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 09",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 09",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 09)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_09_MAT_7p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_09_MAT_7p_SagarSir.pdf",
    "pdfPages": 7,
    "pdfSize": "9.47 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 09"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 09 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 09 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-10-mat-7p-sagarsir",
    "title": "Bihar NMMS Model Set 10 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS Model Set 10 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 10) का मॉडल MAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 10",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 10",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 10)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_10_MAT_7p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_10_MAT_7p_SagarSir.pdf",
    "pdfPages": 7,
    "pdfSize": "8.14 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 10"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 10 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 10 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-11-mat-7p-sagarsir",
    "title": "Bihar NMMS Model Set 11 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS Model Set 11 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 11) का मॉडल MAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 11",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 11",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 11)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_11_MAT_7p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_11_MAT_7p_SagarSir.pdf",
    "pdfPages": 7,
    "pdfSize": "8.08 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 11"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 11 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 11 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-12-mat-8p-sagarsir",
    "title": "Bihar NMMS Model Set 12 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS Model Set 12 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 12) का मॉडल MAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 12",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 12",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 12)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_12_MAT_8p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_12_MAT_8p_SagarSir.pdf",
    "pdfPages": 8,
    "pdfSize": "5.91 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 12"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 12 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 12 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-13-mat-8p-sagarsir",
    "title": "Bihar NMMS Model Set 13 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS Model Set 13 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 13) का मॉडल MAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 13",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 13",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 13)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_13_MAT_8p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_13_MAT_8p_SagarSir.pdf",
    "pdfPages": 8,
    "pdfSize": "3.73 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 13"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 13 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 13 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-14-mat-6p-sagarsir",
    "title": "Bihar NMMS Model Set 14 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS Model Set 14 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 14) का मॉडल MAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 14",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 14",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 14)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_14_MAT_6p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_14_MAT_6p_SagarSir.pdf",
    "pdfPages": 6,
    "pdfSize": "2.55 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 14"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 14 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 14 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-15-mat-25p-sagarsir",
    "title": "Bihar NMMS Model Set 15 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS Model Set 15 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 15) का मॉडल MAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 15",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 15",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 15)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_15_MAT_25p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_15_MAT_25p_SagarSir.pdf",
    "pdfPages": 25,
    "pdfSize": "7.50 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 15"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 15 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 15 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-16-mat-17p-sagarsir",
    "title": "Bihar NMMS Model Set 16 Question Paper with Answer Key PDF Download (MAT)",
    "hindiTitle": "Bihar NMMS Model Set 16 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (MAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 16) का मॉडल MAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 16",
      "MAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 16",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 16)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_16_MAT_17p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_16_MAT_17p_SagarSir.pdf",
    "pdfPages": 17,
    "pdfSize": "4.98 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 16"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT",
        "subjects": "तर्कशक्ति एवं रीजनिंग",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 16 Question Paper with Answer Key PDF Download (MAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 16 question paper",
      "NMMS MAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-17-sat-10p-sagarsir",
    "title": "Bihar NMMS Model Set 17 Question Paper with Answer Key PDF Download (SAT)",
    "hindiTitle": "Bihar NMMS Model Set 17 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (SAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 17) का मॉडल SAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 17",
      "SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 17",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 17)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_17_SAT_10p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_17_SAT_10p_SagarSir.pdf",
    "pdfPages": 10,
    "pdfSize": "5.12 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 17"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "शैक्षिक योग्यता परीक्षा (Science, SST, Math - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "SAT",
        "subjects": "विज्ञान, सामाजिक विज्ञान, गणित",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 17 Question Paper with Answer Key PDF Download (SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 17 question paper",
      "NMMS SAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-18-sat-19p-sagarsir",
    "title": "Bihar NMMS Model Set 18 Question Paper with Answer Key PDF Download (SAT)",
    "hindiTitle": "Bihar NMMS Model Set 18 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (SAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 18) का मॉडल SAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 18",
      "SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 18",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 18)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_18_SAT_19p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_18_SAT_19p_SagarSir.pdf",
    "pdfPages": 19,
    "pdfSize": "4.56 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 18"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "शैक्षिक योग्यता परीक्षा (Science, SST, Math - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "SAT",
        "subjects": "विज्ञान, सामाजिक विज्ञान, गणित",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 18 Question Paper with Answer Key PDF Download (SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 18 question paper",
      "NMMS SAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-19-sat-23p-sagarsir",
    "title": "Bihar NMMS Model Set 19 Question Paper with Answer Key PDF Download (SAT)",
    "hindiTitle": "Bihar NMMS Model Set 19 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (SAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 19) का मॉडल SAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 19",
      "SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 19",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 19)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_19_SAT_23p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_19_SAT_23p_SagarSir.pdf",
    "pdfPages": 23,
    "pdfSize": "5.28 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 19"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "शैक्षिक योग्यता परीक्षा (Science, SST, Math - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "SAT",
        "subjects": "विज्ञान, सामाजिक विज्ञान, गणित",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 19 Question Paper with Answer Key PDF Download (SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 19 question paper",
      "NMMS SAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-20-sat-30p-sagarsir",
    "title": "Bihar NMMS Model Set 20 Question Paper with Answer Key PDF Download (SAT)",
    "hindiTitle": "Bihar NMMS Model Set 20 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (SAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 20) का मॉडल SAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 20",
      "SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 20",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 20)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_20_SAT_30p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_20_SAT_30p_SagarSir.pdf",
    "pdfPages": 30,
    "pdfSize": "16.65 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 20"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "शैक्षिक योग्यता परीक्षा (Science, SST, Math - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "SAT",
        "subjects": "विज्ञान, सामाजिक विज्ञान, गणित",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 20 Question Paper with Answer Key PDF Download (SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 20 question paper",
      "NMMS SAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-21-sat-3p-sagarsir",
    "title": "Bihar NMMS Model Set 21 Question Paper with Answer Key PDF Download (SAT)",
    "hindiTitle": "Bihar NMMS Model Set 21 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (SAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 21) का मॉडल SAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 21",
      "SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 21",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 21)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_21_SAT_3p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_21_SAT_3p_SagarSir.pdf",
    "pdfPages": 3,
    "pdfSize": "4.09 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 21"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "शैक्षिक योग्यता परीक्षा (Science, SST, Math - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "SAT",
        "subjects": "विज्ञान, सामाजिक विज्ञान, गणित",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 21 Question Paper with Answer Key PDF Download (SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 21 question paper",
      "NMMS SAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-22-sat-7p-sagarsir",
    "title": "Bihar NMMS Model Set 22 Question Paper with Answer Key PDF Download (SAT)",
    "hindiTitle": "Bihar NMMS Model Set 22 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (SAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 22) का मॉडल SAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 22",
      "SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 22",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 22)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_22_SAT_7p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_22_SAT_7p_SagarSir.pdf",
    "pdfPages": 7,
    "pdfSize": "10.63 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 22"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "शैक्षिक योग्यता परीक्षा (Science, SST, Math - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "SAT",
        "subjects": "विज्ञान, सामाजिक विज्ञान, गणित",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 22 Question Paper with Answer Key PDF Download (SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 22 question paper",
      "NMMS SAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-23-sat-9p-sagarsir",
    "title": "Bihar NMMS Model Set 23 Question Paper with Answer Key PDF Download (SAT)",
    "hindiTitle": "Bihar NMMS Model Set 23 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (SAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 23) का मॉडल SAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 23",
      "SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 23",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 23)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_23_SAT_9p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_23_SAT_9p_SagarSir.pdf",
    "pdfPages": 9,
    "pdfSize": "6.37 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 23"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "शैक्षिक योग्यता परीक्षा (Science, SST, Math - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "SAT",
        "subjects": "विज्ञान, सामाजिक विज्ञान, गणित",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 23 Question Paper with Answer Key PDF Download (SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 23 question paper",
      "NMMS SAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-24-sat-9p-sagarsir",
    "title": "Bihar NMMS Model Set 24 Question Paper with Answer Key PDF Download (SAT)",
    "hindiTitle": "Bihar NMMS Model Set 24 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (SAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 24) का मॉडल SAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 24",
      "SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 24",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 24)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_24_SAT_9p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_24_SAT_9p_SagarSir.pdf",
    "pdfPages": 9,
    "pdfSize": "5.99 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 24"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "शैक्षिक योग्यता परीक्षा (Science, SST, Math - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "SAT",
        "subjects": "विज्ञान, सामाजिक विज्ञान, गणित",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 24 Question Paper with Answer Key PDF Download (SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 24 question paper",
      "NMMS SAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "bihar-nmms-set-25-sat-28p-sagarsir",
    "title": "Bihar NMMS Model Set 25 Question Paper with Answer Key PDF Download (SAT)",
    "hindiTitle": "Bihar NMMS Model Set 25 मॉडल अभ्यास प्रश्न पत्र और आंसर की PDF (SAT)",
    "excerpt": "Bihar राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS Model Set 25) का मॉडल SAT अभ्यास प्रश्न पत्र PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "Bihar NMMS",
      "NMMS Model Set 25",
      "SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "Model Set 25",
    "state": "Bihar",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE Model Set 25)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/BIHAR_NMMS_Set_25_SAT_28p_SagarSir.pdf",
    "pdfFileName": "BIHAR_NMMS_Set_25_SAT_28p_SagarSir.pdf",
    "pdfPages": 28,
    "pdfSize": "7.51 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Bihar)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "Model Set 25"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "शैक्षिक योग्यता परीक्षा (Science, SST, Math - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "SAT",
        "subjects": "विज्ञान, सामाजिक विज्ञान, गणित",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "Bihar NMMS Model Set 25 Question Paper with Answer Key PDF Download (SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "यह मॉडल सेट राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) की तैयारी करने वाले विद्यार्थियों के लिए सागर कोचिंग सेंटर (Sagar Coaching Centre) द्वारा तैयार किया गया विशेष अभ्यास प्रश्न पत्र (Practice / Model Paper) है, जो परीक्षा पैटर्न के अनुरूप गहन अभ्यास हेतु उपयोगी है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT पाठ्यक्रम पर आधारित सागर कोचिंग सेंटर का मॉडल अभ्यास प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "Bihar NMMS Model Set 25 question paper",
      "NMMS SAT previous year paper pdf",
      "Bihar nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "up-nmms-2023-sat-1p-sagarsir",
    "title": "UP NMMS 2023 Question Paper with Answer Key PDF Download (SAT)",
    "hindiTitle": "Uttar Pradesh NMMS 2023 ओरिजिनल प्रश्न पत्र और आंसर की PDF (SAT)",
    "excerpt": "Uttar Pradesh राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2023) का ओरिजिनल SAT प्रश्न पत्र और हल PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "UP NMMS",
      "NMMS 2023",
      "SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "2023",
    "state": "Uttar Pradesh",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2023)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/UP_NMMS_2023_SAT_1p_SagarSir.pdf",
    "pdfFileName": "UP_NMMS_2023_SAT_1p_SagarSir.pdf",
    "pdfPages": 1,
    "pdfSize": "1.68 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Uttar Pradesh)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "2023"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "शैक्षिक योग्यता परीक्षा (Science, SST, Math - 90 अंक)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "90 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "90 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "SAT",
        "subjects": "विज्ञान, सामाजिक विज्ञान, गणित",
        "questions": 90,
        "marks": 90,
        "duration": "90 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "UP NMMS 2023 Question Paper with Answer Key PDF Download (SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) के अंतर्गत राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित इस प्रश्न पत्र का मुख्य उद्देश्य सरकारी एवं राजकीय सहायता प्राप्त विद्यालयों के मेधावी छात्र-छात्राओं को पहचानकर उन्हें आगे की पढ़ाई जारी रखने हेतु प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) की छात्रवृत्ति प्रदान करना है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT अधिकृत पाठ्यक्रम पर आधारित ओरिजिनल प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "UP NMMS 2023 question paper",
      "NMMS SAT previous year paper pdf",
      "Uttar Pradesh nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  },
  {
    "slug": "up-nmms-2025-full-paper-12p-sagarsir",
    "title": "UP NMMS 2025 Question Paper with Answer Key PDF Download (MAT + SAT)",
    "hindiTitle": "Uttar Pradesh NMMS 2025 ओरिजिनल प्रश्न पत्र और आंसर की PDF (MAT + SAT)",
    "excerpt": "Uttar Pradesh राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS 2025) का ओरिजिनल MAT + SAT प्रश्न पत्र और हल PDF ऑनलाइन पढ़ें एवं डाउनलोड करें।",
    "category": "Previous Year Papers",
    "tags": [
      "UP NMMS",
      "NMMS 2025",
      "MAT + SAT",
      "Answer Key",
      "Sagar Coaching Centre",
      "Sagar Sir"
    ],
    "year": "2025",
    "state": "Uttar Pradesh",
    "examName": "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE 2025)",
    "author": "श्रवण कुमार 'सागर' (Sagar Sir)",
    "authorRole": "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
    "publishedAt": "2024-01-20",
    "updatedAt": "2026-10-13",
    "readTime": "5 min read",
    "pdfUrl": "pyq/branded/UP_NMMS_2025_Full_Paper_12p_SagarSir.pdf",
    "pdfFileName": "UP_NMMS_2025_Full_Paper_12p_SagarSir.pdf",
    "pdfPages": 12,
    "pdfSize": "7.24 MB",
    "overview": [
      {
        "label": "परीक्षा का नाम",
        "value": "NMMS (Uttar Pradesh)"
      },
      {
        "label": "सत्र / वर्ष",
        "value": "2025"
      },
      {
        "label": "प्रश्न पत्र भाग",
        "value": "मानसिक योग्यता एवं शैक्षिक योग्यता परीक्षा (Mental Ability & Scholastic Aptitude)"
      },
      {
        "label": "कुल प्रश्न",
        "value": "180 प्रश्न"
      },
      {
        "label": "पूर्णांक (कुल अंक)",
        "value": "180 अंक"
      },
      {
        "label": "नेगेटिव मार्किंग",
        "value": "कोई नकारात्मक अंक नहीं (No Negative Marking)"
      },
      {
        "label": "मार्गदर्शक / विशेषज्ञ",
        "value": "श्रवण कुमार 'सागर' (सागर सर)"
      }
    ],
    "pattern": [
      {
        "paper": "MAT + SAT",
        "subjects": "रीजनिंग + विज्ञान + सामाजिक + गणित",
        "questions": 180,
        "marks": 180,
        "duration": "180 मिनट"
      }
    ],
    "contentSections": [
      {
        "heading": "UP NMMS 2025 Question Paper with Answer Key PDF Download (MAT + SAT) - विस्तृत विश्लेषण एवं परीक्षा पैटर्न",
        "subheading": "परीक्षा की रूपरेखा, अंक विभाजन और मुख्य विषय",
        "paragraphs": [
          "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS) के अंतर्गत राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित इस प्रश्न पत्र का मुख्य उद्देश्य सरकारी एवं राजकीय सहायता प्राप्त विद्यालयों के मेधावी छात्र-छात्राओं को पहचानकर उन्हें आगे की पढ़ाई जारी रखने हेतु प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) की छात्रवृत्ति प्रदान करना है।",
          "इस प्रश्न पत्र के मुख्य खंडों से कई महत्वपूर्ण प्रश्न बार-बार दोहराए जाते हैं। परीक्षा में सफलता के लिए केवल थ्योरी पढ़ना पर्याप्त नहीं है, बल्कि वास्तविक प्रश्न पत्र के प्रारूप में समयबद्ध अभ्यास करना और सही उत्तर कुंजी के साथ स्व-मूल्यांकन करना अत्यंत आवश्यक है।"
        ],
        "bulletPoints": [
          "कक्षा 7वीं और 8वीं के NCERT/SCERT अधिकृत पाठ्यक्रम पर आधारित ओरिजिनल प्रश्न पत्र।",
          "प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है और गलत उत्तर पर कोई ऋणात्मक अंकन (Negative Marking) नहीं है।",
          "ओएमआर (OMR) शीट भरने का पूर्वाभ्यास करने के लिए सबसे प्रामाणिक अध्ययन सामग्री।"
        ]
      }
    ],
    "faqs": [
      {
        "question": "क्या इस प्रश्न पत्र को वेबसाइट पर निःशुल्क ऑनलाइन पढ़ा जा सकता है?",
        "answer": "हाँ! सागर कोचिंग सेंटर की वेबसाइट पर यह प्रश्न पत्र ऑनलाइन पढ़ने के लिए 100% निःशुल्क उपलब्ध है।"
      },
      {
        "question": "इस परीक्षा में उत्तीर्ण होने के लिए न्यूनतम कितने अंक (Cut-off) आवश्यक हैं?",
        "answer": "सामान्य एवं पिछड़ा वर्ग के छात्रों को दोनों पेपर्स में मिलाकर न्यूनतम 40% अंक तथा एससी/एसटी वर्ग के छात्रों को न्यूनतम 32% अंक प्राप्त करने होते हैं।"
      },
      {
        "question": "क्या NMMS परीक्षा में गलत उत्तर देने पर नेगेटिव मार्किंग कटती है?",
        "answer": "नहीं, NMMS परीक्षा में किसी भी प्रकार की नेगेटिव मार्किंग (ऋणात्मक अंकन) नहीं होती है। इसलिए सभी 180 प्रश्नों को हल करने का प्रयास करें।"
      },
      {
        "question": "NMMS छात्रवृत्ति के तहत चयनित विद्यार्थी को कुल कितनी राशि मिलती है?",
        "answer": "चयनित विद्यार्थियों को कक्षा 9वीं से 12वीं तक प्रतिवर्ष ₹12,000 (कुल 4 वर्षों में ₹48,000) भारत सरकार के शिक्षा मंत्रालय द्वारा सीधे बैंक खाते में (DBT) प्रदान किए जाते हैं।"
      }
    ],
    "metaKeywords": [
      "UP NMMS 2025 question paper",
      "NMMS MAT + SAT previous year paper pdf",
      "Uttar Pradesh nmms paper download",
      "sagar coaching centre nmms",
      "sagar sir nmms pyq"
    ]
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
