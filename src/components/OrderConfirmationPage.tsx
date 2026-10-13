import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Printer,
  Package,
  Truck,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Calendar,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderConfirmationPage: React.FC = () => {
  const { orders, selectedProductId, navigateTo, showNotification } = useStore();
  const [copiedPix, setCopiedPix] = useState(false);

  // The latest order or matching id
  const order = orders.find((o) => o.id === selectedProductId) || orders[0];

  if (!order) {
    return (
      <div className="min-h-screen bg-[#090A0F] py-20 text-center text-white">
        <p className="text-sm text-zinc-400">Nenhum pedido recente localizado.</p>
        <button
          onClick={() => navigateTo('home')}
          className="mt-4 px-4 py-2 bg-[#00F0FF] text-zinc-950 font-bold rounded-lg text-xs"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  const handleCopyPix = () => {
    if (order.paymentDetails?.pixCode) {
      navigator.clipboard?.writeText(order.paymentDetails.pixCode);
      setCopiedPix(true);
      showNotification('Código Pix Copia e Cola copiado para a área de transferência!', 'success');
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#090A0F] py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Header */}
        <div className="bg-[#10121A] border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#00F0FF] uppercase tracking-wider">
              <span>Pedido Registrado com Sucesso</span>
              <span aria-hidden="true">·</span>
              <span>Garantia Ativada</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Obrigado pela sua compra, {order.customer.name.split(' ')[0]}!
            </h1>

            <p className="text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
              Enviamos a confirmação detalhada para o e-mail{' '}
              <strong className="text-white">{order.customer.email}</strong>.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <span className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs font-mono font-bold text-white">
                Número do Pedido: <span className="text-[#00F0FF]">{order.id}</span>
              </span>
              {order.trackingCode && (
                <span className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs font-mono text-zinc-300">
                  Rastreio: <span className="text-emerald-400 font-bold">{order.trackingCode}</span>
                </span>
              )}
            </div>
          </div>

          {/* If Pix payment, display realistic QR code and Copia-e-Cola box */}
          {order.paymentMethod === 'pix' && (
            <div className="p-6 bg-zinc-950 border border-cyan-900/60 rounded-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <QrCode className="w-5 h-5 text-[#00F0FF]" />
                  <span>Pagamento Via Pix — Aprovação Imediata</span>
                </div>
                <span className="text-xs font-bold text-[#00F0FF] font-mono tabular-nums">
                  R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* Simulated Visual QR Box */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-xl">
                  {/* High quality SVG QR code representation */}
                  <svg className="w-36 h-36" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z" />
                    <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z" />
                    <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z" />
                    <circle cx="50" cy="50" r="14" fill="#090a0f" />
                    <text x="50" y="55" fill="#00f0ff" fontSize="13" fontWeight="bold" textAnchor="middle">T</text>
                    <path d="M35,10 h10 v10 h-10 z M50,15 h10 v10 h-10 z M35,40 h15 v10 h-15 z M70,40 h20 v10 h-20 z M40,70 h15 v10 h-15 z M60,65 h10 v20 h-10 z M75,75 h20 v15 h-20 z" />
                  </svg>
                  <span className="text-[10px] text-zinc-900 font-bold mt-1 uppercase">
                    Escaneie com seu banco
                  </span>
                </div>

                <div className="sm:col-span-8 space-y-3">
                  <p className="text-xs text-zinc-300">
                    Abra o aplicativo do seu banco, escolha <strong>Pix &gt; Ler QR Code</strong> ou use a opção <strong>Pix Copia e Cola</strong> com a chave abaixo:
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={order.paymentDetails?.pixCode || '00020126580014br.gov.bcb.pix0136tstore-pagamentos@tstore.com.br'}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg pl-3 pr-24 py-2.5 text-xs text-zinc-300 font-mono outline-none"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="absolute right-1.5 top-1.5 px-3 py-1 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    A confirmação do pagamento é processada instantaneamente pelo Banco Central e o status do pedido é atualizado em poucos segundos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Shipping and Delivery Tracker */}
          <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#00F0FF]" />
              <span>Status e Acompanhamento da Entrega</span>
            </h3>

            {/* Stepper Timeline */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 mx-auto mb-1" />
                <span>Pedido Confirmado</span>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/60 text-[#00F0FF] font-semibold">
                <Package className="w-4 h-4 mx-auto mb-1" />
                <span>Em Separação no CD</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 font-medium">
                <Truck className="w-4 h-4 mx-auto mb-1" />
                <span>Envio & Transporte</span>
              </div>
            </div>

            <div className="text-xs text-zinc-400 space-y-1 pt-2">
              <p>
                <strong>Endereço de Destino:</strong> {order.shippingAddress.street}, {order.shippingAddress.number} {order.shippingAddress.complement && `(${order.shippingAddress.complement})`} - {order.shippingAddress.neighborhood}, {order.shippingAddress.city}/{order.shippingAddress.state} - CEP {order.shippingAddress.cep}
              </p>
              <p>
                <strong>Previsão de Entrega:</strong> {order.shippingOption.deliveryDays} via {order.shippingOption.carrier}
              </p>
            </div>
          </div>

          {/* Purchased Items Itemization */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Itens do Pedido ({order.items.length})
            </h3>
            <div className="divide-y divide-zinc-800 border-t border-b border-zinc-800">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-lg bg-zinc-950 border border-zinc-800 shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-white">{item.product.name}</p>
                      <p className="text-zinc-400">
                        {item.quantity}x de R$ {item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white tabular-nums">
                    R$ {(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-sm font-bold text-white">Total Pago:</span>
              <span className="text-xl font-extrabold text-[#00F0FF] font-mono tabular-nums">
                R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Recibo / Salvar PDF</span>
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => navigateTo('account')}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Acompanhar na Minha Conta
              </button>
              <button
                onClick={() => navigateTo('catalog')}
                className="px-5 py-2.5 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continuar Comprando</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
