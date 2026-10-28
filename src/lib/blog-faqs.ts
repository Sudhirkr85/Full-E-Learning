import type { BlogPost } from "./blog-data";

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Dynamically generate tailored, paper-specific FAQs for PYQ blog posts
 * based on state, year, subject (MAT/SAT/Full), set type, and PDF specifications.
 */
export function getDynamicBlogFaqs(post: BlogPost): FaqItem[] {
  const isUp = post.state === "Uttar Pradesh" || post.slug.startsWith("up-");
  const isBihar = post.state === "Bihar" || post.slug.startsWith("bihar-");
  const stateLabel = isUp ? "उत्तर प्रदेश" : isBihar ? "बिहार" : (post.state || "राज्य");

  const isModelSet =
    post.slug.includes("set-") ||
    (post.year && post.year.toLowerCase().includes("model"));
  const isMat = post.slug.includes("-mat-") || post.title.includes("(MAT)");
  const isSat = post.slug.includes("-sat-") || post.title.includes("(SAT)");

  const faqs: FaqItem[] = [];

  // Q1: Authenticity / Context
  if (isModelSet) {
    faqs.push({
      question: `यह NMMS ${post.year} मॉडल पेपर किस आधार पर तैयार किया गया है?`,
      answer: `यह मॉडल प्रैक्टिस सेट नवीनतम NMMS परीक्षा ब्लूप्रिंट और पिछले वर्षों के परीक्षा रुझानों के आधार पर उच्च-संभावित (High-Yield) प्रश्नों के साथ तैयार किया गया है।`,
    });
  } else {
    faqs.push({
      question: `क्या यह ${stateLabel} NMMS ${post.year} का वास्तविक आधिकारिक प्रश्न पत्र है?`,
      answer: `हाँ, यह ${
        isUp ? "उत्तर प्रदेश परीक्षा नियामक प्राधिकारी" : "SCERT बिहार"
      } द्वारा आयोजित ${post.year} NMMS परीक्षा का मूल प्रश्न पत्र है, जिसे छात्रों के प्रामाणिक अभ्यास हेतु उपलब्ध कराया गया है।`,
    });
  }

  // Q2: Subjects & Question Type
  if (isMat) {
    faqs.push({
      question: `इस प्रश्न पत्र में MAT (मानसिक योग्यता परीक्षण) के कौन-से विषय शामिल हैं?`,
      answer: `इसमें सादृश्यता (Analogy), वर्गीकरण (Odd-One-Out), श्रृंखला (Series), कोडिंग-डिकोडिंग, रक्त संबंध, दिशा ज्ञान और आकृति तर्कशक्ति के महत्वपूर्ण तार्किक प्रश्न शामिल हैं।`,
    });
  } else if (isSat) {
    faqs.push({
      question: `इस प्रश्न पत्र में SAT (शैक्षिक योग्यता परीक्षण) के कौन-से विषय आते हैं?`,
      answer: `इसमें कक्षा 7वीं और 8वीं के निर्धारित पाठ्यक्रम पर आधारित विज्ञान (भौतिक, रसायन, जीव विज्ञान), सामाजिक विज्ञान (इतिहास, भूगोल, नागरिक शास्त्र) और गणित के 90 वस्तुनिष्ठ प्रश्न शामिल हैं।`,
    });
  } else {
    faqs.push({
      question: `इस संपूर्ण प्रश्न पत्र में कुल कितने खंड और प्रश्न शामिल हैं?`,
      answer: `इस प्रश्न पत्र में MAT (तार्किक योग्यता के 90 प्रश्न) और SAT (शैक्षिक योग्यता के 90 प्रश्न) दोनों खंडों को मिलाकर कुल 180 वस्तुनिष्ठ प्रश्न (प्रत्येक 1 अंक) शामिल हैं।`,
    });
  }

  // Q3: Answer Key
  faqs.push({
    question: `क्या इस ${post.pdfPages} पृष्ठों की PDF में उत्तर कुंजी (Answer Key) शामिल है?`,
    answer: `हाँ! इस डिजिटल कॉपी में सभी प्रश्नों की प्रामाणिक उत्तर कुंजी संलग्न है, जिससे विद्यार्थी प्रश्न पत्र हल करने के बाद अपना सटीक स्व-मूल्यांकन कर सकते हैं।`,
  });

  // Q4: Cut-off & Qualifying criteria
  if (isUp) {
    faqs.push({
      question: `उत्तर प्रदेश NMMS परीक्षा में पास होने के लिए न्यूनतम कितने अंक चाहिए?`,
      answer: `केंद्रीय NMMSS दिशानिर्देशों के अनुसार सामान्य एवं पिछड़ा वर्ग के लिए कुल योग पर न्यूनतम 40% (72 अंक) तथा SC/ST वर्ग के लिए 32% (58 अंक) आवश्यक हैं। अंतिम चयन जिलेवार मेरिट के आधार पर होता है।`,
    });
  } else if (isBihar) {
    faqs.push({
      question: `बिहार NMMS परीक्षा में न्यूनतम उत्तीर्णांक का क्या नियम है?`,
      answer: `केंद्रीय गाइडलाइन के अनुसार सामान्य व पिछड़ा वर्ग को कुल योग पर न्यूनतम 40% और SC/ST वर्ग को 32% अंक प्राप्त करना अनिवार्य है; जिले के निर्धारित कोटे अनुसार मेरिट में स्थान बनता है।`,
    });
  } else {
    faqs.push({
      question: `NMMS परीक्षा में क्वालिफाइंग मार्क्स का क्या नियम है?`,
      answer: `केंद्रीय योजना के अनुसार दोनों भागों के कुल योग पर सामान्य/ओबीसी के लिए कम से कम 40% और SC/ST के लिए 32% अंक आवश्यक हैं।`,
    });
  }

  // Q5: Online Reading / Download
  faqs.push({
    question: `क्या इस प्रश्न पत्र को बिना डाउनलोड किए ऑनलाइन पढ़ा जा सकता है?`,
    answer: `हाँ, इसी पेज पर उपलब्ध सुरक्षित PDF व्यूअर में आप बिना डाउनलोड किए पूरे ${post.pdfPages} पृष्ठों का अध्ययन कर सकते हैं। ऑफलाइन पढ़ने हेतु 'डाउनलोड PDF' का विकल्प भी उपलब्ध है।`,
  });

  return faqs;
}
