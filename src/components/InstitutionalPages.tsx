import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  Zap,
  Mail,
  Phone,
  MessageSquare,
  HelpCircle,
  FileText,
  Lock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Send,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

// SOBRE A TSTORE
export const AboutPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="min-h-screen bg-[#090A0F] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="space-y-4 text-center">
          <span className="text-xs font-semibold text-[#00F0FF] uppercase tracking-wider">
            Institucional · TStore Brasil
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Excelência e Inovação em Eletrônicos
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Nascemos para conectar o consumidor brasileiro aos dispositivos mais avançados do mundo, com transparência absoluta, garantia nacional e atendimento de especialista.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-[#12141E] border border-zinc-800 rounded-2xl space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#00F0FF]" />
            <h3 className="text-base font-bold text-white">100% Homologados</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dispositivos originais lacrados de fábrica com certificação e número de série auditado para garantia no Brasil.
            </p>
          </div>

          <div className="p-6 bg-[#12141E] border border-zinc-800 rounded-2xl space-y-3">
            <Truck className="w-8 h-8 text-[#00F0FF]" />
            <h3 className="text-base font-bold text-white">Logística Segurada</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Centros de distribuição estratégicos com envio expresso via Sedex e transportadoras homologadas com seguro total contra extravio.
            </p>
          </div>

          <div className="p-6 bg-[#12141E] border border-zinc-800 rounded-2xl space-y-3">
            <Zap className="w-8 h-8 text-[#00F0FF]" />
            <h3 className="text-base font-bold text-white">Transparência Comercial</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Preços justos, descontos reais de 10% no Pix e parcelamento sem juros em até 12x no cartão de crédito.
            </p>
          </div>
        </div>

        {/* Narrative */}
        <div className="p-8 bg-[#10121A] border border-zinc-800 rounded-3xl space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <h2 className="text-lg font-bold text-white">Nosso Compromisso com a Qualidade</h2>
          <p>
            Na TStore, acreditamos que a escolha de um novo smartphone, notebook de alto desempenho ou fone com cancelamento de ruído é uma decisão importante para a sua produtividade e lazer. Por isso, não trabalhamos com produtos de procedência duvidosa ou recondicionados sem aviso.
          </p>
          <p>
            Nossa equipe técnica testa rigorosamente cada lote e garante suporte humano ágil antes, durante e após a compra.
          </p>
          <div className="pt-4 flex justify-start">
            <button
              onClick={() => navigateTo('catalog')}
              className="px-5 py-3 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <span>Conhecer Nossos Produtos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// CONTATO & SUPORTE
export const ContactPage: React.FC = () => {
  const { showNotification } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showNotification('Mensagem enviada com sucesso! Responderemos em até 24h úteis.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#090A0F] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-[#00F0FF] uppercase tracking-wider">
            Canais de Atendimento
          </span>
          <h1 className="text-3xl font-extrabold text-white">Fale com a Equipe TStore</h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Dúvidas sobre produtos, pedidos, faturamento ou pós-venda? Estamos prontos para ajudar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Quick Channels */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-5 bg-[#12141E] border border-zinc-800 rounded-2xl space-y-2">
              <div className="flex items-center gap-2.5 text-[#00F0FF]">
                <MessageSquare className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">WhatsApp de Vendas</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Atendimento direto com consultor técnico para tirar dúvidas sobre compatibilidade e especificações.
              </p>
              <p className="text-xs font-mono font-semibold text-emerald-400 pt-1">
                (11) 98765-4321
              </p>
              <span className="text-[11px] text-zinc-500 block">Segunda a Sexta, das 09h às 18h</span>
            </div>

            <div className="p-5 bg-[#12141E] border border-zinc-800 rounded-2xl space-y-2">
              <div className="flex items-center gap-2.5 text-[#00F0FF]">
                <Mail className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">E-mail de Suporte</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Para assuntos sobre pedidos, nota fiscal eletrônica e pós-venda.
              </p>
              <p className="text-xs font-mono text-zinc-200 pt-1">
                atendimento@tstore.com.br
              </p>
              <span className="text-[11px] text-zinc-500 block">Tempo médio de resposta: &le; 4 horas</span>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-[#12141E] border border-zinc-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base font-bold text-white mb-4">Envie uma Mensagem</h2>
            {sent ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-center space-y-2">
                <p className="text-sm font-bold text-emerald-400">Mensagem Registrada com Sucesso!</p>
                <p className="text-xs text-zinc-300">
                  Nosso time entrará em contato pelo e-mail <strong>{email}</strong> em breve.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-3 text-xs text-[#00F0FF] underline cursor-pointer"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Seu Nome *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-white outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Seu E-mail *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com.br"
                    className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-white outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Assunto</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Dúvida sobre produto ou pedido"
                    className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-white outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Mensagem *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Descreva detalhadamente sua dúvida ou solicitação..."
                    className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-white outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#00F0FF] hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Mensagem</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// PERGUNTAS FREQUENTES (FAQ)
export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Os produtos possuem garantia oficial no Brasil?',
      a: 'Sim. Todos os produtos vendidos na TStore acompanham 12 meses de garantia legal e contratual do fabricante contra defeitos de fabricação, com suporte em rede credenciada e assistência técnica nacional.',
    },
    {
      q: 'Como funciona o desconto de 10% no Pix?',
      a: 'O desconto de 10% é aplicado automaticamente sobre o valor dos produtos na finalização da compra ao selecionar Pix como forma de pagamento. A confirmação é instantânea pelo Banco Central.',
    },
    {
      q: 'Qual é o prazo de entrega e como rastreio meu pedido?',
      a: 'O prazo varia conforme o CEP e a modalidade escolhida (Sedex: 1 a 3 dias úteis; Transportadora: 2 a 5 dias úteis). Assim que o pedido é despachado, você recebe o código de rastreamento no e-mail e na área "Meus Pedidos" da sua conta.',
    },
    {
      q: 'Posso parcelar no cartão de crédito em quantas vezes?',
      a: 'Aceitamos as principais bandeiras (Visa, Mastercard, Elo, Hipercard, American Express) com parcelamento em até 12 vezes sem juros para a maioria dos eletrônicos.',
    },
    {
      q: 'Como funciona a política de trocas e arrependimento (Art. 49 CDC)?',
      a: 'Conforme o Código de Defesa do Consumidor brasileiro, você tem até 7 (sete) dias corridos a partir da data de recebimento para solicitar a devolução ou troca sem custo algum, desde que o produto esteja na embalagem original com todos os acessórios.',
    },
    {
      q: 'Vocês emitem Nota Fiscal Eletrônica (NF-e)?',
      a: 'Sim, 100% das nossas vendas acompanham Nota Fiscal Eletrônica emitida em nome do comprador (CPF ou CNPJ informado no checkout), enviada digitalmente e anexa ao pacote de entrega.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-[#00F0FF] uppercase tracking-wider">
            Tire Suas Dúvidas
          </span>
          <h1 className="text-3xl font-extrabold text-white">Perguntas Frequentes</h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Respostas claras sobre compras, fretes, garantias e pagamentos na TStore.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#12141E] border border-zinc-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-800/40 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4.5 pb-4.5 pt-1 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// POLÍTICAS, LGPD & TERMOS
export const PoliciesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090A0F] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-[#00F0FF] uppercase tracking-wider">
            Informações Legais & Segurança
          </span>
          <h1 className="text-3xl font-extrabold text-white">Termos, Trocas & Privacidade</h1>
          <p className="text-xs text-zinc-400">
            Em conformidade com o Código de Defesa do Consumidor (Lei 8.078/90) e LGPD (Lei 13.709/18).
          </p>
        </div>

        <div className="p-8 bg-[#12141E] border border-zinc-800 rounded-3xl space-y-6">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00F0FF]" />
              1. Política de Trocas e Devoluções (Direito de Arrependimento)
            </h2>
            <p>
              Em respeito ao <strong>Artigo 49 do Código de Defesa do Consumidor</strong>, o cliente da TStore tem até 7 (sete) dias corridos após o recebimento do produto para solicitar a devolução sem qualquer ônus, recebendo o estorno integral do valor pago.
            </p>
            <p>
              O produto deve ser devolvido na embalagem original, acompanhado de todos os manuais, cabos e nota fiscal.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-zinc-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
              2. Garantia Legal e do Fabricante
            </h2>
            <p>
              Todos os produtos comercializados possuem garantia mínima legal de 90 dias acrescida da garantia contratual do fabricante de 9 meses, totalizando 12 meses de cobertura contra defeitos de fabricação em todo o território brasileiro.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-zinc-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#00F0FF]" />
              3. Proteção de Dados Pessoais (LGPD)
            </h2>
            <p>
              A TStore trata seus dados cadastrais (nome, CPF, endereço e e-mail) estritamente para o processamento de pedidos, entrega e emissão de notas fiscais. Não comercializamos nem compartilhamos seus dados com terceiros sem consentimento.
            </p>
            <p>
              Dados sensíveis de cartão de crédito são processados diretamente por gateways com certificação PCI-DSS e nunca são salvos de forma legível em nossos servidores.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
