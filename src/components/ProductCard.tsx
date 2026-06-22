import { Link } from "react-router-dom";
import { ShoppingCart, Star, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const availability = product.availability || (product.inStock ? "in_stock" : "preorder");

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    if (availability === "out_of_stock") return;
    addToCart(product);
    toast({
      title: availability === "preorder" ? "Добавлено как предзаказ" : "Добавлено в корзину",
      description: availability === "preorder" && product.preorderDays
        ? `Доставка ${product.preorderDays} дн.`
        : product.name,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group glass-card rounded-xl overflow-hidden hover:glow-border transition-all duration-300 flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${availability === "out_of_stock" ? "grayscale opacity-60" : ""}`}
          loading="lazy"
        />
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
            {product.tags.map(tag => (
              <span key={tag} className="px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
        {product.oldPrice && availability !== "out_of_stock" && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {availability === "in_stock" && (
            <span className="px-2 py-1 rounded-full text-[11px] font-medium bg-emerald-500/90 text-white flex items-center gap-1 backdrop-blur-sm">
              <CheckCircle2 size={11} /> В наличии
            </span>
          )}
          {availability === "preorder" && (
            <span className="px-2 py-1 rounded-full text-[11px] font-medium bg-amber-500/90 text-white flex items-center gap-1 backdrop-blur-sm">
              <Clock size={11} /> Под заказ{product.preorderDays ? ` · ${product.preorderDays} дн.` : ""}
            </span>
          )}
          {availability === "out_of_stock" && (
            <span className="px-2 py-1 rounded-full text-[11px] font-medium bg-rose-500/90 text-white flex items-center gap-1 backdrop-blur-sm">
              <XCircle size={11} /> Нет в наличии
            </span>
          )}
        </div>
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <Star size={12} className="fill-gold text-gold" />
          <span className="text-xs text-muted-foreground">
            {product.rating.toFixed(1)}
            {product.reviewCount ? ` · ${product.reviewCount} отз.` : " · нет отзывов"}
          </span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-display font-bold text-lg">{product.price.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground ml-1">BYN</span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through ml-2">{product.oldPrice.toFixed(2)}</span>
            )}
          </div>
          {availability === "in_stock" && (
            <button
              onClick={handleBuy}
              className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="В корзину"
            >
              <ShoppingCart size={16} />
            </button>
          )}
          {availability === "preorder" && (
            <button
              onClick={handleBuy}
              className="px-3 py-2 rounded-lg bg-amber-500/15 text-amber-500 hover:bg-amber-500 hover:text-white transition-colors text-xs font-display font-semibold whitespace-nowrap"
            >
              Оформить заказ
            </button>
          )}
          {availability === "out_of_stock" && (
            <button
              disabled
              className="px-3 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-display font-semibold cursor-not-allowed"
            >
              Нет в наличии
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
