import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Truck,
  DollarSign,
  ArrowLeft,
  X,
  Search,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, OrderStatus, ProductCategory } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    coupons,
    updateProduct,
    deleteProduct,
    addProduct,
    updateOrderStatus,
    navigateTo,
    showNotification,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'kpis' | 'products' | 'orders' | 'coupons'>('kpis');

  // Product Add / Edit Modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('smartphones');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');

  // Search in admin products
  const [adminProductSearch, setAdminProductSearch] = useState('');

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const averageTicket = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const openCreateProduct = () => {
    setEditingProductId(null);
    setFormName('');
    setFormBrand('');
    setFormCategory('smartphones');
    setFormPrice('999.00');
    setFormOriginalPrice('');
    setFormStock('10');
    setFormSku(`TST-${Date.now().toString().slice(-6)}`);
    setFormShortDesc('');
    setFormDesc('');
    setProductModalOpen(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setFormName(p.name);
    setFormBrand(p.brand);
    setFormCategory(p.category);
    setFormPrice(p.price.toString());
    setFormOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setFormStock(p.stock.toString());
    setFormSku(p.sku);
    setFormShortDesc(p.shortDescription);
    setFormDesc(p.description);
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formPrice) || 0;
    const origPriceNum = formOriginalPrice ? parseFloat(formOriginalPrice) : undefined;
    const stockNum = parseInt(formStock, 10) || 0;

    if (!formName.trim() || priceNum <= 0) {
      showNotification('Preencha o nome e um preço válido.', 'error');
      return;
    }

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: formName,
        brand: formBrand,
        category: formCategory,
        price: priceNum,
        originalPrice: origPriceNum,
        stock: stockNum,
        sku: formSku,
        shortDescription: formShortDesc,
        description: formDesc,
      });
    } else {
      addProduct({
        name: formName,
        brand: formBrand,
        category: formCategory,
        categoryLabel: formCategory.toUpperCase(),
        price: priceNum,
        originalPrice: origPriceNum,
        pixDiscountPercent: 10,
        maxInstallments: 12,
        stock: stockNum,
        sku: formSku,
        image: products[0].image,
        rating: 5.0,
        reviewsCount: 1,
        shortDescription: formShortDesc || 'Eletrônico de alto desempenho com garantia oficial.',
        description: formDesc || 'Produto de qualidade assegurada, testado e com garantia nacional.',
        specs: {
          'Garantia': '12 meses oficial',
          'Origem': 'Nacional / Homologado Anatel',
        },
      });
    }

    setProductModalOpen(false);
  };

  const filteredAdminProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(adminProductSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(adminProductSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(adminProductSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#090A0F] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <button
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#00F0FF] mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar à Loja
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Painel de Gestão da TStore</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-[#00F0FF] border border-cyan-800">
                PROD-READY
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Controle de pedidos, catálogo de produtos, estoque e inteligência comercial
            </p>
          </div>

          <button
            onClick={openCreateProduct}
            className="px-4 py-2.5 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Produto</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex gap-2 border-b border-zinc-800 pb-2 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'kpis', label: 'Indicadores de Venda', icon: TrendingUp },
            { id: 'products', label: `Catálogo & Estoque (${products.length})`, icon: Package },
            { id: 'orders', label: `Pedidos Recebidos (${orders.length})`, icon: ShoppingBag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
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

        {/* TAB: KPIS */}
        {activeTab === 'kpis' && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-[#12141E] border border-zinc-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-zinc-400 text-xs">
                  <span>Receita Faturada</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-extrabold text-white font-mono tabular-nums">
                  R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-emerald-400 font-medium">Transações registradas</p>
              </div>

              <div className="p-6 bg-[#12141E] border border-zinc-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-zinc-400 text-xs">
                  <span>Pedidos Concluídos</span>
                  <ShoppingBag className="w-4 h-4 text-[#00F0FF]" />
                </div>
                <p className="text-2xl font-extrabold text-white font-mono tabular-nums">
                  {totalOrdersCount}
                </p>
                <p className="text-[11px] text-zinc-400 font-medium">Fluxo operacional ativo</p>
              </div>

              <div className="p-6 bg-[#12141E] border border-zinc-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-zinc-400 text-xs">
                  <span>Ticket Médio</span>
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-2xl font-extrabold text-white font-mono tabular-nums">
                  R$ {averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-zinc-400 font-medium">Por cliente/pedido</p>
              </div>

              <div className="p-6 bg-[#12141E] border border-zinc-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-zinc-400 text-xs">
                  <span>Estoque Baixo (&le; 5 un.)</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums">
                  {lowStockProducts.length}
                </p>
                <p className="text-[11px] text-zinc-400 font-medium">Produtos precisando de reposição</p>
              </div>
            </div>

            {/* Low stock alerts */}
            {lowStockProducts.length > 0 && (
              <div className="p-6 bg-[#12141E] border border-amber-900/40 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Atenção: Produtos com Alerta de Reposição</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-white">{p.name}</p>
                        <p className="text-zinc-400 font-mono">SKU: {p.sku}</p>
                      </div>
                      <span className="font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800">
                        {p.stock} un.
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  value={adminProductSearch}
                  onChange={(e) => setAdminProductSearch(e.target.value)}
                  placeholder="Pesquisar produto ou SKU..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-[#00F0FF]"
                />
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
              </div>

              <span className="text-xs text-zinc-400">
                {filteredAdminProducts.length} produtos listados
              </span>
            </div>

            <div className="bg-[#12141E] border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Produto</th>
                      <th className="py-3 px-4">Categoria</th>
                      <th className="py-3 px-4">Preço (R$)</th>
                      <th className="py-3 px-4">Estoque</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {filteredAdminProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-md bg-zinc-950 border border-zinc-800 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-white">{p.name}</p>
                            <p className="text-[11px] text-zinc-400 font-mono">{p.brand} · SKU: {p.sku}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{p.categoryLabel}</td>
                        <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                          R$ {p.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                              p.stock <= 5
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-zinc-800 text-zinc-200'
                            }`}
                          >
                            {p.stock} un.
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => openEditProduct(p)}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-colors cursor-pointer"
                            title="Editar produto"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Deseja realmente excluir "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 bg-zinc-800 hover:bg-rose-900/60 text-zinc-400 hover:text-rose-400 rounded-md transition-colors cursor-pointer"
                            title="Excluir produto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ORDERS */}
        {activeTab === 'orders' && (
          <div className="mt-8 space-y-4">
            {orders.length === 0 ? (
              <div className="p-10 text-center bg-[#12141E] border border-zinc-800 rounded-2xl text-zinc-400 text-xs">
                Nenhum pedido registrado no momento.
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 bg-[#12141E] border border-zinc-800 rounded-2xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-2 text-xs">
                    <div>
                      <span className="font-mono font-bold text-base text-[#00F0FF]">{ord.id}</span>
                      <p className="text-zinc-400">
                        Cliente: <strong className="text-white">{ord.customer.name}</strong> ({ord.customer.email})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-zinc-400">Status do Pedido:</span>
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          updateOrderStatus(ord.id, e.target.value as OrderStatus)
                        }
                        className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer"
                      >
                        <option value="pending_payment">Aguardando Pagamento</option>
                        <option value="payment_approved">Pagamento Aprovado</option>
                        <option value="preparing_shipment">Em Separação</option>
                        <option value="shipped">Enviado / Rastreio Ativo</option>
                        <option value="delivered">Entregue ao Cliente</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300">
                    <div>
                      <p className="text-zinc-400">Endereço de Envio:</p>
                      <p>{ord.shippingAddress.street}, {ord.shippingAddress.number} - {ord.shippingAddress.city}/{ord.shippingAddress.state}</p>
                      <p className="text-zinc-400 mt-1">
                        Método: <strong>{ord.shippingOption.name}</strong> (Rastreio: {ord.trackingCode || 'Pendente'})
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-zinc-400">Pagamento: <strong>{ord.paymentMethod.toUpperCase()}</strong></p>
                      <p className="text-base font-bold text-white font-mono mt-1 tabular-nums">
                        Total: R$ {ord.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Product Add / Edit Modal */}
        {productModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-base font-bold text-white">
                  {editingProductId ? 'Editar Produto' : 'Cadastrar Novo Produto'}
                </h3>
                <button
                  onClick={() => setProductModalOpen(false)}
                  className="text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Nome do Produto *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Smartphone Titanium 15 Pro"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">Marca *</label>
                    <input
                      type="text"
                      required
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      placeholder="Ex: NovaTech"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">Categoria *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none cursor-pointer"
                    >
                      <option value="smartphones">Smartphones</option>
                      <option value="notebooks">Notebooks</option>
                      <option value="tablets">Tablets</option>
                      <option value="headphones">Fones de Ouvido</option>
                      <option value="smartwatches">Smartwatches</option>
                      <option value="speakers">Caixas de Som</option>
                      <option value="peripherals">Periféricos</option>
                      <option value="accessories">Acessórios</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">Preço Atual (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">Preço Anterior (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(e.target.value)}
                      placeholder="Opcional"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">Estoque (un.) *</label>
                    <input
                      type="number"
                      required
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Código SKU</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Descrição Curta</label>
                  <textarea
                    rows={2}
                    value={formShortDesc}
                    onChange={(e) => setFormShortDesc(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setProductModalOpen(false)}
                    className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00F0FF] text-zinc-950 font-bold rounded-lg hover:bg-cyan-400"
                  >
                    Salvar Produto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
