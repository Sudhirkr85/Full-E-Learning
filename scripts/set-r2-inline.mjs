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
    localPath: "C:/Users/Orange/Downloads/New folder/Bihar NMMS 2024 Question Paper with Answer Key.pdf",
    key: "pyq/bihar-nmms-2024-question-paper-answer-key.pdf",
  },
  {
    localPath: "C:/Users/Orange/Downloads/New folder/Bihar NMMS 2023 Question Paper with Answer Key.pdf",
    key: "pyq/bihar-nmms-2023-question-paper-answer-key.pdf",
  },
  {
    localPath: "C:/Users/Orange/Downloads/New folder/Bihar NMMS 2019 Question Paper with Answer Key.pdf",
    key: "pyq/bihar-nmms-2019-question-paper-answer-key.pdf",
  },
];

async function main() {
  for (const item of filesToUpload) {
    console.log(`Setting Content-Disposition to inline for ${item.key}...`);
    const fileBuffer = fs.readFileSync(item.localPath);

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: item.key,
      Body: fileBuffer,
      ContentType: "application/pdf",
      ContentDisposition: `inline`,
    });

    await r2Client.send(command);
    console.log(`Success: ${publicUrl}/${item.key}`);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
