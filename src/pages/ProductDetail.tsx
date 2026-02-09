import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <main className="pt-24 pb-20 container mx-auto px-4 text-center">
        <p className="text-muted-foreground text-lg">Товар не найден</p>
        <Link to="/catalog" className="text-primary hover:underline mt-4 inline-block">Вернуться в каталог</Link>
      </main>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
  };

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8">
          <ArrowLeft size={16} /> Назад в каталог
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-square rounded-2xl overflow-hidden glass-card"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-primary text-sm font-medium mb-2">{product.brand}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-6">
              <Star size={16} className="fill-gold text-gold" />
              <span className="text-sm">{product.rating}</span>
              {product.volume && <span className="text-muted-foreground text-sm ml-4">• {product.volume}</span>}
            </div>

            <div className="mb-6">
              <span className="font-display text-4xl font-bold">{product.price.toFixed(2)}</span>
              <span className="text-muted-foreground ml-2">BYN</span>
              {product.oldPrice && (
                <span className="text-muted-foreground line-through ml-3 text-lg">{product.oldPrice.toFixed(2)} BYN</span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center glass-card rounded-xl">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 text-muted-foreground hover:text-foreground"><Minus size={16} /></button>
                <span className="px-4 font-display font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-3 text-muted-foreground hover:text-foreground"><Plus size={16} /></button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity"
              >
                <ShoppingCart size={18} /> В корзину
              </button>
            </div>

            {product.tags && (
              <div className="flex gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs border border-border text-muted-foreground">{tag}</span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold mb-8">Похожие товары</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
