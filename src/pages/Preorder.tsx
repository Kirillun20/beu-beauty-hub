import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Clock, ShieldCheck, Tag, Package, MapPin, Sparkles, CheckCircle2, Quote, ArrowRight, Truck, HelpCircle } from "lucide-react";
import heroImg from "@/assets/preorder-hero.jpg";

const steps = [
  { icon: Package, title: "Оформляете заказ", desc: "Выбираете товар с меткой «Под заказ» и оформляете как обычно." },
  { icon: ShieldCheck, title: "Подтверждаем детали", desc: "Связываемся, уточняем сроки и фиксируем цену — она не меняется." },
  { icon: Plane, title: "Везём из Европы", desc: "Товар едет напрямую от поставщика вместе с ближайшей поставкой." },
  { icon: Truck, title: "Доставляем вам", desc: "Как только посылка приходит — сразу отправляем курьером или почтой." },
];

const facts = [
  { icon: Clock, title: "7–10 дней", desc: "Средний срок доставки под заказ. Максимум — 14–16 дней." },
  { icon: Tag, title: "Фиксированная цена", desc: "Стоимость не меняется — то, что вы видите, то и платите." },
  { icon: ShieldCheck, title: "Оригинал 100%", desc: "Прямые поставки от европейских брендов, без подделок." },
  { icon: Sparkles, title: "Без предоплаты*", desc: "Можно оплатить при получении или после подтверждения заказа." },
];

const reviews = [
  { name: "Артём", city: "Минск", text: "Заказал воск, которого нигде не было. Пришёл за 9 дней, менеджер держал в курсе. Всё честно, как и обещали.", rating: 5 },
  { name: "Кирилл", city: "Гомель", text: "Сначала переживал — «под заказ» звучало долго. Оказалось, 8 дней и парфюм у меня. Оригинал, коробка запечатана.", rating: 5 },
  { name: "Дмитрий", city: "Брест", text: "Цена не выросла ни на копейку, хотя товар везли из Италии. Ребята молодцы, буду брать ещё.", rating: 5 },
  { name: "Влад", city: "Витебск", text: "Барберский набор пришёл раньше срока — за 6 дней. Всё в идеальном виде, рекомендую.", rating: 5 },
];

const faqs = [
  { q: "Что вообще значит «под заказ»?", a: "Это товар, которого сейчас нет на складе в Беларуси. Мы заказываем его напрямую у европейского поставщика вместе с ближайшей поставкой и доставляем вам." },
  { q: "Почему не всегда есть в наличии?", a: "Мужская косметика из Европы приходит партиями. Некоторые бренды разбирают быстрее, чем они успевают доехать. Чтобы вы не ждали месяцами — мы включили режим «Под заказ»." },
  { q: "Сколько ждать?", a: "В среднем 7–10 дней. В редких случаях (праздники, задержки на таможне) — до 14–16 дней. Мы всегда предупреждаем заранее." },
  { q: "Может ли измениться цена?", a: "Нет. Цена, которую вы видите на сайте, фиксируется в момент оформления и не меняется, даже если курс или закупочная стоимость выросли." },
  { q: "Нужно ли платить сразу?", a: "Нет. Мы обсуждаем удобный способ оплаты при подтверждении заказа — можно оплатить и после прибытия товара." },
];

const Preorder = () => (
  <main className="pt-20 pb-16 min-h-screen">
    {/* HERO */}
    <section className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-500 border border-amber-500/30 mb-4">
            <Clock size={14} /> Формат «Под заказ»
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Быстро, честно и <span className="text-primary">без сюрпризов</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Некоторые товары не успевают доехать из Европы — их разбирают быстрее, чем мы успеваем пополнить склад. Мы придумали формат «Под заказ», чтобы вы могли купить нужное средство, не ожидая месяцами.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/catalog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity">
              К товарам <ArrowRight size={18} />
            </Link>
            <a href="#faq" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-display font-semibold hover:bg-secondary transition-colors">
              Частые вопросы
            </a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
          <div className="glass-card rounded-3xl overflow-hidden glow-border">
            <img src={heroImg} alt="Доставка косметики под заказ из Европы" width={1600} height={900} className="w-full h-auto" />
          </div>
          <div className="hidden md:flex absolute -bottom-6 -left-6 glass-card rounded-2xl p-4 items-center gap-3 border">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="font-display font-bold text-lg leading-none">98%</p>
              <p className="text-xs text-muted-foreground mt-1">заказов в срок</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* FACTS */}
    <section className="container mx-auto px-4 mt-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {facts.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl p-5 border hover:glow-border transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-3">
              <f.icon size={20} />
            </div>
            <h3 className="font-display font-bold text-lg mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">* Условия оплаты оговариваются индивидуально при подтверждении заказа.</p>
    </section>

    {/* HOW IT WORKS */}
    <section className="container mx-auto px-4 mt-20">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Как это работает</h2>
        <p className="text-muted-foreground">Четыре простых шага — от клика на «Заказать» до получения посылки в руки.</p>
      </div>

      <div className="relative">
        <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 border text-center"
            >
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-primary/15" />
                <div className="absolute inset-0 flex items-center justify-center text-primary">
                  <s.icon size={26} />
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{i + 1}</span>
              </div>
              <h3 className="font-display font-bold mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ROUTE MAP */}
    <section className="container mx-auto px-4 mt-20">
      <div className="glass-card rounded-3xl p-6 md:p-10 border relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_50%,hsl(var(--primary)/0.25),transparent_40%),radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.25),transparent_40%)]" />
        <div className="relative grid md:grid-cols-3 gap-6 items-center">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-1"><MapPin size={16} /> Отправка</div>
            <h3 className="font-display text-2xl font-bold">Европа 🇪🇺</h3>
            <p className="text-sm text-muted-foreground mt-1">Италия, Германия, Испания, Польша</p>
          </div>
          <div className="flex items-center justify-center">
            <motion.div initial={{ x: -40, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="flex items-center gap-2 text-primary">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
              <Plane size={28} className="rotate-45" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
            </motion.div>
          </div>
          <div className="text-center md:text-right">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-1"><MapPin size={16} /> Получение</div>
            <h3 className="font-display text-2xl font-bold">Беларусь 🇧🇾</h3>
            <p className="text-sm text-muted-foreground mt-1">По всей стране — курьером или почтой</p>
          </div>
        </div>
      </div>
    </section>

    {/* REVIEWS */}
    <section className="container mx-auto px-4 mt-20">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Что говорят клиенты</h2>
        <p className="text-muted-foreground">Отзывы тех, кто уже заказывал товары в формате «Под заказ».</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl p-5 border flex flex-col"
          >
            <Quote className="text-primary mb-2" size={20} />
            <p className="text-sm leading-relaxed mb-4 flex-1">{r.text}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-sm">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.city}</p>
              </div>
              <div className="flex gap-0.5 text-amber-500">
                {Array.from({ length: r.rating }).map((_, k) => <span key={k}>★</span>)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* FAQ */}
    <section id="faq" className="container mx-auto px-4 mt-20 max-w-3xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-3">
          <HelpCircle size={14} /> FAQ
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold">Частые вопросы</h2>
      </div>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <motion.details
            key={f.q}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl border group"
          >
            <summary className="cursor-pointer p-5 font-display font-semibold flex items-center justify-between gap-4">
              {f.q}
              <span className="text-primary transition-transform group-open:rotate-45 text-xl leading-none">+</span>
            </summary>
            <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
          </motion.details>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="container mx-auto px-4 mt-20">
      <div className="glass-card rounded-3xl p-8 md:p-12 border glow-border text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-amber-500/10" />
        <div className="relative">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Готовы попробовать?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            В каталоге более сотни товаров под заказ — редкие бренды, лимитированные линейки и всё, чего вы давно искали.
          </p>
          <Link to="/catalog" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity">
            Перейти в каталог <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  </main>
);

export default Preorder;
