import React, { useState, useRef, MouseEvent } from 'react';
import { 
  ZoomIn, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface GalleryImage {
  url: string;
  alt: string;
  caption?: string;
}

interface ProductImageGalleryProps {
  images: GalleryImage[];
  productTitle: string;
  discountPercentage?: number;
  freeShipping?: boolean;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productTitle,
  discountPercentage,
  freeShipping,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const activeImage = images[selectedIndex] || images[0];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPosition({ x, y });
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Container with Interactive Zoom */}
      <div className="relative bg-stone-100 rounded-2xl border border-stone-200/80 overflow-hidden group select-none shadow-xs">
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          {discountPercentage && discountPercentage > 0 && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase bg-rose-600 text-white rounded-md shadow-xs flex items-center gap-1">
              -{discountPercentage}% OFF
            </span>
          )}
          {freeShipping && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase bg-emerald-700 text-white rounded-md shadow-xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Frete Grátis
            </span>
          )}
        </div>

        {/* Action Controls: Lightbox & Zoom Prompt */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-stone-700 shadow-sm border border-stone-200 backdrop-blur-xs transition-all hover:scale-105"
            title="Expandir em tela cheia (Lightbox)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Viewer Area */}
        <div
          ref={imageContainerRef}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          className="relative aspect-4/3 sm:aspect-square w-full cursor-crosshair overflow-hidden flex items-center justify-center bg-white"
        >
          <img
            src={activeImage.url}
            alt={activeImage.alt || productTitle}
            className={`w-full h-full object-cover transition-transform duration-150 ${
              isZooming ? 'opacity-0' : 'opacity-100'
            }`}
            loading="eager"
          />

          {/* High-Resolution Zoom Lens Effect */}
          {isZooming && (
            <div
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                backgroundImage: `url(${activeImage.url})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundSize: '240%',
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}

          {/* Zoom hint icon (bottom left) */}
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none bg-stone-900/60 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Passe o mouse para zoom</span>
          </div>

          {/* Previous / Next Arrows on Main Image */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md flex items-center justify-center border border-stone-200 opacity-80 hover:opacity-100 transition-all z-20"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md flex items-center justify-center border border-stone-200 opacity-80 hover:opacity-100 transition-all z-20"
                aria-label="Próxima foto"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Image Caption & Quality Highlight */}
        {activeImage.caption && (
          <div className="bg-stone-50 border-t border-stone-200/80 px-4 py-2.5 flex items-start gap-2 text-xs text-stone-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{activeImage.caption}</span>
          </div>
        )}
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all group ${
                  isSelected
                    ? 'border-emerald-700 ring-2 ring-emerald-700/20 shadow-xs scale-102'
                    : 'border-stone-200 hover:border-stone-300 opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={`Miniatura ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 right-1 bg-stone-900/70 text-white text-[9px] font-semibold px-1 py-0.2 rounded">
                  {idx + 1}/{images.length}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-fadeIn">
          {/* Header */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white py-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-stone-400 font-medium">Visualização Ampliada</p>
              <h4 className="text-sm sm:text-base font-semibold truncate max-w-lg">{productTitle}</h4>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-stone-400 font-mono">
                {selectedIndex + 1} de {images.length}
              </span>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-white transition-colors"
                aria-label="Fechar galeria"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Lightbox Center View */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-2">
            <img
              src={activeImage.url}
              alt={activeImage.alt}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {/* Prev/Next Buttons in Lightbox */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white border border-stone-700 transition-transform active:scale-95"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white border border-stone-700 transition-transform active:scale-95"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Caption & Thumbnails */}
          <div className="w-full max-w-5xl flex flex-col items-center gap-3">
            {activeImage.caption && (
              <p className="text-xs sm:text-sm text-stone-300 text-center max-w-2xl bg-stone-900/80 px-4 py-1.5 rounded-full border border-stone-800">
                {activeImage.caption}
              </p>
            )}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === selectedIndex
                      ? 'border-emerald-500 scale-105 opacity-100'
                      : 'border-stone-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
