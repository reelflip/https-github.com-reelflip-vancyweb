
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

  const getProgressWidth = (status: string) => {
    const steps = ['Pending', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const idx = steps.indexOf(status);
    if (idx === -1) return '20%';
    return `${(idx + 1) * 20}%`;
  };

  if (!user) {
      return (
          <div className="max-w-7xl mx-auto px-4 py-24 text-center">
              <h1 className="text-3xl brand-font mb-6">Account Identity Required</h1>
              <button onClick={() => navigate('/auth')} className="bg-stone-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest shadow-xl">Sign In</button>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-80 space-y-4">
          <div className="bg-stone-900 text-white p-10 rounded-[48px] relative overflow-hidden group shadow-2xl border border-stone-800">
            <div className="relative z-10 text-center md:text-left">
                <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center text-stone-900 text-4xl font-black mb-6 mx-auto md:mx-0 shadow-2xl">
                {user?.name?.[0].toUpperCase() || 'V'}
                </div>
                <h2 className="text-2xl font-bold brand-font truncate mb-1">{user?.name}</h2>
                <p className="text-[9px] text-amber-500 font-black uppercase tracking-[0.3em]">Tier: Elite Member</p>
                <div className="mt-8 pt-8 border-t border-stone-800 flex justify-between">
                   <div className="text-center">
                      <p className="text-lg font-bold brand-font">{orders.length}</p>
                      <p className="text-[7px] text-stone-500 uppercase font-black">Orders</p>
                   </div>
                   <div className="text-center">
                      <p className="text-lg font-bold brand-font">₹{(orders.reduce((a,b)=>a+b.total,0)/1000).toFixed(1)}k</p>
                      <p className="text-[7px] text-stone-500 uppercase font-black">LTV</p>
                   </div>
                </div>
            </div>
          </div>

          <div className="space-y-1">
            {[
              { id: 'orders', label: 'Order Manifest', icon: '📜' },
              { id: 'wishlist', label: 'Favorites', icon: '✨' },
              { id: 'addresses', label: 'Delivery Nodes', icon: '📍' },
            ].map(item => (
              <button key={item.id} onClick={() => setSearchParams({ tab: item.id })} className={`w-full flex items-center gap-5 px-8 py-5 rounded-[24px] transition-all ${tab === item.id ? 'bg-white shadow-xl text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}>
                <span className="text-lg">{item.icon}</span>
                <span className="text-[10px] uppercase font-black tracking-[0.2em]">{item.label}</span>
              </button>
            ))}
            <button onClick={handleLogout} className="flex items-center gap-5 px-8 py-5 rounded-[24px] w-full text-left text-red-400 hover:bg-red-50 mt-8 transition-all font-black text-[10px] uppercase tracking-widest">Disconnect</button>
          </div>
        </aside>

        <main className="flex-1 min-h-[600px]">
          {tab === 'orders' && (
            <div className="space-y-10 animate-fade-in">
              <header><h2 className="text-5xl font-bold brand-font text-stone-900 tracking-tighter">Your Manifests</h2></header>

              {orders.length > 0 ? (
                <div className="bg-white rounded-[48px] border border-stone-100 shadow-sm overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-stone-50/50 border-b border-stone-100">
                         <tr className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400">
                            <th className="px-10 py-8">ID</th>
                            <th className="px-10 py-8">Status</th>
                            <th className="px-10 py-8">Total</th>
                            <th className="px-10 py-8 text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                         {orders.map(o => (
                           <tr key={o.id} className="hover:bg-stone-50 transition-colors">
                              <td className="px-10 py-8 font-bold text-stone-900">#{o.id}</td>
                              <td className="px-10 py-8">
                                 <span className="text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-stone-900 text-white shadow-sm">{o.status}</span>
                              </td>
                              <td className="px-10 py-8 font-bold">₹{o.total.toLocaleString()}</td>
                              <td className="px-10 py-8 text-right">
                                 <button onClick={() => setSelectedOrder(o)} className="text-[10px] font-black uppercase tracking-widest text-stone-900 underline underline-offset-4">Deep Track</button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              ) : (
                <div className="bg-white p-32 text-center rounded-[64px] border border-stone-100">
                  <h3 className="text-3xl font-bold brand-font mb-4">No Transactions</h3>
                  <button onClick={() => navigate('/shop')} className="bg-stone-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px]">Start Journey</button>
                </div>
              )}
            </div>
          )}

          {tab === 'wishlist' && (
            <div className="space-y-10 animate-fade-in">
              <header><h2 className="text-5xl font-bold brand-font text-stone-900 tracking-tighter">Curated Picks</h2></header>
              {wishlistedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {wishlistedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <div className="bg-white p-32 text-center rounded-[64px] border border-stone-100 text-stone-300">
                  <p className="brand-font text-2xl">No favorites yet...</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {selectedOrder && (
         <div className="fixed inset-0 z-[100] bg-stone-900/95 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[56px] shadow-3xl overflow-hidden animate-fade-in border border-stone-200">
               <div className="p-12 sm:p-16">
                  <div className="flex justify-between items-start mb-12">
                     <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-amber-600 mb-2 block">Logistics Hub</span>
                        <h3 className="text-4xl font-bold brand-font tracking-tighter text-stone-900">Manifest #{selectedOrder.id}</h3>
                     </div>
                     <button onClick={() => setSelectedOrder(null)} className="text-stone-300 hover:text-stone-900 transition text-5xl font-light">×</button>
                  </div>

                  {/* Tracking Visualizer */}
                  <div className="mb-16 bg-stone-50 p-10 rounded-[40px] border border-stone-100">
                     <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-stone-400 mb-6">
                        <span>Initiated</span>
                        <span>Packed</span>
                        <span>Transit</span>
                        <span>Delivered</span>
                     </div>
                     <div className="h-2 w-full bg-stone-200 rounded-full relative overflow-hidden">
                        <div 
                          className="absolute h-full bg-stone-900 transition-all duration-1000 shadow-[0_0_20px_rgba(0,0,0,0.3)]" 
                          style={{ width: getProgressWidth(selectedOrder.status) }}
                        ></div>
                     </div>
                     <p className="mt-8 text-center text-[10px] font-bold text-stone-900 uppercase tracking-widest animate-pulse">
                        Current Status: {selectedOrder.status}
                     </p>
                  </div>

                  <div className="space-y-8 max-h-[250px] overflow-y-auto pr-6 custom-scrollbar mb-12">
                     {selectedOrder.items.map((it, idx) => (
                        <div key={idx} className="flex gap-8 items-center border-b border-stone-50 pb-8">
                           <img src={it.product.images[0]} className="w-16 h-20 object-cover rounded-2xl shadow-lg" alt="" />
                           <div className="flex-1">
                              <h4 className="font-bold text-stone-900 brand-font">{it.product.name}</h4>
                              <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{it.selectedSize} | {it.selectedColor}</p>
                           </div>
                           <span className="font-bold text-stone-900">₹{it.product.price}</span>
                        </div>
                     ))}
                  </div>

                  <div className="flex gap-4">
                     <button onClick={() => alert('Tax Invoice #VNC-' + selectedOrder.id + ' downloaded successfully.')} className="flex-1 bg-stone-900 text-white py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-2xl transition hover:bg-stone-800">Get Invoice</button>
                     <button onClick={() => setSelectedOrder(null)} className="flex-1 border border-stone-200 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-stone-50 transition">Close Hub</button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Profile;
