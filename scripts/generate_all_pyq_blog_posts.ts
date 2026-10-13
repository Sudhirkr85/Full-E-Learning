import fs from "fs";
import path from "path";

const MANIFEST_PATH = "scripts/uploaded_r2_manifest.json";

function makeSlug(fname: string): string {
  return fname
    .replace(/\.pdf$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseInfoFromFname(fname: string) {
  const isUP = fname.includes("UP");
  const state = isUP ? "Uttar Pradesh" : "Bihar";
  const stateCode = isUP ? "UP" : "Bihar";

  let year = "2024";
  const yearMatch = fname.match(/(20\d\d)/);
  if (yearMatch) {
    year = yearMatch[1];
  } else {
    // If generic set, e.g. Set_05
    const setMatch = fname.match(/Set_(\d+)/);
    if (setMatch) {
      year = `Model Set ${setMatch[1]}`;
    }
  }

  let subject = "MAT + SAT";
  let subjectDetail = "मानसिक योग्यता एवं शैक्षिक योग्यता परीक्षा (Mental Ability & Scholastic Aptitude)";
  if (fname.includes("MAT")) {
    subject = "MAT";
    subjectDetail = "मानसिक योग्यता परीक्षा (Mental Ability Test - 90 अंक)";
  } else if (fname.includes("SAT")) {
    subject = "SAT";
    subjectDetail = "शैक्षिक योग्यता परीक्षा (Science, SST, Math - 90 अंक)";
  }

  const pageMatch = fname.match(/(\d+)p/);
  const pages = pageMatch ? parseInt(pageMatch[1], 10) : 10;

  return { state, stateCode, year, subject, subjectDetail, pages };
}

export function generateAllPosts() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error("Manifest not found!");
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  console.log(`Processing ${manifest.length} manifest files...`);

  const generated = manifest.map((item: any) => {
    const { fname, url, sizeMb } = item;
    const info = parseInfoFromFname(fname);
    const slug = makeSlug(fname);

    const title = `${info.stateCode} NMMS ${info.year} Question Paper with Answer Key PDF Download (${info.subject})`;
    const hindiTitle = `${info.state} NMMS ${info.year} ओरिजिनल प्रश्न पत्र और आंसर की PDF (${info.subject})`;
    const excerpt = `${info.state} राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMS ${info.year}) का ओरिजिनल ${info.subject} प्रश्न पत्र और हल PDF ऑनलाइन पढ़ें एवं डाउनलोड करें। सागर सर द्वारा तैयार व सत्यापित।`;

    return {
      slug,
      title,
      hindiTitle,
      excerpt,
      category: "Previous Year Papers",
      tags: [
        `${info.stateCode} NMMS`,
        `NMMS ${info.year}`,
        info.subject,
        "Answer Key",
        "Sagar Coaching Centre",
        "Sagar Sir",
      ],
      year: info.year,
      state: info.state,
      examName: `राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा (NMMSE ${info.year})`,
      author: "श्रवण कुमार 'सागर' (Sagar Sir)",
      authorRole: "Founder & Head Teacher, Sagar Coaching Centre Bhagwanpur",
      publishedAt: "2024-01-20",
      updatedAt: "2026-10-13",
      readTime: "5 min read",
      pdfUrl: url,
      pdfFileName: fname,
      pdfPages: info.pages,
      pdfSize: `${sizeMb} MB`,
      overview: [
        { label: "परीक्षा का नाम", value: `NMMS (${info.state})` },
        { label: "सत्र / वर्ष", value: info.year },
        { label: "प्रश्न पत्र भाग", value: info.subjectDetail },
        { label: "कुल प्रश्न", value: info.subject === "MAT + SAT" ? "180 प्रश्न" : "90 प्रश्न" },
        { label: "पूर्णांक (कुल अंक)", value: info.subject === "MAT + SAT" ? "180 अंक" : "90 अंक" },
        { label: "नेगेटिव मार्किंग", value: "कोई नकारात्मक अंक नहीं (No Negative Marking)" },
        { label: "मार्गदर्शक / विशेषज्ञ", value: "श्रवण कुमार 'सागर' (सागर सर)" },
      ],
      pattern: [
        {
          paper: info.subject,
          subjects: info.subject === "MAT" ? "तर्कशक्ति एवं रीजनिंग" : info.subject === "SAT" ? "विज्ञान, सामाजिक विज्ञान, गणित" : "रीजनिंग + विज्ञान + सामाजिक + गणित",
          questions: info.subject === "MAT + SAT" ? 180 : 90,
          marks: info.subject === "MAT + SAT" ? 180 : 90,
          duration: info.subject === "MAT + SAT" ? "180 मिनट" : "90 मिनट",
        },
      ],
      contentSections: [
        {
          heading: "इस प्रश्न पत्र की मुख्य विशेषताएं",
          paragraphs: [
            `यह प्रश्न पत्र ${info.state} सरकार के राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद द्वारा आयोजित NMMS परीक्षा का वास्तविक प्रश्न पत्र है।`,
            "Sagar Coaching Centre Bhagwanpur द्वारा सभी प्रश्नों को डिजिटल रूप से साफ़ करके छात्रों के अभ्यास हेतु प्रस्तुत किया गया है।",
          ],
          bulletPoints: [
            "100% ओरिजिनल प्रश्न पत्र",
            "प्रत्येक प्रश्न के हल के साथ अभ्यास करने की सुविधा",
            "सागर सर द्वारा तैयार विशेष वॉटरमार्क युक्त आधिकारिक कॉपी",
          ],
        },
      ],
      faqs: [
        {
          question: `क्या इस ${info.stateCode} NMMS ${info.year} पेपर को ऑनलाइन पढ़ सकते हैं?`,
          answer: "हाँ! आप वेबसाइट पर बिना किसी शुल्क के पूरा प्रश्न पत्र पेज-दर-पेज ऑनलाइन पढ़ सकते हैं।",
        },
        {
          question: "क्या PDF को ऑफलाइन डाउनलोड किया जा सकता है?",
          answer: "हाँ, ₹49 का न्यूनतम सहयोग शुल्क देकर आप इसकी उच्च-गुणवत्ता वाली प्रिंट-रेडी PDF तुरंत डाउनलोड कर सकते हैं।",
        },
      ],
      metaKeywords: [
        `${info.stateCode} NMMS ${info.year} question paper`,
        `NMMS ${info.subject} previous year paper pdf`,
        `${info.state} nmms paper download`,
        "sagar coaching centre nmms",
        "sagar sir nmms pyq",
      ],
    };
  });

  return generated;
}

if (process.argv[1].includes("generate_all_pyq_blog_posts")) {
  const posts = generateAllPosts();
  fs.writeFileSync("scripts/all_generated_posts.json", JSON.stringify(posts, null, 2));
  console.log(`Generated ${posts?.length || 0} posts!`);
}
