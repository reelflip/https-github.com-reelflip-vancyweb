
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import ProductCard from '../components/ProductCard';

const Profile: React.FC = () => {
  const { user, orders, wishlist, logout, addAddress, removeAddress, products, requestRefund } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = searchParams.get('tab') || 'orders';

  const [newAddr, setNewAddr] = useState({ name: '', street: '', city: '', zip: '', isDefault: false });

  const wishlistedProducts = useMemo(() => products.filter(p => wishlist.includes(p.id)), [products, wishlist]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddAddr = (e: React.FormEvent) => {
      e.preventDefault();
      addAddress(newAddr);
      setNewAddr({ name: '', street: '', city: '', zip: '', isDefault: false });
  };

  if (!user) {
      return (
          <div className="max-w-7xl mx-auto px-4 py-24 text-center">
              <h1 className="text-3xl brand-font mb-6">Account Needed</h1>
              <p className="text-stone-500 mb-8">Please login to track orders and manage your style.</p>
              <button onClick={() => navigate('/auth')} className="bg-stone-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest shadow-xl">Sign In</button>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 space-y-4">
          <div className="bg-stone-900 text-white p-8 rounded-3xl mb-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-stone-800 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-110"></div>
            <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-stone-900 text-2xl font-bold mb-4 mx-auto md:mx-0 shadow-xl">
                {user?.name?.[0].toUpperCase() || 'V'}
                </div>
                <h2 className="text-xl font-bold brand-font truncate">{user?.name}</h2>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-1">
            {[
              { id: 'orders', label: 'Order History', icon: '📦' },
              { id: 'wishlist', label: 'My Favorites', icon: '❤️' },
              { id: 'addresses', label: 'Addresses', icon: '🏠' },
              { id: 'settings', label: 'Security', icon: '⚙️' },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setSearchParams({ tab: item.id })}
                className={`w-full flex items-center gap-3 px-5 py-3 rounded-2xl transition ${tab === item.id ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-400 hover:bg-stone-50 hover:text-stone-600'}`}
              >
                <span className="text-lg grayscale">{item.icon}</span>
                <span className="text-xs uppercase font-bold tracking-widest">{item.label}</span>
              </button>
            ))}
            <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-3 rounded-2xl w-full text-left text-red-400 hover:bg-red-50 transition">
                <span className="text-lg">🚪</span>
                <span className="text-xs uppercase font-bold tracking-widest">Logout</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 min-h-[600px]">
          {tab === 'orders' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-bold brand-font mb-10">Purchase History</h2>
              {orders.length > 0 ? (
                orders.map(order => (
                  <div key={order.id} className="bg-white border border-stone-100 rounded-[32px] p-8 hover:shadow-lg transition-all mb-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-stone-50 mb-6 gap-4">
                      <div className="flex gap-12">
                        <div>
                            <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest mb-1">Order Ref</p>
                            <p className="font-bold text-sm">#{order.id}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest mb-1">Placed</p>
                            <p className="font-bold text-sm">{order.date}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest mb-1">Total</p>
                            <p className="font-bold text-sm">₹{order.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] px-4 py-2 rounded-full font-bold uppercase tracking-[0.2em] ${
                          order.status === 'Delivered' ? 'bg-green-50 text-green-700' : 
                          order.status === 'Refund Requested' ? 'bg-amber-50 text-amber-700' :
                          'bg-stone-900 text-white'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Order Tracking Bar */}
                    <div className="mb-10 pt-4 flex items-center gap-2">
                       {['Pending', 'Packed', 'Shipped', 'Delivered'].map((step, idx) => (
                         <React.Fragment key={step}>
                           <div className="flex flex-col items-center gap-2">
                              <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center text-[10px] font-bold ${
                                order.status === step || (['Pending', 'Packed', 'Shipped', 'Delivered'].indexOf(order.status as any) > idx)
                                ? 'bg-stone-900 border-stone-900 text-white' : 'bg-white border-stone-100 text-stone-300'
                              }`}>
                                {idx + 1}
                              </div>
                              <span className="text-[9px] uppercase font-bold tracking-widest text-stone-400">{step}</span>
                           </div>
                           {idx < 3 && <div className={`h-[2px] flex-1 rounded-full ${['Pending', 'Packed', 'Shipped', 'Delivered'].indexOf(order.status as any) > idx ? 'bg-stone-900' : 'bg-stone-100'}`}></div>}
                         </React.Fragment>
                       ))}
                    </div>

                    <div className="flex flex-wrap gap-6 items-center">
                      <div className="flex -space-x-4 overflow-hidden">
                        {order.items.map((item, i) => (
                            <img key={i} src={item.product.images[0]} className="w-16 h-20 object-cover rounded-xl border-4 border-white shadow-sm hover:scale-110 transition cursor-help" title={item.product.name} alt="" />
                        ))}
                      </div>
                      <div className="flex-1">
                          <p className="text-xs text-stone-500 font-light mb-1">
                              {order.items.reduce((a, b) => a + b.quantity, 0)} items in shipment
                          </p>
                      </div>
                      <div className="flex gap-3">
                        {order.status === 'Delivered' && (
                          <button 
                            onClick={() => requestRefund(order.id)}
                            className="text-[10px] uppercase font-bold tracking-widest bg-amber-50 text-amber-700 px-6 py-3 rounded-xl hover:bg-amber-100 transition"
                          >
                            Return Items
                          </button>
                        )}
                        <button className="text-[10px] uppercase font-bold tracking-widest border border-stone-200 px-6 py-3 rounded-xl hover:bg-stone-50 transition">Track Package</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-stone-50 p-20 text-center rounded-[40px] border-2 border-dashed border-stone-200">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-stone-200 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  </div>
                  <h3 className="text-xl font-bold brand-font mb-2">No orders found</h3>
                  <p className="text-stone-400 font-light text-sm italic mb-8">Ready to start your premium collection?</p>
                  <button onClick={() => navigate('/shop')} className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px]">Shop Now</button>
                </div>
              )}
            </div>
          )}

          {tab === 'wishlist' && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-bold brand-font mb-10">Saved Favorites</h2>
              {wishlistedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {wishlistedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <div className="bg-stone-50 p-24 text-center rounded-[40px] border-2 border-dashed border-stone-200">
                  <p className="text-stone-400 font-light italic">Your wishlist is empty. Add items to track them here.</p>
                </div>
              )}
            </div>
          )}

          {tab === 'addresses' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-bold brand-font mb-6">Delivery Hub</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {user.addresses.map(addr => (
                  <div key={addr.id} className="p-8 border border-stone-100 rounded-[32px] bg-white shadow-sm relative group hover:shadow-md transition">
                    <button onClick={() => removeAddress(addr.id)} className="absolute top-6 right-6 text-stone-300 hover:text-red-500 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                    <h4 className="font-bold text-stone-900 uppercase text-xs tracking-[0.2em] mb-4">{addr.name} {addr.isDefault && <span className="bg-amber-100 text-amber-700 text-[8px] px-2 py-1 rounded ml-2">PRIMARY</span>}</h4>
                    <p className="text-sm text-stone-500 font-light leading-relaxed">
                        {addr.street}<br/>
                        {addr.city}, {addr.zip}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-stone-50 p-10 rounded-[40px] border border-stone-200 shadow-inner">
                <h3 className="font-bold uppercase text-[10px] tracking-widest mb-8">Add New Address</h3>
                <form onSubmit={handleAddAddr} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input required type="text" placeholder="Address Alias (e.g. Studio)" className="p-4 bg-white border-stone-100 rounded-2xl outline-none sm:col-span-2 text-sm shadow-sm" value={newAddr.name} onChange={e => setNewAddr({...newAddr, name: e.target.value})} />
                    <input required type="text" placeholder="House/Street" className="p-4 bg-white border-stone-100 rounded-2xl outline-none text-sm shadow-sm" value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} />
                    <input required type="text" placeholder="City" className="p-4 bg-white border-stone-100 rounded-2xl outline-none text-sm shadow-sm" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} />
                    <input required type="text" placeholder="Postal Code" className="p-4 bg-white border-stone-100 rounded-2xl outline-none text-sm shadow-sm" value={newAddr.zip} onChange={e => setNewAddr({...newAddr, zip: e.target.value})} />
                    <button className="bg-stone-900 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-stone-800 transition shadow-xl">Secure Save</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
