export type Availability = "in_stock" | "preorder" | "out_of_stock";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
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
  tags?: string[];
  preOrder?: boolean;
  country?: string;
  composition?: string;
  application?: string;
}

export interface Subcategory {
  slug: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    id: "1", name: "Укладка волос", slug: "styling", icon: "✂️", count: 12,
    subcategories: [
      { slug: "paste", name: "Пасты" },
      { slug: "clay", name: "Глины" },
      { slug: "powder", name: "Пудры" },
      { slug: "cream", name: "Кремы" },
      { slug: "gel", name: "Гели" },
      { slug: "wax", name: "Воски" },
      { slug: "mousse", name: "Муссы" },
      { slug: "spray", name: "Спреи" },
      { slug: "tonic", name: "Тоники" },
      { slug: "balm", name: "Бальзамы" },
      { slug: "foam", name: "Пены" },
    ],
  },
  {
    id: "2", name: "Волосы", slug: "hair", icon: "💇", count: 8,
    subcategories: [
      { slug: "styling", name: "Укладка волос" },
      { slug: "shampoo", name: "Шампуни" },
      { slug: "hair-care", name: "Уход за волосами" },
      { slug: "brushes", name: "Щётки" },
      { slug: "combs", name: "Расчёски" },
      { slug: "grey", name: "Седина и окрашивание" },
    ],
  },
  {
    id: "3", name: "Борода и Усы", slug: "beard", icon: "🧔", count: 7,
    subcategories: [
      { slug: "beard-shampoo", name: "Шампуни" },
      { slug: "beard-oil", name: "Масла и сыворотки" },
      { slug: "beard-balm", name: "Бальзамы" },
      { slug: "beard-conditioner", name: "Кондиционеры" },
      { slug: "beard-soap", name: "Мыло" },
      { slug: "beard-color", name: "Окрашивание" },
      { slug: "mustache-wax", name: "Воск для усов" },
    ],
  },
  {
    id: "4", name: "Лицо и Тело", slug: "body", icon: "🧖", count: 10,
    subcategories: [
      { slug: "shower-gel", name: "Гель для душа" },
      { slug: "body-soap", name: "Мыло для тела" },
      { slug: "feet", name: "Кожа ног" },
      { slug: "hands", name: "Кожа рук" },
      { slug: "body-care", name: "Уход за телом" },
      { slug: "deodorant", name: "Дезодоранты" },
      { slug: "face-cleanse", name: "Очищение лица" },
      { slug: "face-care", name: "Уход за лицом" },
    ],
  },
  {
    id: "5", name: "Парфюмерия", slug: "perfume", icon: "🌟", count: 15,
    subcategories: [
      { slug: "cologne", name: "Одеколоны" },
      { slug: "edt", name: "Туалетная вода" },
      { slug: "dry-cologne", name: "Сухой одеколон" },
      { slug: "lotion", name: "Лосьон" },
    ],
  },
  {
    id: "6", name: "Другое / Для женщин", slug: "other", icon: "💫", count: 5,
    subcategories: [
      { slug: "women", name: "Для женщин" },
      { slug: "accessories", name: "Аксессуары" },
      { slug: "gifts", name: "Подарочные наборы" },
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

export const brands = [
  "American Crew", "Baxter of California", "Proraso", "Acqua di Parma",
  "Molton Brown", "L'Occitane", "Dior", "Chanel",
  "Uppercut Deluxe", "Nishman", "Reuzel", "L'Oréal", "Estel", "Rascals", "Layrite"
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
    tags: ["хит", "матовая"],
    country: "США",
    composition: "Пчелиный воск, ланолин, каолиновая глина, витамин Е, масло жожоба",
    application: "Нанесите небольшое количество на сухие или слегка влажные волосы. Распределите равномерно, придавая желаемую форму."
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
    country: "США",
    composition: "Вода, лаурилсульфат натрия, масло мяты перечной, экстракт чайного дерева, пантенол",
    application: "Нанесите на влажные волосы, вспеньте и тщательно смойте. При необходимости повторите."
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
    tags: ["премиум"],
    country: "Италия",
    composition: "Верхние ноты: лимон, апельсин, бергамот. Средние: лаванда, розмарин. Базовые: ветивер, сандал",
    application: "Нанесите на точки пульса: запястья, шею, за ушами. Не растирайте — аромат раскроется естественно."
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
    tags: ["новинка"],
    country: "США",
    composition: "Бентонитовая глина, пчелиный воск, масло ши, экстракт бамбука, витамин B5",
    application: "Разогрейте небольшое количество между ладонями. Нанесите на сухие волосы, формируя причёску."
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
    country: "Италия",
    composition: "Стеариновая кислота, масло эвкалипта, ментол, глицерин, кокосовое масло",
    application: "Нанесите на влажную кожу лица. Взбейте помазком или руками до образования пены."
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
    tags: ["премиум"],
    country: "Великобритания",
    composition: "Вода, экстракт чёрного перца, масло кориандра, базилик, глицерин",
    application: "Нанесите на влажную кожу, вспеньте и тщательно смойте тёплой водой."
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
    tags: ["хит", "премиум"],
    country: "Франция",
    composition: "Верхние ноты: бергамот, перец. Средние: лаванда, перец Сычуань. Базовые: амброксан, кедр, ваниль",
    application: "Распылите на расстоянии 15-20 см от кожи на точки пульса. Один-два нажатия достаточно."
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
    country: "Франция",
    composition: "Масло арганы, масло жожоба, витамин Е, эфирное масло кедра, масло виноградных косточек",
    application: "Нанесите 3-5 капель на ладони и распределите по бороде, массируя кожу под ней."
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
    tags: ["хит"],
    country: "Франция",
    composition: "Верхние ноты: мята, грейпфрут. Средние: имбирь, жасмин. Базовые: кедр, ладан, сандал",
    application: "Нанесите на запястья и шею. Аромат раскрывается в течение дня."
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
    country: "США",
    composition: "Пчелиный воск, масло ши, пантенол, экстракт женьшеня, силиконы",
    application: "Разотрите между ладонями и нанесите на слегка влажные или сухие волосы."
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
    country: "Италия",
    composition: "Вода, кокамидопропилбетаин, масло кипариса, экстракт ветивера, пантенол",
    application: "Нанесите на влажную бороду, вспеньте массирующими движениями и смойте."
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
    tags: ["новинка"],
    country: "США",
    composition: "Алоэ вера, витамин Е, масло жожоба, гиалуроновая кислота, ниацинамид",
    application: "Нанесите на чистую кожу лица утром и вечером лёгкими массирующими движениями."
  },
  {
    id: "13",
    name: "Pomade сильная фиксация",
    brand: "American Crew",
    category: "styling",
    price: 42.00,
    description: "Классическая помада сильной фиксации с высоким блеском. Для классических зализанных причёсок.",
    image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&h=400&fit=crop",
    rating: 4.6,
    inStock: true,
    volume: "85 г",
    tags: ["хит"],
    country: "США",
    composition: "Петролатум, пчелиный воск, ланолин, масло кокоса, отдушка",
    application: "Нанесите на сухие или влажные волосы. Уложите расчёской для классического вида."
  },
  {
    id: "14",
    name: "Terre d'Hermès Eau de Toilette",
    brand: "L'Occitane",
    category: "perfume",
    price: 210.00,
    oldPrice: 250.00,
    description: "Земляной и минеральный аромат с нотами апельсина, перца и ветивера. Для мужчины с характером.",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop",
    rating: 4.7,
    inStock: true,
    volume: "100 мл",
    tags: ["премиум"],
    country: "Франция",
    composition: "Верхние ноты: апельсин, грейпфрут. Средние: перец, герань. Базовые: ветивер, кедр, бензоин",
    application: "Распылите на точки пульса. Избегайте нанесения на одежду."
  },
  {
    id: "15",
    name: "Sea Salt Spray Спрей с морской солью",
    brand: "Baxter of California",
    category: "styling",
    price: 35.00,
    description: "Текстурирующий спрей с морской солью для эффекта пляжных волн. Лёгкая фиксация.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    rating: 4.4,
    inStock: false,
    volume: "150 мл",
    tags: ["новинка"],
    preOrder: true,
    country: "США",
    composition: "Вода, морская соль, экстракт водорослей, магний, пантенол",
    application: "Распылите на влажные или сухие волосы. Сожмите пряди руками для эффекта волн."
  },
  {
    id: "16",
    name: "Бальзам после бритья",
    brand: "Proraso",
    category: "face",
    price: 24.50,
    description: "Увлажняющий бальзам с алоэ и зелёным чаем. Снимает раздражение и восстанавливает кожу.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e68e0?w=400&h=400&fit=crop",
    rating: 4.5,
    inStock: false,
    preOrder: true,
    volume: "100 мл",
    country: "Италия",
    composition: "Алоэ вера, экстракт зелёного чая, витамин Е, аллантоин, пантенол",
    application: "Нанесите на кожу сразу после бритья. Дайте впитаться."
  },
  {
    id: "17",
    name: "Воск для укладки матовый",
    brand: "Molton Brown",
    category: "styling",
    price: 48.00,
    oldPrice: 58.00,
    description: "Матовый воск сильной фиксации с экстрактом чёрного перца. Для стильных текстурных причёсок.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    rating: 4.7,
    inStock: true,
    volume: "75 мл",
    tags: ["хит"],
    country: "Великобритания",
    composition: "Пчелиный воск, каолиновая глина, экстракт чёрного перца, масло кокоса",
    application: "Разогрейте в ладонях и нанесите на сухие волосы. Придайте форму."
  },
  {
    id: "18",
    name: "Allure Homme Sport",
    brand: "Chanel",
    category: "perfume",
    price: 230.00,
    description: "Динамичный и свежий аромат для активного мужчины. Спортивная элегантность.",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=400&fit=crop",
    rating: 4.8,
    inStock: true,
    volume: "100 мл",
    tags: ["премиум", "новинка"],
    country: "Франция",
    composition: "Верхние ноты: мандарин, морские ноты. Средние: нероли, перец. Базовые: кедр, мускус, амбра",
    application: "Нанесите 1-2 пшика на точки пульса перед выходом."
  },
];
