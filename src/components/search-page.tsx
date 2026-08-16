"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Phone, Search, X, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { CATEGORIES, CITY_NAMES, SHOPS, type Shop } from "@/lib/data";
import { createSearcher } from "@/lib/search";
import { loadShops } from "@/lib/shops-repo";
import { BrandMark } from "./brand-mark";

/** Category icons are named in the data; resolve them once. */
function iconFor(name: string): LucideIcon {
  const set = Icons as unknown as Record<string, LucideIcon>;
  return set[name] ?? Icons.Store;
}

/**
 * The whole site.
 *
 * One field and the answers to it — no category tiles, no browse-by-this,
 * nothing to choose from before you have said what you want. The only hint
 * offered is the placeholder inside the box, because that is part of the box
 * rather than an alternative to using it.
 */
/**
 * What the empty field offers, one at a time.
 *
 * Things, not shop types. Nobody wakes up wanting "a florist" — they want
 * red roses, and the shop is only how they get them. Showing "گوڵفرۆش" here
 * taught people to search the way the database is filed; showing "گوڵی سوور"
 * teaches them to search the way they already think.
 */
const HINTS = [
  "ئایفۆن ١٧…",
  "گوڵی سوور…",
  "دەرمانی سەرئێشە…",
  "کەبابی برژاو…",
  "ئەڵقەی زەماوەند…",
  "تایەی ئۆتۆمبێل…",
  "کێکی ساڵیاد…",
];

/**
 * The line the field opens with, typed out a letter at a time.
 *
 * It says the two halves of the bargain — what to do, and what comes back —
 * and it fits inside a phone-width field, which the longer sentences that
 * mean the same thing do not.
 */
const OPENING = "بینووسە، بیدۆزەرەوە";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [shops, setShops] = useState<Shop[]>(SHOPS);
  const [hintIndex, setHintIndex] = useState(0);
  /** How much of `OPENING` is on screen; -1 once it has finished and the
      real examples take over. */
  const [typed_, setTyped_] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const opening = typed_ >= 0;
  const hint = opening ? OPENING.slice(0, typed_) : HINTS[hintIndex];

  // The opening types itself, holds, then hands over to the examples. Anyone
  // who has asked for less motion gets it whole, immediately.
  useEffect(() => {
    if (query || !opening) return;
    if (
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTyped_(OPENING.length);
      const done = setTimeout(() => setTyped_(-1), 3200);
      return () => clearTimeout(done);
    }
    if (typed_ < OPENING.length) {
      const id = setTimeout(() => setTyped_((n) => n + 1), 85);
      return () => clearTimeout(id);
    }
    const hold = setTimeout(() => setTyped_(-1), 2600);
    return () => clearTimeout(hold);
  }, [query, opening, typed_]);

  // Only while the field is empty — once someone is typing, a word appearing
  // and vanishing underneath them is noise.
  useEffect(() => {
    if (query || opening) return;
    const id = setInterval(
      () => setHintIndex((i) => (i + 1) % HINTS.length),
      2600,
    );
    return () => clearInterval(id);
  }, [query, opening]);

  // Start on the seed so the first paint can already search, then swap in the
  // real shops once they arrive. Nothing blocks on the network: a visitor who
  // types immediately still gets an answer.
  useEffect(() => {
    let cancelled = false;
    void loadShops().then((r) => {
      if (!cancelled) setShops(r.shops);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Built once per shop list, not once per keystroke.
  const searcher = useMemo(() => createSearcher(shops), [shops]);

  // Keeps typing smooth: the field updates on the keystroke, the heavier
  // result list is allowed to land a frame later.
  const deferred = useDeferredValue(query);
  const typed = query.trim().length > 0;

  const result = useMemo(
    () => (deferred.trim() ? searcher(deferred) : null),
    [deferred, searcher],
  );

  return (
    /*
     * Before anyone types, the mark and the field stand together in the
     * middle of an empty screen — the whole page is one question, so nothing
     * else should be on it. The moment a letter is typed the block leaves
     * the centre and goes to the top, because from then on the page is a
     * list of answers and the field is a tool above it, not the subject.
     */
    <main
      className={`relative mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-16 transition-all duration-500 ${
        typed ? "justify-start" : "justify-center pb-[26vh]"
      }`}
    >
      <div
        className={`flex flex-col items-center text-center transition-all duration-500 ${
          typed ? "pt-8 pb-5" : "pt-0 pb-12"
        }`}
      >
        <BrandMark className={typed ? "size-11" : "size-16 sm:size-20"} />

        {/* Ruqaa sets very narrow: at 48px this name measured 110px across a
            375px screen, which reads as small however large the number looks.
            The sizes are chosen against the rendered width, not the font size.
            No `tracking-tight` either — that is drawn for Latin and presses
            Kurdish letters into each other.

            leading-[1.6], not 1.35. Ruqaa is a written hand with long tails
            below the line and high heads above it: at 1.35 the glyphs wanted
            73px and the line box gave them 63, so the name was being cut by
            ten pixels top and bottom. */}
        <h1
          className={`text-gold-gradient gold-sweep mt-4 text-balance font-[family-name:var(--font-display)] leading-[1.6] transition-all duration-500 ${
            typed ? "text-3xl" : "text-[2.9rem] sm:text-[4.2rem]"
          }`}
        >
          بازاڕی لای حەمە
        </h1>

        {!typed && (
          <p className="mt-3 max-w-xs text-balance text-lg font-normal leading-relaxed text-white/55 sm:max-w-md sm:text-xl">
            نووسین لە تۆ، گەڕان و دۆزینەوە لە ئێمە
          </p>
        )}
      </div>

      <div className="field sticky top-3 z-20 rounded-2xl">
        <div className="field-inner flex items-center gap-2 px-3.5">
          <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          <div className="relative w-full">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              aria-label="بگەڕێ بۆ دووکان"
              className="h-16 w-full bg-transparent text-base outline-none"
            />
            {/* Standing in for the placeholder so one example can fade into
                the next. A real placeholder cannot animate. */}
            {!query && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 start-0 flex items-center text-base text-muted-foreground/70"
              >
                {/* While the opening is still being typed the key must not
                    change on every letter, or each one restarts the fade and
                    the line flickers instead of typing. */}
                <span key={opening ? "opening" : hint} className={opening ? "" : "hint"}>
                  {hint}
                  {opening && <span className="caret" aria-hidden />}
                </span>
              </span>
            )}
          </div>
          {typed && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="سڕینەوە"
              className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {result && (
        <div className="mt-5">
          <p className="mb-3 text-xs text-muted-foreground">
            {result.shops.length > 0 ? (
              <>
                <span className="font-bold text-foreground">
                  {result.shops.length}
                </span>{" "}
                دووکان
                {result.category && (
                  <>
                    {" "}
                    لە <span className="text-gold">{result.category.label.ku}</span>
                  </>
                )}
                {result.city && <> لە {CITY_NAMES[result.city].ku}</>}
              </>
            ) : (
              "هیچ نەدۆزرایەوە"
            )}
          </p>

          {result.shops.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-sm leading-relaxed text-muted-foreground">
                هیچ دووکانێک بەم ناوە نەدۆزرایەوە.
                <br />
                بە شێوەیەکی تر بینووسە، یان ناوی شارەکەشی لەگەڵ بنووسە.
              </p>
            </div>
          ) : (
            <ul className="grid gap-2.5">
              {result.shops.map((shop, i) => (
                <ShopCard key={shop.id} shop={shop} index={i} />
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}

function ShopCard({ shop, index }: { shop: Shop; index: number }) {
  const cat = CATEGORIES.find((c) => c.key === shop.category);
  const Icon = iconFor(cat?.icon ?? "Store");
  const wa = shop.whatsapp ? `https://wa.me/${shop.whatsapp}` : undefined;

  return (
    <li
      className="pop-in rounded-2xl border border-border bg-card p-4"
      style={{ animationDelay: `${Math.min(index, 8) * 28}ms` }}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent">
          <Icon className="size-5 text-gold-foreground" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-bold">{shop.name.ku}</h2>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden />
            <span className="truncate">
              {CITY_NAMES[shop.city].ku}
              {shop.district ? ` — ${shop.district.ku}` : ""}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <a
          href={`tel:${shop.phone.replace(/\s/g, "")}`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Phone className="size-4" aria-hidden />
          پەیوەندی
        </a>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-bold transition-colors hover:bg-muted"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
            واتساپ
          </a>
        )}
      </div>
    </li>
  );
}
