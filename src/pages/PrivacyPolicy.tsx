import { motion } from "framer-motion";

const PrivacyPolicy = () => (
  <main className="pt-24 pb-20">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-bold mb-8">Политика конфиденциальности</h1>
        <div className="glass-card rounded-2xl p-8 space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Общие положения</h2>
            <p>Настоящая политика конфиденциальности описывает порядок сбора, использования и защиты персональных данных пользователей интернет-магазина BEU (Beauty of Europe).</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. Сбор информации</h2>
            <p>Мы собираем следующие данные: ФИО, номер телефона, адрес электронной почты, адрес доставки. Данные собираются при регистрации, оформлении заказа и обращении в службу поддержки.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. Использование данных</h2>
            <p>Персональные данные используются для: обработки и доставки заказов, связи с покупателем, начисления баллов лояльности, улучшения качества обслуживания.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Защита данных</h2>
            <p>Мы применяем современные технологии шифрования и защиты данных. Доступ к персональной информации ограничен. Данные не передаются третьим лицам без согласия пользователя, за исключением случаев, предусмотренных законодательством Республики Беларусь.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Файлы cookie</h2>
            <p>Сайт использует файлы cookie для обеспечения корректной работы, сохранения настроек пользователя и анализа посещаемости.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Права пользователей</h2>
            <p>Вы имеете право запросить доступ к своим данным, их изменение или удаление, обратившись на info@beu.by.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">7. Контакты</h2>
            <p>По вопросам конфиденциальности: info@beu.by, +375 (29) 123-45-67.</p>
          </section>
          <p className="text-xs pt-4 border-t border-border">Дата последнего обновления: 16.02.2026</p>
        </div>
      </motion.div>
    </div>
  </main>
);

export default PrivacyPolicy;
