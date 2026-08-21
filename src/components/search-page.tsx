"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Clock, Map, MapPin, Phone, Search, X, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { CATEGORIES, CITY_NAMES, SHOPS, type Shop } from "@/lib/data";
import { CITY_KEYS, useHomeCity } from "@/lib/city";
import { createSearcher } from "@/lib/search";
import { hoursLabel, isOpenNow } from "@/lib/hours";
import { mediaSrc } from "@/lib/media";
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

  // Where they are. Asked for on the first search, never on arrival.
  const home = useHomeCity(typed);
  const [pickerOpen, setPickerOpen] = useState(false);

  const result = useMemo(
    () => (deferred.trim() ? searcher(deferred, home.city ?? undefined) : null),
    [deferred, searcher, home.city],
  );

  /* Near shops are the answer; far ones stand in only when there are none.
     One list is rendered either way — what changes is the sentence above it. */
  const fallback = !!result && result.shops.length === 0 && result.elsewhere.length > 0;
  const list = result ? (fallback ? result.elsewhere : result.shops) : [];

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
        {/* The four things arrive in order — mark, name, line, field — so the
            page reads as opening rather than as having always been there.
            Only on the way in: once anyone types, the block is moving to the
            top and a second animation on top of that is noise. */}
        <BrandMark
          className={`${typed ? "size-11" : "arrive-mark size-16 sm:size-20"}`}
        />

        {/* Ruqaa sets very narrow: at 48px this name measured 110px across a
            375px screen, which reads as small however large the number looks.
            The sizes are chosen against the rendered width, not the font size.
            No `tracking-tight` either — that is drawn for Latin and presses
            Kurdish letters into each other.

            leading-[1.6], not 1.35. Ruqaa is a written hand with long tails
            below the line and high heads above it: at 1.35 the glyphs wanted
            73px and the line box gave them 63, so the name was being cut by
            ten pixels top and bottom. */}
        {/* The arrival goes on a wrapper, not on the heading. The heading
            already carries `gold-sweep`, and a second `animation` on the same
            element replaces it rather than joining it — the name was landing
            with no fade at all and the sweep was inheriting the delay. */}
        <div className={typed ? "" : "arrive"} style={typed ? undefined : { animationDelay: "160ms" }}>
          <h1
            className={`text-gold-gradient gold-sweep mt-4 text-balance font-[family-name:var(--font-display)] leading-[1.6] transition-all duration-500 ${
              typed ? "text-3xl" : "text-[2.9rem] sm:text-[4.2rem]"
            }`}
          >
            بازاڕی لای حەمە
          </h1>
        </div>

        {!typed && (
          <p
            className="arrive mt-3 max-w-xs text-balance text-lg font-normal leading-relaxed text-white/55 sm:max-w-md sm:text-xl"
            style={{ animationDelay: "300ms" }}
          >
            نووسین لە تۆ، گەڕان و دۆزینەوە لە ئێمە
          </p>
        )}
      </div>

      <div
        className={`field sticky top-3 z-20 rounded-2xl ${typed ? "" : "arrive"}`}
        style={typed ? undefined : { animationDelay: "440ms" }}
      >
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
          {/* Which city these answers came from, and the way to change it.
              Only ever after a search: on the empty page it would be one more
              thing to choose from before saying what you want. */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen((v) => !v)}
              aria-expanded={pickerOpen}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs text-foreground transition-colors hover:bg-muted"
            >
              <MapPin className="size-3.5 shrink-0 text-gold" aria-hidden />
              {home.city ? CITY_NAMES[home.city].ku : "شارەکەت دیاری بکە"}
            </button>
            {home.status === "locating" && (
              <span className="text-xs text-muted-foreground">
                شوێنەکەت دەدۆزرێتەوە…
              </span>
            )}
          </div>

          {pickerOpen && (
            <div className="mb-3 rounded-2xl border border-border bg-card p-3">
              <p className="mb-2 text-xs text-muted-foreground">
                لە کام شاردایت؟
              </p>
              {/* Wraps rather than scrolls: twelve names must all be reachable
                  on a 375px screen without a hidden row. */}
              <div className="flex flex-wrap gap-1.5">
                {CITY_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      home.choose(key);
                      setPickerOpen(false);
                    }}
                    className={`h-8 rounded-full border px-3 text-xs transition-colors ${
                      home.city === key
                        ? "border-transparent bg-primary font-bold text-primary-foreground"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {CITY_NAMES[key].ku}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    home.choose(null);
                    setPickerOpen(false);
                  }}
                  className={`h-8 rounded-full border px-3 text-xs transition-colors ${
                    home.city === null
                      ? "border-transparent bg-primary font-bold text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  هەموو شارەکان
                </button>
              </div>
            </div>
          )}

          <p className="mb-3 text-xs text-muted-foreground">
            {list.length > 0 ? (
              <>
                <span className="font-bold text-foreground">{list.length}</span>{" "}
                دووکان
                {result.category && (
                  <>
                    {" "}
                    لە <span className="text-gold">{result.category.label.ku}</span>
                  </>
                )}
                {/* A city named in the query is worth repeating back. The one
                    we chose for them is already on the button above. */}
                {result.city && <> لە {CITY_NAMES[result.city].ku}</>}
              </>
            ) : (
              "هیچ نەدۆزرایەوە"
            )}
          </p>

          {/* Said before the far-away list, not inside it: the point is that
              these are not near, and a card cannot carry that. */}
          {fallback && result.homeCity && (
            <div className="mb-3 rounded-2xl border border-dashed border-border p-4 text-center">
              <p className="text-sm leading-relaxed text-muted-foreground">
                لە <span className="text-foreground">{CITY_NAMES[result.homeCity].ku}</span>{" "}
                نەدۆزرایەوە.
                <br />
                بەڵام لە شارەکانی تر هەیە:
              </p>
            </div>
          )}

          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-sm leading-relaxed text-muted-foreground">
                هیچ دووکانێک بەم ناوە نەدۆزرایەوە.
                <br />
                بە شێوەیەکی تر بینووسە، یان ناوی شارەکەشی لەگەڵ بنووسە.
              </p>
            </div>
          ) : (
            <ul className="grid gap-2.5">
              {list.map((shop, i) => (
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
  const open = isOpenNow(shop.opensAt, shop.closesAt);
  const hours = hoursLabel(shop.opensAt, shop.closesAt);
  const where = [CITY_NAMES[shop.city].ku, shop.district?.ku]
    .filter(Boolean)
    .join(" — ");

  return (
    <li
      className="pop-in overflow-hidden rounded-2xl border border-border bg-card"
      style={{ animationDelay: `${Math.min(index, 8) * 28}ms` }}
    >
      {/* The photograph, when there is one. Most shops will not have one for
          a long time, so the card below has to stand on its own — this is an
          addition to it rather than the thing it is built around.

          The card takes the shape of the photograph rather than the other way
          round. A fixed strip and object-cover cropped every picture to one
          ratio, and what a shop chooses to photograph — a sign, a frontage, a
          room — is rarely the shape of a strip; the sign that names the place
          was the first thing cut off.

          max-h is the one guard: a very tall picture is scaled down and
          letterboxed against the muted panel instead of taking over the whole
          screen. Nothing is cropped in either case. */}
      {shop.photo && (
        <div className="relative bg-muted">
          <img
            src={mediaSrc(shop.photo)}
            alt=""
            loading="lazy"
            className="block max-h-[26rem] w-full object-contain"
          />
        </div>
      )}

      <div className={shop.photo ? "p-4 pt-2" : "p-4"}>
        <div className="flex items-start gap-3">
          {!shop.photo && (
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent">
              <Icon className="size-5 text-gold-foreground" aria-hidden />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-bold">{shop.name.ku}</h2>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3 shrink-0" aria-hidden />
              <span className="truncate">{where}</span>
            </p>
            {hours && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3 shrink-0" aria-hidden />
                <span dir="ltr">{hours}</span>
              </p>
            )}
          </div>

          {/* Only shown when the shop has actually given its hours. Silence
              means we do not know, which must never be drawn as "closed". */}
          {open !== null && (
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${
                open
                  ? "bg-green-600/15 text-green-500"
                  : "bg-red-600/15 text-red-500"
              }`}
            >
              {open ? "ئێستا کراوەیە" : "داخراوە"}
            </span>
          )}
        </div>

        {shop.tags && shop.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {shop.tags.slice(0, 5).map((t) => (
              <li
                key={t}
                className="rounded-full bg-muted px-2.5 py-1 text-[0.7rem] text-muted-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        {/* Ringing is the one every shop can answer, so it keeps the filled
            button; the other two appear only when the shop gave them. */}
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <a
            href={`tel:${shop.phone.replace(/s/g, "")}`}
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
          {shop.mapUrl && (
            <a
              href={shop.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-bold transition-colors hover:bg-muted"
            >
              <Map className="size-4" aria-hidden />
              ڕێگا
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
