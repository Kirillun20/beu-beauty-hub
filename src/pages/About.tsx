import { motion } from "framer-motion";
import { Award, Globe, Heart, Users, Crown, Handshake, ShieldCheck, TrendingUp } from "lucide-react";
import { brands } from "@/data/products";

const About = () => (
  <main className="pt-24 pb-20">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">О компании <span className="text-primary">BEU</span></h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Beauty of Europe — это премиальный интернет-магазин европейской косметики в Беларуси. 
          Мы привозим лучшие средства для ухода и стайлинга от ведущих европейских брендов, 
          чтобы вы могли выглядеть и чувствовать себя на высоте каждый день.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {[
          { icon: Globe, title: "Прямые поставки", desc: "Работаем напрямую с европейскими производителями и официальными дистрибьюторами" },
          { icon: Award, title: "100% оригинал", desc: "Гарантируем подлинность каждого продукта. Только сертифицированная продукция" },
          { icon: Users, title: "5000+ клиентов", desc: "Нам доверяют тысячи покупателей по всей Беларуси" },
          { icon: Heart, title: "Любовь к делу", desc: "Мы лично тестируем и отбираем каждый продукт в нашем ассортименте" },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <item.icon className="text-primary" size={24} />
            </div>
            <h3 className="font-display font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* World brands partnership */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="glass-card rounded-2xl p-10 mb-20 glow-box">
        <div className="flex items-center gap-3 mb-6">
          <Handshake size={28} className="text-primary" />
          <h2 className="font-display text-3xl font-bold">Мировые бренды-партнёры</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
          Мы гордимся сотрудничеством с ведущими мировыми брендами косметики и парфюмерии. 
          BEU является официальным представителем и авторизованным продавцом продукции в Беларуси, 
          что гарантирует 100% подлинность и актуальные коллекции.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {brands.map((brand, i) => (
            <motion.div key={brand} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-secondary/50 border border-border text-center hover:glow-border transition-all">
              <Crown size={18} className="mx-auto text-primary mb-2" />
              <p className="font-display font-semibold text-sm">{brand}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl font-bold mb-6">Наша история</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            BEU была основана в 2022 году командой энтузиастов, увлечённых мужской косметикой и европейской культурой ухода. 
            Мы заметили, что в Беларуси сложно найти качественные европейские бренды мужской косметики по разумным ценам.
          </p>
          <p>
            Сегодня BEU — это более 200 наименований от лучших европейских производителей: American Crew, Baxter of California, 
            Acqua di Parma, Molton Brown, Proraso, L'Occitane, Dior, Chanel и многих других. Мы являемся их официальными представителями в Беларуси.
          </p>
          <p>
            Мы не просто продаём косметику — мы помогаем нашим клиентам подобрать идеальные средства для ухода и стайлинга, 
            предоставляя экспертные консультации и персональные рекомендации.
          </p>
        </div>
      </div>
    </div>
  </main>
);

export default About;
