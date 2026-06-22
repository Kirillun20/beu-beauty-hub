import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal, MessageCircle, Send, ChevronDown } from "lucide-react";
import { categories, brands } from "@/data/products";
import { useAllProducts } from "@/hooks/useAllProducts";
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";


const Catalog = () => {
  const { products, loading } = useAllProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategory = searchParams.get("cat") || "";
  const selectedSubcategory = searchParams.get("sub") || "";
  const brandFromUrl = searchParams.get("brand") || "";

  useEffect(() => {
    if (brandFromUrl) setSelectedBrand(brandFromUrl);
  }, [brandFromUrl]);

  const allBrands = useMemo(() => {
    const set = new Set<string>(brands);
    products.forEach((p) => set.add(p.brand));
    return Array.from(set);
  }, [products]);

  const activeCategory = useMemo(() => categories.find(c => c.slug === selectedCategory), [selectedCategory]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (selectedSubcategory) result = result.filter(p => p.subcategory === selectedSubcategory);
    if (selectedBrand) result = result.filter(p => p.brand === selectedBrand);
    if (search) result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, selectedCategory, selectedSubcategory, selectedBrand, search, sortBy]);

  const clearFilters = () => {
    setSearchParams({});
    setSelectedBrand("");
    setSearch("");
    setSortBy("default");
  };

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">Каталог</h1>

        {/* Active filters */}
        {(selectedBrand || selectedCategory) && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {selectedBrand && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {selectedBrand}
                <button onClick={() => setSelectedBrand("")} className="ml-1 hover:text-foreground">×</button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {categories.find(c => c.slug === selectedCategory)?.name}
                <button onClick={() => setSearchParams({})} className="ml-1 hover:text-foreground">×</button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground">Сбросить все</button>
          </div>
        )}

        {/* Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Поиск товаров..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="default">По умолчанию</option>
            <option value="price-asc">Цена ↑</option>
            <option value="price-desc">Цена ↓</option>
            <option value="rating">По рейтингу</option>
          </select>
          <button onClick={() => setShowFilters(!showFilters)}
            className="md:hidden px-4 py-3 rounded-xl bg-secondary border border-border flex items-center gap-2">
            <SlidersHorizontal size={18} /> Фильтры
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-72 shrink-0`}>
            <div className="glass-card rounded-2xl p-5 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <h3 className="font-display font-bold mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-primary" /> Категории
              </h3>
              <div className="flex flex-col gap-1 mb-6">
                <button
                  onClick={() => setSearchParams({})}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedCategory ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}
                >
                  Все категории
                </button>
                {categories.map((cat) => {
                  const isOpen = selectedCategory === cat.slug;
                  return (
                    <div key={cat.id} className="rounded-lg overflow-hidden">
                      <button
                        onClick={() => setSearchParams(isOpen ? {} : { cat: cat.slug })}
                        className={`w-full flex items-center justify-between gap-2 text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isOpen ? "bg-primary/15 text-primary" : "text-foreground/80 hover:text-foreground hover:bg-secondary/60"}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{cat.icon}</span>
                          {cat.name}
                        </span>
                        <ChevronDown size={14} className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && cat.subcategories.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 ml-3 mt-1 mb-1 border-l border-primary/30 flex flex-col gap-0.5">
                              {cat.subcategories.map((sub) => (
                                <button
                                  key={sub.slug}
                                  onClick={() => setSearchParams({ cat: cat.slug, sub: sub.slug })}
                                  className={`text-left px-3 py-1.5 rounded-md text-xs transition-colors ${selectedSubcategory === sub.slug ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"}`}
                                >
                                  {sub.name}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <h3 className="font-display font-bold mb-3">Бренды</h3>
              <div className="flex flex-col gap-0.5 max-h-64 overflow-y-auto pr-1">
                <button onClick={() => setSelectedBrand("")}
                  className={`text-left px-3 py-1.5 rounded-md text-sm transition-colors ${!selectedBrand ? "bg-primary/15 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}>
                  Все бренды
                </button>
                {allBrands.map(brand => (
                  <button key={brand} onClick={() => setSelectedBrand(brand)}
                    className={`text-left px-3 py-1.5 rounded-md text-sm transition-colors ${selectedBrand === brand ? "bg-primary/15 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}>
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Subcategory chips */}
            {activeCategory && activeCategory.subcategories.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{activeCategory.icon}</span>
                  <h2 className="font-display text-xl font-bold">{activeCategory.name}</h2>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSearchParams({ cat: activeCategory.slug })}
                    className={`px-4 py-2 rounded-full text-xs font-display font-semibold border transition-all ${!selectedSubcategory ? "bg-primary text-primary-foreground border-primary glow-border" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"}`}
                  >
                    Все
                  </button>
                  {activeCategory.subcategories.map((sub) => (
                    <button
                      key={sub.slug}
                      onClick={() => setSearchParams({ cat: activeCategory.slug, sub: sub.slug })}
                      className={`px-4 py-2 rounded-full text-xs font-display font-semibold border transition-all ${selectedSubcategory === sub.slug ? "bg-primary text-primary-foreground border-primary glow-border" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"}`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
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

        {/* Not found section */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-20 glass-card rounded-2xl p-8 md:p-12 text-center glow-box">
          <MessageCircle size={40} className="mx-auto text-primary mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Не нашли то, что искали?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Напишите нам, и мы постараемся найти нужный товар или привезти его под заказ из Европы!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://t.me/beu_by" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity">
              <Send size={18} /> Написать в Telegram
            </a>
            <Link to="/contacts"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-display font-semibold hover:bg-secondary transition-colors">
              <MessageCircle size={18} /> Контакты
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Catalog;
