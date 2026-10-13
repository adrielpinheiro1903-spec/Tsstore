import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    calculatedDiscount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!cartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#10121A] border-l border-zinc-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#00F0FF]" />
              <h2 className="text-base font-bold text-white">Seu Carrinho</h2>
              <span className="text-xs text-zinc-400 font-mono">
                ({cart.reduce((s, i) => s + i.quantity, 0)} itens)
              </span>
            </div>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-800/60">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white">
                  Seu carrinho está vazio
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                  Adicione produtos ao seu carrinho para aproveitar nossas ofertas com 10% de desconto no Pix.
                </p>
                <button
                  onClick={() => {
                    setCartDrawerOpen(false);
                    navigateTo('catalog');
                  }}
                  className="mt-6 px-5 py-2.5 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-3.5 first:pt-0 last:pb-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-18 object-cover rounded-lg bg-zinc-950 border border-zinc-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-zinc-200 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                          title="Remover item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected variants if any */}
                      {item.selectedVariants && (
                        <div className="text-[11px] text-zinc-400 mt-0.5 space-x-2">
                          {Object.entries(item.selectedVariants).map(([k, v]) => (
                            <span key={k}>
                              {k}: <span className="text-zinc-300">{v}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1">
                      {/* Quantity Stepper with bounds */}
                      <div className="flex items-center border border-zinc-700/80 rounded-md bg-zinc-900 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price in tabular-nums */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-white tabular-nums">
                          R$ {(item.unitPrice * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-zinc-400 tabular-nums">
                            R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} un.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-800/80 bg-zinc-950/60 space-y-4">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between px-3 py-2 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Cupom {appliedCoupon.code} aplicado</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="Cupom (ex: BEMVINDO10)"
                      className="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 uppercase focus:border-[#00F0FF] outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>
                )}
              </div>

              {/* Order breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-200 tabular-nums">
                    R$ {cartSubtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {calculatedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto do Cupom</span>
                    <span className="font-mono tabular-nums">
                      - R$ {calculatedDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Frete</span>
                  <span className="text-zinc-300">Calculado no checkout</span>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-white">Total</span>
                  <div className="text-right">
                    <span className="text-base font-bold text-[#00F0FF] font-mono tabular-nums">
                      R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <p className="text-[10px] text-zinc-400">
                      ou à vista no Pix com 10% OFF
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary Checkout CTA */}
              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigateTo('checkout');
                }}
                className="w-full py-3 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigateTo('cart');
                }}
                className="w-full py-2 bg-transparent text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer text-center"
              >
                Ver Carrinho Detalhado
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
