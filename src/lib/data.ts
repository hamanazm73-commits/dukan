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
}

/** Seed shops, so the search has something to find before real ones arrive. */
export const SHOPS: Shop[] = [
  {
    id: "erb-ali-mobile",
    name: { ku: "مۆبایلی عەلی", ar: "موبايلات علي", en: "Ali Mobile" },
    category: "mobile", city: "erbil",
    district: { ku: "بازاڕی نیشتمان", ar: "سوق نيشتمان", en: "Nishtiman Bazaar" },
    phone: "+964 750 111 2233", whatsapp: "9647501112233",
    tags: ["iphone", "samsung", "ئایفۆن", "شارژەر", "قاب"],
  },
  {
    id: "erb-star-mobile",
    name: { ku: "مۆبایلی ئەستێرە", ar: "موبايلات النجمة", en: "Star Mobile" },
    category: "mobile", city: "erbil",
    district: { ku: "شەقامی ٦٠", ar: "شارع ٦٠", en: "60m Street" },
    phone: "+964 751 220 4400", whatsapp: "9647512204400",
    tags: ["xiaomi", "redmi", "چاککردنەوە", "تعمير"],
  },
  {
    id: "slm-hana-mobile",
    name: { ku: "مۆبایلی هانا", ar: "موبايلات هناء", en: "Hana Mobile" },
    category: "mobile", city: "sulaymaniyah",
    district: { ku: "سالم ستریت", ar: "شارع سالم", en: "Salim Street" },
    phone: "+964 770 445 6677", whatsapp: "9647704456677",
  },
  {
    id: "erb-rose-flowers",
    name: { ku: "گوڵفرۆشی ڕۆژ", ar: "ورود روژ", en: "Roj Flowers" },
    category: "flowers", city: "erbil",
    district: { ku: "ئیسکان", ar: "إسكان", en: "Iskan" },
    phone: "+964 750 909 1122", whatsapp: "9647509091122",
    tags: ["دەستەگوڵ", "بوكيه", "ئاهەنگ", "زەماوەند", "wedding"],
  },
  {
    id: "slm-bahar-flowers",
    name: { ku: "گوڵفرۆشی بەهار", ar: "ورود بهار", en: "Bahar Flowers" },
    category: "flowers", city: "sulaymaniyah",
    district: { ku: "بەختیاری", ar: "بختياري", en: "Bakhtiari" },
    phone: "+964 773 300 5566",
  },
  {
    id: "erb-shifa-pharmacy",
    name: { ku: "دەرمانخانەی شیفا", ar: "صيدلية الشفاء", en: "Shifa Pharmacy" },
    category: "pharmacy", city: "erbil",
    district: { ku: "بەختیاری", ar: "بختياري", en: "Bakhtiari" },
    phone: "+964 750 300 7788", whatsapp: "9647503007788",
    tags: ["٢٤ کاتژمێر", "24 ساعة", "24h"],
  },
  {
    id: "dhk-nergiz-pharmacy",
    name: { ku: "دەرمانخانەی نەرگز", ar: "صيدلية نركز", en: "Nergiz Pharmacy" },
    category: "pharmacy", city: "duhok",
    phone: "+964 751 660 2211",
  },
  {
    id: "erb-kebab-hersh",
    name: { ku: "چێشتخانەی هێرش", ar: "مطعم هيرش", en: "Hersh Restaurant" },
    category: "restaurant", city: "erbil",
    district: { ku: "عەنکاوە", ar: "عنكاوة", en: "Ainkawa" },
    phone: "+964 750 555 8899", whatsapp: "9647505558899",
    tags: ["کەباب", "برنج", "کباب", "grill"],
  },
  {
    id: "slm-pizza-nali",
    name: { ku: "پیتزای نالی", ar: "بيتزا نالي", en: "Nali Pizza" },
    category: "restaurant", city: "sulaymaniyah",
    phone: "+964 770 121 3344",
    tags: ["pizza", "برجر", "burger", "fast food"],
  },
  {
    id: "erb-nanawa-shaqlawa",
    name: { ku: "نانەوای شەقڵاوە", ar: "مخبز شقلاوة", en: "Shaqlawa Bakery" },
    category: "bakery", city: "erbil",
    phone: "+964 751 777 4433",
    tags: ["سەمون", "صمون", "نانی تەندوور"],
  },
  {
    id: "erb-zheer-clothes",
    name: { ku: "جلوبەرگی ژیر", ar: "ملابس زهير", en: "Zheer Clothing" },
    category: "clothes", city: "erbil",
    district: { ku: "بازاڕی قەیسەری", ar: "قيصرية", en: "Qaysari Bazaar" },
    phone: "+964 750 202 9911",
    tags: ["جلی کوردی", "زەماوەند", "دشداشة"],
  },
  {
    id: "slm-shoes-kani",
    name: { ku: "پێڵاوی کانی", ar: "أحذية كاني", en: "Kani Shoes" },
    category: "shoes", city: "sulaymaniyah",
    phone: "+964 773 818 2200",
  },
  {
    id: "erb-electro-city",
    name: { ku: "ئەلیکترۆنیاتی شار", ar: "إلكترونيات المدينة", en: "City Electronics" },
    category: "electronics", city: "erbil",
    phone: "+964 750 414 6600", whatsapp: "9647504146600",
    tags: ["تەلەڤیزیۆن", "ساردکەرەوە", "lg", "samsung"],
  },
  {
    id: "krk-furniture-dilan",
    name: { ku: "مۆبیلیای دیلان", ar: "أثاث ديلان", en: "Dilan Furniture" },
    category: "furniture", city: "kirkuk",
    phone: "+964 771 505 3322",
    tags: ["قەنەفە", "جێخەو", "كنب"],
  },
  {
    id: "erb-super-family",
    name: { ku: "سوپەرمارکێتی خێزان", ar: "سوبر ماركت العائلة", en: "Family Supermarket" },
    category: "supermarket", city: "erbil",
    phone: "+964 750 636 1100",
  },
  {
    id: "slm-barber-diyar",
    name: { ku: "سەرتاشخانەی دیار", ar: "حلاق ديار", en: "Diyar Barber" },
    category: "barber", city: "sulaymaniyah",
    phone: "+964 770 900 7755",
    tags: ["قژبڕین", "ڕیش", "حلاقة"],
  },
  {
    id: "erb-gold-nishtiman",
    name: { ku: "زێڕفرۆشی نیشتمان", ar: "صائغ نيشتمان", en: "Nishtiman Gold" },
    category: "gold", city: "erbil",
    district: { ku: "بازاڕی زێڕ", ar: "سوق الذهب", en: "Gold Bazaar" },
    phone: "+964 750 313 8800",
    tags: ["ئەڵقە", "خشڵ", "زەماوەند", "خاتم"],
  },
  {
    id: "erb-mechanic-rebaz",
    name: { ku: "مێکانیکی ڕێباز", ar: "ميكانيكي ريباز", en: "Rebaz Mechanic" },
    category: "mechanic", city: "erbil",
    phone: "+964 751 242 5566",
    tags: ["تایە", "کارواش", "بەنزین", "تاير"],
  },
  {
    id: "dhk-hardware-berwari",
    name: { ku: "کەرەستەی بەرواری", ar: "مواد بيرواري", en: "Berwari Hardware" },
    category: "hardware", city: "duhok",
    phone: "+964 750 878 4400",
    tags: ["چیمەنتۆ", "بۆیە", "اسمنت"],
  },
  {
    id: "erb-stationery-zanko",
    name: { ku: "قەرتاسیەی زانکۆ", ar: "قرطاسية الجامعة", en: "Zanko Stationery" },
    category: "stationery", city: "erbil",
    phone: "+964 770 656 1199",
    tags: ["فۆتۆکۆپی", "چاپ", "دەفتەر", "طباعة"],
  },
  {
    id: "slm-perfume-evin",
    name: { ku: "بۆنفرۆشی ئێڤین", ar: "عطور إيفين", en: "Evin Perfume" },
    category: "perfume", city: "sulaymaniyah",
    phone: "+964 773 404 2277",
    tags: ["عەتر", "مەکیاج", "مكياج"],
  },
];
