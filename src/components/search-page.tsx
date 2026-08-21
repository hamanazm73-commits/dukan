"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  Clock,
  Globe,
  Map as MapIcon,
  MapPin,
  Phone,
  Search,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import * as Icons from "lucide-react";
import { CATEGORIES, CITY_NAMES, SHOPS, type Shop } from "@/lib/data";
import { CITY_KEYS, useHomeCity } from "@/lib/city";
import { LOCALES, dict } from "@/lib/i18n";
import { useLocale } from "@/lib/locale";
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
/*
 * The examples under the empty field, and the line it opens with, both live
 * in `i18n.ts` now — one set per language.
 *
 * They are things, not shop types. Nobody wakes up wanting "a florist" — they
 * want red roses, and the shop is only how they get them. Showing "گوڵفرۆش"
 * there taught people to search the way the database is filed; "گوڵی سوور"
 * teaches them to search the way they already think. The Arabic and English
 * lists say the same things in the same spirit, not word for word.
 */

/**
 * What the interpreter has already been asked, for this tab's lifetime.
 *
 * A query that meant nothing to the word list will mean nothing to it on the
 * next keystroke either, and the same shopper backspacing and retyping would
 * otherwise pay for the same answer several times over. `null` is a cached
 * answer too — "no trade here sells that" is worth remembering.
 */
const AI_CACHE = new Map<string, string | null>();

export function SearchPage() {
  const { locale, setLocale, t } = useLocale();
  const words = dict(locale);
  const OPENING = words.opening;
  const HINTS = words.hints;

  const [query, setQuery] = useState("");
  const [shops, setShops] = useState<Shop[]>(SHOPS);
  const [hintIndex, setHintIndex] = useState(0);
  /** How much of `OPENING` is on screen; -1 once it has finished and the
      real examples take over. */
  const [typed_, setTyped_] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const opening = typed_ >= 0;
  const hint = opening ? OPENING.slice(0, typed_) : HINTS[hintIndex];

  // Switching language mid-animation would leave half of one sentence
  // followed by half of another, so the opening starts over.
  useEffect(() => {
    setTyped_(0);
    setHintIndex(0);
  }, [locale]);

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
  }, [query, opening, typed_, OPENING]);

  // Only while the field is empty — once someone is typing, a word appearing
  // and vanishing underneath them is noise.
  useEffect(() => {
    if (query || opening) return;
    const id = setInterval(
      () => setHintIndex((i) => (i + 1) % HINTS.length),
      2600,
    );
    return () => clearInterval(id);
  }, [query, opening, HINTS.length]);

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

  /*
   * When the word list runs out.
   *
   * data.ts answers instantly, offline and for free, and it gets nearly
   * everything. What it cannot get is a word nobody listed — a brand, a
   * sentence, a way of naming a thing that was not anticipated. Only then is
   * /api/interpret asked, and only for which trade; the shops still come out
   * of the same local index, so nothing reaches the page that was not in it.
   */
  const emptyLocally =
    !!result && result.shops.length === 0 && result.elsewhere.length === 0;
  const [aiKey, setAiKey] = useState<string | null>(null);
  /** the query aiKey was found for, so a stale answer is never shown */
  const [aiFor, setAiFor] = useState("");
  const [aiBusy, setAiBusy] = useState(false);

  useEffect(() => {
    const q = deferred.trim();
    if (!emptyLocally || !q || aiFor === q) return;

    const cached = AI_CACHE.get(q);
    if (cached !== undefined) {
      setAiFor(q);
      setAiKey(cached);
      return;
    }

    let cancelled = false;
    setAiBusy(true);
    void fetch("/api/interpret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q }),
    })
      .then((r) => (r.ok ? r.json() : { category: null }))
      .then((d: { category?: string | null }) => {
        const key = d.category ?? null;
        AI_CACHE.set(q, key);
        if (cancelled) return;
        setAiFor(q);
        setAiKey(key);
      })
      .catch(() => {
        // Asked and got nothing reads the same as found nothing.
        AI_CACHE.set(q, null);
        if (cancelled) return;
        setAiFor(q);
        setAiKey(null);
      })
      .finally(() => {
        if (!cancelled) setAiBusy(false);
      });

    return () => {
      cancelled = true;
    };
  }, [emptyLocally, deferred, aiFor]);

  const aiCategory =
    aiKey && aiFor === deferred.trim()
      ? CATEGORIES.find((c) => c.key === aiKey)
      : undefined;

  /* The trade's own name, put back through the same search everything else
     goes through — so the city rules and the ordering are the ones already
     written, not a second set living next to them. */
  const aiResult = useMemo(
    () =>
      aiCategory
        ? searcher(aiCategory.label[locale], home.city ?? undefined)
        : null,
    [aiCategory, searcher, home.city, locale],
  );

  const hasHits = (r: typeof result) =>
    !!r && (r.shops.length > 0 || r.elsewhere.length > 0);

  const shown = hasHits(result) ? result : hasHits(aiResult) ? aiResult : result;
  const viaAi = shown !== null && shown === aiResult;

  /* Near shops are the answer; far ones stand in only when there are none.
     One list is rendered either way — what changes is the sentence above it. */
  const fallback = !!shown && shown.shops.length === 0 && shown.elsewhere.length > 0;
  const list = shown ? (fallback ? shown.elsewhere : shown.shops) : [];

  return (
    /*
     * Before anyone types, the mark and the field stand together in the
     * middle of an empty screen — the whole page is one question, so nothing
     * else should be on it. The moment a letter is typed the block leaves
     * the centre and goes to the top, because from then on the page is a
     * list of answers and the field is a tool above it, not the subject.
     */
    <main
      className={`relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 pb-16 transition-all duration-500 sm:px-6 ${
        typed ? "justify-start" : "justify-center pb-[26vh]"
      }`}
    >
      {/* The page is as wide as the hotels site so the results can sit three
          abreast, but the mark and the field stay in a 2xl column down the
          middle. A search box stretched across a desktop is a worse box. */}
      {/* The hub's language control, lifted whole rather than approximated —
          same pill, same globe, same gold on the chosen one. Four sites that
          each invent their own version of this stop reading as one family. */}
      <div className="absolute inset-x-0 top-5 z-30 flex justify-center px-4">
        <div className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-black/25 p-1 backdrop-blur-md">
          <Globe className="mx-2 size-4 shrink-0 text-white/40" aria-hidden />
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLocale(l.code)}
              aria-current={l.code === locale}
              className={`rounded-full px-3 py-1.5 text-[0.8rem] font-semibold transition-colors sm:px-3.5 sm:text-sm ${
                locale === l.code
                  ? "bg-gold text-[#0f1624]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`mx-auto flex w-full max-w-2xl flex-col items-center text-center transition-all duration-500 ${
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
            {t("brand")}
          </h1>
        </div>

        {!typed && (
          <p
            className="arrive mt-3 max-w-xs text-balance text-lg font-normal leading-relaxed text-white/55 sm:max-w-md sm:text-xl"
            style={{ animationDelay: "300ms" }}
          >
            {t("tagline")}
          </p>
        )}
      </div>

      <div
        className={`field sticky top-3 z-20 mx-auto w-full max-w-2xl rounded-2xl ${typed ? "" : "arrive"}`}
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
              aria-label={t("searchLabel")}
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
              aria-label={t("clear")}
              className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {shown && (
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
              {home.city ? CITY_NAMES[home.city][locale] : t("pickCity")}
            </button>
            {home.status === "locating" && (
              <span className="text-xs text-muted-foreground">
                {t("locating")}
              </span>
            )}
          </div>

          {/*
            Asked here, before the browser is.

            The browser's own bar says a site "wants to know your location"
            and nothing else — no reason, from a page opened seconds ago —
            and a refusal to it is permanent. So the reason comes first, in
            words, with a way out that costs nothing: the browser is only
            ever reached through the button on the right, and "not now"
            never touches it at all.
          */}
          <CityAsk
            open={home.status === "asking"}
            onAllow={home.locate}
            onDecline={home.decline}
          />

          {pickerOpen && (
            <div className="mb-3 rounded-2xl border border-border bg-card p-3">
              <p className="mb-2 text-xs text-muted-foreground">
                {t("whichCity")}
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
                    {CITY_NAMES[key][locale]}
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
                  {t("allCities")}
                </button>
              </div>
            </div>
          )}

          <p className="mb-3 text-xs text-muted-foreground">
            {list.length > 0 ? (
              <>
                {t(list.length === 1 ? "shopFound" : "shopsFound", {
                  n: list.length,
                })}
                {shown.category && (
                  <>
                    {" "}
                    {t("inCategory")}{" "}
                    <span className="text-gold">{shown.category.label[locale]}</span>
                  </>
                )}
                {/* A city named in the query is worth repeating back. The one
                    we chose for them is already on the button above. */}
                {shown.city && (
                  <> {t("inCity")} {CITY_NAMES[shown.city][locale]}</>
                )}
              </>
            ) : (
              t("nothingFound")
            )}
          </p>

          {/* Said out loud, because a guess presented as a match is a lie.
              The shopper wrote something the word list did not carry; this
              says what it was taken to mean, so a wrong reading is obvious
              rather than mysterious. */}
          {viaAi && aiCategory && (
            <div className="mb-3 flex items-start gap-2 rounded-2xl border border-gold/25 bg-gold/[0.06] p-3">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t("aiRead", { cat: aiCategory.label[locale] })}
              </p>
            </div>
          )}

          {/* Said before the far-away list, not inside it: the point is that
              these are not near, and a card cannot carry that. */}
          {fallback && shown.homeCity && (
            <div className="mb-3 rounded-2xl border border-dashed border-border p-4 text-center">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("notHere", { city: CITY_NAMES[shown.homeCity][locale] })}
                <br />
                {t("butElsewhere")}
              </p>
            </div>
          )}

          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              {/* While the interpreter is being asked, the empty state would
                  otherwise flash "nothing found" and then contradict itself. */}
              {aiBusy ? (
                <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="size-4 animate-pulse text-gold" aria-hidden />
                  {t("aiThinking")}
                </p>
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("nothingLong")}
                  <br />
                  {t("nothingHint")}
                </p>
              )}
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  const { locale, t } = useLocale();
  const cat = CATEGORIES.find((c) => c.key === shop.category);
  const Icon = iconFor(cat?.icon ?? "Store");
  const wa = shop.whatsapp ? `https://wa.me/${shop.whatsapp}` : undefined;
  const open = isOpenNow(shop.opensAt, shop.closesAt);
  const hours = hoursLabel(shop.opensAt, shop.closesAt);
  const where = [CITY_NAMES[shop.city][locale], shop.district?.[locale]]
    .filter(Boolean)
    .join(" — ");

  return (
    <li
      className="pop-in group relative h-full overflow-hidden rounded-2xl bg-card shadow-lg shadow-black/5 ring-1 ring-foreground/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-gold/40 active:scale-[0.99]"
      style={{ animationDelay: `${Math.min(index, 8) * 28}ms` }}
    >
      {/* The photograph, when there is one. Most shops will not have one for
          a long time, so the card below has to stand on its own — this is an
          addition to it rather than the thing it is built around.

          Built to the hotels site's card: one 3:2 frame, the cover cropped to
          fill it so every card reads the same weight, and what would otherwise
          be a line of text — the trade, whether the door is open — floating on
          the picture instead of pushing the name further down. */}
      {shop.photo && (
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          <img
            src={mediaSrc(shop.photo)}
            alt=""
            loading="lazy"
            className="img-fade size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Keeps white lettering legible over a pale sky or a lit sign. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />

          {cat && (
            <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white shadow-lg ring-1 ring-white/15 backdrop-blur-md">
              <Icon className="size-3.5" aria-hidden />
              {cat.label[locale]}
            </span>
          )}

          {open !== null && (
            <span
              className={`absolute bottom-3 end-3 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-lg ring-1 ring-white/15 backdrop-blur-md ${
                open ? "bg-emerald-600/85" : "bg-red-600/85"
              }`}
            >
              {open ? t("openNow") : t("closedNow")}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start gap-3">
          {!shop.photo && (
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent">
              <Icon className="size-5 text-gold-foreground" aria-hidden />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-1 text-lg font-bold">{shop.name[locale]}</h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
              <span className="inline-flex min-w-0 items-center gap-1">
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">{where}</span>
              </span>
              {hours && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5 shrink-0" aria-hidden />
                  <span dir="ltr">{hours}</span>
                </span>
              )}
            </div>
          </div>

          {/* Only shown when the shop has actually given its hours. Silence
              means we do not know, which must never be drawn as "closed".
              With a photograph this rides on it instead, out of the way of
              the name. */}
          {!shop.photo && open !== null && (
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${
                open
                  ? "bg-green-600/15 text-green-500"
                  : "bg-red-600/15 text-red-500"
              }`}
            >
              {open ? t("openNow") : t("closedNow")}
            </span>
          )}
        </div>

        {shop.tags && shop.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {shop.tags.slice(0, 5).map((t) => (
              <li
                key={t}
                className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        {/* Ringing is the one every shop can answer, so it keeps the filled
            button; the other two appear only when the shop gave them. */}
        <div className="relative z-10 grid gap-2 sm:grid-cols-3">
          <a
            href={`tel:${shop.phone.replace(/s/g, "")}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Phone className="size-4" aria-hidden />
            {t("call")}
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
              {t("whatsapp")}
            </a>
          )}
          {shop.mapUrl && (
            <a
              href={shop.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-bold transition-colors hover:bg-muted"
            >
              <MapIcon className="size-4" aria-hidden />
              {t("directions")}
            </a>
          )}
        </div>
      </div>

      {/*
        The card itself opens the shop's own page.

        Stretched over the whole card and underneath the three buttons, so a
        tap anywhere that is not a button opens the shop, and a tap on Call
        still calls. This is the only route to that page — there is no list
        and no menu — but it is what makes a shop something that can be sent
        to somebody rather than only found.
      */}
      <Link
        href={`/shops/${shop.id}`}
        aria-label={shop.name[locale] || shop.name.ku || shop.name.en}
        className="absolute inset-0 z-0"
      />
    </li>
  );
}

/**
 * The one question the site asks before the browser does.
 *
 * It comes forward rather than sitting in the page. Inline, it was a strip
 * competing with the results for attention and stretching to whatever width
 * the screen happened to be — 343px on a phone, 1280px on a desktop, the
 * same short sentence in both. A dialog is the same size wherever it opens,
 * and it is unmistakably a question rather than another row of the list.
 *
 * Every way out lands on "not now": the backdrop, Escape, the button. Only
 * the gold button reaches the browser, so a person who dismisses this has
 * not spent their one permission — the browser will still ask another day.
 */
function CityAsk({
  open,
  onAllow,
  onDecline,
}: {
  open: boolean;
  onAllow: () => void;
  onDecline: () => void;
}) {
  const { t } = useLocale();
  const allowRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // Focus the answer rather than the dismissal: someone on a keyboard
    // should land on the thing the dialog is for.
    allowRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDecline();
    };
    // The page behind must not scroll away under the dialog.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onDecline]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4 backdrop-blur-sm"
      onClick={onDecline}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="city-ask-title"
        // Stops a click inside the card from reaching the backdrop above.
        onClick={(e) => e.stopPropagation()}
        className="pop-in w-full max-w-sm overflow-hidden rounded-2xl border border-gold/25 bg-card shadow-2xl shadow-black/50"
      >
        <div className="px-6 pb-5 pt-7 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gold/15">
            <MapPin className="size-7 text-gold" aria-hidden />
          </span>
          <h2 id="city-ask-title" className="mt-4 text-lg font-bold">
            {t("askTitle")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t("askBody")}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80">
            {t("askPrivacy")}
          </p>
        </div>
        <div className="grid gap-2 border-t border-border p-4">
          <button
            ref={allowRef}
            type="button"
            onClick={onAllow}
            className="h-12 rounded-xl bg-gold text-sm font-bold text-gold-foreground transition-opacity hover:opacity-90"
          >
            {t("askYes")}
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="h-11 rounded-xl text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
          >
            {t("askNo")}
          </button>
        </div>
      </div>
    </div>
  );
}
