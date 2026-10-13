import React, { useState, useMemo } from 'react';
import { Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES_LIST } from '../data/products';

export const CatalogPage: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useStore();

  // Local filter states
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [priceTier, setPriceTier] = useState<string>('all'); // all, under1000, 1000to3000, 3000to6000, above6000
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Extract all available brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.brand)));
    return list.sort();
  }, [products]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory && selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchCategory = product.categoryLabel.toLowerCase().includes(q);
          const matchShortDesc = product.shortDescription.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchCategory && !matchShortDesc) {
            return false;
          }
        }

        // Brand filter
        if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
          return false;
        }

        // In-stock filter
        if (onlyInStock && product.stock <= 0) {
          return false;
        }

        // Price tier
        if (priceTier === 'under1000' && product.price > 1000) return false;
        if (priceTier === '1000to3000' && (product.price < 1000 || product.price > 3000)) return false;
        if (priceTier === '3000to6000' && (product.price < 3000 || product.price > 6000)) return false;
        if (priceTier === 'above6000' && product.price < 6000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // relevance
      });
  }, [products, selectedCategory, searchQuery, selectedBrand, onlyInStock, priceTier, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand('all');
    setOnlyInStock(false);
    setPriceTier('all');
    setSearchQuery('');
    setSortBy('relevance');
  };

  const hasActiveFilters =
    Boolean(selectedCategory && selectedCategory !== 'all') ||
    selectedBrand !== 'all' ||
    onlyInStock ||
    priceTier !== 'all' ||
    Boolean(searchQuery.trim());

  return (
    <div className="min-h-screen bg-[#090A0F] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Catalog Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00F0FF] uppercase tracking-wider">
              <span>Catálogo TStore</span>
              <span aria-hidden="true">·</span>
              <span>Eletrônicos Homologados</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              {selectedCategory && selectedCategory !== 'all'
                ? CATEGORIES_LIST.find((c) => c.id === selectedCategory)?.label || 'Produtos'
                : 'Todos os Eletrônicos'}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Mostrando <strong className="text-zinc-200">{filteredProducts.length}</strong> produtos disponíveis
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs font-medium text-white cursor-pointer"
            >
              <Filter className="w-4 h-4 text-[#00F0FF]" />
              <span>Filtros</span>
            </button>

            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs">
              <span className="text-zinc-400">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white font-medium outline-none cursor-pointer"
              >
                <option value="relevance" className="bg-zinc-900">Relevância</option>
                <option value="price-asc" className="bg-zinc-900">Menor Preço</option>
                <option value="price-desc" className="bg-zinc-900">Maior Preço</option>
                <option value="newest" className="bg-zinc-900">Lançamentos</option>
                <option value="name" className="bg-zinc-900">Nome (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Main Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filters (Desktop + Mobile Drawer) */}
          <aside
            className={`lg:col-span-3 space-y-6 ${
              mobileFilterOpen
                ? 'fixed inset-0 z-50 p-6 bg-zinc-950 overflow-y-auto block'
                : 'hidden lg:block'
            }`}
          >
            {mobileFilterOpen && (
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 lg:hidden">
                <span className="font-bold text-white text-base">Filtrar Produtos</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-xs text-zinc-400 hover:text-white px-2 py-1 bg-zinc-800 rounded"
                >
                  Fechar
                </button>
              </div>
            )}

            {/* Quick search filter */}
            <div className="bg-[#12141D] border border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Filtrar por Busca
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] text-[#00F0FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Limpar
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nome, modelo ou marca..."
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#00F0FF] outline-none"
                />
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Category selection */}
            <div className="bg-[#12141D] border border-zinc-800 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Categorias
              </h3>
              <div className="space-y-1">
                {CATEGORIES_LIST.map((cat) => {
                  const isActive =
                    (!selectedCategory && cat.id === 'all') || selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id === 'all' ? null : cat.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-zinc-800 text-[#00F0FF] font-semibold'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                      }`}
                    >
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="bg-[#12141D] border border-zinc-800 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Marca / Fabricante
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === 'all'}
                    onChange={() => setSelectedBrand('all')}
                    className="accent-[#00F0FF]"
                  />
                  <span>Todas as marcas</span>
                </label>
                {brands.map((b) => (
                  <label key={b} className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === b}
                      onChange={() => setSelectedBrand(b)}
                      className="accent-[#00F0FF]"
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Tier Filter */}
            <div className="bg-[#12141D] border border-zinc-800 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Faixa de Preço
              </h3>
              <div className="space-y-1.5 text-xs text-zinc-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={priceTier === 'all'}
                    onChange={() => setPriceTier('all')}
                    className="accent-[#00F0FF]"
                  />
                  <span>Qualquer valor</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={priceTier === 'under1000'}
                    onChange={() => setPriceTier('under1000')}
                    className="accent-[#00F0FF]"
                  />
                  <span>Até R$ 1.000</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={priceTier === '1000to3000'}
                    onChange={() => setPriceTier('1000to3000')}
                    className="accent-[#00F0FF]"
                  />
                  <span>R$ 1.000 a R$ 3.000</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={priceTier === '3000to6000'}
                    onChange={() => setPriceTier('3000to6000')}
                    className="accent-[#00F0FF]"
                  />
                  <span>R$ 3.000 a R$ 6.000</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={priceTier === 'above6000'}
                    onChange={() => setPriceTier('above6000')}
                    className="accent-[#00F0FF]"
                  />
                  <span>Acima de R$ 6.000</span>
                </label>
              </div>
            </div>

            {/* Stock Availability Toggle */}
            <div className="bg-[#12141D] border border-zinc-800 rounded-xl p-4">
              <label className="flex items-center justify-between text-xs text-zinc-200 cursor-pointer">
                <span>Somente com estoque disponível</span>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#00F0FF]"
                />
              </label>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-[#10121A] border border-zinc-800 rounded-2xl p-12 text-center">
                <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center text-zinc-500 mb-4">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Nenhum produto encontrado
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Não encontramos eletrônicos correspondentes aos filtros selecionados. Tente ajustar os termos de pesquisa ou limpar os filtros.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
