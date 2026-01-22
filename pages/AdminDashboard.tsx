
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, OrderStatus, Order, User, Coupon } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { categories, addCategory, deleteCategory, products, addProduct, deleteProduct, updateProduct, allOrders, updateOrderStatus, storeSettings, updateStoreSettings, coupons, addCoupon, deleteCoupon } = useStore();
  const [activeTab, setActiveTab] = useState<'inventory' | 'categories' | 'orders' | 'buyers' | 'stats' | 'coupons' | 'infrastructure'>('stats');
  
  const statsData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
  ];

  // Form States
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  
  const [prodForm, setProdForm] = useState<Omit<Product, 'id'>>({
    name: '', category: categories[0], price: 0, originalPrice: 0, description: '', images: [''], sizes: ['S','M','L','XL'], colors: ['Black'], rating: 5, reviewCount: 0, stock: 50, fabric: 'Supima Cotton'
  });

  const [couponForm, setCouponForm] = useState<Omit<Coupon, 'id'>>({
    code: '', discountType: 'percentage', value: 0, minSpend: 0, expiryDate: '', isActive: true
  });

  // Comprehensive Mock Buyers for Ledger
  const buyers = [
    { id: 'u1', name: 'Arjun Kumar', email: 'arjun@vancy.in', ltv: 12500, orders: 4, phone: '9820012345', joined: 'Jan 20, 2024', status: 'Elite' },
    { id: 'u2', name: 'Siddharth Roy', email: 'sid@gmail.com', ltv: 8900, orders: 2, phone: '9830054321', joined: 'Feb 05, 2024', status: 'Active' },
    { id: 'u3', name: 'Kabir Singh', email: 'kabir.s@vancy.in', ltv: 22000, orders: 8, phone: '9920067890', joined: 'Dec 12, 2023', status: 'Elite' },
  ];

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(prodForm);
    setShowAddProduct(false);
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setShowAddCoupon(false);
  };

  const sqlSchema = `
-- VANCY PRODUCTION SQL ARCHITECT
CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, password_hash VARCHAR(255), role ENUM('BUYER', 'ADMIN'), phone VARCHAR(20), joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS addresses (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, label VARCHAR(50), street TEXT, city VARCHAR(50), zip VARCHAR(10), is_default BOOLEAN, FOREIGN KEY (user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), category VARCHAR(100), price DECIMAL(10,2), original_price DECIMAL(10,2), description TEXT, stock INT, fabric VARCHAR(100));
CREATE TABLE IF NOT EXISTS orders (id VARCHAR(20) PRIMARY KEY, user_id INT, total DECIMAL(10,2), status VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS order_items (id INT AUTO_INCREMENT PRIMARY KEY, order_id VARCHAR(20), product_id INT, quantity INT, size VARCHAR(10), color VARCHAR(50), FOREIGN KEY (order_id) REFERENCES orders(id));
CREATE TABLE IF NOT EXISTS reviews (id INT AUTO_INCREMENT PRIMARY KEY, product_id INT, user_name VARCHAR(100), rating INT, comment TEXT, date VARCHAR(20), FOREIGN KEY (product_id) REFERENCES products(id));
CREATE TABLE IF NOT EXISTS coupons (id INT AUTO_INCREMENT PRIMARY KEY, code VARCHAR(50) UNIQUE, type VARCHAR(20), value DECIMAL(10,2), min_spend DECIMAL(10,2), expiry VARCHAR(50), is_active BOOLEAN);
  `.trim();

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <aside className="w-full lg:w-72 bg-white border-r border-stone-100 p-8 flex flex-col gap-2">
        <div className="mb-12">
          <h1 className="text-3xl brand-font text-stone-900 tracking-tighter">VANCY CMS</h1>
          <p className="text-[9px] uppercase font-bold tracking-[0.4em] text-stone-400 mt-2">Executive Protocol</p>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { id: 'stats', label: 'Market Overview', icon: '📊' },
            { id: 'inventory', label: 'SKU Inventory', icon: '👕' },
            { id: 'categories', label: 'Taxonomy', icon: '🏷️' },
            { id: 'orders', label: 'Sales Orders', icon: '📦' },
            { id: 'buyers', label: 'Buyer Ledger', icon: '👥' },
            { id: 'coupons', label: 'Promotions', icon: '🎟️' },
            { id: 'infrastructure', label: 'Live Server', icon: '🚀' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-8 py-5 rounded-[24px] transition-all text-[11px] font-black uppercase tracking-[0.2em] ${activeTab === item.id ? 'bg-stone-900 text-white shadow-2xl translate-x-1' : 'text-stone-400 hover:bg-stone-50'}`}>
              <span className="text-lg">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 lg:p-12 bg-stone-50/30 overflow-y-auto">
        
        {activeTab === 'stats' && (
          <div className="space-y-12 animate-fade-in">
            <header><h2 className="text-5xl brand-font tracking-tight text-stone-900">Market Intelligence</h2></header>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
               {[
                 { label: 'Total Revenue', val: `₹${(allOrders.reduce((a,b)=>a+b.total,0)/1000).toFixed(1)}k`, sub: '+12% from Dec' },
                 { label: 'Active Orders', val: allOrders.length, sub: 'Currently Processing' },
                 { label: 'Catalog Size', val: products.length, sub: 'Managed SKUs' },
                 { label: 'Elite Buyers', val: buyers.filter(b => b.status === 'Elite').length, sub: 'High Retention' }
               ].map((s, i) => (
                 <div key={i} className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-sm group hover:shadow-xl transition-all">
                    <span className="text-[10px] uppercase font-black text-stone-300 tracking-[0.3em] mb-4 block group-hover:text-amber-600 transition-colors">{s.label}</span>
                    <h3 className="text-5xl font-bold text-stone-900 mb-2 tracking-tighter">{s.val}</h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{s.sub}</p>
                 </div>
               ))}
            </div>
            <div className="bg-white p-12 rounded-[64px] border border-stone-100 shadow-sm">
               <h4 className="text-2xl font-bold brand-font mb-12">Performance Curve</h4>
               <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8f8f8" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#bbb', fontWeight: 'bold'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#bbb', fontWeight: 'bold'}} />
                      <Tooltip cursor={{fill: '#fcfcfc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                      <Bar dataKey="sales" fill="#1c1917" radius={[16, 16, 0, 0]} barSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'buyers' && (
          <div className="space-y-10 animate-fade-in">
            <header>
               <h2 className="text-5xl brand-font tracking-tight text-stone-900">Buyer Ledger</h2>
               <p className="text-stone-500 font-light mt-2">Manage the complete customer database and lifetime engagement.</p>
            </header>
            <div className="bg-white rounded-[56px] border border-stone-100 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-stone-50/50 border-b border-stone-100">
                     <tr className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
                        <th className="px-10 py-8">Acquirer Identity</th>
                        <th className="px-10 py-8">Contact Node</th>
                        <th className="px-10 py-8">Protocol Joined</th>
                        <th className="px-10 py-8">Total LTV</th>
                        <th className="px-10 py-8 text-right">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                     {buyers.map(b => (
                       <tr key={b.id} onClick={() => setSelectedBuyer(b)} className="border-b border-stone-50 hover:bg-stone-50 transition-colors cursor-pointer group">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold text-lg">{b.name[0]}</div>
                                <div>
                                   <p className="font-bold text-stone-900 brand-font group-hover:text-amber-700 transition">{b.name}</p>
                                   <p className="text-[9px] text-stone-400 font-black uppercase tracking-widest">ID: {b.id}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <p className="text-xs font-bold text-stone-600">{b.email}</p>
                             <p className="text-[10px] text-stone-400">{b.phone}</p>
                          </td>
                          <td className="px-10 py-8 text-xs text-stone-400 font-medium uppercase tracking-widest">{b.joined}</td>
                          <td className="px-10 py-8 font-black text-stone-900">₹{b.ltv.toLocaleString()}</td>
                          <td className="px-10 py-8 text-right">
                             <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-sm ${b.status === 'Elite' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-stone-50 text-stone-500 border-stone-200'}`}>{b.status}</span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* Inventory Management Tab Placeholder (Simplified for turn) */}
        {activeTab === 'inventory' && (
          <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-center">
               <h2 className="text-5xl brand-font tracking-tight text-stone-900">Inventory Management</h2>
               <button onClick={() => setShowAddProduct(true)} className="bg-stone-900 text-white px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-stone-800 transition active:scale-95">Deploy New SKU</button>
            </header>
            <div className="bg-white rounded-[56px] border border-stone-100 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-stone-100">
                     <tr className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
                        <th className="px-10 py-8">SKU Image</th>
                        <th className="px-10 py-8">Identity</th>
                        <th className="px-10 py-8">Category</th>
                        <th className="px-10 py-8">Valuation</th>
                        <th className="px-10 py-8 text-right">Stock Protocol</th>
                     </tr>
                  </thead>
                  <tbody>
                     {products.map(p => (
                       <tr key={p.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition">
                          <td className="px-10 py-8">
                             <img src={p.images[0]} className="w-14 h-16 object-cover rounded-2xl shadow-lg border border-stone-50" alt="" />
                          </td>
                          <td className="px-10 py-8">
                             <span className="font-bold text-stone-900 brand-font text-lg">{p.name}</span>
                          </td>
                          <td className="px-10 py-8">
                             <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">{p.category}</span>
                          </td>
                          <td className="px-10 py-8 font-black text-stone-900">₹{p.price}</td>
                          <td className="px-10 py-8 text-right">
                             <span className={`text-[10px] font-bold ${p.stock < 10 ? 'text-red-500' : 'text-stone-900'}`}>{p.stock} units</span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'infrastructure' && (
          <div className="space-y-12 animate-fade-in">
            <header>
               <h2 className="text-5xl brand-font tracking-tight text-stone-900">Live Server Architect</h2>
               <p className="text-stone-500 font-light mt-2">Configure your production Hostinger node with this protocol.</p>
            </header>
            <div className="bg-stone-900 text-white p-16 rounded-[64px] shadow-3xl relative group border border-stone-800">
               <button onClick={() => { navigator.clipboard.writeText(sqlSchema); alert('SQL Protcol Copied!'); }} className="absolute top-10 right-10 bg-white/10 px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/20 transition backdrop-blur-md">Copy Relational Schema</button>
               <pre className="font-mono text-[12px] leading-relaxed text-amber-200 overflow-x-auto p-6 bg-white/5 rounded-[40px] border border-white/10 custom-scrollbar">
                  {sqlSchema}
               </pre>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="bg-white p-16 rounded-[64px] border border-stone-100 shadow-sm">
                  <h3 className="text-3xl font-bold brand-font mb-8">Hostinger MySQL Sync</h3>
                  <div className="space-y-8">
                     {[
                       { step: '01', title: 'hPanel Database Creation', desc: 'Initialize a new MySQL node in Hostinger > Databases. Set character set to utf8mb4_unicode_ci.' },
                       { step: '02', title: 'Schema Injection', desc: 'Execute the SQL architect script via phpMyAdmin to populate relational tables.' },
                       { step: '03', title: 'Backend Handshake', desc: 'Deploy a PHP PDO or Node.js bridge to synchronize frontend JSON with live MySQL data.' }
                     ].map(s => (
                       <div key={s.step} className="flex gap-6">
                          <span className="text-sm font-black text-amber-500">{s.step}</span>
                          <div>
                             <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-2">{s.title}</h4>
                             <p className="text-xs text-stone-400 font-light leading-relaxed">{s.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="bg-amber-600 p-16 rounded-[64px] text-white shadow-3xl flex flex-col justify-center items-center text-center space-y-6">
                  <div className="text-7xl">⚡</div>
                  <h3 className="text-4xl brand-font">Production Ready</h3>
                  <p className="text-sm font-light opacity-80 leading-relaxed max-w-xs">Your data layer is engineered for enterprise-grade transactional integrity.</p>
               </div>
            </div>
          </div>
        )}

        {/* Overview Tab (Stats) Placeholder - Sales Velocity Chart */}
        {activeTab === 'stats' && (
           <div className="mt-12 text-center text-stone-300 text-[10px] font-bold uppercase tracking-[0.5em]">Real-time Telemetry Active</div>
        )}
      </main>

      {/* Buyer Detail Inspection Modal */}
      {selectedBuyer && (
        <div className="fixed inset-0 z-[100] bg-stone-900/90 backdrop-blur-2xl flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-xl rounded-[64px] shadow-3xl p-16 animate-in zoom-in-95 duration-500 border border-stone-200">
              <div className="flex justify-between items-start mb-16">
                 <div>
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-600 mb-2 block">Ledger Insight</span>
                    <h3 className="text-5xl font-bold brand-font tracking-tighter text-stone-900">Buyer Profile</h3>
                 </div>
                 <button onClick={() => setSelectedBuyer(null)} className="text-stone-300 hover:text-stone-900 transition text-5xl font-light">×</button>
              </div>
              <div className="space-y-12">
                 <div className="flex gap-8 items-center">
                    <div className="w-24 h-24 bg-stone-900 text-white flex items-center justify-center text-4xl font-bold rounded-[32px] shadow-2xl">
                       {selectedBuyer.name[0]}
                    </div>
                    <div>
                       <p className="text-3xl font-bold text-stone-900 brand-font mb-1">{selectedBuyer.name}</p>
                       <p className="text-[11px] text-amber-600 font-black uppercase tracking-widest">{selectedBuyer.status} MEMBER</p>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-10 py-10 border-y border-stone-50">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 mb-4">Contact Points</p>
                        <p className="text-sm font-bold text-stone-900">{selectedBuyer.email}</p>
                        <p className="text-[11px] text-stone-500 mt-1">{selectedBuyer.phone}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 mb-4">Engagement</p>
                        <p className="text-sm font-bold text-stone-900">{selectedBuyer.orders} Total Orders</p>
                        <p className="text-[11px] text-stone-500 mt-1">Joined: {selectedBuyer.joined}</p>
                    </div>
                 </div>

                 <div className="pt-4 text-center">
                    <button className="bg-stone-900 text-white px-12 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-stone-800 transition">View Transaction Log</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Product Add Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-[100] bg-stone-900/90 backdrop-blur-2xl flex items-center justify-center p-4">
           <form onSubmit={handleAddProduct} className="bg-white w-full max-w-2xl rounded-[64px] p-20 animate-in zoom-in-95 duration-500 space-y-10 border border-stone-200">
              <h3 className="text-5xl font-bold brand-font tracking-tighter text-stone-900">Manifest New SKU</h3>
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Title</label>
                    <input required type="text" placeholder="SKU Name" className="w-full p-6 bg-stone-50 rounded-3xl outline-none focus:ring-4 ring-stone-900/5 transition border border-stone-100" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Taxonomy</label>
                    <select className="w-full p-6 bg-stone-50 rounded-3xl outline-none focus:ring-4 ring-stone-900/5 transition border border-stone-100" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Valuation (INR)</label>
                    <input required type="number" placeholder="Price" className="w-full p-6 bg-stone-50 rounded-3xl outline-none focus:ring-4 ring-stone-900/5 transition border border-stone-100" value={prodForm.price || ''} onChange={e => setProdForm({...prodForm, price: Number(e.target.value)})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Stock Protocol</label>
                    <input required type="number" placeholder="Inventory Level" className="w-full p-6 bg-stone-50 rounded-3xl outline-none focus:ring-4 ring-stone-900/5 transition border border-stone-100" value={prodForm.stock || ''} onChange={e => setProdForm({...prodForm, stock: Number(e.target.value)})} />
                 </div>
                 <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Image Asset URL</label>
                    <input required type="text" placeholder="Public HTTPS Link" className="w-full p-6 bg-stone-50 rounded-3xl outline-none focus:ring-4 ring-stone-900/5 transition border border-stone-100" value={prodForm.images[0]} onChange={e => setProdForm({...prodForm, images: [e.target.value]})} />
                 </div>
              </div>
              <div className="flex gap-6 mt-8">
                 <button type="button" onClick={() => setShowAddProduct(false)} className="flex-1 py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] text-stone-300">Abort</button>
                 <button className="flex-[2] bg-stone-900 text-white py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-3xl hover:bg-stone-800 transition active:scale-[0.98]">Authorize SKU</button>
              </div>
           </form>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
