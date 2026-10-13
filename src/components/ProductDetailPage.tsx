import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  Heart,
  Share2,
  Check,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Info,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    navigateTo,
    addToCart,
    wishlist,
    toggleWishlist,
    showNotification,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  // Gallery
  const images = product.additionalImages && product.additionalImages.length > 0
    ? product.additionalImages
    : [product.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Variants selection state
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.variants) {
      product.variants.forEach((v) => {
        initial[v.name] = v.options[0].label;
      });
    }
    return initial;
  });

  // Quantity selector
  const [quantity, setQuantity] = useState(1);

  // Shipping simulation
  const [cepInput, setCepInput] = useState('');
  const [cepResult, setCepResult] = useState<{
    city: string;
    options: { name: string; carrier: string; price: number; days: string }[];
  } | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);

  // Tab: specs vs description
  const [activeTab, setActiveTab] = useState<'specs' | 'description'>('specs');

  // Calculate dynamic variant price modifier
  let priceModifier = 0;
  if (product.variants) {
    product.variants.forEach((v) => {
      const selectedLabel = selectedVariants[v.name];
      const opt = v.options.find((o) => o.label === selectedLabel);
      if (opt && opt.priceDiff) {
        priceModifier += opt.priceDiff;
      }
    });
  }

  const effectivePrice = product.price + priceModifier;
  const pixPrice = effectivePrice * (1 - product.pixDiscountPercent / 100);
  const installmentValue = effectivePrice / product.maxInstallments;
  const isWishlisted = wishlist.includes(product.id);

  const handleCepCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCep = cepInput.replace(/\D/g, '');
    if (cleanCep.length < 8) {
      showNotification('Digite um CEP válido com 8 dígitos.', 'error');
      return;
    }
    setLoadingCep(true);
    setTimeout(() => {
      setLoadingCep(false);
      // Realistic regional simulation
      const isSP = cleanCep.startsWith('0') || cleanCep.startsWith('1');
      setCepResult({
        city: isSP ? 'São Paulo - Região Sudeste' : 'Região de Entrega Nacional',
        options: [
          {
            name: 'Sedex Expresso Segurado',
            carrier: 'Correios',
            price: isSP ? 0 : 28.9,
            days: isSP ? '1 a 2 dias úteis' : '3 a 5 dias úteis',
          },
          {
            name: 'Loggi Express Rastreado',
            carrier: 'Loggi Tech',
            price: isSP ? 14.5 : 34.0,
            days: isSP ? 'Em até 24 horas' : '2 a 4 dias úteis',
          },
        ],
      });
    }, 450);
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity, selectedVariants, effectivePrice);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    const added = addToCart(product, quantity, selectedVariants, effectivePrice);
    if (added) {
      navigateTo('checkout');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Confira ${product.name} na TStore`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showNotification('Link do produto copiado!', 'info');
    }
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#090A0F] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Início
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <button
            onClick={() => navigateTo('catalog', undefined, product.category)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {product.categoryLabel}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-zinc-200 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigateTo('catalog')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#00F0FF] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Catálogo
        </button>

        {/* Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="relative aspect-[4/3] bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden cursor-zoom-in"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
                }`}
              />

              {/* Zoom hint badge */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-zinc-900/80 backdrop-blur-md rounded-md text-[11px] text-zinc-400 border border-zinc-700/60 pointer-events-none">
                {isZoomed ? 'Clique para reduzir' : 'Clique para ampliar zoom'}
              </div>

              {/* Tag for New */}
              {product.isNew && (
                <div className="absolute top-4 left-4 text-xs font-semibold text-[#00F0FF] uppercase tracking-wider flex items-center gap-1.5 drop-shadow">
                  <Sparkles className="w-3.5 h-3.5" />
                  Lançamento 2026
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#00F0FF] ring-2 ring-[#00F0FF]/20'
                        : 'border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumb ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Technical Highlights Bar */}
            <div className="p-4 bg-zinc-900/80 border border-zinc-800/80 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span>Garantia 1 Ano</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span>Envio c/ Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span>10% OFF no Pix</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span>Nota Fiscal Eletrônica</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 bg-[#12141E] border border-zinc-800/90 rounded-2xl p-6 lg:p-7 shadow-xl space-y-6">
            {/* Header / Brand / SKU */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-200">{product.brand}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.categoryLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Compartilhar produto"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-1.5 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer ${
                      isWishlisted ? 'text-rose-400' : 'text-zinc-400 hover:text-white'
                    }`}
                    title="Salvar nos favoritos"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400 font-mono">
                <span>SKU: {product.sku}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-medium">Produto Original Homologado</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2">
              {product.originalPrice && (
                <div className="text-xs text-zinc-400 line-through tabular-nums">
                  De: R$ {(product.originalPrice + priceModifier).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              )}

              {/* Pix Price Highlight */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#00F0FF] font-sans tabular-nums">
                  R$ {pixPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-zinc-300 font-semibold">
                  no Pix com 10% de desconto
                </span>
              </div>

              {/* Installments */}
              <p className="text-xs text-zinc-300 tabular-nums">
                ou <strong className="text-white">R$ {effectivePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> em até{' '}
                <strong className="text-white">{product.maxInstallments}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> sem juros no cartão
              </p>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 pt-1">
                {product.variants.map((variant) => (
                  <div key={variant.name} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-300">{variant.name}:</span>
                      <span className="text-[#00F0FF] font-medium">
                        {selectedVariants[variant.name]}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((opt) => {
                        const isSelected = selectedVariants[variant.name] === opt.label;
                        return (
                          <button
                            key={opt.label}
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [variant.name]: opt.label,
                              }))
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-950/60 border-[#00F0FF] text-[#00F0FF] shadow-sm'
                                : 'bg-zinc-900 border-zinc-700/80 text-zinc-300 hover:border-zinc-600'
                            }`}
                          >
                            {opt.colorHex && (
                              <span
                                className="w-3 h-3 rounded-full border border-zinc-700"
                                style={{ backgroundColor: opt.colorHex }}
                              />
                            )}
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stock & Quantity Control */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Disponibilidade:</span>
                {product.stock > 0 ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Em estoque ({product.stock} un. prontas para envio)
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold">Produto Esgotado</span>
                )}
              </div>

              {product.stock > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-300 font-medium">Quantidade:</span>
                  <div className="flex items-center border border-zinc-700 rounded-lg bg-zinc-900 overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-2.5 py-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-bold text-white tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="px-2.5 py-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-3.5 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-extrabold text-sm rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Comprar Agora</span>
              </button>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm rounded-xl border border-zinc-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4 text-[#00F0FF]" />
                <span>Adicionar ao Carrinho</span>
              </button>
            </div>

            {/* Freight Simulator */}
            <div className="pt-4 border-t border-zinc-800/80 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                <Truck className="w-4 h-4 text-[#00F0FF]" />
                <span>Simulador de Frete & Prazos</span>
              </div>
              <form onSubmit={handleCepCalculate} className="flex gap-2">
                <input
                  type="text"
                  maxLength={9}
                  value={cepInput}
                  onChange={(e) => setCepInput(e.target.value)}
                  placeholder="Informe seu CEP (ex: 01310-100)"
                  className="flex-1 bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#00F0FF]"
                />
                <button
                  type="submit"
                  disabled={loadingCep}
                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  {loadingCep ? 'Calculando...' : 'Calcular'}
                </button>
              </form>

              {cepResult && (
                <div className="p-3 bg-zinc-950/90 border border-zinc-800 rounded-lg space-y-2 text-xs">
                  <p className="text-[11px] text-zinc-400 font-medium">{cepResult.city}</p>
                  {cepResult.options.map((opt, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-t border-zinc-800/60 first:border-t-0">
                      <div>
                        <p className="font-semibold text-zinc-200">{opt.name}</p>
                        <p className="text-[10px] text-zinc-400">{opt.carrier} · {opt.days}</p>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 tabular-nums">
                        {opt.price === 0 ? 'Grátis' : `R$ ${opt.price.toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technical Specifications & Description Section */}
        <div className="mt-16 bg-[#10121A] border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <div className="flex gap-4 border-b border-zinc-800 pb-4">
            <button
              onClick={() => setActiveTab('specs')}
              className={`text-sm font-bold pb-2 transition-colors cursor-pointer border-b-2 ${
                activeTab === 'specs'
                  ? 'border-[#00F0FF] text-[#00F0FF]'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              Ficha Técnica Completa
            </button>
            <button
              onClick={() => setActiveTab('description')}
              className={`text-sm font-bold pb-2 transition-colors cursor-pointer border-b-2 ${
                activeTab === 'description'
                  ? 'border-[#00F0FF] text-[#00F0FF]'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              Descrição & Diferenciais
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'specs' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {Object.entries(product.specs).map(([specKey, specVal]) => (
                  <div
                    key={specKey}
                    className="flex justify-between py-2.5 px-3 rounded-lg bg-zinc-950/50 border border-zinc-800/60 text-xs"
                  >
                    <span className="text-zinc-400 font-medium">{specKey}</span>
                    <span className="text-zinc-100 font-semibold text-right max-w-xs">{specVal}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-sm text-zinc-300 leading-relaxed space-y-4">
                <p>{product.description}</p>
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex items-start gap-3 text-xs text-zinc-300">
                  <Info className="w-5 h-5 text-[#00F0FF] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Garantia e Autenticidade Assegurada</p>
                    <p className="mt-0.5 text-zinc-400">
                      Todos os produtos comercializados na TStore são novos, lacrados de fábrica, com número de série autêntico e nota fiscal no seu CPF/CNPJ.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Recommendation */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-white mb-6">
              Produtos Relacionados na Categoria
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigateTo('product-detail', rel.id)}
                  className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all cursor-pointer flex gap-4 items-center group"
                >
                  <img
                    src={rel.image}
                    alt={rel.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded-lg bg-zinc-950 shrink-0 border border-zinc-800"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-zinc-400 uppercase">{rel.brand}</p>
                    <h3 className="text-xs font-semibold text-white truncate group-hover:text-[#00F0FF] transition-colors">
                      {rel.name}
                    </h3>
                    <p className="text-xs font-bold text-[#00F0FF] mt-1 tabular-nums font-mono">
                      R$ {(rel.price * 0.9).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} no Pix
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
