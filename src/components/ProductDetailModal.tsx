import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  ShoppingBag, 
  MessageCircle, 
  Check, 
  Sparkles, 
  HelpCircle, 
  Send,
  ExternalLink,
  ChevronRight,
  Info,
  Clock
} from 'lucide-react';
import { Product, ProductVariation } from '../types';
import { ProductImageGallery } from './ProductImageGallery';
import { formatCurrency, simulateShipping, generateWhatsAppLink, calculateReviewStats } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, color?: ProductVariation, size?: ProductVariation, quantity?: number) => void;
  onBuyNow: (product: Product, color?: ProductVariation, size?: ProductVariation, quantity?: number) => void;
  onOpenSellerChat: (product: Product) => void;
  onOpenReviewModal: (product: Product) => void;
  onAddQuestion: (productId: string, questionText: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onOpenSellerChat,
  onOpenReviewModal,
  onAddQuestion,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductVariation | undefined>(
    product.variations.colors?.[0]
  );
  const [selectedSize, setSelectedSize] = useState<ProductVariation | undefined>(
    product.variations.sizes?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'qualities' | 'specs' | 'reviews' | 'questions'>('qualities');

  // Shipping simulation state
  const [cepInput, setCepInput] = useState('');
  const [shippingResults, setShippingResults] = useState<ReturnType<typeof simulateShipping>>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  // Question submission state
  const [newQuestion, setNewQuestion] = useState('');
  const [questionSentMessage, setQuestionSentMessage] = useState(false);

  const reviewStats = calculateReviewStats(product.reviews);

  // Calculate final unit price if variation has extra price
  const extraPrice = (selectedSize?.extraPrice || 0) + (selectedColor?.extraPrice || 0);
  const currentUnitPrice = product.price + extraPrice;
  const pixPrice = currentUnitPrice * 0.95;

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cepInput.replace(/\D/g, '').length < 8) return;
    setIsCalculatingShipping(true);
    setTimeout(() => {
      setShippingResults(simulateShipping(cepInput));
      setIsCalculatingShipping(false);
    }, 400);
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    onAddQuestion(product.id, newQuestion.trim());
    setNewQuestion('');
    setQuestionSentMessage(true);
    setTimeout(() => setQuestionSentMessage(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      {/* Modal Card */}
      <div 
        id={`product-detail-${product.id}`}
        className="relative bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Sticky Modal Top Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-600 truncate">
            <span className="font-semibold text-emerald-800">{product.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate font-medium text-stone-700">{product.title}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
            aria-label="Fechar detalhes"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-10">
          {/* Main Top Section: Gallery + Purchase Configurator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Column 1: Image Gallery with Interactive Zoom (5 cols) */}
            <div className="lg:col-span-6">
              <ProductImageGallery
                images={product.images}
                productTitle={product.title}
                discountPercentage={product.discountPercentage}
                freeShipping={product.freeShipping}
              />

              {/* Guarantees Strip below gallery */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-stone-100 text-stone-600">
                <div className="flex items-center gap-2 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{product.warrantyMonths} meses de garantia</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <RotateCcw className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>7 dias para devolução grátis</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Envio com seguro total</span>
                </div>
              </div>
            </div>

            {/* Column 2: Details & Order System (7 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Condition & Rating Overview */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700">
                    Condição: {product.condition} • Código #{product.id}
                  </span>

                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-emerald-800 transition-colors"
                  >
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <span className="font-bold text-stone-800">{reviewStats.average}</span>
                    <span className="underline decoration-stone-300">({product.reviewsCount} avaliações)</span>
                  </button>
                </div>

                {/* Main Title & Subtitle */}
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight mb-2">
                  {product.title}
                </h1>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  {product.subtitle}
                </p>

                {/* Price Display Box */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 mb-6">
                  <div className="flex items-baseline gap-3 mb-1">
                    {product.originalPrice && (
                      <span className="text-sm text-stone-600 line-through">
                        {formatCurrency(product.originalPrice + extraPrice)}
                      </span>
                    )}
                    <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
                      {formatCurrency(currentUnitPrice)}
                    </span>
                    {product.discountPercentage && (
                      <span className="px-2 py-0.5 text-xs font-bold text-rose-700 bg-rose-100 rounded-md">
                        {product.discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-stone-600 flex items-center gap-1 mb-2">
                    <CreditCard className="w-3.5 h-3.5 text-stone-500" />
                    <span>
                      em até <strong>{product.installments.count}x de {formatCurrency(currentUnitPrice / product.installments.count)}</strong> sem juros no cartão
                    </span>
                  </div>

                  <div className="text-xs text-emerald-800 font-semibold bg-emerald-100/70 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Preço no Pix com 5% de desconto: <strong>{formatCurrency(pixPrice)}</strong></span>
                  </div>
                </div>

                {/* Variations: Colors */}
                {product.variations.colors && product.variations.colors.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2.5">
                      <span>Cor selecionada: <strong className="text-stone-900">{selectedColor?.name || 'Selecione'}</strong></span>
                      <span className="text-stone-600">({product.variations.colors.length} opções disponíveis)</span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {product.variations.colors.map((color) => {
                        const isSelected = selectedColor?.id === color.id;
                        return (
                          <button
                            key={color.id}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all ${
                              isSelected
                                ? 'border-emerald-700 ring-2 ring-emerald-700/20 bg-emerald-50/50 text-stone-900 font-semibold shadow-xs'
                                : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                            }`}
                          >
                            <span 
                              className="w-4 h-4 rounded-full border border-stone-300 shadow-xs flex items-center justify-center shrink-0" 
                              style={{ backgroundColor: color.colorHex || '#ccc' }}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 text-white drop-shadow-xs" />}
                            </span>
                            <span>{color.value}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Variations: Editions / Sizes / Capacities */}
                {product.variations.sizes && product.variations.sizes.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2.5">
                      <span>Versão / Modelo: <strong className="text-stone-900">{selectedSize?.name || 'Selecione'}</strong></span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {product.variations.sizes.map((size) => {
                        const isSelected = selectedSize?.id === size.id;
                        return (
                          <button
                            key={size.id}
                            onClick={() => setSelectedSize(size)}
                            className={`flex-1 p-3 rounded-xl text-left border transition-all ${
                              isSelected
                                ? 'border-emerald-700 ring-2 ring-emerald-700/20 bg-emerald-50/50 text-stone-900 shadow-xs'
                                : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span>{size.name}</span>
                              {size.extraPrice ? (
                                <span className="text-emerald-800 font-bold text-[11px]">
                                  +{formatCurrency(size.extraPrice)}
                                </span>
                              ) : (
                                <span className="text-stone-600 text-[11px]">Incluso</span>
                              )}
                            </div>
                            <span className="text-[11px] text-stone-600 block mt-0.5">{size.value}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity Selector & Stock Indicator */}
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Quantidade
                    </label>
                    <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 transition-colors font-bold"
                        aria-label="Diminuir quantidade"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-sm font-semibold text-stone-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        disabled={quantity >= product.stock}
                        className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 transition-colors font-bold"
                        aria-label="Aumentar quantidade"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 pt-4">
                    <span className="text-xs text-stone-600 block">
                      Disponibilidade imediata:
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
                      {product.stock} unidades disponíveis no centro de distribuição
                    </span>
                  </div>
                </div>

                {/* Shipping Simulation Component */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 mb-6">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 mb-2">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>Calcular frete e prazo de entrega</span>
                  </div>

                  <form onSubmit={handleCalculateShipping} className="flex gap-2">
                    <input
                      type="text"
                      value={cepInput}
                      onChange={(e) => setCepInput(e.target.value)}
                      placeholder="Ex: 01310-100"
                      maxLength={9}
                      className="w-36 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                    <button
                      type="submit"
                      disabled={isCalculatingShipping}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      {isCalculatingShipping ? 'Calculando...' : 'Calcular'}
                    </button>
                  </form>

                  {/* Results of simulated shipping */}
                  {shippingResults && (
                    <div className="mt-3 space-y-1.5 pt-2 border-t border-stone-200 text-xs">
                      {shippingResults.map((ship, idx) => (
                        <div key={idx} className="flex items-center justify-between text-stone-700">
                          <div>
                            <span className="font-semibold">{ship.name}</span>
                            <span className="text-stone-600 block text-[11px]">{ship.days}</span>
                          </div>
                          <span className="font-bold text-emerald-800">
                            {ship.isFree ? 'Grátis' : formatCurrency(ship.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Order Action Buttons: Comprar Agora & Adicionar ao Carrinho */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <button
                    id="btn-buy-now"
                    onClick={() => onBuyNow(product, selectedColor, selectedSize, quantity)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Check className="w-4 h-4" />
                    <span>Comprar Agora</span>
                  </button>

                  <button
                    id="btn-add-to-cart"
                    onClick={() => onAddToCart(product, selectedColor, selectedSize, quantity)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>Adicionar ao Carrinho</span>
                  </button>
                </div>

                {/* Seller Profile & Direct Contact Box */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.seller.avatar}
                        alt={product.seller.name}
                        className="w-11 h-11 rounded-full object-cover border border-stone-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-stone-900 leading-none">
                            {product.seller.name}
                          </h3>
                          {product.seller.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" title="Vendedor Verificado" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-600 mt-1">
                          <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                            ★ {product.seller.rating}
                          </span>
                          <span>•</span>
                          <span>{product.seller.totalSales} vendas</span>
                          <span>•</span>
                          <span>{product.seller.location}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-amber-50 text-amber-800 rounded border border-amber-200">
                      {product.seller.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 px-3 py-1.5 rounded-lg mb-3">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Tempo médio de resposta: <strong className="text-stone-800">{product.seller.responseTime}</strong></span>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenSellerChat(product)}
                      className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Chat com Vendedor</span>
                    </button>

                    <a
                      href={generateWhatsAppLink(product.seller.phoneWhatsapp, product.title, product.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-emerald-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>WhatsApp Direto</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Section Tabs: Qualidades, Ficha Técnica, Perguntas, Avaliações */}
          <div className="pt-6 border-t border-stone-200">
            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-px">
              <button
                onClick={() => setActiveTab('qualities')}
                className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'qualities'
                    ? 'border-emerald-700 text-emerald-900'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Qualidades & Destaques</span>
              </button>

              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'specs'
                    ? 'border-emerald-700 text-emerald-900'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Info className="w-4 h-4 text-stone-400" />
                <span>Ficha Técnica</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'reviews'
                    ? 'border-emerald-700 text-emerald-900'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Star className="w-4 h-4 text-amber-500" />
                <span>Avaliações ({product.reviews.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('questions')}
                className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'questions'
                    ? 'border-emerald-700 text-emerald-900'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-stone-400" />
                <span>Perguntas ao Vendedor ({product.questions.length})</span>
              </button>
            </div>

            {/* Tab 1: Qualidades e Destaques (Visually Rich Cards) */}
            {activeTab === 'qualities' && (
              <div className="pt-6 space-y-6 animate-fadeIn">
                <div className="prose prose-stone max-w-none text-stone-600 text-sm leading-relaxed">
                  <p>{product.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.qualities.map((quality, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-emerald-700/40 transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-stone-200 flex items-center justify-center text-emerald-800 shrink-0">
                          <Sparkles className="w-5 h-5 text-emerald-700" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900 mb-1">
                            {quality.title}
                          </h4>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {quality.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Especificações Técnicas */}
            {activeTab === 'specs' && (
              <div className="pt-6 animate-fadeIn">
                <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white">
                  <table className="w-full text-xs text-left">
                    <tbody>
                      {product.specs.map((spec, idx) => (
                        <tr 
                          key={idx} 
                          className={idx % 2 === 0 ? 'bg-stone-50/70' : 'bg-white'}
                        >
                          <td className="py-3 px-4 font-semibold text-stone-700 w-1/3 border-b border-stone-200/70">
                            {spec.label}
                          </td>
                          <td className="py-3 px-4 text-stone-800 border-b border-stone-200/70">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Sistema de Avaliações */}
            {activeTab === 'reviews' && (
              <div className="pt-6 animate-fadeIn space-y-8">
                {/* Score Summary & Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl bg-stone-50 border border-stone-200">
                  {/* Big Number Average */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-stone-200">
                    <span className="text-5xl font-black text-stone-900 tracking-tight">
                      {reviewStats.average}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 my-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`w-4 h-4 ${
                            s <= Math.round(reviewStats.average) 
                              ? 'fill-amber-400 text-amber-400' 
                              : 'text-stone-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-stone-600">
                      Média baseada em {reviewStats.total} avaliações reais
                    </span>
                    <button
                      onClick={() => onOpenReviewModal(product)}
                      className="mt-4 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-xs"
                    >
                      Avaliar este Produto
                    </button>
                  </div>

                  {/* Distribution Progress Bars */}
                  <div className="md:col-span-8 flex flex-col justify-center space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = reviewStats.distribution[star] || 0;
                      const count = reviewStats.counts[star] || 0;
                      return (
                        <div key={star} className="flex items-center gap-3 text-xs">
                          <span className="w-12 font-medium text-stone-700 flex items-center gap-1">
                            {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </span>
                          <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-14 text-right text-stone-600 text-[11px]">
                            {pct}% ({count})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-stone-900">
                      Depoimentos de Compradores
                    </h4>
                    <span className="text-xs text-stone-600">
                      Mostrando {product.reviews.length} avaliações verificadas
                    </span>
                  </div>

                  {product.reviews.map((rev) => (
                    <div 
                      key={rev.id}
                      className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-700">
                            {rev.author[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-stone-900">{rev.author}</span>
                              {rev.verifiedPurchase && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  <ShieldCheck className="w-3 h-3" /> Compra Verificada
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-600">{rev.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating 
                                  ? 'fill-amber-400 text-amber-400' 
                                  : 'text-stone-200'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>

                      {rev.productVariationUsed && (
                        <span className="inline-block text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                          Opção adquirida: {rev.productVariationUsed}
                        </span>
                      )}

                      <h5 className="text-xs font-bold text-stone-900">{rev.title}</h5>
                      <p className="text-xs text-stone-700 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Perguntas ao Vendedor */}
            {activeTab === 'questions' && (
              <div className="pt-6 animate-fadeIn space-y-6">
                {/* Ask a question form */}
                <form onSubmit={handleSendQuestion} className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <label className="block text-xs font-bold text-stone-900 mb-1.5">
                    Fazer uma pergunta sobre este anúncio
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Tire sua dúvida com o vendedor antes de comprar..."
                      className="flex-1 bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Perguntar</span>
                    </button>
                  </div>
                  {questionSentMessage && (
                    <p className="text-xs text-emerald-800 font-semibold mt-2 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Sua pergunta foi enviada ao vendedor!
                    </p>
                  )}
                </form>

                {/* Questions History */}
                <div className="space-y-4">
                  {product.questions.length === 0 ? (
                    <p className="text-xs text-stone-600 text-center py-6">
                      Ainda não há perguntas registradas neste anúncio. Seja o primeiro a perguntar!
                    </p>
                  ) : (
                    product.questions.map((q) => (
                      <div key={q.id} className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-stone-800">
                            Pergunta de {q.author}
                          </span>
                          <span className="text-stone-600 text-[11px]">{q.date}</span>
                        </div>
                        <p className="text-xs text-stone-700 font-medium">
                          {q.question}
                        </p>

                        {q.answer ? (
                          <div className="mt-2 pl-3 border-l-2 border-emerald-700 bg-emerald-50/40 p-2.5 rounded-r-lg">
                            <span className="text-[11px] font-bold text-emerald-900 block mb-0.5">
                              Resposta do vendedor:
                            </span>
                            <p className="text-xs text-stone-700">{q.answer}</p>
                            {q.answeredAt && (
                              <span className="text-[10px] text-stone-600 block mt-1">
                                {q.answeredAt}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-amber-700 italic">
                            Aguardando resposta do vendedor...
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
