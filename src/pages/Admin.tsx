import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Save, X, Package, ImageIcon, ChevronDown, ChevronUp, KeyRound, Truck, Settings as SettingsIcon, ClipboardList, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { categories, ORDER_STATUSES, Availability } from "@/data/products";

interface ProductForm {
  id?: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: string;
  old_price: string;
  description: string;
  composition: string;
  application: string;
  image: string;
  volume: string;
  volumes: string;
  tags: string;
  availability: Availability;
  preorder_days: string;
}

interface DeliveryMethod {
  id: string;
  label: string;
  price: number;
  desc: string;
}

const emptyForm: ProductForm = {
  name: "", brand: "", category: "styling", subcategory: "", price: "", old_price: "",
  description: "", composition: "", application: "", image: "", volume: "", volumes: "", tags: "",
  availability: "in_stock", preorder_days: "",
};

type Tab = "products" | "orders" | "delivery";

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<any[]>([]);
  const [editing, setEditing] = useState<ProductForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [orderFilter, setOrderFilter] = useState<string>("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [deliverySaving, setDeliverySaving] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/auth"); return; }
    const { data } = await supabase.rpc("is_admin");
    if (data) {
      setAuthed(true);
      fetchProducts();
      fetchOrders();
      fetchDelivery();
    } else {
      setLoading(false);
    }
  };

  useEffect(() => { checkAdmin(); }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      const { data, error } = await supabase.functions.invoke("admin-unlock", { body: { password: pwd } });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message);
      toast({ title: "Доступ открыт ✅" });
      setPwd("");
      await checkAdmin();
    } catch (err: any) {
      toast({ title: "Ошибка", description: err.message || "Неверный пароль", variant: "destructive" });
    } finally {
      setPwdLoading(false);
    }
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
  };

  const fetchDelivery = async () => {
    const { data } = await supabase.from("site_settings").select("value").eq("key", "delivery_methods").maybeSingle();
    if (data?.value) setDeliveryMethods(data.value as unknown as DeliveryMethod[]);
  };

  const saveDelivery = async () => {
    setDeliverySaving(true);
    const { error } = await supabase.from("site_settings").upsert({ key: "delivery_methods", value: deliveryMethods as any });
    setDeliverySaving(false);
    if (error) toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    else toast({ title: "Настройки доставки сохранены ✅" });
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    else { toast({ title: "Статус обновлён ✅" }); fetchOrders(); }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Удалить этот заказ?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    else { toast({ title: "Заказ удалён" }); fetchOrders(); }
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const payload: any = {
      name: editing.name,
      brand: editing.brand,
      category: editing.category,
      subcategory: editing.subcategory || null,
      price: parseFloat(editing.price),
      old_price: editing.old_price ? parseFloat(editing.old_price) : null,
      description: editing.description || null,
      composition: editing.composition || null,
      application: editing.application || null,
      image: editing.image || null,
      volume: editing.volume || null,
      volumes: editing.volumes ? editing.volumes.split(",").map((v: string) => v.trim()).filter(Boolean) : [],
      tags: editing.tags ? editing.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      availability: editing.availability,
      in_stock: editing.availability === "in_stock",
      preorder_days: editing.availability === "preorder" && editing.preorder_days ? parseInt(editing.preorder_days) : null,
    };

    let error;
    if (editing.id) {
      ({ error } = await supabase.from("products").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }

    setSaving(false);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editing.id ? "Товар обновлён ✅" : "Товар добавлен ✅" });
      setEditing(null);
      fetchProducts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот товар?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    else { toast({ title: "Товар удалён" }); fetchProducts(); }
  };

  const startEdit = (p: any) => {
    setEditing({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory || "",
      price: String(p.price),
      old_price: p.old_price ? String(p.old_price) : "",
      description: p.description || "",
      composition: p.composition || "",
      application: p.application || "",
      image: p.image || "",
      volume: p.volume || "",
      volumes: (p.volumes || []).join(", "),
      tags: (p.tags || []).join(", "),
      availability: (p.availability as Availability) || (p.in_stock ? "in_stock" : "preorder"),
      preorder_days: p.preorder_days ? String(p.preorder_days) : "",
    });
    setShowAdvanced(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) { toast({ title: "Ошибка загрузки", variant: "destructive" }); return; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setEditing({ ...editing, image: data.publicUrl });
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  const currentCategory = useMemo(
    () => categories.find((c) => c.slug === editing?.category),
    [editing?.category]
  );

  const filteredOrders = useMemo(
    () => orderFilter ? orders.filter((o) => (o.status || "pending") === orderFilter) : orders,
    [orders, orderFilter]
  );

  const orderCounts = useMemo(() => {
    const m: Record<string, number> = {};
    ORDER_STATUSES.forEach((s) => { m[s.id] = 0; });
    orders.forEach((o) => { const s = o.status || "pending"; m[s] = (m[s] || 0) + 1; });
    return m;
  }, [orders]);

  if (loading) {
    return <main className="pt-24 pb-20 flex items-center justify-center min-h-screen"><div className="animate-pulse text-muted-foreground">Загрузка...</div></main>;
  }

  if (!authed) {
    return (
      <main className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-4">
          <form onSubmit={handleUnlock} className="glass-card rounded-2xl p-8 glow-box space-y-5">
            <div className="text-center">
              <KeyRound size={40} className="mx-auto text-primary mb-3" />
              <h1 className="font-display text-2xl font-bold mb-1">Вход в админ-панель</h1>
              <p className="text-sm text-muted-foreground">Введите пароль доступа</p>
            </div>
            <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Пароль" required autoFocus className={inputClass} />
            <button type="submit" disabled={pwdLoading} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
              {pwdLoading ? "Проверка..." : "Войти"}
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-4xl font-bold">Админ-панель</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto">
          <button onClick={() => setTab("products")} className={`px-4 py-3 font-display font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${tab === "products" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <Package size={16} /> Товары
          </button>
          <button onClick={() => setTab("orders")} className={`px-4 py-3 font-display font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${tab === "orders" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <ClipboardList size={16} /> Заказы {orders.length > 0 && <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs">{orders.length}</span>}
          </button>
          <button onClick={() => setTab("delivery")} className={`px-4 py-3 font-display font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${tab === "delivery" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <Truck size={16} /> Доставка
          </button>
        </div>

        {tab === "products" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold">Управление товарами</h2>
              <button onClick={() => { setEditing({ ...emptyForm }); setShowAdvanced(false); }}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center gap-2 text-sm hover:opacity-90 transition-opacity">
                <Plus size={16} /> Добавить товар
              </button>
            </div>

            {editing && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6 mb-8 glow-box">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold">{editing.id ? "Редактирование" : "Новый товар"}</h2>
                  <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Название *" className={inputClass} />
                  <input value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} placeholder="Бренд *" className={inputClass} />
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Категория</label>
                    <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value, subcategory: "" })} className={inputClass}>
                      {categories.map((c) => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Подкатегория</label>
                    <select value={editing.subcategory} onChange={(e) => setEditing({ ...editing, subcategory: e.target.value })} className={inputClass}>
                      <option value="">— не выбрано —</option>
                      {currentCategory?.subcategories.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                    </select>
                  </div>
                  <input value={editing.volume} onChange={(e) => setEditing({ ...editing, volume: e.target.value })} placeholder="Основной объём (напр. 100 мл)" className={inputClass} />
                  <input value={editing.volumes} onChange={(e) => setEditing({ ...editing, volumes: e.target.value })} placeholder="Доступные объёмы (через запятую)" className={inputClass} />
                  <input value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="Цена (BYN) *" type="number" step="0.01" className={inputClass} />
                  <input value={editing.old_price} onChange={(e) => setEditing({ ...editing, old_price: e.target.value })} placeholder="Старая цена" type="number" step="0.01" className={inputClass} />
                  <input value={editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} placeholder="Теги (хит, новинка, премиум)" className={`col-span-full ${inputClass}`} />

                  {/* Availability */}
                  <div className="col-span-full">
                    <label className="text-xs text-muted-foreground mb-2 block">Статус наличия</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {([
                        { id: "in_stock", label: "В наличии", icon: CheckCircle2, active: "border-emerald-500 bg-emerald-500/10", iconCls: "text-emerald-500" },
                        { id: "preorder", label: "Под заказ", icon: Clock, active: "border-amber-500 bg-amber-500/10", iconCls: "text-amber-500" },
                        { id: "out_of_stock", label: "Нет в наличии", icon: XCircle, active: "border-rose-500 bg-rose-500/10", iconCls: "text-rose-500" },
                      ] as const).map((opt) => (
                        <button type="button" key={opt.id} onClick={() => setEditing({ ...editing, availability: opt.id })}
                          className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${editing.availability === opt.id ? opt.active : "border-border hover:border-muted-foreground"}`}>
                          <opt.icon size={18} className={editing.availability === opt.id ? opt.iconCls : "text-muted-foreground"} />
                          <span className="text-sm font-display font-medium">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {editing.availability === "preorder" && (
                    <div className="col-span-full">
                      <label className="text-xs text-muted-foreground mb-1 block">Срок доставки под заказ (дней)</label>
                      <input value={editing.preorder_days} onChange={(e) => setEditing({ ...editing, preorder_days: e.target.value })} placeholder="Например: 10 или 7-12" className={inputClass} />
                    </div>
                  )}
                </div>

                <button onClick={() => setShowAdvanced(!showAdvanced)}
                  className="mt-4 flex items-center gap-2 text-sm text-primary font-medium hover:underline">
                  {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {showAdvanced ? "Скрыть подробности" : "Описание, состав, применение"}
                </button>

                {showAdvanced && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-4">
                    <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Описание..." rows={3} className={`${inputClass} resize-none`} />
                    <textarea value={editing.composition} onChange={(e) => setEditing({ ...editing, composition: e.target.value })} placeholder="Состав..." rows={3} className={`${inputClass} resize-none`} />
                    <textarea value={editing.application} onChange={(e) => setEditing({ ...editing, application: e.target.value })} placeholder="Применение..." rows={3} className={`${inputClass} resize-none`} />
                  </motion.div>
                )}

                <div className="mt-4">
                  <label className="text-xs text-muted-foreground mb-1 block">Изображение</label>
                  <div className="flex items-center gap-4">
                    <input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder="URL изображения"
                      className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    <label className="px-4 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-2 transition-colors">
                      <ImageIcon size={16} /> Загрузить
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  {editing.image && <img src={editing.image} alt="" className="mt-3 w-24 h-24 rounded-lg object-cover" />}
                </div>

                <button onClick={handleSave} disabled={saving || !editing.name || !editing.brand || !editing.price}
                  className="mt-6 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                  <Save size={16} /> {saving ? "Сохранение..." : "Сохранить"}
                </button>
              </motion.div>
            )}

            <div className="space-y-3">
              {products.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Package size={48} className="mx-auto mb-4" />
                  <p>Товары пока не добавлены</p>
                </div>
              ) : (
                products.map((p) => {
                  const av = (p.availability as Availability) || (p.in_stock ? "in_stock" : "preorder");
                  const avBadge = av === "in_stock"
                    ? { cls: "bg-emerald-500/15 text-emerald-500", label: "В наличии" }
                    : av === "preorder"
                    ? { cls: "bg-amber-500/15 text-amber-500", label: `Под заказ${p.preorder_days ? ` · ${p.preorder_days} дн.` : ""}` }
                    : { cls: "bg-rose-500/15 text-rose-500", label: "Нет в наличии" };
                  return (
                    <div key={p.id} className="flex items-center gap-4 p-4 glass-card rounded-xl">
                      {p.image && <img src={p.image} alt={p.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-sm line-clamp-1">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.brand} · {p.category}{p.subcategory ? ` / ${p.subcategory}` : ""}{p.volume ? ` · ${p.volume}` : ""}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${avBadge.cls}`}>{avBadge.label}</span>
                      <span className="font-display font-bold shrink-0">{Number(p.price).toFixed(2)} BYN</span>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => startEdit(p)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {tab === "orders" && (
          <>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="font-display text-2xl font-semibold">Заказы</h2>
              <button onClick={fetchOrders} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-secondary transition-colors">Обновить</button>
            </div>

            {/* Status filter chips */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button onClick={() => setOrderFilter("")} className={`px-3 py-1.5 rounded-full text-xs font-display font-medium border transition-all ${!orderFilter ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                Все · {orders.length}
              </button>
              {ORDER_STATUSES.map((s) => (
                <button key={s.id} onClick={() => setOrderFilter(s.id)} className={`px-3 py-1.5 rounded-full text-xs font-display font-medium border transition-all ${orderFilter === s.id ? s.color : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {s.label} · {orderCounts[s.id] || 0}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <ClipboardList size={48} className="mx-auto mb-4" />
                <p>Заказов пока нет</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((o) => {
                  const status = o.status || "pending";
                  const statusInfo = ORDER_STATUSES.find((s) => s.id === status) || ORDER_STATUSES[0];
                  const expanded = expandedOrder === o.id;
                  return (
                    <motion.div key={o.id} layout className="glass-card rounded-xl overflow-hidden">
                      <div className="p-4 flex items-center gap-4 flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-display font-semibold text-sm">#{o.id.slice(0, 8)}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusInfo.color}`}>{statusInfo.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{o.customer_name} · {o.customer_phone}</p>
                          <p className="text-[11px] text-muted-foreground">{new Date(o.created_at).toLocaleString("ru-RU")}</p>
                        </div>
                        <div className="font-display font-bold">{Number(o.total).toFixed(2)} BYN</div>
                        <select value={status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} className="px-3 py-2 rounded-lg bg-secondary border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/50">
                          {ORDER_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                        <button onClick={() => setExpandedOrder(expanded ? null : o.id)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <button onClick={() => deleteOrder(o.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {expanded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border-t border-border bg-secondary/30">
                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Доставка</p>
                              <p>{o.delivery_method} — {o.delivery_address}</p>
                              <p className="text-xs text-muted-foreground mt-3 mb-1">Оплата</p>
                              <p>{o.payment_method}</p>
                              {o.customer_email && (<><p className="text-xs text-muted-foreground mt-3 mb-1">Email</p><p>{o.customer_email}</p></>)}
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Товары</p>
                              <div className="space-y-1">
                                {(o.items as any[]).map((it, i) => (
                                  <div key={i} className="flex justify-between text-xs">
                                    <span className="text-muted-foreground line-clamp-1 mr-2">{it.name} × {it.quantity}</span>
                                    <span className="shrink-0">{(it.price * it.quantity).toFixed(2)} BYN</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {tab === "delivery" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold flex items-center gap-2"><SettingsIcon size={22} /> Способы и цены доставки</h2>
              <button onClick={() => setDeliveryMethods([...deliveryMethods, { id: `method_${Date.now()}`, label: "Новый способ", price: 0, desc: "" }])}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center gap-2 text-sm hover:opacity-90 transition-opacity">
                <Plus size={16} /> Добавить способ
              </button>
            </div>
            <div className="space-y-3 mb-6">
              {deliveryMethods.map((m, idx) => (
                <div key={idx} className="glass-card rounded-xl p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <input value={m.label} onChange={(e) => { const arr = [...deliveryMethods]; arr[idx].label = e.target.value; setDeliveryMethods(arr); }}
                    placeholder="Название" className={`md:col-span-4 ${inputClass}`} />
                  <input value={m.desc} onChange={(e) => { const arr = [...deliveryMethods]; arr[idx].desc = e.target.value; setDeliveryMethods(arr); }}
                    placeholder="Описание" className={`md:col-span-5 ${inputClass}`} />
                  <input type="number" step="0.01" value={m.price} onChange={(e) => { const arr = [...deliveryMethods]; arr[idx].price = parseFloat(e.target.value) || 0; setDeliveryMethods(arr); }}
                    placeholder="BYN" className={`md:col-span-2 ${inputClass}`} />
                  <button onClick={() => setDeliveryMethods(deliveryMethods.filter((_, i) => i !== idx))}
                    className="md:col-span-1 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors justify-self-center">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {deliveryMethods.length === 0 && (
                <p className="text-center text-muted-foreground py-10">Способы доставки не добавлены</p>
              )}
            </div>
            <button onClick={saveDelivery} disabled={deliverySaving}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
              <Save size={16} /> {deliverySaving ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;
