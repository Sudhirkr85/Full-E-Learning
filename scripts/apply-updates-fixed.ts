import fs from "fs";
import path from "path";
import { PrismaClient, UpdatePost } from "@prisma/client";
import { updatePostSchema, UpdatePostInput } from "../src/lib/updates/validation";

const prisma = new PrismaClient();

function getMaskedDbHost(urlStr?: string): string {
  if (!urlStr) return "DATABASE_URL is not set";
  try {
    const parsed = new URL(urlStr);
    return parsed.host; // e.g. hostname:port without credentials or paths
  } catch {
    const hostMatch = urlStr.match(/@([^:\/?]+)(?::(\d+))?/);
    if (hostMatch) {
      return hostMatch[2] ? `${hostMatch[1]}:${hostMatch[2]}` : hostMatch[1];
    }
    return "[unable to parse host]";
  }
}

function areJsonEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function detectChangedFields(existing: UpdatePost, incoming: UpdatePostInput): string[] {
  const changed: string[] = [];
  if (existing.title !== incoming.title) changed.push("title");
  if (existing.summary !== incoming.summary) changed.push("summary");
  if (existing.body !== incoming.body) changed.push("body");
  if (existing.type !== incoming.type) changed.push("type");
  if (existing.exam !== (incoming.exam || "NMMS")) changed.push("exam");
  if ((existing.state ?? null) !== (incoming.state ?? null)) changed.push("state");
  if (existing.status !== incoming.status) changed.push("status");
  if (!areJsonEqual(existing.links, incoming.links ?? [])) changed.push("links");
  if (!areJsonEqual(existing.importantDates, incoming.importantDates ?? [])) changed.push("importantDates");
  if (!areJsonEqual(existing.faqs, incoming.faqs ?? [])) changed.push("faqs");
  if (!areJsonEqual(existing.sources, incoming.sources ?? [])) changed.push("sources");
  if ((existing.seoTitle ?? null) !== (incoming.seoTitle ?? null)) changed.push("seoTitle");
  if ((existing.seoDescription ?? null) !== (incoming.seoDescription ?? null)) changed.push("seoDescription");
  if (existing.showAds !== (incoming.showAds ?? true)) changed.push("showAds");
  
  if (incoming.status === "PUBLISHED" && !existing.publishedAt) {
    changed.push("publishedAt (will be set)");
  }
  return changed;
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");

  // Optional slug filtering: e.g. --slugs=foo,bar
  const slugsArg = args.find((a) => a.startsWith("--slugs="));
  const filterSlugs = slugsArg
    ? slugsArg.replace("--slugs=", "").split(",").map((s) => s.trim()).filter(Boolean)
    : null;

  const dbHost = getMaskedDbHost(process.env.DATABASE_URL);
  console.log(`Database Host: ${dbHost}`);
  console.log(`Mode: ${isDryRun ? "DRY RUN (read-only, no changes will be written)" : "LIVE EXECUTION (upserting to database)"}\n`);

  const updatesDir = path.join(process.cwd(), "content", "updates-fixed");
  if (!fs.existsSync(updatesDir)) {
    console.error(`Directory not found: ${updatesDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(updatesDir)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const validatedPosts: { file: string; data: UpdatePostInput }[] = [];

  // Step 1: Read and validate all files against zod schema
  for (const file of files) {
    const filePath = path.join(updatesDir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    let json: any;
    try {
      json = JSON.parse(raw);
    } catch (err: any) {
      console.error(`Invalid JSON in ${file}:`, err.message);
      process.exit(1);
    }

    const parseResult = updatePostSchema.safeParse(json);
    if (!parseResult.success) {
      console.error(`Validation failed for ${file}:`, parseResult.error.format());
      process.exit(1);
    }

    const data = parseResult.data;
    if (filterSlugs && !filterSlugs.includes(data.slug)) {
      continue;
    }

    validatedPosts.push({ file, data });
  }

  console.log(`Loaded and validated ${validatedPosts.length} posts from ${updatesDir}.\n`);

  if (isDryRun) {
    console.log("------------------------------------------------------------------------------------------------------------------------");
    console.log(`| ${"Slug".padEnd(52)} | ${"In DB?".padEnd(8)} | ${"DB Status".padEnd(10)} | ${"File Status".padEnd(11)} | Changed Fields`);
    console.log("------------------------------------------------------------------------------------------------------------------------");

    for (const { data } of validatedPosts) {
      const existing = await prisma.updatePost.findUnique({
        where: { slug: data.slug },
      });

      const inDb = existing ? "Yes" : "No";
      const dbStatus = existing ? existing.status : "-";
      const fileStatus = data.status;
      const changed = existing
        ? detectChangedFields(existing, data).join(", ") || "none"
        : "NEW RECORD (all fields)";

      console.log(
        `| ${data.slug.padEnd(52)} | ${inDb.padEnd(8)} | ${dbStatus.padEnd(10)} | ${fileStatus.padEnd(11)} | ${changed}`
      );
    }
    console.log("------------------------------------------------------------------------------------------------------------------------\n");
    console.log("Dry run complete. No database records were modified.");
    return;
  }

  // Live upsert mode (Phase 2)
  console.log(`Applying updates for ${validatedPosts.length} posts...\n`);

  for (const { data } of validatedPosts) {
    const existing = await prisma.updatePost.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      // Keep existing publishedAt if present; set publishedAt only when file is PUBLISHED and DB row has none
      const publishedAt =
        existing.publishedAt ??
        (data.status === "PUBLISHED"
          ? data.publishedAt
            ? new Date(data.publishedAt)
            : new Date()
          : null);

      await prisma.updatePost.update({
        where: { slug: data.slug },
        data: {
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
          publishedAt,
        },
      });
      console.log(`[UPDATED] ${data.slug} (${data.status})`);
    } else {
      const publishedAt =
        data.status === "PUBLISHED"
          ? data.publishedAt
            ? new Date(data.publishedAt)
            : new Date()
          : null;

      await prisma.updatePost.create({
        data: {
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
          publishedAt,
        },
      });
      console.log(`[CREATED] ${data.slug} (${data.status})`);
    }
  }

  console.log("\nUpsert operation completed successfully.\n");

  // Read back and print the final table
  console.log("Reading back records from database...\n");
  const targetSlugs = validatedPosts.map((p) => p.data.slug);
  const dbRecords = await prisma.updatePost.findMany({
    where: { slug: { in: targetSlugs } },
    select: {
      slug: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
    },
    orderBy: { slug: "asc" },
  });

  console.log("----------------------------------------------------------------------------------------------------------------------------------");
  console.log(`| ${"Slug".padEnd(52)} | ${"Status".padEnd(10)} | ${"PublishedAt".padEnd(28)} | ${"UpdatedAt".padEnd(28)} |`);
  console.log("----------------------------------------------------------------------------------------------------------------------------------");

  let publishedCount = 0;
  let draftCount = 0;

  for (const r of dbRecords) {
    if (r.status === "PUBLISHED") publishedCount++;
    if (r.status === "DRAFT") draftCount++;

    const pubStr = r.publishedAt ? r.publishedAt.toISOString() : "null";
    const upStr = r.updatedAt ? r.updatedAt.toISOString() : "null";
    console.log(
      `| ${r.slug.padEnd(52)} | ${r.status.padEnd(10)} | ${pubStr.padEnd(28)} | ${upStr.padEnd(28)} |`
    );
  }
  console.log("----------------------------------------------------------------------------------------------------------------------------------");
  console.log(`\nSummary: Total = ${dbRecords.length} | PUBLISHED = ${publishedCount} | DRAFT = ${draftCount}`);
}

main()
  .catch((err) => {
    console.error("Execution failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
