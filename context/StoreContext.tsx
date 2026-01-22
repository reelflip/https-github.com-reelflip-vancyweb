
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Product, CartItem, Order, Address, OrderStatus, StoreSettings } from '../types';
import { INITIAL_CATEGORIES, PRODUCTS as INITIAL_PRODUCTS } from '../constants';

interface StoreContextType {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, delta: number) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  orders: Order[];
  allOrders: Order[]; // For Admin
  placeOrder: () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  requestRefund: (orderId: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  categories: string[];
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  storeSettings: StoreSettings;
  updateStoreSettings: (updates: Partial<StoreSettings>) => void;
}

const DEFAULT_SETTINGS: StoreSettings = {
  enabledPaymentGateways: ['cod'],
  deliveryPartners: ['BlueDart', 'Delhivery'],
  freeShippingThreshold: 2000,
  flatShippingRate: 150,
  apiCredentials: {
    razorpay: { keyId: '', keySecret: '' },
    stripe: { publishableKey: '', secretKey: '' },
    delhivery: { apiToken: '' },
    bluedart: { licenseKey: '', loginId: '' }
  }
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getStored = (key: string, fallback: any) => {
    const data = localStorage.getItem(`vancy_${key}`);
    return data ? JSON.parse(data) : fallback;
  };

  const [user, setUser] = useState<User | null>(() => getStored('user', null));
  const [role, setRole] = useState<UserRole>(() => getStored('role', UserRole.BUYER));
  const [cart, setCart] = useState<CartItem[]>(() => getStored('cart', []));
  const [wishlist, setWishlist] = useState<string[]>(() => getStored('wishlist', []));
  const [orders, setOrders] = useState<Order[]>(() => getStored('orders', []));
  const [allOrders, setAllOrders] = useState<Order[]>(() => getStored('allOrders', []));
  const [categories, setCategories] = useState<string[]>(() => getStored('categories', INITIAL_CATEGORIES));
  const [products, setProducts] = useState<Product[]>(() => getStored('products', INITIAL_PRODUCTS));
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => getStored('settings', DEFAULT_SETTINGS));
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => localStorage.setItem('vancy_user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('vancy_role', JSON.stringify(role)), [role]);
  useEffect(() => localStorage.setItem('vancy_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('vancy_wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('vancy_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('vancy_allOrders', JSON.stringify(allOrders)), [allOrders]);
  useEffect(() => localStorage.setItem('vancy_categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('vancy_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('vancy_settings', JSON.stringify(storeSettings)), [storeSettings]);

  const login = (email: string, pass: string) => {
    const isAdmin = email.includes('admin');
    const newUser: User = {
      id: isAdmin ? 'admin-1' : 'u1',
      name: email.split('@')[0],
      email: email,
      role: isAdmin ? UserRole.ADMIN : UserRole.BUYER,
      addresses: [
        { id: 'a1', name: 'Home', street: '123 Luxury Lane', city: 'Mumbai', zip: '400001', isDefault: true }
      ]
    };
    setUser(newUser);
    if (isAdmin) setRole(UserRole.ADMIN);
    return true;
  };

  const register = (name: string, email: string, pass: string) => {
    setUser({ id: Math.random().toString(), name, email, role: UserRole.BUYER, addresses: [] });
    return true;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    setRole(UserRole.BUYER);
  };

  const addToCart = (product: Product, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.findIndex(item => item.product.id === product.id && item.selectedSize === size);
      if (existing > -1) {
        const next = [...prev];
        next[existing].quantity += 1;
        return next;
      }
      return [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  };

  const removeFromCart = (index: number) => setCart(prev => prev.filter((_, i) => i !== index));

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const next = [...prev];
      const newQty = next[index].quantity + delta;
      if (newQty < 1) return prev;
      next[index].quantity = newQty;
      return next;
    });
  };

  const toggleWishlist = (id: string) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const placeOrder = () => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date().toLocaleDateString(),
      status: 'Pending',
      total: cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
      items: [...cart],
      customerEmail: user?.email
    };
    setOrders(prev => [newOrder, ...prev]);
    setAllOrders(prev => [newOrder, ...prev]);
    setCart([]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const update = (prev: Order[]) => prev.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(update);
    setAllOrders(update);
  };

  const requestRefund = (orderId: string) => updateOrderStatus(orderId, 'Refund Requested');

  const addAddress = (addr: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddr = { ...addr, id: Math.random().toString() };
    setUser({ ...user, addresses: [...user.addresses, newAddr] });
  };

  const removeAddress = (id: string) => {
    if (!user) return;
    setUser({ ...user, addresses: user.addresses.filter(a => a.id !== id) });
  };

  const addCategory = (name: string) => setCategories(prev => prev.includes(name) ? prev : [...prev, name]);
  const deleteCategory = (name: string) => setCategories(prev => prev.filter(c => c !== name));

  const addProduct = (p: Omit<Product, 'id'>) => setProducts(prev => [{ ...p, id: `prod-${Date.now()}` }, ...prev]);
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  const updateProduct = (id: string, updates: Partial<Product>) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

  const updateStoreSettings = (updates: Partial<StoreSettings>) => setStoreSettings(prev => ({ ...prev, ...updates }));

  return (
    <StoreContext.Provider value={{
      user, role, setRole, cart, addToCart, removeFromCart, updateQuantity, wishlist, toggleWishlist, 
      login, register, logout, orders, allOrders, placeOrder, updateOrderStatus, requestRefund,
      addAddress, removeAddress, searchQuery, setSearchQuery, categories, addCategory, deleteCategory,
      products, addProduct, deleteProduct, updateProduct, storeSettings, updateStoreSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
