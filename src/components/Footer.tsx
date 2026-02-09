import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t bg-card mt-20">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display text-xl font-bold mb-4">
            <span className="text-primary">BEU</span>
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Beauty of Europe — европейская косметика премиум-класса для мужчин в Беларуси.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Каталог</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/catalog?cat=styling" className="hover:text-foreground transition-colors">Укладка волос</Link>
            <Link to="/catalog?cat=perfume" className="hover:text-foreground transition-colors">Парфюмерия</Link>
            <Link to="/catalog?cat=shampoo" className="hover:text-foreground transition-colors">Шампуни</Link>
            <Link to="/catalog?cat=face" className="hover:text-foreground transition-colors">Уход за лицом</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Информация</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">О нас</Link>
            <Link to="/delivery" className="hover:text-foreground transition-colors">Доставка и оплата</Link>
            <Link to="/contacts" className="hover:text-foreground transition-colors">Контакты</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Контакты</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>📍 Минск, Беларусь</p>
            <p>📞 +375 (29) 123-45-67</p>
            <p>✉️ info@beu.by</p>
          </div>
        </div>
      </div>
      <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
        © 2026 BEU — Beauty of Europe. Все права защищены.
      </div>
    </div>
  </footer>
);

export default Footer;
