import React from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  MessageSquareQuote, 
  SlidersHorizontal,
  Ruler,
  X,
  PackageCheck,
  Upload
} from 'lucide-react';
import { CATEGORIES, FABRICS, SIZES, COLOR_FILTERS } from '../data/mockProducts';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedFabric: string;
  onSelectFabric: (fabric: string) => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  onOpenSizeGuide: () => void;
  cartCount: number;
  onOpenCart: () => void;
  favoritesCount: number;
  onOpenUxGuide: () => void;
  onOpenGeneralReviews: () => void;
  onOpenUploadModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedFabric,
  onSelectFabric,
  selectedSize,
  onSelectSize,
  selectedColor,
  onSelectColor,
  onOpenSizeGuide,
  cartCount,
  onOpenCart,
  favoritesCount,
  onOpenUxGuide,
  onOpenGeneralReviews,
  onOpenUploadModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Banner: Trust, Price Range & Lingerie Value Proposition */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 font-bold text-rose-300">
              <PackageCheck className="w-3.5 h-3.5 text-rose-400" />
              Embalagem 100% Discreta & Confidencial
            </span>
            <span className="hidden md:inline text-stone-600">•</span>
            <span className="hidden md:inline text-amber-300 font-semibold">
              Valores promocionais de R$ 71,90 a R$ 95,90
            </span>
            <span className="hidden md:inline text-stone-600">•</span>
            <span className="hidden sm:inline text-stone-400">
              Tecidos: Renda, Poliamida e Cetim (P ao GG)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] sm:text-xs">
            <button
              onClick={onOpenUploadModal}
              className="hover:text-rose-200 transition-colors flex items-center gap-1 font-bold text-rose-300"
              title="Colocar fotos do seu computador ou celular no site"
            >
              <Upload className="w-3.5 h-3.5 text-rose-400" />
              <span>Inserir Minhas Fotos</span>
            </button>
            <span className="text-stone-600">|</span>
            <button
              onClick={onOpenSizeGuide}
              className="hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold text-amber-400"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Tabela P, M, G, GG</span>
            </button>
            <span className="text-stone-600">|</span>
            <button
              onClick={onOpenUxGuide}
              className="hover:text-white transition-colors flex items-center gap-1 font-medium text-stone-300 underline underline-offset-4 decoration-stone-600 hover:decoration-white"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Conceito UX</span>
            </button>
            <span className="text-stone-600">|</span>
            <button
              onClick={onOpenGeneralReviews}
              className="hover:text-white transition-colors flex items-center gap-1 text-stone-300"
            >
              <MessageSquareQuote className="w-3 h-3 text-stone-400" />
              <span>Depoimentos</span>
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
                onSelectCategory('Todos os Modelos');
                onSelectFabric('Todos os Tecidos');
                onSelectSize('Todos');
                onSearchChange('');
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <span className="block text-xl font-bold tracking-tight text-stone-900 leading-none">
                  Vitrine<span className="text-rose-600">.</span>
                </span>
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                  Ateliê & Lingerie Fina
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
                placeholder="Buscar conjuntos em renda, baby doll de cetim, bodies de poliamida..."
                className="w-full bg-white border border-stone-300 rounded-full pl-11 pr-10 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-800 transition-all shadow-2xs"
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
            {/* Upload My Photos Button */}
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/90 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Carregar fotos de lingerie do seu computador ou celular"
            >
              <Upload className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Inserir Minhas Fotos</span>
              <span className="sm:hidden">Fotos</span>
            </button>

            {/* Size Chart Button */}
            <button
              onClick={onOpenSizeGuide}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 border border-stone-200 transition-all"
              title="Ver tabela de medidas para tamanhos P, M, G, GG"
            >
              <Ruler className="w-3.5 h-3.5 text-rose-500" />
              <span>Tabela P, M, G, GG</span>
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
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
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
              placeholder="Buscar em renda, cetim, poliamida..."
              className="w-full bg-white border border-stone-300 rounded-full pl-10 pr-9 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-800"
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

      {/* Filter Navigation Bar: Categories, Fabrics & Sizes */}
      <div className="border-t border-stone-200/80 bg-stone-100/70 overflow-x-auto scrollbar-none py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1">
              Modelos:
            </span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs font-semibold'
                      : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Quick Color, Fabric & Size Pill Filters */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Color Pills */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Cores:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto">
                {COLOR_FILTERS.map((color) => {
                  const isActive = selectedColor === color.value;
                  return (
                    <button
                      key={color.value}
                      onClick={() => onSelectColor(color.value)}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
                      }`}
                      title={color.label}
                    >
                      {color.hex && (
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-stone-300 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                      )}
                      <span>{color.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fabric Pills */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Tecido:
              </span>
              {FABRICS.map((fabric) => {
                const isActive = selectedFabric === fabric;
                return (
                  <button
                    key={fabric}
                    onClick={() => onSelectFabric(fabric)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-rose-900 text-white shadow-xs'
                        : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200'
                    }`}
                  >
                    {fabric}
                  </button>
                );
              })}
            </div>

            {/* Size Pills */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Tam:
              </span>
              {['Todos', ...SIZES].map((sz) => {
                const isActive = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => onSelectSize(sz)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                      isActive
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
