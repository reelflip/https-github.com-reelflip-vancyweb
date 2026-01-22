
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
