import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

/**
 * Takes a shop photograph and puts it in the bucket.
 *
 * The image travels to this site and this site writes it, rather than the
 * browser being handed a presigned URL and writing to the bucket itself.
 * That earlier arrangement failed here in a way nothing outside the browser
 * could see: the function issued a URL, the browser reported only "Failed to
 * fetch", and the bucket's own CORS rules checked out from every angle. A
 * request that never crosses an origin cannot fail that way.
 *
 * What direct-to-bucket bought was avoiding the function's request-body
 * limit, and that limit is not close: these images are redrawn to 1200px
 * WebP in the browser first, which lands around 150KB against a ceiling of
 * 4.5MB.
 */

/** Verified over the REST API rather than firebase-admin, whose auth subpath
    crashes on Vercel's serverless runtime. */
async function isOwner(idToken: string): Promise<boolean> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const owner = (process.env.NEXT_PUBLIC_OWNER_EMAIL || "").toLowerCase();
  if (!apiKey || !owner || !idToken) return false;
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
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request): Promise<NextResponse> {
  const contentType = (request.headers.get("content-type") || "").split(";")[0];
  if (!ALLOWED.has(contentType)) {
    return NextResponse.json({ error: "unsupported-type" }, { status: 400 });
  }
  if (!(await isOwner(request.headers.get("x-id-token") || ""))) {
    return NextResponse.json({ error: "not-owner" }, { status: 403 });
  }

  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    return NextResponse.json({ error: "storage-not-configured" }, { status: 501 });
  }

  const bytes = new Uint8Array(await request.arrayBuffer());
  if (bytes.byteLength === 0) {
    return NextResponse.json({ error: "empty" }, { status: 400 });
  }
  if (bytes.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "too-large" }, { status: 413 });
  }

  const ext =
    contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const key = `shops/${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  try {
    // forcePathStyle: R2 is addressed as endpoint/bucket/key. Left to itself
    // the SDK folds the bucket into the hostname, which is a second thing
    // that has to be right for no benefit here.
    const s3 = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint,
      forcePathStyle: true,
      credentials: { accessKeyId, secretAccessKey },
    });
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: bytes,
        ContentType: contentType,
      }),
    );
  } catch (err) {
    // The bucket's own words, so a rejected key or a wrong permission says
    // which it was instead of arriving as an unexplained failure.
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: "bucket-refused", message }, { status: 502 });
  }

  // The key, not a URL: the record stores the key so the host can change.
  return NextResponse.json({ key });
}
