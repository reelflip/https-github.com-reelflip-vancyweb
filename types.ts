
export enum UserRole {
  BUYER = 'BUYER',
  ADMIN = 'ADMIN'
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  addresses: Address[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
  expiryDate: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  stock: number;
  fabric: string;
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Payment Verified' 
  | 'Processing' 
  | 'Packed' 
  | 'Awaiting Pickup' 
  | 'Shipped' 
  | 'In Transit' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Refund Requested' 
  | 'Refunded';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  items: CartItem[];
  customerEmail?: string;
  customerName?: string;
  shippingAddress?: Address;
}

export interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

export interface ApiCredentials {
  razorpay?: { keyId: string; keySecret: string };
  stripe?: { publishableKey: string; secretKey: string };
  delhivery?: { apiToken: string };
  bluedart?: { licenseKey: string; loginId: string };
}

export interface StoreSettings {
  enabledPaymentGateways: string[];
  deliveryPartners: string[];
  freeShippingThreshold: number;
  flatShippingRate: number;
  apiCredentials: ApiCredentials;
}
