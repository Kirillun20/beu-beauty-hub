import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal, MessageCircle, Send, ChevronDown, ChevronRight } from "lucide-react";
import { brands } from "@/data/products";
import { mainCategories, findCategory } from "@/data/categories";
import { useAllProducts } from "@/hooks/useAllProducts";
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

const Catalog = () => {
  const { products } = useAllProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const selectedCategory = searchParams.get("cat") || "";
  const selectedSubcategory = searchParams.get("sub") || "";
  const brandFromUrl = searchParams.get("brand") || "";

  useEffect(() => {
    if (brandFromUrl) setSelectedBrand(brandFromUrl);
  }, [brandFromUrl]);

  useEffect(() => {
    if (selectedCategory) setExpandedCat(selectedCategory);
  }, [selectedCategory]);

  const allBrands = useMemo(() => {
    const set = new Set<string>(brands);
    products.forEach((p) => set.add(p.brand));
    return Array.from(set);
  }, [products]);

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

  const currentCat = findCategory(selectedCategory);
  const currentSub = currentCat?.subcategories.find(s => s.slug === selectedSubcategory);

  const selectCat = (catSlug: string) => {
    setSearchParams({ cat: catSlug });
    setExpandedCat(catSlug);
  };
  const selectSub = (catSlug: string, subSlug: string) => {
    setSearchParams({ cat: catSlug, sub: subSlug });
  };

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Каталог</h1>
        <p className="text-muted-foreground mb-8">Премиальная мужская косметика — выберите категорию или подкатегорию</p>

        {/* Pretty subcategory chips when category selected */}
        {currentCat && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl glass-card p-6 mb-8 bg-gradient-to-br ${currentCat.gradient}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{currentCat.icon}</span>
              <div>
                <h2 className="font-display text-2xl font-bold">{currentCat.name}</h2>
                <p className="text-sm text-muted-foreground">{currentCat.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSearchParams({ cat: currentCat.slug })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedSubcategory ? "bg-primary text-primary-foreground glow-border" : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"}`}>
                Все
              </button>
              {currentCat.subcategories.map(sub => (
                <motion.button key={sub.slug} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  onClick={() => selectSub(currentCat.slug, sub.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${selectedSubcategory === sub.slug ? "bg-primary text-primary-foreground glow-border" : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"}`}>
                  {sub.icon && <span>{sub.icon}</span>} {sub.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Active filters */}
        {(selectedBrand || selectedCategory || selectedSubcategory) && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {selectedBrand && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {selectedBrand}
                <button onClick={() => setSelectedBrand("")} className="ml-1 hover:text-foreground">×</button>
              </span>
            )}
            {currentSub && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {currentSub.name}
                <button onClick={() => setSearchParams({ cat: selectedCategory })} className="ml-1 hover:text-foreground">×</button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground">Сбросить все</button>
          </div>
        )}

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
            <div className="glass-card rounded-xl p-5 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <h3 className="font-display font-semibold mb-3">Категории</h3>
              <div className="flex flex-col gap-0.5 mb-6">
                <button onClick={() => setSearchParams({})}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  Все категории
                </button>
                {mainCategories.map(cat => {
                  const isExpanded = expandedCat === cat.slug;
                  const isActive = selectedCategory === cat.slug;
                  return (
                    <div key={cat.slug}>
                      <button onClick={() => { selectCat(cat.slug); setExpandedCat(isExpanded ? null : cat.slug); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between gap-2 ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                        <span className="flex items-center gap-2"><span>{cat.icon}</span> {cat.name}</span>
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-3 border-l border-border pl-2 mt-0.5 mb-1">
                            {cat.subcategories.map(sub => (
                              <button key={sub.slug} onClick={() => selectSub(cat.slug, sub.slug)}
                                className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${selectedSubcategory === sub.slug ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                                {sub.icon} {sub.name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <h3 className="font-display font-semibold mb-3">Бренды</h3>
              <div className="flex flex-col gap-0.5">
                <button onClick={() => setSelectedBrand("")}
                  className={`text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!selectedBrand ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  Все бренды
                </button>
                {allBrands.map(brand => (
                  <button key={brand} onClick={() => setSelectedBrand(brand)}
                    className={`text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedBrand === brand ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </aside>

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
