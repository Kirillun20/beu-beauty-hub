import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, Minus, Plus, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null));
  }, []);

  useEffect(() => {
    if (!id) return;
    supabase.from("reviews").select("*").eq("product_id", id).order("created_at", { ascending: false })
      .then(({ data }) => setReviews(data || []));
  }, [id]);

  if (!product) {
    return (
      <main className="pt-24 pb-20 container mx-auto px-4 text-center">
        <p className="text-muted-foreground text-lg">Товар не найден</p>
        <Link to="/catalog" className="text-primary hover:underline mt-4 inline-block">Вернуться в каталог</Link>
      </main>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const handleAdd = () => { for (let i = 0; i < qty; i++) addToCart(product); };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : product.rating;

  const submitReview = async () => {
    if (!user) { toast({ title: "Войдите в аккаунт", variant: "destructive" }); return; }
    if (!reviewText.trim()) return;
    setSubmitting(true);
    const { data: profile } = await supabase.from("profiles").select("display_name").eq("user_id", user.id).single();
    const { error } = await supabase.from("reviews").insert({
      product_id: id,
      user_id: user.id,
      rating: reviewRating,
      text: reviewText,
      author_name: profile?.display_name || user.email?.split("@")[0] || "Пользователь",
    });
    setSubmitting(false);
    if (error) { toast({ title: "Ошибка", description: error.message, variant: "destructive" }); }
    else {
      toast({ title: "Отзыв добавлен! ✨" });
      setReviewText("");
      setReviewRating(5);
      const { data } = await supabase.from("reviews").select("*").eq("product_id", id).order("created_at", { ascending: false });
      setReviews(data || []);
    }
  };

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8">
          <ArrowLeft size={16} /> Назад в каталог
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="aspect-square rounded-2xl overflow-hidden glass-card">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <p className="text-primary text-sm font-medium mb-2">{product.brand}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-6">
              <Star size={16} className="fill-gold text-gold" />
              <span className="text-sm">{avgRating}</span>
              <span className="text-muted-foreground text-sm">({reviews.length} отзывов)</span>
              {product.volume && <span className="text-muted-foreground text-sm ml-4">• {product.volume}</span>}
            </div>
            <div className="mb-6">
              <span className="font-display text-4xl font-bold">{product.price.toFixed(2)}</span>
              <span className="text-muted-foreground ml-2">BYN</span>
              {product.oldPrice && <span className="text-muted-foreground line-through ml-3 text-lg">{product.oldPrice.toFixed(2)} BYN</span>}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center glass-card rounded-xl">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 text-muted-foreground hover:text-foreground"><Minus size={16} /></button>
                <span className="px-4 font-display font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-3 text-muted-foreground hover:text-foreground"><Plus size={16} /></button>
              </div>
              <button onClick={handleAdd}
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity">
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

        {/* Reviews Section */}
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold mb-8 flex items-center gap-2">
            <Star size={22} className="text-primary" /> Отзывы ({reviews.length})
          </h2>

          {/* Write review */}
          <div className="glass-card rounded-2xl p-6 mb-8 glow-box">
            <h3 className="font-display font-semibold mb-4">Оставить отзыв</h3>
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setReviewRating(s)}>
                  <Star size={20} className={s <= reviewRating ? "fill-gold text-gold" : "text-muted-foreground"} />
                </button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={user ? "Поделитесь впечатлениями о товаре..." : "Войдите, чтобы оставить отзыв"}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4"
            />
            <button onClick={submitReview} disabled={submitting || !reviewText.trim()}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
              <Send size={16} /> {submitting ? "Отправка..." : "Отправить отзыв"}
            </button>
          </div>

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Отзывов пока нет. Будьте первым!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <motion.div key={review.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  className="glass-card rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm">
                        {review.author_name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span className="font-display font-semibold text-sm">{review.author_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} className={s <= review.rating ? "fill-gold text-gold" : "text-muted-foreground"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                  <p className="text-xs text-muted-foreground mt-3">{new Date(review.created_at).toLocaleDateString("ru-RU")}</p>
                </motion.div>
              ))}
            </div>
          )}
        </section>

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
