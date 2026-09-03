import { Review } from '../types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function calculateReviewStats(reviews: Review[]) {
  if (!reviews.length) {
    return {
      average: 5,
      total: 0,
      distribution: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 },
      counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  reviews.forEach((r) => {
    const star = Math.max(1, Math.min(5, Math.round(r.rating)));
    counts[star] = (counts[star] || 0) + 1;
    sum += r.rating;
  });

  const total = reviews.length;
  const average = Number((sum / total).toFixed(1));

  const distribution: Record<number, number> = {
    5: Math.round((counts[5] / total) * 100),
    4: Math.round((counts[4] / total) * 100),
    3: Math.round((counts[3] / total) * 100),
    2: Math.round((counts[2] / total) * 100),
    1: Math.round((counts[1] / total) * 100),
  };

  return { average, total, distribution, counts };
}

export function generateWhatsAppLink(phone: string, productTitle: string, productId: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const text = encodeURIComponent(
    `Olá! Vi o anúncio "${productTitle}" (Cód: ${productId}) na plataforma e gostaria de tirar algumas dúvidas antes de fazer o pedido.`
  );
  return `https://wa.me/${cleanPhone}?text=${text}`;
}

export function simulateShipping(zipCode: string) {
  const clean = zipCode.replace(/\D/g, '');
  if (clean.length < 8) return null;

  // Realistic calculation based on prefix
  const digit = parseInt(clean[0], 10);
  const daysExpress = Math.max(1, (digit % 3) + 1);
  const daysStandard = daysExpress + 3;

  return [
    {
      name: 'Envio Expresso Prioritário',
      price: 0, // Free promo or discounted
      isFree: true,
      originalPrice: 28.90,
      days: `${daysExpress} a ${daysExpress + 1} dias úteis`,
      carrier: 'Entrega Rápida Direta',
    },
    {
      name: 'Sedex / Transportadora Ágil',
      price: 19.50,
      isFree: false,
      days: `${daysExpress} dia útil`,
      carrier: 'Sedex Express',
    },
    {
      name: 'PAC Econômico',
      price: 0,
      isFree: true,
      days: `${daysStandard} a ${daysStandard + 3} dias úteis`,
      carrier: 'Correios Brasil',
    },
  ];
}
