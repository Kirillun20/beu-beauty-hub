import { Link } from "react-router-dom";
import { ShoppingCart, Star, Clock, XCircle, CheckCircle2 } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { availabilityLabels, availabilityDesc, type Availability } from "@/data/categories";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const availability: Availability = product.availability ?? (product.inStock ? "in_stock" : "pre_order");
  const isBuyable = availability !== "out_of_stock";

  const badgeMap: Record<Availability, { cls: string; Icon: any }> = {
    in_stock: { cls: "bg-green-500/15 text-green-500 border border-green-500/30", Icon: CheckCircle2 },
    pre_order: { cls: "bg-amber-500/15 text-amber-500 border border-amber-500/30", Icon: Clock },
    out_of_stock: { cls: "bg-destructive/15 text-destructive border border-destructive/30", Icon: XCircle },
  };
  const { cls, Icon } = badgeMap[availability];

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
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${availability === "out_of_stock" ? "grayscale opacity-70" : ""}`}
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
        <span className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 backdrop-blur-sm ${cls}`}>
          <Icon size={11} /> {availabilityLabels[availability]}
        </span>
      </Link>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <Star size={12} className="fill-gold text-gold" />
          <span className="text-xs text-muted-foreground">{product.rating}</span>
        </div>
        <p className="text-[11px] text-muted-foreground mb-3">{availabilityDesc[availability]}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display font-bold text-lg">{product.price.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground ml-1">BYN</span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through ml-2">{product.oldPrice.toFixed(2)}</span>
            )}
          </div>
          {isBuyable ? (
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product); }}
              title={availability === "pre_order" ? "Оформить под заказ" : "В корзину"}
              className={`p-2 rounded-lg transition-colors ${availability === "pre_order" ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white" : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"}`}
            >
              {availability === "pre_order" ? <Clock size={16} /> : <ShoppingCart size={16} />}
            </button>
          ) : (
            <button disabled className="p-2 rounded-lg bg-muted text-muted-foreground cursor-not-allowed">
              <XCircle size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
