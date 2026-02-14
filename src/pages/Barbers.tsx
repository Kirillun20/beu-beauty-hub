import { motion } from "framer-motion";
import { Scissors, Package, TrendingUp, Shield, Percent, Phone, Send, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const wholesaleTiers = [
  { min: 5, discount: 10, label: "от 5 шт." },
  { min: 15, discount: 15, label: "от 15 шт." },
  { min: 30, discount: 20, label: "от 30 шт." },
  { min: 50, discount: 25, label: "от 50 шт." },
];

const advantages = [
  { icon: Percent, title: "Скидки до 25%", desc: "Оптовые цены для профессионалов. Чем больше заказ — тем выше скидка." },
  { icon: Package, title: "Широкий ассортимент", desc: "Более 500 позиций от ведущих европейских брендов для барберов." },
  { icon: TrendingUp, title: "Стабильные поставки", desc: "Гарантируем наличие товара и регулярные поставки для вашего бизнеса." },
  { icon: Shield, title: "Сертификаты", desc: "Предоставляем все документы для легального использования в вашем салоне." },
];

const proProducts = products.filter(p => ["styling", "beard", "shampoo"].includes(p.category)).slice(0, 8);

const Barbers = () => {
  const { addToCart } = useCart();
  const [qty, setQty] = useState<Record<string, number>>({});

  const getQty = (id: string) => qty[id] || 5;
  const getDiscount = (q: number) => {
    for (let i = wholesaleTiers.length - 1; i >= 0; i--) {
      if (q >= wholesaleTiers[i].min) return wholesaleTiers[i].discount;
    }
    return 0;
  };

  const addBulk = (product: any, amount: number) => {
    for (let i = 0; i < amount; i++) addToCart(product);
  };

  return (
    <main className="pt-24 pb-20">
      {/* Hero */}
      <section className="py-20 cosmic-gradient">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm mb-6">
              <Scissors size={14} /> Для профессионалов
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Оптовые закупки для <span className="glow-text text-primary">барберов</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Профессиональная европейская косметика по оптовым ценам. Скидки до 25% для барбершопов и салонов.
            </p>
            <a href="#products" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity">
              Смотреть каталог <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Почему барберы выбирают BEU</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center hover:glow-border transition-all duration-300"
              >
                <div className="p-4 rounded-xl bg-primary/10 inline-block mb-4">
                  <a.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">{a.title}</h3>
                <p className="text-muted-foreground text-sm">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="py-20 cosmic-gradient">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Оптовые скидки</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {wholesaleTiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center hover:glow-border transition-all duration-300"
              >
                <div className="font-display text-4xl font-bold glow-text text-primary mb-2">-{tier.discount}%</div>
                <p className="text-muted-foreground text-sm">{tier.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products for barbers */}
      <section id="products" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold mb-12">Товары для барберов</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {proProducts.map((product) => {
              const q = getQty(product.id);
              const disc = getDiscount(q);
              const finalPrice = product.price * (1 - disc / 100);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-xl overflow-hidden hover:glow-border transition-all duration-300"
                >
                  <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-secondary">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </Link>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                    <h3 className="font-display font-semibold text-sm mb-3 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-display font-bold text-lg text-primary">{finalPrice.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground">BYN</span>
                      {disc > 0 && <span className="text-xs line-through text-muted-foreground">{product.price.toFixed(2)}</span>}
                      {disc > 0 && <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">-{disc}%</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={q}
                        onChange={(e) => setQty({ ...qty, [product.id]: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="w-16 px-2 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <button
                        onClick={() => addBulk(product, q)}
                        className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-opacity"
                      >
                        В корзину
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link to="/catalog" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border font-display font-semibold hover:bg-secondary transition-colors">
              Весь каталог <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 cosmic-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center glass-card rounded-2xl p-12 glow-box max-w-3xl mx-auto"
          >
            <h2 className="font-display text-3xl font-bold mb-4">Стать партнёром</h2>
            <p className="text-muted-foreground mb-8">Свяжитесь с нами для обсуждения условий сотрудничества</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://t.me/beu_wholesale" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity">
                <Send size={18} /> Написать в Telegram
              </a>
              <a href="tel:+375291234567"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border font-display font-semibold hover:bg-secondary transition-colors">
                <Phone size={18} /> Позвонить
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Barbers;
