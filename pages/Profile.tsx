
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { Order, Address } from '../types';

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
              <h1 className="text-3xl brand-font mb-6">Account Identity Required</h1>
              <p className="text-stone-500 mb-8 font-light">Please login to access your Vancy orders and style preferences.</p>
              <button onClick={() => navigate('/auth')} className="bg-stone-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest shadow-xl">Sign In</button>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Modern Sidebar */}
        <aside className="w-full md:w-80 space-y-4">
          <div className="bg-stone-900 text-white p-10 rounded-[48px] mb-8 relative overflow-hidden group shadow-2xl border border-stone-800">
            <div className="absolute top-0 right-0 w-40 h-40 bg-stone-800 rounded-full -mr-20 -mt-20 transition-all group-hover:scale-110"></div>
            <div className="relative z-10 text-center md:text-left">
                <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-stone-900 text-4xl font-bold mb-6 mx-auto md:mx-0 shadow-2xl border-4 border-stone-800 transform group-hover:rotate-3 transition">
                {user?.name?.[0].toUpperCase() || 'V'}
                </div>
                <h2 className="text-3xl font-bold brand-font truncate mb-1">{user?.name}</h2>
                <p className="text-[10px] text-stone-400 font-black uppercase tracking-[0.3em]">{user?.email}</p>
                <div className="mt-8 pt-8 border-t border-stone-800 space-y-5">
                   <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase font-bold text-stone-500 tracking-[0.2em]">Acquisitions</span>
                      <span className="text-xl font-bold brand-font">{orders.length}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase font-bold text-stone-500 tracking-[0.2em]">Member Since</span>
                      <span className="text-[10px] font-bold text-stone-300">FEB 2024</span>
                   </div>
                </div>
            </div>
          </div>

          <div className="space-y-1">
            {[
              { id: 'orders', label: 'Order Manifest', icon: '📜' },
              { id: 'wishlist', label: 'Curated Favorites', icon: '✨' },
              { id: 'addresses', label: 'Delivery Nodes', icon: '📍' },
              { id: 'settings', label: 'Account Profile', icon: '👤' },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setSearchParams({ tab: item.id })}
                className={`w-full flex items-center gap-5 px-8 py-5 rounded-3xl transition-all duration-300 ${tab === item.id ? 'bg-white shadow-xl text-stone-900 translate-x-1 border border-stone-100 ring-4 ring-stone-900/5' : 'text-stone-400 hover:bg-white hover:text-stone-600'}`}
              >
                <span className="text-xl opacity-80">{item.icon}</span>
                <span className="text-[11px] uppercase font-black tracking-[0.2em]">{item.label}</span>
              </button>
            ))}
            <button onClick={handleLogout} className="flex items-center gap-5 px-8 py-5 rounded-3xl w-full text-left text-red-400 hover:bg-red-50/50 transition-all duration-300 mt-8">
                <span className="text-xl opacity-80">🚪</span>
                <span className="text-[11px] uppercase font-black tracking-[0.2em]">Disconnect Session</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 min-h-[700px]">
          {tab === 'orders' && (
            <div className="space-y-10 animate-fade-in">
              <header>
                <h2 className="text-5xl font-bold brand-font text-stone-900 tracking-tighter">Acquisition History</h2>
                <p className="text-stone-500 font-light mt-2">Detailed log of your premium fashion investments.</p>
              </header>

              {orders.length > 0 ? (
                <div className="bg-white rounded-[56px] border border-stone-100 shadow-sm overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-stone-50/50 border-b border-stone-100">
                         <tr className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
                            <th className="px-10 py-8">Manifest ID</th>
                            <th className="px-10 py-8">Timestamp</th>
                            <th className="px-10 py-8">Destination</th>
                            <th className="px-10 py-8">Status</th>
                            <th className="px-10 py-8 text-right">Settlement</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                         {orders.map(o => (
                           <tr 
                            key={o.id} 
                            onClick={() => setSelectedOrder(o)}
                            className="hover:bg-stone-50 transition-colors cursor-pointer group"
                           >
                              <td className="px-10 py-8">
                                 <span className="font-bold text-stone-900 group-hover:text-amber-700 transition">#{o.id}</span>
                              </td>
                              <td className="px-10 py-8 text-xs text-stone-500">{o.date}</td>
                              <td className="px-10 py-8">
                                 <p className="text-[10px] font-bold text-stone-900 uppercase tracking-widest">{o.shippingAddress?.city}</p>
                                 <p className="text-[9px] text-stone-400 truncate max-w-[150px] font-medium">{o.shippingAddress?.street}</p>
                              </td>
                              <td className="px-10 py-8">
                                 <span className={`text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm border ${
                                    o.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' : 
                                    o.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                    'bg-stone-900 text-white border-stone-900'
                                 }`}>
                                    {o.status}
                                 </span>
                              </td>
                              <td className="px-10 py-8 text-right font-bold text-stone-900">₹{o.total.toLocaleString()}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              ) : (
                <div className="bg-white p-32 text-center rounded-[64px] border border-stone-100 shadow-sm">
                  <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-8 text-stone-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  </div>
                  <h3 className="text-4xl font-bold brand-font mb-4">The Manifest is Clear</h3>
                  <p className="text-stone-400 font-light max-w-xs mx-auto mb-12">No transactions detected. Start your style journey today.</p>
                  <button onClick={() => navigate('/shop')} className="bg-stone-900 text-white px-14 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all">Browse Catalog</button>
                </div>
              )}
            </div>
          )}

          {tab === 'wishlist' && (
            <div className="space-y-10 animate-fade-in">
              <header>
                <h2 className="text-5xl font-bold brand-font text-stone-900 tracking-tighter">Personal Curations</h2>
                <p className="text-stone-500 font-light mt-2">Your saved style anchors and future acquisitions.</p>
              </header>
              {wishlistedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  {wishlistedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <div className="bg-white p-32 text-center rounded-[64px] border border-stone-100 text-stone-300">
                  <p className="brand-font text-2xl mb-4 italic">No favorites yet...</p>
                  <button onClick={() => navigate('/shop')} className="text-stone-900 font-bold uppercase tracking-widest text-[10px] border-b-2 border-stone-900">Discover Styles</button>
                </div>
              )}
            </div>
          )}

          {tab === 'addresses' && (
            <div className="space-y-12 animate-fade-in">
              <header>
                <h2 className="text-5xl font-bold brand-font text-stone-900 tracking-tighter">Delivery Nodes</h2>
                <p className="text-stone-500 font-light mt-2">Registered locations for your logistical distribution.</p>
              </header>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {user.addresses.map(addr => (
                  <div key={addr.id} className="p-12 border border-stone-100 rounded-[48px] bg-white shadow-sm relative group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                    <button onClick={() => removeAddress(addr.id)} className="absolute top-10 right-10 text-stone-200 hover:text-red-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                    <div className="mb-6 flex items-center gap-3">
                        <span className="bg-stone-900 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full inline-block">{addr.name}</span>
                        {addr.isDefault && <span className="text-[9px] font-black text-amber-600 uppercase tracking-[0.3em]">PRIMARY NODE</span>}
                    </div>
                    <p className="text-2xl font-bold brand-font text-stone-900 leading-tight mb-3">{addr.street}</p>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-[0.2em]">
                        {addr.city}, {addr.zip}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-stone-900 text-white p-16 rounded-[64px] shadow-3xl border border-stone-800">
                <h3 className="text-3xl font-bold brand-font mb-10 tracking-tight">Authorize New Logistics Node</h3>
                <form onSubmit={handleAddAddr} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="sm:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Identity Label</label>
                        <input required type="text" placeholder="e.g. South Mumbai HQ" className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl outline-none text-sm font-medium focus:border-amber-500 transition text-white" value={newAddr.name} onChange={e => setNewAddr({...newAddr, name: e.target.value})} />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Street Address</label>
                        <input required type="text" placeholder="Floor, Wing, Street, Landmark" className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl outline-none text-sm font-medium focus:border-amber-500 transition text-white" value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">City</label>
                        <input required type="text" placeholder="e.g. Mumbai" className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl outline-none text-sm font-medium focus:border-amber-500 transition text-white" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Pincode</label>
                        <input required type="text" placeholder="6-Digit PIN" className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl outline-none text-sm font-medium focus:border-amber-500 transition text-white" value={newAddr.zip} onChange={e => setNewAddr({...newAddr, zip: e.target.value})} />
                    </div>
                    <button className="bg-white text-stone-900 sm:col-span-2 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-stone-100 transition active:scale-[0.98] mt-4">Register Address</button>
                </form>
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="space-y-12 animate-fade-in">
                <header>
                    <h2 className="text-5xl font-bold brand-font text-stone-900 tracking-tighter">Identity Settings</h2>
                    <p className="text-stone-500 font-light mt-2">Manage your credentials and personal style profile.</p>
                </header>
                <div className="bg-white p-12 rounded-[56px] border border-stone-100 shadow-sm space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Public Name</label>
                            <p className="text-xl font-bold brand-font">{user.name}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Electronic Mail</label>
                            <p className="text-xl font-bold brand-font">{user.email}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Contact Number</label>
                            <p className="text-xl font-bold brand-font">+91 {user.phone || '9XXXXXXXXX'}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Rewards Status</label>
                            <p className="text-sm font-black text-amber-600 tracking-widest">ELITE MEMBER</p>
                        </div>
                    </div>
                    <div className="pt-10 border-t border-stone-50">
                        <button className="text-[10px] font-black uppercase tracking-widest text-stone-900 border-b-2 border-stone-900 pb-1">Edit Account Details</button>
                    </div>
                </div>
            </div>
          )}
        </main>
      </div>

      {/* Deep-Track Order Modal */}
      {selectedOrder && (
         <div className="fixed inset-0 z-[100] bg-stone-900/90 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[64px] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-500 border border-stone-200">
               <div className="p-16 sm:p-20">
                  <div className="flex justify-between items-start mb-16">
                     <div>
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-600 mb-2 block">Manifest Deep-Track</span>
                        <h3 className="text-5xl font-bold brand-font tracking-tighter text-stone-900">Order #{selectedOrder.id}</h3>
                     </div>
                     <button onClick={() => setSelectedOrder(null)} className="text-stone-300 hover:text-stone-900 transition-colors text-5xl font-light">×</button>
                  </div>

                  <div className="grid grid-cols-2 gap-16 mb-16">
                     <div>
                        <p className="text-[10px] uppercase font-black text-stone-400 tracking-[0.3em] mb-6">Delivery Target</p>
                        <p className="font-bold text-lg text-stone-900 brand-font mb-1">{selectedOrder.shippingAddress?.name}</p>
                        <p className="text-sm text-stone-500 font-light leading-relaxed">
                           {selectedOrder.shippingAddress?.street},<br/>
                           {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.zip}
                        </p>
                     </div>
                     <div className="space-y-8">
                        <div>
                           <p className="text-[10px] uppercase font-black text-stone-400 tracking-[0.3em] mb-4">Current Status</p>
                           <div className="flex items-center gap-3">
                              <span className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></span>
                              <span className="font-black text-[11px] uppercase tracking-widest text-stone-900">{selectedOrder.status}</span>
                           </div>
                        </div>
                        <div>
                           <p className="text-[10px] uppercase font-black text-stone-400 tracking-[0.3em] mb-4">Settlement</p>
                           <p className="text-3xl font-black text-stone-900 tracking-tighter">₹{selectedOrder.total.toLocaleString()}</p>
                        </div>
                     </div>
                  </div>

                  <div className="pt-12 border-t border-stone-100">
                     <p className="text-[10px] uppercase font-black text-stone-300 tracking-[0.4em] mb-10 text-center">Cargo Distribution</p>
                     <div className="space-y-8 max-h-[300px] overflow-y-auto pr-6 custom-scrollbar">
                        {selectedOrder.items.map((it, idx) => (
                           <div key={idx} className="flex gap-8 items-center group">
                              <div className="relative">
                                 <img src={it.product.images[0]} className="w-20 h-24 object-cover rounded-[24px] shadow-xl border border-stone-50 group-hover:scale-105 transition duration-500" alt="" />
                                 <span className="absolute -top-3 -right-3 w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center text-xs font-bold border-4 border-white">x{it.quantity}</span>
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-bold text-stone-900 text-lg brand-font mb-1">{it.product.name}</h4>
                                 <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                                    <span>SIZE: {it.selectedSize}</span>
                                    <span>•</span>
                                    <span>COLOUR: {it.selectedColor}</span>
                                 </div>
                              </div>
                              <span className="font-bold text-stone-900 text-lg">₹{(it.product.price * it.quantity).toLocaleString()}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="mt-16 flex gap-6">
                     {selectedOrder.status === 'Delivered' && (
                        <button 
                           onClick={() => { requestRefund(selectedOrder.id); setSelectedOrder(null); }}
                           className="flex-1 bg-stone-50 text-stone-900 py-6 rounded-[32px] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-stone-100 transition active:scale-[0.98]"
                        >
                           Reverse Acquisition
                        </button>
                     )}
                     <button className="flex-1 bg-stone-900 text-white py-6 rounded-[32px] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-stone-800 transition active:scale-[0.98]">
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
