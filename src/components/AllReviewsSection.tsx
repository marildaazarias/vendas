import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  MessageSquareQuote, 
  ThumbsUp, 
  Filter, 
  Sparkles,
  X
} from 'lucide-react';
import { Product, Review } from '../types';

interface AllReviewsSectionProps {
  products: Product[];
  onClose?: () => void;
  onSelectProduct: (product: Product) => void;
}

export const AllReviewsSection: React.FC<AllReviewsSectionProps> = ({
  products,
  onClose,
  onSelectProduct,
}) => {
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);

  // Consolidate all reviews across all products
  const allReviewsWithProduct: { review: Review; product: Product }[] = [];
  products.forEach((p) => {
    p.reviews.forEach((r) => {
      allReviewsWithProduct.push({ review: r, product: p });
    });
  });

  const filteredReviews = selectedStarFilter
    ? allReviewsWithProduct.filter((item) => Math.round(item.review.rating) === selectedStarFilter)
    : allReviewsWithProduct;

  return (
    <div className="bg-stone-50 border-t border-stone-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <MessageSquareQuote className="w-4 h-4" />
              Depoimentos e Avaliações Reais
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              O que dizem os compradores sobre os anúncios
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              Transparência total com avaliações verificadas de quem comprou, testou e avaliou a fidelidade das fotos e o atendimento dos vendedores.
            </p>
          </div>

          {/* Star Rating Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedStarFilter(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStarFilter === null
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              Todas ({allReviewsWithProduct.length})
            </button>
            {[5, 4].map((star) => (
              <button
                key={star}
                onClick={() => setSelectedStarFilter(star)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  selectedStarFilter === star
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>{star}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReviews.map(({ review, product }) => (
            <div
              key={review.id}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Author and Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-800 font-bold text-xs flex items-center justify-center border border-stone-200">
                      {review.author[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{review.author}</h4>
                      <span className="text-[10px] text-stone-500">{review.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Verified badge */}
                {review.verifiedPurchase && (
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Compra Verificada</span>
                  </div>
                )}

                {/* Review Title & Body */}
                <h5 className="text-xs font-bold text-stone-900">{review.title}</h5>
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-4">
                  "{review.comment}"
                </p>
              </div>

              {/* Product Reference Card */}
              <div 
                onClick={() => onSelectProduct(product)}
                className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2.5 cursor-pointer group"
              >
                <img
                  src={product.images[0].url}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-stone-600 block uppercase font-medium">Sobre o produto:</span>
                  <p className="text-xs font-bold text-stone-800 group-hover:text-emerald-800 truncate transition-colors">
                    {product.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
