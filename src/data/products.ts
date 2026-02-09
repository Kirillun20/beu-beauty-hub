export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  rating: number;
  inStock: boolean;
  volume?: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

export const categories: Category[] = [
  { id: "1", name: "Укладка волос", slug: "styling", icon: "✂️", count: 12 },
  { id: "2", name: "Шампуни", slug: "shampoo", icon: "🧴", count: 8 },
  { id: "3", name: "Парфюмерия", slug: "perfume", icon: "🌟", count: 15 },
  { id: "4", name: "Гели для душа", slug: "shower", icon: "🚿", count: 6 },
  { id: "5", name: "Уход за лицом", slug: "face", icon: "💆", count: 10 },
  { id: "6", name: "Уход за бородой", slug: "beard", icon: "🧔", count: 7 },
];

export const brands = [
  "American Crew", "Baxter of California", "Proraso", "Acqua di Parma",
  "Molton Brown", "L'Occitane", "Dior", "Chanel"
];

export const products: Product[] = [
  {
    id: "1",
    name: "Fiber Cream Паста для укладки",
    brand: "American Crew",
    category: "styling",
    price: 45.90,
    oldPrice: 55.00,
    description: "Паста средней фиксации с матовым финишем. Идеальна для создания текстурных причёсок. Легко смывается водой.",
    image: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&h=400&fit=crop",
    rating: 4.8,
    inStock: true,
    volume: "85 г",
    tags: ["хит", "матовая"]
  },
  {
    id: "2",
    name: "Daily Moisturizing Shampoo",
    brand: "American Crew",
    category: "shampoo",
    price: 32.50,
    description: "Ежедневный увлажняющий шампунь с мятой и чайным деревом. Мягко очищает, не пересушивая кожу головы.",
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop",
    rating: 4.5,
    inStock: true,
    volume: "250 мл",
  },
  {
    id: "3",
    name: "Colonia Eau de Cologne",
    brand: "Acqua di Parma",
    category: "perfume",
    price: 189.00,
    oldPrice: 220.00,
    description: "Легендарный итальянский одеколон с нотами лаванды, розмарина и цитрусовых. Классика элегантности.",
    image: "https://images.unsplash.com/photo-1594035910387-fea081e83b32?w=400&h=400&fit=crop",
    rating: 4.9,
    inStock: true,
    volume: "100 мл",
    tags: ["премиум"]
  },
  {
    id: "4",
    name: "Clay Pomade Глина для волос",
    brand: "Baxter of California",
    category: "styling",
    price: 52.00,
    description: "Глина сильной фиксации с натуральным матовым эффектом. Содержит глину и пчелиный воск.",
    image: "https://images.unsplash.com/photo-1626808642875-0aa545482dfb?w=400&h=400&fit=crop",
    rating: 4.7,
    inStock: true,
    volume: "60 мл",
    tags: ["новинка"]
  },
  {
    id: "5",
    name: "Крем для бритья с эвкалиптом",
    brand: "Proraso",
    category: "face",
    price: 18.90,
    description: "Освежающий крем для бритья с ментолом и эвкалиптом. Обеспечивает идеальное скольжение бритвы.",
    image: "https://images.unsplash.com/photo-1621607512022-6aecc834d215?w=400&h=400&fit=crop",
    rating: 4.6,
    inStock: true,
    volume: "150 мл",
  },
  {
    id: "6",
    name: "Re-Charge Black Pepper Гель для душа",
    brand: "Molton Brown",
    category: "shower",
    price: 68.00,
    description: "Бодрящий гель для душа с нотами чёрного перца, кориандра и базилика. Придаёт энергию.",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    rating: 4.8,
    inStock: true,
    volume: "300 мл",
    tags: ["премиум"]
  },
  {
    id: "7",
    name: "Sauvage Eau de Parfum",
    brand: "Dior",
    category: "perfume",
    price: 245.00,
    description: "Мужской аромат с нотами бергамота, амброксана и ванили. Стойкий и харизматичный.",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop",
    rating: 4.9,
    inStock: true,
    volume: "100 мл",
    tags: ["хит", "премиум"]
  },
  {
    id: "8",
    name: "Масло для бороды",
    brand: "L'Occitane",
    category: "beard",
    price: 38.50,
    description: "Питательное масло для ухода за бородой. Смягчает, увлажняет и придаёт здоровый блеск.",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
    rating: 4.4,
    inStock: true,
    volume: "30 мл",
  },
  {
    id: "9",
    name: "Bleu de Chanel Eau de Toilette",
    brand: "Chanel",
    category: "perfume",
    price: 275.00,
    description: "Древесно-ароматический мужской аромат с нотами мяты, грейпфрута и кедра.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
    rating: 4.9,
    inStock: true,
    volume: "100 мл",
    tags: ["хит"]
  },
  {
    id: "10",
    name: "Forming Cream средняя фиксация",
    brand: "American Crew",
    category: "styling",
    price: 39.90,
    description: "Крем для укладки средней фиксации со средним блеском. Универсальный продукт для любого стиля.",
    image: "https://images.unsplash.com/photo-1597854710175-2a3407f66690?w=400&h=400&fit=crop",
    rating: 4.5,
    inStock: true,
    volume: "85 г",
  },
  {
    id: "11",
    name: "Шампунь для бороды",
    brand: "Proraso",
    category: "beard",
    price: 22.50,
    description: "Специальный шампунь для очищения и смягчения бороды. С маслом кипариса и ветивера.",
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop",
    rating: 4.3,
    inStock: true,
    volume: "200 мл",
  },
  {
    id: "12",
    name: "Увлажняющий крем для лица",
    brand: "Baxter of California",
    category: "face",
    price: 56.00,
    oldPrice: 65.00,
    description: "Лёгкий увлажняющий крем с витамином Е и алоэ вера. Не оставляет жирного блеска.",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4a38c0a?w=400&h=400&fit=crop",
    rating: 4.6,
    inStock: true,
    volume: "75 мл",
    tags: ["новинка"]
  },
];
