import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card mt-20">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-2xl font-bold mb-4">
            <span className="text-primary">BEU</span>
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Beauty of Europe — европейская косметика премиум-класса для мужчин в Беларуси. Официальный представитель ведущих мировых брендов.
          </p>
          <div className="flex gap-3">
            <a href="https://t.me/beu_by" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:glow-border transition-all">
              <Send size={16} />
            </a>
            <a href="https://instagram.com/beu_by" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:glow-border transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Каталог</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/catalog?cat=styling" className="hover:text-foreground transition-colors">Укладка волос</Link>
            <Link to="/catalog?cat=perfume" className="hover:text-foreground transition-colors">Парфюмерия</Link>
            <Link to="/catalog?cat=shampoo" className="hover:text-foreground transition-colors">Шампуни</Link>
            <Link to="/catalog?cat=face" className="hover:text-foreground transition-colors">Уход за лицом</Link>
            <Link to="/catalog?cat=beard" className="hover:text-foreground transition-colors">Уход за бородой</Link>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Информация</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">О нас</Link>
            <Link to="/delivery" className="hover:text-foreground transition-colors">Доставка и оплата</Link>
            <Link to="/contacts" className="hover:text-foreground transition-colors">Контакты</Link>
            <Link to="/barbers" className="hover:text-foreground transition-colors">Для барберов</Link>
            <Link to="/help" className="hover:text-foreground transition-colors">Помощь</Link>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Контакты</h4>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-primary shrink-0" />
              <span>г. Минск, Беларусь</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-primary shrink-0" />
              <a href="tel:+375291234567" className="hover:text-foreground transition-colors">+375 (29) 123-45-67</a>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-primary shrink-0" />
              <a href="mailto:info@beu.by" className="hover:text-foreground transition-colors">info@beu.by</a>
            </div>
            <div className="flex items-center gap-2">
              <Send size={14} className="text-primary shrink-0" />
              <a href="https://t.me/beu_by" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">@beu_by</a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border mt-10 pt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="text-center md:text-left">
            <p>© 2026 BEU — Beauty of Europe. Все права защищены.</p>
            <p className="mt-1">ИП Иванов И.И. УНП 123456789 | Свидетельство о регистрации от 01.01.2022</p>
          </div>
          <div className="flex gap-4">
            <Link to="/delivery" className="hover:text-foreground transition-colors">Условия доставки</Link>
            <span>·</span>
            <Link to="/help" className="hover:text-foreground transition-colors">Политика конфиденциальности</Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
