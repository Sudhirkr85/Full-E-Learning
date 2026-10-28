import fs from "fs";
import path from "path";
import { PrismaClient, UpdateType, UpdateStatus } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedUpdatePost {
  slug: string;
  title: string;
  summary: string;
  body: string;
  type: UpdateType;
  exam: string;
  state?: string | null;
  status: UpdateStatus;
  links?: any[];
  importantDates?: any[];
  faqs?: any[];
  sources?: any[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  showAds?: boolean;
  publishedAt?: string | null;
}

async function main() {
  const seedDir = path.join(process.cwd(), "content", "updates-seed");

  if (!fs.existsSync(seedDir)) {
    console.error(`Seed directory not found at: ${seedDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(seedDir)
    .filter((file) => file.endsWith(".json"))
    .sort();

  console.log(`Found ${files.length} seed files in ${seedDir}...`);

  for (const file of files) {
    const filePath = path.join(seedDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const data: SeedUpdatePost = JSON.parse(content);

    const publishedAtDate = data.publishedAt ? new Date(data.publishedAt) : null;

    const result = await prisma.updatePost.upsert({
      where: { slug: data.slug },
      update: {
        title: data.title,
        summary: data.summary,
        body: data.body,
        type: data.type,
        exam: data.exam || "NMMS",
        state: data.state ?? null,
        status: data.status,
        links: data.links ?? [],
        importantDates: data.importantDates ?? [],
        faqs: data.faqs ?? [],
        sources: data.sources ?? [],
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        showAds: data.showAds ?? true,
        publishedAt: publishedAtDate,
      },
      create: {
        slug: data.slug,
        title: data.title,
        summary: data.summary,
        body: data.body,
        type: data.type,
        exam: data.exam || "NMMS",
        state: data.state ?? null,
        status: data.status,
        links: data.links ?? [],
        importantDates: data.importantDates ?? [],
        faqs: data.faqs ?? [],
        sources: data.sources ?? [],
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        showAds: data.showAds ?? true,
        publishedAt: publishedAtDate,
      },
    });

    console.log(`[SEED] Upserted (${result.status}): ${result.slug} - "${result.title}"`);
  }

  console.log("\n All updates seeded successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
