import React from 'react';
import { ShieldCheck, Lock, QrCode, CreditCard, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { navigateTo, setAdminUnlocked } = useStore();

  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-xs">
      {/* Top Value Banner Strip */}
      <div className="border-b border-zinc-800/80 bg-[#090A0F] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-[#00F0FF] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Garantia Nacional 12 Meses</h4>
              <p className="text-[11px] text-zinc-400">Suporte e rede de assistência autorizada no Brasil.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-[#00F0FF] flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">10% OFF no Pix à Vista</h4>
              <p className="text-[11px] text-zinc-400">Confirmação em tempo real pelo Banco Central.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-[#00F0FF] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Criptografia & Compra Segura</h4>
              <p className="text-[11px] text-zinc-400">Proteção de dados com padrão PCI-DSS e SSL 256-bit.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <span className="text-[#00F0FF] font-bold text-base">T</span>
            </div>
            <span className="text-lg font-bold text-white">
              T<span className="text-[#00F0FF]">Store</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
            Sua loja definitiva de eletrônicos e tecnologia no Brasil. Dispositivos de alta performance com procedência, Nota Fiscal Eletrônica e envio expresso.
          </p>
          <div className="text-xs space-y-1 text-zinc-400 pt-1">
            <p>Atendimento: Segunda a Sexta, das 09h às 18h</p>
            <p>E-mail: <span className="text-zinc-200">atendimento@tstore.com.br</span></p>
            <p>WhatsApp Comercial: <span className="text-emerald-400 font-mono">(11) 98765-4321</span></p>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Categorias
          </h4>
          <ul className="space-y-2 text-xs">
            {['smartphones', 'notebooks', 'headphones', 'smartwatches', 'tablets'].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => navigateTo('catalog', undefined, cat)}
                  className="hover:text-[#00F0FF] transition-colors cursor-pointer capitalize"
                >
                  {cat === 'smartphones'
                    ? 'Smartphones'
                    : cat === 'notebooks'
                    ? 'Notebooks'
                    : cat === 'headphones'
                    ? 'Fones & Áudio'
                    : cat === 'smartwatches'
                    ? 'Smartwatches'
                    : 'Tablets'}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care / Help */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Atendimento
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => navigateTo('faq')}
                className="hover:text-[#00F0FF] transition-colors cursor-pointer"
              >
                Dúvidas Frequentes (FAQ)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('contact')}
                className="hover:text-[#00F0FF] transition-colors cursor-pointer"
              >
                Fale Conosco
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('policies')}
                className="hover:text-[#00F0FF] transition-colors cursor-pointer"
              >
                Trocas e Devoluções (CDC)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('account')}
                className="hover:text-[#00F0FF] transition-colors cursor-pointer"
              >
                Acompanhar Meu Pedido
              </button>
            </li>
          </ul>
        </div>

        {/* Institutional & Legal */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Institucional
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => navigateTo('about')}
                className="hover:text-[#00F0FF] transition-colors cursor-pointer"
              >
                Sobre a TStore
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('policies')}
                className="hover:text-[#00F0FF] transition-colors cursor-pointer"
              >
                Política de Privacidade LGPD
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('policies')}
                className="hover:text-[#00F0FF] transition-colors cursor-pointer"
              >
                Termos e Condições de Uso
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('admin')}
                className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                Gestão Administrativa
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Payment methods and certificates strip */}
      <div className="border-t border-zinc-800/60 py-6 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-zinc-400 font-medium mr-2">Formas de Pagamento:</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] font-bold text-[#00F0FF]">
              <QrCode className="w-3.5 h-3.5" />
              <span>PIX</span>
            </div>
            <div className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] font-bold text-zinc-300">
              Mastercard
            </div>
            <div className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] font-bold text-zinc-300">
              Visa
            </div>
            <div className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] font-bold text-zinc-300">
              Elo
            </div>
            <div className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] font-bold text-zinc-300">
              Boleto
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Ambiente Seguro Verificado
            </span>
            <span>·</span>
            <span>Código de Defesa do Consumidor Ativo</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal Notice */}
      <div className="border-t border-zinc-800/80 py-4 px-4 text-center text-[11px] text-zinc-400 bg-[#07080C]">
        <div className="max-w-7xl mx-auto space-y-1">
          <p>
            TStore Comércio Varejista de Eletrônicos Ltda. — CNPJ: 00.000.000/0001-00 (Configurável).
          </p>
          <p>
            Sede: Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100. Todos os direitos reservados. 2026.
          </p>
        </div>
      </div>
    </footer>
  );
};
