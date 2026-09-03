import React from 'react';
import { 
  Star, 
  ShieldCheck, 
  MessageCircle, 
  Eye, 
  ShoppingBag,
  Heart,
  Truck
} from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, generateWhatsAppLink } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenSellerChat: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewProduct,
  onAddToCart,
  onOpenSellerChat,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const mainImage = product.images[0];
  const secondImage = product.images[1] || mainImage;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-stone-200/90 hover:border-stone-300 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Product Image Stage */}
      <div 
        onClick={() => onViewProduct(product)}
        className="relative aspect-square bg-stone-100 cursor-pointer overflow-hidden"
      >
        {/* Base Image */}
        <img
          src={mainImage.url}
          alt={mainImage.alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountPercentage && (
            <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
              -{product.discountPercentage}%
            </span>
          )}
          {product.freeShipping && (
            <span className="bg-emerald-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
              <Truck className="w-2.5 h-2.5" />
              Frete Grátis
            </span>
          )}
        </div>

        {/* Favorite Button & Photo Count */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <span className="bg-stone-900/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            {product.images.length} fotos
          </span>
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(product.id);
              }}
              className={`p-1.5 rounded-full backdrop-blur-xs transition-colors ${
                isFavorite 
                  ? 'bg-rose-50 text-rose-600' 
                  : 'bg-white/80 hover:bg-white text-stone-600 hover:text-rose-600'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          )}
        </div>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-stone-900 text-xs font-semibold px-4 py-2 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-stone-700" />
            Ver Anúncio e Fotos
          </span>
        </div>
      </div>

      {/* Product Content & Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Seller Identity */}
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[10px] text-emerald-800">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[11px]">
              <span className="truncate max-w-[120px]">{product.seller.name}</span>
              {product.seller.verified && (
                <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0" title="Vendedor Verificado" />
              )}
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onViewProduct(product)}
            className="text-sm font-semibold text-stone-900 hover:text-emerald-800 transition-colors line-clamp-2 cursor-pointer leading-snug mb-2"
          >
            {product.title}
          </h3>

          {/* Rating & Social Proof */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-stone-800">{product.rating}</span>
            <span className="text-xs text-stone-600">({product.reviewsCount} avaliações)</span>
          </div>

          {/* Key Quality Feature Badge */}
          {product.qualities[0] && (
            <div className="mb-3 px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200/80 text-[11px] text-stone-700 flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0" />
              <span className="truncate font-medium">{product.qualities[0].title}</span>
            </div>
          )}
        </div>

        {/* Pricing & CTA Actions */}
        <div className="pt-3 border-t border-stone-100">
          <div className="mb-3">
            {product.originalPrice && (
              <span className="text-xs text-stone-600 line-through mr-2">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <div className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              {formatCurrency(product.price)}
            </div>
            <div className="text-xs text-stone-600">
              em até <strong className="text-stone-700 font-semibold">{product.installments.count}x de {formatCurrency(product.installments.value)}</strong> sem juros
            </div>
          </div>

          {/* Buttons: Primary View & Add to Cart */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewProduct(product)}
              className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Fotos</span>
            </button>

            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-xs hover:shadow"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Comprar</span>
            </button>
          </div>

          {/* Seller Direct Chat Trigger */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-600 pt-2 border-t border-stone-100">
            <button
              onClick={() => onOpenSellerChat(product)}
              className="text-stone-600 hover:text-emerald-800 font-medium flex items-center gap-1 transition-colors"
            >
              <MessageCircle className="w-3 h-3 text-emerald-700" />
              <span>Chat com Vendedor</span>
            </button>

            <a
              href={generateWhatsAppLink(product.seller.phoneWhatsapp, product.title, product.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-800 hover:text-emerald-900 font-medium flex items-center gap-1 transition-colors"
              title="Abrir WhatsApp com mensagem pronta"
            >
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
