"use client";

import { useDeferredValue, useMemo, useRef, useState } from "react";
import {
  MapPin,
  Phone,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import * as Icons from "lucide-react";
import { CATEGORIES, CITY_NAMES, SHOPS, type Shop } from "@/lib/data";
import { search } from "@/lib/search";
import { BrandMark } from "./brand-mark";

/** Category icons are named in the data; resolve them once. */
function iconFor(name: string): LucideIcon {
  const set = Icons as unknown as Record<string, LucideIcon>;
  return set[name] ?? Icons.Store;
}

const WA = (n?: string) => (n ? `https://wa.me/${n}` : undefined);

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keeps typing smooth: the field updates immediately, the (heavier) result
  // list is allowed to lag a frame behind rather than blocking the keystroke.
  const deferred = useDeferredValue(query);

  const result = useMemo(() => {
    if (deferred.trim()) return search(deferred);
    if (activeCat)
      return {
        shops: SHOPS.filter((s) => s.category === activeCat),
        category: CATEGORIES.find((c) => c.key === activeCat),
        city: undefined,
        unmatched: [],
      };
    return null;
  }, [deferred, activeCat]);

  const searching = Boolean(query.trim() || activeCat);

  function clear() {
    setQuery("");
    setActiveCat(null);
    inputRef.current?.focus();
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-16">
      {/* masthead — small once you are searching, so results get the screen */}
      <div
        className={`flex flex-col items-center text-center transition-all duration-500 ${
          searching ? "pt-8 pb-5" : "pt-[18vh] pb-8"
        }`}
      >
        <BrandMark className={searching ? "size-11" : "size-16"} />
        <h1
          className={`mt-3 font-extrabold tracking-tight text-primary transition-all duration-500 dark:text-foreground ${
            searching ? "text-xl" : "text-3xl sm:text-4xl"
          }`}
        >
          دووکان
        </h1>
        {!searching && (
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground sm:max-w-sm">
            هەر شتێکت دەوێت بینووسە — دووکانەکەی بۆ دەدۆزینەوە.
          </p>
        )}
      </div>

      {/* the box the whole site is built around */}
      <div className="search-shell sticky top-3 z-20 flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-3.5 shadow-sm">
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveCat(null);
          }}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          aria-label="بگەڕێ بۆ دووکان"
          placeholder="مۆبایل، گوڵ، دەرمانخانە…"
          className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
        />
        {searching && (
          <button
            type="button"
            onClick={clear}
            aria-label="سڕینەوە"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* the shortcuts, while nothing is typed */}
      {!searching && (
        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold text-muted-foreground">
            یان یەکێک هەڵبژێرە
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const Icon = iconFor(c.icon);
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setActiveCat(c.key)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:border-gold hover:bg-accent"
                >
                  <Icon className="size-4 shrink-0 text-gold" aria-hidden />
                  {c.label.ku}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* results */}
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
                  <> لە <span className="text-gold">{result.category.label.ku}</span></>
                )}
                {result.city && <> لە {CITY_NAMES[result.city].ku}</>}
              </>
            ) : (
              "هیچ نەدۆزرایەوە"
            )}
          </p>

          {result.shops.length === 0 ? (
            <EmptyState onPick={(k) => { setQuery(""); setActiveCat(k); }} />
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
  const wa = WA(shop.whatsapp);

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

/** A dead end that offers a way out rather than an apology. */
function EmptyState({ onPick }: { onPick: (key: string) => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-6 text-center">
      <p className="text-sm text-muted-foreground">
        ئەو شتە نەدۆزرایەوە. لەوانەیە بەم شێوەیە نەنووسرابێت — ئەمانە تاقی بکەرەوە:
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {CATEGORIES.slice(0, 6).map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => onPick(c.key)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-gold hover:bg-accent"
          >
            {c.label.ku}
          </button>
        ))}
      </div>
    </div>
  );
}
