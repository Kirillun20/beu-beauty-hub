export interface SubCategory {
  slug: string;
  name: string;
  icon?: string;
}

export interface MainCategory {
  slug: string;
  name: string;
  icon: string;
  description: string;
  gradient: string;
  subcategories: SubCategory[];
}

export const mainCategories: MainCategory[] = [
  {
    slug: "styling",
    name: "Укладка волос",
    icon: "💈",
    description: "Профессиональные средства для идеальной укладки",
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    subcategories: [
      { slug: "pastes", name: "Пасты", icon: "🧴" },
      { slug: "clays", name: "Глины", icon: "🏺" },
      { slug: "powders", name: "Пудры", icon: "✨" },
      { slug: "creams", name: "Кремы", icon: "🥛" },
      { slug: "gels", name: "Гели", icon: "💧" },
      { slug: "waxes", name: "Воски", icon: "🐝" },
      { slug: "mousses", name: "Муссы", icon: "☁️" },
      { slug: "sprays", name: "Спреи", icon: "💨" },
      { slug: "tonics", name: "Тоники", icon: "🧪" },
      { slug: "balms", name: "Бальзамы", icon: "🌿" },
      { slug: "foams", name: "Пены", icon: "🫧" },
    ],
  },
  {
    slug: "hair",
    name: "Волосы",
    icon: "💇‍♂️",
    description: "Полный уход за волосами от мытья до окрашивания",
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
    subcategories: [
      { slug: "styling-hair", name: "Укладка волос", icon: "💈" },
      { slug: "shampoos", name: "Шампуни", icon: "🧴" },
      { slug: "hair-care", name: "Уход за волосами", icon: "💆‍♂️" },
      { slug: "brushes", name: "Щётки", icon: "🪮" },
      { slug: "combs", name: "Расчёски", icon: "🪒" },
      { slug: "grey-coloring", name: "Седина и окрашивание", icon: "🎨" },
    ],
  },
  {
    slug: "beard",
    name: "Борода и Усы",
    icon: "🧔",
    description: "Уход для настоящих джентльменов",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    subcategories: [
      { slug: "beard-shampoos", name: "Шампуни", icon: "🧴" },
      { slug: "oils-serums", name: "Масла и сыворотки", icon: "💧" },
      { slug: "beard-balms", name: "Бальзамы", icon: "🌿" },
      { slug: "conditioners", name: "Кондиционеры", icon: "🧪" },
      { slug: "soaps", name: "Мыло", icon: "🧼" },
      { slug: "beard-coloring", name: "Окрашивание", icon: "🎨" },
      { slug: "mustache-wax", name: "Воск для усов", icon: "👨" },
    ],
  },
  {
    slug: "body",
    name: "Лицо и Тело",
    icon: "🧖‍♂️",
    description: "Ежедневный ритуал ухода",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    subcategories: [
      { slug: "shower-gels", name: "Гель для душа", icon: "🚿" },
      { slug: "body-soaps", name: "Мыло для тела", icon: "🧼" },
      { slug: "feet-skin", name: "Кожа ног", icon: "🦶" },
      { slug: "hands-skin", name: "Кожа рук", icon: "✋" },
      { slug: "body-care", name: "Уход за телом", icon: "💆" },
      { slug: "deodorants", name: "Дезодоранты", icon: "🌀" },
      { slug: "face-cleansing", name: "Очищение лица", icon: "💦" },
      { slug: "face-care", name: "Уход за лицом", icon: "✨" },
    ],
  },
  {
    slug: "perfume",
    name: "Парфюмерия",
    icon: "🌟",
    description: "Изысканные ароматы класса премиум",
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    subcategories: [
      { slug: "colognes", name: "Одеколоны", icon: "🧴" },
      { slug: "edt", name: "Туалетная вода", icon: "💎" },
      { slug: "dry-cologne", name: "Сухой одеколон", icon: "🪨" },
      { slug: "lotions", name: "Лосьон", icon: "💧" },
    ],
  },
  {
    slug: "other",
    name: "Другое / Для женщин",
    icon: "🎁",
    description: "Подарки, аксессуары и средства для неё",
    gradient: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
    subcategories: [
      { slug: "for-women", name: "Для женщин", icon: "👩" },
      { slug: "gifts", name: "Подарочные наборы", icon: "🎁" },
      { slug: "accessories", name: "Аксессуары", icon: "🎀" },
      { slug: "other-misc", name: "Разное", icon: "📦" },
    ],
  },
];

export const findCategory = (slug?: string) =>
  mainCategories.find((c) => c.slug === slug);

export const findSubcategory = (catSlug?: string, subSlug?: string) =>
  findCategory(catSlug)?.subcategories.find((s) => s.slug === subSlug);

export type Availability = "in_stock" | "pre_order" | "out_of_stock";

export const availabilityLabels: Record<Availability, string> = {
  in_stock: "В наличии",
  pre_order: "Под заказ",
  out_of_stock: "Нет в наличии",
};

export const availabilityDesc: Record<Availability, string> = {
  in_stock: "Доставка 1-2 дня",
  pre_order: "Доставка 7-12 дней",
  out_of_stock: "Временно недоступно",
};

export const orderStatusLabels: Record<string, string> = {
  pending: "Ожидает",
  processing: "В обработке",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

export const orderStatusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  processing: "bg-blue-500/10 text-blue-500",
  shipped: "bg-accent/10 text-accent",
  delivered: "bg-green-500/10 text-green-500",
  cancelled: "bg-destructive/10 text-destructive",
};
