// src/lib/data/iran-locations.ts

type IranCityLocationEntry = {
  readonly id: string;
  readonly parentId: string;
  readonly name: string;
};

type IranProvinceLocationEntry = {
  readonly id: string;
  readonly name: string;
  readonly cities: readonly IranCityLocationEntry[];
};

export const IRAN_LOCATIONS = [
  {
    id: "province-01",
    name: "آذربایجان شرقی",
    cities: [
      {
        id: "city-01-001",
        parentId: "province-01",
        name: "آبش احمد",
      },
      {
        id: "city-01-002",
        parentId: "province-01",
        name: "آذرشهر",
      },
      {
        id: "city-01-003",
        parentId: "province-01",
        name: "آقکند",
      },
      {
        id: "city-01-004",
        parentId: "province-01",
        name: "اچاچی",
      },
      {
        id: "city-01-005",
        parentId: "province-01",
        name: "اسکو",
      },
      {
        id: "city-01-006",
        parentId: "province-01",
        name: "اهر",
      },
      {
        id: "city-01-007",
        parentId: "province-01",
        name: "ایلخچی",
      },
      {
        id: "city-01-008",
        parentId: "province-01",
        name: "باسمنج",
      },
      {
        id: "city-01-009",
        parentId: "province-01",
        name: "بخشایش",
      },
      {
        id: "city-01-010",
        parentId: "province-01",
        name: "بستان آباد",
      },
      {
        id: "city-01-011",
        parentId: "province-01",
        name: "بناب",
      },
      {
        id: "city-01-012",
        parentId: "province-01",
        name: "بناب مرند",
      },
      {
        id: "city-01-013",
        parentId: "province-01",
        name: "تبریز",
      },
      {
        id: "city-01-014",
        parentId: "province-01",
        name: "ترک",
      },
      {
        id: "city-01-015",
        parentId: "province-01",
        name: "ترکمانچای",
      },
      {
        id: "city-01-016",
        parentId: "province-01",
        name: "تسوج",
      },
      {
        id: "city-01-017",
        parentId: "province-01",
        name: "تیکمه داش",
      },
      {
        id: "city-01-018",
        parentId: "province-01",
        name: "تیمورلو",
      },
      {
        id: "city-01-019",
        parentId: "province-01",
        name: "جلفا",
      },
      {
        id: "city-01-020",
        parentId: "province-01",
        name: "جوان قلعه",
      },
      {
        id: "city-01-021",
        parentId: "province-01",
        name: "خاروانا",
      },
      {
        id: "city-01-022",
        parentId: "province-01",
        name: "خامنه",
      },
      {
        id: "city-01-023",
        parentId: "province-01",
        name: "خداجو(خراجو)",
      },
      {
        id: "city-01-024",
        parentId: "province-01",
        name: "خسروشاه",
      },
      {
        id: "city-01-025",
        parentId: "province-01",
        name: "خمارلو",
      },
      {
        id: "city-01-026",
        parentId: "province-01",
        name: "خواجه",
      },
      {
        id: "city-01-027",
        parentId: "province-01",
        name: "دوزدوزان",
      },
      {
        id: "city-01-028",
        parentId: "province-01",
        name: "زرنق",
      },
      {
        id: "city-01-029",
        parentId: "province-01",
        name: "زنوز",
      },
      {
        id: "city-01-030",
        parentId: "province-01",
        name: "سراب",
      },
      {
        id: "city-01-031",
        parentId: "province-01",
        name: "سردرود",
      },
      {
        id: "city-01-032",
        parentId: "province-01",
        name: "سهند",
      },
      {
        id: "city-01-033",
        parentId: "province-01",
        name: "سیس",
      },
      {
        id: "city-01-034",
        parentId: "province-01",
        name: "سیه رود",
      },
      {
        id: "city-01-035",
        parentId: "province-01",
        name: "شبستر",
      },
      {
        id: "city-01-036",
        parentId: "province-01",
        name: "شربیان",
      },
      {
        id: "city-01-037",
        parentId: "province-01",
        name: "شرفخانه",
      },
      {
        id: "city-01-038",
        parentId: "province-01",
        name: "شندآباد",
      },
      {
        id: "city-01-039",
        parentId: "province-01",
        name: "صوفیان",
      },
      {
        id: "city-01-040",
        parentId: "province-01",
        name: "عجب شیر",
      },
      {
        id: "city-01-041",
        parentId: "province-01",
        name: "قره آغاج",
      },
      {
        id: "city-01-042",
        parentId: "province-01",
        name: "کشکسرای",
      },
      {
        id: "city-01-043",
        parentId: "province-01",
        name: "کلوانق",
      },
      {
        id: "city-01-044",
        parentId: "province-01",
        name: "کلیبر",
      },
      {
        id: "city-01-045",
        parentId: "province-01",
        name: "کوزه کنان",
      },
      {
        id: "city-01-046",
        parentId: "province-01",
        name: "گوگان",
      },
      {
        id: "city-01-047",
        parentId: "province-01",
        name: "لیلان",
      },
      {
        id: "city-01-048",
        parentId: "province-01",
        name: "مبارک شهر",
      },
      {
        id: "city-01-049",
        parentId: "province-01",
        name: "مراغه",
      },
      {
        id: "city-01-050",
        parentId: "province-01",
        name: "مرند",
      },
      {
        id: "city-01-051",
        parentId: "province-01",
        name: "ملکان",
      },
      {
        id: "city-01-052",
        parentId: "province-01",
        name: "ممقان",
      },
      {
        id: "city-01-053",
        parentId: "province-01",
        name: "مهربان",
      },
      {
        id: "city-01-054",
        parentId: "province-01",
        name: "میانه",
      },
      {
        id: "city-01-055",
        parentId: "province-01",
        name: "نظرکهریزی",
      },
      {
        id: "city-01-056",
        parentId: "province-01",
        name: "وایقان",
      },
      {
        id: "city-01-057",
        parentId: "province-01",
        name: "ورزقان",
      },
      {
        id: "city-01-058",
        parentId: "province-01",
        name: "هادیشهر",
      },
      {
        id: "city-01-059",
        parentId: "province-01",
        name: "هریس",
      },
      {
        id: "city-01-060",
        parentId: "province-01",
        name: "هشترود",
      },
      {
        id: "city-01-061",
        parentId: "province-01",
        name: "هوراند",
      },
      {
        id: "city-01-062",
        parentId: "province-01",
        name: "یامچی",
      },
    ],
  },
  {
    id: "province-02",
    name: "آذربایجان غربی",
    cities: [
      {
        id: "city-02-001",
        parentId: "province-02",
        name: "آواجیق",
      },
      {
        id: "city-02-002",
        parentId: "province-02",
        name: "ارومیه",
      },
      {
        id: "city-02-003",
        parentId: "province-02",
        name: "اشنویه",
      },
      {
        id: "city-02-004",
        parentId: "province-02",
        name: "ایواوغلی",
      },
      {
        id: "city-02-005",
        parentId: "province-02",
        name: "باروق",
      },
      {
        id: "city-02-006",
        parentId: "province-02",
        name: "بازرگان",
      },
      {
        id: "city-02-007",
        parentId: "province-02",
        name: "بوکان",
      },
      {
        id: "city-02-008",
        parentId: "province-02",
        name: "پلدشت",
      },
      {
        id: "city-02-009",
        parentId: "province-02",
        name: "پیرانشهر",
      },
      {
        id: "city-02-010",
        parentId: "province-02",
        name: "تازه شهر",
      },
      {
        id: "city-02-011",
        parentId: "province-02",
        name: "تکاب",
      },
      {
        id: "city-02-012",
        parentId: "province-02",
        name: "چهاربرج",
      },
      {
        id: "city-02-013",
        parentId: "province-02",
        name: "خلیفان",
      },
      {
        id: "city-02-014",
        parentId: "province-02",
        name: "خوی",
      },
      {
        id: "city-02-015",
        parentId: "province-02",
        name: "دیزج دیز",
      },
      {
        id: "city-02-016",
        parentId: "province-02",
        name: "ربط",
      },
      {
        id: "city-02-017",
        parentId: "province-02",
        name: "زرآباد",
      },
      {
        id: "city-02-018",
        parentId: "province-02",
        name: "سردشت",
      },
      {
        id: "city-02-019",
        parentId: "province-02",
        name: "سرو",
      },
      {
        id: "city-02-020",
        parentId: "province-02",
        name: "سلماس",
      },
      {
        id: "city-02-021",
        parentId: "province-02",
        name: "سیلوانه",
      },
      {
        id: "city-02-022",
        parentId: "province-02",
        name: "سیمینه",
      },
      {
        id: "city-02-023",
        parentId: "province-02",
        name: "سیه چشمه",
      },
      {
        id: "city-02-024",
        parentId: "province-02",
        name: "شاهین دژ",
      },
      {
        id: "city-02-025",
        parentId: "province-02",
        name: "شوط",
      },
      {
        id: "city-02-026",
        parentId: "province-02",
        name: "فیرورق",
      },
      {
        id: "city-02-027",
        parentId: "province-02",
        name: "قره ضیاءالدین",
      },
      {
        id: "city-02-028",
        parentId: "province-02",
        name: "قطور",
      },
      {
        id: "city-02-029",
        parentId: "province-02",
        name: "قوشچی",
      },
      {
        id: "city-02-030",
        parentId: "province-02",
        name: "کشاورز",
      },
      {
        id: "city-02-031",
        parentId: "province-02",
        name: "گردکشانه",
      },
      {
        id: "city-02-032",
        parentId: "province-02",
        name: "ماکو",
      },
      {
        id: "city-02-033",
        parentId: "province-02",
        name: "محمدیار",
      },
      {
        id: "city-02-034",
        parentId: "province-02",
        name: "محمودآباد",
      },
      {
        id: "city-02-035",
        parentId: "province-02",
        name: "مرگنلر",
      },
      {
        id: "city-02-036",
        parentId: "province-02",
        name: "مهاباد",
      },
      {
        id: "city-02-037",
        parentId: "province-02",
        name: "میاندوآب",
      },
      {
        id: "city-02-038",
        parentId: "province-02",
        name: "میرآباد",
      },
      {
        id: "city-02-039",
        parentId: "province-02",
        name: "نازک علیا",
      },
      {
        id: "city-02-040",
        parentId: "province-02",
        name: "نالوس",
      },
      {
        id: "city-02-041",
        parentId: "province-02",
        name: "نقده",
      },
      {
        id: "city-02-042",
        parentId: "province-02",
        name: "نوشین",
      },
    ],
  },
  {
    id: "province-03",
    name: "اردبیل",
    cities: [
      {
        id: "city-03-001",
        parentId: "province-03",
        name: "آبی بیگلو",
      },
      {
        id: "city-03-002",
        parentId: "province-03",
        name: "اردبیل",
      },
      {
        id: "city-03-003",
        parentId: "province-03",
        name: "اسلام اباد",
      },
      {
        id: "city-03-004",
        parentId: "province-03",
        name: "اصلاندوز",
      },
      {
        id: "city-03-005",
        parentId: "province-03",
        name: "بیله سوار",
      },
      {
        id: "city-03-006",
        parentId: "province-03",
        name: "پارس آباد",
      },
      {
        id: "city-03-007",
        parentId: "province-03",
        name: "تازه کند",
      },
      {
        id: "city-03-008",
        parentId: "province-03",
        name: "تازه کندانگوت",
      },
      {
        id: "city-03-009",
        parentId: "province-03",
        name: "جعفرآباد",
      },
      {
        id: "city-03-010",
        parentId: "province-03",
        name: "خلخال",
      },
      {
        id: "city-03-011",
        parentId: "province-03",
        name: "رضی",
      },
      {
        id: "city-03-012",
        parentId: "province-03",
        name: "سرعین",
      },
      {
        id: "city-03-013",
        parentId: "province-03",
        name: "عنبران",
      },
      {
        id: "city-03-014",
        parentId: "province-03",
        name: "فخراباد",
      },
      {
        id: "city-03-015",
        parentId: "province-03",
        name: "قصابه",
      },
      {
        id: "city-03-016",
        parentId: "province-03",
        name: "کلور",
      },
      {
        id: "city-03-017",
        parentId: "province-03",
        name: "کوراییم",
      },
      {
        id: "city-03-018",
        parentId: "province-03",
        name: "گرمی",
      },
      {
        id: "city-03-019",
        parentId: "province-03",
        name: "گیوی",
      },
      {
        id: "city-03-020",
        parentId: "province-03",
        name: "لاهرود",
      },
      {
        id: "city-03-021",
        parentId: "province-03",
        name: "مرادلو",
      },
      {
        id: "city-03-022",
        parentId: "province-03",
        name: "مشگین شهر",
      },
      {
        id: "city-03-023",
        parentId: "province-03",
        name: "نمین",
      },
      {
        id: "city-03-024",
        parentId: "province-03",
        name: "نیر",
      },
      {
        id: "city-03-025",
        parentId: "province-03",
        name: "هشتجین",
      },
      {
        id: "city-03-026",
        parentId: "province-03",
        name: "هیر",
      },
    ],
  },
  {
    id: "province-04",
    name: "اصفهان",
    cities: [
      {
        id: "city-04-001",
        parentId: "province-04",
        name: "آران وبیدگل",
      },
      {
        id: "city-04-002",
        parentId: "province-04",
        name: "ابریشم",
      },
      {
        id: "city-04-003",
        parentId: "province-04",
        name: "ابوزیدآباد",
      },
      {
        id: "city-04-004",
        parentId: "province-04",
        name: "اردستان",
      },
      {
        id: "city-04-005",
        parentId: "province-04",
        name: "اژیه",
      },
      {
        id: "city-04-006",
        parentId: "province-04",
        name: "اصغرآباد",
      },
      {
        id: "city-04-007",
        parentId: "province-04",
        name: "اصفهان",
      },
      {
        id: "city-04-008",
        parentId: "province-04",
        name: "افوس",
      },
      {
        id: "city-04-009",
        parentId: "province-04",
        name: "انارک",
      },
      {
        id: "city-04-010",
        parentId: "province-04",
        name: "ایمانشهر",
      },
      {
        id: "city-04-011",
        parentId: "province-04",
        name: "بادرود",
      },
      {
        id: "city-04-012",
        parentId: "province-04",
        name: "باغ بهادران",
      },
      {
        id: "city-04-013",
        parentId: "province-04",
        name: "باغشاد",
      },
      {
        id: "city-04-014",
        parentId: "province-04",
        name: "بافران",
      },
      {
        id: "city-04-015",
        parentId: "province-04",
        name: "برزک",
      },
      {
        id: "city-04-016",
        parentId: "province-04",
        name: "برف انبار",
      },
      {
        id: "city-04-017",
        parentId: "province-04",
        name: "بویین ومیاندشت",
      },
      {
        id: "city-04-018",
        parentId: "province-04",
        name: "بهاران شهر",
      },
      {
        id: "city-04-019",
        parentId: "province-04",
        name: "بهارستان",
      },
      {
        id: "city-04-020",
        parentId: "province-04",
        name: "پیربکران",
      },
      {
        id: "city-04-021",
        parentId: "province-04",
        name: "تودشک",
      },
      {
        id: "city-04-022",
        parentId: "province-04",
        name: "تیران",
      },
      {
        id: "city-04-023",
        parentId: "province-04",
        name: "جندق",
      },
      {
        id: "city-04-024",
        parentId: "province-04",
        name: "جوزدان",
      },
      {
        id: "city-04-025",
        parentId: "province-04",
        name: "جوشقان قالی",
      },
      {
        id: "city-04-026",
        parentId: "province-04",
        name: "چادگان",
      },
      {
        id: "city-04-027",
        parentId: "province-04",
        name: "چرمهین",
      },
      {
        id: "city-04-028",
        parentId: "province-04",
        name: "چمگردان",
      },
      {
        id: "city-04-029",
        parentId: "province-04",
        name: "حبیب آباد",
      },
      {
        id: "city-04-030",
        parentId: "province-04",
        name: "حسن اباد",
      },
      {
        id: "city-04-031",
        parentId: "province-04",
        name: "حنا",
      },
      {
        id: "city-04-032",
        parentId: "province-04",
        name: "خالدآباد",
      },
      {
        id: "city-04-033",
        parentId: "province-04",
        name: "خمینی شهر",
      },
      {
        id: "city-04-034",
        parentId: "province-04",
        name: "خوانسار",
      },
      {
        id: "city-04-035",
        parentId: "province-04",
        name: "خور",
      },
      {
        id: "city-04-036",
        parentId: "province-04",
        name: "خورزوق",
      },
      {
        id: "city-04-037",
        parentId: "province-04",
        name: "داران",
      },
      {
        id: "city-04-038",
        parentId: "province-04",
        name: "دامنه",
      },
      {
        id: "city-04-039",
        parentId: "province-04",
        name: "درچه",
      },
      {
        id: "city-04-040",
        parentId: "province-04",
        name: "دستگرد",
      },
      {
        id: "city-04-041",
        parentId: "province-04",
        name: "دولت آباد",
      },
      {
        id: "city-04-042",
        parentId: "province-04",
        name: "دهاقان",
      },
      {
        id: "city-04-043",
        parentId: "province-04",
        name: "دهق",
      },
      {
        id: "city-04-044",
        parentId: "province-04",
        name: "دیزیچه",
      },
      {
        id: "city-04-045",
        parentId: "province-04",
        name: "رزوه",
      },
      {
        id: "city-04-046",
        parentId: "province-04",
        name: "رضوانشهر",
      },
      {
        id: "city-04-047",
        parentId: "province-04",
        name: "زازران",
      },
      {
        id: "city-04-048",
        parentId: "province-04",
        name: "زاینده رود",
      },
      {
        id: "city-04-049",
        parentId: "province-04",
        name: "زرین شهر",
      },
      {
        id: "city-04-050",
        parentId: "province-04",
        name: "زواره",
      },
      {
        id: "city-04-051",
        parentId: "province-04",
        name: "زیار",
      },
      {
        id: "city-04-052",
        parentId: "province-04",
        name: "زیباشهر",
      },
      {
        id: "city-04-053",
        parentId: "province-04",
        name: "سجزی",
      },
      {
        id: "city-04-054",
        parentId: "province-04",
        name: "سده لنجان",
      },
      {
        id: "city-04-055",
        parentId: "province-04",
        name: "سفیدشهر",
      },
      {
        id: "city-04-056",
        parentId: "province-04",
        name: "سمیرم",
      },
      {
        id: "city-04-057",
        parentId: "province-04",
        name: "سین",
      },
      {
        id: "city-04-058",
        parentId: "province-04",
        name: "شاپورآباد",
      },
      {
        id: "city-04-059",
        parentId: "province-04",
        name: "شاهین شهر",
      },
      {
        id: "city-04-060",
        parentId: "province-04",
        name: "شهرضا",
      },
      {
        id: "city-04-061",
        parentId: "province-04",
        name: "طالخونچه",
      },
      {
        id: "city-04-062",
        parentId: "province-04",
        name: "طرق رود",
      },
      {
        id: "city-04-063",
        parentId: "province-04",
        name: "عسگران",
      },
      {
        id: "city-04-064",
        parentId: "province-04",
        name: "علویجه",
      },
      {
        id: "city-04-065",
        parentId: "province-04",
        name: "فرخی",
      },
      {
        id: "city-04-066",
        parentId: "province-04",
        name: "فریدونشهر",
      },
      {
        id: "city-04-067",
        parentId: "province-04",
        name: "فلاورجان",
      },
      {
        id: "city-04-068",
        parentId: "province-04",
        name: "فولادشهر",
      },
      {
        id: "city-04-069",
        parentId: "province-04",
        name: "قمصر",
      },
      {
        id: "city-04-070",
        parentId: "province-04",
        name: "قهجاورستان",
      },
      {
        id: "city-04-071",
        parentId: "province-04",
        name: "قهدریجان",
      },
      {
        id: "city-04-072",
        parentId: "province-04",
        name: "کاشان",
      },
      {
        id: "city-04-073",
        parentId: "province-04",
        name: "کامو و چوگان",
      },
      {
        id: "city-04-074",
        parentId: "province-04",
        name: "کرکوند",
      },
      {
        id: "city-04-075",
        parentId: "province-04",
        name: "کلیشادوسودرجان",
      },
      {
        id: "city-04-076",
        parentId: "province-04",
        name: "کمشچه",
      },
      {
        id: "city-04-077",
        parentId: "province-04",
        name: "کمه",
      },
      {
        id: "city-04-078",
        parentId: "province-04",
        name: "کوشک",
      },
      {
        id: "city-04-079",
        parentId: "province-04",
        name: "کوهپایه",
      },
      {
        id: "city-04-080",
        parentId: "province-04",
        name: "کهریزسنگ",
      },
      {
        id: "city-04-081",
        parentId: "province-04",
        name: "گرگاب",
      },
      {
        id: "city-04-082",
        parentId: "province-04",
        name: "گزبرخوار",
      },
      {
        id: "city-04-083",
        parentId: "province-04",
        name: "گلپایگان",
      },
      {
        id: "city-04-084",
        parentId: "province-04",
        name: "گلدشت",
      },
      {
        id: "city-04-085",
        parentId: "province-04",
        name: "گلشن",
      },
      {
        id: "city-04-086",
        parentId: "province-04",
        name: "گلشهر",
      },
      {
        id: "city-04-087",
        parentId: "province-04",
        name: "گوگد",
      },
      {
        id: "city-04-088",
        parentId: "province-04",
        name: "لای بید",
      },
      {
        id: "city-04-089",
        parentId: "province-04",
        name: "مبارکه",
      },
      {
        id: "city-04-090",
        parentId: "province-04",
        name: "مجلسی",
      },
      {
        id: "city-04-091",
        parentId: "province-04",
        name: "محمدآباد",
      },
      {
        id: "city-04-092",
        parentId: "province-04",
        name: "مشکات",
      },
      {
        id: "city-04-093",
        parentId: "province-04",
        name: "منظریه",
      },
      {
        id: "city-04-094",
        parentId: "province-04",
        name: "مهاباد",
      },
      {
        id: "city-04-095",
        parentId: "province-04",
        name: "میمه",
      },
      {
        id: "city-04-096",
        parentId: "province-04",
        name: "نایین",
      },
      {
        id: "city-04-097",
        parentId: "province-04",
        name: "نجف آباد",
      },
      {
        id: "city-04-098",
        parentId: "province-04",
        name: "نصرآباد",
      },
      {
        id: "city-04-099",
        parentId: "province-04",
        name: "نطنز",
      },
      {
        id: "city-04-100",
        parentId: "province-04",
        name: "نوش آباد",
      },
      {
        id: "city-04-101",
        parentId: "province-04",
        name: "نیاسر",
      },
      {
        id: "city-04-102",
        parentId: "province-04",
        name: "نیک آباد",
      },
      {
        id: "city-04-103",
        parentId: "province-04",
        name: "ورزنه",
      },
      {
        id: "city-04-104",
        parentId: "province-04",
        name: "ورنامخواست",
      },
      {
        id: "city-04-105",
        parentId: "province-04",
        name: "وزوان",
      },
      {
        id: "city-04-106",
        parentId: "province-04",
        name: "ونک",
      },
      {
        id: "city-04-107",
        parentId: "province-04",
        name: "هرند",
      },
    ],
  },
  {
    id: "province-05",
    name: "البرز",
    cities: [
      {
        id: "city-05-001",
        parentId: "province-05",
        name: "آسارا",
      },
      {
        id: "city-05-002",
        parentId: "province-05",
        name: "اشتهارد",
      },
      {
        id: "city-05-003",
        parentId: "province-05",
        name: "تنکمان",
      },
      {
        id: "city-05-004",
        parentId: "province-05",
        name: "چهارباغ",
      },
      {
        id: "city-05-005",
        parentId: "province-05",
        name: "شهرجدیدهشتگرد",
      },
      {
        id: "city-05-006",
        parentId: "province-05",
        name: "طالقان",
      },
      {
        id: "city-05-007",
        parentId: "province-05",
        name: "فردیس",
      },
      {
        id: "city-05-008",
        parentId: "province-05",
        name: "کرج",
      },
      {
        id: "city-05-009",
        parentId: "province-05",
        name: "کمال شهر",
      },
      {
        id: "city-05-010",
        parentId: "province-05",
        name: "کوهسار",
      },
      {
        id: "city-05-011",
        parentId: "province-05",
        name: "گرمدره",
      },
      {
        id: "city-05-012",
        parentId: "province-05",
        name: "گلسار",
      },
      {
        id: "city-05-013",
        parentId: "province-05",
        name: "ماهدشت",
      },
      {
        id: "city-05-014",
        parentId: "province-05",
        name: "محمدشهر",
      },
      {
        id: "city-05-015",
        parentId: "province-05",
        name: "مشکین دشت",
      },
      {
        id: "city-05-016",
        parentId: "province-05",
        name: "نظرآباد",
      },
      {
        id: "city-05-017",
        parentId: "province-05",
        name: "هشتگرد",
      },
    ],
  },
  {
    id: "province-06",
    name: "ایلام",
    cities: [
      {
        id: "city-06-001",
        parentId: "province-06",
        name: "آبدانان",
      },
      {
        id: "city-06-002",
        parentId: "province-06",
        name: "آسمان آباد",
      },
      {
        id: "city-06-003",
        parentId: "province-06",
        name: "ارکواز",
      },
      {
        id: "city-06-004",
        parentId: "province-06",
        name: "ایلام",
      },
      {
        id: "city-06-005",
        parentId: "province-06",
        name: "ایوان",
      },
      {
        id: "city-06-006",
        parentId: "province-06",
        name: "بدره",
      },
      {
        id: "city-06-007",
        parentId: "province-06",
        name: "بلاوه",
      },
      {
        id: "city-06-008",
        parentId: "province-06",
        name: "پهله",
      },
      {
        id: "city-06-009",
        parentId: "province-06",
        name: "توحید",
      },
      {
        id: "city-06-010",
        parentId: "province-06",
        name: "چوار",
      },
      {
        id: "city-06-011",
        parentId: "province-06",
        name: "دره شهر",
      },
      {
        id: "city-06-012",
        parentId: "province-06",
        name: "دلگشا",
      },
      {
        id: "city-06-013",
        parentId: "province-06",
        name: "دهلران",
      },
      {
        id: "city-06-014",
        parentId: "province-06",
        name: "زرنه",
      },
      {
        id: "city-06-015",
        parentId: "province-06",
        name: "سراب باغ",
      },
      {
        id: "city-06-016",
        parentId: "province-06",
        name: "سرابله",
      },
      {
        id: "city-06-017",
        parentId: "province-06",
        name: "شباب",
      },
      {
        id: "city-06-018",
        parentId: "province-06",
        name: "صالح آباد",
      },
      {
        id: "city-06-019",
        parentId: "province-06",
        name: "لومار",
      },
      {
        id: "city-06-020",
        parentId: "province-06",
        name: "ماژین",
      },
      {
        id: "city-06-021",
        parentId: "province-06",
        name: "مورموری",
      },
      {
        id: "city-06-022",
        parentId: "province-06",
        name: "موسیان",
      },
      {
        id: "city-06-023",
        parentId: "province-06",
        name: "مهر",
      },
      {
        id: "city-06-024",
        parentId: "province-06",
        name: "مهران",
      },
      {
        id: "city-06-025",
        parentId: "province-06",
        name: "میمه",
      },
    ],
  },
  {
    id: "province-07",
    name: "بوشهر",
    cities: [
      {
        id: "city-07-001",
        parentId: "province-07",
        name: "آب پخش",
      },
      {
        id: "city-07-002",
        parentId: "province-07",
        name: "آباد",
      },
      {
        id: "city-07-003",
        parentId: "province-07",
        name: "آبدان",
      },
      {
        id: "city-07-004",
        parentId: "province-07",
        name: "امام حسن",
      },
      {
        id: "city-07-005",
        parentId: "province-07",
        name: "انارستان",
      },
      {
        id: "city-07-006",
        parentId: "province-07",
        name: "اهرم",
      },
      {
        id: "city-07-007",
        parentId: "province-07",
        name: "بادوله",
      },
      {
        id: "city-07-008",
        parentId: "province-07",
        name: "برازجان",
      },
      {
        id: "city-07-009",
        parentId: "province-07",
        name: "بردخون",
      },
      {
        id: "city-07-010",
        parentId: "province-07",
        name: "بردستان",
      },
      {
        id: "city-07-011",
        parentId: "province-07",
        name: "بندردیر",
      },
      {
        id: "city-07-012",
        parentId: "province-07",
        name: "بندردیلم",
      },
      {
        id: "city-07-013",
        parentId: "province-07",
        name: "بندرریگ",
      },
      {
        id: "city-07-014",
        parentId: "province-07",
        name: "بندرکنگان",
      },
      {
        id: "city-07-015",
        parentId: "province-07",
        name: "بندرگناوه",
      },
      {
        id: "city-07-016",
        parentId: "province-07",
        name: "بنک",
      },
      {
        id: "city-07-017",
        parentId: "province-07",
        name: "بوشکان",
      },
      {
        id: "city-07-018",
        parentId: "province-07",
        name: "بوشهر",
      },
      {
        id: "city-07-019",
        parentId: "province-07",
        name: "تنگ ارم",
      },
      {
        id: "city-07-020",
        parentId: "province-07",
        name: "جم",
      },
      {
        id: "city-07-021",
        parentId: "province-07",
        name: "چغادک",
      },
      {
        id: "city-07-022",
        parentId: "province-07",
        name: "خارک",
      },
      {
        id: "city-07-023",
        parentId: "province-07",
        name: "خورموج",
      },
      {
        id: "city-07-024",
        parentId: "province-07",
        name: "دالکی",
      },
      {
        id: "city-07-025",
        parentId: "province-07",
        name: "دلوار",
      },
      {
        id: "city-07-026",
        parentId: "province-07",
        name: "دوراهک",
      },
      {
        id: "city-07-027",
        parentId: "province-07",
        name: "ریز",
      },
      {
        id: "city-07-028",
        parentId: "province-07",
        name: "سعد آباد",
      },
      {
        id: "city-07-029",
        parentId: "province-07",
        name: "سیراف",
      },
      {
        id: "city-07-030",
        parentId: "province-07",
        name: "شبانکاره",
      },
      {
        id: "city-07-031",
        parentId: "province-07",
        name: "شنبه",
      },
      {
        id: "city-07-032",
        parentId: "province-07",
        name: "عسلویه",
      },
      {
        id: "city-07-033",
        parentId: "province-07",
        name: "کاکی",
      },
      {
        id: "city-07-034",
        parentId: "province-07",
        name: "کلمه",
      },
      {
        id: "city-07-035",
        parentId: "province-07",
        name: "نخل تقی",
      },
      {
        id: "city-07-036",
        parentId: "province-07",
        name: "وحدتیه",
      },
    ],
  },
  {
    id: "province-08",
    name: "تهران",
    cities: [
      {
        id: "city-08-001",
        parentId: "province-08",
        name: "آبسرد",
      },
      {
        id: "city-08-002",
        parentId: "province-08",
        name: "آبعلی",
      },
      {
        id: "city-08-003",
        parentId: "province-08",
        name: "احمد آباد مستوفی",
      },
      {
        id: "city-08-004",
        parentId: "province-08",
        name: "ارجمند",
      },
      {
        id: "city-08-005",
        parentId: "province-08",
        name: "اسلامشهر",
      },
      {
        id: "city-08-006",
        parentId: "province-08",
        name: "اندیشه",
      },
      {
        id: "city-08-007",
        parentId: "province-08",
        name: "باغستان",
      },
      {
        id: "city-08-008",
        parentId: "province-08",
        name: "باقرشهر",
      },
      {
        id: "city-08-009",
        parentId: "province-08",
        name: "بومهن",
      },
      {
        id: "city-08-010",
        parentId: "province-08",
        name: "پاکدشت",
      },
      {
        id: "city-08-011",
        parentId: "province-08",
        name: "پردیس",
      },
      {
        id: "city-08-012",
        parentId: "province-08",
        name: "پرند",
      },
      {
        id: "city-08-013",
        parentId: "province-08",
        name: "پیشوا",
      },
      {
        id: "city-08-014",
        parentId: "province-08",
        name: "تجریش",
      },
      {
        id: "city-08-015",
        parentId: "province-08",
        name: "تهران",
      },
      {
        id: "city-08-016",
        parentId: "province-08",
        name: "جوادآباد",
      },
      {
        id: "city-08-017",
        parentId: "province-08",
        name: "چهاردانگه",
      },
      {
        id: "city-08-018",
        parentId: "province-08",
        name: "حسن آباد",
      },
      {
        id: "city-08-019",
        parentId: "province-08",
        name: "دماوند",
      },
      {
        id: "city-08-020",
        parentId: "province-08",
        name: "رباطکریم",
      },
      {
        id: "city-08-021",
        parentId: "province-08",
        name: "رودهن",
      },
      {
        id: "city-08-022",
        parentId: "province-08",
        name: "ری",
      },
      {
        id: "city-08-023",
        parentId: "province-08",
        name: "شاهدشهر",
      },
      {
        id: "city-08-024",
        parentId: "province-08",
        name: "شریف آباد",
      },
      {
        id: "city-08-025",
        parentId: "province-08",
        name: "شمشک",
      },
      {
        id: "city-08-026",
        parentId: "province-08",
        name: "شهریار",
      },
      {
        id: "city-08-027",
        parentId: "province-08",
        name: "صالحیه",
      },
      {
        id: "city-08-028",
        parentId: "province-08",
        name: "صباشهر",
      },
      {
        id: "city-08-029",
        parentId: "province-08",
        name: "صفادشت",
      },
      {
        id: "city-08-030",
        parentId: "province-08",
        name: "فردوسیه",
      },
      {
        id: "city-08-031",
        parentId: "province-08",
        name: "فرون اباد",
      },
      {
        id: "city-08-032",
        parentId: "province-08",
        name: "فشم",
      },
      {
        id: "city-08-033",
        parentId: "province-08",
        name: "فیروزکوه",
      },
      {
        id: "city-08-034",
        parentId: "province-08",
        name: "قدس",
      },
      {
        id: "city-08-035",
        parentId: "province-08",
        name: "قرچک",
      },
      {
        id: "city-08-036",
        parentId: "province-08",
        name: "کهریزک",
      },
      {
        id: "city-08-037",
        parentId: "province-08",
        name: "کیلان",
      },
      {
        id: "city-08-038",
        parentId: "province-08",
        name: "گلستان",
      },
      {
        id: "city-08-039",
        parentId: "province-08",
        name: "لواسان",
      },
      {
        id: "city-08-040",
        parentId: "province-08",
        name: "ملارد",
      },
      {
        id: "city-08-041",
        parentId: "province-08",
        name: "نسیم شهر",
      },
      {
        id: "city-08-042",
        parentId: "province-08",
        name: "نصیرشهر",
      },
      {
        id: "city-08-043",
        parentId: "province-08",
        name: "وحیدیه",
      },
      {
        id: "city-08-044",
        parentId: "province-08",
        name: "ورامین",
      },
    ],
  },
  {
    id: "province-09",
    name: "چهارمحال و بختیاری",
    cities: [
      {
        id: "city-09-001",
        parentId: "province-09",
        name: "آلونی",
      },
      {
        id: "city-09-002",
        parentId: "province-09",
        name: "اردل",
      },
      {
        id: "city-09-003",
        parentId: "province-09",
        name: "باباحیدر",
      },
      {
        id: "city-09-004",
        parentId: "province-09",
        name: "بازفت",
      },
      {
        id: "city-09-005",
        parentId: "province-09",
        name: "بروجن",
      },
      {
        id: "city-09-006",
        parentId: "province-09",
        name: "بلداجی",
      },
      {
        id: "city-09-007",
        parentId: "province-09",
        name: "بن",
      },
      {
        id: "city-09-008",
        parentId: "province-09",
        name: "پردنجان",
      },
      {
        id: "city-09-009",
        parentId: "province-09",
        name: "جونقان",
      },
      {
        id: "city-09-010",
        parentId: "province-09",
        name: "چلگرد",
      },
      {
        id: "city-09-011",
        parentId: "province-09",
        name: "چلیچه",
      },
      {
        id: "city-09-012",
        parentId: "province-09",
        name: "دستنا",
      },
      {
        id: "city-09-013",
        parentId: "province-09",
        name: "دشتک",
      },
      {
        id: "city-09-014",
        parentId: "province-09",
        name: "سامان",
      },
      {
        id: "city-09-015",
        parentId: "province-09",
        name: "سرخون",
      },
      {
        id: "city-09-016",
        parentId: "province-09",
        name: "سردشت",
      },
      {
        id: "city-09-017",
        parentId: "province-09",
        name: "سفیددشت",
      },
      {
        id: "city-09-018",
        parentId: "province-09",
        name: "سودجان",
      },
      {
        id: "city-09-019",
        parentId: "province-09",
        name: "سورشجان",
      },
      {
        id: "city-09-020",
        parentId: "province-09",
        name: "شلمزار",
      },
      {
        id: "city-09-021",
        parentId: "province-09",
        name: "شهرکرد",
      },
      {
        id: "city-09-022",
        parentId: "province-09",
        name: "صمصامی",
      },
      {
        id: "city-09-023",
        parentId: "province-09",
        name: "طاقانک",
      },
      {
        id: "city-09-024",
        parentId: "province-09",
        name: "فارسان",
      },
      {
        id: "city-09-025",
        parentId: "province-09",
        name: "فرادبنه",
      },
      {
        id: "city-09-026",
        parentId: "province-09",
        name: "فرخ شهر",
      },
      {
        id: "city-09-027",
        parentId: "province-09",
        name: "کاج",
      },
      {
        id: "city-09-028",
        parentId: "province-09",
        name: "کیان",
      },
      {
        id: "city-09-029",
        parentId: "province-09",
        name: "گندمان",
      },
      {
        id: "city-09-030",
        parentId: "province-09",
        name: "گوجان",
      },
      {
        id: "city-09-031",
        parentId: "province-09",
        name: "گهرو",
      },
      {
        id: "city-09-032",
        parentId: "province-09",
        name: "لردگان",
      },
      {
        id: "city-09-033",
        parentId: "province-09",
        name: "مال خلیفه",
      },
      {
        id: "city-09-034",
        parentId: "province-09",
        name: "منج",
      },
      {
        id: "city-09-035",
        parentId: "province-09",
        name: "ناغان",
      },
      {
        id: "city-09-036",
        parentId: "province-09",
        name: "نافچ",
      },
      {
        id: "city-09-037",
        parentId: "province-09",
        name: "نقنه",
      },
      {
        id: "city-09-038",
        parentId: "province-09",
        name: "وردنجان",
      },
      {
        id: "city-09-039",
        parentId: "province-09",
        name: "هارونی",
      },
      {
        id: "city-09-040",
        parentId: "province-09",
        name: "هفشجان",
      },
    ],
  },
  {
    id: "province-10",
    name: "خراسان جنوبی",
    cities: [
      {
        id: "city-10-001",
        parentId: "province-10",
        name: "آرین شهر",
      },
      {
        id: "city-10-002",
        parentId: "province-10",
        name: "آیسک",
      },
      {
        id: "city-10-003",
        parentId: "province-10",
        name: "ارسک",
      },
      {
        id: "city-10-004",
        parentId: "province-10",
        name: "اسدیه",
      },
      {
        id: "city-10-005",
        parentId: "province-10",
        name: "اسفدن",
      },
      {
        id: "city-10-006",
        parentId: "province-10",
        name: "اسلامیه",
      },
      {
        id: "city-10-007",
        parentId: "province-10",
        name: "بشرویه",
      },
      {
        id: "city-10-008",
        parentId: "province-10",
        name: "بیرجند",
      },
      {
        id: "city-10-009",
        parentId: "province-10",
        name: "حاجی آباد",
      },
      {
        id: "city-10-010",
        parentId: "province-10",
        name: "خضری دشت بیاض",
      },
      {
        id: "city-10-011",
        parentId: "province-10",
        name: "خوسف",
      },
      {
        id: "city-10-012",
        parentId: "province-10",
        name: "دیهوک",
      },
      {
        id: "city-10-013",
        parentId: "province-10",
        name: "زهان",
      },
      {
        id: "city-10-014",
        parentId: "province-10",
        name: "سرایان",
      },
      {
        id: "city-10-015",
        parentId: "province-10",
        name: "سربیشه",
      },
      {
        id: "city-10-016",
        parentId: "province-10",
        name: "سه قلعه",
      },
      {
        id: "city-10-017",
        parentId: "province-10",
        name: "شوسف",
      },
      {
        id: "city-10-018",
        parentId: "province-10",
        name: "طبس",
      },
      {
        id: "city-10-019",
        parentId: "province-10",
        name: "طبس مسینا",
      },
      {
        id: "city-10-020",
        parentId: "province-10",
        name: "عشق آباد",
      },
      {
        id: "city-10-021",
        parentId: "province-10",
        name: "فردوس",
      },
      {
        id: "city-10-022",
        parentId: "province-10",
        name: "قاین",
      },
      {
        id: "city-10-023",
        parentId: "province-10",
        name: "قهستان",
      },
      {
        id: "city-10-024",
        parentId: "province-10",
        name: "گزیک",
      },
      {
        id: "city-10-025",
        parentId: "province-10",
        name: "محمدشهر",
      },
      {
        id: "city-10-026",
        parentId: "province-10",
        name: "مود",
      },
      {
        id: "city-10-027",
        parentId: "province-10",
        name: "نهبندان",
      },
      {
        id: "city-10-028",
        parentId: "province-10",
        name: "نیمبلوک",
      },
    ],
  },
  {
    id: "province-11",
    name: "خراسان رضوی",
    cities: [
      {
        id: "city-11-001",
        parentId: "province-11",
        name: "احمدابادصولت",
      },
      {
        id: "city-11-002",
        parentId: "province-11",
        name: "انابد",
      },
      {
        id: "city-11-003",
        parentId: "province-11",
        name: "باجگیران",
      },
      {
        id: "city-11-004",
        parentId: "province-11",
        name: "باخرز",
      },
      {
        id: "city-11-005",
        parentId: "province-11",
        name: "بار",
      },
      {
        id: "city-11-006",
        parentId: "province-11",
        name: "بایک",
      },
      {
        id: "city-11-007",
        parentId: "province-11",
        name: "بجستان",
      },
      {
        id: "city-11-008",
        parentId: "province-11",
        name: "بردسکن",
      },
      {
        id: "city-11-009",
        parentId: "province-11",
        name: "بیدخت",
      },
      {
        id: "city-11-010",
        parentId: "province-11",
        name: "تایباد",
      },
      {
        id: "city-11-011",
        parentId: "province-11",
        name: "تربت جام",
      },
      {
        id: "city-11-012",
        parentId: "province-11",
        name: "تربت حیدریه",
      },
      {
        id: "city-11-013",
        parentId: "province-11",
        name: "جغتای",
      },
      {
        id: "city-11-014",
        parentId: "province-11",
        name: "جنگل",
      },
      {
        id: "city-11-015",
        parentId: "province-11",
        name: "چاپشلو",
      },
      {
        id: "city-11-016",
        parentId: "province-11",
        name: "چکنه",
      },
      {
        id: "city-11-017",
        parentId: "province-11",
        name: "چناران",
      },
      {
        id: "city-11-018",
        parentId: "province-11",
        name: "خرو",
      },
      {
        id: "city-11-019",
        parentId: "province-11",
        name: "خلیل آباد",
      },
      {
        id: "city-11-020",
        parentId: "province-11",
        name: "خواف",
      },
      {
        id: "city-11-021",
        parentId: "province-11",
        name: "داورزن",
      },
      {
        id: "city-11-022",
        parentId: "province-11",
        name: "درگز",
      },
      {
        id: "city-11-023",
        parentId: "province-11",
        name: "درود",
      },
      {
        id: "city-11-024",
        parentId: "province-11",
        name: "دولت آباد",
      },
      {
        id: "city-11-025",
        parentId: "province-11",
        name: "رباط سنگ",
      },
      {
        id: "city-11-026",
        parentId: "province-11",
        name: "رشتخوار",
      },
      {
        id: "city-11-027",
        parentId: "province-11",
        name: "رضویه",
      },
      {
        id: "city-11-028",
        parentId: "province-11",
        name: "روداب",
      },
      {
        id: "city-11-029",
        parentId: "province-11",
        name: "ریوش",
      },
      {
        id: "city-11-030",
        parentId: "province-11",
        name: "سبزوار",
      },
      {
        id: "city-11-031",
        parentId: "province-11",
        name: "سرخس",
      },
      {
        id: "city-11-032",
        parentId: "province-11",
        name: "سفیدسنگ",
      },
      {
        id: "city-11-033",
        parentId: "province-11",
        name: "سلامی",
      },
      {
        id: "city-11-034",
        parentId: "province-11",
        name: "سلطان آباد",
      },
      {
        id: "city-11-035",
        parentId: "province-11",
        name: "سنگان",
      },
      {
        id: "city-11-036",
        parentId: "province-11",
        name: "شادمهر",
      },
      {
        id: "city-11-037",
        parentId: "province-11",
        name: "شاندیز",
      },
      {
        id: "city-11-038",
        parentId: "province-11",
        name: "ششتمد",
      },
      {
        id: "city-11-039",
        parentId: "province-11",
        name: "شهراباد",
      },
      {
        id: "city-11-040",
        parentId: "province-11",
        name: "شهرزو",
      },
      {
        id: "city-11-041",
        parentId: "province-11",
        name: "صالح آباد",
      },
      {
        id: "city-11-042",
        parentId: "province-11",
        name: "طرقبه",
      },
      {
        id: "city-11-043",
        parentId: "province-11",
        name: "عشق آباد",
      },
      {
        id: "city-11-044",
        parentId: "province-11",
        name: "فرهادگرد",
      },
      {
        id: "city-11-045",
        parentId: "province-11",
        name: "فریمان",
      },
      {
        id: "city-11-046",
        parentId: "province-11",
        name: "فیروزه",
      },
      {
        id: "city-11-047",
        parentId: "province-11",
        name: "فیض آباد",
      },
      {
        id: "city-11-048",
        parentId: "province-11",
        name: "قاسم آباد",
      },
      {
        id: "city-11-049",
        parentId: "province-11",
        name: "قدمگاه",
      },
      {
        id: "city-11-050",
        parentId: "province-11",
        name: "قلندرآباد",
      },
      {
        id: "city-11-051",
        parentId: "province-11",
        name: "قوچان",
      },
      {
        id: "city-11-052",
        parentId: "province-11",
        name: "کاخک",
      },
      {
        id: "city-11-053",
        parentId: "province-11",
        name: "کاریز",
      },
      {
        id: "city-11-054",
        parentId: "province-11",
        name: "کاشمر",
      },
      {
        id: "city-11-055",
        parentId: "province-11",
        name: "کدکن",
      },
      {
        id: "city-11-056",
        parentId: "province-11",
        name: "کلات",
      },
      {
        id: "city-11-057",
        parentId: "province-11",
        name: "کندر",
      },
      {
        id: "city-11-058",
        parentId: "province-11",
        name: "گلمکان",
      },
      {
        id: "city-11-059",
        parentId: "province-11",
        name: "گناباد",
      },
      {
        id: "city-11-060",
        parentId: "province-11",
        name: "لطف آباد",
      },
      {
        id: "city-11-061",
        parentId: "province-11",
        name: "مزدآوند",
      },
      {
        id: "city-11-062",
        parentId: "province-11",
        name: "مشهد",
      },
      {
        id: "city-11-063",
        parentId: "province-11",
        name: "مشهدریزه",
      },
      {
        id: "city-11-064",
        parentId: "province-11",
        name: "ملک آباد",
      },
      {
        id: "city-11-065",
        parentId: "province-11",
        name: "نشتیفان",
      },
      {
        id: "city-11-066",
        parentId: "province-11",
        name: "نصرآباد",
      },
      {
        id: "city-11-067",
        parentId: "province-11",
        name: "نقاب",
      },
      {
        id: "city-11-068",
        parentId: "province-11",
        name: "نوخندان",
      },
      {
        id: "city-11-069",
        parentId: "province-11",
        name: "نیشابور",
      },
      {
        id: "city-11-070",
        parentId: "province-11",
        name: "نیل شهر",
      },
      {
        id: "city-11-071",
        parentId: "province-11",
        name: "همت آباد",
      },
      {
        id: "city-11-072",
        parentId: "province-11",
        name: "یونسی",
      },
    ],
  },
  {
    id: "province-12",
    name: "خراسان شمالی",
    cities: [
      {
        id: "city-12-001",
        parentId: "province-12",
        name: "آشخانه",
      },
      {
        id: "city-12-002",
        parentId: "province-12",
        name: "آوا",
      },
      {
        id: "city-12-003",
        parentId: "province-12",
        name: "اسفراین",
      },
      {
        id: "city-12-004",
        parentId: "province-12",
        name: "ایور",
      },
      {
        id: "city-12-005",
        parentId: "province-12",
        name: "بجنورد",
      },
      {
        id: "city-12-006",
        parentId: "province-12",
        name: "پیش قلعه",
      },
      {
        id: "city-12-007",
        parentId: "province-12",
        name: "تیتکانلو",
      },
      {
        id: "city-12-008",
        parentId: "province-12",
        name: "جاجرم",
      },
      {
        id: "city-12-009",
        parentId: "province-12",
        name: "چناران شهر",
      },
      {
        id: "city-12-010",
        parentId: "province-12",
        name: "حصارگرمخان",
      },
      {
        id: "city-12-011",
        parentId: "province-12",
        name: "درق",
      },
      {
        id: "city-12-012",
        parentId: "province-12",
        name: "راز",
      },
      {
        id: "city-12-013",
        parentId: "province-12",
        name: "زیارت",
      },
      {
        id: "city-12-014",
        parentId: "province-12",
        name: "سنخواست",
      },
      {
        id: "city-12-015",
        parentId: "province-12",
        name: "شوقان",
      },
      {
        id: "city-12-016",
        parentId: "province-12",
        name: "شیروان",
      },
      {
        id: "city-12-017",
        parentId: "province-12",
        name: "صفی آباد",
      },
      {
        id: "city-12-018",
        parentId: "province-12",
        name: "فاروج",
      },
      {
        id: "city-12-019",
        parentId: "province-12",
        name: "قاضی",
      },
      {
        id: "city-12-020",
        parentId: "province-12",
        name: "قوشخانه",
      },
      {
        id: "city-12-021",
        parentId: "province-12",
        name: "گرمه",
      },
      {
        id: "city-12-022",
        parentId: "province-12",
        name: "لوجلی",
      },
    ],
  },
  {
    id: "province-13",
    name: "خوزستان",
    cities: [
      {
        id: "city-13-001",
        parentId: "province-13",
        name: "آبادان",
      },
      {
        id: "city-13-002",
        parentId: "province-13",
        name: "آبژدان",
      },
      {
        id: "city-13-003",
        parentId: "province-13",
        name: "آزادی",
      },
      {
        id: "city-13-004",
        parentId: "province-13",
        name: "آغاجاری",
      },
      {
        id: "city-13-005",
        parentId: "province-13",
        name: "ابوحمیظه",
      },
      {
        id: "city-13-006",
        parentId: "province-13",
        name: "اروندکنار",
      },
      {
        id: "city-13-007",
        parentId: "province-13",
        name: "الوان",
      },
      {
        id: "city-13-008",
        parentId: "province-13",
        name: "الهایی",
      },
      {
        id: "city-13-009",
        parentId: "province-13",
        name: "امیدیه",
      },
      {
        id: "city-13-010",
        parentId: "province-13",
        name: "اندیمشک",
      },
      {
        id: "city-13-011",
        parentId: "province-13",
        name: "اهواز",
      },
      {
        id: "city-13-012",
        parentId: "province-13",
        name: "ایذه",
      },
      {
        id: "city-13-013",
        parentId: "province-13",
        name: "باغ ملک",
      },
      {
        id: "city-13-014",
        parentId: "province-13",
        name: "بستان",
      },
      {
        id: "city-13-015",
        parentId: "province-13",
        name: "بندرامام خمینی",
      },
      {
        id: "city-13-016",
        parentId: "province-13",
        name: "بندرماهشهر",
      },
      {
        id: "city-13-017",
        parentId: "province-13",
        name: "بهبهان",
      },
      {
        id: "city-13-018",
        parentId: "province-13",
        name: "بیدروبه",
      },
      {
        id: "city-13-019",
        parentId: "province-13",
        name: "ترکالکی",
      },
      {
        id: "city-13-020",
        parentId: "province-13",
        name: "تشان",
      },
      {
        id: "city-13-021",
        parentId: "province-13",
        name: "جایزان",
      },
      {
        id: "city-13-022",
        parentId: "province-13",
        name: "جنت مکان",
      },
      {
        id: "city-13-023",
        parentId: "province-13",
        name: "چغامیش",
      },
      {
        id: "city-13-024",
        parentId: "province-13",
        name: "چم گلک",
      },
      {
        id: "city-13-025",
        parentId: "province-13",
        name: "چمران",
      },
      {
        id: "city-13-026",
        parentId: "province-13",
        name: "چویبده",
      },
      {
        id: "city-13-027",
        parentId: "province-13",
        name: "حر",
      },
      {
        id: "city-13-028",
        parentId: "province-13",
        name: "حسینیه",
      },
      {
        id: "city-13-029",
        parentId: "province-13",
        name: "حمزه",
      },
      {
        id: "city-13-030",
        parentId: "province-13",
        name: "حمیدیه",
      },
      {
        id: "city-13-031",
        parentId: "province-13",
        name: "خرمشهر",
      },
      {
        id: "city-13-032",
        parentId: "province-13",
        name: "خنافره",
      },
      {
        id: "city-13-033",
        parentId: "province-13",
        name: "دارخوین",
      },
      {
        id: "city-13-034",
        parentId: "province-13",
        name: "دزفول",
      },
      {
        id: "city-13-035",
        parentId: "province-13",
        name: "دهدز",
      },
      {
        id: "city-13-036",
        parentId: "province-13",
        name: "رامشیر",
      },
      {
        id: "city-13-037",
        parentId: "province-13",
        name: "رامهرمز",
      },
      {
        id: "city-13-038",
        parentId: "province-13",
        name: "رفیع",
      },
      {
        id: "city-13-039",
        parentId: "province-13",
        name: "زهره",
      },
      {
        id: "city-13-040",
        parentId: "province-13",
        name: "سالند",
      },
      {
        id: "city-13-041",
        parentId: "province-13",
        name: "سرداران",
      },
      {
        id: "city-13-042",
        parentId: "province-13",
        name: "سردشت",
      },
      {
        id: "city-13-043",
        parentId: "province-13",
        name: "سماله",
      },
      {
        id: "city-13-044",
        parentId: "province-13",
        name: "سوسنگرد",
      },
      {
        id: "city-13-045",
        parentId: "province-13",
        name: "سیاه منصور",
      },
      {
        id: "city-13-046",
        parentId: "province-13",
        name: "شادگان",
      },
      {
        id: "city-13-047",
        parentId: "province-13",
        name: "شاوور",
      },
      {
        id: "city-13-048",
        parentId: "province-13",
        name: "شرافت",
      },
      {
        id: "city-13-049",
        parentId: "province-13",
        name: "شمس آباد",
      },
      {
        id: "city-13-050",
        parentId: "province-13",
        name: "شوش",
      },
      {
        id: "city-13-051",
        parentId: "province-13",
        name: "شوشتر",
      },
      {
        id: "city-13-052",
        parentId: "province-13",
        name: "شهر امام",
      },
      {
        id: "city-13-053",
        parentId: "province-13",
        name: "شیبان",
      },
      {
        id: "city-13-054",
        parentId: "province-13",
        name: "صالح شهر",
      },
      {
        id: "city-13-055",
        parentId: "province-13",
        name: "صفی آباد",
      },
      {
        id: "city-13-056",
        parentId: "province-13",
        name: "صیدون",
      },
      {
        id: "city-13-057",
        parentId: "province-13",
        name: "فتح المبین",
      },
      {
        id: "city-13-058",
        parentId: "province-13",
        name: "قلعه تل",
      },
      {
        id: "city-13-059",
        parentId: "province-13",
        name: "قلعه خواجه",
      },
      {
        id: "city-13-060",
        parentId: "province-13",
        name: "کوت سیدنعیم",
      },
      {
        id: "city-13-061",
        parentId: "province-13",
        name: "کوت عبداله",
      },
      {
        id: "city-13-062",
        parentId: "province-13",
        name: "گتوند",
      },
      {
        id: "city-13-063",
        parentId: "province-13",
        name: "گلگیر",
      },
      {
        id: "city-13-064",
        parentId: "province-13",
        name: "گوریه",
      },
      {
        id: "city-13-065",
        parentId: "province-13",
        name: "لالی",
      },
      {
        id: "city-13-066",
        parentId: "province-13",
        name: "مسجدسلیمان",
      },
      {
        id: "city-13-067",
        parentId: "province-13",
        name: "مشراگه",
      },
      {
        id: "city-13-068",
        parentId: "province-13",
        name: "مقاومت",
      },
      {
        id: "city-13-069",
        parentId: "province-13",
        name: "ملاثانی",
      },
      {
        id: "city-13-070",
        parentId: "province-13",
        name: "منصوریه",
      },
      {
        id: "city-13-071",
        parentId: "province-13",
        name: "میانرود",
      },
      {
        id: "city-13-072",
        parentId: "province-13",
        name: "میداود",
      },
      {
        id: "city-13-073",
        parentId: "province-13",
        name: "مینوشهر",
      },
      {
        id: "city-13-074",
        parentId: "province-13",
        name: "ویس",
      },
      {
        id: "city-13-075",
        parentId: "province-13",
        name: "هفتگل",
      },
      {
        id: "city-13-076",
        parentId: "province-13",
        name: "هندیجان",
      },
      {
        id: "city-13-077",
        parentId: "province-13",
        name: "هویزه",
      },
    ],
  },
  {
    id: "province-14",
    name: "زنجان",
    cities: [
      {
        id: "city-14-001",
        parentId: "province-14",
        name: "آب بر",
      },
      {
        id: "city-14-002",
        parentId: "province-14",
        name: "ابهر",
      },
      {
        id: "city-14-003",
        parentId: "province-14",
        name: "ارمغانخانه",
      },
      {
        id: "city-14-004",
        parentId: "province-14",
        name: "چورزق",
      },
      {
        id: "city-14-005",
        parentId: "province-14",
        name: "حلب",
      },
      {
        id: "city-14-006",
        parentId: "province-14",
        name: "خرمدره",
      },
      {
        id: "city-14-007",
        parentId: "province-14",
        name: "دندی",
      },
      {
        id: "city-14-008",
        parentId: "province-14",
        name: "زرین آباد",
      },
      {
        id: "city-14-009",
        parentId: "province-14",
        name: "زرین رود",
      },
      {
        id: "city-14-010",
        parentId: "province-14",
        name: "زنجان",
      },
      {
        id: "city-14-011",
        parentId: "province-14",
        name: "سجاس",
      },
      {
        id: "city-14-012",
        parentId: "province-14",
        name: "سلطانیه",
      },
      {
        id: "city-14-013",
        parentId: "province-14",
        name: "سهرورد",
      },
      {
        id: "city-14-014",
        parentId: "province-14",
        name: "صایین قلعه",
      },
      {
        id: "city-14-015",
        parentId: "province-14",
        name: "قیدار",
      },
      {
        id: "city-14-016",
        parentId: "province-14",
        name: "کرسف",
      },
      {
        id: "city-14-017",
        parentId: "province-14",
        name: "گرماب",
      },
      {
        id: "city-14-018",
        parentId: "province-14",
        name: "ماه نشان",
      },
      {
        id: "city-14-019",
        parentId: "province-14",
        name: "نوربهار",
      },
      {
        id: "city-14-020",
        parentId: "province-14",
        name: "نیک پی",
      },
      {
        id: "city-14-021",
        parentId: "province-14",
        name: "هیدج",
      },
    ],
  },
  {
    id: "province-15",
    name: "سمنان",
    cities: [
      {
        id: "city-15-001",
        parentId: "province-15",
        name: "آرادان",
      },
      {
        id: "city-15-002",
        parentId: "province-15",
        name: "امیریه",
      },
      {
        id: "city-15-003",
        parentId: "province-15",
        name: "ایوانکی",
      },
      {
        id: "city-15-004",
        parentId: "province-15",
        name: "بسطام",
      },
      {
        id: "city-15-005",
        parentId: "province-15",
        name: "بیارجمند",
      },
      {
        id: "city-15-006",
        parentId: "province-15",
        name: "دامغان",
      },
      {
        id: "city-15-007",
        parentId: "province-15",
        name: "درجزین",
      },
      {
        id: "city-15-008",
        parentId: "province-15",
        name: "دیباج",
      },
      {
        id: "city-15-009",
        parentId: "province-15",
        name: "رودیان",
      },
      {
        id: "city-15-010",
        parentId: "province-15",
        name: "سرخه",
      },
      {
        id: "city-15-011",
        parentId: "province-15",
        name: "سمنان",
      },
      {
        id: "city-15-012",
        parentId: "province-15",
        name: "شاهرود",
      },
      {
        id: "city-15-013",
        parentId: "province-15",
        name: "شهمیرزاد",
      },
      {
        id: "city-15-014",
        parentId: "province-15",
        name: "کلاته",
      },
      {
        id: "city-15-015",
        parentId: "province-15",
        name: "کلاته خیج",
      },
      {
        id: "city-15-016",
        parentId: "province-15",
        name: "کهن آباد",
      },
      {
        id: "city-15-017",
        parentId: "province-15",
        name: "گرمسار",
      },
      {
        id: "city-15-018",
        parentId: "province-15",
        name: "مجن",
      },
      {
        id: "city-15-019",
        parentId: "province-15",
        name: "مهدی شهر",
      },
      {
        id: "city-15-020",
        parentId: "province-15",
        name: "میامی",
      },
    ],
  },
  {
    id: "province-16",
    name: "سیستان و بلوچستان",
    cities: [
      {
        id: "city-16-001",
        parentId: "province-16",
        name: "ادیمی",
      },
      {
        id: "city-16-002",
        parentId: "province-16",
        name: "اسپکه",
      },
      {
        id: "city-16-003",
        parentId: "province-16",
        name: "ایرانشهر",
      },
      {
        id: "city-16-004",
        parentId: "province-16",
        name: "بزمان",
      },
      {
        id: "city-16-005",
        parentId: "province-16",
        name: "بمپور",
      },
      {
        id: "city-16-006",
        parentId: "province-16",
        name: "بنت",
      },
      {
        id: "city-16-007",
        parentId: "province-16",
        name: "بنجار",
      },
      {
        id: "city-16-008",
        parentId: "province-16",
        name: "پیشین",
      },
      {
        id: "city-16-009",
        parentId: "province-16",
        name: "جالق",
      },
      {
        id: "city-16-010",
        parentId: "province-16",
        name: "چاه بهار",
      },
      {
        id: "city-16-011",
        parentId: "province-16",
        name: "خاش",
      },
      {
        id: "city-16-012",
        parentId: "province-16",
        name: "دوست محمد",
      },
      {
        id: "city-16-013",
        parentId: "province-16",
        name: "راسک",
      },
      {
        id: "city-16-014",
        parentId: "province-16",
        name: "زابل",
      },
      {
        id: "city-16-015",
        parentId: "province-16",
        name: "زابلی",
      },
      {
        id: "city-16-016",
        parentId: "province-16",
        name: "زاهدان",
      },
      {
        id: "city-16-017",
        parentId: "province-16",
        name: "زرآباد",
      },
      {
        id: "city-16-018",
        parentId: "province-16",
        name: "زهک",
      },
      {
        id: "city-16-019",
        parentId: "province-16",
        name: "سراوان",
      },
      {
        id: "city-16-020",
        parentId: "province-16",
        name: "سرباز",
      },
      {
        id: "city-16-021",
        parentId: "province-16",
        name: "سوران",
      },
      {
        id: "city-16-022",
        parentId: "province-16",
        name: "سیرکان",
      },
      {
        id: "city-16-023",
        parentId: "province-16",
        name: "شهرک علی اکبر",
      },
      {
        id: "city-16-024",
        parentId: "province-16",
        name: "فنوج",
      },
      {
        id: "city-16-025",
        parentId: "province-16",
        name: "قصرقند",
      },
      {
        id: "city-16-026",
        parentId: "province-16",
        name: "کنارک",
      },
      {
        id: "city-16-027",
        parentId: "province-16",
        name: "گشت",
      },
      {
        id: "city-16-028",
        parentId: "province-16",
        name: "گلمورتی",
      },
      {
        id: "city-16-029",
        parentId: "province-16",
        name: "محمدآباد",
      },
      {
        id: "city-16-030",
        parentId: "province-16",
        name: "محمدان",
      },
      {
        id: "city-16-031",
        parentId: "province-16",
        name: "محمدی",
      },
      {
        id: "city-16-032",
        parentId: "province-16",
        name: "میرجاوه",
      },
      {
        id: "city-16-033",
        parentId: "province-16",
        name: "نصرت آباد",
      },
      {
        id: "city-16-034",
        parentId: "province-16",
        name: "نگور",
      },
      {
        id: "city-16-035",
        parentId: "province-16",
        name: "نوک آباد",
      },
      {
        id: "city-16-036",
        parentId: "province-16",
        name: "نیک شهر",
      },
      {
        id: "city-16-037",
        parentId: "province-16",
        name: "هیدوچ",
      },
    ],
  },
  {
    id: "province-17",
    name: "فارس",
    cities: [
      {
        id: "city-17-001",
        parentId: "province-17",
        name: "آباده",
      },
      {
        id: "city-17-002",
        parentId: "province-17",
        name: "آباده طشک",
      },
      {
        id: "city-17-003",
        parentId: "province-17",
        name: "اردکان",
      },
      {
        id: "city-17-004",
        parentId: "province-17",
        name: "ارسنجان",
      },
      {
        id: "city-17-005",
        parentId: "province-17",
        name: "استهبان",
      },
      {
        id: "city-17-006",
        parentId: "province-17",
        name: "اسیر",
      },
      {
        id: "city-17-007",
        parentId: "province-17",
        name: "اشکنان",
      },
      {
        id: "city-17-008",
        parentId: "province-17",
        name: "افزر",
      },
      {
        id: "city-17-009",
        parentId: "province-17",
        name: "اقلید",
      },
      {
        id: "city-17-010",
        parentId: "province-17",
        name: "امام شهر",
      },
      {
        id: "city-17-011",
        parentId: "province-17",
        name: "اوز",
      },
      {
        id: "city-17-012",
        parentId: "province-17",
        name: "اهل",
      },
      {
        id: "city-17-013",
        parentId: "province-17",
        name: "ایج",
      },
      {
        id: "city-17-014",
        parentId: "province-17",
        name: "ایزدخواست",
      },
      {
        id: "city-17-015",
        parentId: "province-17",
        name: "باب انار",
      },
      {
        id: "city-17-016",
        parentId: "province-17",
        name: "بابامنیر",
      },
      {
        id: "city-17-017",
        parentId: "province-17",
        name: "بالاده",
      },
      {
        id: "city-17-018",
        parentId: "province-17",
        name: "بنارویه",
      },
      {
        id: "city-17-019",
        parentId: "province-17",
        name: "بوانات",
      },
      {
        id: "city-17-020",
        parentId: "province-17",
        name: "بهمن",
      },
      {
        id: "city-17-021",
        parentId: "province-17",
        name: "بیرم",
      },
      {
        id: "city-17-022",
        parentId: "province-17",
        name: "بیضا",
      },
      {
        id: "city-17-023",
        parentId: "province-17",
        name: "جنت شهر",
      },
      {
        id: "city-17-024",
        parentId: "province-17",
        name: "جویم",
      },
      {
        id: "city-17-025",
        parentId: "province-17",
        name: "جهرم",
      },
      {
        id: "city-17-026",
        parentId: "province-17",
        name: "حاجی آباد",
      },
      {
        id: "city-17-027",
        parentId: "province-17",
        name: "حسامی",
      },
      {
        id: "city-17-028",
        parentId: "province-17",
        name: "حسن اباد",
      },
      {
        id: "city-17-029",
        parentId: "province-17",
        name: "خانه زنیان",
      },
      {
        id: "city-17-030",
        parentId: "province-17",
        name: "خانیمن",
      },
      {
        id: "city-17-031",
        parentId: "province-17",
        name: "خاوران",
      },
      {
        id: "city-17-032",
        parentId: "province-17",
        name: "خرامه",
      },
      {
        id: "city-17-033",
        parentId: "province-17",
        name: "خشت",
      },
      {
        id: "city-17-034",
        parentId: "province-17",
        name: "خنج",
      },
      {
        id: "city-17-035",
        parentId: "province-17",
        name: "خور",
      },
      {
        id: "city-17-036",
        parentId: "province-17",
        name: "خوزی",
      },
      {
        id: "city-17-037",
        parentId: "province-17",
        name: "خومه زار",
      },
      {
        id: "city-17-038",
        parentId: "province-17",
        name: "داراب",
      },
      {
        id: "city-17-039",
        parentId: "province-17",
        name: "داریان",
      },
      {
        id: "city-17-040",
        parentId: "province-17",
        name: "دبیران",
      },
      {
        id: "city-17-041",
        parentId: "province-17",
        name: "دژکرد",
      },
      {
        id: "city-17-042",
        parentId: "province-17",
        name: "دوبرجی",
      },
      {
        id: "city-17-043",
        parentId: "province-17",
        name: "دوزه",
      },
      {
        id: "city-17-044",
        parentId: "province-17",
        name: "دهرم",
      },
      {
        id: "city-17-045",
        parentId: "province-17",
        name: "رامجرد",
      },
      {
        id: "city-17-046",
        parentId: "province-17",
        name: "رونیز",
      },
      {
        id: "city-17-047",
        parentId: "province-17",
        name: "زاهدشهر",
      },
      {
        id: "city-17-048",
        parentId: "province-17",
        name: "زرقان",
      },
      {
        id: "city-17-049",
        parentId: "province-17",
        name: "سده",
      },
      {
        id: "city-17-050",
        parentId: "province-17",
        name: "سروستان",
      },
      {
        id: "city-17-051",
        parentId: "province-17",
        name: "سعادت شهر",
      },
      {
        id: "city-17-052",
        parentId: "province-17",
        name: "سلطان شهر",
      },
      {
        id: "city-17-053",
        parentId: "province-17",
        name: "سورمق",
      },
      {
        id: "city-17-054",
        parentId: "province-17",
        name: "سیدان",
      },
      {
        id: "city-17-055",
        parentId: "province-17",
        name: "ششده",
      },
      {
        id: "city-17-056",
        parentId: "province-17",
        name: "شهرپیر",
      },
      {
        id: "city-17-057",
        parentId: "province-17",
        name: "شهرصدرا",
      },
      {
        id: "city-17-058",
        parentId: "province-17",
        name: "شیراز",
      },
      {
        id: "city-17-059",
        parentId: "province-17",
        name: "صغاد",
      },
      {
        id: "city-17-060",
        parentId: "province-17",
        name: "صفاشهر",
      },
      {
        id: "city-17-061",
        parentId: "province-17",
        name: "علامرودشت",
      },
      {
        id: "city-17-062",
        parentId: "province-17",
        name: "عمادده",
      },
      {
        id: "city-17-063",
        parentId: "province-17",
        name: "فدامی",
      },
      {
        id: "city-17-064",
        parentId: "province-17",
        name: "فراشبند",
      },
      {
        id: "city-17-065",
        parentId: "province-17",
        name: "فسا",
      },
      {
        id: "city-17-066",
        parentId: "province-17",
        name: "فیروزآباد",
      },
      {
        id: "city-17-067",
        parentId: "province-17",
        name: "قادراباد",
      },
      {
        id: "city-17-068",
        parentId: "province-17",
        name: "قایمیه",
      },
      {
        id: "city-17-069",
        parentId: "province-17",
        name: "قره بلاغ",
      },
      {
        id: "city-17-070",
        parentId: "province-17",
        name: "قطب آباد",
      },
      {
        id: "city-17-071",
        parentId: "province-17",
        name: "قطرویه",
      },
      {
        id: "city-17-072",
        parentId: "province-17",
        name: "قیر",
      },
      {
        id: "city-17-073",
        parentId: "province-17",
        name: "کارزین (فتح آباد)",
      },
      {
        id: "city-17-074",
        parentId: "province-17",
        name: "کازرون",
      },
      {
        id: "city-17-075",
        parentId: "province-17",
        name: "کامفیروز",
      },
      {
        id: "city-17-076",
        parentId: "province-17",
        name: "کره ای",
      },
      {
        id: "city-17-077",
        parentId: "province-17",
        name: "کنارتخته",
      },
      {
        id: "city-17-078",
        parentId: "province-17",
        name: "کوار",
      },
      {
        id: "city-17-079",
        parentId: "province-17",
        name: "کوپن",
      },
      {
        id: "city-17-080",
        parentId: "province-17",
        name: "کوهنجان",
      },
      {
        id: "city-17-081",
        parentId: "province-17",
        name: "گراش",
      },
      {
        id: "city-17-082",
        parentId: "province-17",
        name: "گله دار",
      },
      {
        id: "city-17-083",
        parentId: "province-17",
        name: "لار",
      },
      {
        id: "city-17-084",
        parentId: "province-17",
        name: "لامرد",
      },
      {
        id: "city-17-085",
        parentId: "province-17",
        name: "لپویی",
      },
      {
        id: "city-17-086",
        parentId: "province-17",
        name: "لطیفی",
      },
      {
        id: "city-17-087",
        parentId: "province-17",
        name: "مادرسلیمان",
      },
      {
        id: "city-17-088",
        parentId: "province-17",
        name: "مبارک آباددیز",
      },
      {
        id: "city-17-089",
        parentId: "province-17",
        name: "مرودشت",
      },
      {
        id: "city-17-090",
        parentId: "province-17",
        name: "مزایجان",
      },
      {
        id: "city-17-091",
        parentId: "province-17",
        name: "مشکان",
      },
      {
        id: "city-17-092",
        parentId: "province-17",
        name: "مصیری",
      },
      {
        id: "city-17-093",
        parentId: "province-17",
        name: "مهر",
      },
      {
        id: "city-17-094",
        parentId: "province-17",
        name: "میانشهر",
      },
      {
        id: "city-17-095",
        parentId: "province-17",
        name: "میمند",
      },
      {
        id: "city-17-096",
        parentId: "province-17",
        name: "نوبندگان",
      },
      {
        id: "city-17-097",
        parentId: "province-17",
        name: "نوجین",
      },
      {
        id: "city-17-098",
        parentId: "province-17",
        name: "نودان",
      },
      {
        id: "city-17-099",
        parentId: "province-17",
        name: "نورآباد",
      },
      {
        id: "city-17-100",
        parentId: "province-17",
        name: "نی ریز",
      },
      {
        id: "city-17-101",
        parentId: "province-17",
        name: "وراوی",
      },
      {
        id: "city-17-102",
        parentId: "province-17",
        name: "هماشهر",
      },
    ],
  },
  {
    id: "province-18",
    name: "قزوین",
    cities: [
      {
        id: "city-18-001",
        parentId: "province-18",
        name: "آبگرم",
      },
      {
        id: "city-18-002",
        parentId: "province-18",
        name: "آبیک",
      },
      {
        id: "city-18-003",
        parentId: "province-18",
        name: "آوج",
      },
      {
        id: "city-18-004",
        parentId: "province-18",
        name: "ارداق",
      },
      {
        id: "city-18-005",
        parentId: "province-18",
        name: "اسفرورین",
      },
      {
        id: "city-18-006",
        parentId: "province-18",
        name: "اقبالیه",
      },
      {
        id: "city-18-007",
        parentId: "province-18",
        name: "الوند",
      },
      {
        id: "city-18-008",
        parentId: "province-18",
        name: "بویین زهرا",
      },
      {
        id: "city-18-009",
        parentId: "province-18",
        name: "بیدستان",
      },
      {
        id: "city-18-010",
        parentId: "province-18",
        name: "تاکستان",
      },
      {
        id: "city-18-011",
        parentId: "province-18",
        name: "خاکعلی",
      },
      {
        id: "city-18-012",
        parentId: "province-18",
        name: "خرمدشت",
      },
      {
        id: "city-18-013",
        parentId: "province-18",
        name: "دانسفهان",
      },
      {
        id: "city-18-014",
        parentId: "province-18",
        name: "رازمیان",
      },
      {
        id: "city-18-015",
        parentId: "province-18",
        name: "سگزآباد",
      },
      {
        id: "city-18-016",
        parentId: "province-18",
        name: "سیردان",
      },
      {
        id: "city-18-017",
        parentId: "province-18",
        name: "شال",
      },
      {
        id: "city-18-018",
        parentId: "province-18",
        name: "شریفیه",
      },
      {
        id: "city-18-019",
        parentId: "province-18",
        name: "ضیاڈآباد",
      },
      {
        id: "city-18-020",
        parentId: "province-18",
        name: "قزوین",
      },
      {
        id: "city-18-021",
        parentId: "province-18",
        name: "کوهین",
      },
      {
        id: "city-18-022",
        parentId: "province-18",
        name: "محمدیه",
      },
      {
        id: "city-18-023",
        parentId: "province-18",
        name: "محمودآبادنمونه",
      },
      {
        id: "city-18-024",
        parentId: "province-18",
        name: "معلم کلایه",
      },
      {
        id: "city-18-025",
        parentId: "province-18",
        name: "نرجه",
      },
    ],
  },
  {
    id: "province-19",
    name: "قم",
    cities: [
      {
        id: "city-19-001",
        parentId: "province-19",
        name: "جعفریه",
      },
      {
        id: "city-19-002",
        parentId: "province-19",
        name: "دستجرد",
      },
      {
        id: "city-19-003",
        parentId: "province-19",
        name: "سلفچگان",
      },
      {
        id: "city-19-004",
        parentId: "province-19",
        name: "قم",
      },
      {
        id: "city-19-005",
        parentId: "province-19",
        name: "قنوات",
      },
      {
        id: "city-19-006",
        parentId: "province-19",
        name: "کهک",
      },
    ],
  },
  {
    id: "province-20",
    name: "کردستان",
    cities: [
      {
        id: "city-20-001",
        parentId: "province-20",
        name: "آرمرده",
      },
      {
        id: "city-20-002",
        parentId: "province-20",
        name: "اورامان تخت",
      },
      {
        id: "city-20-003",
        parentId: "province-20",
        name: "بابارشانی",
      },
      {
        id: "city-20-004",
        parentId: "province-20",
        name: "بانه",
      },
      {
        id: "city-20-005",
        parentId: "province-20",
        name: "برده رشه",
      },
      {
        id: "city-20-006",
        parentId: "province-20",
        name: "بلبان آباد",
      },
      {
        id: "city-20-007",
        parentId: "province-20",
        name: "بویین سفلی",
      },
      {
        id: "city-20-008",
        parentId: "province-20",
        name: "بیجار",
      },
      {
        id: "city-20-009",
        parentId: "province-20",
        name: "پیرتاج",
      },
      {
        id: "city-20-010",
        parentId: "province-20",
        name: "توپ آغاج",
      },
      {
        id: "city-20-011",
        parentId: "province-20",
        name: "چناره",
      },
      {
        id: "city-20-012",
        parentId: "province-20",
        name: "دزج",
      },
      {
        id: "city-20-013",
        parentId: "province-20",
        name: "دلبران",
      },
      {
        id: "city-20-014",
        parentId: "province-20",
        name: "دهگلان",
      },
      {
        id: "city-20-015",
        parentId: "province-20",
        name: "دیواندره",
      },
      {
        id: "city-20-016",
        parentId: "province-20",
        name: "زرینه",
      },
      {
        id: "city-20-017",
        parentId: "province-20",
        name: "سروآباد",
      },
      {
        id: "city-20-018",
        parentId: "province-20",
        name: "سریش آباد",
      },
      {
        id: "city-20-019",
        parentId: "province-20",
        name: "سقز",
      },
      {
        id: "city-20-020",
        parentId: "province-20",
        name: "سنندج",
      },
      {
        id: "city-20-021",
        parentId: "province-20",
        name: "شویشه",
      },
      {
        id: "city-20-022",
        parentId: "province-20",
        name: "صاحب",
      },
      {
        id: "city-20-023",
        parentId: "province-20",
        name: "قروه",
      },
      {
        id: "city-20-024",
        parentId: "province-20",
        name: "کامیاران",
      },
      {
        id: "city-20-025",
        parentId: "province-20",
        name: "کانی دینار",
      },
      {
        id: "city-20-026",
        parentId: "province-20",
        name: "کانی سور",
      },
      {
        id: "city-20-027",
        parentId: "province-20",
        name: "مریوان",
      },
      {
        id: "city-20-028",
        parentId: "province-20",
        name: "موچش",
      },
      {
        id: "city-20-029",
        parentId: "province-20",
        name: "یاسوکند",
      },
    ],
  },
  {
    id: "province-21",
    name: "کرمان",
    cities: [
      {
        id: "city-21-001",
        parentId: "province-21",
        name: "اختیارآباد",
      },
      {
        id: "city-21-002",
        parentId: "province-21",
        name: "ارزوییه",
      },
      {
        id: "city-21-003",
        parentId: "province-21",
        name: "امین شهر",
      },
      {
        id: "city-21-004",
        parentId: "province-21",
        name: "انار",
      },
      {
        id: "city-21-005",
        parentId: "province-21",
        name: "اندوهجرد",
      },
      {
        id: "city-21-006",
        parentId: "province-21",
        name: "باغین",
      },
      {
        id: "city-21-007",
        parentId: "province-21",
        name: "بافت",
      },
      {
        id: "city-21-008",
        parentId: "province-21",
        name: "بردسیر",
      },
      {
        id: "city-21-009",
        parentId: "province-21",
        name: "بروات",
      },
      {
        id: "city-21-010",
        parentId: "province-21",
        name: "بزنجان",
      },
      {
        id: "city-21-011",
        parentId: "province-21",
        name: "بلورد",
      },
      {
        id: "city-21-012",
        parentId: "province-21",
        name: "بلوک",
      },
      {
        id: "city-21-013",
        parentId: "province-21",
        name: "بم",
      },
      {
        id: "city-21-014",
        parentId: "province-21",
        name: "بهرمان",
      },
      {
        id: "city-21-015",
        parentId: "province-21",
        name: "پاریز",
      },
      {
        id: "city-21-016",
        parentId: "province-21",
        name: "جبالبارز",
      },
      {
        id: "city-21-017",
        parentId: "province-21",
        name: "جوپار",
      },
      {
        id: "city-21-018",
        parentId: "province-21",
        name: "جوزم",
      },
      {
        id: "city-21-019",
        parentId: "province-21",
        name: "جیرفت",
      },
      {
        id: "city-21-020",
        parentId: "province-21",
        name: "چترود",
      },
      {
        id: "city-21-021",
        parentId: "province-21",
        name: "خاتون اباد",
      },
      {
        id: "city-21-022",
        parentId: "province-21",
        name: "خانوک",
      },
      {
        id: "city-21-023",
        parentId: "province-21",
        name: "خواجو شهر",
      },
      {
        id: "city-21-024",
        parentId: "province-21",
        name: "خورسند",
      },
      {
        id: "city-21-025",
        parentId: "province-21",
        name: "درب بهشت",
      },
      {
        id: "city-21-026",
        parentId: "province-21",
        name: "دشتکار",
      },
      {
        id: "city-21-027",
        parentId: "province-21",
        name: "دوساری",
      },
      {
        id: "city-21-028",
        parentId: "province-21",
        name: "دهج",
      },
      {
        id: "city-21-029",
        parentId: "province-21",
        name: "رابر",
      },
      {
        id: "city-21-030",
        parentId: "province-21",
        name: "راور",
      },
      {
        id: "city-21-031",
        parentId: "province-21",
        name: "راین",
      },
      {
        id: "city-21-032",
        parentId: "province-21",
        name: "رفسنجان",
      },
      {
        id: "city-21-033",
        parentId: "province-21",
        name: "رودبار",
      },
      {
        id: "city-21-034",
        parentId: "province-21",
        name: "ریحان",
      },
      {
        id: "city-21-035",
        parentId: "province-21",
        name: "زرند",
      },
      {
        id: "city-21-036",
        parentId: "province-21",
        name: "زنگی آباد",
      },
      {
        id: "city-21-037",
        parentId: "province-21",
        name: "زهکلوت",
      },
      {
        id: "city-21-038",
        parentId: "province-21",
        name: "زیدآباد",
      },
      {
        id: "city-21-039",
        parentId: "province-21",
        name: "سیرجان",
      },
      {
        id: "city-21-040",
        parentId: "province-21",
        name: "شهداد",
      },
      {
        id: "city-21-041",
        parentId: "province-21",
        name: "شهربابک",
      },
      {
        id: "city-21-042",
        parentId: "province-21",
        name: "صفاییه",
      },
      {
        id: "city-21-043",
        parentId: "province-21",
        name: "عنبرآباد",
      },
      {
        id: "city-21-044",
        parentId: "province-21",
        name: "فاریاب",
      },
      {
        id: "city-21-045",
        parentId: "province-21",
        name: "فهرج",
      },
      {
        id: "city-21-046",
        parentId: "province-21",
        name: "قلعه گنج",
      },
      {
        id: "city-21-047",
        parentId: "province-21",
        name: "کاظم آباد",
      },
      {
        id: "city-21-048",
        parentId: "province-21",
        name: "کرمان",
      },
      {
        id: "city-21-049",
        parentId: "province-21",
        name: "کشکوییه",
      },
      {
        id: "city-21-050",
        parentId: "province-21",
        name: "کوهبنان",
      },
      {
        id: "city-21-051",
        parentId: "province-21",
        name: "کهنوج",
      },
      {
        id: "city-21-052",
        parentId: "province-21",
        name: "کیانشهر",
      },
      {
        id: "city-21-053",
        parentId: "province-21",
        name: "گلباف",
      },
      {
        id: "city-21-054",
        parentId: "province-21",
        name: "گلزار",
      },
      {
        id: "city-21-055",
        parentId: "province-21",
        name: "گنبکی",
      },
      {
        id: "city-21-056",
        parentId: "province-21",
        name: "لاله زار",
      },
      {
        id: "city-21-057",
        parentId: "province-21",
        name: "ماهان",
      },
      {
        id: "city-21-058",
        parentId: "province-21",
        name: "محمدآباد",
      },
      {
        id: "city-21-059",
        parentId: "province-21",
        name: "محی آباد",
      },
      {
        id: "city-21-060",
        parentId: "province-21",
        name: "مردهک",
      },
      {
        id: "city-21-061",
        parentId: "province-21",
        name: "مس سرچشمه",
      },
      {
        id: "city-21-062",
        parentId: "province-21",
        name: "منوجان",
      },
      {
        id: "city-21-063",
        parentId: "province-21",
        name: "نجف شهر",
      },
      {
        id: "city-21-064",
        parentId: "province-21",
        name: "نرماشیر",
      },
      {
        id: "city-21-065",
        parentId: "province-21",
        name: "نظام شهر",
      },
      {
        id: "city-21-066",
        parentId: "province-21",
        name: "نگار",
      },
      {
        id: "city-21-067",
        parentId: "province-21",
        name: "نودژ",
      },
      {
        id: "city-21-068",
        parentId: "province-21",
        name: "هجدک",
      },
      {
        id: "city-21-069",
        parentId: "province-21",
        name: "هماشهر",
      },
      {
        id: "city-21-070",
        parentId: "province-21",
        name: "هنزا",
      },
      {
        id: "city-21-071",
        parentId: "province-21",
        name: "یزدان شهر",
      },
    ],
  },
  {
    id: "province-22",
    name: "کرمانشاه",
    cities: [
      {
        id: "city-22-001",
        parentId: "province-22",
        name: "ازگله",
      },
      {
        id: "city-22-002",
        parentId: "province-22",
        name: "اسلام آبادغرب",
      },
      {
        id: "city-22-003",
        parentId: "province-22",
        name: "بانوره",
      },
      {
        id: "city-22-004",
        parentId: "province-22",
        name: "باینگان",
      },
      {
        id: "city-22-005",
        parentId: "province-22",
        name: "بیستون",
      },
      {
        id: "city-22-006",
        parentId: "province-22",
        name: "پاوه",
      },
      {
        id: "city-22-007",
        parentId: "province-22",
        name: "تازه آباد",
      },
      {
        id: "city-22-008",
        parentId: "province-22",
        name: "جوانرود",
      },
      {
        id: "city-22-009",
        parentId: "province-22",
        name: "حمیل",
      },
      {
        id: "city-22-010",
        parentId: "province-22",
        name: "رباط",
      },
      {
        id: "city-22-011",
        parentId: "province-22",
        name: "روانسر",
      },
      {
        id: "city-22-012",
        parentId: "province-22",
        name: "ریجاب",
      },
      {
        id: "city-22-013",
        parentId: "province-22",
        name: "سرپل ذهاب",
      },
      {
        id: "city-22-014",
        parentId: "province-22",
        name: "سرمست",
      },
      {
        id: "city-22-015",
        parentId: "province-22",
        name: "سطر",
      },
      {
        id: "city-22-016",
        parentId: "province-22",
        name: "سنقر",
      },
      {
        id: "city-22-017",
        parentId: "province-22",
        name: "سومار",
      },
      {
        id: "city-22-018",
        parentId: "province-22",
        name: "شاهو",
      },
      {
        id: "city-22-019",
        parentId: "province-22",
        name: "صحنه",
      },
      {
        id: "city-22-020",
        parentId: "province-22",
        name: "قصرشیرین",
      },
      {
        id: "city-22-021",
        parentId: "province-22",
        name: "کرمانشاه",
      },
      {
        id: "city-22-022",
        parentId: "province-22",
        name: "کرند",
      },
      {
        id: "city-22-023",
        parentId: "province-22",
        name: "کنگاور",
      },
      {
        id: "city-22-024",
        parentId: "province-22",
        name: "کوزران",
      },
      {
        id: "city-22-025",
        parentId: "province-22",
        name: "گودین",
      },
      {
        id: "city-22-026",
        parentId: "province-22",
        name: "گهواره",
      },
      {
        id: "city-22-027",
        parentId: "province-22",
        name: "گیلانغرب",
      },
      {
        id: "city-22-028",
        parentId: "province-22",
        name: "میان راهان",
      },
      {
        id: "city-22-029",
        parentId: "province-22",
        name: "نودشه",
      },
      {
        id: "city-22-030",
        parentId: "province-22",
        name: "نوسود",
      },
      {
        id: "city-22-031",
        parentId: "province-22",
        name: "هرسین",
      },
      {
        id: "city-22-032",
        parentId: "province-22",
        name: "هلشی",
      },
    ],
  },
  {
    id: "province-23",
    name: "کهگیلویه و بویراحمد",
    cities: [
      {
        id: "city-23-001",
        parentId: "province-23",
        name: "باشت",
      },
      {
        id: "city-23-002",
        parentId: "province-23",
        name: "پاتاوه",
      },
      {
        id: "city-23-003",
        parentId: "province-23",
        name: "چرام",
      },
      {
        id: "city-23-004",
        parentId: "province-23",
        name: "چیتاب",
      },
      {
        id: "city-23-005",
        parentId: "province-23",
        name: "دوگنبدان",
      },
      {
        id: "city-23-006",
        parentId: "province-23",
        name: "دهدشت",
      },
      {
        id: "city-23-007",
        parentId: "province-23",
        name: "دیشموک",
      },
      {
        id: "city-23-008",
        parentId: "province-23",
        name: "سرفاریاب",
      },
      {
        id: "city-23-009",
        parentId: "province-23",
        name: "سوق",
      },
      {
        id: "city-23-010",
        parentId: "province-23",
        name: "سی سخت",
      },
      {
        id: "city-23-011",
        parentId: "province-23",
        name: "قلعه رییسی",
      },
      {
        id: "city-23-012",
        parentId: "province-23",
        name: "گراب سفلی",
      },
      {
        id: "city-23-013",
        parentId: "province-23",
        name: "لنده",
      },
      {
        id: "city-23-014",
        parentId: "province-23",
        name: "لیکک",
      },
      {
        id: "city-23-015",
        parentId: "province-23",
        name: "مادوان",
      },
      {
        id: "city-23-016",
        parentId: "province-23",
        name: "مارگون",
      },
      {
        id: "city-23-017",
        parentId: "province-23",
        name: "یاسوج",
      },
    ],
  },
  {
    id: "province-24",
    name: "گلستان",
    cities: [
      {
        id: "city-24-001",
        parentId: "province-24",
        name: "آزادشهر",
      },
      {
        id: "city-24-002",
        parentId: "province-24",
        name: "آق قلا",
      },
      {
        id: "city-24-003",
        parentId: "province-24",
        name: "انبارآلوم",
      },
      {
        id: "city-24-004",
        parentId: "province-24",
        name: "اینچه برون",
      },
      {
        id: "city-24-005",
        parentId: "province-24",
        name: "بندرترکمن",
      },
      {
        id: "city-24-006",
        parentId: "province-24",
        name: "بندرگز",
      },
      {
        id: "city-24-007",
        parentId: "province-24",
        name: "تاتارعلیا",
      },
      {
        id: "city-24-008",
        parentId: "province-24",
        name: "جلین",
      },
      {
        id: "city-24-009",
        parentId: "province-24",
        name: "خان ببین",
      },
      {
        id: "city-24-010",
        parentId: "province-24",
        name: "دلند",
      },
      {
        id: "city-24-011",
        parentId: "province-24",
        name: "رامیان",
      },
      {
        id: "city-24-012",
        parentId: "province-24",
        name: "سرخنکلاته",
      },
      {
        id: "city-24-013",
        parentId: "province-24",
        name: "سنگدوین",
      },
      {
        id: "city-24-014",
        parentId: "province-24",
        name: "سیمین شهر",
      },
      {
        id: "city-24-015",
        parentId: "province-24",
        name: "علی اباد",
      },
      {
        id: "city-24-016",
        parentId: "province-24",
        name: "فاضل آباد",
      },
      {
        id: "city-24-017",
        parentId: "province-24",
        name: "فراغی",
      },
      {
        id: "city-24-018",
        parentId: "province-24",
        name: "کردکوی",
      },
      {
        id: "city-24-019",
        parentId: "province-24",
        name: "کلاله",
      },
      {
        id: "city-24-020",
        parentId: "province-24",
        name: "گالیکش",
      },
      {
        id: "city-24-021",
        parentId: "province-24",
        name: "گرگان",
      },
      {
        id: "city-24-022",
        parentId: "province-24",
        name: "گمیش تپه",
      },
      {
        id: "city-24-023",
        parentId: "province-24",
        name: "گنبدکاووس",
      },
      {
        id: "city-24-024",
        parentId: "province-24",
        name: "مراوه",
      },
      {
        id: "city-24-025",
        parentId: "province-24",
        name: "مزرعه",
      },
      {
        id: "city-24-026",
        parentId: "province-24",
        name: "مینودشت",
      },
      {
        id: "city-24-027",
        parentId: "province-24",
        name: "نگین شهر",
      },
      {
        id: "city-24-028",
        parentId: "province-24",
        name: "نوده خاندوز",
      },
      {
        id: "city-24-029",
        parentId: "province-24",
        name: "نوکنده",
      },
    ],
  },
  {
    id: "province-25",
    name: "گیلان",
    cities: [
      {
        id: "city-25-001",
        parentId: "province-25",
        name: "آستارا",
      },
      {
        id: "city-25-002",
        parentId: "province-25",
        name: "آستانه اشرفیه",
      },
      {
        id: "city-25-003",
        parentId: "province-25",
        name: "احمدسرگوراب",
      },
      {
        id: "city-25-004",
        parentId: "province-25",
        name: "اسالم",
      },
      {
        id: "city-25-005",
        parentId: "province-25",
        name: "اطاقور",
      },
      {
        id: "city-25-006",
        parentId: "province-25",
        name: "املش",
      },
      {
        id: "city-25-007",
        parentId: "province-25",
        name: "بازار جمعه",
      },
      {
        id: "city-25-008",
        parentId: "province-25",
        name: "بره سر",
      },
      {
        id: "city-25-009",
        parentId: "province-25",
        name: "بندرانزلی",
      },
      {
        id: "city-25-010",
        parentId: "province-25",
        name: "پره سر",
      },
      {
        id: "city-25-011",
        parentId: "province-25",
        name: "توتکابن",
      },
      {
        id: "city-25-012",
        parentId: "province-25",
        name: "جیرنده",
      },
      {
        id: "city-25-013",
        parentId: "province-25",
        name: "چابکسر",
      },
      {
        id: "city-25-014",
        parentId: "province-25",
        name: "چاف و چمخاله",
      },
      {
        id: "city-25-015",
        parentId: "province-25",
        name: "چوبر",
      },
      {
        id: "city-25-016",
        parentId: "province-25",
        name: "حویق",
      },
      {
        id: "city-25-017",
        parentId: "province-25",
        name: "خشکبیجار",
      },
      {
        id: "city-25-018",
        parentId: "province-25",
        name: "خمام",
      },
      {
        id: "city-25-019",
        parentId: "province-25",
        name: "دیلمان",
      },
      {
        id: "city-25-020",
        parentId: "province-25",
        name: "رانکوه",
      },
      {
        id: "city-25-021",
        parentId: "province-25",
        name: "رحیم آباد",
      },
      {
        id: "city-25-022",
        parentId: "province-25",
        name: "رستم آباد",
      },
      {
        id: "city-25-023",
        parentId: "province-25",
        name: "رشت",
      },
      {
        id: "city-25-024",
        parentId: "province-25",
        name: "رضوانشهر",
      },
      {
        id: "city-25-025",
        parentId: "province-25",
        name: "رودبار",
      },
      {
        id: "city-25-026",
        parentId: "province-25",
        name: "رودبنه",
      },
      {
        id: "city-25-027",
        parentId: "province-25",
        name: "رودسر",
      },
      {
        id: "city-25-028",
        parentId: "province-25",
        name: "سنگر",
      },
      {
        id: "city-25-029",
        parentId: "province-25",
        name: "سیاهکل",
      },
      {
        id: "city-25-030",
        parentId: "province-25",
        name: "شفت",
      },
      {
        id: "city-25-031",
        parentId: "province-25",
        name: "شلمان",
      },
      {
        id: "city-25-032",
        parentId: "province-25",
        name: "صومعه سرا",
      },
      {
        id: "city-25-033",
        parentId: "province-25",
        name: "فومن",
      },
      {
        id: "city-25-034",
        parentId: "province-25",
        name: "کلاچای",
      },
      {
        id: "city-25-035",
        parentId: "province-25",
        name: "کوچصفهان",
      },
      {
        id: "city-25-036",
        parentId: "province-25",
        name: "کومله",
      },
      {
        id: "city-25-037",
        parentId: "province-25",
        name: "کیاشهر",
      },
      {
        id: "city-25-038",
        parentId: "province-25",
        name: "گوراب زرمیخ",
      },
      {
        id: "city-25-039",
        parentId: "province-25",
        name: "لاهیجان",
      },
      {
        id: "city-25-040",
        parentId: "province-25",
        name: "لشت نشاء",
      },
      {
        id: "city-25-041",
        parentId: "province-25",
        name: "لنگرود",
      },
      {
        id: "city-25-042",
        parentId: "province-25",
        name: "لوشان",
      },
      {
        id: "city-25-043",
        parentId: "province-25",
        name: "لولمان",
      },
      {
        id: "city-25-044",
        parentId: "province-25",
        name: "لوندویل",
      },
      {
        id: "city-25-045",
        parentId: "province-25",
        name: "لیسار",
      },
      {
        id: "city-25-046",
        parentId: "province-25",
        name: "ماسال",
      },
      {
        id: "city-25-047",
        parentId: "province-25",
        name: "ماسوله",
      },
      {
        id: "city-25-048",
        parentId: "province-25",
        name: "ماکلوان",
      },
      {
        id: "city-25-049",
        parentId: "province-25",
        name: "مرجقل",
      },
      {
        id: "city-25-050",
        parentId: "province-25",
        name: "منجیل",
      },
      {
        id: "city-25-051",
        parentId: "province-25",
        name: "واجارگاه",
      },
      {
        id: "city-25-052",
        parentId: "province-25",
        name: "هشتپر (تالش)",
      },
    ],
  },
  {
    id: "province-26",
    name: "لرستان",
    cities: [
      {
        id: "city-26-001",
        parentId: "province-26",
        name: "ازنا",
      },
      {
        id: "city-26-002",
        parentId: "province-26",
        name: "اشترینان",
      },
      {
        id: "city-26-003",
        parentId: "province-26",
        name: "الشتر",
      },
      {
        id: "city-26-004",
        parentId: "province-26",
        name: "الیگودرز",
      },
      {
        id: "city-26-005",
        parentId: "province-26",
        name: "بروجرد",
      },
      {
        id: "city-26-006",
        parentId: "province-26",
        name: "بیران شهر",
      },
      {
        id: "city-26-007",
        parentId: "province-26",
        name: "پلدختر",
      },
      {
        id: "city-26-008",
        parentId: "province-26",
        name: "چالانچولان",
      },
      {
        id: "city-26-009",
        parentId: "province-26",
        name: "چقابل",
      },
      {
        id: "city-26-010",
        parentId: "province-26",
        name: "خرم آباد",
      },
      {
        id: "city-26-011",
        parentId: "province-26",
        name: "درب گنبد",
      },
      {
        id: "city-26-012",
        parentId: "province-26",
        name: "دورود",
      },
      {
        id: "city-26-013",
        parentId: "province-26",
        name: "زاغه",
      },
      {
        id: "city-26-014",
        parentId: "province-26",
        name: "سپیددشت",
      },
      {
        id: "city-26-015",
        parentId: "province-26",
        name: "سراب دوره",
      },
      {
        id: "city-26-016",
        parentId: "province-26",
        name: "شول آباد",
      },
      {
        id: "city-26-017",
        parentId: "province-26",
        name: "فیروزآباد",
      },
      {
        id: "city-26-018",
        parentId: "province-26",
        name: "کوهدشت",
      },
      {
        id: "city-26-019",
        parentId: "province-26",
        name: "کوهنانی",
      },
      {
        id: "city-26-020",
        parentId: "province-26",
        name: "گراب",
      },
      {
        id: "city-26-021",
        parentId: "province-26",
        name: "معمولان",
      },
      {
        id: "city-26-022",
        parentId: "province-26",
        name: "مومن آباد",
      },
      {
        id: "city-26-023",
        parentId: "province-26",
        name: "نورآباد",
      },
      {
        id: "city-26-024",
        parentId: "province-26",
        name: "ویسیان",
      },
      {
        id: "city-26-025",
        parentId: "province-26",
        name: "هفت چشمه",
      },
    ],
  },
  {
    id: "province-27",
    name: "مازندران",
    cities: [
      {
        id: "city-27-001",
        parentId: "province-27",
        name: "آلاشت",
      },
      {
        id: "city-27-002",
        parentId: "province-27",
        name: "آمل",
      },
      {
        id: "city-27-003",
        parentId: "province-27",
        name: "ارطه",
      },
      {
        id: "city-27-004",
        parentId: "province-27",
        name: "امامزاده عبدالله",
      },
      {
        id: "city-27-005",
        parentId: "province-27",
        name: "امیرکلا",
      },
      {
        id: "city-27-006",
        parentId: "province-27",
        name: "ایزدشهر",
      },
      {
        id: "city-27-007",
        parentId: "province-27",
        name: "بابل",
      },
      {
        id: "city-27-008",
        parentId: "province-27",
        name: "بابلسر",
      },
      {
        id: "city-27-009",
        parentId: "province-27",
        name: "بلده",
      },
      {
        id: "city-27-010",
        parentId: "province-27",
        name: "بهشهر",
      },
      {
        id: "city-27-011",
        parentId: "province-27",
        name: "بهنمیر",
      },
      {
        id: "city-27-012",
        parentId: "province-27",
        name: "پایین هولار",
      },
      {
        id: "city-27-013",
        parentId: "province-27",
        name: "پل سفید",
      },
      {
        id: "city-27-014",
        parentId: "province-27",
        name: "پول",
      },
      {
        id: "city-27-015",
        parentId: "province-27",
        name: "تنکابن",
      },
      {
        id: "city-27-016",
        parentId: "province-27",
        name: "جویبار",
      },
      {
        id: "city-27-017",
        parentId: "province-27",
        name: "چالوس",
      },
      {
        id: "city-27-018",
        parentId: "province-27",
        name: "چمستان",
      },
      {
        id: "city-27-019",
        parentId: "province-27",
        name: "خرم آباد",
      },
      {
        id: "city-27-020",
        parentId: "province-27",
        name: "خلیل شهر",
      },
      {
        id: "city-27-021",
        parentId: "province-27",
        name: "خوش رودپی",
      },
      {
        id: "city-27-022",
        parentId: "province-27",
        name: "دابودشت",
      },
      {
        id: "city-27-023",
        parentId: "province-27",
        name: "رامسر",
      },
      {
        id: "city-27-024",
        parentId: "province-27",
        name: "رستمکلا",
      },
      {
        id: "city-27-025",
        parentId: "province-27",
        name: "رویان",
      },
      {
        id: "city-27-026",
        parentId: "province-27",
        name: "رینه",
      },
      {
        id: "city-27-027",
        parentId: "province-27",
        name: "زرگرمحله",
      },
      {
        id: "city-27-028",
        parentId: "province-27",
        name: "زیرآب",
      },
      {
        id: "city-27-029",
        parentId: "province-27",
        name: "ساری",
      },
      {
        id: "city-27-030",
        parentId: "province-27",
        name: "سرخرود",
      },
      {
        id: "city-27-031",
        parentId: "province-27",
        name: "سلمان شهر",
      },
      {
        id: "city-27-032",
        parentId: "province-27",
        name: "سورک",
      },
      {
        id: "city-27-033",
        parentId: "province-27",
        name: "شیرگاه",
      },
      {
        id: "city-27-034",
        parentId: "province-27",
        name: "شیرود",
      },
      {
        id: "city-27-035",
        parentId: "province-27",
        name: "عباس اباد",
      },
      {
        id: "city-27-036",
        parentId: "province-27",
        name: "فریدونکنار",
      },
      {
        id: "city-27-037",
        parentId: "province-27",
        name: "فریم",
      },
      {
        id: "city-27-038",
        parentId: "province-27",
        name: "قایم شهر",
      },
      {
        id: "city-27-039",
        parentId: "province-27",
        name: "کتالم وسادات شهر",
      },
      {
        id: "city-27-040",
        parentId: "province-27",
        name: "کجور",
      },
      {
        id: "city-27-041",
        parentId: "province-27",
        name: "کلارآباد",
      },
      {
        id: "city-27-042",
        parentId: "province-27",
        name: "کلاردشت",
      },
      {
        id: "city-27-043",
        parentId: "province-27",
        name: "کوهی خیل",
      },
      {
        id: "city-27-044",
        parentId: "province-27",
        name: "کیاسر",
      },
      {
        id: "city-27-045",
        parentId: "province-27",
        name: "کیاکلا",
      },
      {
        id: "city-27-046",
        parentId: "province-27",
        name: "گتاب",
      },
      {
        id: "city-27-047",
        parentId: "province-27",
        name: "گزنک",
      },
      {
        id: "city-27-048",
        parentId: "province-27",
        name: "گلوگاه",
      },
      {
        id: "city-27-049",
        parentId: "province-27",
        name: "محمودآباد",
      },
      {
        id: "city-27-050",
        parentId: "province-27",
        name: "مرزن آباد",
      },
      {
        id: "city-27-051",
        parentId: "province-27",
        name: "مرزیکلا",
      },
      {
        id: "city-27-052",
        parentId: "province-27",
        name: "نشتارود",
      },
      {
        id: "city-27-053",
        parentId: "province-27",
        name: "نکا",
      },
      {
        id: "city-27-054",
        parentId: "province-27",
        name: "نور",
      },
      {
        id: "city-27-055",
        parentId: "province-27",
        name: "نوشهر",
      },
      {
        id: "city-27-056",
        parentId: "province-27",
        name: "هادی شهر",
      },
      {
        id: "city-27-057",
        parentId: "province-27",
        name: "هچیرود",
      },
    ],
  },
  {
    id: "province-28",
    name: "مرکزی",
    cities: [
      {
        id: "city-28-001",
        parentId: "province-28",
        name: "آستانه",
      },
      {
        id: "city-28-002",
        parentId: "province-28",
        name: "آشتیان",
      },
      {
        id: "city-28-003",
        parentId: "province-28",
        name: "آوه",
      },
      {
        id: "city-28-004",
        parentId: "province-28",
        name: "اراک",
      },
      {
        id: "city-28-005",
        parentId: "province-28",
        name: "پرندک",
      },
      {
        id: "city-28-006",
        parentId: "province-28",
        name: "تفرش",
      },
      {
        id: "city-28-007",
        parentId: "province-28",
        name: "توره",
      },
      {
        id: "city-28-008",
        parentId: "province-28",
        name: "جاورسیان",
      },
      {
        id: "city-28-009",
        parentId: "province-28",
        name: "خشکرود",
      },
      {
        id: "city-28-010",
        parentId: "province-28",
        name: "خمین",
      },
      {
        id: "city-28-011",
        parentId: "province-28",
        name: "خنجین",
      },
      {
        id: "city-28-012",
        parentId: "province-28",
        name: "خنداب",
      },
      {
        id: "city-28-013",
        parentId: "province-28",
        name: "داودآباد",
      },
      {
        id: "city-28-014",
        parentId: "province-28",
        name: "دلیجان",
      },
      {
        id: "city-28-015",
        parentId: "province-28",
        name: "رازقان",
      },
      {
        id: "city-28-016",
        parentId: "province-28",
        name: "زاویه",
      },
      {
        id: "city-28-017",
        parentId: "province-28",
        name: "ساروق",
      },
      {
        id: "city-28-018",
        parentId: "province-28",
        name: "ساوه",
      },
      {
        id: "city-28-019",
        parentId: "province-28",
        name: "شازند",
      },
      {
        id: "city-28-020",
        parentId: "province-28",
        name: "شهباز",
      },
      {
        id: "city-28-021",
        parentId: "province-28",
        name: "غرق آباد",
      },
      {
        id: "city-28-022",
        parentId: "province-28",
        name: "فرمهین",
      },
      {
        id: "city-28-023",
        parentId: "province-28",
        name: "قورچی باشی",
      },
      {
        id: "city-28-024",
        parentId: "province-28",
        name: "کارچان",
      },
      {
        id: "city-28-025",
        parentId: "province-28",
        name: "کمیجان",
      },
      {
        id: "city-28-026",
        parentId: "province-28",
        name: "مامونیه",
      },
      {
        id: "city-28-027",
        parentId: "province-28",
        name: "محلات",
      },
      {
        id: "city-28-028",
        parentId: "province-28",
        name: "مهاجران",
      },
      {
        id: "city-28-029",
        parentId: "province-28",
        name: "میلاجرد",
      },
      {
        id: "city-28-030",
        parentId: "province-28",
        name: "نراق",
      },
      {
        id: "city-28-031",
        parentId: "province-28",
        name: "نوبران",
      },
      {
        id: "city-28-032",
        parentId: "province-28",
        name: "نیمور",
      },
      {
        id: "city-28-033",
        parentId: "province-28",
        name: "هندودر",
      },
    ],
  },
  {
    id: "province-29",
    name: "هرمزگان",
    cities: [
      {
        id: "city-29-001",
        parentId: "province-29",
        name: "ابوموسی",
      },
      {
        id: "city-29-002",
        parentId: "province-29",
        name: "بستک",
      },
      {
        id: "city-29-003",
        parentId: "province-29",
        name: "بندرجاسک",
      },
      {
        id: "city-29-004",
        parentId: "province-29",
        name: "بندرعباس",
      },
      {
        id: "city-29-005",
        parentId: "province-29",
        name: "بندرلنگه",
      },
      {
        id: "city-29-006",
        parentId: "province-29",
        name: "بیکاء",
      },
      {
        id: "city-29-007",
        parentId: "province-29",
        name: "پارسیان",
      },
      {
        id: "city-29-008",
        parentId: "province-29",
        name: "تازیان پایین",
      },
      {
        id: "city-29-009",
        parentId: "province-29",
        name: "تخت",
      },
      {
        id: "city-29-010",
        parentId: "province-29",
        name: "تیرور",
      },
      {
        id: "city-29-011",
        parentId: "province-29",
        name: "جناح",
      },
      {
        id: "city-29-012",
        parentId: "province-29",
        name: "چارک",
      },
      {
        id: "city-29-013",
        parentId: "province-29",
        name: "حاجی اباد",
      },
      {
        id: "city-29-014",
        parentId: "province-29",
        name: "خمیر",
      },
      {
        id: "city-29-015",
        parentId: "province-29",
        name: "درگهان",
      },
      {
        id: "city-29-016",
        parentId: "province-29",
        name: "دشتی",
      },
      {
        id: "city-29-017",
        parentId: "province-29",
        name: "دهبارز",
      },
      {
        id: "city-29-018",
        parentId: "province-29",
        name: "رویدر",
      },
      {
        id: "city-29-019",
        parentId: "province-29",
        name: "زیارتعلی",
      },
      {
        id: "city-29-020",
        parentId: "province-29",
        name: "سردشت",
      },
      {
        id: "city-29-021",
        parentId: "province-29",
        name: "سرگز",
      },
      {
        id: "city-29-022",
        parentId: "province-29",
        name: "سندرک",
      },
      {
        id: "city-29-023",
        parentId: "province-29",
        name: "سوزا",
      },
      {
        id: "city-29-024",
        parentId: "province-29",
        name: "سیریک",
      },
      {
        id: "city-29-025",
        parentId: "province-29",
        name: "فارغان",
      },
      {
        id: "city-29-026",
        parentId: "province-29",
        name: "فین",
      },
      {
        id: "city-29-027",
        parentId: "province-29",
        name: "قشم",
      },
      {
        id: "city-29-028",
        parentId: "province-29",
        name: "قلعه قاضی",
      },
      {
        id: "city-29-029",
        parentId: "province-29",
        name: "کنگ",
      },
      {
        id: "city-29-030",
        parentId: "province-29",
        name: "کوشکنار",
      },
      {
        id: "city-29-031",
        parentId: "province-29",
        name: "کوهستک",
      },
      {
        id: "city-29-032",
        parentId: "province-29",
        name: "کیش",
      },
      {
        id: "city-29-033",
        parentId: "province-29",
        name: "گروک",
      },
      {
        id: "city-29-034",
        parentId: "province-29",
        name: "گوهران",
      },
      {
        id: "city-29-035",
        parentId: "province-29",
        name: "لمزان",
      },
      {
        id: "city-29-036",
        parentId: "province-29",
        name: "میناب",
      },
      {
        id: "city-29-037",
        parentId: "province-29",
        name: "هرمز",
      },
      {
        id: "city-29-038",
        parentId: "province-29",
        name: "هشتبندی",
      },
    ],
  },
  {
    id: "province-30",
    name: "همدان",
    cities: [
      {
        id: "city-30-001",
        parentId: "province-30",
        name: "آجین",
      },
      {
        id: "city-30-002",
        parentId: "province-30",
        name: "ازندریان",
      },
      {
        id: "city-30-003",
        parentId: "province-30",
        name: "اسدآباد",
      },
      {
        id: "city-30-004",
        parentId: "province-30",
        name: "برزول",
      },
      {
        id: "city-30-005",
        parentId: "province-30",
        name: "بهار",
      },
      {
        id: "city-30-006",
        parentId: "province-30",
        name: "تویسرکان",
      },
      {
        id: "city-30-007",
        parentId: "province-30",
        name: "جورقان",
      },
      {
        id: "city-30-008",
        parentId: "province-30",
        name: "جوکار",
      },
      {
        id: "city-30-009",
        parentId: "province-30",
        name: "دمق",
      },
      {
        id: "city-30-010",
        parentId: "province-30",
        name: "رزن",
      },
      {
        id: "city-30-011",
        parentId: "province-30",
        name: "زنگنه",
      },
      {
        id: "city-30-012",
        parentId: "province-30",
        name: "سامن",
      },
      {
        id: "city-30-013",
        parentId: "province-30",
        name: "سرکان",
      },
      {
        id: "city-30-014",
        parentId: "province-30",
        name: "شیرین سو",
      },
      {
        id: "city-30-015",
        parentId: "province-30",
        name: "صالح آباد",
      },
      {
        id: "city-30-016",
        parentId: "province-30",
        name: "فامنین",
      },
      {
        id: "city-30-017",
        parentId: "province-30",
        name: "فرسفج",
      },
      {
        id: "city-30-018",
        parentId: "province-30",
        name: "فیروزان",
      },
      {
        id: "city-30-019",
        parentId: "province-30",
        name: "قروه درجزین",
      },
      {
        id: "city-30-020",
        parentId: "province-30",
        name: "قهاوند",
      },
      {
        id: "city-30-021",
        parentId: "province-30",
        name: "کبودرآهنگ",
      },
      {
        id: "city-30-022",
        parentId: "province-30",
        name: "گل تپه",
      },
      {
        id: "city-30-023",
        parentId: "province-30",
        name: "گیان",
      },
      {
        id: "city-30-024",
        parentId: "province-30",
        name: "لالجین",
      },
      {
        id: "city-30-025",
        parentId: "province-30",
        name: "مریانج",
      },
      {
        id: "city-30-026",
        parentId: "province-30",
        name: "ملایر",
      },
      {
        id: "city-30-027",
        parentId: "province-30",
        name: "مهاجران",
      },
      {
        id: "city-30-028",
        parentId: "province-30",
        name: "نهاوند",
      },
      {
        id: "city-30-029",
        parentId: "province-30",
        name: "همدان",
      },
    ],
  },
  {
    id: "province-31",
    name: "یزد",
    cities: [
      {
        id: "city-31-001",
        parentId: "province-31",
        name: "ابرکوه",
      },
      {
        id: "city-31-002",
        parentId: "province-31",
        name: "احمدآباد",
      },
      {
        id: "city-31-003",
        parentId: "province-31",
        name: "اردکان",
      },
      {
        id: "city-31-004",
        parentId: "province-31",
        name: "اشکذر",
      },
      {
        id: "city-31-005",
        parentId: "province-31",
        name: "بافق",
      },
      {
        id: "city-31-006",
        parentId: "province-31",
        name: "بفروییه",
      },
      {
        id: "city-31-007",
        parentId: "province-31",
        name: "بهاباد",
      },
      {
        id: "city-31-008",
        parentId: "province-31",
        name: "تفت",
      },
      {
        id: "city-31-009",
        parentId: "province-31",
        name: "حمیدیا",
      },
      {
        id: "city-31-010",
        parentId: "province-31",
        name: "خضرآباد",
      },
      {
        id: "city-31-011",
        parentId: "province-31",
        name: "زارچ",
      },
      {
        id: "city-31-012",
        parentId: "province-31",
        name: "شاهدیه",
      },
      {
        id: "city-31-013",
        parentId: "province-31",
        name: "عقدا",
      },
      {
        id: "city-31-014",
        parentId: "province-31",
        name: "مروست",
      },
      {
        id: "city-31-015",
        parentId: "province-31",
        name: "مهردشت",
      },
      {
        id: "city-31-016",
        parentId: "province-31",
        name: "مهریز",
      },
      {
        id: "city-31-017",
        parentId: "province-31",
        name: "میبد",
      },
      {
        id: "city-31-018",
        parentId: "province-31",
        name: "ندوشن",
      },
      {
        id: "city-31-019",
        parentId: "province-31",
        name: "نیر",
      },
      {
        id: "city-31-020",
        parentId: "province-31",
        name: "هرات",
      },
      {
        id: "city-31-021",
        parentId: "province-31",
        name: "یزد",
      },
    ],
  },
] as const satisfies readonly IranProvinceLocationEntry[];

export type IranProvinceLocation = IranProvinceLocationEntry;
export type IranCityLocation = IranCityLocationEntry;
export type IranProvinceId = IranProvinceLocation["id"];
export type IranProvince = IranProvinceLocation["name"];

export type IranProvinceOption = Pick<IranProvinceLocation, "id" | "name">;
export type IranCityOption = Pick<IranCityLocation, "id" | "parentId" | "name">;

function normalizeIranLocationName(value: string): string {
  return value
    .trim()
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\u0643/g, "\u06a9")
    .replace(/\u064a/g, "\u06cc");
}

function getComparableIranLocationName(value: string): string {
  return normalizeIranLocationName(value).replace(/\s/g, "");
}

function findIranProvinceLocation(value: string): IranProvinceLocation | undefined {
  const normalizedValue = normalizeIranLocationName(value);
  if (!normalizedValue) return undefined;

  const exactProvince = IRAN_LOCATIONS.find(
    ({ id, name }) => id === normalizedValue || name === normalizedValue,
  );
  if (exactProvince) return exactProvince;

  const comparableValue = getComparableIranLocationName(normalizedValue);

  return IRAN_LOCATIONS.find(({ name }) => {
    const comparableProvince = getComparableIranLocationName(name);
    return (
      comparableProvince === comparableValue ||
      comparableProvince.includes(comparableValue) ||
      comparableValue.includes(comparableProvince)
    );
  });
}

export const IRAN_PROVINCES: readonly IranProvince[] = IRAN_LOCATIONS.map(
  ({ name }) => name,
);

export const IRAN_CITIES: readonly IranCityLocation[] = IRAN_LOCATIONS.reduce<
  IranCityLocation[]
>(
  (allCities, { cities }) => {
    allCities.push(...cities);
    return allCities;
  },
  [],
);

export const IRAN_CITIES_BY_PROVINCE = IRAN_LOCATIONS.reduce(
  (citiesByProvince, { name, cities }) => {
    citiesByProvince[name] = cities.map((city) => city.name);
    return citiesByProvince;
  },
  {} as Record<IranProvince, string[]>,
);

export const IRAN_CITIES_BY_PROVINCE_ID = IRAN_LOCATIONS.reduce(
  (citiesByProvinceId, { id, cities }) => {
    citiesByProvinceId[id] = cities;
    return citiesByProvinceId;
  },
  {} as Record<IranProvinceId, readonly IranCityLocation[]>,
);

export function getIranProvinceNames(): string[] {
  return [...IRAN_PROVINCES];
}

export function getIranProvinceOptions(): IranProvinceOption[] {
  return IRAN_LOCATIONS.map(({ id, name }) => ({ id, name }));
}

export function getCitiesByProvince(province: string): string[] {
  const provinceLocation = findIranProvinceLocation(province);
  if (!provinceLocation) return [];

  return provinceLocation.cities.map((city) => city.name);
}

export function getCityOptionsByProvince(province: string): IranCityOption[] {
  const provinceLocation = findIranProvinceLocation(province);
  if (!provinceLocation) return [];

  return provinceLocation.cities.map(({ id, parentId, name }) => ({
    id,
    parentId,
    name,
  }));
}

export function resolveIranProvince(value: string): string {
  return findIranProvinceLocation(value)?.name ?? value;
}

export function resolveIranProvinceId(value: string): string {
  return findIranProvinceLocation(value)?.id ?? "";
}
