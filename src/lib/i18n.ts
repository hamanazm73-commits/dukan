import type { Locale } from "./data";

/**
 * The site in three languages.
 *
 * The data was already trilingual — every shop name, every trade, every city
 * carries `ku`, `ar` and `en`. Only the words around it were not, so a visitor
 * who reads Arabic got Kurdish buttons wrapped around an Arabic shop name.
 * This is the rest of the sentence.
 *
 * No `"use client"` here on purpose. The chrome is picked in the browser, but
 * the shop pages are rendered on the server for crawlers, and both need the
 * same strings.
 */

export const LOCALES: {
  code: Locale;
  label: string;
  dir: "rtl" | "ltr";
  /** what `<html lang>` should say — ckb is Sorani, not plain "ku" */
  html: string;
}[] = [
  { code: "ku", label: "کوردی", dir: "rtl", html: "ckb" },
  { code: "ar", label: "العربية", dir: "rtl", html: "ar" },
  /*
   * English is laid out right-to-left as well, on purpose.
   *
   * The obvious thing is dir="ltr", and it was that first: the whole page
   * mirrored, the mark and the field swapped sides, every card reversed. The
   * site stopped looking like itself for one of its three languages.
   *
   * This audience reads Kurdish and Arabic. English here is the third choice
   * for the same people and the same shops, not a different site for a
   * different market — so it keeps the shape they already know and only the
   * words change. English words still run left to right inside their own
   * lines; the browser handles that on its own.
   */
  { code: "en", label: "English", dir: "rtl", html: "en" },
];

export const DEFAULT_LOCALE: Locale = "ku";

export function isLocale(v: unknown): v is Locale {
  return v === "ku" || v === "ar" || v === "en";
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return LOCALES.find((l) => l.code === locale)?.dir ?? "rtl";
}

/**
 * The cookie the chosen language is kept in.
 *
 * Here rather than beside the React provider because the server reads it too —
 * the layout sets <html lang/dir> from it and the shop pages render in it. A
 * helper in a "use client" module compiles fine on the server and then throws
 * on every request, which is exactly what happened.
 */
export const LOCALE_COOKIE = "dukan.lang";

export function localeFromCookie(raw: string | undefined | null): Locale {
  if (!raw) return DEFAULT_LOCALE;
  const v = raw.split("=").pop()?.trim();
  return isLocale(v) ? v : DEFAULT_LOCALE;
}

export function htmlLang(locale: Locale): string {
  return LOCALES.find((l) => l.code === locale)?.html ?? "ckb";
}

type Dict = {
  brand: string;
  tagline: string;
  /** typed out letter by letter in the empty field */
  opening: string;
  /** the rotating examples under it — things, not trades */
  hints: string[];
  searchLabel: string;
  clear: string;

  pickCity: string;
  locating: string;
  whichCity: string;
  allCities: string;

  /** "{n} shops" — {n} is substituted. Kurdish and Arabic do not change
      the noun after a numeral the way English does, so both forms are the
      same string in two of the three. */
  shopsFound: string;
  shopFound: string;
  inCategory: string;
  inCity: string;
  nothingFound: string;
  nothingLong: string;
  nothingHint: string;

  aiThinking: string;
  /** "{word} was not in our list — we read it as {category}" */
  aiRead: string;
  notHere: string;
  butElsewhere: string;

  openNow: string;
  closedNow: string;
  call: string;
  whatsapp: string;
  directions: string;

  backToSearch: string;
  showOnMap: string;
  otherShopsIn: string;
  shopNotFound: string;
  /** for the shop page description */
  phoneAddressHours: string;
  language: string;

  askTitle: string;
  askBody: string;
  askPrivacy: string;
  askYes: string;
  askNo: string;
};

const ku: Dict = {
  brand: "لای حەمە بیدۆزەوە",
  tagline: "نووسین لە تۆ، گەڕان و دۆزینەوە لە ئێمە",
  opening: "بینووسە، بیدۆزەرەوە",
  hints: [
    "ئایفۆن ١٧…",
    "گوڵی سوور…",
    "دەرمانی سەرئێشە…",
    "کەبابی برژاو…",
    "ئەڵقەی زەماوەند…",
    "تایەی ئۆتۆمبێل…",
    "کێکی ساڵیاد…",
  ],
  searchLabel: "بگەڕێ بۆ دووکان",
  clear: "سڕینەوە",

  pickCity: "شارەکەت دیاری بکە",
  locating: "شوێنەکەت دەدۆزرێتەوە…",
  whichCity: "لە کام شاردایت؟",
  allCities: "هەموو شارەکان",

  shopsFound: "{n} دووکان",
  shopFound: "{n} دووکان",
  inCategory: "لە",
  inCity: "لە",
  nothingFound: "هیچ نەدۆزرایەوە",
  nothingLong: "هیچ دووکانێک بەم ناوە نەدۆزرایەوە.",
  nothingHint: "بە شێوەیەکی تر بینووسە، یان ناوی شارەکەشی لەگەڵ بنووسە.",

  aiThinking: "لێی تێدەگەین…",
  aiRead: "ئەم وشەیە لە لیستەکەماندا نەبوو. وامان لێکدایەوە کە مەبەستت {cat} بووە.",
  notHere: "لە {city} نەدۆزرایەوە.",
  butElsewhere: "بەڵام لە شارەکانی تر هەیە:",

  openNow: "ئێستا کراوەیە",
  closedNow: "داخراوە",
  call: "پەیوەندی",
  whatsapp: "واتساپ",
  directions: "ڕێگا",

  backToSearch: "گەڕانەوە بۆ گەڕان",
  showOnMap: "لە نەخشەدا پیشانی بدە",
  otherShopsIn: "دووکانی تر لە {city}",
  shopNotFound: "دووکان نەدۆزرایەوە",
  phoneAddressHours: "ژمارەی تەلەفۆن، ناونیشان و کاتی کردنەوە.",
  language: "زمان",

  askTitle: "نزیکترین دووکانت پیشان بدەین؟",
  askBody:
    "ئەگەر شارەکەت بزانین، ئەو دووکانانەت پیشان دەدەین کە لە شارەکەی خۆتدان — نەک شارێکی دوور.",
  askPrivacy:
    "تەنها ناوی شارەکە بەکاردێت. لە وێبگەڕەکەی خۆتدا دەمێنێتەوە و بۆ هیچ شوێنێک نانێردرێت.",
  askYes: "بەڵێ، شارەکەم بدۆزەوە",
  askNo: "ئێستا نا",
};

const ar: Dict = {
  brand: "يم حمة تلاقيها",
  tagline: "اكتب أنت، والبحث علينا",
  opening: "اكتبها، وتلاقيها",
  hints: [
    "آيفون ١٧…",
    "ورد أحمر…",
    "دواء صداع…",
    "كباب مشوي…",
    "خاتم زواج…",
    "تاير سيارة…",
    "كيكة عيد ميلاد…",
  ],
  searchLabel: "ابحث عن محل",
  clear: "مسح",

  pickCity: "اختر مدينتك",
  locating: "نحدد موقعك…",
  whichCity: "بأي مدينة أنت؟",
  allCities: "كل المدن",

  shopsFound: "{n} محل",
  shopFound: "{n} محل",
  inCategory: "في",
  inCity: "في",
  nothingFound: "لا يوجد شيء",
  nothingLong: "لم نجد أي محل بهذا الاسم.",
  nothingHint: "اكتبها بشكل آخر، أو أضف اسم المدينة.",

  aiThinking: "نحاول أن نفهمها…",
  aiRead: "هذه الكلمة ليست في قائمتنا. فهمنا أنك تقصد {cat}.",
  notHere: "لا يوجد في {city}.",
  butElsewhere: "لكن يوجد في مدن أخرى:",

  openNow: "مفتوح الآن",
  closedNow: "مغلق",
  call: "اتصل",
  whatsapp: "واتساب",
  directions: "الطريق",

  backToSearch: "رجوع إلى البحث",
  showOnMap: "اعرضه على الخريطة",
  otherShopsIn: "محلات أخرى في {city}",
  shopNotFound: "المحل غير موجود",
  phoneAddressHours: "رقم الهاتف والعنوان وساعات العمل.",
  language: "اللغة",

  askTitle: "نعرض لك أقرب المحلات؟",
  askBody:
    "إذا عرفنا مدينتك، نعرض لك المحلات التي في مدينتك — لا محلات مدينة بعيدة.",
  askPrivacy:
    "نستخدم اسم المدينة فقط. يبقى في متصفحك ولا يُرسل إلى أي مكان.",
  askYes: "نعم، اعرف مدينتي",
  askNo: "ليس الآن",
};

const en: Dict = {
  brand: "Find It at Lay Hama",
  tagline: "You type it, we find it",
  opening: "Type it, find it",
  hints: [
    "iPhone 17…",
    "red roses…",
    "headache tablets…",
    "grilled kebab…",
    "wedding ring…",
    "car tyre…",
    "birthday cake…",
  ],
  searchLabel: "Search for a shop",
  clear: "Clear",

  pickCity: "Choose your city",
  locating: "Finding where you are…",
  whichCity: "Which city are you in?",
  allCities: "All cities",

  shopsFound: "{n} shops",
  shopFound: "{n} shop",
  inCategory: "in",
  inCity: "in",
  nothingFound: "Nothing found",
  nothingLong: "No shop found by that name.",
  nothingHint: "Try wording it differently, or add the city name.",

  aiThinking: "Working out what you mean…",
  aiRead: "That word was not in our list. We read it as {cat}.",
  notHere: "Nothing in {city}.",
  butElsewhere: "But there is in other cities:",

  openNow: "Open now",
  closedNow: "Closed",
  call: "Call",
  whatsapp: "WhatsApp",
  directions: "Directions",

  backToSearch: "Back to search",
  showOnMap: "Show on the map",
  otherShopsIn: "Other shops in {city}",
  shopNotFound: "Shop not found",
  phoneAddressHours: "Phone number, address and opening hours.",
  language: "Language",

  askTitle: "Show you the nearest shops?",
  askBody:
    "If we know your city, we show you the shops in it — not ones a drive away.",
  askPrivacy:
    "Only the city name is used. It stays in your browser and is sent nowhere.",
  askYes: "Yes, find my city",
  askNo: "Not now",
};

const DICT: Record<Locale, Dict> = { ku, ar, en };

export function dict(locale: Locale): Dict {
  return DICT[locale] ?? DICT[DEFAULT_LOCALE];
}

/** `t(locale, "otherShopsIn", { city: "کەرکووک" })` */
export function t(
  locale: Locale,
  key: keyof Omit<Dict, "hints">,
  vars?: Record<string, string | number>,
): string {
  let s = dict(locale)[key] as string;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.split(`{${k}}`).join(String(v));
    }
  }
  return s;
}
