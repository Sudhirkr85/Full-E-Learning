import fs from "fs";
import { BLOG_POSTS as ORIGINAL_POSTS } from "../src/lib/blog-data";
import { generateAllPosts } from "./generate_all_pyq_blog_posts";

const newPosts = generateAllPosts();
if (!newPosts) {
  process.exit(1);
}

// Keep original 3 posts, and add the new 37 (avoiding duplicates if any slug matches)
const existingSlugs = new Set(ORIGINAL_POSTS.map(p => p.slug));
const combinedPosts = [...ORIGINAL_POSTS];

for (const p of newPosts) {
  if (!existingSlugs.has(p.slug)) {
    combinedPosts.push(p);
    existingSlugs.add(p.slug);
  }
}

console.log(`Total combined posts: ${combinedPosts.length}`);

const fileContent = `export interface BlogPost {
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

export const BLOG_POSTS: BlogPost[] = ${JSON.stringify(combinedPosts, null, 2)};

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
`;

fs.writeFileSync("src/lib/blog-data.ts", fileContent, "utf-8");
console.log("✅ Successfully updated src/lib/blog-data.ts with all posts!");
