import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const runtime = "nodejs";

/**
 * A short-lived presigned PUT so the browser sends a shop photograph
 * straight to the bucket.
 *
 * Straight to the bucket, not through here: a serverless function has a
 * body limit an image can exceed, and routing bytes through it costs
 * invocation time for nothing. The caller's Firebase ID token is checked
 * first, so only a signed-in owner can ask for one.
 */

/** Verified over the REST API rather than firebase-admin, whose auth subpath
    crashes on Vercel's serverless runtime. */
async function isOwner(idToken: string): Promise<boolean> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const owner = (process.env.NEXT_PUBLIC_OWNER_EMAIL || "").toLowerCase();
  if (!apiKey || !owner) return false;
  if (!idToken) return false;
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      },
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { users?: { email?: string }[] };
    const email = data.users?.[0]?.email?.toLowerCase();
    return !!email && email === owner;
  } catch {
    return false;
  }
}

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request): Promise<NextResponse> {
  let body: { contentType?: string; idToken?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  const contentType = body.contentType ?? "";
  if (!ALLOWED.has(contentType)) {
    return NextResponse.json({ error: "unsupported-type" }, { status: 400 });
  }
  if (!(await isOwner(body.idToken ?? ""))) {
    return NextResponse.json({ error: "not-owner" }, { status: 403 });
  }

  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    return NextResponse.json({ error: "storage-not-configured" }, { status: 501 });
  }

  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const key = `shops/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const s3 = new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });

  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: 300 },
  );

  // The key, not the URL: the record stores the key so the host can change.
  return NextResponse.json({ url, key });
}
