/**
 * Where a stored photograph is served from.
 *
 * Records keep the key inside the bucket — `shops/abc123.webp` — never a
 * full URL, and it is served back through this site's own /api/img. That
 * means the bucket stays private, its address never appears on a page, and
 * the host behind it can change without touching a single record.
 *
 * Anything that already looks like a URL passes through untouched, which is
 * what makes this safe to call on a field that might hold either.
 */
export function mediaSrc(key: string | undefined): string {
  if (!key) return "";
  if (/^(https?:|data:|blob:)/i.test(key)) return key;
  return `/api/img/${key.replace(/^\/+/, "")}`;
}
