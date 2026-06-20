import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { products as staticProducts, Product } from "@/data/products";

const mapDbProduct = (p: any): Product => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  category: p.category,
  price: Number(p.price),
  oldPrice: p.old_price ? Number(p.old_price) : undefined,
  description: p.description || "",
  image: p.image || "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&h=400&fit=crop",
  rating: p.rating ? Number(p.rating) : 5,
  inStock: p.in_stock ?? true,
  volume: p.volume || undefined,
  tags: p.tags || [],
  preOrder: !(p.in_stock ?? true),
  composition: p.composition || undefined,
  application: p.application || undefined,
});

export function useAllProducts() {
  const [items, setItems] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (!mounted) return;
      const dbItems = (data || []).map(mapDbProduct);
      // DB products first, then static (avoid id collisions by preferring DB)
      const dbIds = new Set(dbItems.map((p) => p.id));
      const merged = [...dbItems, ...staticProducts.filter((p) => !dbIds.has(p.id))];
      setItems(merged);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  return { products: items, loading };
}

export function useProduct(id: string | undefined) {
  const { products, loading } = useAllProducts();
  const product = products.find((p) => p.id === id);
  return { product, products, loading };
}
