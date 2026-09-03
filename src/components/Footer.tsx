import React from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  Sparkles,
  Heart
} from 'lucide-react';

interface FooterProps {
  onOpenUxGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenUxGuide }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      {/* Trust & Guarantees Highlights Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-stone-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Envio Rápido & Seguro</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Produtos despachados com seguro total e código de rastreamento em tempo real.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Compra 100% Protegida</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Seu dinheiro protegido até você receber o produto exatamente como no anúncio.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-emerald-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Devolução Facilitada</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                7 dias corridos para experimentar o produto e devolver sem custos caso não goste.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-emerald-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Suporte Direto</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Comunique-se diretamente com o vendedor verificado pelo chat ou WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Architecture Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Vitrine<span className="text-emerald-400">.</span>
            </span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
            Plataforma especializada em anúncios qualificados de produtos com fotografias de alta resolução, avaliações verificadas e contato direto com vendedores de confiança.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenUxGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors border border-stone-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver Conceito e Arquitetura UX</span>
            </button>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="md:col-span-3 text-xs space-y-2">
          <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
            Para Compradores
          </h5>
          <ul className="space-y-2 text-stone-400">
            <li><span className="hover:text-white transition-colors cursor-pointer">Como comprar com segurança</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Garantias e Política de Devolução</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Rastreamento de Pedidos</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Avaliações e Critérios de Qualidade</span></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="md:col-span-2 text-xs space-y-2">
          <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
            Vendedores
          </h5>
          <ul className="space-y-2 text-stone-400">
            <li><span className="hover:text-white transition-colors cursor-pointer">Como anunciar produtos</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Critérios para Selo Platinum</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Padrão de Fotos e Qualidade</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Central do Vendedor</span></li>
          </ul>
        </div>

        {/* Security & Payment Badges */}
        <div className="md:col-span-3 text-xs space-y-3">
          <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
            Pagamento Seguro
          </h5>
          <div className="flex flex-wrap gap-2 text-[11px] text-stone-400">
            <span className="px-2.5 py-1 rounded bg-stone-800 border border-stone-700 font-semibold text-emerald-400">Pix Instantâneo (-5%)</span>
            <span className="px-2.5 py-1 rounded bg-stone-800 border border-stone-700">Cartão até 12x</span>
            <span className="px-2.5 py-1 rounded bg-stone-800 border border-stone-700">Boleto Bancário</span>
          </div>
          <div className="pt-2 text-[11px] text-stone-500">
            Criptografia SSL de 256 bits com certificação de segurança ativa.
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
        <p>© 2026 Vitrine & Vendas. Todos os direitos reservados.</p>
        <p className="flex items-center gap-1">
          Criado com foco em usabilidade, confiança e transparência.
        </p>
      </div>
    </footer>
  );
};
