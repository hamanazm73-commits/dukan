/**
 * Making two spellings of the same word match.
 *
 * This is the whole difficulty of searching in Kurdish. Sorani is written in
 * Arabic script, and almost every letter has a rival spelling depending on
 * whose keyboard the writer had:
 *
 *   ی / ي   Kurdish yeh vs Arabic yeh — visually identical, different code points
 *   ک / ك   Kurdish kaf vs Arabic kaf — same
 *   ە / ه   Kurdish ae vs heh — the single most common mismatch
 *   ڕ / ر   rolled r written with or without its mark
 *   ۆ / و   o written with or without
 *
 * Someone on an Arabic keyboard types مه‌بايل; someone on a Kurdish one types
 * مۆبایل. Those are the same shop and must be the same search. On top of that
 * people type Arabic proper (موبايل) and Latin (mobile, mobayl).
 *
 * So nothing is ever compared raw. Every shop name, every tag and every
 * keystroke goes through here first, and matching happens between the
 * results.
 */

/** Letters that are really one letter wearing different hats. */
const FOLD: Record<string, string> = {
  // yeh
  "ي": "ی", "ى": "ی", "ﯼ": "ی", "ﯽ": "ی", "ې": "ی", "ﻯ": "ی",
  // kaf
  "ك": "ک", "ﻙ": "ک", "ﮎ": "ک",
  // heh / ae — ه and ە are constantly swapped
  "ه": "ە", "ۀ": "ە", "ة": "ە", "ﻩ": "ە",
  // alef, with or without hamza
  "أ": "ا", "إ": "ا", "آ": "ا", "ٱ": "ا", "ﺍ": "ا",
  // the rolled r loses its mark
  "ڕ": "ر",
  // o and w
  "ۆ": "و", "ؤ": "و", "ۊ": "و",
  // the velar l
  "ڵ": "ل",
  // gaf, whichever way it was typed
  "گ": "ک", "ﮒ": "ک",
  // v
  "ڤ": "ف", "ۋ": "ف",
  // chunks of Arabic that mean the same as their Kurdish cousins
  "ئ": "ا",
  // Arabic-Indic and Persian digits
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
  "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
};

/** Harakat, tatweel and the invisible joiners a keyboard leaves behind. */
const STRIP = /[ً-ٰٟـ​-‏⁦-⁩]/g;

/**
 * One word reduced to the form everything is compared in.
 *
 * Deliberately lossy: ڕ becomes ر and ۆ becomes و because a searcher who
 * cannot type the mark should still find the shop. Losing the distinction
 * costs nothing here — nobody is reading this text, only matching it.
 */
export function normalize(input: string): string {
  if (!input) return "";
  let s = input.toLowerCase().normalize("NFKC");
  s = s.replace(STRIP, "");
  let out = "";
  for (const ch of s) out += FOLD[ch] ?? ch;
  return out
    // punctuation and separators of every script become spaces
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/** The words of a phrase, normalized. */
export function tokens(input: string): string[] {
  const n = normalize(input);
  return n ? n.split(" ") : [];
}

/**
 * Edit distance, capped.
 *
 * Only ever asked whether two short words are within one or two typos of
 * each other, so it bails out as soon as it knows the answer is no — a full
 * matrix over every shop name on every keystroke would be wasted work.
 */
export function withinEdits(a: string, b: string, max: number): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > max) return false;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const v = Math.min(row[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      row.push(v);
      if (v < best) best = v;
    }
    // every path through this row already costs more than we allow
    if (best > max) return false;
    prev = row;
  }
  return prev[b.length] <= max;
}

/**
 * How many typos to forgive for a word of this length.
 *
 * None on very short words: at three letters, one edit turns گوڵ into دوو and
 * the results stop making sense.
 */
export function allowedEdits(len: number): number {
  if (len <= 3) return 0;
  if (len <= 6) return 1;
  return 2;
}
