import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const PublicOffer = () => (
  <main className="pt-24 pb-20">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-primary/10"><FileText className="text-primary" size={24} /></div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Публичная оферта</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Договор купли-продажи товаров через интернет-магазин BEU (beuby.lovable.app).
          Размещение заказа означает полное и безоговорочное согласие со всеми условиями настоящей оферты.
        </p>

        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3">1. Общие положения</h2>
            <p>1.1. Настоящий документ является официальной публичной офертой ИП Иванов И.И. (далее — «Продавец») и содержит все существенные условия приобретения товара.</p>
            <p className="mt-2">1.2. Заказывая товар на сайте, Покупатель подтверждает, что ознакомлен и согласен с условиями оферты, Политикой конфиденциальности и Правилами доставки и возврата.</p>
          </section>

          <section>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3">2. Предмет оферты</h2>
            <p>2.1. Продавец обязуется передать в собственность Покупателю товар надлежащего качества в соответствии с заказом, а Покупатель обязуется принять и оплатить его.</p>
            <p className="mt-2">2.2. Право собственности на товар переходит к Покупателю с момента фактической передачи товара.</p>
          </section>

          <section>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3">3. Оформление заказа</h2>
            <p>3.1. Заказ оформляется через сайт beuby.lovable.app путём добавления товаров в корзину и заполнения формы оформления заказа.</p>
            <p className="mt-2">3.2. После оформления Продавец связывается с Покупателем по телефону или электронной почте для подтверждения.</p>
            <p className="mt-2">3.3. Минимальная сумма заказа не установлена.</p>
          </section>

          <section>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3">4. Цены и оплата</h2>
            <p>4.1. Цены указаны в белорусских рублях (BYN) с учётом всех налогов и сборов.</p>
            <p className="mt-2">4.2. Доступные способы оплаты: наложенный платёж (только Европочта), наличными в офисе (при самовывозе), банковская карта, ЕРИП (Система «Расчёт»), онлайн-оплата.</p>
            <p className="mt-2">4.3. Продавец вправе изменять цены до момента оформления заказа. Цена подтверждённого заказа изменению не подлежит.</p>
          </section>

          <section>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3">5. Доставка</h2>
            <p>5.1. Доставка осуществляется курьером по г. Минску, Европочтой по всей территории Республики Беларусь, либо самовывозом из офиса.</p>
            <p className="mt-2">5.2. Стоимость и сроки доставки рассчитываются на этапе оформления заказа.</p>
            <p className="mt-2">5.3. Для товаров с маркировкой «Под заказ» срок доставки указан на карточке товара и составляет от 7 дней.</p>
          </section>

          <section>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3">6. Возврат и обмен</h2>
            <p>6.1. Возврат товара надлежащего качества возможен в течение 14 календарных дней с момента получения при сохранении товарного вида, упаковки и потребительских свойств.</p>
            <p className="mt-2">6.2. Не подлежат возврату товары надлежащего качества согласно перечню Совета Министров Республики Беларусь (парфюмерно-косметические товары в индивидуальной упаковке после вскрытия).</p>
            <p className="mt-2">6.3. При обнаружении недостатков товара Покупатель вправе требовать замены или возврата денежных средств в соответствии с Законом «О защите прав потребителей».</p>
          </section>

          <section>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3">7. Программа лояльности и промокоды</h2>
            <p>7.1. За каждую покупку начисляются баллы лояльности по курсу 1 BYN = 1 балл.</p>
            <p className="mt-2">7.2. 20 баллов = 1 BYN скидки. Максимальная скидка баллами ограничена суммой заказа.</p>
            <p className="mt-2">7.3. Промокоды применяются на этапе оформления заказа и не суммируются с другими акциями, если не указано иное.</p>
          </section>

          <section>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3">8. Персональные данные</h2>
            <p>8.1. Оформляя заказ, Покупатель даёт согласие на обработку персональных данных в соответствии с Законом РБ «О защите персональных данных» и Политикой конфиденциальности.</p>
          </section>

          <section>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3">9. Ответственность сторон</h2>
            <p>9.1. Продавец не несёт ответственности за невозможность исполнения заказа по причине предоставления Покупателем недостоверных данных.</p>
            <p className="mt-2">9.2. Все споры разрешаются путём переговоров, а при невозможности достижения соглашения — в судебном порядке по законодательству Республики Беларусь.</p>
          </section>

          <section>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3">10. Реквизиты продавца</h2>
            <p>ИП Иванов И.И.</p>
            <p>УНП 123456789</p>
            <p>Свидетельство о государственной регистрации № ____ от 01.01.2022</p>
            <p>Адрес: г. Минск, ул. Немига 3, офис 12</p>
            <p>Email: info@beu.by · Тел.: +375 (29) 123-45-67</p>
          </section>

          <p className="text-xs pt-4 border-t border-border">Дата последней редакции: 23.06.2026</p>
        </div>
      </motion.div>
    </div>
  </main>
);

export default PublicOffer;
