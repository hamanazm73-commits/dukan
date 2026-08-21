"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Loader2,
  LogOut,
  Lock,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { CATEGORIES, CITY_NAMES, type CityKey, type Shop } from "@/lib/data";
import { firebaseEnabled, getAuthOrNull } from "@/lib/firebase";
import { mediaSrc } from "@/lib/media";
import { normalize } from "@/lib/normalize";
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
  const [filter, setFilter] = useState("");
  /** The row whose delete is armed, if any. */
  const [armed, setArmed] = useState<string | null>(null);

  // An armed row disarms itself. Nobody should come back to a screen left
  // open and find a delete button waiting under their thumb.
  useEffect(() => {
    if (!armed) return;
    const id = setTimeout(() => setArmed(null), 4000);
    return () => clearTimeout(id);
  }, [armed]);

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

  /**
   * The rows the filter leaves.
   *
   * Matched against the same three things a person would remember a shop by
   * — its name, its city, its trade — rather than only the name. `normalize`
   * is the one the site's own search uses, so typing here behaves the way
   * typing on the front page does.
   */
  const visible = useMemo(() => {
    const q = normalize(filter.trim());
    if (!q) return shops;
    return shops.filter((s) => {
      const city = CITY_NAMES[s.city];
      const cat = CATEGORIES.find((c) => c.key === s.category);
      return normalize(
        [
          s.name.ku,
          s.name.ar,
          s.name.en,
          city?.ku,
          city?.ar,
          cat?.label.ku,
          ...(s.tags ?? []),
        ]
          .filter(Boolean)
          .join(" "),
      ).includes(q);
    });
  }, [shops, filter]);

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

      {/* Not live means the read fell through to the seed list, and the seed
          list is empty now — so this says the database is unreachable rather
          than describing sample shops that no longer exist. */}
      {!live && !loading && shops.length === 0 && (
        <p className="mb-4 rounded-xl border border-gold/40 bg-accent/50 px-3 py-2.5 text-xs leading-relaxed">
          هێشتا هیچ دووکانێک نییە. یەکەمیان زیاد بکە.
        </p>
      )}

      <button
        onClick={() => setEditing("new")}
        className="mb-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground"
      >
        <Plus className="size-4" /> دووکانێکی نوێ
      </button>

      {/* A filter, not a search. It runs over the list already on screen —
          the point is to reach one row out of a hundred without scrolling
          for it, and it matches the name, the city and the category because
          those are the three things you would remember a shop by. */}
      {!loading && shops.length > 6 && (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-border bg-card px-3">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            type="search"
            placeholder="بگەڕێ لە نێو دووکانەکاندا"
            aria-label="پاڵاوتنی لیستەکە"
            className="h-11 w-full bg-transparent text-sm outline-none"
          />
        </div>
      )}

      {!loading && (
        <p className="mb-3 text-xs text-muted-foreground">
          {filter
            ? `${visible.length} لە ${shops.length} دووکان`
            : `${shops.length} دووکان`}
        </p>
      )}

      {loading ? (
        <div className="grid place-items-center py-10">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : visible.length === 0 ? (
        <p className="rounded-xl border border-border bg-card px-3 py-6 text-center text-sm text-muted-foreground">
          هیچ دووکانێک بەم ناوە نییە.
        </p>
      ) : (
        <ul className="grid gap-2">
          {visible.map((s) => (
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
                  {/* Two presses, not a browser confirm. The dialog is easy
                      to dismiss without reading and this cannot be undone —
                      Firestore keeps no copy. Arming the row states the name
                      in place and steps back on its own after four seconds,
                      so a stray tap costs nothing. */}
                  {armed === s.id ? (
                    <button
                      onClick={async () => {
                        setArmed(null);
                        await deleteShop(s.id);
                        void refresh();
                      }}
                      className="h-9 shrink-0 rounded-lg bg-red-600 px-3 text-xs font-bold text-white"
                    >
                      بیسڕەوە
                    </button>
                  ) : (
                    <button
                      onClick={() => setArmed(s.id)}
                      aria-label={`سڕینەوەی ${s.name.ku}`}
                      className="grid size-9 place-items-center rounded-lg border border-border text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
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
          photo: initial.photo,
          mapUrl: initial.mapUrl,
          opensAt: initial.opensAt,
          closesAt: initial.closesAt,
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
        // Written as an empty map rather than left out. Opening a shop that
        // has no district seeds this field with undefined, and an absent key
        // in an update means "leave it alone" — so omitting it would also
        // make clearing a district impossible.
        district: {
          ku: d.district?.ku?.trim() ?? "",
          ar: d.district?.ar?.trim() ?? "",
          en: d.district?.en?.trim() ?? "",
        },
        phone: d.phone.trim(),
        whatsapp: d.whatsapp?.trim() || "",
        tags: (d.tags ?? []).map((t) => t.trim()).filter(Boolean),
        photo: d.photo || "",
        mapUrl: d.mapUrl?.trim() || "",
        opensAt: d.opensAt || "",
        closesAt: d.closesAt || "",
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

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">
              بەستەری شوێن لە نەخشە
            </span>
            <input
              dir="ltr"
              inputMode="url"
              placeholder="https://maps.app.goo.gl/…"
              value={d.mapUrl ?? ""}
              onChange={(e) => setD({ ...d, mapUrl: e.target.value })}
              className={field}
            />
            <span className="mt-1.5 block text-[0.7rem] leading-relaxed text-muted-foreground">
              لە گووگڵ مەپس شوێنەکە بدۆزەرەوە، Share لێبدە و بەستەرەکە لێرە
              دابنێ. کڕیار کلیکی «ڕێگا» دەکات و مەپسەکەی بۆ دەکرێتەوە.
            </span>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold">کاتی کردنەوە</span>
              <input
                type="time"
                dir="ltr"
                value={d.opensAt ?? ""}
                onChange={(e) => setD({ ...d, opensAt: e.target.value })}
                className={field}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold">کاتی داخستن</span>
              <input
                type="time"
                dir="ltr"
                value={d.closesAt ?? ""}
                onChange={(e) => setD({ ...d, closesAt: e.target.value })}
                className={field}
              />
            </label>
            <span className="text-[0.7rem] leading-relaxed text-muted-foreground sm:col-span-2">
              ئەگەر بەتاڵیان بهێڵیتەوە، هیچ نیشانەیەکی «کراوەیە» پیشان نادرێت.
              ئەوە باشترە لەوەی بە هەڵە بڵێین داخراوە.
            </span>
          </div>

          <PhotoField
            value={d.photo}
            onChange={(photo) => setD({ ...d, photo })}
          />
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

/**
 * The shop's photograph.
 *
 * Shrunk in the browser before it goes anywhere. A photo straight off a
 * phone is four to eight megabytes and three thousand pixels wide; the card
 * shows it about four hundred wide. Sending the original would cost the
 * owner's data to upload and every visitor's data to download, for a picture
 * nobody sees at that size.
 *
 * The upload goes straight to the bucket on a presigned URL, so the image
 * never passes through a serverless function and cannot hit its body limit.
 */
function PhotoField({
  value,
  onChange,
}: {
  value?: string;
  onChange: (key: string | undefined) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pick(file: File) {
    setBusy(true);
    setError("");
    try {
      // Decoding is the one step that fails on the file rather than on the
      // network — an iPhone .heic in a browser that cannot read one. Saying
      // which it was beats an error the owner can do nothing with.
      let blob: Blob;
      try {
        blob = await downscale(file, 1200, 0.82);
      } catch {
        throw new Error("ئەم جۆرە وێنەیە ناخوێنرێتەوە — JPG یان PNG تاقی بکەرەوە.");
      }
      const auth = getAuthOrNull();
      const idToken = (await auth?.currentUser?.getIdToken()) ?? "";

      // One request, to this site. The image used to go to the bucket
      // directly on a presigned URL and the browser reported only "Failed to
      // fetch" — a cross-origin refusal gives no more than that, and the
      // bucket's CORS rules were provably fine. Same origin, no such class
      // of failure.
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": blob.type, "x-id-token": idToken },
        body: blob,
      });
      if (!res.ok) {
        const { error: e, message } = (await res.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };
        // The reason is named rather than summarised. Every refusal used to
        // read "rejected", which is true of all of them and useful for none:
        // a signed-out session, a stranger, and an unconfigured bucket are
        // three different problems with three different answers.
        const why: Record<string, string> = {
          "storage-not-configured": "خەزنکردنی وێنە هێشتا ڕێک نەخراوە.",
          "not-owner": "ئەم هەژمارە ڕێگەی پێنەدراوە — بە ئیمەیڵی خاوەن بچۆ ژوورەوە.",
          "unsupported-type": "ئەم جۆرە وێنەیە پەسەند ناکرێت.",
          "too-large": "وێنەکە زۆر گەورەیە.",
          empty: "فایلەکە بەتاڵە.",
        };
        // The bucket's own words when it is the bucket refusing, since that
        // names a wrong permission or a bad key outright.
        if (e === "bucket-refused") {
          throw new Error(`سەتڵەکە ڕەتیکردەوە: ${message ?? "?"}`);
        }
        throw new Error(
          why[e ?? ""] ?? `بارکردن ڕەت کرایەوە (${res.status} ${e ?? "?"}).`,
        );
      }

      const { key } = (await res.json()) as { key: string };
      onChange(key);
    } catch (err) {
      setError(err instanceof Error ? err.message : "هەڵەیەک ڕوویدا");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="block">
      <span className="mb-1.5 block text-xs font-semibold">وێنەی دووکان</span>

      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* The same 3:2 the card uses, so the owner sees the crop a customer
              will get and can re-shoot if it cuts something. */}
          <img
            src={mediaSrc(value)}
            alt=""
            className="block aspect-[3/2] w-full bg-muted object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            aria-label="لابردنی وێنە"
            className="absolute end-2 top-2 grid size-8 place-items-center rounded-lg bg-black/60 text-white backdrop-blur"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <label
          className={`flex h-28 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm text-muted-foreground transition-colors hover:bg-muted ${
            busy ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" /> بارکردن…
            </>
          ) : (
            <>
              <Plus className="size-4" /> وێنەیەک هەڵبژێرە
            </>
          )}
          <input
            type="file"
            /* Anything the machine calls a picture. Naming three types meant
               Windows greyed out every other file in the dialog — a .jfif
               saved out of a browser, a .heic off a phone, a plain .gif —
               so the photo sat there visible and could not be clicked.
               Whatever comes back is re-encoded below regardless. */
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void pick(f);
              e.target.value = "";
            }}
          />
        </label>
      )}

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      <span className="mt-1.5 block text-[0.7rem] leading-relaxed text-muted-foreground">
        وێنەکە پێش ناردن بچووک دەکرێتەوە، بۆیە گرنگ نییە چەند گەورە بێت.
      </span>
    </div>
  );
}

/** Redraw at most `max` on the long edge, as WebP. */
async function downscale(file: File, max: number, quality: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", quality),
  );
  // A browser without WebP encoding hands back null; the original still works.
  return blob ?? file;
}
