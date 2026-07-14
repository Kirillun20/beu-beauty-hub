export type Availability = "in_stock" | "preorder" | "out_of_stock";

export interface VolumeVariant {
  volume: string;
  price: number;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  subcategories?: string[];
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  rating: number;
  reviewCount?: number;
  inStock: boolean;
  availability?: Availability;
  preorderDays?: number;
  volume?: string;
  volumeVariants?: VolumeVariant[];
  tags?: string[];
  preOrder?: boolean;
  country?: string;
  composition?: string;
  application?: string;
  homeSections?: string[];
}

export const HOME_SECTIONS: { id: string; label: string; icon: string }[] = [
  { id: "featured", label: "Популярные", icon: "⭐" },
  { id: "sale", label: "Акции", icon: "🔥" },
  { id: "new", label: "Новинки", icon: "🆕" },
  { id: "styling", label: "Укладка волос", icon: "💈" },
  { id: "hair", label: "Волосы", icon: "💇" },
  { id: "beard", label: "Борода и Усы", icon: "🧔" },
  { id: "body", label: "Лицо и Тело", icon: "🧖" },
  { id: "perfume", label: "Парфюмерия", icon: "🌟" },
  { id: "other", label: "Другое / Для женщин", icon: "🎁" },
];

export interface Subcategory {
  slug: string;
  name: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  desc?: string;
  count: number;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    id: "1", name: "Укладка волос", slug: "styling", icon: "💈",
    desc: "Профессиональные средства для идеальной укладки",
    count: 12,
    subcategories: [
      { slug: "pomade", name: "Помады", icon: "💠" },
      { slug: "paste", name: "Пасты", icon: "🧴" },
      { slug: "clay", name: "Глины", icon: "🏺" },
      { slug: "powder", name: "Пудры", icon: "✨" },
      { slug: "cream", name: "Кремы", icon: "🥛" },
      { slug: "gel", name: "Гели", icon: "💧" },
      { slug: "wax", name: "Воски", icon: "🍯" },
      { slug: "mousse", name: "Муссы", icon: "☁️" },
      { slug: "spray", name: "Спреи", icon: "💨" },
      { slug: "tonic", name: "Тоники", icon: "🌿" },
      { slug: "balm", name: "Бальзамы", icon: "🍃" },
      { slug: "foam", name: "Пены", icon: "🫧" },
    ],
  },
  {
    id: "2", name: "Волосы", slug: "hair", icon: "💇", desc: "Уход и оздоровление волос", count: 8,
    subcategories: [
      { slug: "shampoo", name: "Шампуни", icon: "🧴" },
      { slug: "conditioner", name: "Кондиционеры", icon: "💧" },
      { slug: "hair-care", name: "Уход за волосами", icon: "✨" },
      { slug: "brushes", name: "Щётки", icon: "🪮" },
      { slug: "combs", name: "Расчёски", icon: "🪮" },
      { slug: "grey", name: "Седина и окрашивание", icon: "🎨" },
    ],
  },
  {
    id: "3", name: "Борода и Усы", slug: "beard", icon: "🧔", desc: "Уход за бородой и усами", count: 7,
    subcategories: [
      { slug: "beard-shampoo", name: "Шампуни", icon: "🧴" },
      { slug: "beard-oil", name: "Масла и сыворотки", icon: "🛢️" },
      { slug: "beard-balm", name: "Бальзамы", icon: "🍃" },
      { slug: "beard-conditioner", name: "Кондиционеры", icon: "💧" },
      { slug: "beard-soap", name: "Мыло", icon: "🧼" },
      { slug: "beard-color", name: "Окрашивание", icon: "🎨" },
      { slug: "mustache-wax", name: "Воск для усов", icon: "🍯" },
    ],
  },
  {
    id: "4", name: "Лицо и Тело", slug: "body", icon: "🧖", desc: "Ежедневный ритуал ухода", count: 10,
    subcategories: [
      { slug: "shower-gel", name: "Гель для душа", icon: "🚿" },
      { slug: "body-soap", name: "Мыло для тела", icon: "🧼" },
      { slug: "feet", name: "Кожа ног", icon: "🦶" },
      { slug: "hands", name: "Кожа рук", icon: "🤚" },
      { slug: "body-care", name: "Уход за телом", icon: "💆" },
      { slug: "deodorant", name: "Дезодоранты", icon: "🧴" },
      { slug: "face-cleanse", name: "Очищение лица", icon: "💦" },
      { slug: "face-care", name: "Уход за лицом", icon: "✨" },
    ],
  },
  {
    id: "5", name: "Парфюмерия", slug: "perfume", icon: "🌟", desc: "Премиальные ароматы для мужчин", count: 15,
    subcategories: [
      { slug: "cologne", name: "Одеколоны", icon: "🌬️" },
      { slug: "edt", name: "Туалетная вода", icon: "💎" },
      { slug: "dry-cologne", name: "Сухой одеколон", icon: "🌿" },
      { slug: "lotion", name: "Лосьон", icon: "💧" },
    ],
  },
  {
    id: "6", name: "Другое / Для женщин", slug: "other", icon: "🎁", desc: "Подарки и универсальные средства", count: 5,
    subcategories: [
      { slug: "women", name: "Для женщин", icon: "💃" },
      { slug: "accessories", name: "Аксессуары", icon: "🎀" },
      { slug: "gifts", name: "Подарочные наборы", icon: "🎁" },
    ],
  },
];

export const ORDER_STATUSES: { id: string; label: string; color: string }[] = [
  { id: "pending", label: "Новый", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  { id: "confirmed", label: "Подтверждён", color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" },
  { id: "processing", label: "В обработке", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  { id: "shipped", label: "Отправлен", color: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  { id: "delivered", label: "Доставлен", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  { id: "cancelled", label: "Отменён", color: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
];

// Legacy brand list — used only as a fallback. Catalog derives the live brand list from DB products.
export const brands: string[] = [];

// Demo products were removed by user request — catalog now sources items exclusively from the database.
export const products: Product[] = [];
