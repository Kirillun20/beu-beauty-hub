import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, Minus, Plus, Send, Award, Globe, FlaskConical, BookOpen, Pencil, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useProduct } from "@/hooks/useAllProducts";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const { product, products, loading } = useProduct(id);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"desc" | "composition" | "application" | "reviews">("desc");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null));
  }, []);

  const fetchReviews = async () => {
    if (!id) return;
    // Always use public view for reading reviews (no RLS issues)
    const { data: publicReviews } = await supabase.from("reviews_public" as any).select("*").eq("product_id", id).order("created_at", { ascending: false });
    
    if (user) {
      // Also fetch user's own reviews to get user_id for edit/delete ownership
      const { data: ownReviews } = await supabase.from("reviews").select("id, user_id").eq("product_id", id).eq("user_id", user.id);
      const ownIds = new Set((ownReviews || []).map((r: any) => r.id));
      // Merge user_id into public reviews for ownership check
      setReviews((publicReviews || []).map((r: any) => ({
        ...r,
        user_id: ownIds.has(r.id) ? user.id : undefined,
      })));
    } else {
      setReviews(publicReviews || []);
    }
  };

  useEffect(() => { fetchReviews(); }, [id, user]);

  if (!product) {
    if (loading) {
      return <main className="pt-24 pb-20 container mx-auto px-4 text-center"><div className="animate-pulse text-muted-foreground">Загрузка...</div></main>;
    }
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
  const loyaltyPoints = Math.floor(product.price);

  const submitReview = async () => {
    if (!user) { toast({ title: "Войдите в аккаунт", variant: "destructive" }); return; }
    const trimmed = reviewText.trim();
    if (!trimmed) return;
    if (trimmed.length > 2000) { toast({ title: "Отзыв слишком длинный", description: "Максимум 2000 символов", variant: "destructive" }); return; }
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
      await fetchReviews();
    }
  };

  const startEditReview = (review: any) => {
    setEditingReviewId(review.id);
    setEditText(review.text || "");
    setEditRating(review.rating);
  };

  const saveEditReview = async () => {
    if (!editingReviewId) return;
    const trimmedEdit = editText.trim();
    if (trimmedEdit.length > 2000) { toast({ title: "Отзыв слишком длинный", description: "Максимум 2000 символов", variant: "destructive" }); return; }
    const { error } = await supabase.from("reviews").update({ text: trimmedEdit, rating: editRating }).eq("id", editingReviewId);
    if (error) { toast({ title: "Ошибка", description: error.message, variant: "destructive" }); }
    else {
      toast({ title: "Отзыв обновлён!" });
      setEditingReviewId(null);
      await fetchReviews();
    }
  };

  const tabs = [
    { id: "desc" as const, label: "Описание", icon: BookOpen },
    { id: "composition" as const, label: "Состав", icon: FlaskConical },
    { id: "application" as const, label: "Применение", icon: Globe },
    { id: "reviews" as const, label: `Отзывы (${reviews.length})`, icon: Star },
  ];

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
            <div className="flex items-center gap-2 mb-4">
              <Star size={16} className="fill-gold text-gold" />
              <span className="text-sm">{avgRating}</span>
              <span className="text-muted-foreground text-sm">({reviews.length} отзывов)</span>
              {product.volume && <span className="text-muted-foreground text-sm ml-4">• {product.volume}</span>}
            </div>

            {product.country && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Globe size={14} /> Страна: <span className="text-foreground">{product.country}</span>
              </div>
            )}

            <div className="mb-4">
              <span className="font-display text-4xl font-bold">{product.price.toFixed(2)}</span>
              <span className="text-muted-foreground ml-2">BYN</span>
              {product.oldPrice && <span className="text-muted-foreground line-through ml-3 text-lg">{product.oldPrice.toFixed(2)} BYN</span>}
            </div>

            {/* Loyalty points */}
            <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
              <Award size={18} className="text-primary" />
              <span className="text-sm">
                За покупку вы получите <span className="text-primary font-bold">+{loyaltyPoints} баллов</span> лояльности
              </span>
            </div>

            {(() => {
              const av = product.availability || (product.inStock ? "in_stock" : "preorder");
              return (
                <>
                  {av === "in_stock" && (
                    <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-sm font-display font-semibold text-emerald-500">✓ В наличии — доступно для заказа</p>
                    </div>
                  )}
                  {av === "preorder" && (
                    <div className="mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <p className="text-sm font-display font-semibold text-amber-500">📦 Под заказ — доставка {product.preorderDays ? `${product.preorderDays} дней` : "7-12 дней"}</p>
                      <p className="text-xs text-muted-foreground mt-1">Товар доставляется напрямую от производителя. Отслеживайте статус в личном кабинете.</p>
                    </div>
                  )}
                  {av === "out_of_stock" && (
                    <div className="mb-6 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                      <p className="text-sm font-display font-semibold text-rose-500">✕ Нет в наличии</p>
                      <p className="text-xs text-muted-foreground mt-1">Товар временно недоступен. Свяжитесь с нами, чтобы узнать о поступлении.</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center glass-card rounded-xl">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={av === "out_of_stock"} className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-40"><Minus size={16} /></button>
                      <span className="px-4 font-display font-semibold">{qty}</span>
                      <button onClick={() => setQty(qty + 1)} disabled={av === "out_of_stock"} className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-40"><Plus size={16} /></button>
                    </div>
                    <button onClick={handleAdd} disabled={av === "out_of_stock"}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
                      <ShoppingCart size={18} /> {av === "preorder" ? "Оформить заказ" : av === "out_of_stock" ? "Нет в наличии" : "В корзину"}
                    </button>
                  </div>
                </>
              );
            })()}
            {product.tags && (
              <div className="flex gap-2 flex-wrap">
                {product.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs border border-border text-muted-foreground">{tag}</span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-xl text-sm font-display font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id ? "bg-primary/10 text-primary glow-border" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}>
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Description tab */}
          {activeTab === "desc" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8">
              <h3 className="font-display text-xl font-semibold mb-4">Описание</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.volume && (
                  <div className="p-4 rounded-xl bg-secondary/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Объём</p>
                    <p className="font-display font-bold">{product.volume}</p>
                  </div>
                )}
                {product.country && (
                  <div className="p-4 rounded-xl bg-secondary/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Страна</p>
                    <p className="font-display font-bold">{product.country}</p>
                  </div>
                )}
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Бренд</p>
                  <p className="font-display font-bold">{product.brand}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Рейтинг</p>
                  <p className="font-display font-bold flex items-center justify-center gap-1"><Star size={14} className="fill-gold text-gold" />{avgRating}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Composition tab */}
          {activeTab === "composition" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8">
              <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <FlaskConical size={20} className="text-primary" /> Состав
              </h3>
              {product.composition ? (
                <div className="space-y-3">
                  {product.composition.split(", ").map((ingredient, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-sm">{ingredient.trim()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Информация о составе скоро будет добавлена.</p>
              )}
            </motion.div>
          )}

          {/* Application tab */}
          {activeTab === "application" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8">
              <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-primary" /> Применение
              </h3>
              {product.application ? (
                <p className="text-muted-foreground leading-relaxed">{product.application}</p>
              ) : (
                <p className="text-muted-foreground">Инструкция по применению скоро будет добавлена.</p>
              )}
            </motion.div>
          )}

          {/* Reviews tab */}
          {activeTab === "reviews" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
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
                <div className="text-xs text-muted-foreground text-right mb-1">{reviewText.length}/2000</div>
                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value.slice(0, 2000))} maxLength={2000}
                  placeholder={user ? "Поделитесь впечатлениями о товаре..." : "Войдите, чтобы оставить отзыв"} rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4" />
                <button onClick={submitReview} disabled={submitting || !reviewText.trim()}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                  <Send size={16} /> {submitting ? "Отправка..." : "Отправить отзыв"}
                </button>
              </div>

              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Отзывов пока нет. Будьте первым!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <motion.div key={review.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                      className="glass-card rounded-xl p-5">
                      {editingReviewId === review.id ? (
                        <div>
                          <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button key={s} onClick={() => setEditRating(s)}>
                                <Star size={16} className={s <= editRating ? "fill-gold text-gold" : "text-muted-foreground"} />
                              </button>
                            ))}
                          </div>
                          <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={2}
                            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-3" />
                          <div className="flex gap-2">
                            <button onClick={saveEditReview} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">Сохранить</button>
                            <button onClick={() => setEditingReviewId(null)} className="px-4 py-2 rounded-lg border border-border text-xs text-muted-foreground">Отмена</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm">
                                {review.author_name?.[0]?.toUpperCase() || "?"}
                              </div>
                              <span className="font-display font-semibold text-sm">{review.author_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} size={12} className={s <= review.rating ? "fill-gold text-gold" : "text-muted-foreground"} />
                                ))}
                              </div>
                              {user && review.user_id === user.id && (
                                <button onClick={() => startEditReview(review)} className="p-1 rounded text-muted-foreground hover:text-primary" title="Редактировать">
                                  <Pencil size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                          <p className="text-xs text-muted-foreground mt-3">{new Date(review.created_at).toLocaleDateString("ru-RU")}</p>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
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
