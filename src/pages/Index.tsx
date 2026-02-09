import { Link } from "react-router-dom";
import { ArrowRight, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { products, categories, brands } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const featuredProducts = products.filter(p => p.tags?.includes("хит") || p.tags?.includes("премиум")).slice(0, 4);
const newProducts = products.filter(p => p.tags?.includes("новинка"));

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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm mb-6">
              <Star size={14} className="fill-primary" /> Премиум косметика из Европы
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Красота<br />
              <span className="glow-text text-primary">Европы</span><br />
              для тебя
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Лучшие бренды мужской и женской косметики из Европы с доставкой по Беларуси. 
              Пасты для укладки, парфюмерия, уход за кожей.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity"
              >
                Перейти в каталог <ArrowRight size={18} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground font-display font-semibold hover:bg-secondary transition-colors"
              >
                О компании
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Доставка по РБ", desc: "Быстрая доставка по всей Беларуси" },
              { icon: Shield, title: "Оригинальная продукция", desc: "100% подлинные европейские бренды" },
              { icon: RotateCcw, title: "Гарантия возврата", desc: "14 дней на возврат товара" },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-6 rounded-xl glass-card"
              >
                <div className="p-3 rounded-lg bg-primary/10">
                  <f.icon className="text-primary" size={24} />
                </div>
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
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/catalog?cat=${cat.slug}`}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl glass-card hover:glow-border transition-all duration-300 group"
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="font-display text-sm font-medium text-center group-hover:text-primary transition-colors">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">{cat.count} товаров</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 cosmic-gradient">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Популярные товары</h2>
            <Link to="/catalog" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
              Все товары <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">Новинки</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands */}
      <section className="py-20 border-t">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">Наши бренды</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {brands.map(brand => (
              <div key={brand} className="px-8 py-4 rounded-xl glass-card font-display font-medium text-muted-foreground hover:text-foreground hover:glow-border transition-all duration-300 cursor-pointer">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
