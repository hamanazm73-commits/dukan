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
      "ئایفۆن", "ایفون", "ئایفۆن ١٧", "iphone 17", "galaxy", "گەلاکسی", "شاشە",  "پاوەربانک", "هێدفۆن", "سماعة", "بەتری مۆبایل", "سیمکارت", "خط",
      // more of the same, in the words people actually reach for
      "شیاومی", "xiaomi", "redmi", "ڕێدمی", "هواوی", "huawei", "oppo", "ئۆپۆ",
      "realme", "tecno", "infinix", "ئایپاد", "ipad", "تابلێت", "tablet",
      "کارتی شارژ", "ئێیرپۆدز", "airpods", "بلوتوس", "سکرینی زیخاجی", "زجاج شاشة",
      "شاحن", "كيبل", "سماعات", "بطارية", "چاککردنەوەی مۆبایل", "تصليح موبايل",
      "repair",
      // things people ask for, in the words they use for them
      "سامسۆنگ", "شاومی", "ریدمی", "ڤیڤۆ", "vivo", "ریلمی", "نۆکیا",
      "nokia", "تەکنۆ", "ئینفینکس", "تابلیت", "جیهاز", "شاشه", "غطاء",
      "کەیس", "زجاج", "جام", "گلاس", "سکرین پرۆتیکتەر", "headphone",
      "بلوتوث", "bluetooth", "power bank", "cable", "usb", "type-c", "sim",
      "کارتی شەحن", "چاکردنەوەی مۆبایل", "تعمير موبايل", "phone repair",
      "فلاشکردن", "سۆفتوێر",
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
      "گوڵی سوور", "گولی سور", "ورد احمر", "گوڵی سپی", "ڕۆز", "روز",  "دەستەگوڵی بووک", "گوڵی زەماوەند", "سەبەتەی گوڵ", "red rose", 
      // more of the same, in the words people actually reach for
      "گوڵی مەسنوعی", "ورد صناعي", "گوڵدان", "مزهرية", "vase", "دیاری", "هدية",
      "gift", "تاجی گوڵ", "إكليل", "wreath", "ئۆرکید", "orchid", "تیولیپ", "tulip",
      "زەنبەق", "lily", "گوڵی ڕۆژی دایک", "سەبەتەی دیاری",
      // things people ask for, in the words they use for them
      "بۆکێت", "artificial flowers", "بۆکێتی بووک", "bridal bouquet",
      "دیکۆری زەماوەند", "تزيين", "decoration", "گوڵی ڕۆز", "گوڵی ناوماڵ",
      "نبتة", "plant", "کاکتەس", "cactus", "بەخشین", "هدية ورد",
      "gift flowers",
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
      // things people ask for, in the words they use for them
      "پەنادۆل", "بنادول", "ئەسپرین", "aspirin", "بروفین", "brufen",
      "ibuprofen", "ئانتیبایۆتیک", "شراب", "syrup", "کپسول", "capsule",
      "كبسول", "ئیبرە", "حقنة", "injection", "vitamin", "کالسیۆم",
      "calcium", "زینک", "zinc", "دەرمانی سکچوون", "اسهال", "دەرمانی کۆکە",
      "سعال", "cough", "دەرمانی تا", "fever", "پانسمان", "ضماد", "دیتۆل",
      "dettol", "کریم", "cream", "مرهم", "پەمپەرزی منداڵ", "تێرمۆمیتەر",
      "thermometer", "کەمەربەند", "دەرمانخانەی شەوانە",
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
      "کەبابی برژاو",  "برنج", "دۆڵمە", "پیتزا",   "تکە", "مەندی", "قوزی", "بریانی",
      // more of the same, in the words people actually reach for
      "برگەر", "بيتزا", "شاورمە", "برياني", "تەشریب", "دولمة", "قووزی", "قوزي",
      "مندي", "فەلافل", "فلافل", "falafel", "سەندویچ", "سندويش", "sandwich",
      "مریشکی برژاو", "دجاج مشوي", "grill", "نانی بەیانی", "فطور", "گەیاندن",
      "delivery",
      // things people ask for, in the words they use for them
      "تكة", "tika", "biryani", "دۆڵما", "یاپراخ", "پاچە", "پاچه",
      "سەرووپێ", "کوفتە", "كفتة", "kofta", "حەمووس", "حمص", "hummus",
      "سالاد", "سلطة", "salad", "ڕیز", "rice", "چیکن", "chicken", "دجاج",
      "مریشک", "بریان", "مشوي", "فاست فوود", "fast food", "دەلیڤەری",
      "توصيل", "نانخواردن", "چێشتخانەی کوردی", "برەشتە", "breakfast",
      "شام", "dinner",
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
      "نانی تەندوور",  "کێکی ساڵیاد",   "بەقلاوە", "کولێرە", "تۆرتە",  "خبز تنور",
      // more of the same, in the words people actually reach for
      "لەواش", "لواش", "تەندوور", "تنور", "کلێچە", "كليجة", "بقلاوة", "baklava",
      "کێکی زەماوەند", "كيك زفاف", "wedding cake", "دۆنەت", "donut", "کرواسان",
      "croissant", "بسکویت", "بسكويت", "biscuit", "معجنات",
      // things people ask for, in the words they use for them
      "سەموون", "نانی تەنوور", "تورتة", "gateau", "گاتۆ", "كيك عيد ميلاد",
      "birthday cake", "کوکی", "cookie", "بسکوت", "زەڵابیە", "زلابية",
      "کنافە", "كنافة", "kunafa", "دەسەرت", "dessert", "پەیستری",
      "پیراشکی", "بۆرەک", "بۆرەکی", "فطائر", "چۆکلێت", "chocolate",
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
      "کراسی کوردی",   "جاکێت", "تیشێرت", "شاڵ", "کراوات", "عەبا", 
      // more of the same, in the words people actually reach for
      "بنطلون", "جینز", "jeans", "تيشيرت", "t-shirt", "چاکەت", "جاكيت", "jacket",
      "پاڵتۆ", "معطف", "coat", "فستان", "dress", "جلی منداڵ", "ملابس اطفال",
      "زي كردي", "شەرواڵ", "هودی", "hoodie",
      // things people ask for, in the words they use for them
      "قمیس", "pants", "جينز", "تيشرت", "دشداشە", "عباية", "abaya",
      "حیجاب", "حجاب", "hijab", "شەڵ", "شال", "زێ کوردی", "لباس كردي",
      "کراسی بووک", "فستانی زەماوەند", "wedding dress", "بدلة", "suit",
      "سووت", "kids clothes", "جلوبەرگی وەرزشی", "رياضي", "sportswear",
      "جلی ناوەوە", "داخلي", "underwear", "کۆرسێت", "جوراب", "socks",
      "گۆرەوی",
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
      // things people ask for, in the words they use for them
      "قوندەرەی منداڵ", "حذاء اطفال", "kids shoes", "قوندەرەی ژنانە",
      "حذاء نسائي", "قوندەرەی پیاوانە", "حذاء رجالي", "پێڵاوی چەرم", "جلد",
      "leather", "کلاش", "کڵاش", "کلاشی کوردی", "clash", "پووما", "puma",
      "ریبۆک", "reebok", "نیوباڵانس", "new balance", "سکێچەرز", "skechers",
      "کۆنڤێرس", "converse", "ڤانس", "vans", "شەمشەمەی حەمام",
      "قوندەرەی مەدرەسە", "school shoes", "بۆیاخی پێڵاو", "ملمع", "polish",
      "قەیتان", "رباط",
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
        "جلشۆر", "مایکرۆوەیڤ", "لاپتۆپ", "پرینتەر", "مکیف", "سبلت", "فرن", "کاولەر",
      // more of the same, in the words people actually reach for
      "لابتوب", "کۆمپیوتەر", "كمبيوتر", "pc", "طابعة", "printer", "کامێرا",
      "كاميرا", "camera", "سپیکەر", "مكبر صوت", "speaker", "پلەیستەیشن",
      "بلايستيشن", "playstation", "ڕاوتەر", "router", "مۆلیدە", "generator",
      "ستەبلایزەر",
      // things people ask for, in the words they use for them
      "تەلەفزیۆن", "television", "شاشەی تەلەفزیۆن", "computer", "حاسوب",
      "ماوس", "mouse", "کیبۆرد", "keyboard", "لوحة مفاتيح", "راوتر",
      "وایفای", "wifi", "کامێرای چاودێری", "cctv", "مراقبة", "ئەمپلیفایەر",
      "ڕیسیڤەر", "receiver", "ستالایت", "satellite", "ساتلایت", "ps5",
      "ئێکسبۆکس", "xbox", "گەیم", "کۆنسۆل", "console", "فریزەر", "freezer",
      "جامەشۆر", "microwave", "میکرویف", "فڕنی کارەبایی", "oven", "مولدة",
      "کۆندیشن", "سپلێت", "split", "پەنکە", "مروحة", "fan", "سخانە",
      "سخان", "water heater", "ئوتی", "مكواة", "iron", "خەڵاتە", "خلاط",
      "blender",
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
        "مێزی خواردن", "دۆڵابی جل",  "دۆشەک", "پەردە", "سەت مۆبیلیا", 
      // more of the same, in the words people actually reach for
      "كرسي", "تەخت", "فرشة", "mattress", "دۆڵاب", "دولاب", "wardrobe",
      "مێزی خوێندن", "مكتب", "desk", "ستارة", "curtain", "فەرش", "سجاد", "carpet",
      // things people ask for, in the words they use for them
      "کەنەفە", "کەنەبە", "میزی نان", "طاولة طعام", "قەنەفەی زاڵ",
      "طقم كنب", "living room", "فراش", "مەتریس", "قەبات", "خزانة",
      "کابینەت", "cabinet", "مەکتەب", "ڕەفە", "رف", "shelf", "کتێبخانە",
      "مکتبة", "مۆبیلیای ژووری نووستن", "غرفة نوم", "bedroom",
      "مۆبیلیای منداڵ", "زەولی", "موکێت", "موكيت", "ئایینە", "مرآة",
      "mirror", "لامپە", "lamp", "ثريا", "چڵچرا",
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
      // things people ask for, in the words they use for them
      "حليب", "milk", "مەست", "لبن", "yogurt", "زیت", "زەیت", "oil", "رز",
      "سكر", "sugar", "چا", "شاي", "tea", "قهوة", "coffee", "نێسکافێ",
      "nescafe", "مەشرووب", "مشروبات", "juice", "شەربەت", "پێپسی", "pepsi",
      "کۆکاکۆلا", "coca cola", "چیپس", "chips", "بسکویت", "شەکرۆکە",
      "حلوى", "candy", "طماطة", "vegetables", "مریشکی ساردکراو",
      "دجاج مجمد", "eggs", "نانی توست", "مادەی پاککەرەوە", "detergent",
      "سابوون", "شامپۆ", "شامبو", "shampoo", "پەمپەرز", "حفاضات", "دیپەر",
      "diapers", "کاغەزی تەندروستی", "مناديل", "tissue",
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
       "ڕیشتاشین", "سەرتاشین", "ڕەنگکردنی قژ", 
      // more of the same, in the words people actually reach for
      "ڕیش", "لحية", "beard", "حلاقة ذقن", "shave", "ماکینەی سەرتاشین",
      "ماكينة حلاقة", "شامپۆ", "شامبو", "shampoo", "ژەل", "جل", "gel",
      "سەرتاشی منداڵ", "حلاق اطفال", "kids haircut", "کوافێر", "كوافير",
      "coiffure", "hairdresser", "ڕەنگی قژ", "صبغة شعر", "dye",
      // things people ask for, in the words they use for them
      "قژبڕ", "قصة شعر", "قژبڕینەوە", "شێوکردن", "کوافێری ژنانە", "سالۆن",
      "میکیاج", "مكياج", "makeup", "میکاپ", "hair dye", "دای", "سیشوار",
      "سشوار", "blow dry", "کێراتین", "keratin", "بڕۆتێین", "پێچانەوەی قژ",
      "تسريحة", "hairstyle", "قژی بووک", "عروس", "bridal", "ماساژ", "مساج",
      "massage", "حەمامی تورکی", "spa", "سپا", "مانیکێر", "manicure",
      "پەدیکێر", "pedicure", "نینۆک", "أظافر", "nails", "ئەبرۆ", "حواجب",
      "eyebrow", "شەمعدان",
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
      "ئەڵقەی زەماوەند",   "زنجیر", "دەستبەند", "گوارە",  "سلسلة",
      // more of the same, in the words people actually reach for
      "chain", "بازن", "اسورة", "bracelet", "حلق", "earring", "زیو", "فضة",
      "silver", "ئەڵماس", "کاتژمێر", "ساعة", "watch", "زێڕی زەماوەند", "ذهب زفاف",
      "طقم",
      // things people ask for, in the words they use for them
      "jeweler", "جواهرچی", "خاتم زواج", "wedding ring", "جواهرات",
      "ملوانکە", "قلادة", "necklace", "زنجیرە", "سوار", "گواره",
      "زێڕی عیاری ٢١", "عيار 21", "21k", "٢٤ عیار", "24k", "پلاتین",
      "platinum", "بەرد", "حجر", "ساعەت", "ڕۆلێکس", "rolex",
      "دیاری زەماوەند", "طقم ذهب",
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
       "بەتری", "زەیت", "فلتەر",  "سایلەنسەر",  "بطارية", "زيت",
      // more of the same, in the words people actually reach for
      "battery", "oil", "فلتر", "filter", "بڕێک", "بريك", "brake", "کلچ", "كلتش",
      "clutch", "ڕادیێتەر", "رادييتر", "radiator", "بۆیاخی ئۆتۆمبێل", "صبغ سيارة",
      "کارەبای ئۆتۆمبێل", "كهربائي سيارات", "شوشتنی ئۆتۆمبێل", "car wash", "قەرەج",
      "پارچەی یەدەگ", "قطع غيار", "spare parts",
      // things people ask for, in the words they use for them
      "مێکانیک", "چاکردنەوەی ئۆتۆمبێل", "تصليح سيارات", "car repair",
      "ورشة", "وەرشە", "گەراج", "پەنچەر", "بنجر", "puncture", "بەلەنس",
      "بلنس", "balance", "تعويض زيت", "oil change", "دینەمۆ", "دينمو",
      "ستارتەر", "بریک", "فرامل", "brakes", "کلەچ", "كلج", "گێربۆکس",
      "قير", "gearbox", "ريديتر", "ئێگزۆست", "عادم", "exhaust",
      "صبغ سيارات", "car paint", "سمکەری", "سمكري", "denting",
      "پارچەی ئۆتۆمبێل", "سپێرپارت",
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
          "کاشی", "لوولە", "وایەر", "سمنت", 
      // more of the same, in the words people actually reach for
      "چەکوش", "مطرقة", "hammer", "بزمار", "مسمار", "nail", "دریل", "دريل",
      "drill", "انبوب", "pipe", "سیم", "سلك", "wire", "قفڵ", "قفل", "lock",
      "دەرگا", "باب", "door", "پەنجەرە", "شباك", "window", "سیمان", "كاشي", "tile",
      // things people ask for, in the words they use for them
      "کەرەستەی بیناسازی", "مواد بناء", "building materials", "بلوک",
      "بلوك", "block", "حەسا", "حصى", "خۆڵ", "رمل", "sand", "شیش", "steel",
      "ئاسن", "بۆیاخ", "دهان", "فرشەی بۆیاخ", "تایل", "سيراميك", "ceramic",
      "کاشێ", "بلاط", "tiles", "مەرمەر", "رخام", "marble", "گرانیت",
      "granite", "قوفڵ", "کلیل", "مفتاح", "key", "برغی", "برغي", "screw",
      "چەکووش", "مەقەس", "منشار", "saw", "کەرەستەی ئاو", "سباكة",
      "plumbing", "بۆری", "أنبوب", "موسڵ", "حنفية", "tap", "کارەبا",
      "كهربائيات", "electrical", "پریز", "مفتاح كهرباء", "switch", "لامپ",
      "لمبة", "bulb", "لێد", "led", "ئامێری کارەبایی",
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
         "چاپکردن", "کاغەز", "فایل",  
      // more of the same, in the words people actually reach for
      "قەڵەم", "قلم رصاص", "pencil", "ورق", "paper", "printing", "کۆپی", "تصوير",
      "photocopy", "چانتەی قوتابخانە", "حقيبة مدرسية", "school bag",
      "قرطاسية مدرسية",
      // things people ask for, in the words they use for them
      "قەڵەمی ڕەساس", "پەڕاو", "کتێبی خوێندن", "منهج", "textbook", "بەگ",
      "a4", "پرینت", "لەمینەیشن", "تغليف", "laminate", "ستیکەر", "ملصق",
      "sticker", "مقص", "غراء", "glue", "چەسپ", "لاصق", "tape", "سکۆچ",
      "مسطرة", "ruler", "مەسحەرە", "ممحاة", "eraser", "بڕاسیلکە", "ڕەنگ",
      "الوان", "colors", "کەرەستەی هونەری", "رسم", "drawing",
      "کارتی پیرۆزبایی", "بطاقة", "card", "دیاری", "هدايا", "gifts",
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
       "بۆنی پیاوان", "بۆنی ژنان",  "کرێم", "لیپستیک", "عطر رجالي", 
      // more of the same, in the words people actually reach for
      "عطر نسائي", "دیۆدۆرانت", "مزيل عرق", "deodorant", "بەخوور", "بخور", "عود",
      "oud", "لوسیۆن", "lotion", "میکئەپ", "احمر شفاه", "lipstick",
      // things people ask for, in the words they use for them
      "بۆنخۆش", "دهن عود", "incense", "مسک", "مسك", "musk", "عەنبەر",
      "عنبر", "amber", "عەتری پیاوانە", "عەتری ژنانە", "بادی سپرەی",
      "بخاخ", "body spray", "کریمی دەست", "لوشن", "کەرەستەی جوانکاری",
      "مستحضرات تجميل", "شامپۆی قژ", "بەڵسەم", "بلسم", "conditioner",
      "ماسک", "قناع", "mask", "سابوونی دەست", "معطر", "freshener",
      "بۆنی ماڵ", "معطر جو", "air freshener",
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
