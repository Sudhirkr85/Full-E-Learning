import fs from "fs";
import path from "path";
import dns from "node:dns";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

dotenv.config();

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET;
const publicUrl = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
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

const BRANDED_DIR = "C:\\Users\\Orange\\Downloads\\New folder\\01_NMMS_Previous_Year_Question_Papers\\Sagar_Sir_Branded_PYQs";
const MANIFEST_PATH = "scripts/uploaded_r2_manifest.json";

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadFileWithRetry(localPath, key, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const fileBuffer = fs.readFileSync(localPath);
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: "application/pdf",
        ContentDisposition: "inline",
      });
      await r2Client.send(command);
      return true;
    } catch (err) {
      console.warn(` [Attempt ${attempt}/${retries}] Failed to upload ${key}: ${err.message}`);
      if (attempt < retries) {
        await sleep(2000);
      } else {
        throw err;
      }
    }
  }
}

async function uploadAll() {
  const allFiles = fs.readdirSync(BRANDED_DIR).filter(f => f.toLowerCase().endsWith(".pdf"));
  console.log(`Total branded PDFs in folder: ${allFiles.length}`);

  let results = [];
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      results = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    } catch {}
  }

  const uploadedSet = new Set(results.map(r => r.fname));
  console.log(`Already uploaded: ${uploadedSet.size}/${allFiles.length}`);

  for (let i = 0; i < allFiles.length; i++) {
    const fname = allFiles[i];
    if (uploadedSet.has(fname)) {
      continue;
    }

    const localPath = path.join(BRANDED_DIR, fname);
    const key = `pyq/branded/${fname}`;
    const stats = fs.statSync(localPath);
    const sizeMb = (stats.size / 1024 / 1024).toFixed(2);

    console.log(`[${i + 1}/${allFiles.length}] Uploading ${fname} (${sizeMb} MB)...`);

    try {
      await uploadFileWithRetry(localPath, key, 4);
      const url = `${publicUrl}/${key}`;
      results.push({ fname, key, url, sizeMb });
      uploadedSet.add(fname);
      fs.writeFileSync(MANIFEST_PATH, JSON.stringify(results, null, 2));
      console.log(` -> Done: ${url}`);
    } catch (err) {
      console.error(` -> Failed permanently for ${fname}:`, err);
    }

    // Small delay between uploads
    await sleep(500);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(results, null, 2));
  console.log(`\n🎉 Total uploaded to Cloudflare R2: ${results.length}/${allFiles.length}`);
}

uploadAll().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
