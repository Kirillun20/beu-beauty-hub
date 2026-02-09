import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="pt-24 pb-20 container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto py-20">
          <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-6" />
          <h1 className="font-display text-3xl font-bold mb-4">Корзина пуста</h1>
          <p className="text-muted-foreground mb-8">Добавьте товары из каталога</p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold"
          >
            Перейти в каталог <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold mb-8">Корзина</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-4 p-4 glass-card rounded-xl"
              >
                <img src={product.image} alt={product.name} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                  <Link to={`/product/${product.id}`} className="font-display font-semibold text-sm hover:text-primary transition-colors line-clamp-1">{product.name}</Link>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center glass-card rounded-lg">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-1.5 text-muted-foreground hover:text-foreground"><Minus size={14} /></button>
                      <span className="px-3 text-sm font-semibold">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-1.5 text-muted-foreground hover:text-foreground"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(product.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display font-bold">{(product.price * quantity).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">BYN</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="glass-card rounded-xl p-6 h-fit sticky top-24">
            <h3 className="font-display font-semibold text-lg mb-6">Итого</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Товары</span>
                <span>{totalPrice.toFixed(2)} BYN</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Доставка</span>
                <span className="text-primary">Бесплатно</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-display font-bold text-lg">
                <span>Итого</span>
                <span>{totalPrice.toFixed(2)} BYN</span>
              </div>
            </div>
            <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity">
              Оформить заказ
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-3 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Очистить корзину
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
