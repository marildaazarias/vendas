import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Image, 
  ShoppingBag, 
  MessageCircle, 
  Star, 
  Palette, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  MousePointer
} from 'lucide-react';

interface UxArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UxArchitectureModal: React.FC<UxArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'orders' | 'contact' | 'reviews' | 'colors'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        id="ux-architecture-modal"
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Guia de Design & Experiência do Usuário (UX/UI)
              </span>
              <h2 className="text-lg font-bold leading-tight">
                Arquitetura de Informação & Decisões de Conversão
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 overflow-x-auto flex items-center gap-2 pt-2">
          {[
            { id: 'overview', label: '1. Estrutura Completa', icon: Layers },
            { id: 'gallery', label: '2. Galeria & Imagens', icon: Image },
            { id: 'orders', label: '3. Sistema de Pedidos', icon: ShoppingBag },
            { id: 'contact', label: '4. Contato com Vendedor', icon: MessageCircle },
            { id: 'reviews', label: '5. Sistema de Avaliações', icon: Star },
            { id: 'colors', label: '6. Paleta & Design System', icon: Palette },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
                  isActive
                    ? 'border-emerald-700 text-emerald-950'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
          {/* TAB 1: Estrutura Completa */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-2">
                  Visão Geral da Arquitetura do Site de Anúncios
                </h3>
                <p className="text-stone-600">
                  O site foi estruturado segundo o modelo cognitivo de decisão de compra em e-commerce (AIDA: Atenção, Interesse, Desejo e Ação), eliminando fricções e destacando a qualidade dos produtos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-stone-900">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">1</span>
                    <span>Página Inicial (Vitrine de Anúncios)</span>
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    Banner de segurança e garantias, barra de busca inteligente, filtros rápidos por categorias de produtos e cards visuais focados em imagens grandes com selos de desconto e frete.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-stone-900">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">2</span>
                    <span>Página de Detalhes do Produto</span>
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    Layout de 2 colunas: à esquerda a galeria interativa com zoom e lightbox; à direita os atributos de compra (preço, parcelamento, amostras de variações, estoque real e simulador de frete).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-stone-900">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">3</span>
                    <span>Carrinho de Compras (Gaveta Deslizante)</span>
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    Acesso imediato sem recarregar a página. Permite alterar quantidades, remover itens, aplicar cupons de desconto e visualizar cálculo de frete com total transparente.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-stone-900">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">4</span>
                    <span>Checkout em 3 Passos & Pagamento</span>
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    Formulário sem atrito de endereço com CEP, seleção de pagamento (Pix instantâneo com desconto de 5%, Cartão de Crédito ou Boleto) e confirmação com confete e código de rastreio.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Galeria & Imagens */}
          {activeTab === 'gallery' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-stone-900">
                Galeria de Produtos com Foco em Qualidade Visual
              </h3>
              <p className="text-stone-600">
                A fotografia é o fator número 1 de conversão em e-commerce. Para transmitir a máxima confiança, a galeria inclui:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-stone-200 flex items-start gap-3 bg-stone-50">
                  <MousePointer className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block font-semibold text-xs">Zoom Óptico ao Passar o Mouse:</strong>
                    <span className="text-xs text-stone-600">Permite inspecionar texturas, costuras, materiais nobres e acabamentos mecânicos sem precisar clicar.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 flex items-start gap-3 bg-stone-50">
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block font-semibold text-xs">Legendas Descritivas por Imagem:</strong>
                    <span className="text-xs text-stone-600">Cada foto possui uma legenda contextual que explica a qualidade destacada naquele ângulo específico.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 flex items-start gap-3 bg-stone-50">
                  <Image className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block font-semibold text-xs">Modal Lightbox em Tela Cheia:</strong>
                    <span className="text-xs text-stone-600">Para usuários que querem imersão completa em monitores grandes ou dispositivos touch.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Pedidos */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-stone-900">
                Sistema de Pedidos e Seleção de Variações
              </h3>
              <p className="text-stone-600">
                Garante que o comprador escolha exatamente o produto desejado sem dúvidas ou ambiguidades:
              </p>

              <ul className="space-y-2.5 text-xs">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Amostras Visuais de Cores:</strong> Círculos com as cores hexadecimais reais e checkmark indicador de seleção.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Variações de Versão/Tamanho:</strong> Exibição transparente de adicionais de valor e itens inclusos em cada versão.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Simulador de Frete Imediato:</strong> O comprador digita o CEP e já recebe os prazos e transportadoras antes de fechar o pedido.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Controle de Estoque em Tempo Real:</strong> Alertas sutis de unidades restantes estimulam urgência ética e confiança.</span>
                </li>
              </ul>
            </div>
          )}

          {/* TAB 4: Contato */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-stone-900">
                Canais Diretos de Comunicação com o Vendedor
              </h3>
              <p className="text-stone-600">
                Dúvidas não resolvidas geram desistência. Disponibilizamos 3 canais complementares:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <strong className="text-stone-900 block font-bold mb-1">1. Chat em Tempo Real</strong>
                  <p className="text-stone-600">Modal de conversa instantânea dentro do próprio site com respostas inteligentes simuladas e botões de perguntas rápidas.</p>
                </div>
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <strong className="text-stone-900 block font-bold mb-1">2. WhatsApp Direto</strong>
                  <p className="text-stone-600">Link pré-preenchido com o nome do produto e código do anúncio pronto para envio direto no aplicativo de mensagens.</p>
                </div>
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <strong className="text-stone-900 block font-bold mb-1">3. Seção Pública de Perguntas</strong>
                  <p className="text-stone-600">Perguntas registradas no anúncio que enriquecem as informações e tiram dúvidas de outros compradores.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Avaliações */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-stone-900">
                Prova Social & Sistema de Avaliações
              </h3>
              <p className="text-stone-600">
                A opinião de outros compradores valida a qualidade do produto anunciado:
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">Média Ponderada e Gráfico de Distribuição:</strong>
                  <span className="text-stone-600">Barras visuais de 5 a 1 estrela que mostram a consistência da satisfação dos compradores.</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">Selo de Compra Verificada:</strong>
                  <span className="text-stone-600">Indica que o autor realmente adquiriu e recebeu o produto na plataforma.</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">Formulário Interativo de Avaliação:</strong>
                  <span className="text-stone-600">Qualquer cliente pode enviar seu depoimento em estrelas, título, comentário e indicação.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Paleta & Design System */}
          {activeTab === 'colors' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-stone-900">
                Paleta de Cores Suave & Elegante
              </h3>
              <p className="text-stone-600">
                Cores selecionadas para transmitir credibilidade comercial, sofisticação e conforto de leitura:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
                  <div className="w-full h-10 rounded-lg bg-stone-900 mb-2" />
                  <strong className="text-stone-900 block">Stone 900</strong>
                  <span className="text-stone-500">Tipografia nobre e botões principais de ação</span>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
                  <div className="w-full h-10 rounded-lg bg-emerald-700 mb-2" />
                  <strong className="text-stone-900 block">Emerald 700</strong>
                  <span className="text-stone-500">Conversão de compra, frete grátis e confiança</span>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
                  <div className="w-full h-10 rounded-lg bg-amber-400 mb-2" />
                  <strong className="text-stone-900 block">Amber 400</strong>
                  <span className="text-stone-500">Estrelas de avaliação e destaques de qualidade</span>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
                  <div className="w-full h-10 rounded-lg bg-stone-100 border border-stone-200 mb-2" />
                  <strong className="text-stone-900 block">Stone 50/100</strong>
                  <span className="text-stone-500">Fundos suaves e arejados que não cansam a vista</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">
            Projetado sob rigorosas práticas de Usabilidade e Acessibilidade (WCAG AA).
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all"
          >
            Entendido, Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};
