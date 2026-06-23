import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, LogOut, Package, Shield, Save, Star, Gift, Award, TrendingUp, Sun, Moon, Eye, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loyaltyTiers = [
  { name: "Бронза", min: 0, color: "text-orange-400", icon: "🥉" },
  { name: "Серебро", min: 500, color: "text-gray-300", icon: "🥈" },
  { name: "Золото", min: 1500, color: "text-gold", icon: "🥇" },
  { name: "Платина", min: 5000, color: "text-primary", icon: "💎" },
];

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({ display_name: "", phone: "", address: "" });
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "loyalty" | "settings">("profile");
  const [lightTheme, setLightTheme] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("beu-theme");
    if (saved === "light") { setLightTheme(true); document.documentElement.classList.add("light-theme"); }
  }, []);

  const toggleTheme = () => {
    const next = !lightTheme;
    setLightTheme(next);
    if (next) {
      document.documentElement.classList.add("light-theme");
      localStorage.setItem("beu-theme", "light");
    } else {
      document.documentElement.classList.remove("light-theme");
      localStorage.setItem("beu-theme", "dark");
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUser(session.user);

      const [profileRes, rolesRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", session.user.id).single(),
        supabase.from("user_roles").select("role").eq("user_id", session.user.id),
        supabase.from("orders").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
      ]);

      if (profileRes.data) {
        setProfile({
          display_name: profileRes.data.display_name || "",
          phone: profileRes.data.phone || "",
          address: profileRes.data.address || "",
        });
        setLoyaltyPoints(profileRes.data.loyalty_points || 0);
      }
      setIsAdmin(rolesRes.data?.some((r: any) => r.role === "admin") || false);
      setOrders(ordersRes.data || []);
      setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSave = async () => {
    if (!user) return;
    if ((profile.display_name && profile.display_name.length > 200) || (profile.phone && profile.phone.length > 50) || (profile.address && profile.address.length > 500)) {
      toast({ title: "Ошибка", description: "Одно из полей слишком длинное", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      display_name: profile.display_name?.trim().slice(0, 200) || null,
      phone: profile.phone?.trim().slice(0, 50) || null,
      address: profile.address?.trim().slice(0, 500) || null,
    }).eq("user_id", user.id);
    setSaving(false);
    if (error) toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    else toast({ title: "Профиль обновлён!" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <main className="pt-24 pb-20 flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Загрузка...</div>
      </main>
    );
  }

  const currentTier = [...loyaltyTiers].reverse().find(t => loyaltyPoints >= t.min) || loyaltyTiers[0];
  const nextTier = loyaltyTiers.find(t => t.min > loyaltyPoints);
  const progress = nextTier ? ((loyaltyPoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

  const statusLabels: Record<string, string> = {
    pending: "Ожидает", processing: "В обработке", shipped: "Отправлен", delivered: "Доставлен", cancelled: "Отменён",
  };
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500", processing: "bg-blue-500/10 text-blue-500",
    shipped: "bg-accent/10 text-accent", delivered: "bg-green-500/10 text-green-500", cancelled: "bg-destructive/10 text-destructive",
  };

  const tabs = [
    { id: "profile" as const, label: "Профиль", icon: User },
    { id: "orders" as const, label: "Заказы", icon: Package },
    { id: "loyalty" as const, label: "Лояльность", icon: Gift },
    { id: "settings" as const, label: "Настройки", icon: Sun },
  ];

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-4xl font-bold">Личный кабинет</h1>
            <div className="flex gap-2">
              {isAdmin && (
                <Link to="/admin" className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium text-sm flex items-center gap-2 hover:bg-primary/20 transition-colors">
                  <Shield size={16} /> Админ-панель
                </Link>
              )}
              <button onClick={handleLogout} className="px-4 py-2 rounded-xl border border-border text-muted-foreground text-sm flex items-center gap-2 hover:text-foreground transition-colors">
                <LogOut size={16} /> Выйти
              </button>
            </div>
          </div>

          {/* Loyalty summary */}
          <div className="glass-card rounded-2xl p-6 mb-8 glow-box">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentTier.icon}</span>
                <div>
                  <p className={`font-display font-bold text-lg ${currentTier.color}`}>{currentTier.name}</p>
                  <p className="text-sm text-muted-foreground">Уровень лояльности</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl font-bold glow-text text-primary">{loyaltyPoints}</p>
                <p className="text-xs text-muted-foreground">баллов</p>
              </div>
            </div>
            {nextTier && (
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>{currentTier.name}</span>
                  <span>{nextTier.name} — ещё {nextTier.min - loyaltyPoints} баллов</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-display font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}>
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Profile tab */}
          {activeTab === "profile" && (
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                <User size={20} className="text-primary" /> Данные профиля
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={profile.display_name} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} placeholder="Имя"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={user?.email || ""} disabled className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-muted-foreground cursor-not-allowed" />
                </div>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Телефон"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} placeholder="Адрес доставки"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <button onClick={handleSave} disabled={saving}
                className="mt-4 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                <Save size={16} /> {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          )}

          {/* Orders tab */}
          {activeTab === "orders" && (
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                <Package size={20} className="text-primary" /> Мои заказы
              </h2>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Заказов пока нет</p>
                  <Link to="/catalog" className="text-primary hover:underline text-sm mt-2 inline-block">Перейти в каталог</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const isOpen = expandedOrderId === order.id;
                    return (
                      <div key={order.id} className="rounded-xl bg-secondary/50 border border-border overflow-hidden">
                        <button onClick={() => setExpandedOrderId(isOpen ? null : order.id)}
                          className="w-full p-4 sm:p-5 text-left hover:bg-secondary/70 transition-colors">
                          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                            <span className="font-display font-semibold text-sm">Заказ #{order.id.slice(0, 8)}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-primary/10 text-primary"}`}>
                              {statusLabels[order.status] || order.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground gap-2 flex-wrap">
                            <span>{new Date(order.created_at).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" })}</span>
                            <span className="font-display font-bold text-foreground">{Number(order.total).toFixed(2)} BYN</span>
                          </div>
                          <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Truck size={12} />
                              <span>{order.delivery_method === "europost" ? "Европочта" : order.delivery_method === "courier" ? "Курьер" : "Самовывоз"}</span>
                              <span>· {Array.isArray(order.items) ? order.items.length : 0} поз.</span>
                            </div>
                            <span className="text-xs text-primary inline-flex items-center gap-1"><Eye size={12} /> {isOpen ? "Свернуть" : "Подробнее"}</span>
                          </div>
                        </button>
                        {isOpen && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                            className="border-t border-border bg-background/40">
                            <div className="p-4 sm:p-5 space-y-4 text-sm">
                              <div>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Состав заказа</p>
                                <div className="space-y-2">
                                  {(order.items as any[]).map((it: any, i: number) => (
                                    <div key={i} className="flex justify-between gap-3 py-2 border-b border-border/40 last:border-0">
                                      <span className="text-foreground line-clamp-2 flex-1">
                                        {it.name}
                                        {it.selectedVolume ? ` · ${it.selectedVolume}` : ""}
                                        <span className="text-muted-foreground"> × {it.quantity}</span>
                                      </span>
                                      <span className="shrink-0 font-display font-semibold">{(Number(it.price) * Number(it.quantity)).toFixed(2)} BYN</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <div className="p-3 rounded-lg bg-secondary/60">
                                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Доставка</p>
                                  <p className="text-foreground break-words">{order.delivery_address || "—"}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-secondary/60">
                                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Оплата</p>
                                  <p className="text-foreground">{order.payment_method}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-secondary/60">
                                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Получатель</p>
                                  <p className="text-foreground">{order.customer_name}</p>
                                  <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                                </div>
                                {(order.promo_code || Number(order.discount) > 0) && (
                                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                                    <p className="text-[11px] uppercase tracking-wider text-primary mb-1">Промокод</p>
                                    <p className="text-foreground font-mono text-xs">{order.promo_code || "—"}</p>
                                    <p className="text-xs text-primary">−{Number(order.discount || 0).toFixed(2)} BYN</p>
                                  </div>
                                )}
                              </div>
                              {order.notes && (
                                <div className="p-3 rounded-lg bg-secondary/60">
                                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Комментарий</p>
                                  <p className="text-foreground text-xs whitespace-pre-wrap">{order.notes}</p>
                                </div>
                              )}
                              {/* Tracking */}
                              <div className="pt-2">
                                <div className="flex items-center gap-2">
                                  {["pending", "processing", "shipped", "delivered"].map((step, idx) => {
                                    const stepOrder = ["pending", "processing", "shipped", "delivered"];
                                    const currentIdx = stepOrder.indexOf(order.status);
                                    const isActive = idx <= currentIdx;
                                    return (
                                      <div key={step} className="flex items-center gap-2 flex-1">
                                        <div className={`w-3 h-3 rounded-full shrink-0 ${isActive ? "bg-primary" : "bg-muted"}`} />
                                        {idx < 3 && <div className={`flex-1 h-0.5 ${isActive ? "bg-primary" : "bg-muted"}`} />}
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                                  <span>Создан</span><span>Обработка</span><span>Отправлен</span><span>Доставлен</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Loyalty tab */}
          {activeTab === "loyalty" && (
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                  <Award size={20} className="text-primary" /> Система лояльности
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 shrink-0"><Star size={18} className="text-primary" /></div>
                      <div>
                        <p className="font-display font-semibold text-sm">Получайте баллы</p>
                        <p className="text-xs text-muted-foreground">1 BYN = 1 балл за каждую покупку</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 shrink-0"><Gift size={18} className="text-primary" /></div>
                      <div>
                        <p className="font-display font-semibold text-sm">Тратьте на скидки</p>
                        <p className="text-xs text-muted-foreground">20 баллов = 1 BYN скидки</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 shrink-0"><TrendingUp size={18} className="text-primary" /></div>
                      <div>
                        <p className="font-display font-semibold text-sm">Повышайте уровень</p>
                        <p className="text-xs text-muted-foreground">Больше покупок — больше привилегий</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {loyaltyTiers.map((tier) => (
                      <div key={tier.name}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          currentTier.name === tier.name ? "border-primary bg-primary/5 glow-border" : "border-border"
                        }`}>
                        <div className="flex items-center gap-2">
                          <span>{tier.icon}</span>
                          <span className={`font-display font-semibold text-sm ${tier.color}`}>{tier.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">от {tier.min} баллов</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings tab */}
          {activeTab === "settings" && (
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                <Sun size={20} className="text-primary" /> Настройки
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-3">
                    {lightTheme ? <Sun size={20} className="text-primary" /> : <Moon size={20} className="text-primary" />}
                    <div>
                      <p className="font-display font-semibold text-sm">Тема оформления</p>
                      <p className="text-xs text-muted-foreground">{lightTheme ? "Светлая тема" : "Тёмная тема"}</p>
                    </div>
                  </div>
                  <button onClick={toggleTheme}
                    className={`w-14 h-7 rounded-full transition-colors relative ${lightTheme ? "bg-primary" : "bg-muted"}`}>
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all ${lightTheme ? "left-8" : "left-1"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-primary" />
                    <div>
                      <p className="font-display font-semibold text-sm">Email</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-3">
                    <Eye size={20} className="text-primary" />
                    <div>
                      <p className="font-display font-semibold text-sm">Дата регистрации</p>
                      <p className="text-xs text-muted-foreground">{user?.created_at ? new Date(user.created_at).toLocaleDateString("ru-RU") : "—"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default Profile;
