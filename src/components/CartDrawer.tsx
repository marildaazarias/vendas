import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Truck, 
  Tag, 
  Check,
  ShieldCheck
} from 'lucide-react';
import { CartItem } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQuantity: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent?: number; fixedDiscount?: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = (subtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.fixedDiscount) {
      discount = Math.min(subtotal, appliedCoupon.fixedDiscount);
    }
  }

  const shipping = subtotal > 0 ? 0 : 0; // Free shipping promo
  const total = Math.max(0, subtotal - discount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'BEMVINDO10' || code === 'PRIMEIRACOMPRA') {
      setAppliedCoupon({ code, discountPercent: 10 });
      setCouponCode('');
    } else if (code === 'PROMO50') {
      setAppliedCoupon({ code, fixedDiscount: 50 });
      setCouponCode('');
    } else {
      setCouponError('Cupom inválido. Tente BEMVINDO10 para 10% de desconto.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-stone-200"
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                Seu Carrinho de Compras
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                {items.length} {items.length === 1 ? 'item selecionado' : 'itens selecionados'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Alert Bar */}
        <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-900 font-medium">
          <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Parabéns! Você ganhou <strong>Frete Grátis</strong> para todo o Brasil.</span>
        </div>

        {/* Items List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-stone-300" />
              </div>
              <h4 className="text-base font-bold text-stone-800">Seu carrinho está vazio</h4>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                Navegue pelas ofertas da nossa vitrine e escolha produtos com fotos detalhadas e alta qualidade.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold"
              >
                Explorar Anúncios
              </button>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={index}
                className="p-3.5 rounded-2xl border border-stone-200 bg-white flex gap-3.5 hover:border-stone-300 transition-colors shadow-2xs"
              >
                <img
                  src={item.product.images[0].url}
                  alt={item.product.title}
                  className="w-20 h-20 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-100"
                />

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Remover item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Variations summary */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-stone-500">
                      {item.selectedColor && (
                        <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded">
                          <span 
                            className="w-2 h-2 rounded-full border border-stone-300" 
                            style={{ backgroundColor: item.selectedColor.colorHex }}
                          />
                          {item.selectedColor.value}
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="bg-stone-100 px-2 py-0.5 rounded">
                          {item.selectedSize.value}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                    <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-stone-200"
                      >
                        -
                      </button>
                      <span className="w-7 text-center text-xs font-semibold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-7 h-7 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-stone-200 disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-stone-900">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-stone-600 block">
                          {formatCurrency(item.unitPrice)} un.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Coupon & Order Summary Footer */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-4">
            {/* Coupon input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      Cupom <strong>{appliedCoupon.code}</strong> aplicado (-{formatCurrency(discount)})
                    </span>
                  </div>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-stone-500 hover:text-stone-700 text-[11px] underline"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Cupom: BEMVINDO10"
                      className="w-full bg-white border border-stone-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700 uppercase"
                    />
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Aplicar
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex items-center justify-between">
                <span>Subtotal dos produtos</span>
                <span className="font-medium text-stone-800">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-medium">
                  <span>Desconto promocional</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Frete para o Brasil</span>
                <span className="text-emerald-700 font-bold">Grátis</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-sm font-extrabold text-stone-900">
                <span>Total do Pedido</span>
                <span className="text-base text-stone-900">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="btn-drawer-checkout"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Finalizar Pedido Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Ambiente seguro com criptografia SSL</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
