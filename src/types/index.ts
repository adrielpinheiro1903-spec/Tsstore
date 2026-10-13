export type ProductCategory =
  | 'smartphones'
  | 'notebooks'
  | 'tablets'
  | 'headphones'
  | 'smartwatches'
  | 'speakers'
  | 'peripherals'
  | 'accessories';

export interface ProductVariantOption {
  label: string;
  value: string;
  priceDiff?: number;
  inStock: boolean;
  colorHex?: string;
}

export interface ProductVariant {
  type: 'color' | 'storage' | 'size';
  name: string;
  options: ProductVariantOption[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  pixDiscountPercent: number; // e.g., 10 for 10%
  maxInstallments: number; // e.g., 12
  stock: number;
  sku: string;
  image: string;
  additionalImages?: string[];
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  rating: number;
  reviewsCount: number;
  description: string;
  shortDescription: string;
  specs: Record<string, string>;
  variants?: ProductVariant[];
  compatibleProductIds?: string[];
}

export interface CartItem {
  id: string; // unique item id: product.id + variant keys
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>; // e.g. { color: 'Titânio Preto', storage: '256GB' }
  unitPrice: number;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  savedAddresses: Address[];
}

export interface Address {
  id?: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

export interface ShippingOption {
  id: string;
  name: string;
  carrier: string;
  price: number;
  deliveryDays: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'payment_approved'
  | 'preparing_shipment'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  date: string;
  customer: CustomerProfile;
  shippingAddress: Address;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  shippingOption: ShippingOption;
  total: number;
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  paymentDetails?: {
    cardLast4?: string;
    cardBrand?: string;
    installments?: number;
    pixCode?: string;
    boletoBarcode?: string;
  };
  status: OrderStatus;
  trackingCode?: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountFixed?: number;
  minSpend?: number;
  description: string;
  active: boolean;
}

export type ActivePage =
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'account'
  | 'wishlist'
  | 'admin'
  | 'about'
  | 'contact'
  | 'faq'
  | 'policies';
