import {
  CATEGORIES,
  CITY_NAMES,
  SHOPS,
  type Category,
  type CityKey,
  type Locale,
  type Shop,
} from "./data";
import { allowedEdits, normalize, tokens, withinEdits } from "./normalize";

/**
 * The search.
 *
 * The site is one box, so this file is most of the product. What it has to
 * get right is that people search by *what they want*, not by what a shop is
 * called: someone types "mobile" and means every mobile shop near them, not a
 * shop with "mobile" in its name. So a query is matched against the category
 * vocabulary first, and a hit there returns the whole category.
 *
 * Everything is prepared once at module load and matched in memory. With a
 * few thousand shops that is far faster than a round trip, and it means
 * results appear while the keyboard is still open.
 */

/** A shop with everything searchable flattened and normalized. */
interface Indexed {
  shop: Shop;
  /** normalized name in all three languages */
  names: string[];
  /** every other normalized word: tags, city, district, category terms */
  words: Set<string>;
}

const INDEX: Indexed[] = SHOPS.map((shop) => {
  const cat = CATEGORIES.find((c) => c.key === shop.category);
  const names = [shop.name.ku, shop.name.ar, shop.name.en].map(normalize);

  const words = new Set<string>();
  const add = (s?: string) => {
    if (!s) return;
    for (const t of tokens(s)) words.add(t);
  };

  names.forEach((n) => n.split(" ").forEach((w) => words.add(w)));
  shop.tags?.forEach(add);
  (["ku", "ar", "en"] as Locale[]).forEach((l) => {
    add(CITY_NAMES[shop.city][l]);
    add(shop.district?.[l]);
    add(cat?.label[l]);
  });
  cat?.terms.forEach(add);

  return { shop, names, words };
});

/** Category vocabulary, normalized once. */
const CATEGORY_TERMS: { cat: Category; terms: string[] }[] = CATEGORIES.map(
  (cat) => ({
    cat,
    terms: [
      ...cat.terms,
      cat.label.ku,
      cat.label.ar,
      cat.label.en,
    ].map(normalize).filter(Boolean),
  }),
);

/** City vocabulary, so "mobile erbil" narrows rather than finding nothing. */
const CITY_TERMS: { city: CityKey; terms: string[] }[] = (
  Object.keys(CITY_NAMES) as CityKey[]
).map((city) => ({
  city,
  terms: [
    CITY_NAMES[city].ku,
    CITY_NAMES[city].ar,
    CITY_NAMES[city].en,
    city,
  ].map(normalize),
}));

/** Does this token hit any of these terms, exactly, by prefix, or near enough? */
function hits(token: string, terms: string[]): number {
  const max = allowedEdits(token.length);
  let best = 0;
  for (const term of terms) {
    if (!term) continue;
    if (term === token) return 100;
    // a prefix counts fully — people search while still typing
    if (term.startsWith(token) && token.length >= 2) best = Math.max(best, 80);
    else if (term.includes(token) && token.length >= 3) best = Math.max(best, 55);
    else if (max > 0 && withinEdits(token, term, max)) best = Math.max(best, 45);
  }
  return best;
}

export interface SearchResult {
  shops: Shop[];
  /** the category the query was understood as, when it was understood as one */
  category?: Category;
  /** the city the query narrowed to */
  city?: CityKey;
  /** the words that meant nothing — shown so a dead end can be explained */
  unmatched: string[];
}

export function search(query: string): SearchResult {
  const qs = tokens(query);
  if (!qs.length) return { shops: [], unmatched: [] };

  // 1 — read the query: which words name a category, which name a city
  let category: Category | undefined;
  let categoryScore = 0;
  let city: CityKey | undefined;
  const unmatched: string[] = [];
  /** City words are a filter, not a relevance signal. Scoring them again
      below would give every shop in Erbil a point for being in Erbil, and
      "mobile erbil" would return the whole city. */
  const cityTokens = new Set<string>();

  for (const t of qs) {
    let claimed = false;

    for (const { cat, terms } of CATEGORY_TERMS) {
      const s = hits(t, terms);
      if (s > categoryScore) {
        categoryScore = s;
        category = cat;
        claimed = true;
      } else if (s > 0) claimed = true;
    }

    for (const { city: c, terms } of CITY_TERMS) {
      if (hits(t, terms) >= 80) {
        city = c;
        cityTokens.add(t);
        claimed = true;
      }
    }

    if (!claimed) unmatched.push(t);
  }

  // 2 — score every shop
  const scored: { shop: Shop; score: number }[] = [];

  /** A category named outright — "mobile", not a word that merely brushed
      one. Below that threshold the query is treated as free text. */
  const namedCategory = categoryScore >= 80 ? category : undefined;

  for (const entry of INDEX) {
    if (city && entry.shop.city !== city) continue;

    let score = 0;
    let nameHit = false;

    // understood as a category: every shop in it belongs in the answer
    if (category && entry.shop.category === category.key) {
      score += categoryScore;
    }

    for (const t of qs) {
      if (cityTokens.has(t)) continue;

      // the shop's own name is the strongest signal there is
      for (const n of entry.names) {
        if (!n) continue;
        if (n === t) { score += 120; nameHit = true; }
        else if (n.startsWith(t)) { score += 70; nameHit = true; }
        else if (n.split(" ").some((w) => w === t)) { score += 60; nameHit = true; }
        else if (n.includes(t) && t.length >= 3) { score += 30; nameHit = true; }
      }
      // then anything else it is described by
      if (entry.words.has(t)) score += 25;
      else {
        const max = allowedEdits(t.length);
        if (max > 0) {
          for (const w of entry.words) {
            if (withinEdits(t, w, max)) {
              score += 12;
              break;
            }
          }
        }
      }
    }

    // Asking for "mobile" means mobile shops. Without this a bakery whose
    // tags happen to share a word with the query rides along underneath
    // them, and the answer stops being an answer.
    if (namedCategory && entry.shop.category !== namedCategory.key && !nameHit) {
      continue;
    }

    if (score > 0) scored.push({ shop: entry.shop, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return {
    shops: scored.map((s) => s.shop),
    category: categoryScore > 0 ? category : undefined,
    city,
    unmatched,
  };
}
