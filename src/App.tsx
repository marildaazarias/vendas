/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  SlidersHorizontal, 
  Search, 
  ArrowUpDown, 
  Eye, 
  ShoppingBag, 
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { MOCK_PRODUCTS } from './data/mockProducts';
import { Product, CartItem, ProductVariation, Review, OrderDetails } from './types';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SellerChatModal } from './components/SellerChatModal';
import { ReviewModal } from './components/ReviewModal';
import { UxArchitectureModal } from './components/UxArchitectureModal';
import { AllReviewsSection } from './components/AllReviewsSection';
import { Footer } from './components/Footer';
import { formatCurrency, generateWhatsAppLink } from './utils/formatters';

export default function App() {
  // Products state (allows appending new reviews, questions, etc.)
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  // Search, category and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos os Anúncios');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Modals & Panels State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [chatProduct, setChatProduct] = useState<Product | null>(null);
  const [reviewProduct, setReviewProduct] = useState<Product | null>(null);
  const [isUxGuideOpen, setIsUxGuideOpen] = useState(false);

  // Cart & Favorites State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['fone-anc-premium']));
  const [orderHistory, setOrderHistory] = useState<OrderDetails[]>([]);

  // Notification toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle favorite
  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        showToast('Removido dos favoritos.');
      } else {
        next.add(productId);
        showToast('Adicionado aos favoritos!');
      }
      return next;
    });
  };

  // Add to cart handler
  const handleAddToCart = (
    product: Product,
    selectedColor?: ProductVariation,
    selectedSize?: ProductVariation,
    quantity: number = 1
  ) => {
    const color = selectedColor || product.variations.colors?.[0];
    const size = selectedSize || product.variations.sizes?.[0];
    const extraPrice = (size?.extraPrice || 0) + (color?.extraPrice || 0);
    const unitPrice = product.price + extraPrice;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor?.id === color?.id &&
          item.selectedSize?.id === size?.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            selectedColor: color,
            selectedSize: size,
            quantity,
            unitPrice,
          },
        ];
      }
    });

    showToast(`"${product.title.slice(0, 30)}..." adicionado ao carrinho!`);
    setIsCartOpen(true);
  };

  // Buy now handler (adds to cart and directly triggers checkout)
  const handleBuyNow = (
    product: Product,
    selectedColor?: ProductVariation,
    selectedSize?: ProductVariation,
    quantity: number = 1
  ) => {
    handleAddToCart(product, selectedColor, selectedSize, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Cart actions
  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removido do carrinho.');
  };

  // Submit review handler
  const handleSubmitReview = (
    productId: string,
    reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>
  ) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Hoje',
      helpfulCount: 0,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newRev, ...p.reviews];
          const newSum = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
          const newAvg = Number((newSum / updatedReviews.length).toFixed(1));
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: newAvg,
          };
        }
        return p;
      })
    );

    // Also update selectedProduct if open
    setSelectedProduct((curr) => {
      if (curr && curr.id === productId) {
        const updatedReviews = [newRev, ...curr.reviews];
        const newSum = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
        const newAvg = Number((newSum / updatedReviews.length).toFixed(1));
        return {
          ...curr,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: newAvg,
        };
      }
      return curr;
    });

    showToast('Sua avaliação foi publicada no anúncio!');
  };

  // Submit question handler
  const handleAddQuestion = (productId: string, questionText: string) => {
    const newQ = {
      id: `q-${Date.now()}`,
      question: questionText,
      author: 'Comprador Interessado',
      date: 'Hoje',
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            questions: [newQ, ...p.questions],
          };
        }
        return p;
      })
    );

    setSelectedProduct((curr) => {
      if (curr && curr.id === productId) {
        return {
          ...curr,
          questions: [newQ, ...curr.questions],
        };
      }
      return curr;
    });
  };

  // Successful order handler
  const handleOrderSuccess = (order: OrderDetails) => {
    setOrderHistory((prev) => [order, ...prev]);
    setCartItems([]);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'Todos os Anúncios' || p.category === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Featured product for banner showcase
  const featuredProduct = products.find((p) => p.isFeatured) || products[0];

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-stone-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header Component */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        favoritesCount={favorites.size}
        onOpenUxGuide={() => setIsUxGuideOpen(true)}
        onOpenGeneralReviews={() => {
          document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Hero Showcase Section */}
      {selectedCategory === 'Todos os Anúncios' && !searchQuery && (
        <section className="bg-stone-900 text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 text-emerald-400 border border-stone-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Anúncio em Destaque Especial</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-stone-100">
                {featuredProduct.title}
              </h1>

              <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
                {featuredProduct.subtitle}
              </p>

              {/* Price & Installments highlight */}
              <div className="flex flex-wrap items-baseline gap-3 pt-2">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {formatCurrency(featuredProduct.price)}
                </span>
                {featuredProduct.originalPrice && (
                  <span className="text-sm text-stone-500 line-through">
                    {formatCurrency(featuredProduct.originalPrice)}
                  </span>
                )}
                <span className="px-2.5 py-1 text-xs font-bold bg-emerald-700 text-white rounded-md">
                  Frete Grátis com Seguro
                </span>
              </div>

              <p className="text-xs text-stone-400">
                ou em até {featuredProduct.installments.count}x de {formatCurrency(featuredProduct.installments.value)} sem juros no cartão
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-3">
                <button
                  id="btn-hero-view-product"
                  onClick={() => setSelectedProduct(featuredProduct)}
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Anúncio com Múltiplas Fotos & Zoom</span>
                </button>

                <button
                  onClick={() => handleAddToCart(featuredProduct)}
                  className="px-5 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-semibold rounded-2xl border border-stone-700 transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Comprar Agora</span>
                </button>

                <button
                  onClick={() => setChatProduct(featuredProduct)}
                  className="px-4 py-3 bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-2xl border border-stone-700 transition-all flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Falar com Vendedor</span>
                </button>
              </div>

              {/* Hero Trust Micro-features */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-stone-800/80 text-stone-400 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Garantia de 12 meses com NF-e</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Despacho em até 24h úteis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Fotos 100% Reais com Zoom</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5">
              <div 
                onClick={() => setSelectedProduct(featuredProduct)}
                className="relative rounded-3xl overflow-hidden border border-stone-700 shadow-2xl bg-stone-800 cursor-pointer group"
              >
                <img
                  src={featuredProduct.images[0].url}
                  alt={featuredProduct.title}
                  className="w-full aspect-4/3 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    Galeria com {featuredProduct.images.length} fotos em alta definição
                  </span>
                  <p className="text-xs text-white font-medium line-clamp-2">
                    {featuredProduct.images[0].caption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Catalog View */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Catalog Header Bar with Counter & Sort Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {selectedCategory}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'anúncio encontrado' : 'anúncios encontrados'} com qualidades detalhadas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-stone-600 bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-semibold text-stone-700">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-stone-800 font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured">Relevância / Destaques</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="rating">Mais Bem Avaliados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-stone-200 p-8">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-stone-800">
              Nenhum produto encontrado
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Não encontramos nenhum anúncio correspondente a "{searchQuery}". Tente usar termos mais genéricos ou selecionar outra categoria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todos os Anúncios');
              }}
              className="mt-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Ver todos os anúncios
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p)}
                onOpenSellerChat={(p) => setChatProduct(p)}
                isFavorite={favorites.has(product.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      {/* Depoimentos e Avaliações Reais Section */}
      <div id="reviews-section">
        <AllReviewsSection
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      </div>

      {/* Footer */}
      <Footer onOpenUxGuide={() => setIsUxGuideOpen(true)} />

      {/* MODALS */}
      {/* 1. Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, color, size, qty) => handleAddToCart(p, color, size, qty)}
          onBuyNow={(p, color, size, qty) => handleBuyNow(p, color, size, qty)}
          onOpenSellerChat={(p) => setChatProduct(p)}
          onOpenReviewModal={(p) => setReviewProduct(p)}
          onAddQuestion={handleAddQuestion}
        />
      )}

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 4. Seller Chat Modal */}
      {chatProduct && (
        <SellerChatModal
          product={chatProduct}
          onClose={() => setChatProduct(null)}
        />
      )}

      {/* 5. Review Submission Modal */}
      {reviewProduct && (
        <ReviewModal
          product={reviewProduct}
          onClose={() => setReviewProduct(null)}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* 6. UX Architecture Guide Modal */}
      <UxArchitectureModal
        isOpen={isUxGuideOpen}
        onClose={() => setIsUxGuideOpen(false)}
      />
    </div>
  );
}
