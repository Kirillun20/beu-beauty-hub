import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { products, categories, brands } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategory = searchParams.get("cat") || "";

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (selectedBrand) result = result.filter(p => p.brand === selectedBrand);
    if (search) result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [selectedCategory, selectedBrand, search, sortBy]);

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">Каталог</h1>

        {/* Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="default">По умолчанию</option>
            <option value="price-asc">Цена ↑</option>
            <option value="price-desc">Цена ↓</option>
            <option value="rating">По рейтингу</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden px-4 py-3 rounded-xl bg-secondary border border-border flex items-center gap-2"
          >
            <SlidersHorizontal size={18} /> Фильтры
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 shrink-0`}>
            <div className="glass-card rounded-xl p-6 sticky top-24">
              <h3 className="font-display font-semibold mb-4">Категории</h3>
              <div className="flex flex-col gap-1 mb-6">
                <button
                  onClick={() => setSearchParams({})}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Все категории
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSearchParams({ cat: cat.slug })}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.slug ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>

              <h3 className="font-display font-semibold mb-4">Бренды</h3>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setSelectedBrand("")}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedBrand ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Все бренды
                </button>
                {brands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedBrand === brand ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">Найдено: {filtered.length} товаров</p>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">Товары не найдены</p>
                <p className="text-sm text-muted-foreground mt-2">Попробуйте изменить фильтры</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Catalog;
