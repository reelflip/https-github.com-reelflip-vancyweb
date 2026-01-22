
import React from 'react';
import { useStore } from '../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-32 text-center px-4">
        <div className="bg-stone-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
           <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <h1 className="text-3xl brand-font mb-4">Your bag is empty</h1>
        <p className="text-stone-500 mb-8 font-light">It looks like you haven't added anything to your bag yet. Explore our collections to find your perfect style.</p>
        <Link to="/shop" className="bg-stone-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-stone-800 transition shadow-xl">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl brand-font mb-12">Shopping Bag <span className="text-sm font-sans font-normal text-stone-400">({cart.reduce((a, b) => a + b.quantity, 0)} items)</span></h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item, i) => (
            <div key={i} className="flex gap-6 p-6 bg-white rounded-2xl shadow-sm border border-stone-100 group">
              <div className="w-24 h-32 sm:w-32 sm:h-44 shrink-0 rounded-lg overflow-hidden bg-stone-100">
                <img src={item.product.images[0]} className="w-full h-full object-cover" alt={item.product.name} />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between">
                    <h3 className="font-bold text-lg text-stone-900">{item.product.name}</h3>
                    <span className="font-bold">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                  <p className="text-stone-400 text-xs uppercase tracking-widest mt-1">{item.product.category}</p>
                  <div className="mt-4 flex gap-4 text-sm font-medium">
                    <span className="text-stone-500">Size: <span className="text-stone-900">{item.selectedSize}</span></span>
                    <span className="text-stone-500">Color: <span className="text-stone-900">{item.selectedColor}</span></span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center gap-4 border border-stone-100 rounded-full px-4 py-2 bg-stone-50">
                    <button onClick={() => updateQuantity(i, -1)} className="text-stone-400 hover:text-stone-900 transition">-</button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(i, 1)} className="text-stone-400 hover:text-stone-900 transition">+</button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(i)}
                    className="text-stone-400 hover:text-red-600 transition flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 sticky top-28">
            <h2 className="text-xl font-bold mb-6 brand-font">Order Summary</h2>
            <div className="space-y-4 text-sm pb-6 border-b border-stone-100">
              <div className="flex justify-between">
                <span className="text-stone-500">Bag Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Estimated Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-bold' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}</span>
              </div>
            </div>
            <div className="py-6 flex justify-between items-end">
              <span className="text-stone-900 font-bold uppercase tracking-widest text-[10px]">Total</span>
              <span className="text-2xl font-bold">₹{total.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-stone-800 transition shadow-xl"
            >
              Secure Checkout
            </button>
            <div className="mt-6 flex flex-col items-center gap-2">
                <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="Paypal" />
                </div>
                <p className="text-[9px] text-stone-400 text-center uppercase tracking-widest font-bold">Secure SSL Encrypted Payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
