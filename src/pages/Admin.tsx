import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Plus, Pencil, Trash2, Save, X, Package, ImageIcon, ChevronDown, ChevronUp, KeyRound, Truck,
  Settings as SettingsIcon, ClipboardList, CheckCircle2, Clock, XCircle, Tag, MessageCircle, Send, User as UserIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { categories, ORDER_STATUSES, Availability, VolumeVariant, HOME_SECTIONS } from "@/data/products";

interface ProductForm {
  id?: string;
  name: string;
  brand: string;
  category: string;
  subcategories: string[];
  price: string;
  old_price: string;
  description: string;
  composition: string;
  application: string;
  image: string;
  volume: string;
  volume_variants: VolumeVariant[];
  tags: string;
  availability: Availability;
  preorder_days: string;
  home_sections: string[];
}

interface DeliveryMethod { id: string; label: string; price: number; desc: string }
interface PromoForm { id?: string; code: string; type: "percent" | "fixed" | "free_shipping"; value: string; min_order: string; max_uses: string; active: boolean; expires_at: string }

const emptyForm: ProductForm = {
  name: "", brand: "", category: "styling", subcategories: [], price: "", old_price: "",
  description: "", composition: "", application: "", image: "", volume: "", volume_variants: [], tags: "",
  availability: "in_stock", preorder_days: "", home_sections: [],
};

const emptyPromo: PromoForm = { code: "", type: "percent", value: "", min_order: "", max_uses: "", active: true, expires_at: "" };

type Tab = "products" | "orders" | "delivery" | "promo" | "support";

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

  // Promo codes
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [promoEditing, setPromoEditing] = useState<PromoForm | null>(null);
  const [promoSaving, setPromoSaving] = useState(false);

  // Support chats
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [replySending, setReplySending] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/auth"); return; }
    const { data } = await supabase.rpc("is_admin");
    if (data) {
      setAuthed(true);
      fetchProducts(); fetchOrders(); fetchDelivery(); fetchPromos(); fetchChats();
    } else {
      setLoading(false);
    }
  };

  useEffect(() => { checkAdmin(); }, []);

  // Realtime: refresh chats list on new messages
  useEffect(() => {
    if (!authed) return;
    const ch = supabase
      .channel("admin-chats")
      .on("postgres_changes", { event: "*", schema: "public", table: "support_chats" }, () => fetchChats())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "support_messages" }, () => fetchChats())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [authed]);

  // Realtime: subscribe to messages of selected chat
  useEffect(() => {
    if (!selectedChatId) { setChatMessages([]); return; }
    const load = async () => {
      const { data } = await supabase.from("support_messages").select("*").eq("chat_id", selectedChatId).order("created_at");
      setChatMessages(data || []);
      setTimeout(() => chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" }), 50);
    };
    load();
    const ch = supabase
      .channel(`admin-chat-${selectedChatId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "support_messages", filter: `chat_id=eq.${selectedChatId}` }, (p) => {
        setChatMessages((prev) => [...prev, p.new]);
        setTimeout(() => chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" }), 50);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [selectedChatId]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      const { data, error } = await supabase.functions.invoke("admin-unlock", { body: { password: pwd } });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message);
      toast({ title: "Доступ открыт ✅" });
      setPwd(""); await checkAdmin();
    } catch (err: any) {
      toast({ title: "Ошибка", description: err.message || "Неверный пароль", variant: "destructive" });
    } finally { setPwdLoading(false); }
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []); setLoading(false);
  };
  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
  };
  const fetchDelivery = async () => {
    const { data } = await supabase.from("site_settings").select("value").eq("key", "delivery_methods").maybeSingle();
    if (data?.value) setDeliveryMethods(data.value as unknown as DeliveryMethod[]);
  };
  const fetchPromos = async () => {
    const { data } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
    setPromoCodes(data || []);
  };
  const fetchChats = async () => {
    const { data } = await supabase.from("support_chats").select("*").order("last_message_at", { ascending: false });
    setChats(data || []);
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
      subcategory: editing.subcategories[0] || null,
      subcategories: editing.subcategories,
      price: parseFloat(editing.price),
      old_price: editing.old_price ? parseFloat(editing.old_price) : null,
      description: editing.description || null,
      composition: editing.composition || null,
      application: editing.application || null,
      image: editing.image || null,
      volume: editing.volume || null,
      volume_variants: editing.volume_variants.filter((v) => v.volume && v.price > 0),
      tags: editing.tags ? editing.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      availability: editing.availability,
      in_stock: editing.availability === "in_stock",
      preorder_days: editing.availability === "preorder" && editing.preorder_days ? parseInt(editing.preorder_days) : null,
      home_sections: editing.home_sections,
    };

    let error;
    if (editing.id) ({ error } = await supabase.from("products").update(payload).eq("id", editing.id));
    else ({ error } = await supabase.from("products").insert(payload));

    setSaving(false);
    if (error) toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    else { toast({ title: editing.id ? "Товар обновлён ✅" : "Товар добавлен ✅" }); setEditing(null); fetchProducts(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот товар?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    else { toast({ title: "Товар удалён" }); fetchProducts(); }
  };

  const startEdit = (p: any) => {
    const subs: string[] = Array.isArray(p.subcategories) && p.subcategories.length
      ? p.subcategories
      : p.subcategory ? [p.subcategory] : [];
    const variants: VolumeVariant[] = Array.isArray(p.volume_variants) ? p.volume_variants.map((v: any) => ({ volume: String(v.volume || ""), price: Number(v.price) || 0 })) : [];
    setEditing({
      id: p.id, name: p.name, brand: p.brand, category: p.category,
      subcategories: subs,
      price: String(p.price), old_price: p.old_price ? String(p.old_price) : "",
      description: p.description || "", composition: p.composition || "", application: p.application || "",
      image: p.image || "", volume: p.volume || "",
      volume_variants: variants,
      tags: (p.tags || []).join(", "),
      availability: (p.availability as Availability) || (p.in_stock ? "in_stock" : "preorder"),
      preorder_days: p.preorder_days ? String(p.preorder_days) : "",
      home_sections: Array.isArray(p.home_sections) ? p.home_sections : [],
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

  const toggleSubcategory = (slug: string) => {
    if (!editing) return;
    const has = editing.subcategories.includes(slug);
    setEditing({ ...editing, subcategories: has ? editing.subcategories.filter((s) => s !== slug) : [...editing.subcategories, slug] });
  };

  const addVariant = () => editing && setEditing({ ...editing, volume_variants: [...editing.volume_variants, { volume: "", price: 0 }] });
  const updateVariant = (i: number, patch: Partial<VolumeVariant>) => {
    if (!editing) return;
    const next = [...editing.volume_variants];
    next[i] = { ...next[i], ...patch };
    setEditing({ ...editing, volume_variants: next });
  };
  const removeVariant = (i: number) => editing && setEditing({ ...editing, volume_variants: editing.volume_variants.filter((_, idx) => idx !== i) });

  // Promo code handlers
  const savePromo = async () => {
    if (!promoEditing) return;
    setPromoSaving(true);
    const payload: any = {
      code: promoEditing.code.trim().toUpperCase(),
      type: promoEditing.type,
      value: parseFloat(promoEditing.value) || 0,
      min_order: promoEditing.min_order ? parseFloat(promoEditing.min_order) : 0,
      max_uses: promoEditing.max_uses ? parseInt(promoEditing.max_uses) : null,
      active: promoEditing.active,
      expires_at: promoEditing.expires_at ? new Date(promoEditing.expires_at).toISOString() : null,
    };
    let error;
    if (promoEditing.id) ({ error } = await supabase.from("promo_codes").update(payload).eq("id", promoEditing.id));
    else ({ error } = await supabase.from("promo_codes").insert(payload));
    setPromoSaving(false);
    if (error) toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    else { toast({ title: promoEditing.id ? "Промокод обновлён ✅" : "Промокод создан ✅" }); setPromoEditing(null); fetchPromos(); }
  };

  const deletePromo = async (id: string) => {
    if (!confirm("Удалить промокод?")) return;
    const { error } = await supabase.from("promo_codes").delete().eq("id", id);
    if (error) toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    else { toast({ title: "Удалено" }); fetchPromos(); }
  };

  const sendReply = async () => {
    if (!selectedChatId || !replyText.trim() || replySending) return;
    setReplySending(true);
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.from("support_messages").insert({
      chat_id: selectedChatId, sender: "admin", author_id: session?.user.id || null, body: replyText.trim().slice(0, 2000),
    });
    if (!error) {
      await supabase.from("support_chats").update({ last_message_at: new Date().toISOString() }).eq("id", selectedChatId);
      setReplyText("");
    } else toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    setReplySending(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";
  const currentCategory = useMemo(() => categories.find((c) => c.slug === editing?.category), [editing?.category]);
  const filteredOrders = useMemo(() => orderFilter ? orders.filter((o) => (o.status || "pending") === orderFilter) : orders, [orders, orderFilter]);
  const orderCounts = useMemo(() => {
    const m: Record<string, number> = {};
    ORDER_STATUSES.forEach((s) => { m[s.id] = 0; });
    orders.forEach((o) => { const s = o.status || "pending"; m[s] = (m[s] || 0) + 1; });
    return m;
  }, [orders]);
  const selectedChat = chats.find((c) => c.id === selectedChatId);

  if (loading) return <main className="pt-24 pb-20 flex items-center justify-center min-h-screen"><div className="animate-pulse text-muted-foreground">Загрузка...</div></main>;

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

  const unreadChatsCount = chats.filter((c) => (c.unread_for_admin || 0) > 0).length;

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Админ-панель</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-8 border-b border-border overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          {([
            { id: "products" as Tab, label: "Товары", icon: Package },
            { id: "orders" as Tab, label: "Заказы", icon: ClipboardList, count: orders.length },
            { id: "promo" as Tab, label: "Промокоды", icon: Tag, count: promoCodes.length },
            { id: "delivery" as Tab, label: "Доставка", icon: Truck },
            { id: "support" as Tab, label: "Чат поддержки", icon: MessageCircle, count: chats.length },
          ]).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 sm:px-4 py-3 font-display font-medium text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <t.icon size={16} /> {t.label}
              {t.count != null && t.count > 0 && <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px]">{t.count}</span>}
            </button>
          ))}
        </div>

        {/* PRODUCTS */}
        {tab === "products" && (
          <>
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <h2 className="font-display text-xl sm:text-2xl font-semibold">Управление товарами</h2>
              <button onClick={() => { setEditing({ ...emptyForm }); setShowAdvanced(false); }}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center gap-2 text-sm hover:opacity-90 transition-opacity">
                <Plus size={16} /> Добавить товар
              </button>
            </div>

            {editing && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 sm:p-6 mb-8 glow-box">
                <div className="flex items-center justify-between mb-6 gap-4">
                  <h2 className="font-display text-lg sm:text-xl font-semibold">{editing.id ? "Редактирование" : "Новый товар"}</h2>
                  <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Название *" className={inputClass} />
                  <input value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} placeholder="Бренд *" className={inputClass} />
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">Категория</label>
                    <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value, subcategories: [] })} className={inputClass}>
                      {categories.map((c) => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground mb-2 block">Подкатегории (можно несколько)</label>
                    <div className="flex flex-wrap gap-2">
                      {(currentCategory?.subcategories || []).map((s) => {
                        const active = editing.subcategories.includes(s.slug);
                        return (
                          <button type="button" key={s.slug} onClick={() => toggleSubcategory(s.slug)}
                            className={`px-3 py-1.5 rounded-full text-xs font-display border transition-all inline-flex items-center gap-1.5 ${active ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"}`}>
                            {s.icon && <span>{s.icon}</span>}{s.name}
                          </button>
                        );
                      })}
                      {!currentCategory?.subcategories.length && <p className="text-xs text-muted-foreground">У выбранной категории нет подкатегорий.</p>}
                    </div>
                  </div>
                  <input value={editing.volume} onChange={(e) => setEditing({ ...editing, volume: e.target.value })} placeholder="Основной объём (напр. 100 мл)" className={inputClass} />
                  <input value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="Цена (BYN) *" type="number" step="0.01" className={inputClass} />
                  <input value={editing.old_price} onChange={(e) => setEditing({ ...editing, old_price: e.target.value })} placeholder="Старая цена" type="number" step="0.01" className={inputClass} />
                  <input value={editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} placeholder="Теги (хит, новинка, премиум)" className={`md:col-span-2 ${inputClass}`} />

                  {/* Volume variants */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-muted-foreground">Варианты объёма с разной ценой (опц.)</label>
                      <button type="button" onClick={addVariant} className="text-xs text-primary hover:underline inline-flex items-center gap-1"><Plus size={12} /> Добавить вариант</button>
                    </div>
                    {editing.volume_variants.length === 0 ? (
                      <p className="text-xs text-muted-foreground p-3 rounded-lg bg-secondary/40 border border-dashed border-border">
                        Если у товара несколько объёмов с разной ценой — добавьте их здесь. Покупатель сможет выбрать объём прямо на карточке.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {editing.volume_variants.map((v, i) => (
                          <div key={i} className="grid grid-cols-12 gap-2 items-center">
                            <input value={v.volume} onChange={(e) => updateVariant(i, { volume: e.target.value })}
                              placeholder="Напр. 100 мл" className={`col-span-5 ${inputClass}`} />
                            <input value={v.price || ""} onChange={(e) => updateVariant(i, { price: parseFloat(e.target.value) || 0 })}
                              placeholder="Цена" type="number" step="0.01" className={`col-span-5 ${inputClass}`} />
                            <button type="button" onClick={() => removeVariant(i)} className="col-span-2 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors justify-self-center"><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="md:col-span-2">
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
                    <div className="md:col-span-2">
                      <label className="text-xs text-muted-foreground mb-1 block">Срок доставки под заказ (дней). Отображается на карточке товара.</label>
                      <input value={editing.preorder_days} onChange={(e) => setEditing({ ...editing, preorder_days: e.target.value })} placeholder="Например: 10" type="number" className={inputClass} />
                    </div>
                  )}

                  {/* Home sections */}
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground mb-2 block">
                      Показ на главной странице <span className="text-muted-foreground/70">(можно выбрать несколько блоков)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {HOME_SECTIONS.map((s) => {
                        const active = editing.home_sections.includes(s.id);
                        return (
                          <button type="button" key={s.id}
                            onClick={() => setEditing({
                              ...editing,
                              home_sections: active
                                ? editing.home_sections.filter((x) => x !== s.id)
                                : [...editing.home_sections, s.id],
                            })}
                            className={`px-3 py-1.5 rounded-full text-xs font-display border transition-all inline-flex items-center gap-1.5 ${active ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"}`}>
                            <span>{s.icon}</span>{s.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-2">
                      Если ни один блок не выбран, товар попадёт на главную по старым правилам (теги «хит/новинка/премиум» и категория).
                    </p>
                  </div>
                </div>


                <button onClick={() => setShowAdvanced(!showAdvanced)} className="mt-4 flex items-center gap-2 text-sm text-primary font-medium hover:underline">
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
                  <div className="flex items-center gap-4 flex-wrap">
                    <input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder="URL изображения" className={`flex-1 min-w-[200px] ${inputClass}`} />
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
              ) : products.map((p) => {
                const av = (p.availability as Availability) || (p.in_stock ? "in_stock" : "preorder");
                const avBadge = av === "in_stock"
                  ? { cls: "bg-emerald-500/15 text-emerald-500", label: "В наличии" }
                  : av === "preorder"
                  ? { cls: "bg-amber-500/15 text-amber-500", label: `Под заказ${p.preorder_days ? ` · ${p.preorder_days} дн.` : ""}` }
                  : { cls: "bg-rose-500/15 text-rose-500", label: "Нет в наличии" };
                const subsCount = Array.isArray(p.subcategories) ? p.subcategories.length : (p.subcategory ? 1 : 0);
                const variantsCount = Array.isArray(p.volume_variants) ? p.volume_variants.length : 0;
                return (
                  <div key={p.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-card rounded-xl flex-wrap">
                    {p.image && <img src={p.image} alt={p.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />}
                    <div className="flex-1 min-w-[140px]">
                      <p className="font-display font-semibold text-sm line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.brand} · {p.category}
                        {subsCount > 0 && ` · ${subsCount} подкат.`}
                        {variantsCount > 0 && ` · ${variantsCount} объёма`}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${avBadge.cls}`}>{avBadge.label}</span>
                    <span className="font-display font-bold shrink-0">{Number(p.price).toFixed(2)} BYN</span>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => startEdit(p)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ORDERS */}
        {tab === "orders" && (
          <>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="font-display text-xl sm:text-2xl font-semibold">Заказы</h2>
              <button onClick={fetchOrders} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-secondary transition-colors">Обновить</button>
            </div>

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
                      <div className="p-4 flex items-center gap-3 flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-display font-semibold text-sm">#{o.id.slice(0, 8)}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusInfo.color}`}>{statusInfo.label}</span>
                            {o.promo_code && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">🏷 {o.promo_code}</span>}
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
                              <p className="break-words">{o.delivery_method} — {o.delivery_address}</p>
                              <p className="text-xs text-muted-foreground mt-3 mb-1">Оплата</p>
                              <p>{o.payment_method}</p>
                              {o.customer_email && (<><p className="text-xs text-muted-foreground mt-3 mb-1">Email</p><p className="break-words">{o.customer_email}</p></>)}
                              {Number(o.discount) > 0 && (<><p className="text-xs text-muted-foreground mt-3 mb-1">Скидка</p><p className="text-primary">−{Number(o.discount).toFixed(2)} BYN</p></>)}
                              {o.notes && (<><p className="text-xs text-muted-foreground mt-3 mb-1">Комментарий</p><p className="whitespace-pre-wrap">{o.notes}</p></>)}
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Товары</p>
                              <div className="space-y-1">
                                {(o.items as any[]).map((it, i) => (
                                  <div key={i} className="flex justify-between text-xs gap-2">
                                    <span className="text-muted-foreground line-clamp-2 mr-2">{it.name}{it.selectedVolume ? ` · ${it.selectedVolume}` : ""} × {it.quantity}</span>
                                    <span className="shrink-0">{(Number(it.price) * Number(it.quantity)).toFixed(2)} BYN</span>
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

        {/* DELIVERY */}
        {tab === "delivery" && (
          <div>
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <h2 className="font-display text-xl sm:text-2xl font-semibold flex items-center gap-2"><SettingsIcon size={22} /> Способы и цены доставки</h2>
              <button onClick={() => setDeliveryMethods([...deliveryMethods, { id: `method_${Date.now()}`, label: "Новый способ", price: 0, desc: "" }])}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center gap-2 text-sm hover:opacity-90 transition-opacity">
                <Plus size={16} /> Добавить способ
              </button>
            </div>
            <div className="space-y-3 mb-6">
              {deliveryMethods.map((m, idx) => (
                <div key={idx} className="glass-card rounded-xl p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <input value={m.label} onChange={(e) => { const arr = [...deliveryMethods]; arr[idx].label = e.target.value; setDeliveryMethods(arr); }} placeholder="Название" className={`md:col-span-4 ${inputClass}`} />
                  <input value={m.desc} onChange={(e) => { const arr = [...deliveryMethods]; arr[idx].desc = e.target.value; setDeliveryMethods(arr); }} placeholder="Описание (срок и т.п.)" className={`md:col-span-5 ${inputClass}`} />
                  <input type="number" step="0.01" value={m.price} onChange={(e) => { const arr = [...deliveryMethods]; arr[idx].price = parseFloat(e.target.value) || 0; setDeliveryMethods(arr); }} placeholder="BYN" className={`md:col-span-2 ${inputClass}`} />
                  <button onClick={() => setDeliveryMethods(deliveryMethods.filter((_, i) => i !== idx))} className="md:col-span-1 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors justify-self-center"><Trash2 size={16} /></button>
                </div>
              ))}
              {deliveryMethods.length === 0 && <p className="text-center text-muted-foreground py-10">Способы доставки не добавлены</p>}
            </div>
            <button onClick={saveDelivery} disabled={deliverySaving} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
              <Save size={16} /> {deliverySaving ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </div>
        )}

        {/* PROMO CODES */}
        {tab === "promo" && (
          <div>
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <h2 className="font-display text-xl sm:text-2xl font-semibold flex items-center gap-2"><Tag size={22} /> Промокоды</h2>
              <button onClick={() => setPromoEditing({ ...emptyPromo })} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center gap-2 text-sm hover:opacity-90 transition-opacity">
                <Plus size={16} /> Создать промокод
              </button>
            </div>

            {promoEditing && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 sm:p-6 mb-6 glow-box">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-semibold">{promoEditing.id ? "Редактирование" : "Новый промокод"}</h3>
                  <button onClick={() => setPromoEditing(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={promoEditing.code} onChange={(e) => setPromoEditing({ ...promoEditing, code: e.target.value.toUpperCase() })} placeholder="Код (BEU2026) *" className={`${inputClass} font-mono uppercase`} />
                  <select value={promoEditing.type} onChange={(e) => setPromoEditing({ ...promoEditing, type: e.target.value as any })} className={inputClass}>
                    <option value="percent">Скидка %</option>
                    <option value="fixed">Скидка BYN</option>
                    <option value="free_shipping">Бесплатная доставка</option>
                  </select>
                  {promoEditing.type !== "free_shipping" && (
                    <input type="number" step="0.01" value={promoEditing.value} onChange={(e) => setPromoEditing({ ...promoEditing, value: e.target.value })} placeholder={promoEditing.type === "percent" ? "Размер скидки %" : "Сумма скидки BYN"} className={inputClass} />
                  )}
                  <input type="number" step="0.01" value={promoEditing.min_order} onChange={(e) => setPromoEditing({ ...promoEditing, min_order: e.target.value })} placeholder="Мин. сумма заказа (опц.)" className={inputClass} />
                  <input type="number" value={promoEditing.max_uses} onChange={(e) => setPromoEditing({ ...promoEditing, max_uses: e.target.value })} placeholder="Лимит использований (опц.)" className={inputClass} />
                  <input type="date" value={promoEditing.expires_at} onChange={(e) => setPromoEditing({ ...promoEditing, expires_at: e.target.value })} className={inputClass} />
                  <label className="flex items-center gap-2 md:col-span-2 text-sm">
                    <input type="checkbox" checked={promoEditing.active} onChange={(e) => setPromoEditing({ ...promoEditing, active: e.target.checked })} className="w-4 h-4 accent-primary" />
                    Промокод активен
                  </label>
                </div>
                <button onClick={savePromo} disabled={promoSaving || !promoEditing.code} className="mt-5 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                  <Save size={16} /> {promoSaving ? "Сохранение..." : "Сохранить"}
                </button>
              </motion.div>
            )}

            <div className="space-y-3">
              {promoCodes.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground"><Tag size={48} className="mx-auto mb-4" /><p>Промокодов пока нет</p></div>
              ) : promoCodes.map((p) => (
                <div key={p.id} className="glass-card rounded-xl p-4 flex items-center gap-3 flex-wrap">
                  <div className="flex-1 min-w-[140px]">
                    <p className="font-mono font-bold text-primary">{p.code}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.type === "percent" && `−${p.value}%`}
                      {p.type === "fixed" && `−${p.value} BYN`}
                      {p.type === "free_shipping" && "Бесплатная доставка"}
                      {p.min_order > 0 && ` · от ${p.min_order} BYN`}
                      {p.max_uses && ` · ${p.uses_count}/${p.max_uses}`}
                      {p.expires_at && ` · до ${new Date(p.expires_at).toLocaleDateString("ru-RU")}`}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${p.active ? "bg-emerald-500/15 text-emerald-500" : "bg-muted text-muted-foreground"}`}>{p.active ? "Активен" : "Выключен"}</span>
                  <button onClick={() => setPromoEditing({
                    id: p.id, code: p.code, type: p.type, value: String(p.value),
                    min_order: p.min_order ? String(p.min_order) : "", max_uses: p.max_uses ? String(p.max_uses) : "",
                    active: p.active, expires_at: p.expires_at ? new Date(p.expires_at).toISOString().slice(0, 10) : "",
                  })} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => deletePromo(p.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUPPORT CHAT */}
        {tab === "support" && (
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-2"><MessageCircle size={22} /> Чат с клиентами</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[60vh]">
              {/* List */}
              <div className="glass-card rounded-2xl p-3 overflow-y-auto max-h-[70vh]">
                {chats.length === 0 ? (
                  <p className="text-center text-muted-foreground p-6 text-sm">Чатов пока нет</p>
                ) : chats.map((c) => (
                  <button key={c.id} onClick={() => setSelectedChatId(c.id)}
                    className={`w-full text-left p-3 rounded-xl mb-1 transition-all ${selectedChatId === c.id ? "bg-primary/10 border border-primary/40" : "hover:bg-secondary/60"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <UserIcon size={14} className="text-muted-foreground" />
                      <span className="font-display font-semibold text-sm truncate">{c.guest_name || (c.user_id ? `Пользователь ${String(c.user_id).slice(0, 6)}` : "Гость")}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{new Date(c.last_message_at).toLocaleString("ru-RU")}</p>
                  </button>
                ))}
              </div>

              {/* Conversation */}
              <div className="md:col-span-2 glass-card rounded-2xl flex flex-col max-h-[70vh] overflow-hidden">
                {!selectedChatId ? (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Выберите чат слева</div>
                ) : (
                  <>
                    <div className="p-4 border-b border-border flex items-center gap-2">
                      <UserIcon size={16} className="text-primary" />
                      <span className="font-display font-semibold">{selectedChat?.guest_name || (selectedChat?.user_id ? "Авторизованный клиент" : "Гость")}</span>
                    </div>
                    <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
                      {chatMessages.length === 0 && <p className="text-center text-xs text-muted-foreground py-10">Сообщений пока нет</p>}
                      {chatMessages.map((m) => (
                        <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${m.sender === "admin" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
                            {m.body}
                            <p className="text-[10px] opacity-60 mt-1">{new Date(m.created_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border p-3 flex gap-2">
                      <input value={replyText} onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") sendReply(); }}
                        placeholder="Ответ клиенту..." className={`flex-1 ${inputClass}`} />
                      <button onClick={sendReply} disabled={replySending || !replyText.trim()} className="px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                        <Send size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;
