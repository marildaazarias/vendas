import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  FileText, 
  Copy, 
  ChevronRight, 
  ArrowLeft,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, OrderDetails } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');

  // Customer & Shipping State
  const [customerName, setCustomerName] = useState('Mariana Vasconcelos');
  const [customerEmail, setCustomerEmail] = useState('mariana.vasconcelos@email.com');
  const [customerPhone, setCustomerPhone] = useState('(11) 98765-4321');
  const [customerCpf, setCustomerCpf] = useState('321.654.987-00');
  const [zipCode, setZipCode] = useState('01310-100');
  const [street, setStreet] = useState('Avenida Paulista');
  const [number, setNumber] = useState('1578');
  const [neighborhood, setNeighborhood] = useState('Bela Vista');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('MARIANA VASCONCELOS');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvv, setCardCvv] = useState('888');
  const [installmentsCount, setInstallmentsCount] = useState(1);

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const pixDiscount = paymentMethod === 'pix' ? subtotal * 0.05 : 0;
  const shipping = 0;
  const total = Math.max(0, subtotal - pixDiscount + shipping);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleFinalizeOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const orderId = `VTR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderDetails = {
      orderId,
      items: [...items],
      subtotal,
      discount: pixDiscount,
      shipping,
      total,
      paymentMethod,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        cpf: customerCpf,
        address: {
          street,
          number,
          neighborhood,
          city,
          state,
          zipCode,
        },
      },
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'Aprovado',
    };

    setCompletedOrder(newOrder);
    setStep('confirmation');
    onOrderSuccess(newOrder);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(
      '00020126580014br.gov.bcb.pix0136e053a41b-4d69-424a-912a-43c2c51080a25204000053039865405' +
        total.toFixed(2) +
        '5802BR5925VITRINE E-COMMERCE ANUNCI6009SAO PAULO62070503***6304E2D1'
    );
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        id="checkout-modal-container"
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Checkout Modal Header with Progress Steps */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
              Checkout Seguro
            </span>
            <span className="text-stone-300">•</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`font-semibold ${step === 'shipping' ? 'text-stone-900 underline' : 'text-stone-500'}`}>
                1. Entrega
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className={`font-semibold ${step === 'payment' ? 'text-stone-900 underline' : 'text-stone-500'}`}>
                2. Pagamento
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className={`font-semibold ${step === 'confirmation' ? 'text-emerald-800' : 'text-stone-500'}`}>
                3. Confirmação
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8">
          {/* STEP 1: Shipping & Customer Info */}
          {step === 'shipping' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-1">
                  Dados Pessoais e Endereço de Entrega
                </h3>
                <p className="text-xs text-stone-500">
                  Preencha os dados onde o vendedor enviará os produtos com rastreio garantido.
                </p>
              </div>

              {/* Personal info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">E-mail para confirmação *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">CPF (para nota fiscal) *</label>
                  <input
                    type="text"
                    required
                    value={customerCpf}
                    onChange={(e) => setCustomerCpf(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Address grid */}
              <div className="pt-2 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-800 mb-3 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  Endereço de Destino
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">CEP *</label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">Logradouro (Rua/Avenida) *</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Número *</label>
                    <input
                      type="text"
                      required
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Bairro *</label>
                    <input
                      type="text"
                      required
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block font-semibold text-stone-700 mb-1">Cidade *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>
                    <div className="w-16">
                      <label className="block font-semibold text-stone-700 mb-1">UF *</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2 py-2 text-stone-900 text-center uppercase focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation button */}
              <div className="pt-4 flex items-center justify-between border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800"
                >
                  Voltar ao carrinho
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Continuar para Pagamento</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Method */}
          {step === 'payment' && (
            <form onSubmit={handleFinalizeOrder} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-1">
                  Selecione a Forma de Pagamento
                </h3>
                <p className="text-xs text-stone-500">
                  Todas as transações são protegidas com criptografia de 256 bits.
                </p>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-emerald-700 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-700/20'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <QrCode className="w-5 h-5 text-emerald-700" />
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                      -5% OFF
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">Pix Instantâneo</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Aprovação imediata</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'border-emerald-700 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-700/20'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-stone-700 mb-2" />
                  <h4 className="text-xs font-bold text-stone-900">Cartão de Crédito</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Até 12x sem juros</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('boleto')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    paymentMethod === 'boleto'
                      ? 'border-emerald-700 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-700/20'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <FileText className="w-5 h-5 text-stone-700 mb-2" />
                  <h4 className="text-xs font-bold text-stone-900">Boleto Bancário</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Compensação em 1 dia</p>
                </button>
              </div>

              {/* Pix Configuration */}
              {paymentMethod === 'pix' && (
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>Você economiza {formatCurrency(subtotal * 0.05)} pagando com Pix!</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    O QR Code oficial e o código Pix Copia e Cola serão disponibilizados imediatamente na tela de confirmação para você escanear com qualquer app de banco.
                  </p>
                </div>
              )}

              {/* Credit Card Configuration */}
              {paymentMethod === 'credit_card' && (
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Número do Cartão</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block font-semibold text-stone-700 mb-1">Nome no Cartão</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 uppercase focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Validade (MM/AA)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 text-center font-mono focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">CVV</label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 text-center font-mono focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Parcelamento</label>
                    <select
                      value={installmentsCount}
                      onChange={(e) => setInstallmentsCount(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    >
                      {[1, 2, 3, 6, 10, 12].map((num) => (
                        <option key={num} value={num}>
                          {num}x de {formatCurrency(total / num)} sem juros
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Boleto Info */}
              {paymentMethod === 'boleto' && (
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
                  <p>
                    O boleto bancário será gerado após o clique em Finalizar Pedido com prazo de vencimento de 3 dias úteis. A mercadoria é reservada imediatamente.
                  </p>
                </div>
              )}

              {/* Order Recap */}
              <div className="p-4 rounded-2xl bg-stone-100 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({items.length} itens)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {paymentMethod === 'pix' && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Desconto 5% Pix</span>
                    <span>-{formatCurrency(pixDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Frete Expresso Nacional</span>
                  <span className="text-emerald-800 font-bold">Grátis</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-extrabold text-stone-900">
                  <span>Total Final a Pagar</span>
                  <span className="text-base text-stone-900">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para entrega
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirmar e Finalizar Pedido</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Confirmation & Order Details */}
          {step === 'confirmation' && completedOrder && (
            <div className="space-y-6 text-center animate-fadeIn">
              {/* Celebration badge */}
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-800">
                  Pedido Registrado com Sucesso!
                </span>
                <h3 className="text-2xl font-black text-stone-900 mt-1">
                  Código #{completedOrder.orderId}
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                  Enviamos o resumo e o código de rastreamento para <strong>{completedOrder.customer.email}</strong>.
                </p>
              </div>

              {/* Pix Payment box if chosen */}
              {completedOrder.paymentMethod === 'pix' && (
                <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 max-w-md mx-auto text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-stone-800">
                    <QrCode className="w-4 h-4 text-emerald-700" />
                    <span>Pague com Pix para despacho imediato</span>
                  </div>

                  {/* Simulated SVG QR Code */}
                  <div className="w-44 h-44 bg-white p-3 mx-auto rounded-2xl border border-stone-300 shadow-sm flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-stone-900">
                      <rect x="0" y="0" width="30" height="30" rx="3" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="9" y="9" width="12" height="12" />

                      <rect x="70" y="0" width="30" height="30" rx="3" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="79" y="9" width="12" height="12" />

                      <rect x="0" y="70" width="30" height="30" rx="3" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="9" y="79" width="12" height="12" />

                      <rect x="36" y="10" width="8" height="8" />
                      <rect x="48" y="18" width="12" height="6" />
                      <rect x="36" y="38" width="28" height="28" />
                      <rect x="40" y="42" width="20" height="20" fill="white" />
                      <rect x="45" y="45" width="10" height="10" />

                      <rect x="12" y="42" width="8" height="18" />
                      <rect x="74" y="40" width="16" height="10" />
                      <rect x="72" y="65" width="20" height="25" />
                    </svg>
                  </div>

                  <div className="text-xs">
                    <span className="text-stone-500 block">Valor total com 5% de desconto Pix:</span>
                    <span className="text-xl font-extrabold text-stone-900">
                      {formatCurrency(completedOrder.total)}
                    </span>
                  </div>

                  <button
                    onClick={handleCopyPix}
                    className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedPix ? 'Código Pix Copiado!' : 'Copiar Código Pix'}</span>
                  </button>
                </div>
              )}

              {/* Items Purchased Recap */}
              <div className="max-w-xl mx-auto text-left border border-stone-200 rounded-2xl p-4 bg-stone-50/60 space-y-3">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  Itens do Pedido
                </h4>
                <div className="divide-y divide-stone-200 text-xs">
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.images[0].url}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                        />
                        <div>
                          <p className="font-semibold text-stone-900 leading-tight">{item.product.title}</p>
                          <p className="text-stone-500 text-[11px]">
                            {item.quantity}x {formatCurrency(item.unitPrice)}
                            {item.selectedColor ? ` • ${item.selectedColor.value}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-600 space-y-1">
                  <p><strong>Destinatário:</strong> {completedOrder.customer.name}</p>
                  <p>
                    <strong>Endereço:</strong> {completedOrder.customer.address.street}, {completedOrder.customer.address.number} - {completedOrder.customer.address.neighborhood}, {completedOrder.customer.address.city}/{completedOrder.customer.address.state}
                  </p>
                </div>
              </div>

              {/* Back to Home Button */}
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm"
                >
                  Voltar para a Vitrine de Anúncios
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
