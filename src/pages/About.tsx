import { motion } from "framer-motion";
import { Award, Globe, Heart, Users, Crown, Handshake, ShieldCheck, TrendingUp, CheckCircle2, FileCheck, Star, Package, Truck, Lock } from "lucide-react";
import { useAllProducts } from "@/hooks/useAllProducts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const trustPoints = [
  { icon: ShieldCheck, title: "Гарантия подлинности", desc: "Каждый товар проходит проверку. Возврат, если что-то не так — без вопросов." },
  { icon: FileCheck, title: "Все сертификаты", desc: "Документы соответствия ЕС и Беларуси. Можем предоставить по запросу." },
  { icon: Truck, title: "Прозрачная доставка", desc: "Курьер, Европочта, самовывоз. Сроки и цены — на этапе оформления." },
  { icon: Lock, title: "Безопасные платежи", desc: "ЕРИП, карты, наложенный платёж. Деньги защищены платёжной системой." },
];

const stats = [
  { value: "5000+", label: "Довольных клиентов" },
  { value: "4 года", label: "На рынке Беларуси" },
  { value: "200+", label: "Наименований" },
  { value: "98%", label: "Положительных отзывов" },
];

const About = () => {
  const { products } = useAllProducts();
  const [reviewsCount, setReviewsCount] = useState(0);

  useEffect(() => {
    supabase.from("reviews").select("id", { count: "exact", head: true }).then(({ count }) => setReviewsCount(count || 0));
  }, []);

  const liveBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort((a, b) => a.localeCompare(b, "ru"));

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs mb-6">
            <Star size={12} className="fill-primary" /> Официальный представитель европейских брендов
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">О компании <span className="text-primary">BEU</span></h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Beauty of Europe — премиальный интернет-магазин европейской мужской косметики в Беларуси.
            Мы привозим лучшие средства от ведущих брендов напрямую и продаём только сертифицированную продукцию.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-16">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-4 sm:p-6 text-center glow-border">
              <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary glow-text">{s.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {trustPoints.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 hover:glow-border transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="text-primary" size={24} />
              </div>
              <h3 className="font-display font-semibold mb-2 text-sm sm:text-base">{item.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Promise */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="glass-card rounded-2xl p-6 sm:p-10 mb-16 glow-box">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3">
            <Award size={28} className="text-primary" /> Наше обещание
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: "100% оригинал", d: "Если усомнитесь в подлинности — вернём деньги в двойном размере." },
              { t: "14 дней на возврат", d: "Возврат товара без объяснения причин, при сохранении товарного вида." },
              { t: "Помощь в подборе", d: "Бесплатная консультация по уходу — напишите нам в чат или Telegram." },
            ].map((p) => (
              <div key={p.t} className="flex items-start gap-3">
                <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-display font-semibold mb-1">{p.t}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Brands */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="glass-card rounded-2xl p-6 sm:p-10 mb-16">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <Handshake size={26} className="text-primary" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Бренды-партнёры</h2>
          </div>
          {liveBrands.length === 0 ? (
            <p className="text-sm text-muted-foreground">Бренды появятся после добавления первых товаров в каталог.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {liveBrands.map((brand, i) => (
                <motion.div key={brand} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                  className="p-4 rounded-xl bg-secondary/50 border border-border text-center hover:glow-border transition-all">
                  <Crown size={16} className="mx-auto text-primary mb-2" />
                  <p className="font-display font-semibold text-sm">{brand}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Story */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">Наша история</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
            <p>
              BEU была основана командой энтузиастов мужского ухода в 2022 году. Нам не хватало в Беларуси качественной европейской косметики
              по честным ценам — и мы решили построить магазин, в котором будем покупать сами.
            </p>
            <p>
              Сегодня у нас более 200 наименований от лучших европейских производителей, тысячи довольных клиентов и более <span className="text-primary font-semibold">{reviewsCount}</span> отзывов.
              Мы являемся официальными представителями и работаем напрямую — без посредников и накруток.
            </p>
            <p>
              Мы не просто продаём косметику — помогаем подобрать средства под ваш тип кожи, волос и стиль жизни.
              Напишите нам в чат или Telegram — наши консультанты ответят бесплатно.
            </p>
          </div>
        </div>

        {/* Legal block */}
        <div className="max-w-3xl mx-auto glass-card rounded-2xl p-5 sm:p-6 text-xs sm:text-sm text-muted-foreground space-y-2 border-l-4 border-primary/40">
          <p className="font-display font-semibold text-foreground mb-2">Юридическая информация</p>
          <p>ИП Иванов И.И., УНП 123456789</p>
          <p>Свидетельство о государственной регистрации от 01.01.2022</p>
          <p>Зарегистрировано в Торговом реестре Республики Беларусь</p>
          <p>Юр. адрес: г. Минск, ул. Немига 3, офис 12</p>
        </div>
      </div>
    </main>
  );
};

export default About;
