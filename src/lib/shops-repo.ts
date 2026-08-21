"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { SHOPS, type Shop } from "./data";
import { SHOPS_COLLECTION, firebaseEnabled, getDbOrNull } from "./firebase";

/**
 * Where the shops come from.
 *
 * Firestore when it is configured, the seed list otherwise, and the seed
 * again if a live read fails — the search is the whole site, so it has to
 * return something rather than an error page. A failed read is logged and
 * degraded, never thrown at the visitor.
 */

/** Everything except the id, which Firestore assigns. */
export type ShopDraft = Omit<Shop, "id">;

/**
 * Drop keys holding nothing.
 *
 * Firestore refuses `undefined` outright — not as an empty value but as an
 * error that fails the whole write. A form opened on a record that never had
 * an optional field hands one over without meaning to: the key is there, the
 * value is not. That cost a save with "Unsupported field value: undefined
 * (found in field district)" once, and the next optional field added upstream
 * would have done it again. Cleared here so one forgotten field cannot fail
 * the write.
 */
function defined<T extends object>(data: T): T {
  return Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined),
  ) as T;
}

export async function loadShops(): Promise<{ shops: Shop[]; live: boolean }> {
  const db = getDbOrNull();
  if (!firebaseEnabled || !db) return { shops: SHOPS, live: false };

  try {
    const snap = await getDocs(
      query(collection(db, SHOPS_COLLECTION), orderBy("name.ku")),
    );
    // An empty collection means nobody has added a shop yet; show the seed
    // rather than an empty site.
    if (snap.empty) return { shops: SHOPS, live: false };
    const shops = snap.docs.map(
      (d) => ({ id: d.id, ...(d.data() as ShopDraft) }) as Shop,
    );
    return { shops, live: true };
  } catch (e) {
    console.error("[shops] live read failed, falling back to seed:", e);
    return { shops: SHOPS, live: false };
  }
}

export async function createShop(draft: ShopDraft): Promise<string> {
  const db = getDbOrNull();
  if (!db) throw new Error("Firebase is not configured");
  const ref = await addDoc(collection(db, SHOPS_COLLECTION), defined(draft));
  return ref.id;
}

export async function updateShop(
  id: string,
  patch: Partial<ShopDraft>,
): Promise<void> {
  const db = getDbOrNull();
  if (!db) throw new Error("Firebase is not configured");
  await updateDoc(doc(db, SHOPS_COLLECTION, id), defined(patch));
}

export async function deleteShop(id: string): Promise<void> {
  const db = getDbOrNull();
  if (!db) throw new Error("Firebase is not configured");
  await deleteDoc(doc(db, SHOPS_COLLECTION, id));
}
