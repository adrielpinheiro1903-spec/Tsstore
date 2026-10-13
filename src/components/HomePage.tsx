import React, { useState } from 'react';
import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Tablet,
  Volume2,
  Mouse,
  Zap,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Mail,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HeroBanner } from './HeroBanner';
import { ProductCard } from './ProductCard';
import headphonesImg from '../assets/images/product_headphones_studio_1791898411169.jpg';

export const HomePage: React.FC = () => {
  const { products, navigateTo, showNotification } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterAccepted, setNewsletterAccepted] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // FAQ accordion on home
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const bestSellers = products.filter((p) => p.bestSeller);
  const newReleases = products.filter((p) => p.isNew);
  const featuredProducts = products.filter((p) => p.featured);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.includes('@')) {
      showNotification('Digite um endereço de e-mail válido.', 'error');
      return;
    }
    if (!newsletterAccepted) {
      showNotification('Por favor, confirme seu consentimento para receber novidades.', 'error');
      return;
    }
    setNewsletterSubscribed(true);
    showNotification('Inscrição confirmada! Você receberá ofertas e lançamentos exclusivos.', 'success');
  };

  const categories = [
    { id: 'smartphones', label: 'Smartphones', icon: Smartphone, desc: 'Titanium & 5G' },
    { id: 'notebooks', label: 'Notebooks', icon: Laptop, desc: 'Criadores & Potência' },
    { id: 'headphones', label: 'Fones & Áudio', icon: Headphones, desc: 'ANC & Som Hi-Res' },
    { id: 'smartwatches', label: 'Smartwatches', icon: Watch, desc: 'Saúde & Esportes' },
    { id: 'tablets', label: 'Tablets', icon: Tablet, desc: 'Stylus & Produtividade' },
    { id: 'speakers', label: 'Caixas de Som', icon: Volume2, desc: 'À Prova d\'Água' },
    { id: 'peripherals', label: 'Periféricos', icon: Mouse, desc: 'Precisão Ergonômica' },
    { id: 'accessories', label: 'Carregadores GaN', icon: Zap, desc: 'Carga Ultra Rápida' },
  ];

  const homeFaqs = [
    {
      q: 'Como funciona o envio e o rastreamento dos produtos?',
      a: 'Todos os envios são realizados com seguro total contra extravio via Correios (Sedex) ou transportadora parceira. O código de rastreamento é gerado e enviado diretamente para o seu e-mail assim que o pacote é postado.',
    },
    {
      q: 'Qual é a garantia dos aparelhos comercializados pela TStore?',
      a: 'Oferecemos garantia de 12 meses (90 dias de garantia legal do CDC + garantia contratual do fabricante), assegurando reparo ou substituição em caso de defeitos de fabricação em território nacional.',
    },
    {
      q: 'Posso parcelar sem juros?',
      a: 'Sim, você pode parcelar suas compras em até 12x sem juros no cartão de crédito ou economizar 10% optando pelo pagamento via Pix.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] space-y-16 sm:space-y-24 pb-16">
      {/* 1. Main Hero Banner */}
      <HeroBanner />

      {/* 2. Visual Categories Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00F0FF] uppercase tracking-wider">
              <span>Navegue por Categoria</span>
              <span aria-hidden="true">·</span>
              <span>Ecossistema Completo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Equipamentos por Segmento
            </h2>
          </div>
          <button
            onClick={() => navigateTo('catalog')}
            className="text-xs font-semibold text-zinc-400 hover:text-[#00F0FF] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Catálogo Geral</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => navigateTo('catalog', undefined, cat.id)}
                className="p-4 rounded-xl bg-[#12141D] border border-zinc-800/80 hover:border-[#00F0FF]/50 hover:bg-zinc-800/50 hover:-translate-y-1 transition-all duration-200 text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-zinc-300 group-hover:text-[#00F0FF] group-hover:border-[#00F0FF]/40 transition-colors mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-[#00F0FF] transition-colors leading-tight">
                    {cat.label}
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                    {cat.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Mais Vendidos & Destaques Comerciais */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00F0FF] uppercase tracking-wider">
              <span>Preferência dos Clientes</span>
              <span aria-hidden="true">·</span>
              <span>Mais Vendidos</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Mais Vendidos na TStore
            </h2>
          </div>
          <button
            onClick={() => navigateTo('catalog')}
            className="text-xs font-semibold text-zinc-400 hover:text-[#00F0FF] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Todos os Mais Vendidos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Secondary Campaign Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-semibold text-[#00F0FF] uppercase tracking-wider">
              Engenharia Acústica Hi-Res
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Aurora Audio Apex ANC: <br />
              Silêncio Absoluto. Fidelidade de Estúdio.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
              Cancelamento de ruído adaptativo de -45dB, drivers com revestimento em titânio e autonomia de até 55 horas contínuas. Compatível com Bluetooth Multiponto e cabo Hi-Res balanceado.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => navigateTo('product-detail', 'tst-headphones-studio-anc')}
                className="px-6 py-3 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Ver Detalhes do Apex ANC
              </button>
              <span className="text-xs font-mono font-bold text-emerald-400">
                A partir de R$ 1.259,10 no Pix
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
              <img
                src={headphonesImg}
                alt="Aurora Apex ANC Headphone"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Lançamentos & Novidades 2026 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00F0FF] uppercase tracking-wider">
              <span>Novidades Tecnológicas</span>
              <span aria-hidden="true">·</span>
              <span>Recém-Chegados</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Lançamentos & Tecnologias Recentes
            </h2>
          </div>
          <button
            onClick={() => navigateTo('catalog')}
            className="text-xs font-semibold text-zinc-400 hover:text-[#00F0FF] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Explorar Novidades</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newReleases.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Benefícios de Comprar na TStore */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold text-[#00F0FF] uppercase tracking-wider">
            Por que Escolher a TStore?
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Segurança, Qualidade e Procedência
          </h2>
          <p className="text-xs text-zinc-400">
            Cada etapa da sua experiência de compra é projetada com rigor técnico e respeito ao consumidor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-[#12141D] border border-zinc-800 rounded-2xl space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#00F0FF]" />
            <h3 className="text-sm font-bold text-white">Garantia Nacional de 1 Ano</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dispositivos com cobertura total contra defeitos de fabricação em redes de suporte técnico autorizadas no Brasil.
            </p>
          </div>

          <div className="p-6 bg-[#12141D] border border-zinc-800 rounded-2xl space-y-3">
            <Truck className="w-8 h-8 text-[#00F0FF]" />
            <h3 className="text-sm font-bold text-white">Envio Expresso com Seguro</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Postagem rápida com código de rastreamento em tempo real e seguro total da carga até as suas mãos.
            </p>
          </div>

          <div className="p-6 bg-[#12141D] border border-zinc-800 rounded-2xl space-y-3">
            <RotateCcw className="w-8 h-8 text-[#00F0FF]" />
            <h3 className="text-sm font-bold text-white">7 Dias para Devolução (CDC)</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Direito de arrependimento integral conforme o Art. 49 do Código de Defesa do Consumidor sem complicações.
            </p>
          </div>

          <div className="p-6 bg-[#12141D] border border-zinc-800 rounded-2xl space-y-3">
            <CreditCard className="w-8 h-8 text-[#00F0FF]" />
            <h3 className="text-sm font-bold text-white">10% OFF Pix ou 12x Sem Juros</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Condições comerciais transparentes para você escolher a forma de pagamento mais vantajosa para o seu orçamento.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Dúvidas Frequentes (FAQ Compacto) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 space-y-1">
          <span className="text-xs font-semibold text-[#00F0FF] uppercase tracking-wider">
            FAQ TStore
          </span>
          <h2 className="text-2xl font-bold text-white">Perguntas Mais Comuns</h2>
        </div>

        <div className="space-y-3">
          {homeFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#12141E] border border-zinc-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:bg-zinc-800/40 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Newsletter Comercial Autêntica */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 bg-[#12141E] border border-zinc-800 rounded-3xl text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 text-[#00F0FF] flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Receba Lançamentos & Ofertas Exclusivas
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Cadastre seu e-mail para receber cupons sazonais, avisos de estoque e comparativos de novidades de eletrônicos.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-400 text-xs font-semibold">
              Obrigado! Seu e-mail foi cadastrado com sucesso na lista de novidades da TStore.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto space-y-3 pt-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  className="flex-1 bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#00F0FF]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cadastrar
                </button>
              </div>

              <label className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newsletterAccepted}
                  onChange={(e) => setNewsletterAccepted(e.target.checked)}
                  className="accent-[#00F0FF] rounded"
                />
                <span>Concordo em receber comunicações promocionais e novidades da TStore.</span>
              </label>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
