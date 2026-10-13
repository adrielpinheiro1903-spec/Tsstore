import React from 'react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    calculatedDiscount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo,
  } = useStore();

  const [couponCode, setCouponCode] = React.useState('');
  const [couponError, setCouponError] = React.useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (!res.success) setCouponError(res.message);
    else setCouponCode('');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#090A0F] py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mx-auto mb-5">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-white">Seu carrinho está vazio</h1>
          <p className="text-xs text-zinc-400 mt-2">
            Nenhum produto foi adicionado ainda. Explore nossos eletrônicos de última geração com descontos de 10% no Pix.
          </p>
          <button
            onClick={() => navigateTo('catalog')}
            className="mt-6 px-6 py-3 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-bold text-sm rounded-xl transition-all cursor-pointer"
          >
            Explorar Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090A0F] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
          <div>
            <button
              onClick={() => navigateTo('catalog')}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#00F0FF] transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Continuar Comprando
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Carrinho de Compras</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            Esvaziar Carrinho
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Table / Items List */}
          <div className="lg:col-span-8 bg-[#10121A] border border-zinc-800 rounded-2xl p-6 divide-y divide-zinc-800/70">
            {cart.map((item) => (
              <div key={item.id} className="py-5 flex flex-col sm:flex-row gap-4 first:pt-0 last:pb-0 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-xl bg-zinc-950 border border-zinc-800 shrink-0"
                  />
                  <div>
                    <span className="text-[11px] font-semibold text-[#00F0FF] uppercase tracking-wider">
                      {item.product.brand}
                    </span>
                    <h3
                      onClick={() => navigateTo('product-detail', item.product.id)}
                      className="text-sm font-bold text-white hover:text-[#00F0FF] transition-colors cursor-pointer"
                    >
                      {item.product.name}
                    </h3>
                    {item.selectedVariants && (
                      <div className="text-xs text-zinc-400 mt-1 space-x-2">
                        {Object.entries(item.selectedVariants).map(([k, v]) => (
                          <span key={k}>
                            {k}: <strong className="text-zinc-300">{v}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-zinc-400 mt-1 font-mono">
                      R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} un.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                  {/* Stepper */}
                  <div className="flex items-center border border-zinc-700 rounded-lg bg-zinc-900 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-bold text-white tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="p-1.5 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-28">
                    <p className="text-sm font-bold text-white font-mono tabular-nums">
                      R$ {(item.unitPrice * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-[#00F0FF] tabular-nums font-mono">
                      no Pix R$ {(item.unitPrice * item.quantity * 0.9).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Excluir produto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 bg-[#12141E] border border-zinc-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-base font-bold text-white pb-3 border-b border-zinc-800">
              Resumo da Compra
            </h2>

            {/* Coupon Box */}
            <div>
              {appliedCoupon ? (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs flex justify-between items-center">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <Tag className="w-4 h-4" />
                    <span>{appliedCoupon.code} aplicado</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-zinc-400 hover:text-white underline cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="Cupom de desconto"
                      className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white uppercase focus:border-[#00F0FF] outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-rose-400">{couponError}</p>}
                </form>
              )}
            </div>

            {/* Pricing details */}
            <div className="space-y-2.5 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
              <div className="flex justify-between">
                <span>Subtotal dos produtos</span>
                <span className="text-zinc-200 font-mono tabular-nums">
                  R$ {cartSubtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {calculatedDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Desconto de Cupom</span>
                  <span className="font-mono tabular-nums">
                    - R$ {calculatedDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Frete</span>
                <span className="text-zinc-300">Calculado no checkout</span>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
                <span className="text-base font-bold text-white">Total</span>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#00F0FF] font-mono tabular-nums">
                    R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    ou em até 12x no cartão
                  </p>
                </div>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-3.5 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-extrabold text-sm rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Prosseguir para o Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
