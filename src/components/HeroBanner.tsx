import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Zap, CreditCard } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { heroImg } from '../data/products';

export const HeroBanner: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <section className="relative w-full overflow-hidden bg-zinc-950 border-b border-zinc-800">
      {/* Background Graphic & Studio Image */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Editorial Copy */}
        <div className="lg:col-span-7 z-10 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#00F0FF] uppercase">
            <span>Tecnologia de Nova Geração</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>Edição 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-sans [text-wrap:balance]">
            O ápice da tecnologia <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#00F0FF]">
              ao seu alcance.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-xl font-normal leading-relaxed">
            Smartphones em titânio aeroespacial, notebooks de alta potência e sistemas de som Hi-Res. Produtos homologados com garantia nacional e entrega rápida e segura em todo o Brasil.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => navigateTo('catalog')}
              className="px-6 py-3.5 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2.5 cursor-pointer group"
            >
              <span>Explorar Produtos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigateTo('catalog', undefined, 'smartphones')}
              className="px-5 py-3.5 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Ver Linha Pro Titanium
            </button>
          </div>

          {/* Value Propositions Strip */}
          <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <span>10% OFF no Pix</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <span>Até 12x Sem Juros</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <span>Garantia 12 Meses</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <span>Envio Segurado</span>
            </div>
          </div>
        </div>

        {/* Right Product Composition Image */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 aspect-[4/3] lg:aspect-auto lg:h-[460px]">
            <img
              src={heroImg}
              alt="Flagship Electronics Showcase TStore"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle Gradient Scrim at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent pointer-events-none" />

            {/* Floating Editorial Showcase Tag */}
            <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#00F0FF] uppercase tracking-wider font-semibold">
                  Destaque da Coleção
                </p>
                <p className="text-xs sm:text-sm font-semibold text-white">
                  Linha Aurora & NovaTech 2026
                </p>
              </div>
              <button
                onClick={() => navigateTo('product-detail', 'tst-phone-titanium-15')}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-100 rounded-lg transition-colors cursor-pointer"
              >
                Conferir
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
