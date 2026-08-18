/**
 * Where a stored photograph is actually served from.
 *
 * Records keep the key inside the bucket — `shops/abc123.webp` — not a full
 * URL, so the host can change without rewriting every shop. Anything that
 * already looks like a URL is passed through untouched, which is what makes
 * it safe to call on a field that might hold either.
 */
const PUBLIC = (process.env.NEXT_PUBLIC_S3_PUBLIC_URL || "").replace(/\/+$/, "");

export function mediaSrc(key: string): string {
  if (!key) return "";
  if (/^(https?:|data:|blob:|\/)/i.test(key)) return key;
  return PUBLIC ? `${PUBLIC}/${key}` : key;
}
