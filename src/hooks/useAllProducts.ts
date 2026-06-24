import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, Availability, VolumeVariant } from "@/data/products";

const mapDbProduct = (p: any): Product => {
  const availability: Availability = (p.availability as Availability) || (p.in_stock ? "in_stock" : "preorder");
  const variants: VolumeVariant[] = Array.isArray(p.volume_variants)
    ? p.volume_variants
        .map((v: any) => ({ volume: String(v.volume || ""), price: Number(v.price) || 0 }))
        .filter((v: VolumeVariant) => v.volume)
    : [];
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    subcategory: p.subcategory || undefined,
    subcategories: Array.isArray(p.subcategories) ? p.subcategories : (p.subcategory ? [p.subcategory] : []),
    price: Number(p.price),
    oldPrice: p.old_price ? Number(p.old_price) : undefined,
    description: p.description || "",
    image: p.image || "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&h=400&fit=crop",
    rating: p.rating ? Number(p.rating) : 5,
    inStock: availability === "in_stock",
    availability,
    preorderDays: p.preorder_days || undefined,
    volume: p.volume || undefined,
    volumeVariants: variants,
    tags: p.tags || [],
    preOrder: availability === "preorder",
    composition: p.composition || undefined,
    application: p.application || undefined,
    homeSections: Array.isArray(p.home_sections) ? p.home_sections : [],
  };
}

export function useAllProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const [prodRes, revRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("reviews").select("product_id, rating"),
      ]);
      if (!mounted) return;

      const agg = new Map<string, { sum: number; count: number }>();
      (revRes.data || []).forEach((r: any) => {
        const cur = agg.get(r.product_id) || { sum: 0, count: 0 };
        cur.sum += Number(r.rating) || 0;
        cur.count += 1;
        agg.set(r.product_id, cur);
      });

      const dbItems = (prodRes.data || []).map(mapDbProduct);
      const withRatings = dbItems.map((p) => {
        const a = agg.get(p.id);
        if (a && a.count > 0) {
          return { ...p, rating: +(a.sum / a.count).toFixed(1), reviewCount: a.count };
        }
        return { ...p, reviewCount: 0 };
      });

      setItems(withRatings);
      setLoading(false);
    };
    load();

    // Realtime sync — refresh when products change in DB
    const channel = supabase
      .channel("products-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => load())
      .subscribe();

    return () => { mounted = false; supabase.removeChannel(channel); };
  }, []);

  return { products: items, loading };
}

export function useProduct(id: string | undefined) {
  const { products, loading } = useAllProducts();
  const product = products.find((p) => p.id === id);
  return { product, products, loading };
}
