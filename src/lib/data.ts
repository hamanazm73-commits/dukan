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
      // more of the same, in the words people actually reach for
      "شیاومی", "xiaomi", "redmi", "ڕێدمی", "هواوی", "huawei", "oppo", "ئۆپۆ",
      "realme", "tecno", "infinix", "ئایپاد", "ipad", "تابلێت", "tablet",
      "کارتی شارژ", "ئێیرپۆدز", "airpods", "بلوتوس", "سکرینی زیخاجی", "زجاج شاشة",
      "شاحن", "كيبل", "سماعات", "بطارية", "چاککردنەوەی مۆبایل", "تصليح موبايل",
      "repair",
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
      // more of the same, in the words people actually reach for
      "گوڵی مەسنوعی", "ورد صناعي", "گوڵدان", "مزهرية", "vase", "دیاری", "هدية",
      "gift", "تاجی گوڵ", "إكليل", "wreath", "ئۆرکید", "orchid", "تیولیپ", "tulip",
      "زەنبەق", "lily", "گوڵی ڕۆژی دایک", "سەبەتەی دیاری",
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
      // more of the same, in the words people actually reach for
      "ئەنتیبایۆتیک", "مضاد حيوي", "antibiotic", "پێچانەوە", "ضمادة", "bandage",
      "ماسک", "كمامة", "mask", "پێوەری گەرمی", "حرارة", "پەستانی خوێن", "ضغط الدم",
      "شەکرە", "سكري", "ئەنسولین", "insulin", "شیری منداڵ", "حليب اطفال",
      "baby milk", "پەمپەرز", "حفاضات", "diaper", "vitamin c", "زنك",
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
      // more of the same, in the words people actually reach for
      "برگەر", "بيتزا", "شاورمە", "برياني", "تەشریب", "دولمة", "قووزی", "قوزي",
      "مندي", "فەلافل", "فلافل", "falafel", "سەندویچ", "سندويش", "sandwich",
      "مریشکی برژاو", "دجاج مشوي", "grill", "نانی بەیانی", "فطور", "گەیاندن",
      "delivery",
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
      // more of the same, in the words people actually reach for
      "لەواش", "لواش", "تەندوور", "تنور", "کلێچە", "كليجة", "بقلاوة", "baklava",
      "کێکی زەماوەند", "كيك زفاف", "wedding cake", "دۆنەت", "donut", "کرواسان",
      "croissant", "بسکویت", "بسكويت", "biscuit", "معجنات",
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
      // more of the same, in the words people actually reach for
      "بنطلون", "جینز", "jeans", "تيشيرت", "t-shirt", "چاکەت", "جاكيت", "jacket",
      "پاڵتۆ", "معطف", "coat", "فستان", "dress", "جلی منداڵ", "ملابس اطفال",
      "زي كردي", "شەرواڵ", "هودی", "hoodie",
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
      // more of the same, in the words people actually reach for
      "بوت", "boot", "sneaker", "ئەدیداس", "adidas", "nike", "نایک", "شەمشەمە",
      "شبشب", "slipper", "سەندەل", "جزمة", "کەعب", "heels",
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
      // more of the same, in the words people actually reach for
      "لابتوب", "کۆمپیوتەر", "كمبيوتر", "pc", "طابعة", "printer", "کامێرا",
      "كاميرا", "camera", "سپیکەر", "مكبر صوت", "speaker", "پلەیستەیشن",
      "بلايستيشن", "playstation", "ڕاوتەر", "router", "مۆلیدە", "generator",
      "ستەبلایزەر",
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
      // more of the same, in the words people actually reach for
      "كرسي", "تەخت", "فرشة", "mattress", "دۆڵاب", "دولاب", "wardrobe",
      "مێزی خوێندن", "مكتب", "desk", "ستارة", "curtain", "فەرش", "سجاد", "carpet",
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
      // more of the same, in the words people actually reach for
      "هێلکە", "بيض", "egg", "گۆشت", "لحم", "meat", "مریشک", "دجاج", "chicken",
      "ماسی", "سمك", "fish", "پەنیر", "جبن", "cheese", "کەرە", "زبدة", "butter",
      "میوە", "فواكه", "fruit", "سەوزە", "خضار", "vegetable", "ئاو", "ماء",
      "water", "سابون", "صابون", "soap", "منظفات",
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
      // more of the same, in the words people actually reach for
      "ڕیش", "لحية", "beard", "حلاقة ذقن", "shave", "ماکینەی سەرتاشین",
      "ماكينة حلاقة", "شامپۆ", "شامبو", "shampoo", "ژەل", "جل", "gel",
      "سەرتاشی منداڵ", "حلاق اطفال", "kids haircut", "کوافێر", "كوافير",
      "coiffure", "hairdresser", "ڕەنگی قژ", "صبغة شعر", "dye",
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
      // more of the same, in the words people actually reach for
      "chain", "بازن", "اسورة", "bracelet", "حلق", "earring", "زیو", "فضة",
      "silver", "ئەڵماس", "کاتژمێر", "ساعة", "watch", "زێڕی زەماوەند", "ذهب زفاف",
      "طقم",
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
      // more of the same, in the words people actually reach for
      "battery", "oil", "فلتر", "filter", "بڕێک", "بريك", "brake", "کلچ", "كلتش",
      "clutch", "ڕادیێتەر", "رادييتر", "radiator", "بۆیاخی ئۆتۆمبێل", "صبغ سيارة",
      "کارەبای ئۆتۆمبێل", "كهربائي سيارات", "شوشتنی ئۆتۆمبێل", "car wash", "قەرەج",
      "پارچەی یەدەگ", "قطع غيار", "spare parts",
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
      // more of the same, in the words people actually reach for
      "چەکوش", "مطرقة", "hammer", "بزمار", "مسمار", "nail", "دریل", "دريل",
      "drill", "انبوب", "pipe", "سیم", "سلك", "wire", "قفڵ", "قفل", "lock",
      "دەرگا", "باب", "door", "پەنجەرە", "شباك", "window", "سیمان", "كاشي", "tile",
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
      // more of the same, in the words people actually reach for
      "قەڵەم", "قلم رصاص", "pencil", "ورق", "paper", "printing", "کۆپی", "تصوير",
      "photocopy", "چانتەی قوتابخانە", "حقيبة مدرسية", "school bag",
      "قرطاسية مدرسية",
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
      // more of the same, in the words people actually reach for
      "عطر نسائي", "دیۆدۆرانت", "مزيل عرق", "deodorant", "بەخوور", "بخور", "عود",
      "oud", "لوسیۆن", "lotion", "میکئەپ", "احمر شفاه", "lipstick",
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
