import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Save, X, Package, ImageIcon } from "lucide-react";
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
  image: string;
  volume: string;
  tags: string;
  in_stock: boolean;
}

const emptyForm: ProductForm = {
  name: "", brand: "", category: "styling", price: "", old_price: "",
  description: "", image: "", volume: "", tags: "", in_stock: true,
};

const Admin = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [editing, setEditing] = useState<ProductForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      const { data, error } = await supabase.rpc("is_admin");
      if (error || !data) {
        toast({ title: "Доступ запрещён", variant: "destructive" });
        navigate("/profile");
        return;
      }
      fetchProducts();
    };
    checkAdmin();
  }, [navigate, toast]);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
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
      description: editing.description,
      image: editing.image,
      volume: editing.volume || null,
      tags: editing.tags ? editing.tags.split(",").map((t) => t.trim()) : [],
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
      toast({ title: editing.id ? "Товар обновлён" : "Товар добавлен" });
      setEditing(null);
      fetchProducts();
    }
  };

  const handleDelete = async (id: string) => {
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
      image: p.image || "",
      volume: p.volume || "",
      tags: (p.tags || []).join(", "),
      in_stock: p.in_stock,
    });
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

  if (loading) {
    return <main className="pt-24 pb-20 flex items-center justify-center min-h-screen"><div className="animate-pulse text-muted-foreground">Загрузка...</div></main>;
  }

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl font-bold">Управление товарами</h1>
          <button onClick={() => setEditing({ ...emptyForm })}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center gap-2 text-sm hover:opacity-90 transition-opacity">
            <Plus size={16} /> Добавить товар
          </button>
        </div>

        {/* Editor modal */}
        {editing && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 mb-8 glow-box">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold">{editing.id ? "Редактирование" : "Новый товар"}</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Название *"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} placeholder="Бренд *"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
              <input value={editing.volume} onChange={(e) => setEditing({ ...editing, volume: e.target.value })} placeholder="Объём"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="Цена (BYN) *" type="number" step="0.01"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input value={editing.old_price} onChange={(e) => setEditing({ ...editing, old_price: e.target.value })} placeholder="Старая цена" type="number" step="0.01"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input value={editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} placeholder="Теги (через запятую)"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.in_stock} onChange={(e) => setEditing({ ...editing, in_stock: e.target.checked })} className="w-4 h-4 rounded accent-primary" />
                  <span className="text-sm">В наличии</span>
                </label>
              </div>
              <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Описание" rows={3}
                className="col-span-full w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              <div className="col-span-full">
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
            </div>
            <button onClick={handleSave} disabled={saving || !editing.name || !editing.brand || !editing.price}
              className="mt-4 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
              <Save size={16} /> {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </motion.div>
        )}

        {/* Products list */}
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
                  <p className="text-xs text-muted-foreground">{p.brand} · {p.category}</p>
                </div>
                <span className="font-display font-bold shrink-0">{Number(p.price).toFixed(2)} BYN</span>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => startEdit(p)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default Admin;
