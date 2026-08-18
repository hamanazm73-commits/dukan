export type Locale = "ku" | "ar" | "en";
export type L = Record<Locale, string>;

export interface Category {
  key: string;
  label: L;
  /** lucide-react icon name */
  icon: string;
  /**
   * Every word that should land on this category, in every language and
   * every spelling people actually use — including the wrong ones.
   *
   * This list is the product. A directory that only answers to its own
   * official category names is a directory nobody can search: the shop is
   * called "Ali Mobile", the customer types "telefon", and without these
   * they never meet.
   */
  terms: string[];
}

export const CATEGORIES: Category[] = [
  {
    key: "mobile",
    label: { ku: "مۆبایل", ar: "موبايلات", en: "Mobile phones" },
    icon: "Smartphone",
    terms: [
      "مۆبایل", "موبایل", "مبایل", "مۆبیل", "تەلەفۆن", "تلفون", "هاتف", "جوال",
      "موبايل", "موبايلات", "شحن", "شارژ", "کێبڵ", "سکرین", "قاب",
      "mobile", "mobil", "mobayl", "phone", "telefon", "smartphone", "iphone",
      "samsung", "charger", "case", "screen",
      // the goods themselves — what a customer types, not the trade
      "ئایفۆن", "ایفون", "ئایفۆن ١٧", "iphone 17", "galaxy", "گەلاکسی", "شاشە", "سکرین", "پاوەربانک", "هێدفۆن", "سماعة", "بەتری مۆبایل", "سیمکارت", "خط",
    ],
  },
  {
    key: "flowers",
    label: { ku: "گوڵفرۆش", ar: "ورود", en: "Florist" },
    icon: "Flower2",
    terms: [
      "گوڵ", "گول", "گوڵفرۆش", "گوڵفروش", "دەستەگوڵ", "باخچە",
      "ورد", "ورود", "زهور", "بوكيه", "باقة",
      "flower", "flowers", "florist", "gul", "gull", "rose", "bouquet",
      // the goods themselves — what a customer types, not the trade
      "گوڵی سوور", "گولی سور", "ورد احمر", "گوڵی سپی", "ڕۆز", "روز", "باقة", "دەستەگوڵی بووک", "گوڵی زەماوەند", "سەبەتەی گوڵ", "red rose", "bouquet",
    ],
  },
  {
    key: "pharmacy",
    label: { ku: "دەرمانخانە", ar: "صيدلية", en: "Pharmacy" },
    icon: "Pill",
    terms: [
      "دەرمانخانە", "درمانخانه", "دەرمان", "درمان", "ئەژنە",
      "صيدلية", "صيدليه", "دواء", "ادوية",
      "pharmacy", "darmanxane", "derman", "medicine", "drug", "chemist",
      // the goods themselves — what a customer types, not the trade
      "دەرمانی سەرئێشە", "سەرئێشە", "پاراسیتامۆل", "بەنادۆڵ", "panadol", "paracetamol", "ڤیتامین", "فيتامين", "شەربەت", "کرێمی پێست", "حبوب", "دەرمانی هەوکردن",
    ],
  },
  {
    key: "restaurant",
    label: { ku: "چێشتخانە", ar: "مطعم", en: "Restaurant" },
    icon: "UtensilsCrossed",
    terms: [
      "چێشتخانە", "چیشتخانه", "چێشت", "خواردن", "کەباب", "کباب", "برگر",
      "مطعم", "مطاعم", "اكل", "طعام", "برجر", "شاورما",
      "restaurant", "chishtxane", "kebab", "burger", "food", "shawarma", "pizza",
      // the goods themselves — what a customer types, not the trade
      "کەبابی برژاو", "کەباب", "برنج", "دۆڵمە", "پیتزا", "برگر", "شاورما", "تکە", "مەندی", "قوزی", "بریانی",
    ],
  },
  {
    key: "bakery",
    label: { ku: "نانەوا", ar: "مخبز", en: "Bakery" },
    icon: "CroissantIcon",
    terms: [
      "نانەوا", "نانەواخانە", "نان", "سەمون", "شیرینی", "کێک",
      "مخبز", "خبز", "صمون", "حلويات", "كيك",
      "bakery", "nan", "bread", "samoon", "cake", "sweets", "pastry",
      // the goods themselves — what a customer types, not the trade
      "نانی تەندوور", "سەمون", "کێکی ساڵیاد", "کێک", "شیرینی", "بەقلاوە", "کولێرە", "تۆرتە", "cake", "خبز تنور",
    ],
  },
  {
    key: "clothes",
    label: { ku: "جلوبەرگ", ar: "ملابس", en: "Clothing" },
    icon: "Shirt",
    terms: [
      "جل", "جلوبەرگ", "جلوبەرگی", "کراس", "پانتۆڵ", "جلی کوردی", "بۆکس",
      "ملابس", "ملبس", "قميص", "بنطرون", "دشداشة",
      "clothes", "clothing", "jl", "shirt", "trousers", "fashion", "boutique",
      // the goods themselves — what a customer types, not the trade
      "کراسی کوردی", "جلی کوردی", "پانتۆڵ", "جاکێت", "تیشێرت", "شاڵ", "کراوات", "عەبا", "دشداشة",
    ],
  },
  {
    key: "shoes",
    label: { ku: "پێڵاوفرۆش", ar: "أحذية", en: "Shoes" },
    icon: "Footprints",
    terms: [
      "پێڵاو", "پیلاو", "پێڵاوفرۆش", "سۆڵ", "قوندەرە",
      "حذاء", "احذية", "قندرة", "صندل",
      "shoes", "shoe", "pelaw", "sandal", "boots", "sneakers",
      // the goods themselves — what a customer types, not the trade
      "پێڵاوی وەرزشی", "سەندەڵ", "بووت", "قوندەرەی فەرمی", "سنیکەر", "حذاء رياضي", "کەوش",
    ],
  },
  {
    key: "electronics",
    label: { ku: "ئەلیکترۆنیات", ar: "إلكترونيات", en: "Electronics" },
    icon: "Tv",
    terms: [
      "ئەلیکترۆنی", "الیکترۆنیات", "تەلەڤیزیۆن", "تلفزیون", "ساردکەرەوە",
      "ثلاجة", "غسالة", "تلفزيون", "الكترونيات", "مكيف",
      "electronics", "tv", "fridge", "washing machine", "ac", "laptop",
      // the goods themselves — what a customer types, not the trade
      "تەلەڤیزیۆن", "ساردکەرەوە", "جلشۆر", "مایکرۆوەیڤ", "لاپتۆپ", "پرینتەر", "مکیف", "سبلت", "فرن", "کاولەر",
    ],
  },
  {
    key: "furniture",
    label: { ku: "مۆبیلیا", ar: "أثاث", en: "Furniture" },
    icon: "Sofa",
    terms: [
      "مۆبیلیا", "موبیلیا", "کەلوپەل", "قەنەفە", "مێز", "کورسی", "جێخەو",
      "اثاث", "مفروشات", "كنب", "سرير", "طاولة",
      "furniture", "mobilia", "sofa", "bed", "table", "chair",
      // the goods themselves — what a customer types, not the trade
      "قەنەفە", "جێخەو", "مێزی خواردن", "دۆڵابی جل", "کورسی", "دۆشەک", "پەردە", "سەت مۆبیلیا", "سرير",
    ],
  },
  {
    key: "supermarket",
    label: { ku: "سوپەرمارکێت", ar: "سوبر ماركت", en: "Supermarket" },
    icon: "ShoppingCart",
    terms: [
      "سوپەرمارکێت", "سوپەر", "بەقاڵ", "دووکانی خۆراک", "مارکێت",
      "سوبر ماركت", "بقالة", "ماركت", "تسوق",
      "supermarket", "market", "grocery", "baqal", "shop",
      // the goods themselves — what a customer types, not the trade
      "برنج", "شەکر", "ڕۆن", "ماست", "شیر", "تەماتە", "ئارد", "چای", "قاوە",
    ],
  },
  {
    key: "barber",
    label: { ku: "سەرتاشخانە", ar: "حلاق", en: "Barber" },
    icon: "Scissors",
    terms: [
      "سەرتاشخانە", "سەرتاش", "قژ", "قژبڕین", "ساڵۆن",
      "حلاق", "حلاقة", "صالون", "قص شعر",
      "barber", "sartash", "haircut", "salon", "hair",
      // the goods themselves — what a customer types, not the trade
      "قژبڕین", "ڕیشتاشین", "سەرتاشین", "ڕەنگکردنی قژ", "قص شعر",
    ],
  },
  {
    key: "gold",
    label: { ku: "زێڕفرۆش", ar: "صائغ", en: "Jeweller" },
    icon: "Gem",
    terms: [
      "زێڕ", "زیڕ", "زێڕفرۆش", "ئاڵتون", "خشڵ", "ئەڵقە",
      "ذهب", "صائغ", "مجوهرات", "الماس", "خاتم",
      "gold", "zer", "jewellery", "jewelry", "jeweller", "ring", "diamond",
      // the goods themselves — what a customer types, not the trade
      "ئەڵقەی زەماوەند", "ئەڵقە", "خشڵ", "زنجیر", "دەستبەند", "گوارە", "خاتم", "سلسلة",
    ],
  },
  {
    key: "mechanic",
    label: { ku: "مێکانیکی", ar: "ميكانيكي", en: "Mechanic" },
    icon: "Wrench",
    terms: [
      "مێکانیکی", "میکانیکی", "ئۆتۆمبێل", "سەیارە", "تایە", "بەنزین", "کارواش",
      "ميكانيكي", "سيارة", "تاير", "كراج", "بنجرچي", "غسيل سيارات",
      "mechanic", "car", "tyre", "tire", "garage", "carwash", "mikaniki",
      // the goods themselves — what a customer types, not the trade
      "تایە", "بەتری", "زەیت", "فلتەر", "کارواش", "سایلەنسەر", "تاير", "بطارية", "زيت",
    ],
  },
  {
    key: "hardware",
    label: { ku: "کەرەستەی بیناسازی", ar: "مواد إنشائية", en: "Hardware" },
    icon: "Hammer",
    terms: [
      "کەرەستە", "بیناسازی", "چیمەنتۆ", "بۆیە", "ئامێر", "میخ", "دار",
      "مواد انشائية", "اسمنت", "صبغ", "عدة", "حديد",
      "hardware", "cement", "paint", "tools", "construction", "timber",
      // the goods themselves — what a customer types, not the trade
      "چیمەنتۆ", "بۆیە", "میخ", "دار", "کاشی", "لوولە", "وایەر", "سمنت", "صبغ",
    ],
  },
  {
    key: "stationery",
    label: { ku: "قەرتاسیە", ar: "قرطاسية", en: "Stationery" },
    icon: "PenTool",
    terms: [
      "قەرتاسیە", "نووسینگە", "پێنووس", "دەفتەر", "کتێب", "چاپ", "فۆتۆکۆپی",
      "قرطاسية", "قلم", "دفتر", "كتاب", "طباعة", "استنساخ",
      "stationery", "pen", "notebook", "book", "print", "copy",
      // the goods themselves — what a customer types, not the trade
      "دەفتەر", "پێنووس", "فۆتۆکۆپی", "چاپکردن", "کاغەز", "فایل", "دفتر", "قلم",
    ],
  },
  {
    key: "perfume",
    label: { ku: "بۆنفرۆش", ar: "عطور", en: "Perfume" },
    icon: "SprayCan",
    terms: [
      "بۆن", "بون", "بۆنفرۆش", "عەتر", "جوانکاری", "مەکیاج",
      "عطر", "عطور", "مكياج", "تجميل",
      "perfume", "bon", "cosmetics", "makeup", "beauty",
      // the goods themselves — what a customer types, not the trade
      "عەتر", "بۆنی پیاوان", "بۆنی ژنان", "مەکیاج", "کرێم", "لیپستیک", "عطر رجالي", "مكياج",
    ],
  },
];

export type CityKey =
  | "erbil" | "sulaymaniyah" | "duhok" | "kirkuk"
  | "halabja" | "zakho" | "ranya" | "koya" | "soran" | "shaqlawa"
  | "chamchamal" | "kalar";

export const CITY_NAMES: Record<CityKey, L> = {
  erbil: { ku: "هەولێر", ar: "أربيل", en: "Erbil" },
  sulaymaniyah: { ku: "سلێمانی", ar: "السليمانية", en: "Sulaymaniyah" },
  duhok: { ku: "دهۆک", ar: "دهوك", en: "Duhok" },
  kirkuk: { ku: "کەرکووک", ar: "كركوك", en: "Kirkuk" },
  halabja: { ku: "هەڵەبجە", ar: "حلبجة", en: "Halabja" },
  zakho: { ku: "زاخۆ", ar: "زاخو", en: "Zakho" },
  ranya: { ku: "ڕانیە", ar: "رانية", en: "Ranya" },
  koya: { ku: "کۆیە", ar: "كويسنجق", en: "Koya" },
  soran: { ku: "سۆران", ar: "سوران", en: "Soran" },
  shaqlawa: { ku: "شەقڵاوە", ar: "شقلاوة", en: "Shaqlawa" },
  chamchamal: { ku: "چەمچەماڵ", ar: "جمجمال", en: "Chamchamal" },
  kalar: { ku: "کەلار", ar: "كلار", en: "Kalar" },
};

export interface Shop {
  id: string;
  name: L;
  category: string;
  city: CityKey;
  district?: L;
  phone: string;
  whatsapp?: string;
  /** words specific to this shop — brands it carries, what it is known for */
  tags?: string[];
  /** Key of the photograph in the bucket, not a full URL. The host it is
      served from can then change without rewriting every record. */
  photo?: string;
  /** Whatever the owner pasted from a maps app. Stored as given and only
      ever opened, never parsed — every maps app writes a different shape. */
  mapUrl?: string;
  /** "09:00" and "22:00". One pair for every day: a shop that keeps
      different hours on a Friday is a problem worth having later. */
  opensAt?: string;
  closesAt?: string;
}

/**
 * No seed shops.
 *
 * There were thirty-seven, invented so the search had something to find
 * before any real ones existed. They are gone now the database is live: an
 * invented shop carrying an invented phone number is worse than an empty
 * result, because sooner or later somebody rings it.
 *
 * loadShops() still falls back to this list when Firestore cannot be read,
 * so on a bad day the site shows nothing rather than something false, and
 * the empty state on the search page is what covers that.
 */
export const SHOPS: Shop[] = [];
