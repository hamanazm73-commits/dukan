import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Firebase, only if it has been configured.
 *
 * The public site has to keep working with no credentials at all — that is
 * what lets the search be developed and demonstrated before anyone has set up
 * a project. So nothing here throws when the variables are missing; callers
 * check `firebaseEnabled` and fall back to the seed shops.
 */
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(
  config.apiKey && config.projectId && config.appId,
);

/** The account allowed into the dashboard. */
export const OWNER_EMAIL = (
  process.env.NEXT_PUBLIC_OWNER_EMAIL || ""
).toLowerCase();

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function ensure(): FirebaseApp | null {
  if (!firebaseEnabled) return null;
  if (!app) app = getApps().length ? getApp() : initializeApp(config);
  return app;
}

export function getAuthOrNull(): Auth | null {
  const a = ensure();
  if (!a) return null;
  if (!authInstance) authInstance = getAuth(a);
  return authInstance;
}

export function getDbOrNull(): Firestore | null {
  const a = ensure();
  if (!a) return null;
  if (!dbInstance) dbInstance = getFirestore(a);
  return dbInstance;
}

/** Firestore collection holding the shops. */
export const SHOPS_COLLECTION =
  process.env.NEXT_PUBLIC_SHOPS_COLLECTION || "shops";
