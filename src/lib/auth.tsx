"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { OWNER_EMAIL, firebaseEnabled, getAuthOrNull } from "./firebase";

/**
 * Who is allowed into the dashboard.
 *
 * One account, named in NEXT_PUBLIC_OWNER_EMAIL. Anyone else who manages to
 * sign in is signed straight back out — Firebase auth is happy to accept any
 * account in the project, and this site only has one person who should be
 * writing to it.
 *
 * This is a client-side gate over a client SDK, so the real protection is the
 * Firestore security rules, not this. It decides what the screen shows; the
 * rules decide what the database accepts.
 */

interface AuthValue {
  user: User | null;
  loading: boolean;
  isOwner: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthOrNull();
    if (!auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const auth = getAuthOrNull();
    if (!auth) throw new Error("Firebase is not configured");
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (
      OWNER_EMAIL &&
      cred.user.email?.toLowerCase() !== OWNER_EMAIL
    ) {
      await signOut(auth);
      throw new Error("not-owner");
    }
  }, []);

  const logout = useCallback(async () => {
    const auth = getAuthOrNull();
    if (auth) await signOut(auth);
  }, []);

  const isOwner = Boolean(
    firebaseEnabled &&
      user &&
      (!OWNER_EMAIL || user.email?.toLowerCase() === OWNER_EMAIL),
  );

  return (
    <Ctx.Provider value={{ user, loading, isOwner, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
