import React from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  MessageSquareQuote, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import { CATEGORIES } from '../data/mockProducts';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  favoritesCount: number;
  onOpenUxGuide: () => void;
  onOpenGeneralReviews: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  cartCount,
  onOpenCart,
  favoritesCount,
  onOpenUxGuide,
  onOpenGeneralReviews,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Banner: Trust & Value Proposition */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Compra 100% Segura & Garantia de Entrega
            </span>
            <span className="hidden sm:inline text-stone-500">•</span>
            <span className="hidden sm:inline">Frete Grátis em anúncios selecionados</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onOpenUxGuide}
              className="hover:text-white transition-colors flex items-center gap-1 font-medium text-stone-300 underline underline-offset-4 decoration-stone-600 hover:decoration-white"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              Arquitetura & UX do Site
            </button>
            <span className="text-stone-600">|</span>
            <button
              onClick={onOpenGeneralReviews}
              className="hover:text-white transition-colors flex items-center gap-1 text-stone-300"
            >
              <MessageSquareQuote className="w-3 h-3 text-stone-400" />
              Avaliações & Depoimentos
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                onSelectCategory('Todos os Anúncios');
                onSearchChange('');
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="block text-xl font-bold tracking-tight text-stone-900 leading-none">
                  Vitrine<span className="text-emerald-700">.</span>
                </span>
                <span className="text-[11px] font-medium text-stone-600 uppercase tracking-wider">
                  Anúncios Selecionados
                </span>
              </div>
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por fones, relógios, cafeteiras, mochilas..."
                className="w-full bg-white border border-stone-300 rounded-full pl-11 pr-10 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all shadow-xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded-full"
                  aria-label="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* UX Guide Button for quick review */}
            <button
              id="btn-ux-guide"
              onClick={onOpenUxGuide}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-stone-200 transition-all"
              title="Ver detalhes da arquitetura de UX e decisões de design"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Conceito UX</span>
            </button>

            {/* Favorites */}
            <div className="relative">
              <button
                className="p-2.5 rounded-full hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors relative"
                aria-label="Lista de desejos"
                title="Favoritos"
              >
                <Heart className="w-5 h-5" />
                {favoritesCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </div>

            {/* Shopping Cart Button */}
            <button
              id="btn-open-cart"
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white shadow-sm transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-stone-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold hidden sm:inline">Carrinho</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar produtos anunciados..."
              className="w-full bg-white border border-stone-300 rounded-full pl-10 pr-9 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Horizontal Bar */}
      <div className="border-t border-stone-200/70 bg-stone-100/60 overflow-x-auto scrollbar-none py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 mr-2 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Categorias:</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
