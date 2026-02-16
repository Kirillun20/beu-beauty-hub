import { Link } from "react-router-dom";
import { ArrowRight, Star, Truck, Shield, RotateCcw, Award, Globe, Users, TrendingUp, Heart, Sparkles, Crown, BarChart3, Target, Zap, Percent, Gift } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { products, categories, brands } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useEffect, useRef, useState } from "react";

const featuredProducts = products.filter(p => p.tags?.includes("хит") || p.tags?.includes("премиум")).slice(0, 8);
const newProducts = products.filter(p => p.tags?.includes("новинка")).slice(0, 4);
const stylingProducts = products.filter(p => p.category === "styling").slice(0, 4);
const perfumeProducts = products.filter(p => p.category === "perfume").slice(0, 4);
const beardProducts = products.filter(p => p.category === "beard" || p.category === "face").slice(0, 4);
const saleProducts = products.filter(p => p.oldPrice).slice(0, 4);

const stats = [
  { value: "500+", label: "Товаров", icon: Sparkles },
  { value: "8", label: "Брендов", icon: Crown },
  { value: "2000+", label: "Клиентов", icon: Users },
  { value: "99%", label: "Довольных", icon: Heart },
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

const CategorySection = ({ title, prods, slug }: { title: string; prods: typeof products; slug: string }) => (
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

const Index = () => {
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
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">Категории</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link to={`/catalog?cat=${cat.slug}`} className="flex flex-col items-center gap-3 p-6 rounded-xl glass-card hover:glow-border transition-all duration-300 group">
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="font-display text-sm font-medium text-center group-hover:text-primary transition-colors">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">{cat.count} товаров</span>
                </Link>
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
      <CategorySection title="💆 Уход" prods={beardProducts} slug="face" />

      {/* Competitor comparison chart - enhanced */}
      <section className="py-20 cosmic-gradient">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <BarChart3 size={16} /> Сравнительный анализ
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              BEU <span className="text-primary">vs</span> Конкуренты
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Почему мы лидируем по ключевым показателям</p>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-end gap-6 mb-6">
              <div className="flex items-center gap-2"><div className="w-4 h-3 rounded-sm" style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))" }} /><span className="text-sm font-medium">BEU</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-3 rounded-sm bg-muted-foreground/30" /><span className="text-sm text-muted-foreground">Конкуренты</span></div>
            </div>
            <div className="space-y-8">
              {competitorStats.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display font-semibold text-lg">{stat.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-display font-bold text-xl">{stat.us}%</span>
                      <span className="text-muted-foreground text-sm">vs {stat.them}%</span>
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

      {/* Advantages */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Почему выбирают BEU</h2>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {brands.map((brand, i) => (
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
        </div>
      </section>
    </main>
  );
};

export default Index;
