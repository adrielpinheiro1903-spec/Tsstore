import React, { useState } from 'react';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
  Trash2,
  ShoppingCart,
  Plus,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Address } from '../types';

export const CustomerAccountPage: React.FC = () => {
  const {
    currentUser,
    orders,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    loginUser,
    logoutUser,
    updateCustomerProfile,
    navigateTo,
    showNotification,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'wishlist'>('orders');

  // Auth form state if not logged in
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Profile edit state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editCpf, setEditCpf] = useState(currentUser?.cpf || '');

  // Add address modal
  const [newAddrModal, setNewAddrModal] = useState(false);
  const [newCep, setNewCep] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    loginUser(emailInput, nameInput.trim() || 'Cliente TStore');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
      name: editName,
      phone: editPhone,
      cpf: editCpf,
    });
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCep.trim() || !newStreet.trim()) return;
    const addr: Address = {
      id: `addr-${Date.now()}`,
      cep: newCep,
      street: newStreet,
      number: newNumber,
      neighborhood: newNeighborhood,
      city: newCity,
      state: newState,
      isDefault: false,
    };
    const currentAddresses = currentUser?.savedAddresses || [];
    updateCustomerProfile({
      savedAddresses: [...currentAddresses, addr],
    });
    setNewAddrModal(false);
    setNewCep('');
    setNewStreet('');
    setNewNumber('');
    showNotification('Novo endereço cadastrado!', 'success');
  };

  // If user is not authenticated, show login/register card
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#090A0F] py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#12141E] border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 text-[#00F0FF] flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white">Minha Conta TStore</h1>
            <p className="text-xs text-zinc-400">
              Acesse seus pedidos, acompanhe o rastreio e gerencie seus endereços.
            </p>
          </div>

          <div className="flex border-b border-zinc-800 text-xs font-semibold">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 pb-3 border-b-2 transition-colors cursor-pointer ${
                authMode === 'login'
                  ? 'border-[#00F0FF] text-[#00F0FF]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 pb-3 border-b-2 transition-colors cursor-pointer ${
                authMode === 'register'
                  ? 'border-[#00F0FF] text-[#00F0FF]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Criar Cadastro
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F0FF] outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                E-mail
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="seu.email@exemplo.com.br"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F0FF] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Senha
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F0FF] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              {authMode === 'login' ? 'Acessar Conta' : 'Concluir Cadastro'}
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-zinc-500">
            Ambiente de demonstração autônomo com persistência local segura.
          </div>
        </div>
      </div>
    );
  }

  // Wishlisted products list
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#090A0F] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Account Top Summary */}
        <div className="bg-[#12141E] border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700 text-[#00F0FF] font-bold text-xl flex items-center justify-center">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{currentUser.name}</h1>
              <p className="text-xs text-zinc-400">
                {currentUser.email} · CPF: {currentUser.cpf}
              </p>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg border border-zinc-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da Conta</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex gap-2 border-b border-zinc-800 pb-2 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'orders', label: `Meus Pedidos (${orders.length})`, icon: Package },
            { id: 'wishlist', label: `Lista de Favoritos (${wishlist.length})`, icon: Heart },
            { id: 'addresses', label: 'Endereços de Entrega', icon: MapPin },
            { id: 'profile', label: 'Dados Pessoais', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-[#00F0FF] border border-[#00F0FF]/40'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="mt-8">
          {/* TAB 1: MEUS PEDIDOS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="p-12 text-center bg-[#10121A] border border-zinc-800 rounded-2xl">
                  <Package className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-white">Você ainda não realizou pedidos.</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Conheça nossas novidades e compre no Pix com 10% de desconto.
                  </p>
                  <button
                    onClick={() => navigateTo('catalog')}
                    className="mt-4 px-4 py-2 bg-[#00F0FF] text-zinc-950 font-bold text-xs rounded-lg"
                  >
                    Ver Produtos
                  </button>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-[#12141E] border border-zinc-800 rounded-2xl p-6 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-2">
                      <div>
                        <span className="text-xs text-zinc-400">Pedido</span>
                        <h3 className="text-base font-bold text-white font-mono">{ord.id}</h3>
                        <p className="text-[11px] text-zinc-400">
                          Realizado em: {new Date(ord.date).toLocaleDateString('pt-BR')} às {new Date(ord.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : ord.status === 'shipped'
                              ? 'bg-cyan-950 text-[#00F0FF] border border-cyan-800'
                              : 'bg-zinc-800 text-zinc-200'
                          }`}
                        >
                          {ord.status === 'shipped'
                            ? 'Enviado com Rastreio'
                            : ord.status === 'delivered'
                            ? 'Entregue'
                            : 'Pagamento Confirmado'}
                        </span>

                        <span className="text-sm font-extrabold text-white font-mono tabular-nums">
                          R$ {ord.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Order tracking strip */}
                    {ord.trackingCode && (
                      <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Truck className="w-4 h-4 text-[#00F0FF]" />
                          <span>Código de Rastreio dos Correios:</span>
                          <strong className="text-emerald-400 font-mono">{ord.trackingCode}</strong>
                        </div>
                        <span className="text-[11px] text-zinc-400">
                          Transportadora: {ord.shippingOption.carrier}
                        </span>
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-2 pt-1">
                      {ord.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs py-1">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover rounded-md bg-zinc-950 border border-zinc-800"
                            />
                            <div>
                              <p className="font-semibold text-zinc-200">{item.product.name}</p>
                              <p className="text-[11px] text-zinc-400">
                                {item.quantity}x de R$ {item.unitPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <span className="font-mono text-zinc-100 font-bold tabular-nums">
                            R$ {(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-zinc-800/60 text-right">
                      <button
                        onClick={() => navigateTo('order-confirmation', ord.id)}
                        className="text-xs text-[#00F0FF] hover:underline font-semibold cursor-pointer"
                      >
                        Ver Recibo Completo do Pedido →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: FAVORITOS */}
          {activeTab === 'wishlist' && (
            <div>
              {wishlistedProducts.length === 0 ? (
                <div className="p-12 text-center bg-[#10121A] border border-zinc-800 rounded-2xl">
                  <Heart className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-white">Sua lista de favoritos está vazia.</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Clique no ícone de coração nos produtos para salvá-los aqui.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#12141D] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-4"
                    >
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-950">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="absolute top-2 right-2 p-1.5 bg-zinc-900/80 rounded-full text-rose-400 hover:bg-zinc-900"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                          {p.brand}
                        </span>
                        <h4
                          onClick={() => navigateTo('product-detail', p.id)}
                          className="text-xs font-bold text-white hover:text-[#00F0FF] transition-colors cursor-pointer line-clamp-1"
                        >
                          {p.name}
                        </h4>
                        <p className="text-sm font-bold text-[#00F0FF] mt-1 tabular-nums font-mono">
                          R$ {(p.price * 0.9).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} no Pix
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => navigateTo('product-detail', p.id)}
                          className="py-1.5 bg-zinc-800 text-xs text-zinc-300 font-medium rounded-lg text-center"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => addToCart(p, 1)}
                          className="py-1.5 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 text-xs font-bold rounded-lg flex items-center justify-center gap-1"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Carrinho</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ENDEREÇOS */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Endereços Cadastrados</h3>
                <button
                  onClick={() => setNewAddrModal(true)}
                  className="px-3 py-1.5 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Endereço</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(currentUser.savedAddresses || []).map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 bg-[#12141E] border border-zinc-800 rounded-2xl space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{addr.street}, {addr.number}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] text-[#00F0FF] bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800 font-semibold">
                          Padrão
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-400">
                      {addr.complement && `${addr.complement} - `}{addr.neighborhood}
                    </p>
                    <p className="text-zinc-400">
                      {addr.city} / {addr.state} — CEP: {addr.cep}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Address Modal */}
              {newAddrModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
                    <h3 className="text-base font-bold text-white">Cadastrar Novo Endereço</h3>
                    <form onSubmit={handleAddAddress} className="space-y-3">
                      <div>
                        <label className="block text-xs text-zinc-300 mb-1">CEP *</label>
                        <input
                          type="text"
                          required
                          value={newCep}
                          onChange={(e) => setNewCep(e.target.value)}
                          placeholder="01310-100"
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="block text-xs text-zinc-300 mb-1">Logradouro *</label>
                          <input
                            type="text"
                            required
                            value={newStreet}
                            onChange={(e) => setNewStreet(e.target.value)}
                            placeholder="Rua / Avenida"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-300 mb-1">Número *</label>
                          <input
                            type="text"
                            required
                            value={newNumber}
                            onChange={(e) => setNewNumber(e.target.value)}
                            placeholder="123"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-zinc-300 mb-1">Cidade</label>
                          <input
                            type="text"
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                            placeholder="São Paulo"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-300 mb-1">Estado</label>
                          <input
                            type="text"
                            value={newState}
                            onChange={(e) => setNewState(e.target.value)}
                            placeholder="SP"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setNewAddrModal(false)}
                          className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold bg-[#00F0FF] text-zinc-950 rounded-lg"
                        >
                          Salvar Endereço
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PERFIL */}
          {activeTab === 'profile' && (
            <div className="max-w-xl bg-[#12141E] border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">Dados Cadastrais</h3>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">E-mail</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.email}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">CPF</label>
                  <input
                    type="text"
                    value={editCpf}
                    onChange={(e) => setEditCpf(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Telefone Celular</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl"
                >
                  Salvar Alterações
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
