import { Link } from "react-router-dom";
import { ArrowRight, Star, Truck, Shield, RotateCcw, Award, Globe, Users, TrendingUp, Heart, Sparkles, Crown, BarChart3, Target, Zap, Percent, Gift, Quote, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { categories } from "@/data/products";
import { useAllProducts } from "@/hooks/useAllProducts";
import ProductCard from "@/components/ProductCard";
import { useEffect, useMemo, useRef, useState } from "react";

const baseStats = [
  { value: "500+", label: "Товаров", icon: Sparkles, key: "products" },
  { value: "8", label: "Брендов", icon: Crown, key: "brands" },
  { value: "2000+", label: "Клиентов", icon: Users, key: "clients" },
  { value: "99%", label: "Довольных", icon: Heart, key: "happy" },
];

const advantages = [
  { icon: Globe, title: "Прямые поставки", desc: "Работаем напрямую с европейскими производителями без посредников." },
  { icon: Award, title: "Экспертный подбор", desc: "Тестируем каждый продукт на качество и эффективность." },
  { icon: TrendingUp, title: "Трендовые продукты", desc: "Первыми привозим новинки мужского ухода в Беларусь." },
  { icon: Shield, title: "Сертификация", desc: "Все товары сертифицированы по стандартам ЕС и РБ." },
];

const competitorStats = [
  { label: "Ассортимент", us: 95, them: 40 },
  { label: "Оригинальность", us: 100, them: 65 },
  { label: "Цены", us: 85, them: 55 },
  { label: "Доставка", us: 92, them: 50 },
  { label: "Сервис", us: 98, them: 45 },
];

const CountUp = ({ end, suffix = "" }: { end: string; suffix?: string }) => {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const num = parseInt(end.replace(/\D/g, ""));
    if (!num) { setDisplay(end); return; }
    let start = 0;
    const duration = 2000;
    const step = (ts: number) => {
      start = start || ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * num).toString());
      if (progress < 1) requestAnimationFrame(step);
      else setDisplay(end);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { requestAnimationFrame(step); observer.disconnect(); }
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{display}{suffix}</span>;
};

const AnimatedBar = ({ value, delay, color }: { value: number; delay: number; color: string }) => {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setTimeout(() => setWidth(value), delay * 150); observer.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} className="h-4 rounded-full bg-secondary/60 overflow-hidden relative">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 1.2, ease: "easeOut", delay: delay * 0.15 }}
        className="h-full rounded-full relative overflow-hidden"
        style={{ background: color }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </motion.div>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">{width}%</span>
    </div>
  );
};

const CategorySection = ({ title, prods, slug }: { title: string; prods: any[]; slug: string }) => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold">{title}</h2>
        <Link to={`/catalog?cat=${slug}`} className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
          Все <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {prods.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  </section>
);

const storeReviews = [
  { name: "Алексей М.", rating: 5, text: "Заказывал помаду Reuzel — оригинал, доставили за 2 дня. Лучший магазин мужской косметики в РБ!", avatar: "А", date: "2 дня назад" },
  { name: "Дмитрий К.", rating: 5, text: "Большой выбор, адекватные цены. Менеджеры помогли подобрать средство для укладки. Рекомендую!", avatar: "Д", date: "1 неделю назад" },
  { name: "Максим П.", rating: 5, text: "Уже 3-й раз заказываю. Всё приходит быстро и в оригинальной упаковке. Сервис на высоте!", avatar: "М", date: "2 недели назад" },
  { name: "Игорь С.", rating: 4, text: "Отличный ассортимент Uppercut Deluxe. Нашёл то, что давно искал. Буду постоянным клиентом.", avatar: "И", date: "3 недели назад" },
  { name: "Владислав Р.", rating: 5, text: "Баллы лояльности — приятный бонус. Накопил на хорошую скидку за пару заказов!", avatar: "В", date: "1 месяц назад" },
  { name: "Павел Н.", rating: 5, text: "Европочтой пришло всё в целости. Упаковка аккуратная, вложили пробник. Спасибо BEU!", avatar: "П", date: "1 месяц назад" },
];

const StoreReviews = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % storeReviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <MessageSquare size={16} /> Отзывы клиентов
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Что говорят о <span className="glow-text text-primary">BEU</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Нам доверяют тысячи клиентов по всей Беларуси</p>
        </motion.div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-8 mb-12 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={20} className="fill-gold text-gold" />
              ))}
            </div>
            <span className="font-display font-bold text-lg">4.9</span>
            <span className="text-muted-foreground text-sm">из 5</span>
          </div>
          <div className="h-6 w-px bg-border hidden md:block" />
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Users size={16} className="text-primary" />
            <span><span className="text-foreground font-semibold">2000+</span> довольных клиентов</span>
          </div>
          <div className="h-6 w-px bg-border hidden md:block" />
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Shield size={16} className="text-primary" />
            <span>Проверенные отзывы</span>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeReviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative glass-card rounded-2xl p-6 transition-all duration-500 ${
                activeIndex === i ? "glow-border scale-[1.02]" : "hover:glow-border"
              }`}
            >
              {/* Quote icon */}
              <Quote size={32} className="absolute top-4 right-4 text-primary/10" />
              
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className={s <= review.rating ? "fill-gold text-gold" : "text-muted-foreground/30"} />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground leading-relaxed mb-6 text-sm">{review.text}</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="font-display font-bold text-primary text-sm">{review.avatar}</span>
                </div>
                <div>
                  <p className="font-display font-semibold text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
                <div className="ml-auto">
                  <div className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-semibold flex items-center gap-1">
                    <Shield size={10} /> Проверено
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Carousel dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {storeReviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === i ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const { products } = useAllProducts();
  const featuredProducts = useMemo(() => products.filter(p => p.tags?.includes("хит") || p.tags?.includes("премиум")).slice(0, 8), [products]);
  const newProducts = useMemo(() => products.filter(p => p.tags?.includes("новинка")).slice(0, 4), [products]);
  const stylingProducts = useMemo(() => products.filter(p => p.category === "styling").slice(0, 4), [products]);
  const hairProducts = useMemo(() => products.filter(p => p.category === "hair").slice(0, 4), [products]);
  const perfumeProducts = useMemo(() => products.filter(p => p.category === "perfume").slice(0, 4), [products]);
  const beardProducts = useMemo(() => products.filter(p => p.category === "beard").slice(0, 4), [products]);
  const bodyProducts = useMemo(() => products.filter(p => p.category === "body").slice(0, 4), [products]);
  const otherProducts = useMemo(() => products.filter(p => p.category === "other").slice(0, 4), [products]);
  const saleProducts = useMemo(() => products.filter(p => p.oldPrice).slice(0, 4), [products]);

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm mb-6">
              <Star size={14} className="fill-primary" /> Премиум косметика из Европы
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Красота<br /><span className="glow-text text-primary">Европы</span><br />для тебя
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Лучшие бренды мужской и женской косметики из Европы с доставкой по Беларуси.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity">
                Перейти в каталог <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground font-display font-semibold hover:bg-secondary transition-colors">
                О нас
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats + Features combined block */}
      <section className="py-16 cosmic-gradient">
        <div className="container mx-auto px-4 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 glass-card rounded-xl hover:glow-border transition-all duration-300">
                <s.icon size={28} className="mx-auto text-primary mb-3" />
                <div className="font-display text-3xl md:text-4xl font-bold glow-text text-primary mb-1"><CountUp end={s.value} /></div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: "Доставка по РБ", desc: "Быстрая доставка по всей Беларуси" },
              { icon: Shield, title: "Оригинальная продукция", desc: "100% подлинные европейские бренды" },
              { icon: RotateCcw, title: "Гарантия возврата", desc: "14 дней на возврат товара" },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-6 rounded-xl glass-card hover:glow-border transition-all duration-300">
                <div className="p-3 rounded-lg bg-primary/10"><f.icon className="text-primary" size={24} /></div>
                <div>
                  <h3 className="font-display font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Sparkles size={16} /> Категории
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Что вас интересует?</h2>
            <p className="text-muted-foreground">Выберите категорию или подкатегорию для быстрого перехода</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group relative glass-card rounded-2xl p-6 hover:glow-border transition-all duration-300 overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors blur-2xl" />
                <Link to={`/catalog?cat=${cat.slug}`} className="relative flex items-center gap-3 mb-4">
                  <span className="text-4xl drop-shadow-lg">{cat.icon}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold group-hover:text-primary transition-colors">{cat.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{cat.subcategories.length} подкатегорий</p>
                  </div>
                  <ArrowRight size={18} className="ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
                <div className="flex flex-wrap gap-1.5 relative">
                  {cat.subcategories.slice(0, 6).map((sub) => (
                    <Link
                      key={sub.slug}
                      to={`/catalog?cat=${cat.slug}&sub=${sub.slug}`}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-secondary/80 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                  {cat.subcategories.length > 6 && (
                    <Link
                      to={`/catalog?cat=${cat.slug}`}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium text-primary hover:underline"
                    >
                      +{cat.subcategories.length - 6} ещё
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-20 cosmic-gradient">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Популярные товары</h2>
            <Link to="/catalog" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">Все товары <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* Promotions */}
      {saleProducts.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-semibold mb-4">
                <Percent size={16} /> Специальные предложения
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">🔥 Акции</h2>
              <p className="text-muted-foreground mt-2">Лучшие цены на премиум-товары</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>
      )}

      {/* By Category sections */}
      <CategorySection title="✂️ Укладка волос" prods={stylingProducts} slug="styling" />
      <div className="cosmic-gradient">
        <CategorySection title="🌟 Парфюмерия" prods={perfumeProducts} slug="perfume" />
      </div>
      <CategorySection title="🧔 Борода и Усы" prods={beardProducts} slug="beard" />

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="py-20 cosmic-gradient">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">🆕 Новинки</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>
      )}

      {/* Store Reviews (перед сравнительным анализом) */}
      <StoreReviews />

      {/* Advantages — Почему выбирают BEU (перед сравнительным анализом) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Heart size={16} /> Почему мы
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Почему выбирают <span className="glow-text text-primary">BEU</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Мы создаём лучший опыт покупки европейской косметики в Беларуси</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advantages.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-8 glass-card rounded-2xl hover:glow-border transition-all duration-300 group">
                <div className="flex items-start gap-5">
                  <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                    <a.icon size={28} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold mb-2">{a.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor comparison chart — redesigned */}
      <section className="py-20 cosmic-gradient relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <BarChart3 size={16} /> Сравнительный анализ
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              BEU <span className="text-muted-foreground/60 font-normal">vs</span> <span className="text-muted-foreground">Конкуренты</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Объективные цифры, по которым мы превосходим рынок</p>
          </motion.div>

          {/* Overall score cards */}
          <div className="grid grid-cols-2 max-w-2xl mx-auto gap-4 mb-12">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="relative glass-card rounded-2xl p-6 text-center glow-border overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
              <div className="relative">
                <p className="text-xs font-display font-semibold text-primary mb-2 uppercase tracking-widest">BEU</p>
                <div className="font-display text-5xl font-bold glow-text text-primary mb-1">
                  {Math.round(competitorStats.reduce((a, s) => a + s.us, 0) / competitorStats.length)}<span className="text-2xl">%</span>
                </div>
                <p className="text-xs text-muted-foreground">средний показатель</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6 text-center opacity-70">
              <p className="text-xs font-display font-semibold text-muted-foreground mb-2 uppercase tracking-widest">Конкуренты</p>
              <div className="font-display text-5xl font-bold text-muted-foreground mb-1">
                {Math.round(competitorStats.reduce((a, s) => a + s.them, 0) / competitorStats.length)}<span className="text-2xl">%</span>
              </div>
              <p className="text-xs text-muted-foreground">средний показатель</p>
            </motion.div>
          </div>

          <div className="max-w-3xl mx-auto glass-card rounded-2xl p-6 md:p-10">
            <div className="space-y-7">
              {competitorStats.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-semibold">{stat.label}</span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-primary font-display font-bold">{stat.us}%</span>
                      <span className="text-muted-foreground/60">vs</span>
                      <span className="text-muted-foreground">{stat.them}%</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">+{stat.us - stat.them}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <AnimatedBar value={stat.us} delay={i} color="linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))" />
                    <AnimatedBar value={stat.them} delay={i + 0.5} color="hsl(var(--muted-foreground) / 0.25)" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Дополнительные категории внизу */}
      {hairProducts.length > 0 && <CategorySection title="💇 Волосы" prods={hairProducts} slug="hair" />}
      {bodyProducts.length > 0 && (
        <div className="cosmic-gradient">
          <CategorySection title="🧖 Лицо и Тело" prods={bodyProducts} slug="body" />
        </div>
      )}
      {otherProducts.length > 0 && <CategorySection title="💫 Другое / Для женщин" prods={otherProducts} slug="other" />}


      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center glass-card rounded-2xl p-12 md:p-16 glow-box">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Готовы к <span className="glow-text text-primary">обновлению</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">Откройте для себя мир премиум косметики из Европы.</p>
            <Link to="/catalog" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-lg hover:opacity-90 transition-opacity">
              Начать покупки <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brands - enhanced */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Наши бренды-партнёры</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Мы сотрудничаем с ведущими мировыми брендами и являемся их официальными представителями</p>
          </motion.div>
          {(() => {
            const liveBrands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort((a, b) => a.localeCompare(b, "ru"));
            if (liveBrands.length === 0) return <p className="text-center text-sm text-muted-foreground">Бренды появятся, когда добавите первые товары в админ-панели.</p>;
            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {liveBrands.map((brand, i) => (
                  <motion.div key={brand} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <Link to={`/catalog?brand=${encodeURIComponent(brand)}`}
                      className="block p-6 rounded-2xl glass-card hover:glow-border transition-all duration-300 text-center group hover:scale-105 hover:-translate-y-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                        <Crown size={20} className="text-primary" />
                      </div>
                      <p className="font-display font-semibold group-hover:text-primary transition-colors">{brand}</p>
                      <p className="text-xs text-muted-foreground mt-1">Смотреть продукцию →</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>
    </main>
  );
};

export default Index;
