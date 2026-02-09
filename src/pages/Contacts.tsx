import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";

const Contacts = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Контакты</h1>
          <p className="text-muted-foreground text-lg mb-12">Свяжитесь с нами любым удобным способом</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            { icon: MapPin, title: "Адрес", lines: ["г. Минск", "ул. Немига, 3, офис 205"] },
            { icon: Phone, title: "Телефон", lines: ["+375 (29) 123-45-67", "+375 (33) 987-65-43"] },
            { icon: Mail, title: "Email", lines: ["info@beu.by", "support@beu.by"] },
            { icon: Clock, title: "Режим работы", lines: ["Пн-Пт: 9:00 — 19:00", "Сб: 10:00 — 16:00"] },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 flex gap-4"
            >
              <div className="p-3 rounded-lg bg-primary/10 shrink-0 h-fit">
                <item.icon className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-display font-semibold mb-2">{item.title}</h3>
                {item.lines.map((line, j) => (
                  <p key={j} className="text-sm text-muted-foreground">{line}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass-card rounded-xl p-8">
          <h2 className="font-display text-2xl font-bold mb-6">Написать нам</h2>
          {sent ? (
            <div className="text-center py-8">
              <p className="text-primary font-display font-semibold text-lg">Сообщение отправлено! ✨</p>
              <p className="text-muted-foreground text-sm mt-2">Мы ответим в ближайшее время</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <textarea
                placeholder="Ваше сообщение"
                required
                rows={4}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity"
              >
                <Send size={18} /> Отправить
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default Contacts;
