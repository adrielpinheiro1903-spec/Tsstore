import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  FileText,
  Truck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Info,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ShippingOption } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    currentUser,
    cartSubtotal,
    calculatedDiscount,
    cartTotal,
    createOrder,
    navigateTo,
    showNotification,
  } = useStore();

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#090A0F] py-16 text-center text-white">
        <p className="text-sm text-zinc-400">Seu carrinho está vazio para finalizar compras.</p>
        <button
          onClick={() => navigateTo('catalog')}
          className="mt-4 px-4 py-2 bg-[#00F0FF] text-zinc-950 font-bold rounded-lg text-xs"
        >
          Voltar ao Catálogo
        </button>
      </div>
    );
  }

  // Step state: 1: Identificação, 2: Entrega, 3: Pagamento
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Customer Data
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerCpf, setCustomerCpf] = useState(currentUser?.cpf || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');

  // Shipping Address Data
  const defaultAddr = currentUser?.savedAddresses[0];
  const [cep, setCep] = useState(defaultAddr?.cep || '01310-100');
  const [street, setStreet] = useState(defaultAddr?.street || 'Avenida Paulista');
  const [number, setNumber] = useState(defaultAddr?.number || '1000');
  const [complement, setComplement] = useState(defaultAddr?.complement || 'Apto 101');
  const [neighborhood, setNeighborhood] = useState(defaultAddr?.neighborhood || 'Bela Vista');
  const [city, setCity] = useState(defaultAddr?.city || 'São Paulo');
  const [state, setState] = useState(defaultAddr?.state || 'SP');

  // Shipping Options
  const shippingOptions: ShippingOption[] = [
    {
      id: 'sedex',
      name: 'Sedex Expresso Segurado',
      carrier: 'Correios Brasil',
      price: 24.90,
      deliveryDays: '1 a 3 dias úteis',
    },
    {
      id: 'transportadora',
      name: 'Loggi Express Tech',
      carrier: 'Loggi Transportes',
      price: 18.50,
      deliveryDays: '2 a 4 dias úteis',
    },
  ];
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(shippingOptions[0]);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix');
  const [installments, setInstallments] = useState(1);
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Additional Pix discount
  const pixDiscountValue = paymentMethod === 'pix' ? cartTotal * 0.10 : 0;
  const finalPayableTotal = Math.max(0, cartTotal - pixDiscountValue + selectedShipping.price);

  // Validations
  const validateStep1 = () => {
    if (!customerName.trim() || !customerEmail.includes('@') || !customerCpf.trim()) {
      showNotification('Preencha seu Nome, E-mail válido e CPF para prosseguir.', 'error');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!cep.trim() || !street.trim() || !number.trim() || !city.trim()) {
      showNotification('Preencha o CEP, logradouro, número e cidade de entrega.', 'error');
      return false;
    }
    return true;
  };

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) return;

    if (paymentMethod === 'credit_card') {
      if (cardNumber.replace(/\s/g, '').length < 13 || !cardExpiry || !cardCvv) {
        showNotification('Informe os dados completos do cartão para validação.', 'error');
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = createOrder({
        customer: {
          id: currentUser?.id || `guest-${Date.now()}`,
          name: customerName,
          email: customerEmail,
          cpf: customerCpf,
          phone: customerPhone,
          savedAddresses: [],
        },
        shippingAddress: {
          cep,
          street,
          number,
          complement,
          neighborhood,
          city,
          state,
        },
        items: cart,
        subtotal: cartSubtotal,
        discount: calculatedDiscount + pixDiscountValue,
        shippingCost: selectedShipping.price,
        shippingOption: selectedShipping,
        total: finalPayableTotal,
        paymentMethod,
        paymentDetails: {
          cardLast4: paymentMethod === 'credit_card' ? cardNumber.slice(-4) : undefined,
          cardBrand: paymentMethod === 'credit_card' ? 'Mastercard' : undefined,
          installments: paymentMethod === 'credit_card' ? installments : undefined,
          pixCode: paymentMethod === 'pix' ? '00020126580014br.gov.bcb.pix0136tstore-pagamentos-autenticados@tstore.com.br5204000053039865406' + finalPayableTotal.toFixed(2) : undefined,
          boletoBarcode: paymentMethod === 'boleto' ? '34191.79001 01043.510047 91020.150008 4 99880000' + finalPayableTotal.toFixed(0) : undefined,
        },
      });

      setIsSubmitting(false);
      navigateTo('order-confirmation', order.id);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Step Indicator */}
        <div className="mb-8">
          <button
            onClick={() => navigateTo('cart')}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao Carrinho
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Finalização de Pedido Seguro</h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Ambiente criptografado SSL 256-bit com autenticação de gateway
              </p>
            </div>

            {/* Stepper tabs */}
            <div className="flex items-center gap-2">
              {[
                { num: 1, label: 'Identificação' },
                { num: 2, label: 'Entrega' },
                { num: 3, label: 'Pagamento' },
              ].map((s) => (
                <div
                  key={s.num}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    currentStep === s.num
                      ? 'bg-zinc-800 text-[#00F0FF] border border-[#00F0FF]/40'
                      : currentStep > s.num
                      ? 'bg-zinc-900 text-emerald-400'
                      : 'text-zinc-500'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-zinc-950 flex items-center justify-center text-[10px]">
                    {currentStep > s.num ? '✓' : s.num}
                  </span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleFinishOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Flow */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: IDENTIFICAÇÃO */}
            <div className="bg-[#12141E] border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-base font-bold text-white">Dados do Comprador</h2>
                </div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-[#00F0FF] hover:underline cursor-pointer"
                  >
                    Editar
                  </button>
                )}
              </div>

              {currentStep === 1 ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo de Oliveira"
                      className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F0FF] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        E-mail para Confirmação *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="seu.email@exemplo.com.br"
                        className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F0FF] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        CPF (para Emissão de Nota Fiscal) *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerCpf}
                        onChange={(e) => setCustomerCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F0FF] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Telefone / WhatsApp com DDD
                    </label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F0FF] outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setCurrentStep(2);
                    }}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Avançar para Endereço de Entrega</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="mt-3 text-xs text-zinc-400">
                  <p className="font-semibold text-zinc-200">{customerName}</p>
                  <p>{customerEmail} · CPF: {customerCpf}</p>
                </div>
              )}
            </div>

            {/* STEP 2: ENDEREÇO & FRETE */}
            <div className="bg-[#12141E] border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-base font-bold text-white">Endereço de Entrega & Frete</h2>
                </div>
                {currentStep > 2 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs text-[#00F0FF] hover:underline cursor-pointer"
                  >
                    Editar
                  </button>
                )}
              </div>

              {currentStep === 2 ? (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        CEP *
                      </label>
                      <input
                        type="text"
                        required
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        placeholder="01310-100"
                        className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F0FF] outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Logradouro (Rua / Av.) *
                      </label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Ex: Avenida Paulista"
                        className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F0FF] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Número *
                      </label>
                      <input
                        type="text"
                        required
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="1000"
                        className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F0FF] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Complemento
                      </label>
                      <input
                        type="text"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        placeholder="Apto 101"
                        className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F0FF] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Bairro
                      </label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Bela Vista"
                        className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F0FF] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Cidade / UF *
                      </label>
                      <input
                        type="text"
                        value={`${city} - ${state}`}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="São Paulo - SP"
                        className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F0FF] outline-none"
                      />
                    </div>
                  </div>

                  {/* Carrier Options */}
                  <div className="pt-3 border-t border-zinc-800 space-y-2">
                    <label className="block text-xs font-semibold text-zinc-200">
                      Escolha o Método de Envio:
                    </label>
                    <div className="space-y-2">
                      {shippingOptions.map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                            selectedShipping.id === opt.id
                              ? 'bg-zinc-900 border-[#00F0FF] text-white'
                              : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              checked={selectedShipping.id === opt.id}
                              onChange={() => setSelectedShipping(opt)}
                              className="accent-[#00F0FF]"
                            />
                            <div>
                              <p className="text-xs font-bold text-white">{opt.name}</p>
                              <p className="text-[11px] text-zinc-400">
                                {opt.carrier} · Prazo estimado: {opt.deliveryDays}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-white tabular-nums">
                            R$ {opt.price.toFixed(2)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep2()) setCurrentStep(3);
                    }}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Avançar para Pagamento</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="mt-3 text-xs text-zinc-400">
                  <p>{street}, {number} {complement && `(${complement})`} - {neighborhood}, {city}/{state} - CEP {cep}</p>
                  <p className="text-zinc-300 font-medium mt-1">Envio: {selectedShipping.name} (R$ {selectedShipping.price.toFixed(2)})</p>
                </div>
              )}
            </div>

            {/* STEP 3: FORMA DE PAGAMENTO */}
            <div className="bg-[#12141E] border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
                <span className="w-6 h-6 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="text-base font-bold text-white">Método de Pagamento</h2>
              </div>

              <div className="mt-4 space-y-4">
                {/* Method selector tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'pix'
                        ? 'bg-cyan-950/40 border-[#00F0FF] text-[#00F0FF]'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span className="text-xs font-bold">Pix (10% OFF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'credit_card'
                        ? 'bg-cyan-950/40 border-[#00F0FF] text-[#00F0FF]'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs font-bold">Cartão até 12x</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('boleto')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'boleto'
                        ? 'bg-cyan-950/40 border-[#00F0FF] text-[#00F0FF]'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-xs font-bold">Boleto Bancário</span>
                  </button>
                </div>

                {/* Sub-panels according to selected method */}
                {paymentMethod === 'pix' && (
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Desconto imediato de 10% aplicado no Pix!</span>
                    </div>
                    <p className="text-zinc-300">
                      Após clicar em &quot;Confirmar Pedido&quot;, o código Pix com QR Code e Chave Copia e Cola será gerado na tela com confirmação automática pelo Banco Central.
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Aprovação instantânea 24h por dia, 7 dias por semana.
                    </p>
                  </div>
                )}

                {paymentMethod === 'credit_card' && (
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Nome impresso no Cartão *
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Como escrito no cartão"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white uppercase focus:border-[#00F0FF] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Número do Cartão *
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-[#00F0FF] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Validade (MM/AA) *
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-[#00F0FF] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          CVV (Cód. Segurança) *
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-[#00F0FF] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Opções de Parcelamento:
                      </label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((parc) => {
                          const val = finalPayableTotal / parc;
                          return (
                            <option key={parc} value={parc}>
                              {parc}x de R$ {val.toFixed(2)} sem juros
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 pt-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Transação tokenizada com gateway seguro PCI-DSS Nível 1.</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'boleto' && (
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2 text-xs text-zinc-300">
                    <p className="font-semibold text-white">Boleto Bancário Registrado</p>
                    <p>O boleto será emitido com vencimento para 3 dias úteis. Compensação em 1 a 2 dias úteis após o pagamento.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Confirmation CTA */}
          <div className="lg:col-span-5 bg-[#12141E] border border-zinc-800 rounded-2xl p-6 space-y-6 sticky top-24">
            <h2 className="text-base font-bold text-white pb-3 border-b border-zinc-800">
              Resumo do Pedido ({cart.reduce((s, i) => s + i.quantity, 0)} itens)
            </h2>

            {/* Items snippet */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center text-xs">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded-lg bg-zinc-950 border border-zinc-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-zinc-200 truncate">{item.product.name}</p>
                    <p className="text-zinc-400">Qtd: {item.quantity}x</p>
                  </div>
                  <span className="font-mono text-zinc-100 font-bold tabular-nums">
                    R$ {(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-zinc-400 pt-3 border-t border-zinc-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-zinc-200 tabular-nums">
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

              {paymentMethod === 'pix' && pixDiscountValue > 0 && (
                <div className="flex justify-between text-[#00F0FF]">
                  <span>Desconto 10% no Pix</span>
                  <span className="font-mono tabular-nums">
                    - R$ {pixDiscountValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Frete ({selectedShipping.name})</span>
                <span className="font-mono text-zinc-200 tabular-nums">
                  R$ {selectedShipping.price.toFixed(2)}
                </span>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
                <span className="text-base font-bold text-white">Valor Final</span>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-[#00F0FF] font-mono tabular-nums">
                    R$ {finalPayableTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  {paymentMethod === 'credit_card' && installments > 1 && (
                    <p className="text-[11px] text-zinc-400">
                      {installments}x de R$ {(finalPayableTotal / installments).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-extrabold text-sm rounded-xl shadow-xl hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Processando Pedido com Segurança...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Confirmar & Concluir Pedido</span>
                </>
              )}
            </button>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 flex items-start gap-2.5 text-[11px] text-zinc-400">
              <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <span>
                Ao confirmar, você concorda com os Termos de Serviço e a Política de Trocas e Devoluções TStore. Garantia legal de 7 dias de arrependimento (Art. 49 CDC) + 1 ano de garantia nacional.
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
