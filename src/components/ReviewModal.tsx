import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Check, 
  ThumbsUp, 
  Sparkles 
} from 'lucide-react';
import { Product, Review } from '../types';

interface ReviewModalProps {
  product: Product;
  onClose: () => void;
  onSubmitReview: (productId: string, review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  product,
  onClose,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [variation, setVariation] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    onSubmitReview(product.id, {
      author: author.trim(),
      rating,
      title: title.trim() || 'Excelente experiência com o produto',
      comment: comment.trim(),
      verifiedPurchase: true,
      productVariationUsed: variation || undefined,
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        id="review-modal"
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-800">
              Avaliação de Cliente
            </span>
            <h3 className="text-base font-bold text-stone-900 leading-tight">
              Avaliar anúncio e vendedor
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-stone-900">Avaliação enviada com sucesso!</h4>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              Seu depoimento ajuda outros compradores a tomarem decisões seguras e transparentes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Target Product Bar */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <img
                src={product.images[0].url}
                alt=""
                className="w-11 h-11 rounded-lg object-cover border border-stone-300"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-stone-900 truncate text-xs">{product.title}</p>
                <p className="text-stone-500 text-[11px]">Vendido por: {product.seller.name}</p>
              </div>
            </div>

            {/* Interactive Star Selection */}
            <div>
              <label className="block font-bold text-stone-800 mb-1.5 text-xs">
                Sua nota geral para o produto:
              </label>
              <div className="flex items-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                    aria-label={`${star} estrelas`}
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-3 font-bold text-stone-800 text-sm">
                  {rating} de 5 estrelas
                </span>
              </div>
            </div>

            {/* Name input */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Seu nome completo ou apelido público *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex: Amanda Nogueira"
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            {/* Title input */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Título do seu depoimento
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Qualidade impecável e entrega ultrarrápida!"
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            {/* Comment Body */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Seu comentário e impressões sobre as qualidades do produto *
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte detalhes sobre o acabamento, embalagem, fidelidade às fotos e atendimento do vendedor..."
                className="w-full bg-white border border-stone-300 rounded-xl p-3 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 leading-relaxed"
              />
            </div>

            {/* Variation bought */}
            {product.variations.colors && (
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Qual versão ou cor você comprou?
                </label>
                <select
                  value={variation}
                  onChange={(e) => setVariation(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="">Selecione (opcional)</option>
                  {product.variations.colors.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Recommendation toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="recommend-chk"
                checked={wouldRecommend}
                onChange={(e) => setWouldRecommend(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700 border-stone-300"
              />
              <label htmlFor="recommend-chk" className="font-medium text-stone-700 cursor-pointer flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                Eu recomendo este produto para outros compradores
              </label>
            </div>

            {/* Submit Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold transition-all shadow-xs"
              >
                Publicar Avaliação
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
