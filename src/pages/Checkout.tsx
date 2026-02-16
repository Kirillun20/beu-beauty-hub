import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { CreditCard, Banknote, Smartphone, Truck, Building, MapPin, ArrowLeft, CheckCircle, Package, Award, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = [
  { id: "cod", label: "Наложенный платёж", icon: Banknote, desc: "Оплата при получении" },
  { id: "card", label: "Банковская карта", icon: CreditCard, desc: "Visa, Mastercard" },
  { id: "erip", label: "ЕРИП", icon: Building, desc: "Система «Расчёт»" },
  { id: "online", label: "Онлайн-оплата", icon: Smartphone, desc: "Быстрая оплата" },
];

const deliveryMethods = [
  { id: "courier", label: "Курьером по Минску", price: 10, priceLabel: "10 BYN", icon: Truck, desc: "Доставка 1-2 дня" },
  { id: "europost", label: "Европочтой по Беларуси", price: 7, priceLabel: "7 BYN", icon: Package, desc: "Доставка 2-5 дней" },
  { id: "pickup", label: "Самовывоз", price: 0, priceLabel: "Бесплатно", icon: MapPin, desc: "г. Минск" },
];

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", europostOffice: "" });
  const [payment, setPayment] = useState("cod");
  const [delivery, setDelivery] = useState("courier");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const selectedDelivery = deliveryMethods.find(d => d.id === delivery)!;
  const maxDiscount = Math.floor(loyaltyPoints / 20);
  const maxDiscountAllowed = Math.min(maxDiscount, Math.floor(totalPrice));
  const pointsDiscount = Math.min(usePoints, maxDiscountAllowed);
  const finalTotal = totalPrice + selectedDelivery.price - pointsDiscount;

  useEffect(() => {
    if (items.length === 0 && !done) navigate("/cart");
  }, [items, navigate, done]);

  useEffect(() => {
    const fetchLoyalty = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("loyalty_points").eq("user_id", session.user.id).single();
        if (data) setLoyaltyPoints(data.loyalty_points || 0);
      }
    };
    fetchLoyalty();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({ title: "Войдите в аккаунт для оформления заказа", variant: "destructive" });
      setLoading(false);
      return;
    }

    const orderItems = items.map((i) => ({
      product_id: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
    }));

    let deliveryAddress = "Самовывоз — г. Минск, ул. Немига 3";
    if (delivery === "courier") deliveryAddress = form.address.trim();
    if (delivery === "europost") deliveryAddress = `Европочта: ${form.europostOffice.trim()}`;

    const { error } = await supabase.from("orders").insert({
      user_id: session.user.id,
      customer_name: form.name.trim().slice(0, 200),
      customer_phone: form.phone.trim().slice(0, 50),
      customer_email: form.email ? form.email.trim().slice(0, 255) : null,
      delivery_address: deliveryAddress.slice(0, 500),
      delivery_method: delivery,
      payment_method: payment,
      items: orderItems,
      total: finalTotal,
    });

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      // Deduct loyalty points if used
      if (pointsDiscount > 0) {
        await supabase.from("profiles").update({
          loyalty_points: loyaltyPoints - (pointsDiscount * 20),
        }).eq("user_id", session.user.id);
      }
      // Add earned points
      const earned = Math.floor(totalPrice);
      await supabase.from("profiles").update({
        loyalty_points: (loyaltyPoints - (pointsDiscount * 20)) + earned,
      }).eq("user_id", session.user.id);
      setDone(true);
      clearCart();
    }
    setLoading(false);
  };

  if (done) {
    return (
      <main className="pt-24 pb-20 flex items-center justify-center min-h-screen">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-4">
          <div className="glass-card rounded-2xl p-10 glow-box">
            <CheckCircle size={64} className="mx-auto text-primary mb-6" />
            <h1 className="font-display text-3xl font-bold mb-4">Заказ оформлен!</h1>
            <p className="text-muted-foreground mb-8">Мы свяжемся с вами для подтверждения. Отслеживайте заказ в личном кабинете.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold">
              На главную
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={16} /> Назад в корзину
        </Link>
        <h1 className="font-display text-4xl font-bold mb-8">Оформление заказа</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Контактные данные</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ФИО *" required className={inputClass} />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Телефон *" required type="tel" className={inputClass} />
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" className={`col-span-full ${inputClass}`} />
              </div>
            </div>

            {/* Delivery */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Доставка</h2>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {deliveryMethods.map((m) => (
                  <button type="button" key={m.id} onClick={() => setDelivery(m.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${delivery === m.id ? "border-primary bg-primary/5 glow-border" : "border-border hover:border-muted-foreground"}`}>
                    <m.icon size={24} className={delivery === m.id ? "text-primary" : "text-muted-foreground"} />
                    <div className="flex-1">
                      <p className="font-display font-semibold text-sm">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                    <span className={`font-display font-bold text-sm ${delivery === m.id ? "text-primary" : "text-foreground"}`}>{m.priceLabel}</span>
                  </button>
                ))}
              </div>

              {/* Conditional delivery fields */}
              {delivery === "courier" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Адрес доставки (ул., дом, кв.) *" required className={inputClass} />
                </motion.div>
              )}
              {delivery === "europost" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <input value={form.europostOffice} onChange={(e) => setForm({ ...form, europostOffice: e.target.value })} placeholder="Адрес отделения Европочты *" required className={inputClass} />
                </motion.div>
              )}
              {delivery === "pickup" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="rounded-xl overflow-hidden border border-border mb-3">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2350.8!2d27.5547!3d53.9006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z0JzQuNC90YHQug!5e0!3m2!1sru!2sby!4v1"
                      width="100%" height="200" style={{ border: 0 }} allowFullScreen loading="lazy"
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <MapPin size={16} className="text-primary shrink-0" />
                    <p className="text-sm">г. Минск, ул. Немига 3, магазин BEU</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Payment */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Способ оплаты</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentMethods.map((m) => (
                  <button type="button" key={m.id} onClick={() => setPayment(m.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${payment === m.id ? "border-primary bg-primary/5 glow-border" : "border-border hover:border-muted-foreground"}`}>
                    <m.icon size={20} className={payment === m.id ? "text-primary mb-2" : "text-muted-foreground mb-2"} />
                    <p className="font-display font-semibold text-sm">{m.label}</p>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Loyalty Points */}
            {loyaltyPoints >= 20 && (
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award size={20} className="text-primary" /> Баллы лояльности
                </h2>
                <p className="text-sm text-muted-foreground mb-3">
                  У вас <span className="text-primary font-bold">{loyaltyPoints}</span> баллов (20 баллов = 1 BYN скидки).
                  Максимальная скидка: <span className="font-bold">{maxDiscountAllowed} BYN</span>
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center glass-card rounded-xl">
                    <button type="button" onClick={() => setUsePoints(Math.max(0, usePoints - 1))} className="p-3 text-muted-foreground hover:text-foreground"><Minus size={16} /></button>
                    <span className="px-4 font-display font-semibold">{usePoints} BYN</span>
                    <button type="button" onClick={() => setUsePoints(Math.min(maxDiscountAllowed, usePoints + 1))} className="p-3 text-muted-foreground hover:text-foreground"><Plus size={16} /></button>
                  </div>
                  <span className="text-xs text-muted-foreground">= {usePoints * 20} баллов</span>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="glass-card rounded-2xl p-6 h-fit sticky top-24">
            <h3 className="font-display font-semibold text-lg mb-4">Ваш заказ</h3>
            <div className="space-y-3 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">{product.name} × {quantity}</span>
                  <span className="shrink-0">{(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Товары</span>
                <span>{totalPrice.toFixed(2)} BYN</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Доставка</span>
                <span>{selectedDelivery.price > 0 ? `${selectedDelivery.price.toFixed(2)} BYN` : "Бесплатно"}</span>
              </div>
              {pointsDiscount > 0 && (
                <div className="flex justify-between text-sm text-primary">
                  <span>Скидка баллами</span>
                  <span>−{pointsDiscount.toFixed(2)} BYN</span>
                </div>
              )}
            </div>
            <div className="border-t border-border pt-3 mb-2">
              <div className="flex justify-between font-display font-bold text-lg">
                <span>Итого</span>
                <span>{finalTotal.toFixed(2)} BYN</span>
              </div>
            </div>
            <p className="text-xs text-primary mb-4">+{Math.floor(totalPrice)} баллов лояльности</p>
            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? "Оформляем..." : "Подтвердить заказ"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
