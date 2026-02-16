import { motion } from "framer-motion";

const PublicOffer = () => (
  <main className="pt-24 pb-20">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-bold mb-8">Публичная оферта</h1>
        <div className="glass-card rounded-2xl p-8 space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Общие положения</h2>
            <p>Настоящий документ является публичной офертой интернет-магазина BEU (далее — Продавец) и содержит все существенные условия приобретения товаров.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. Предмет оферты</h2>
            <p>Продавец обязуется передать покупателю товар надлежащего качества, а Покупатель обязуется оплатить и принять товар на условиях, изложенных в настоящей оферте.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. Оформление заказа</h2>
            <p>Заказ оформляется через сайт beu.by. Подтверждение заказа осуществляется по телефону или электронной почте. Минимальная сумма заказа не установлена.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Цены и оплата</h2>
            <p>Цены указаны в белорусских рублях (BYN) и включают все налоги. Доступные способы оплаты: наложенный платёж, банковская карта, ЕРИП, онлайн-оплата.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Доставка</h2>
            <p>Доставка осуществляется курьером по г. Минску (10 BYN), Европочтой по Беларуси (7 BYN) или самовывозом (бесплатно). Сроки доставки: курьером — 1-2 дня, Европочтой — 2-5 дней.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Возврат и обмен</h2>
            <p>Возврат товара надлежащего качества осуществляется в течение 14 дней с момента получения при сохранении товарного вида и упаковки. Возврат товара ненадлежащего качества — в соответствии с законодательством РБ.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">7. Программа лояльности</h2>
            <p>За каждую покупку начисляются баллы (1 BYN = 1 балл). 20 баллов = 1 BYN скидки. Баллы можно использовать при следующих заказах.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">8. Реквизиты</h2>
            <p>ИП Иванов И.И., УНП 123456789. Свидетельство о регистрации от 01.01.2022. г. Минск, Беларусь.</p>
          </section>
          <p className="text-xs pt-4 border-t border-border">Дата последнего обновления: 16.02.2026</p>
        </div>
      </motion.div>
    </div>
  </main>
);

export default PublicOffer;
