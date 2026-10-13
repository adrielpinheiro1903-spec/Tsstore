import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    cartCount,
    wishlist,
    setCartDrawerOpen,
    navigateTo,
    activePage,
    searchQuery,
    setSearchQuery,
    products,
    currentUser,
    adminUnlocked,
    setAdminUnlocked,
  } = useStore();

  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminPinModal, setAdminPinModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchSuggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput === '1234' || adminPinInput.toLowerCase() === 'admin') {
      setAdminUnlocked(true);
      setAdminPinModal(false);
      setAdminPinInput('');
      setAdminPinError(false);
      navigateTo('admin');
    } else {
      setAdminPinError(true);
    }
  };

  const navLinks = [
    { label: 'Início', page: 'home' as const },
    { label: 'Catálogo Completo', page: 'catalog' as const },
    { label: 'Smartphones', category: 'smartphones' },
    { label: 'Notebooks', category: 'notebooks' },
    { label: 'Fones & Áudio', category: 'headphones' },
    { label: 'Smartwatches', category: 'smartwatches' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090A0F]/95 backdrop-blur-md border-b border-zinc-800/80">
      {/* Top Commercial Announcement Bar */}
      <div className="w-full bg-zinc-950/90 border-b border-zinc-800/60 py-1.5 px-4 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#00F0FF] font-semibold tracking-wide">TStore Exclusivo:</span>
            <span>10% OFF no Pix</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>Frete grátis em compras selecionadas</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-zinc-400">
            <button
              onClick={() => navigateTo('faq')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Dúvidas Frequentes
            </button>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <button
              onClick={() => navigateTo('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Atendimento Especializado
            </button>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <button
              onClick={() => {
                if (adminUnlocked) {
                  navigateTo('admin');
                } else {
                  setAdminPinModal(true);
                }
              }}
              className="text-zinc-400 hover:text-[#00F0FF] transition-colors flex items-center gap-1 cursor-pointer"
              title="Acesso Administrativo à Loja"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#00F0FF]" />
              <span>Painel Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 lg:gap-8">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg focus:outline-none cursor-pointer"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
            aria-label="TStore Home"
          >
            {/* Original Geometric T Logo */}
            <div className="relative w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center overflow-hidden group-hover:border-[#00F0FF]/60 transition-colors shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/15 to-transparent pointer-events-none" />
              <span className="font-extrabold text-lg tracking-tighter text-[#00F0FF] font-sans">
                T
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white font-sans flex items-center">
                T<span className="text-[#00F0FF]">Store</span>
              </span>
              <span className="text-[10px] tracking-widest text-zinc-400 uppercase -mt-1 font-medium">
                Eletrônicos & Tech
              </span>
            </div>
          </button>
        </div>

        {/* Live Search Bar Zone */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-xl hidden md:block">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchFocused(false);
                  navigateTo('catalog');
                }
              }}
              placeholder="Buscar smartphone, notebook, fones, smartwatch..."
              className="w-full bg-zinc-900/90 text-sm text-zinc-100 placeholder-zinc-500 rounded-lg pl-10 pr-24 py-2.5 border border-zinc-800 focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]/30 transition-all"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
            <button
              onClick={() => {
                setSearchFocused(false);
                navigateTo('catalog');
              }}
              className="absolute right-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-md transition-colors cursor-pointer"
            >
              Buscar
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {searchFocused && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-2 border-b border-zinc-800 text-xs text-zinc-400 font-medium flex justify-between items-center">
                <span>Produtos sugeridos</span>
                <span className="text-[11px] text-[#00F0FF]">
                  {searchSuggestions.length} encontrados
                </span>
              </div>
              <div className="divide-y divide-zinc-800/60 max-h-80 overflow-y-auto">
                {searchSuggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSearchFocused(false);
                      navigateTo('product-detail', product.id);
                    }}
                    className="w-full p-2.5 flex items-center gap-3 hover:bg-zinc-800/70 transition-colors text-left cursor-pointer group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 object-cover rounded-md bg-zinc-950 shrink-0 border border-zinc-800"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider">
                        {product.brand} · {product.categoryLabel}
                      </p>
                      <p className="text-sm font-medium text-zinc-100 truncate group-hover:text-[#00F0FF] transition-colors">
                        {product.name}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-white tabular-nums">
                        R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[11px] text-[#00F0FF] tabular-nums">
                        no Pix R$ {(product.price * 0.9).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setSearchFocused(false);
                  navigateTo('catalog');
                }}
                className="w-full py-2 bg-zinc-950 text-center text-xs text-[#00F0FF] hover:underline font-medium border-t border-zinc-800 cursor-pointer"
              >
                Ver todos os resultados no catálogo →
              </button>
            </div>
          )}
        </div>

        {/* Action Controls Zone */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Wishlist Button */}
          <button
            onClick={() => navigateTo('wishlist')}
            className={`relative p-2.5 rounded-lg border transition-colors cursor-pointer ${
              activePage === 'wishlist'
                ? 'bg-zinc-800 border-[#00F0FF]/50 text-[#00F0FF]'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
            }`}
            aria-label="Ver produtos favoritos"
            title="Favoritos"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-zinc-800 border border-zinc-700 text-[#00F0FF] text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* User Account Button */}
          <button
            onClick={() => navigateTo('account')}
            className={`relative p-2.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-2 ${
              activePage === 'account'
                ? 'bg-zinc-800 border-[#00F0FF]/50 text-[#00F0FF]'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
            }`}
            aria-label="Minha conta"
            title={currentUser ? `Logado como ${currentUser.name}` : 'Acessar minha conta'}
          >
            <User className="w-5 h-5" />
            <span className="hidden xl:inline text-xs font-medium text-zinc-300">
              {currentUser ? currentUser.name.split(' ')[0] : 'Entrar'}
            </span>
          </button>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative px-3.5 py-2.5 bg-gradient-to-r from-cyan-500 to-[#00F0FF] text-zinc-950 hover:brightness-110 font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            aria-label="Abrir carrinho de compras"
          >
            <ShoppingCart className="w-5 h-5 text-zinc-950" />
            <span className="hidden sm:inline text-xs font-bold text-zinc-950">
              Carrinho
            </span>
            <span className="min-w-5 h-5 px-1 bg-zinc-950 text-[#00F0FF] text-[11px] font-extrabold rounded-md flex items-center justify-center tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Category Navigation Strip */}
      <nav aria-label="Categorias principais" className="hidden lg:block border-t border-zinc-800/60 bg-zinc-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-7 overflow-x-auto py-2 text-xs font-medium text-zinc-300">
          {navLinks.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.page) {
                  navigateTo(item.page);
                } else if (item.category) {
                  navigateTo('catalog', undefined, item.category);
                }
              }}
              className="whitespace-nowrap hover:text-[#00F0FF] transition-colors py-1 relative cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-4 text-zinc-400 text-xs">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
              Garantia Oficial de 12 Meses
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <span className="text-[#00F0FF] font-bold text-base">T</span>
                  </div>
                  <span className="text-lg font-bold text-white">TStore</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search Input */}
              <div className="mt-5">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setMobileMenuOpen(false);
                        navigateTo('catalog');
                      }
                    }}
                    placeholder="Pesquisar eletrônicos..."
                    className="w-full bg-zinc-950 text-sm text-zinc-100 rounded-lg pl-9 pr-3 py-2.5 border border-zinc-800 focus:border-[#00F0FF] outline-none"
                  />
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="mt-6 flex flex-col space-y-2">
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Navegação
                </p>
                {navLinks.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (item.page) navigateTo(item.page);
                      else if (item.category) navigateTo('catalog', undefined, item.category);
                    }}
                    className="flex items-center justify-between py-2 px-3 rounded-lg text-sm font-medium text-zinc-200 hover:bg-zinc-800 hover:text-[#00F0FF] transition-colors text-left cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-800 space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('account');
                  }}
                  className="w-full py-2.5 px-3 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-3 cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#00F0FF]" />
                  <span>Minha Conta</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('wishlist');
                  }}
                  className="w-full py-2.5 px-3 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-3 cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-[#00F0FF]" />
                  <span>Favoritos ({wishlist.length})</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('about');
                  }}
                  className="w-full py-2.5 px-3 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-3 cursor-pointer"
                >
                  <span>Sobre a TStore</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('contact');
                  }}
                  className="w-full py-2.5 px-3 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-3 cursor-pointer"
                >
                  <span>Atendimento & Contato</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-400">
              <p>TStore Eletrônicos Brasil</p>
              <p className="mt-1">Atendimento: Seg à Sex, 09h às 18h</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin PIN Modal */}
      {adminPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#00F0FF]" />
                <h3 className="text-base font-semibold text-white">Acesso ao Painel Admin</h3>
              </div>
              <button
                onClick={() => setAdminPinModal(false)}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-zinc-400 mt-3">
              Área restrita à gestão da loja (estoque, pedidos e catálogo). Digite o código de acesso (PIN de demonstração: <strong className="text-zinc-200">1234</strong>).
            </p>
            <form onSubmit={handleAdminAuth} className="mt-4 space-y-3">
              <input
                type="password"
                value={adminPinInput}
                onChange={(e) => {
                  setAdminPinInput(e.target.value);
                  setAdminPinError(false);
                }}
                placeholder="PIN ou Senha de Acesso"
                autoFocus
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#00F0FF] outline-none"
              />
              {adminPinError && (
                <p className="text-xs text-rose-400">PIN incorreto. Utilize 1234 para o modo de testes.</p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdminPinModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white rounded-md cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-[#00F0FF] text-zinc-950 rounded-md hover:bg-cyan-400 cursor-pointer"
                >
                  Acessar Painel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
