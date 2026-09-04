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
  CheckCircle2,
  PackageCheck,
  Ruler,
  RotateCcw,
  Tag,
  Upload,
  LayoutList,
  LayoutGrid
} from 'lucide-react';
import { MOCK_PRODUCTS, FABRICS, SIZES } from './data/mockProducts';
import { Product, CartItem, ProductVariation, Review, OrderDetails } from './types';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { UploadPhotoModal } from './components/UploadPhotoModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SellerChatModal } from './components/SellerChatModal';
import { ReviewModal } from './components/ReviewModal';
import { UxArchitectureModal } from './components/UxArchitectureModal';
import { AllReviewsSection } from './components/AllReviewsSection';
import { Footer } from './components/Footer';
import { formatCurrency } from './utils/formatters';

export default function App() {
  // Products state (allows appending new reviews, questions, etc.)
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  // Search, category, fabric, size and color filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos os Modelos');
  const [selectedFabric, setSelectedFabric] = useState('Todos os Tecidos');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState('Todos');
  const [selectedColor, setSelectedColor] = useState('Todas');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'horizontal' | 'grid'>('horizontal');

  // Modals & Panels State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [chatProduct, setChatProduct] = useState<Product | null>(null);
  const [reviewProduct, setReviewProduct] = useState<Product | null>(null);
  const [isUxGuideOpen, setIsUxGuideOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Cart & Favorites State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['conjunto-renda-francesa-aro', 'body-renda-tule-decote-v']));
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

    showToast(`"${product.title.slice(0, 30)}..." adicionado à sua sacola!`);
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
    showToast('Item removido da sacola.');
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
      author: 'Cliente Interessada',
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

  // Add new product with custom photo
  const handleAddNewProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    setSelectedProduct(newProduct);
    showToast('Novo anúncio com sua foto publicado com sucesso!');
  };

  // Update existing product photo
  const handleUpdateProductImage = (productId: string, newImageUrl: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedImages = [
            {
              url: newImageUrl,
              alt: p.title,
              caption: 'Foto do produto atualizada pelo ateliê',
            },
            ...p.images.slice(1),
          ];
          return {
            ...p,
            images: updatedImages,
          };
        }
        return p;
      })
    );

    setSelectedProduct((curr) => {
      if (curr && curr.id === productId) {
        return {
          ...curr,
          images: [
            {
              url: newImageUrl,
              alt: curr.title,
              caption: 'Foto do produto atualizada pelo ateliê',
            },
            ...curr.images.slice(1),
          ],
        };
      }
      return curr;
    });

    showToast('Foto do anúncio atualizada com sucesso!');
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'Todos os Modelos' ||
          selectedCategory === 'Todos os Anúncios' ||
          p.category === selectedCategory;

        const matchesFabric =
          selectedFabric === 'Todos os Tecidos' ||
          p.fabric.toLowerCase().includes(selectedFabric.toLowerCase()) ||
          p.fabricDescription.toLowerCase().includes(selectedFabric.toLowerCase());

        const matchesSize =
          selectedSizeFilter === 'Todos' ||
          p.variations.sizes?.some((s) => s.name.startsWith(selectedSizeFilter));

        const matchesColor =
          selectedColor === 'Todas' ||
          p.title.toLowerCase().includes(selectedColor.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(selectedColor.toLowerCase()) ||
          p.description.toLowerCase().includes(selectedColor.toLowerCase()) ||
          p.variations.colors?.some(
            (c) =>
              c.value.toLowerCase().includes(selectedColor.toLowerCase()) ||
              c.name.toLowerCase().includes(selectedColor.toLowerCase())
          ) ||
          p.specs?.some((s) => s.value.toLowerCase().includes(selectedColor.toLowerCase()));

        const matchesSearch =
          !searchQuery.trim() ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesFabric && matchesSize && matchesColor && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, searchQuery, selectedCategory, selectedFabric, selectedSizeFilter, selectedColor, sortBy]);

  // Featured product for banner showcase
  const featuredProduct = products.find((p) => p.isFeatured) || products[0];

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-stone-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-rose-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header Component */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedFabric={selectedFabric}
        onSelectFabric={setSelectedFabric}
        selectedSize={selectedSizeFilter}
        onSelectSize={setSelectedSizeFilter}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        favoritesCount={favorites.size}
        onOpenUxGuide={() => setIsUxGuideOpen(true)}
        onOpenGeneralReviews={() => {
          document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* Hero Showcase Section */}
      {(selectedCategory === 'Todos os Modelos' || selectedCategory === 'Todos os Anúncios') && !searchQuery && selectedFabric === 'Todos os Tecidos' && selectedSizeFilter === 'Todos' && (
        <section className="bg-stone-900 text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 text-rose-300 border border-stone-700 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>Destaque Exclusivo do Ateliê</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-amber-300 text-xs font-bold border border-stone-700">
                  Valores de R$ 71,90 a R$ 95,90
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-stone-100">
                {featuredProduct.title}
              </h1>

              <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
                {featuredProduct.subtitle}
              </p>

              {/* Fabric and Size badging in hero */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-3 py-1 bg-stone-800/90 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700">
                  Tecido: <strong className="text-rose-300">{featuredProduct.fabric}</strong>
                </span>
                <span className="px-3 py-1 bg-stone-800/90 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700">
                  Tamanhos Disponíveis: <strong className="text-white">P • M • G • GG</strong>
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-rose-400 hover:text-rose-300 underline font-semibold flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Ver Guia de Medidas
                </button>
              </div>

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
                <span className="px-2.5 py-1 text-xs font-bold bg-rose-900 text-rose-100 rounded-md">
                  Frete Grátis com Embalagem Discreta
                </span>
              </div>

              <p className="text-xs text-stone-400">
                ou em até {featuredProduct.installments.count}x de {formatCurrency(featuredProduct.installments.value)} sem juros no cartão ou 5% no Pix
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-3">
                <button
                  id="btn-hero-view-product"
                  onClick={() => setSelectedProduct(featuredProduct)}
                  className="px-6 py-3 bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Anúncio com Fotos & Zoom HD</span>
                </button>

                <button
                  onClick={() => handleAddToCart(featuredProduct)}
                  className="px-5 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-semibold rounded-2xl border border-stone-700 transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-rose-400" />
                  <span>Adicionar à Sacola</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-stone-800/80 text-stone-400 text-xs">
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Embalagem 100% Discreta</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Forro 100% Algodão Puro</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Troca Fácil e Rápida de Tamanho</span>
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
                  referrerPolicy="no-referrer"
                  className="w-full aspect-4/3 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent flex flex-col justify-end p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 mb-1">
                    Tecido {featuredProduct.fabric} • Galeria com {featuredProduct.images.length} fotos reais
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
        {/* Lingerie Specifications & Price Highlights Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
                <Tag className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Catálogo Especial de Lingerie
              </span>
              <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                R$ 71,90 a R$ 95,90
              </span>
            </div>
            <p className="text-xs text-stone-600">
              Confeccionadas em <strong>Renda Francesa</strong>, <strong>Poliamida Confort</strong> e <strong>Cetim com Toque de Seda</strong>. Cores: <strong>Bordô Marsala</strong>, <strong>Lilás Lavanda</strong>, <strong>Rosa Pink</strong>, <strong>Preto Noite</strong>, <strong>Branco Noiva</strong> e <strong>Amarelo Canário</strong>. Todos os modelos nos tamanhos <strong>P, M, G e GG</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
              title="Carregar fotos de lingerie do seu computador ou celular"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Inserir Minhas Fotos</span>
            </button>
            <button
              onClick={() => setIsSizeGuideOpen(true)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 transition-colors flex items-center gap-1.5"
            >
              <Ruler className="w-3.5 h-3.5 text-rose-600" />
              <span>Tabela de Medidas (P, M, G, GG)</span>
            </button>
          </div>
        </div>

        {/* Active Filter Indicators & Ordering */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                {selectedCategory}
              </h2>
              {selectedColor !== 'Todas' && (
                <span className="px-2.5 py-0.5 rounded-md bg-stone-900 text-white text-xs font-bold flex items-center gap-1">
                  Cor: {selectedColor}
                  <button
                    onClick={() => setSelectedColor('Todas')}
                    className="ml-1 hover:text-rose-300"
                    title="Remover filtro de cor"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedFabric !== 'Todos os Tecidos' && (
                <span className="px-2.5 py-0.5 rounded-md bg-stone-800 text-white text-xs font-bold flex items-center gap-1">
                  {selectedFabric}
                  <button
                    onClick={() => setSelectedFabric('Todos os Tecidos')}
                    className="ml-1 hover:text-rose-300"
                    title="Remover filtro de tecido"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedSizeFilter !== 'Todos' && (
                <span className="px-2.5 py-0.5 rounded-md bg-rose-700 text-white text-xs font-bold flex items-center gap-1">
                  Tam: {selectedSizeFilter}
                  <button
                    onClick={() => setSelectedSizeFilter('Todos')}
                    className="ml-1 hover:text-rose-200"
                    title="Remover filtro de tamanho"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'modelo encontrado' : 'modelos encontrados'} com descrição técnica de tecidos e fotos em alta resolução
            </p>
          </div>

          <div className="flex items-center gap-3">
            {(selectedCategory !== 'Todos os Modelos' || selectedFabric !== 'Todos os Tecidos' || selectedSizeFilter !== 'Todos' || selectedColor !== 'Todas' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('Todos os Modelos');
                  setSelectedFabric('Todos os Tecidos');
                  setSelectedSizeFilter('Todos');
                  setSelectedColor('Todas');
                  setSearchQuery('');
                }}
                className="text-xs text-stone-600 hover:text-stone-900 font-semibold underline cursor-pointer"
              >
                Limpar Filtros
              </button>
            )}

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white border border-stone-200 rounded-xl p-1 shadow-2xs">
                <button
                  onClick={() => setViewMode('horizontal')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'horizontal'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="Catálogo na ordem horizontal (um abaixo do outro com detalhes completos)"
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ordem Horizontal</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="Visualização em Grade de Cards"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grade</span>
                </button>
              </div>

              {/* Order Select */}
              <div className="flex items-center gap-2 text-xs text-stone-600 bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-2xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-semibold text-stone-700 hidden sm:inline">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-stone-800 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="featured">Relevância / Destaques</option>
                  <option value="price-asc">Menor Preço (R$ 71,90...)</option>
                  <option value="price-desc">Maior Preço (R$ 95,90...)</option>
                  <option value="rating">Mais Bem Avaliados</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Container (Horizontal List or Grid) */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-stone-200 p-8">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-stone-800">
              Nenhuma lingerie encontrada com os filtros selecionados
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Experimente remover filtros de tecido ou tamanho para ver toda a nossa coleção de peças entre R$ 71,90 e R$ 95,90.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todos os Modelos');
                setSelectedFabric('Todos os Tecidos');
                setSelectedSizeFilter('Todos');
                setSelectedColor('Todas');
              }}
              className="mt-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Ver todos os modelos
            </button>
          </div>
        ) : viewMode === 'horizontal' ? (
          <div className="flex flex-col gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                layout="horizontal"
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={(p, color, size) => handleAddToCart(p, color, size)}
                onOpenSellerChat={(p) => setChatProduct(p)}
                isFavorite={favorites.has(product.id)}
                onToggleFavorite={handleToggleFavorite}
                onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                layout="grid"
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={(p, color, size) => handleAddToCart(p, color, size)}
                onOpenSellerChat={(p) => setChatProduct(p)}
                isFavorite={favorites.has(product.id)}
                onToggleFavorite={handleToggleFavorite}
                onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
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
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        />
      )}

      {/* 2. Size & Fabric Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* 3. Cart Drawer */}
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

      {/* 4. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 5. Seller Chat Modal */}
      {chatProduct && (
        <SellerChatModal
          product={chatProduct}
          onClose={() => setChatProduct(null)}
        />
      )}

      {/* 6. Review Submission Modal */}
      {reviewProduct && (
        <ReviewModal
          product={reviewProduct}
          onClose={() => setReviewProduct(null)}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* 7. UX Architecture Guide Modal */}
      <UxArchitectureModal
        isOpen={isUxGuideOpen}
        onClose={() => setIsUxGuideOpen(false)}
      />

      {/* 8. Upload Custom Photo Modal */}
      <UploadPhotoModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        products={products}
        onAddNewProduct={handleAddNewProduct}
        onUpdateProductImage={handleUpdateProductImage}
      />
    </div>
  );
}
