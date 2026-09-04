import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Sparkles, 
  Tag, 
  Ruler, 
  Layers, 
  PackageCheck,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { Product, ProductVariation } from '../types';
import { FABRICS, SIZES } from '../data/mockProducts';

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddNewProduct: (newProduct: Product) => void;
  onUpdateProductImage: (productId: string, newImageUrl: string) => void;
}

export const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddNewProduct,
  onUpdateProductImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<'new' | 'replace'>('new');
  const [targetProductId, setTargetProductId] = useState<string>(products[0]?.id || '');
  
  // New product form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [fabric, setFabric] = useState('Renda');
  const [category, setCategory] = useState('Conjuntos em Renda');
  const [price, setPrice] = useState<number>(83.90);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['P', 'M', 'G', 'GG']);
  const [colorName, setColorName] = useState('Rosa Floral');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    if (mode === 'replace' && targetProductId) {
      onUpdateProductImage(targetProductId, selectedImage);
      onClose();
      return;
    }

    // Creating new product
    const sizeVariations: ProductVariation[] = selectedSizes.map((sz) => ({
      id: `s-${sz.toLowerCase()}`,
      name: `${sz} (${sz === 'P' ? '36' : sz === 'M' ? '42' : sz === 'G' ? '44' : '46/48'})`,
      type: 'size',
      value: `Tamanho padrão ${sz}`,
      inStock: true,
    }));

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      title: title.trim() || 'Conjunto Especial Lingerie Fina',
      subtitle: subtitle.trim() || `Peça confeccionada em ${fabric} com toque macio e forro 100% algodão.`,
      category: category,
      fabric: fabric,
      fabricDescription: `${fabric} macia com elastano e forro íntimo 100% algodão natural.`,
      price: Number(price) || 83.90,
      originalPrice: Number(price) ? Number((Number(price) * 1.3).toFixed(2)) : 107.90,
      discountPercentage: 23,
      installments: {
        count: 3,
        value: Number(((Number(price) || 83.90) / 3).toFixed(2)),
        interestFree: true,
      },
      images: [
        {
          url: selectedImage,
          alt: title || 'Foto da peça enviada do arquivo',
          caption: 'Foto real da peça enviada pelo ateliê',
        },
        {
          url: 'https://images.unsplash.com/photo-1596783074418-c92338276fa4?auto=format&fit=crop&w=1200&q=80',
          alt: 'Detalhes da peça',
          caption: 'Acabamentos e forro antialérgico',
        },
      ],
      qualities: [
        {
          icon: 'Sparkles',
          title: `Tecido ${fabric} Confort`,
          description: 'Toque agradável na pele com excelente respirabilidade.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Forro 100% Algodão',
          description: 'Proteção íntima natural e higiênica.',
        },
        {
          icon: 'SlidersHorizontal',
          title: 'Ajuste Anatômico',
          description: 'Alças e modelagem adaptáveis ao corpo.',
        },
        {
          icon: 'Heart',
          title: 'Design Exclusivo',
          description: 'Acabamento premium para valorizar a autoestima.',
        },
      ],
      specs: [
        { label: 'Tecido Principal', value: fabric },
        { label: 'Forro', value: '100% Algodão Puro' },
        { label: 'Grade de Tamanhos', value: selectedSizes.join(' • ') },
        { label: 'Cuidados', value: 'Lavar à mão com sabão neutro' },
      ],
      description: `Peça exclusiva confeccionada com maestria em ${fabric}. Com modelagem desenvolvida para proporcionar elegância e bem-estar, conta com forro 100% algodão natural para seu conforto íntimo.`,
      rating: 5.0,
      reviewsCount: 1,
      stock: 20,
      freeShipping: true,
      warrantyMonths: 3,
      condition: 'Novo',
      isFeatured: true,
      seller: {
        id: 'sel-damour-lingerie',
        name: 'Ateliê D\'Amour Lingerie Fina',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        totalSales: 4890,
        responseTime: 'menos de 10 minutos',
        verified: true,
        badge: 'Ateliê Platinum',
        phoneWhatsapp: '5511998765432',
        location: 'Nova Friburgo, RJ',
        since: '2019',
      },
      variations: {
        colors: [
          {
            id: 'c-uploaded',
            name: colorName.trim() || 'Cor da Foto',
            type: 'color',
            value: colorName.trim() || 'Cor da Foto',
            colorHex: '#F472B6',
            inStock: true,
          },
        ],
        sizes: sizeVariations,
      },
      reviews: [
        {
          id: `rev-${Date.now()}`,
          author: 'Cliente Verificada',
          rating: 5,
          date: 'Recente',
          title: 'Linda peça, caimento impecável!',
          comment: 'Tecido de altíssima qualidade e entrega super rápida com embalagem discreta.',
          verifiedPurchase: true,
          helpfulCount: 5,
        },
      ],
      questions: [],
    };

    onAddNewProduct(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-900/80 border border-rose-700 flex items-center justify-center text-rose-300">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Inserir Fotos do Seu Arquivo no Site
              </h2>
              <p className="text-xs text-stone-300">
                Adicione fotos salvas no seu celular ou computador diretamente na loja
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Action Choice Tabs */}
          <div className="flex rounded-2xl bg-stone-100 p-1.5 border border-stone-200">
            <button
              type="button"
              onClick={() => setMode('new')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'new'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Criar Novo Anúncio com Minha Foto
            </button>
            <button
              type="button"
              onClick={() => setMode('replace')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'replace'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Trocar Foto de Anúncio Existente
            </button>
          </div>

          {/* Upload Area */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              Selecione a Imagem da Lingerie:
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {!selectedImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-stone-300 hover:border-rose-500 rounded-2xl p-8 text-center bg-stone-50/50 hover:bg-rose-50/30 cursor-pointer transition-all flex flex-col items-center justify-center gap-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800">
                    Clique para selecionar do seu arquivo ou arraste a foto aqui
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Formatos aceitos: JPG, PNG, WEBP ou fotos tiradas pelo celular
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-stone-300 bg-stone-900 p-2 flex items-center gap-4">
                <img
                  src={selectedImage}
                  alt="Pré-visualização da imagem"
                  referrerPolicy="no-referrer"
                  className="w-24 h-28 object-cover rounded-xl shadow-xs border border-stone-700"
                />
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Imagem carregada com sucesso!</span>
                  </div>
                  <p className="text-xs text-stone-300">
                    Esta foto será exibida em alta qualidade na vitrine e galeria com zoom.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="mt-2 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Trocar imagem</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form details based on mode */}
          {mode === 'replace' ? (
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-2">
                Selecione qual anúncio deve receber esta foto:
              </label>
              <select
                value={targetProductId}
                onChange={(e) => setTargetProductId(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (R$ {p.price.toFixed(2).replace('.', ',')})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Nome / Título da Peça:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Conjunto Cropped em Renda Rosa com Calcinha Asa Delta"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Price */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Preço (R$ 71,90 a R$ 95,90):
                  </label>
                  <div className="flex gap-1.5 mb-1.5">
                    {[71.90, 77.90, 83.90, 89.90, 95.90].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPrice(val)}
                        className={`flex-1 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                          price === val
                            ? 'bg-rose-900 text-white border-rose-900'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {val.toFixed(2).replace('.', ',')}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    step="0.10"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 83.90)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-800"
                  />
                </div>

                {/* Fabric */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Tecido Principal:
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {['Renda', 'Poliamida', 'Cetim'].map((fab) => (
                      <button
                        key={fab}
                        type="button"
                        onClick={() => setFabric(fab)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          fabric === fab
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {fab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sizes Available */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Tamanhos Disponíveis na Peça:
                </label>
                <div className="flex gap-2">
                  {SIZES.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            if (selectedSizes.length > 1) {
                              setSelectedSizes(selectedSizes.filter((s) => s !== sz));
                            }
                          } else {
                            setSelectedSizes([...selectedSizes, sz]);
                          }
                        }}
                        className={`w-10 h-10 rounded-xl font-black text-xs border transition-all ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                            : 'bg-white text-stone-400 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedImage}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-2 transition-all ${
                selectedImage
                  ? 'bg-rose-700 hover:bg-rose-800 cursor-pointer shadow'
                  : 'bg-stone-300 cursor-not-allowed text-stone-500'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>
                {mode === 'replace' ? 'Atualizar Foto do Anúncio' : 'Publicar Anúncio com Minha Foto'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
