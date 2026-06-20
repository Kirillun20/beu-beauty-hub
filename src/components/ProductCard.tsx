import { Link } from "react-router-dom";
import { ShoppingCart, Star, Clock } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group glass-card rounded-xl overflow-hidden hover:glow-border transition-all duration-300"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
        {product.oldPrice && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
        {product.preOrder && (
          <span className="absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground flex items-center gap-1">
            <Clock size={10} /> Под заказ
          </span>
        )}
      </Link>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <Star size={12} className="fill-gold text-gold" />
          <span className="text-xs text-muted-foreground">{product.rating}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display font-bold text-lg">{product.price.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground ml-1">BYN</span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through ml-2">{product.oldPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
