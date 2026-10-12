import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET;
const publicUrl = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

console.log("R2 Config Check:");
console.log("- Bucket:", bucket);
console.log("- Public URL:", publicUrl);

if (!endpoint || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
  console.error("Missing R2 credentials in .env!");
  process.exit(1);
}

const r2Client = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const filesToUpload = [
  {
    localPath: "public/pyq/bihar-nmms-2024-question-paper-answer-key.pdf",
    key: "pyq/bihar-nmms-2024-question-paper-answer-key.pdf",
    slug: "bihar-nmms-2024-question-paper-answer-key-pdf",
  },
  {
    localPath: "public/pyq/bihar-nmms-2023-question-paper-answer-key.pdf",
    key: "pyq/bihar-nmms-2023-question-paper-answer-key.pdf",
    slug: "bihar-nmms-2023-question-paper-answer-key-pdf",
  },
  {
    localPath: "public/pyq/bihar-nmms-2019-question-paper-answer-key.pdf",
    key: "pyq/bihar-nmms-2019-question-paper-answer-key.pdf",
    slug: "bihar-nmms-2019-question-paper-answer-key-pdf",
  },
];

async function main() {
  const uploadedUrls = {};

  for (const item of filesToUpload) {
    console.log(`\nUploading ${item.localPath} to R2 key '${item.key}'...`);
    const fileBuffer = fs.readFileSync(item.localPath);
    console.log(`File size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: item.key,
      Body: fileBuffer,
      ContentType: "application/pdf",
      ContentDisposition: `attachment; filename="${path.basename(item.localPath)}"`,
    });

    await r2Client.send(command);
    const cdnUrl = `${publicUrl}/${item.key}`;
    uploadedUrls[item.slug] = cdnUrl;
    console.log(`Success! Public CDN URL: ${cdnUrl}`);
  }

  console.log("\nAll files uploaded successfully to Cloudflare R2!");
  console.log(JSON.stringify(uploadedUrls, null, 2));
}

main().catch((err) => {
  console.error("Upload error:", err);
  process.exit(1);
});
