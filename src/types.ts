export interface ProductVariation {
  id: string;
  name: string;
  type: 'color' | 'size' | 'capacity' | 'edition';
  value: string;
  colorHex?: string;
  extraPrice?: number;
  inStock: boolean;
}

export interface ProductQuality {
  icon: string;
  title: string;
  description: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  likes?: number;
  productVariationUsed?: string;
  userPhoto?: string;
}

export interface ProductQuestion {
  id: string;
  question: string;
  author: string;
  date: string;
  answer?: string;
  answeredAt?: string;
}

export interface SellerInfo {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalSales: number;
  responseTime: string;
  verified: boolean;
  badge: string;
  phoneWhatsapp: string;
  location: string;
  since: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  fabric: 'Renda' | 'Poliamida' | 'Cetim' | 'Renda e Poliamida' | 'Cetim e Renda';
  fabricDescription?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  installments: {
    count: number;
    value: number;
    interestFree: boolean;
  };
  images: {
    url: string;
    alt: string;
    caption?: string;
  }[];
  qualities: ProductQuality[];
  specs: ProductSpec[];
  description: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  freeShipping: boolean;
  seller: SellerInfo;
  variations: {
    colors?: ProductVariation[];
    sizes?: ProductVariation[];
  };
  reviews: Review[];
  questions: ProductQuestion[];
  warrantyMonths: number;
  condition: 'Novo' | 'Reembalado' | 'Seminovo';
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedColor?: ProductVariation;
  selectedSize?: ProductVariation;
  quantity: number;
  unitPrice: number;
}

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
    address: {
      street: string;
      number: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  createdAt: string;
  status: 'Aprovado' | 'Processando' | 'Enviado';
}
