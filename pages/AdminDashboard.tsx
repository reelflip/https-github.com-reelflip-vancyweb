
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, OrderStatus, Order, User, Coupon } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { products, allOrders, coupons, addProduct, addCoupon, deleteProduct, deleteCoupon, categories } = useStore();
  const [activeTab, setActiveTab] = useState<'inventory' | 'finance' | 'orders' | 'buyers' | 'stats' | 'reviews'>('stats');
  
  const statsData = [
    { name: 'Mon', sales: 4200 }, { name: 'Tue', sales: 3800 }, { name: 'Wed', sales: 5100 },
    { name: 'Thu', sales: 6200 }, { name: 'Fri', sales: 5900 }, { name: 'Sat', sales: 8400 }, { name: 'Sun', sales: 7200 },
  ];

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [prodForm, setProdForm] = useState<Omit<Product, 'id'>>({
    name: '', category: categories[0], price: 0, originalPrice: 0, description: '', images: [''], sizes: ['S','M','L','XL'], colors: ['Black'], rating: 5, reviewCount: 0, stock: 50, fabric: 'Supima Cotton'
  });

  const totalRevenue = allOrders.reduce((a, b) => a + b.total, 0);
  const gstOwed = totalRevenue * 0.12; // Mock 12% GST

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <aside className="w-full lg:w-72 bg-white border-r border-stone-100 p-8 flex flex-col gap-2">
        <div className="mb-12">
          <h1 className="text-3xl font-black brand-font tracking-tighter">VANCY CMS</h1>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { id: 'stats', label: 'Overview', icon: '📊' },
            { id: 'inventory', label: 'SKUs', icon: '👕' },
            { id: 'orders', label: 'Orders', icon: '📦' },
            { id: 'finance', label: 'Finance', icon: '💳' },
            { id: 'reviews', label: 'Feedback', icon: '💬' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-8 py-5 rounded-2xl transition-all text-[11px] font-black uppercase tracking-[0.2em] ${activeTab === item.id ? 'bg-stone-900 text-white shadow-xl' : 'text-stone-400 hover:bg-stone-50'}`}>
              <span className="text-lg">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 lg:p-12 bg-stone-50/30 overflow-y-auto">
        
        {activeTab === 'stats' && (
          <div className="space-y-12 animate-fade-in">
            <header><h2 className="text-4xl font-bold brand-font tracking-tighter">Business Intelligence</h2></header>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
               {[
                 { label: 'Gross Sales', val: `₹${(totalRevenue/1000).toFixed(1)}k` },
                 { label: 'Active SKUs', val: products.length },
                 { label: 'Transactions', val: allOrders.length },
                 { label: 'GST Liability', val: `₹${(gstOwed/1000).toFixed(1)}k` }
               ].map((s, i) => (
                 <div key={i} className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-sm">
                    <span className="text-[9px] uppercase font-black text-stone-300 tracking-[0.3em] mb-4 block">{s.label}</span>
                    <h3 className="text-4xl font-bold text-stone-900 tracking-tighter">{s.val}</h3>
                 </div>
               ))}
            </div>
            <div className="bg-white p-12 rounded-[56px] border border-stone-100">
               <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#bbb', fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#bbb', fontWeight: 'bold'}} />
                    <Tooltip cursor={{fill: '#fcfcfc'}} />
                    <Bar dataKey="sales" fill="#1c1917" radius={[12, 12, 0, 0]} barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="space-y-12 animate-fade-in">
             <header><h2 className="text-4xl font-bold brand-font tracking-tighter">Treasury & Reconciliation</h2></header>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-stone-900 text-white p-12 rounded-[56px] shadow-3xl">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-8">Net Settlement</h3>
                   <div className="flex justify-between items-baseline mb-4">
                      <span className="text-6xl font-black tracking-tighter">₹{(totalRevenue - gstOwed).toLocaleString()}</span>
                   </div>
                   <p className="text-stone-400 text-xs font-light">Calculated after 12% GST deduction and flat fulfillment charges.</p>
                   <button className="mt-12 bg-white text-stone-900 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">Initiate Payout</button>
                </div>
                <div className="bg-white p-12 rounded-[56px] border border-stone-100 shadow-sm space-y-8">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">Tax Breakdown</h3>
                   <div className="space-y-6">
                      <div className="flex justify-between text-sm">
                         <span className="text-stone-400">Total SGST (6%)</span>
                         <span className="font-bold">₹{(gstOwed/2).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-stone-400">Total CGST (6%)</span>
                         <span className="font-bold">₹{(gstOwed/2).toLocaleString()}</span>
                      </div>
                      <div className="pt-6 border-t border-stone-50 flex justify-between font-bold text-lg">
                         <span>Consolidated Tax</span>
                         <span className="text-amber-600">₹{gstOwed.toLocaleString()}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-12 animate-fade-in">
             <header><h2 className="text-4xl font-bold brand-font tracking-tighter">Sentiment Moderation</h2></header>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.filter(p => p.reviews && p.reviews.length > 0).flatMap(p => p.reviews || []).map(r => (
                  <div key={r.id} className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-sm relative group overflow-hidden">
                     <div className="flex justify-between mb-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-stone-900">{r.userName}</span>
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill={i < r.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          ))}
                        </div>
                     </div>
                     <p className="text-sm text-stone-500 font-light leading-relaxed mb-8 italic">"{r.comment}"</p>
                     <div className="flex gap-4">
                        <button onClick={() => alert('Review Published.')} className="bg-stone-900 text-white px-6 py-2 rounded-full text-[8px] font-black uppercase tracking-widest">Approve</button>
                        <button onClick={() => alert('Review Archived.')} className="border border-stone-100 text-stone-400 px-6 py-2 rounded-full text-[8px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition">Flag</button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

      </main>

      {/* Simplified Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-[100] bg-stone-900/90 backdrop-blur-2xl flex items-center justify-center p-4">
           <form onSubmit={(e) => { e.preventDefault(); addProduct(prodForm); setShowAddProduct(false); }} className="bg-white w-full max-w-xl rounded-[56px] p-16 animate-fade-in space-y-8 border border-stone-200">
              <h3 className="text-4xl font-bold brand-font tracking-tighter">Manifest New SKU</h3>
              <div className="grid grid-cols-2 gap-6">
                 <input required type="text" placeholder="Title" className="p-5 bg-stone-50 rounded-2xl outline-none" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                 <input required type="number" placeholder="Price" className="p-5 bg-stone-50 rounded-2xl outline-none" value={prodForm.price || ''} onChange={e => setProdForm({...prodForm, price: Number(e.target.value)})} />
                 <input required type="text" placeholder="Public HTTPS Image Link" className="col-span-2 p-5 bg-stone-50 rounded-2xl outline-none" value={prodForm.images[0]} onChange={e => setProdForm({...prodForm, images: [e.target.value]})} />
              </div>
              <div className="flex gap-4">
                 <button type="button" onClick={() => setShowAddProduct(false)} className="flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-300">Abort</button>
                 <button className="flex-[2] bg-stone-900 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-3xl">Authorize</button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
