
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { Order } from '../types';

const Profile: React.FC = () => {
  const { user, orders, wishlist, logout, addAddress, removeAddress, products, requestRefund } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = searchParams.get('tab') || 'orders';

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
        <aside className="w-full md:w-80 space-y-4">
          <div className="bg-stone-900 text-white p-8 rounded-[40px] mb-8 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-stone-800 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-110"></div>
            <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center text-stone-900 text-3xl font-bold mb-6 mx-auto md:mx-0 shadow-xl border-4 border-stone-800">
                {user?.name?.[0].toUpperCase() || 'V'}
                </div>
                <h2 className="text-2xl font-bold brand-font truncate mb-1">{user?.name}</h2>
                <p className="text-[10px] text-stone-400 font-black uppercase tracking-[0.3em]">{user?.email}</p>
                <div className="mt-8 pt-6 border-t border-stone-800 space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase font-bold text-stone-500 tracking-widest">Total Orders</span>
                      <span className="text-lg font-bold brand-font">{orders.length}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase font-bold text-stone-500 tracking-widest">Rewards</span>
                      <span className="text-xs font-black text-amber-500 tracking-widest">Tier I Elite</span>
                   </div>
                </div>
            </div>
          </div>

          <div className="space-y-1">
            {[
              { id: 'orders', label: 'Order Manifest', icon: '📜' },
              { id: 'wishlist', label: 'Curated Favorites', icon: '✨' },
              { id: 'addresses', label: 'Delivery Nodes', icon: '📍' },
              { id: 'settings', label: 'Account Identity', icon: '👤' },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setSearchParams({ tab: item.id })}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${tab === item.id ? 'bg-white shadow-lg text-stone-900 translate-x-1 border border-stone-100' : 'text-stone-400 hover:bg-white hover:text-stone-600'}`}
              >
                <span className="text-lg opacity-80">{item.icon}</span>
                <span className="text-[10px] uppercase font-black tracking-[0.2em]">{item.label}</span>
              </button>
            ))}
            <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 rounded-2xl w-full text-left text-red-400 hover:bg-red-50 transition-all duration-300">
                <span className="text-lg opacity-80">🚪</span>
                <span className="text-[10px] uppercase font-black tracking-[0.2em]">Exit Dashboard</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 min-h-[700px]">
          {tab === 'orders' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <header>
                <h2 className="text-4xl font-bold brand-font text-stone-900 tracking-tighter">Order Manifest</h2>
                <p className="text-stone-400 font-light mt-1">Track your premium acquisitions from warehouse to wardrobe.</p>
              </header>

              {orders.length > 0 ? (
                <div className="bg-white rounded-[40px] border border-stone-100 shadow-sm overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-stone-50 border-b border-stone-100">
                         <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
                            <th className="px-8 py-6">Order ID</th>
                            <th className="px-8 py-6">Date</th>
                            <th className="px-8 py-6">Destination</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6 text-right">Value</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                         {orders.map(o => (
                           <tr 
                            key={o.id} 
                            onClick={() => setSelectedOrder(o)}
                            className="hover:bg-stone-50 transition-colors cursor-pointer group"
                           >
                              <td className="px-8 py-6">
                                 <span className="font-bold text-stone-900 group-hover:text-amber-700 transition">#{o.id}</span>
                              </td>
                              <td className="px-8 py-6 text-sm text-stone-500">{o.date}</td>
                              <td className="px-8 py-6">
                                 <p className="text-[10px] font-bold text-stone-900 uppercase tracking-widest">{o.shippingAddress?.city}</p>
                                 <p className="text-[9px] text-stone-400 truncate max-w-[150px]">{o.shippingAddress?.street}</p>
                              </td>
                              <td className="px-8 py-6">
                                 <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                    o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                    o.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-stone-900 text-white'
                                 }`}>
                                    {o.status}
                                 </span>
                              </td>
                              <td className="px-8 py-6 text-right font-bold text-stone-900">₹{o.total.toLocaleString()}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              ) : (
                <div className="bg-white p-24 text-center rounded-[56px] border border-stone-100 shadow-sm">
                  <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-8 text-stone-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  </div>
                  <h3 className="text-3xl font-bold brand-font mb-4">The Manifest is Clear</h3>
                  <p className="text-stone-400 font-light max-w-xs mx-auto mb-10">You haven't initiated any style acquisitions yet. Explore our latest premium arrivals.</p>
                  <button onClick={() => navigate('/shop')} className="bg-stone-900 text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all">Start Shopping</button>
                </div>
              )}
            </div>
          )}

          {tab === 'wishlist' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <header>
                <h2 className="text-4xl font-bold brand-font text-stone-900 tracking-tighter">Curated Favorites</h2>
                <p className="text-stone-400 font-light mt-1">Your shortlist of premium staples and future essentials.</p>
              </header>
              {wishlistedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  {wishlistedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <div className="bg-white p-24 text-center rounded-[56px] border border-stone-100">
                  <p className="text-stone-400 font-light italic">Your style vault is empty. Browse the shop to save your favorites.</p>
                </div>
              )}
            </div>
          )}

          {tab === 'addresses' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <header>
                <h2 className="text-4xl font-bold brand-font text-stone-900 tracking-tighter">Delivery Nodes</h2>
                <p className="text-stone-400 font-light mt-1">Manage the locations for your Vancy logistics.</p>
              </header>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {user.addresses.map(addr => (
                  <div key={addr.id} className="p-10 border border-stone-100 rounded-[40px] bg-white shadow-sm relative group hover:shadow-xl transition-all duration-500">
                    <button onClick={() => removeAddress(addr.id)} className="absolute top-8 right-8 text-stone-200 hover:text-red-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                    <div className="mb-6">
                        <span className="bg-stone-900 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 inline-block">{addr.name}</span>
                        {addr.isDefault && <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest ml-3">Primary</span>}
                    </div>
                    <p className="text-xl font-bold brand-font text-stone-900 leading-tight mb-2">{addr.street}</p>
                    <p className="text-sm text-stone-400 font-medium uppercase tracking-widest">
                        {addr.city}, {addr.zip}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-stone-900 text-white p-12 rounded-[56px] shadow-2xl">
                <h3 className="text-2xl font-bold brand-font mb-8">Authorize New Delivery Node</h3>
                <form onSubmit={handleAddAddr} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input required type="text" placeholder="Identity Label (e.g. Headquarters)" className="p-5 bg-white/5 border border-white/10 rounded-2xl outline-none sm:col-span-2 text-sm font-medium focus:border-amber-500 transition" value={newAddr.name} onChange={e => setNewAddr({...newAddr, name: e.target.value})} />
                    <input required type="text" placeholder="Thoroughfare / Street" className="p-5 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-medium focus:border-amber-500 transition" value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <input required type="text" placeholder="City" className="p-5 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-medium focus:border-amber-500 transition" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} />
                        <input required type="text" placeholder="Pin" className="p-5 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-medium focus:border-amber-500 transition" value={newAddr.zip} onChange={e => setNewAddr({...newAddr, zip: e.target.value})} />
                    </div>
                    <button className="bg-white text-stone-900 sm:col-span-2 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-stone-100 transition active:scale-95">Register Node</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
         <div className="fixed inset-0 z-[100] bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[64px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
               <div className="p-12 sm:p-16">
                  <div className="flex justify-between items-start mb-12">
                     <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 mb-2 block">Order Identity</span>
                        <h3 className="text-4xl font-bold brand-font tracking-tighter">Manifest #{selectedOrder.id}</h3>
                     </div>
                     <button onClick={() => setSelectedOrder(null)} className="text-stone-300 hover:text-stone-900 transition-colors text-4xl">×</button>
                  </div>

                  <div className="grid grid-cols-2 gap-12 mb-12">
                     <div>
                        <p className="text-[9px] uppercase font-black text-stone-400 tracking-[0.3em] mb-4">Logistics Target</p>
                        <p className="font-bold text-sm text-stone-900">{selectedOrder.shippingAddress?.name}</p>
                        <p className="text-xs text-stone-500 font-light mt-1">
                           {selectedOrder.shippingAddress?.street},<br/>
                           {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.zip}
                        </p>
                     </div>
                     <div>
                        <p className="text-[9px] uppercase font-black text-stone-400 tracking-[0.3em] mb-4">Commercial Details</p>
                        <div className="space-y-1">
                           <div className="flex justify-between text-xs">
                              <span className="text-stone-400">Status</span>
                              <span className="font-bold uppercase tracking-widest text-[10px]">{selectedOrder.status}</span>
                           </div>
                           <div className="flex justify-between text-xs border-t border-stone-50 pt-2">
                              <span className="text-stone-400 font-bold">Total Paid</span>
                              <span className="font-bold text-stone-900">₹{selectedOrder.total.toLocaleString()}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="pt-10 border-t border-stone-100">
                     <p className="text-[9px] uppercase font-black text-stone-300 tracking-[0.4em] mb-8">Cargo Breakdown</p>
                     <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                        {selectedOrder.items.map((it, idx) => (
                           <div key={idx} className="flex gap-6 items-center">
                              <img src={it.product.images[0]} className="w-16 h-20 object-cover rounded-2xl shadow-sm border border-stone-50" alt="" />
                              <div className="flex-1">
                                 <h4 className="font-bold text-stone-900 text-sm mb-1">{it.product.name}</h4>
                                 <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-stone-400">
                                    <span>{it.selectedSize}</span>
                                    <span>•</span>
                                    <span>{it.selectedColor}</span>
                                    <span>•</span>
                                    <span>Qty: {it.quantity}</span>
                                 </div>
                              </div>
                              <span className="font-bold text-stone-900">₹{(it.product.price * it.quantity).toLocaleString()}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="mt-12 flex gap-4">
                     {selectedOrder.status === 'Delivered' && (
                        <button 
                           onClick={() => { requestRefund(selectedOrder.id); setSelectedOrder(null); }}
                           className="flex-1 bg-stone-50 text-stone-900 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-100 transition"
                        >
                           Initiate Return
                        </button>
                     )}
                     <button className="flex-1 bg-stone-900 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-stone-800 transition">
                        Download Waybill
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Profile;
