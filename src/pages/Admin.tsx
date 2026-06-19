import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Save, X, Package, ImageIcon, ChevronDown, ChevronUp, KeyRound, Truck, Settings as SettingsIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/data/products";

interface ProductForm {
  id?: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  old_price: string;
  description: string;
  composition: string;
  application: string;
  image: string;
  volume: string;
  volumes: string;
  tags: string;
  in_stock: boolean;
}

interface DeliveryMethod {
  id: string;
  label: string;
  price: number;
  desc: string;
}

const emptyForm: ProductForm = {
  name: "", brand: "", category: "styling", price: "", old_price: "",
  description: "", composition: "", application: "", image: "", volume: "", volumes: "", tags: "", in_stock: true,
};

type Tab = "products" | "delivery";

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

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = {
      name: editing.name,
      brand: editing.brand,
      category: editing.category,
      price: parseFloat(editing.price),
      old_price: editing.old_price ? parseFloat(editing.old_price) : null,
      description: editing.description || null,
      composition: editing.composition || null,
      application: editing.application || null,
      image: editing.image || null,
      volume: editing.volume || null,
      volumes: editing.volumes ? editing.volumes.split(",").map((v: string) => v.trim()).filter(Boolean) : [],
      tags: editing.tags ? editing.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      in_stock: editing.in_stock,
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
      price: String(p.price),
      old_price: p.old_price ? String(p.old_price) : "",
      description: p.description || "",
      composition: p.composition || "",
      application: p.application || "",
      image: p.image || "",
      volume: p.volume || "",
      volumes: (p.volumes || []).join(", "),
      tags: (p.tags || []).join(", "),
      in_stock: p.in_stock,
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
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-4xl font-bold">Админ-панель</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button onClick={() => setTab("products")} className={`px-4 py-3 font-display font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${tab === "products" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <Package size={16} /> Товары
          </button>
          <button onClick={() => setTab("delivery")} className={`px-4 py-3 font-display font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${tab === "delivery" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
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
                  <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className={inputClass}>
                    {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                  <input value={editing.volume} onChange={(e) => setEditing({ ...editing, volume: e.target.value })} placeholder="Основной объём (напр. 100 мл)" className={inputClass} />
                  <input value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="Цена (BYN) *" type="number" step="0.01" className={inputClass} />
                  <input value={editing.old_price} onChange={(e) => setEditing({ ...editing, old_price: e.target.value })} placeholder="Старая цена" type="number" step="0.01" className={inputClass} />
                  <input value={editing.volumes} onChange={(e) => setEditing({ ...editing, volumes: e.target.value })} placeholder="Доступные объёмы (через запятую: 50мл, 100мл, 200мл)" className={`col-span-full ${inputClass}`} />
                  <input value={editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} placeholder="Теги (через запятую: хит, новинка, премиум)" className={inputClass} />
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editing.in_stock} onChange={(e) => setEditing({ ...editing, in_stock: e.target.checked })} className="w-4 h-4 rounded accent-primary" />
                      <span className="text-sm">В наличии</span>
                    </label>
                  </div>
                </div>

                <button onClick={() => setShowAdvanced(!showAdvanced)}
                  className="mt-4 flex items-center gap-2 text-sm text-primary font-medium hover:underline">
                  {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {showAdvanced ? "Скрыть подробности" : "Описание, состав, применение"}
                </button>

                {showAdvanced && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Описание товара</label>
                      <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Подробное описание товара..." rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Состав</label>
                      <textarea value={editing.composition} onChange={(e) => setEditing({ ...editing, composition: e.target.value })} placeholder="Состав продукта..." rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Применение</label>
                      <textarea value={editing.application} onChange={(e) => setEditing({ ...editing, application: e.target.value })} placeholder="Инструкция по применению..." rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                    </div>
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
                products.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4 glass-card rounded-xl">
                    {p.image && <img src={p.image} alt={p.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.brand} · {p.category} {p.volume ? `· ${p.volume}` : ""}</p>
                      {p.volumes && p.volumes.length > 0 && (
                        <p className="text-xs text-primary mt-0.5">Объёмы: {p.volumes.join(", ")}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${p.in_stock ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                      {p.in_stock ? "В наличии" : "Под заказ"}
                    </span>
                    <span className="font-display font-bold shrink-0">{Number(p.price).toFixed(2)} BYN</span>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => startEdit(p)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
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
