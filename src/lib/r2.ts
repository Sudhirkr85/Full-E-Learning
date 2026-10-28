import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const R2_BUCKET = process.env.R2_BUCKET!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

/**
 * Upload a file buffer to Cloudflare R2.
 * @returns The public URL of the uploaded file.
 */
export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Generate a presigned URL to upload a file to Cloudflare R2 directly from the client.
 */
export async function getUploadPresignedUrl(
  key: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(r2Client, command, { expiresIn: 900 });
}

/**
 * Generate a presigned URL to view/download a file from Cloudflare R2 directly.
 */
export async function getDownloadPresignedUrl(
  key: string
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });

  return await getSignedUrl(r2Client, command, { expiresIn: 900 });
}

/**
 * Read an object directly from Cloudflare R2 as a Buffer using S3 credentials.
 * Server-only helper: keeps PDF bucket private and avoids leaking public R2 URLs.
 */
export async function getR2ObjectBuffer(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });

  const response = await r2Client.send(command);

  if (!response.Body) {
    throw new Error(`R2 object Body is empty for key: ${key}`);
  }

  if (typeof (response.Body as any).transformToByteArray === "function") {
    const bytes = await (response.Body as any).transformToByteArray();
    return Buffer.from(bytes);
  }

  const chunks: Buffer[] = [];
  for await (const chunk of response.Body as any) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
