import { motion } from "framer-motion";
import { MessageCircle, Send, Phone, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "Как оформить заказ?", a: "Добавьте товары в корзину, перейдите к оформлению, заполните данные и выберите способ оплаты и доставки." },
  { q: "Какие способы оплаты доступны?", a: "Наличные при получении, банковская карта, ЕРИП, онлайн-оплата." },
  { q: "Сколько стоит доставка?", a: "Доставка бесплатна при заказе от 80 BYN. Самовывоз всегда бесплатный." },
  { q: "Как вернуть товар?", a: "Вы можете вернуть товар в течение 14 дней с момента получения. Свяжитесь с нами для оформления возврата." },
  { q: "Товары оригинальные?", a: "Да, мы работаем напрямую с европейскими производителями. Все товары сертифицированы." },
  { q: "Как работает система лояльности?", a: "За каждую покупку вы получаете баллы (1 BYN = 1 балл). Баллы можно использовать для скидок на будущие заказы." },
];

const Help = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<{ text: string; from: "user" | "bot" }[]>([
    { text: "Здравствуйте! Чем могу помочь? 😊", from: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setChatMessages((prev) => [...prev, { text: userMsg, from: "user" }]);
    setInput("");
    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let reply = "Спасибо за ваш вопрос! Наш менеджер свяжется с вами в ближайшее время. Также вы можете написать нам в Telegram.";
      if (lower.includes("доставк")) reply = "Доставка бесплатна при заказе от 80 BYN. Мы доставляем по всей Беларуси курьером или почтой.";
      else if (lower.includes("оплат")) reply = "Мы принимаем наличные, банковские карты, ЕРИП и онлайн-оплату.";
      else if (lower.includes("возврат")) reply = "Возврат возможен в течение 14 дней. Свяжитесь с нами для оформления.";
      else if (lower.includes("привет") || lower.includes("здрав")) reply = "Здравствуйте! Рады видеть вас! Чем могу помочь?";
      setChatMessages((prev) => [...prev, { text: reply, from: "bot" }]);
    }, 800);
  };

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Помощь</h1>
          <p className="text-muted-foreground text-lg mb-12">Ответы на вопросы и поддержка</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact cards */}
          <motion.a
            href="https://t.me/beu_support"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 flex items-center gap-6 hover:glow-border transition-all duration-300 group"
          >
            <div className="p-4 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <Send size={32} className="text-accent" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold mb-1">Telegram</h3>
              <p className="text-muted-foreground text-sm">@beu_support</p>
              <p className="text-xs text-muted-foreground mt-1">Отвечаем в течение 15 минут</p>
            </div>
          </motion.a>

          <motion.a
            href="tel:+375291234567"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-8 flex items-center gap-6 hover:glow-border transition-all duration-300 group"
          >
            <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Phone size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold mb-1">Телефон</h3>
              <p className="text-muted-foreground text-sm">+375 (29) 123-45-67</p>
              <p className="text-xs text-muted-foreground mt-1">Пн-Пт: 9:00 — 19:00</p>
            </div>
          </motion.a>
        </div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-8 flex items-center gap-2">
            <HelpCircle size={24} className="text-primary" /> Частые вопросы
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between font-display font-medium hover:text-primary transition-colors"
                >
                  {faq.q}
                  {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live Chat */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="font-display text-2xl font-bold mb-8 flex items-center gap-2">
            <MessageCircle size={24} className="text-primary" /> Онлайн-чат
          </h2>
          <div className="glass-card rounded-2xl overflow-hidden glow-box">
            <div className="h-80 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                      msg.from === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-4 flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Напишите сообщение..."
                className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={sendMessage}
                className="p-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Help;
