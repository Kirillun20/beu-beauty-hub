import { motion } from "framer-motion";
import { Truck, Clock, CreditCard, MapPin, Package, RotateCcw } from "lucide-react";

const deliveryMethods = [
  { icon: Truck, title: "Курьерская доставка", desc: "По Минску — 1-2 дня. По Беларуси — 2-5 дней.", price: "Бесплатно от 100 BYN" },
  { icon: Package, title: "Почта (Белпочта)", desc: "Доставка в любое отделение Белпочты по Беларуси.", price: "5-8 BYN" },
  { icon: MapPin, title: "Самовывоз", desc: "Забрать заказ из нашего офиса в Минске.", price: "Бесплатно" },
];

const paymentMethods = [
  { title: "Банковская карта", desc: "Visa, Mastercard, Белкарт — оплата онлайн" },
  { title: "ЕРИП", desc: "Оплата через систему ЕРИП" },
  { title: "Наличные", desc: "Оплата курьеру при доставке" },
];

const Delivery = () => (
  <main className="pt-24 pb-20">
    <div className="container mx-auto px-4 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Доставка и оплата</h1>
        <p className="text-muted-foreground text-lg mb-12">Удобные способы доставки и оплаты по всей Беларуси</p>
      </motion.div>

      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
          <Truck className="text-primary" size={24} /> Способы доставки
        </h2>
        <div className="space-y-4">
          {deliveryMethods.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-6 glass-card rounded-xl"
            >
              <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                <m.icon className="text-primary" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold mb-1">{m.title}</h3>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </div>
              <span className="text-sm text-primary font-medium shrink-0">{m.price}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
          <CreditCard className="text-primary" size={24} /> Способы оплаты
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((m, i) => (
            <div key={i} className="p-6 glass-card rounded-xl">
              <h3 className="font-display font-semibold mb-2">{m.title}</h3>
              <p className="text-sm text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-xl p-8">
        <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-3">
          <RotateCcw className="text-primary" size={24} /> Возврат и обмен
        </h2>
        <div className="text-muted-foreground space-y-3">
          <p>Вы можете вернуть товар надлежащего качества в течение 14 дней с момента получения.</p>
          <p>Товар должен быть в оригинальной упаковке, без следов использования.</p>
          <p>Для оформления возврата свяжитесь с нами по телефону или email.</p>
        </div>
      </section>
    </div>
  </main>
);

export default Delivery;
