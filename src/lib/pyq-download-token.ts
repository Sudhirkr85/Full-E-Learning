import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "sagar-coaching-secret-key-pyq-2026";

export function generateDownloadToken(slug: string): string {
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity
  const payload = `${slug}:${expiresAt}`;
  const signature = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

export function verifyDownloadToken(token: string, expectedSlug: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [slug, expiresAtStr, signature] = decoded.split(":");
    if (!slug || !expiresAtStr || !signature) return false;
    if (slug !== expectedSlug) return false;

    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) return false; // Token expired

    const expectedPayload = `${slug}:${expiresAtStr}`;
    const expectedSig = crypto.createHmac("sha256", SECRET).update(expectedPayload).digest("hex");

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
  } catch {
    return false;
  }
}
