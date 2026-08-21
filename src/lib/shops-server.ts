import type { CityKey, Shop } from "./data";

/**
 * Reading shops on the server.
 *
 * `shops-repo.ts` is a client module — it holds the Firestore browser SDK —
 * so a page that has to exist before the browser does cannot use it. A shop's
 * own page is exactly that: it is the only thing on this site a search engine
 * can index, and a search engine does not run JavaScript on a page it has not
 * decided to keep yet. The words have to be in the HTML.
 *
 * Firestore's REST API needs no SDK and no key: the rules already allow
 * anyone to read shops, which is what makes the site work in a browser at
 * all. This just asks over HTTP instead.
 */

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const COLLECTION = process.env.NEXT_PUBLIC_SHOPS_COLLECTION || "shops";
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

/** Firestore wraps every value in a type tag; this unwraps one. */
type FsValue = {
  stringValue?: string;
  integerValue?: string;
  booleanValue?: boolean;
  mapValue?: { fields?: Record<string, FsValue> };
  arrayValue?: { values?: FsValue[] };
};

function plain(v: FsValue): unknown {
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.mapValue) return unwrap(v.mapValue.fields ?? {});
  if (v.arrayValue) return (v.arrayValue.values ?? []).map(plain);
  return undefined;
}

function unwrap(fields: Record<string, FsValue>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) out[k] = plain(v);
  return out;
}

interface FsDoc {
  name: string;
  fields?: Record<string, FsValue>;
}

function toShop(doc: FsDoc): Shop | null {
  const id = doc.name.split("/").pop();
  if (!id || !doc.fields) return null;
  const d = unwrap(doc.fields) as Omit<Shop, "id">;
  // A record with no name is a record nobody can be shown.
  if (!d.name || typeof d.name !== "object") return null;
  return { ...d, id } as Shop;
}

/** Every shop, for the sitemap and for the pages built ahead of time. */
export async function listShops(): Promise<Shop[]> {
  if (!PROJECT) return [];
  try {
    const res = await fetch(`${BASE}/${COLLECTION}?pageSize=300`, {
      // An hour: shops change when an owner edits one, and a page that is a
      // day stale is worse than a read every hour is expensive.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const { documents } = (await res.json()) as { documents?: FsDoc[] };
    return (documents ?? []).map(toShop).filter((s): s is Shop => s !== null);
  } catch {
    return [];
  }
}

/** One shop, or null when there is no such shop. */
export async function getShop(id: string): Promise<Shop | null> {
  if (!PROJECT) return null;
  try {
    const res = await fetch(`${BASE}/${COLLECTION}/${encodeURIComponent(id)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return toShop((await res.json()) as FsDoc);
  } catch {
    return null;
  }
}

/** Shops in the same city, for the row at the bottom of a shop's page. */
export async function nearbyShops(
  city: CityKey,
  exceptId: string,
  limit = 6,
): Promise<Shop[]> {
  const all = await listShops();
  return all.filter((s) => s.city === city && s.id !== exceptId).slice(0, limit);
}
