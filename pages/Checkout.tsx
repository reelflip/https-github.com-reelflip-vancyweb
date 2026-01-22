
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Address } from '../types';

const Checkout: React.FC = () => {
  const { cart, placeOrder, storeSettings, user, coupons } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [couponError, setCouponError] = useState('');

  const [shippingData, setShippingData] = useState<Omit<Address, 'id' | 'isDefault'>>({
    name: user?.name || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    zip: user?.addresses?.[0]?.zip || '',
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.flatShippingRate;
  const totalDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = subtotal + shipping - totalDiscount;

  const handleApplyCoupon = () => {
    setCouponError('');
    const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
    if (!coupon) {
      setCouponError('Invalid coupon code.');
      return;
    }
    if (subtotal < coupon.minSpend) {
      setCouponError(`Minimum spend of ₹${coupon.minSpend} required.`);
      return;
    }
    
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }
    
    setAppliedCoupon({ code: coupon.code, discount });
    setCouponCode('');
  };

  const handlePlaceOrder = () => {
    if (!selectedMethod) {
      alert("Please select a payment method.");
      return;
    }
    setIsProcessing(true);
    
    const orderAddress: Address = {
      ...shippingData,
      id: `checkout-${Date.now()}`,
      isDefault: false
    };

    setTimeout(() => {
        placeOrder(orderAddress, totalDiscount, appliedCoupon?.code);
        setIsProcessing(false);
        setStep(3);
    }, 2000);
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit / Debit Card', icon: '💳', type: 'online' },
    { id: 'razorpay', name: 'Razorpay UPI/Netbanking', icon: '📱', type: 'online' },
    { id: 'stripe', name: 'Stripe International', icon: '🌍', type: 'online' },
    { id: 'cod', name: 'Cash on Delivery', icon: '🚚', type: 'offline' }
  ].filter(m => {
    if (m.id === 'card' && storeSettings.enabledPaymentGateways.includes('razorpay')) return false;
    return storeSettings.enabledPaymentGateways.includes(m.id);
  });

  if (isProcessing) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 border-4 border-stone-100 border-t-stone-900 rounded-full animate-spin mb-8"></div>
            <h2 className="text-3xl brand-font mb-4">Processing Secure Payment</h2>
            <p className="text-stone-500 font-light max-w-xs uppercase tracking-widest text-[10px]">Please do not refresh the page or click back.</p>
        </div>
      );
  }

  if (step === 3) {
    return (
      <div className="max-w-xl mx-auto py-32 text-center px-4">
        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
           <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <h1 className="text-3xl brand-font mb-4">Order Placed Successfully!</h1>
        <p className="text-stone-500 mb-8 font-light">Thank you for choosing Vancy. Your premium handcrafted selection is being prepared.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate('/profile?tab=orders')} className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-stone-800 transition">View Orders</button>
          <button onClick={() => navigate('/')} className="border border-stone-200 text-stone-900 px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-stone-100 transition">Keep Exploring</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          {/* Progress */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-stone-900 font-bold' : 'text-stone-300'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${step >= 1 ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200'}`}>1</span>
              <span className="text-xs uppercase tracking-widest">Shipping</span>
            </div>
            <div className="h-[1px] w-12 bg-stone-200"></div>
            <div className={`flex items-center gap-3 ${step >= 2 ? 'text-stone-900 font-bold' : 'text-stone-300'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${step >= 2 ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200'}`}>2</span>
              <span className="text-xs uppercase tracking-widest">Payment</span>
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-bold brand-font">Delivery Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-stone-400 tracking-widest ml-1">Full Name</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-1 focus:ring-stone-900 transition" 
                      value={shippingData.name}
                      onChange={e => setShippingData({...shippingData, name: e.target.value})}
                    />
                </div>
                <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-stone-400 tracking-widest ml-1">Street Address</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="House no, Building, Street" 
                      className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-1 focus:ring-stone-900 transition" 
                      value={shippingData.street}
                      onChange={e => setShippingData({...shippingData, street: e.target.value})}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-stone-400 tracking-widest ml-1">City</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Mumbai" 
                      className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-1 focus:ring-stone-900 transition" 
                      value={shippingData.city}
                      onChange={e => setShippingData({...shippingData, city: e.target.value})}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-stone-400 tracking-widest ml-1">Pincode</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="400001" 
                      className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-1 focus:ring-stone-900 transition" 
                      value={shippingData.zip}
                      onChange={e => setShippingData({...shippingData, zip: e.target.value})}
                    />
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!shippingData.name || !shippingData.street || !shippingData.city || !shippingData.zip}
                className="w-full bg-stone-900 text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-stone-800 transition shadow-xl disabled:opacity-50"
              >
                Proceed to Payment
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-bold brand-font">Payment Information</h2>
              <div className="space-y-4">
                {paymentMethods.length > 0 ? (
                  paymentMethods.map((method) => (
                    <label key={method.id} className="flex items-center gap-4 p-5 border border-stone-200 rounded-2xl cursor-pointer hover:bg-stone-50 transition has-[:checked]:border-stone-900 has-[:checked]:bg-stone-50 group">
                      <input 
                        type="radio" 
                        name="payment" 
                        value={method.id} 
                        className="w-5 h-5 accent-stone-900" 
                        onChange={() => setSelectedMethod(method.id)}
                      />
                      <div className="flex-1 flex justify-between items-center">
                          <span className="font-bold text-stone-800 text-sm uppercase tracking-widest">{method.name}</span>
                          <span className="text-2xl grayscale group-hover:grayscale-0 transition">{method.icon}</span>
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="p-8 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                    <p className="text-sm font-bold text-amber-900">Checkout is currently unavailable.</p>
                    <p className="text-xs text-amber-700 mt-2">No payment methods are configured.</p>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 border border-stone-200 text-stone-900 py-5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-stone-50 transition"
                >
                  Edit Shipping
                </button>
                <button 
                  onClick={handlePlaceOrder}
                  disabled={!selectedMethod}
                  className="flex-[2] bg-stone-900 text-white py-5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-stone-800 transition shadow-2xl disabled:opacity-50"
                >
                  Pay ₹{total.toLocaleString()}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Preview */}
        <div className="bg-stone-100 p-8 sm:p-12 rounded-[40px] h-fit sticky top-28 border border-stone-200">
           <h3 className="text-xl font-bold mb-8 brand-font">Order Summary</h3>
           
           <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
             {cart.map((item, i) => (
               <div key={i} className="flex gap-6">
                 <div className="relative">
                    <img src={item.product.images[0]} className="w-20 h-24 object-cover rounded-xl shadow-md" alt="" />
                    <span className="absolute -top-2 -right-2 bg-stone-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">{item.quantity}</span>
                 </div>
                 <div className="flex-1 flex flex-col justify-center">
                   <h4 className="text-sm font-bold text-stone-900 uppercase tracking-tighter">{item.product.name}</h4>
                   <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Size: {item.selectedSize}</p>
                   <p className="text-sm font-bold mt-2">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                 </div>
               </div>
             ))}
           </div>

           {/* Coupon Section */}
           {step < 3 && (
             <div className="mb-8 p-6 bg-white rounded-2xl border border-stone-200">
                <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-3">Promotional Code</label>
                <div className="flex gap-2">
                   <input 
                      type="text" 
                      placeholder="VANCY15" 
                      className="flex-1 text-xs p-3 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-stone-900 uppercase"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                   />
                   <button 
                      onClick={handleApplyCoupon}
                      className="bg-stone-900 text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 transition"
                   >
                      Apply
                   </button>
                </div>
                {couponError && <p className="text-[9px] text-red-500 font-bold mt-2 uppercase tracking-widest">{couponError}</p>}
                {appliedCoupon && (
                  <div className="flex justify-between items-center mt-4 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                    <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">Applied: {appliedCoupon.code}</span>
                    <button onClick={() => setAppliedCoupon(null)} className="text-green-700 font-bold text-xs">×</button>
                  </div>
                )}
             </div>
           )}

           <div className="space-y-4 pt-8 border-t border-stone-200">
             <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-stone-400">
               <span>Bag Subtotal</span>
               <span className="text-stone-900">₹{subtotal.toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-stone-400">
               <span>Shipping</span>
               <span className={shipping === 0 ? 'text-green-600' : 'text-stone-900'}>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}</span>
             </div>
             {appliedCoupon && (
               <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-green-600">
                 <span>Discount</span>
                 <span>- ₹{appliedCoupon.discount.toLocaleString()}</span>
               </div>
             )}
             <div className="flex justify-between font-bold text-2xl pt-4 text-stone-900">
               <span className="brand-font">Total Payable</span>
               <span>₹{total.toLocaleString()}</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
