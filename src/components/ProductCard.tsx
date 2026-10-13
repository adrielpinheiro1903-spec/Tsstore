import React from 'react';
import { ShoppingCart, Heart, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart, wishlist, toggleWishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const pixPrice = product.price * (1 - product.pixDiscountPercent / 100);
  const installmentValue = product.price / product.maxInstallments;

  return (
    <div className="group relative bg-[#12141D] rounded-xl border border-zinc-800/90 overflow-hidden flex flex-col justify-between hover:border-zinc-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
        {/* Wishlist toggle button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
              : 'bg-zinc-900/70 border-zinc-700/60 text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
          aria-label={isWishlisted ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Clean unboxed single indicator (Zero-pill discipline) */}
        {product.isNew && (
          <div className="absolute top-3 left-3 z-10 text-[11px] font-semibold text-[#00F0FF] uppercase tracking-wider flex items-center gap-1 drop-shadow">
            <Sparkles className="w-3 h-3" />
            Lançamento
          </div>
        )}

        <button
          onClick={() => navigateTo('product-detail', product.id)}
          className="w-full h-full block cursor-pointer"
          aria-label={`Ver detalhes de ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </button>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Brand & Category unboxed text */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
            <span className="font-semibold text-zinc-300">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.categoryLabel}</span>
          </div>

          {/* Product Title */}
          <button
            onClick={() => navigateTo('product-detail', product.id)}
            className="text-left w-full cursor-pointer"
          >
            <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug group-hover:text-[#00F0FF] transition-colors">
              {product.name}
            </h3>
          </button>

          {/* Short description preview */}
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing Block */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80">
          {product.originalPrice && product.originalPrice > product.price ? (
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="line-through tabular-nums">
                R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-emerald-400 font-medium">
                Economize R$ {(product.originalPrice - product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ) : (
            <div className="h-4" />
          )}

          {/* Pix Price Highlight */}
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-bold text-[#00F0FF] tabular-nums font-sans">
              R$ {pixPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">no Pix ({product.pixDiscountPercent}% off)</span>
          </div>

          {/* Installment breakdown */}
          <p className="text-xs text-zinc-400 mt-0.5 tabular-nums">
            ou {product.maxInstallments}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
          </p>

          {/* Real Stock Status */}
          <div className="mt-2.5 flex items-center justify-between text-xs">
            {product.stock > 0 ? (
              product.stock <= 5 ? (
                <span className="text-amber-400 font-medium text-[11px]">
                  Últimas {product.stock} unidades em estoque
                </span>
              ) : (
                <span className="text-emerald-400/90 text-[11px] flex items-center gap-1 font-medium">
                  <Check className="w-3 h-3 text-emerald-400" /> Em estoque
                </span>
              )
            ) : (
              <span className="text-rose-400 text-[11px] font-medium">
                Esgotado temporariamente
              </span>
            )}
            <span className="text-[11px] text-zinc-400">
              SKU: {product.sku.slice(0, 11)}
            </span>
          </div>

          {/* Action CTAs */}
          <div className="mt-3.5 grid grid-cols-2 gap-2">
            <button
              onClick={() => navigateTo('product-detail', product.id)}
              className="w-full py-2 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors text-center cursor-pointer"
            >
              Ver Detalhes
            </button>
            <button
              onClick={() => {
                if (product.stock > 0) {
                  addToCart(product, 1);
                }
              }}
              disabled={product.stock <= 0}
              className={`w-full py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                product.stock > 0
                  ? 'bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-bold shadow-sm'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
