import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  MessageCircle, 
  Eye, 
  ShoppingBag, 
  Heart, 
  Truck, 
  Layers, 
  Ruler, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { Product, ProductVariation } from '../types';
import { formatCurrency, generateWhatsAppLink } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor?: ProductVariation, selectedSize?: ProductVariation) => void;
  onOpenSellerChat: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  onOpenSizeGuide?: () => void;
  layout?: 'horizontal' | 'grid';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewProduct,
  onAddToCart,
  onOpenSellerChat,
  isFavorite = false,
  onToggleFavorite,
  onOpenSizeGuide,
  layout = 'horizontal',
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  
  // Local state for instant selection in horizontal row
  const [selectedSize, setSelectedSize] = useState<ProductVariation | undefined>(
    product.variations.sizes?.[1] || product.variations.sizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<ProductVariation | undefined>(
    product.variations.colors?.[0]
  );

  const currentImage = product.images[activeImageIndex] || product.images[0];
  const pixPrice = product.price * 0.95;

  // ----------------------------------------------------
  // GRID CARD LAYOUT (Compact multi-column alternative)
  // ----------------------------------------------------
  if (layout === 'grid') {
    return (
      <div 
        id={`product-card-${product.id}`}
        className="group bg-white rounded-3xl border border-stone-200/90 hover:border-stone-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
      >
        {/* Product Image Stage */}
        <div 
          onClick={() => onViewProduct(product)}
          className="relative aspect-square bg-stone-100 cursor-pointer overflow-hidden"
        >
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.discountPercentage && (
              <span className="bg-rose-700 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                -{product.discountPercentage}% OFF
              </span>
            )}
            {product.freeShipping && (
              <span className="bg-emerald-700 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <Truck className="w-2.5 h-2.5" />
                Frete Grátis
              </span>
            )}
          </div>

          {/* Favorite Button */}
          {onToggleFavorite && (
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(product.id);
                }}
                className={`p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
                  isFavorite 
                    ? 'bg-rose-50 text-rose-600' 
                    : 'bg-white/90 hover:bg-white text-stone-600 hover:text-rose-600'
                }`}
                title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 text-stone-900 text-xs font-semibold px-4 py-2 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Eye className="w-3.5 h-3.5 text-stone-700" />
              Ver Anúncio e Fotos
            </span>
          </div>
        </div>

        {/* Content & Details */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span className="uppercase tracking-wider font-bold text-[10px] text-rose-800">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-[11px]">
                <span className="truncate max-w-[120px]">{product.seller.name}</span>
                {product.seller.verified && (
                  <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0" />
                )}
              </div>
            </div>

            <h3 
              onClick={() => onViewProduct(product)}
              className="text-sm font-bold text-stone-900 hover:text-rose-700 transition-colors line-clamp-2 cursor-pointer leading-snug mb-2"
            >
              {product.title}
            </h3>

            {/* Fabric Highlight Badge */}
            <div className="mb-2 p-2 rounded-lg bg-stone-50 border border-stone-200/80 text-[11px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-rose-700 shrink-0" />
              <span className="font-bold text-stone-800">Tecido: {product.fabric}</span>
              <span className="text-stone-500 font-normal truncate">• Forro 100% Algodão</span>
            </div>

            {/* Description Excerpt */}
            <p className="text-xs text-stone-600 line-clamp-2 mb-2 leading-relaxed">
              {product.description || product.subtitle}
            </p>

            {/* Sizes Available Indicator */}
            <div className="flex items-center gap-1 mb-3">
              <span className="text-[10px] font-bold text-stone-500 uppercase">Tamanhos:</span>
              <div className="flex items-center gap-1">
                {['P', 'M', 'G', 'GG'].map((s) => (
                  <span key={s} className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-bold border border-stone-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100">
            <div className="mb-3">
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through mr-2">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              <div className="text-xl font-black text-stone-900 tracking-tight">
                {formatCurrency(product.price)}
              </div>
              <div className="text-xs text-stone-600">
                em até <strong>{product.installments.count}x de {formatCurrency(product.installments.value)}</strong> sem juros
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onViewProduct(product)}
                className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver Fotos</span>
              </button>

              <button
                onClick={() => onAddToCart(product, selectedColor, selectedSize)}
                className="py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-xs hover:shadow"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Comprar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // HORIZONTAL ROW CARD LAYOUT (Requested primary view:
  // "ordem horizontal um abaixo de outro com descrição,
  // valores, nome do tecido e tamanhos disponíveis")
  // ----------------------------------------------------
  return (
    <div
      id={`product-card-horizontal-${product.id}`}
      className="group bg-white rounded-3xl border border-stone-200/90 hover:border-stone-400 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row items-stretch"
    >
      {/* 1. Left Section: Product Image & Interactive Thumbnails Strip */}
      <div className="w-full md:w-72 lg:w-80 shrink-0 bg-stone-100 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-stone-200/80">
        <div 
          onClick={() => onViewProduct(product)}
          className="relative aspect-4/3 md:aspect-square w-full cursor-pointer overflow-hidden bg-stone-200"
        >
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.discountPercentage && (
              <span className="bg-rose-700 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                -{product.discountPercentage}% OFF
              </span>
            )}
            {product.freeShipping && (
              <span className="bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <Truck className="w-3 h-3" />
                Frete Grátis
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          {onToggleFavorite && (
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(product.id);
                }}
                className={`p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
                  isFavorite 
                    ? 'bg-rose-50 text-rose-600' 
                    : 'bg-white/90 hover:bg-white text-stone-600 hover:text-rose-600'
                }`}
                title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          )}

          {/* Quick Click Hint Overlay */}
          <div className="absolute inset-0 bg-stone-900/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 text-stone-900 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <Eye className="w-3.5 h-3.5 text-stone-700" />
              Ampliar Fotos
            </span>
          </div>
        </div>

        {/* Thumbnail Preview Selector (allows exploring all piece angles directly) */}
        {product.images.length > 1 && (
          <div className="p-2.5 bg-stone-50/90 border-t border-stone-200/80 flex items-center gap-2 overflow-x-auto">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                className={`relative w-11 h-11 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  activeImageIndex === idx 
                    ? 'border-rose-700 ring-2 ring-rose-200 scale-105' 
                    : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
                }`}
                title={img.caption || `Foto ${idx + 1}`}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            <span className="text-[10px] text-stone-500 font-semibold pl-1 shrink-0">
              {product.images.length} fotos reais
            </span>
          </div>
        )}
      </div>

      {/* 2. Middle Section: Piece Description, Fabric Name, Sizes, Reviews */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-black uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-stone-600 font-medium">
                <span>Ateliê: <strong>{product.seller.name}</strong></span>
                {product.seller.verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" title="Ateliê Verificado" />
                )}
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="text-xs font-extrabold text-stone-900">{product.rating}</span>
              <span className="text-[11px] text-stone-600 font-medium">
                ({product.reviewsCount} opiniões)
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onViewProduct(product)}
            className="text-base sm:text-lg lg:text-xl font-bold text-stone-900 hover:text-rose-800 transition-colors cursor-pointer leading-tight mb-3"
          >
            {product.title}
          </h3>

          {/* NOME DO TECIDO (Prominently Highlighted) */}
          <div className="mb-3 p-3 rounded-2xl bg-amber-50/50 border border-amber-200/80">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="flex items-center gap-1 text-xs font-bold text-amber-950 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-rose-700" />
                Nome do Tecido:
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-rose-900 text-white text-xs font-black shadow-2xs">
                {product.fabric}
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-700" />
                Forro Íntimo 100% Algodão Puro
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              {product.fabricDescription || `Confeccionado em ${product.fabric} nobre com toque macio, alta elasticidade, forro 100% algodão hipoalergênico e costuras planas que não marcam sob a roupa.`}
            </p>
          </div>

          {/* DESCRIÇÃO DAS PEÇAS (Detailed Description Section) */}
          <div className="mb-3.5">
            <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider block mb-1">
              Descrição Detalhada da Peça:
            </span>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {product.description}
            </p>
            {product.subtitle && product.subtitle !== product.description && (
              <p className="text-xs text-stone-500 mt-1 italic">
                {product.subtitle}
              </p>
            )}
          </div>

          {/* TAMANHOS DISPONÍVEIS (Available Sizes) */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-rose-700" />
                Tamanhos Disponíveis na Grade:
              </span>
              {onOpenSizeGuide && (
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="text-xs text-rose-700 hover:text-rose-900 font-bold underline cursor-pointer"
                >
                  Guia de Medidas (Busto / Quadril)
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {['P', 'M', 'G', 'GG'].map((sizeCode) => {
                const sizeObj = product.variations.sizes?.find((s) => s.value === sizeCode);
                const isSelected = selectedSize?.value === sizeCode;
                const numGuide =
                  sizeCode === 'P'
                    ? 'Veste 36'
                    : sizeCode === 'M'
                    ? 'Veste 42'
                    : sizeCode === 'G'
                    ? 'Veste 44'
                    : 'Veste 46/48';

                return (
                  <button
                    key={sizeCode}
                    type="button"
                    onClick={() =>
                      setSelectedSize(
                        sizeObj || {
                          id: sizeCode,
                          name: `${sizeCode} (${numGuide})`,
                          type: 'size',
                          value: sizeCode,
                          inStock: true,
                        }
                      )
                    }
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs ring-2 ring-stone-900/20'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300'
                    }`}
                    title={`Selecionar tamanho ${sizeCode}`}
                  >
                    <span>{sizeCode}</span>
                    <span className={`text-[10px] font-normal ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                      • {numGuide}
                    </span>
                    {isSelected && <Check className="w-3 h-3 text-rose-300 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cores Disponíveis */}
          {product.variations.colors && product.variations.colors.length > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-600 uppercase">Cores:</span>
              <div className="flex items-center gap-1.5">
                {product.variations.colors.map((c) => {
                  const isColorSelected = selectedColor?.value === c.value;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs transition-all cursor-pointer ${
                        isColorSelected
                          ? 'border-stone-900 bg-stone-900 text-white font-bold'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-stone-300 shrink-0"
                        style={{ backgroundColor: c.colorHex || '#ddd' }}
                      />
                      <span className="text-[11px]">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Differential Quality Badge */}
        {product.qualities[0] && (
          <div className="mt-4 pt-2.5 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Diferencial: <strong>{product.qualities[0].title}</strong> — {product.qualities[0].description}</span>
          </div>
        )}
      </div>

      {/* 3. Right Section: Values (Pricing), Installments, Pix & Direct CTAs */}
      <div className="w-full md:w-64 lg:w-72 shrink-0 p-5 sm:p-6 bg-stone-50/80 border-t md:border-t-0 md:border-l border-stone-200/90 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
            Valores & Condições:
          </span>

          {/* Original Price Riscado */}
          {product.originalPrice && (
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span>De:</span>
              <span className="line-through">{formatCurrency(product.originalPrice)}</span>
              {product.discountPercentage && (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded">
                  Economize {product.discountPercentage}%
                </span>
              )}
            </div>
          )}

          {/* Main Price */}
          <div className="mt-0.5">
            <span className="text-xs font-bold text-stone-700">Por apenas:</span>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight">
              {formatCurrency(product.price)}
            </div>
          </div>

          {/* Pix Promo */}
          <div className="mt-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center justify-between">
            <span>À vista no Pix:</span>
            <span className="text-emerald-800 text-sm font-black">
              {formatCurrency(pixPrice)}
            </span>
          </div>

          {/* Installments in Cartão */}
          <div className="text-xs text-stone-600 mt-2 leading-relaxed">
            ou em até <strong className="text-stone-900 font-bold">{product.installments.count}x de {formatCurrency(product.installments.value)}</strong> sem juros no cartão
          </div>

          {/* Shipping Guarantee info */}
          <div className="mt-3 pt-3 border-t border-stone-200/70 space-y-1.5 text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Envio em 24h • Embalagem discreta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-stone-700 shrink-0" />
              <span>Troca grátis em 7 dias após o recebimento</span>
            </div>
          </div>
        </div>

        {/* Actions Buttons */}
        <div className="mt-5 space-y-2">
          {/* Main CTA: Add to Cart with selected size */}
          <button
            type="button"
            onClick={() => onAddToCart(product, selectedColor, selectedSize)}
            className="w-full py-3 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer hover:scale-[1.01]"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span>Comprar Agora {selectedSize ? `(Tam ${selectedSize.value})` : ''}</span>
          </button>

          {/* View Details / Photos Modal */}
          <button
            type="button"
            onClick={() => onViewProduct(product)}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-stone-600" />
            <span>Ver Todas as Fotos & Detalhes</span>
          </button>

          {/* Fast Contact with Seller */}
          <div className="pt-2 flex items-center justify-between text-[11px]">
            <a
              href={generateWhatsAppLink(product.seller.phoneWhatsapp, product.title, product.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 transition-colors"
              title="Tirar dúvidas sobre a peça no WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Dúvidas no WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => onOpenSellerChat(product)}
              className="text-stone-600 hover:text-stone-900 font-semibold underline cursor-pointer"
            >
              Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
