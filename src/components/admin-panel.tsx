"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Loader2,
  LogOut,
  Lock,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { CATEGORIES, CITY_NAMES, type CityKey, type Shop } from "@/lib/data";
import { firebaseEnabled } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import {
  createShop,
  deleteShop,
  loadShops,
  updateShop,
  type ShopDraft,
} from "@/lib/shops-repo";
import { BrandMark } from "./brand-mark";

const CITY_KEYS = Object.keys(CITY_NAMES) as CityKey[];

const EMPTY: ShopDraft = {
  name: { ku: "", ar: "", en: "" },
  category: CATEGORIES[0].key,
  city: "erbil",
  phone: "",
  whatsapp: "",
  tags: [],
};

export function AdminPanel() {
  const { user, loading, isOwner, login, logout } = useAuth();

  if (!firebaseEnabled) return <NotConfigured />;
  if (loading)
    return (
      <div className="grid min-h-dvh place-items-center">
        <Loader2 className="size-7 animate-spin text-muted-foreground" />
      </div>
    );
  if (!user || !isOwner) return <LoginScreen onLogin={login} />;

  return <Dashboard onLogout={logout} email={user.email ?? ""} />;
}

/** Says exactly what is missing, rather than showing a login that cannot work. */
function NotConfigured() {
  return (
    <main className="mx-auto grid min-h-dvh max-w-md place-items-center px-5">
      <div className="w-full rounded-2xl border border-border bg-card p-7 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-accent">
          <AlertTriangle className="size-6 text-gold-foreground" />
        </span>
        <h1 className="mt-4 text-lg font-bold">Firebase ڕێک نەخراوە</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          بۆ زیادکردنی دووکان، ئەم گۆڕاوانە پێویستن لە Vercel:
        </p>
        <ul dir="ltr" className="mt-3 space-y-1 text-start text-xs text-muted-foreground">
          {[
            "NEXT_PUBLIC_FIREBASE_API_KEY",
            "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
            "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
            "NEXT_PUBLIC_FIREBASE_APP_ID",
            "NEXT_PUBLIC_OWNER_EMAIL",
          ].map((k) => (
            <li key={k} className="rounded-md bg-muted px-2 py-1 font-mono">
              {k}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function LoginScreen({
  onLogin,
}: {
  onLogin: (e: string, p: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(
        err instanceof Error && err.message === "not-owner"
          ? "ئەم ئیمەیڵە ڕێگەی پێنەدراوە."
          : "ئیمەیڵ یان وشەی نهێنی هەڵەیە.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-dvh max-w-sm place-items-center px-5">
      <form onSubmit={submit} className="w-full">
        <div className="mb-6 flex flex-col items-center text-center">
          <BrandMark className="size-14" />
          <h1 className="mt-3 text-xl font-bold">بەڕێوەبردنی دووکان</h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3" /> تەنها خاوەنی سایتەکە
          </p>
        </div>

        <label className="mb-3 block">
          <span className="mb-1.5 block text-xs font-semibold">ئیمەیڵ</span>
          <input
            type="email"
            dir="ltr"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-card px-3 outline-none focus:border-gold"
          />
        </label>
        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs font-semibold">وشەی نهێنی</span>
          <input
            type="password"
            dir="ltr"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-card px-3 outline-none focus:border-gold"
          />
        </label>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          چوونەژوورەوە
        </button>
      </form>
    </main>
  );
}

function Dashboard({
  onLogout,
  email,
}: {
  onLogout: () => Promise<void>;
  email: string;
}) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Shop | "new" | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const r = await loadShops();
    setShops(r.shops);
    setLive(r.live);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-20 pt-6">
      <header className="mb-5 flex items-center gap-3">
        <BrandMark className="size-10" />
        <div className="min-w-0 flex-1">
          <h1 className="font-bold leading-tight">بەڕێوەبردن</h1>
          <p dir="ltr" className="truncate text-xs text-muted-foreground">
            {email}
          </p>
        </div>
        <button
          onClick={() => void onLogout()}
          className="grid size-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted"
          aria-label="دەرچوون"
        >
          <LogOut className="size-4" />
        </button>
      </header>

      {!live && !loading && (
        <p className="mb-4 rounded-xl border border-gold/40 bg-accent/50 px-3 py-2.5 text-xs leading-relaxed">
          ئەمانەی خوارەوە دووکانی نموونەن، لە کۆدەکەوە دێن. یەکەم دووکانی
          ڕاستەقینە کە زیاد بکەیت، شوێنیان دەگرێتەوە.
        </p>
      )}

      <button
        onClick={() => setEditing("new")}
        className="mb-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground"
      >
        <Plus className="size-4" /> دووکانێکی نوێ
      </button>

      {loading ? (
        <div className="grid place-items-center py-10">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ul className="grid gap-2">
          {shops.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{s.name.ku}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {CATEGORIES.find((c) => c.key === s.category)?.label.ku} —{" "}
                  {CITY_NAMES[s.city].ku}
                </p>
              </div>
              {live && (
                <>
                  <button
                    onClick={() => setEditing(s)}
                    aria-label="دەستکاری"
                    className="grid size-9 place-items-center rounded-lg border border-border transition-colors hover:bg-muted"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`«${s.name.ku}» بسڕدرێتەوە؟`)) return;
                      await deleteShop(s.id);
                      void refresh();
                    }}
                    aria-label="سڕینەوە"
                    className="grid size-9 place-items-center rounded-lg border border-border text-red-600 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <ShopForm
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void refresh();
          }}
        />
      )}
    </main>
  );
}

function ShopForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: Shop | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [d, setD] = useState<ShopDraft>(() =>
    initial
      ? {
          name: { ...initial.name },
          category: initial.category,
          city: initial.city,
          district: initial.district,
          phone: initial.phone,
          whatsapp: initial.whatsapp ?? "",
          tags: initial.tags ?? [],
        }
      : { ...EMPTY, name: { ku: "", ar: "", en: "" }, tags: [] },
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      // Firestore rejects undefined; send only what was filled in.
      const clean: ShopDraft = {
        ...d,
        name: {
          ku: d.name.ku.trim(),
          ar: d.name.ar.trim() || d.name.ku.trim(),
          en: d.name.en.trim() || d.name.ku.trim(),
        },
        phone: d.phone.trim(),
        whatsapp: d.whatsapp?.trim() || "",
        tags: (d.tags ?? []).map((t) => t.trim()).filter(Boolean),
      };
      if (initial) await updateShop(initial.id, clean);
      else await createShop(clean);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "هەڵەیەک ڕوویدا");
      setBusy(false);
    }
  }

  const field =
    "h-12 w-full rounded-xl border border-border bg-card px-3 outline-none focus:border-gold";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={save}
        className="mx-auto w-full max-w-lg rounded-2xl border border-border bg-background p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">
            {initial ? "دەستکاریی دووکان" : "دووکانێکی نوێ"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="داخستن"
            className="grid size-9 place-items-center rounded-lg border border-border"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="grid gap-3">
          <label>
            <span className="mb-1.5 block text-xs font-semibold">
              ناوی دووکان (کوردی) *
            </span>
            <input
              required
              value={d.name.ku}
              onChange={(e) => setD({ ...d, name: { ...d.name, ku: e.target.value } })}
              className={field}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-xs font-semibold">بە عەرەبی</span>
              <input
                value={d.name.ar}
                onChange={(e) => setD({ ...d, name: { ...d.name, ar: e.target.value } })}
                className={field}
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-semibold">بە ئینگلیزی</span>
              <input
                dir="ltr"
                value={d.name.en}
                onChange={(e) => setD({ ...d, name: { ...d.name, en: e.target.value } })}
                className={field}
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-xs font-semibold">جۆر *</span>
              <select
                value={d.category}
                onChange={(e) => setD({ ...d, category: e.target.value })}
                className={field}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label.ku}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-semibold">شار *</span>
              <select
                value={d.city}
                onChange={(e) => setD({ ...d, city: e.target.value as CityKey })}
                className={field}
              >
                {CITY_KEYS.map((c) => (
                  <option key={c} value={c}>
                    {CITY_NAMES[c].ku}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <span className="mb-1.5 block text-xs font-semibold">
              گەڕەک / ناونیشان
            </span>
            <input
              value={d.district?.ku ?? ""}
              onChange={(e) =>
                setD({
                  ...d,
                  district: {
                    ku: e.target.value,
                    ar: e.target.value,
                    en: e.target.value,
                  },
                })
              }
              className={field}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-xs font-semibold">تەلەفۆن *</span>
              <input
                required
                dir="ltr"
                inputMode="tel"
                placeholder="+964 750 000 0000"
                value={d.phone}
                onChange={(e) => setD({ ...d, phone: e.target.value })}
                className={field}
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-semibold">واتساپ</span>
              <input
                dir="ltr"
                inputMode="tel"
                placeholder="9647500000000"
                value={d.whatsapp ?? ""}
                onChange={(e) => setD({ ...d, whatsapp: e.target.value })}
                className={field}
              />
            </label>
          </div>

          <label>
            <span className="mb-1.5 block text-xs font-semibold">
              وشەی گەڕان — بە کۆما جیایان بکەرەوە
            </span>
            <input
              placeholder="ئایفۆن, شارژەر, iphone, تعمير"
              value={(d.tags ?? []).join(", ")}
              onChange={(e) => setD({ ...d, tags: e.target.value.split(",") })}
              className={field}
            />
            <span className="mt-1.5 block text-[0.7rem] leading-relaxed text-muted-foreground">
              هەر وشەیەک کە کڕیار لەوانەیە بینووسێت بۆ دۆزینەوەی ئەم دووکانە.
              جۆرەکە خۆی وشەکانی خۆی هەیە — ئەمە بۆ ئەو شتانەیە کە تایبەتن بەم
              دووکانە.
            </span>
          </label>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          پاشەکەوتکردن
        </button>
      </form>
    </div>
  );
}
