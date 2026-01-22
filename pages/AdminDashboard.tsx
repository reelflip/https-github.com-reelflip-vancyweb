
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
  const [newCat, setNewCat] = useState('');
  
  const [prodForm, setProdForm] = useState<Omit<Product, 'id'>>({
    name: '', category: categories[0], price: 0, originalPrice: 0, description: '', images: [''], sizes: ['S','M','L','XL'], colors: ['Black'], rating: 5, reviewCount: 0, stock: 50, fabric: 'Supima Cotton'
  });

  const [couponForm, setCouponForm] = useState<Omit<Coupon, 'id'>>({
    code: '', discountType: 'percentage', value: 0, minSpend: 0, expiryDate: '', isActive: true
  });

  // Mock Buyers for UI representation
  const buyers: (User & { ltv: number, orders: number })[] = [
    { id: 'u1', name: 'Arjun Kumar', email: 'arjun@vancy.in', role: 'BUYER' as any, addresses: [], ltv: 12500, orders: 4 },
    { id: 'u2', name: 'Siddharth Roy', email: 'sid@gmail.com', role: 'BUYER' as any, addresses: [], ltv: 8900, orders: 2 },
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
CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, password_hash VARCHAR(255), role ENUM('BUYER', 'ADMIN'), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE addresses (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, label VARCHAR(50), street TEXT, city VARCHAR(50), zip VARCHAR(10), is_default BOOLEAN, FOREIGN KEY (user_id) REFERENCES users(id));
CREATE TABLE products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), category VARCHAR(100), price DECIMAL(10,2), original_price DECIMAL(10,2), description TEXT, stock INT, fabric VARCHAR(100));
CREATE TABLE orders (id VARCHAR(20) PRIMARY KEY, user_id INT, total DECIMAL(10,2), status VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id));
CREATE TABLE order_items (id INT AUTO_INCREMENT PRIMARY KEY, order_id VARCHAR(20), product_id INT, quantity INT, size VARCHAR(10), color VARCHAR(50), FOREIGN KEY (order_id) REFERENCES orders(id));
CREATE TABLE reviews (id INT AUTO_INCREMENT PRIMARY KEY, product_id INT, user_name VARCHAR(100), rating INT, comment TEXT, date VARCHAR(20), FOREIGN KEY (product_id) REFERENCES products(id));
CREATE TABLE coupons (id INT AUTO_INCREMENT PRIMARY KEY, code VARCHAR(50) UNIQUE, type VARCHAR(20), value DECIMAL(10,2), min_spend DECIMAL(10,2), expiry VARCHAR(50), is_active BOOLEAN);
  `.trim();

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <aside className="w-full lg:w-72 bg-white border-r border-stone-100 p-8 flex flex-col gap-2">
        <div className="mb-12">
          <h1 className="text-3xl brand-font text-stone-900 tracking-tighter">VANCY CMS</h1>
          <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-stone-400 mt-2">Executive Access</p>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { id: 'stats', label: 'Overview', icon: '📊' },
            { id: 'inventory', label: 'Products', icon: '👕' },
            { id: 'categories', label: 'Categories', icon: '🏷️' },
            { id: 'orders', label: 'Orders', icon: '📦' },
            { id: 'buyers', label: 'Buyers', icon: '👥' },
            { id: 'coupons', label: 'Offers', icon: '🎟️' },
            { id: 'infrastructure', label: 'Database', icon: '🚀' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-[10px] font-bold uppercase tracking-[0.2em] ${activeTab === item.id ? 'bg-stone-900 text-white shadow-xl' : 'text-stone-400 hover:bg-stone-50'}`}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 lg:p-12 bg-stone-50/30 overflow-y-auto">
        
        {activeTab === 'stats' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <header><h2 className="text-4xl brand-font">Market Insight</h2></header>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {[
                 { label: 'Revenue', val: `₹${(allOrders.reduce((a,b)=>a+b.total,0)/1000).toFixed(1)}k` },
                 { label: 'Orders', val: allOrders.length },
                 { label: 'SKUs', val: products.length },
                 { label: 'Coupons', val: coupons.length }
               ].map((s, i) => (
                 <div key={i} className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
                    <span className="text-[9px] uppercase font-black text-stone-300 tracking-widest mb-4 block">{s.label}</span>
                    <h3 className="text-4xl font-bold text-stone-900">{s.val}</h3>
                 </div>
               ))}
            </div>
            <div className="bg-white p-10 rounded-[40px] border border-stone-100 shadow-sm">
               <h4 className="text-xl font-bold brand-font mb-10">Sales Velocity</h4>
               <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8f8f8" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#bbb'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#bbb'}} />
                      <Tooltip cursor={{fill: '#fcfcfc'}} />
                      <Bar dataKey="sales" fill="#1c1917" radius={[12, 12, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-8">
            <header className="flex justify-between items-center">
               <h2 className="text-4xl brand-font">Inventory Manager</h2>
               <button onClick={() => setShowAddProduct(true)} className="bg-stone-900 text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest">+ New Product</button>
            </header>
            <div className="bg-white rounded-[40px] border border-stone-100 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-stone-100">
                     <tr className="text-[9px] font-black uppercase tracking-widest text-stone-400">
                        <th className="px-8 py-6">Product</th>
                        <th className="px-8 py-6">Category</th>
                        <th className="px-8 py-6">Price</th>
                        <th className="px-8 py-6">Stock</th>
                        <th className="px-8 py-6 text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {products.map(p => (
                       <tr key={p.id} className="border-b border-stone-50 hover:bg-stone-50/50">
                          <td className="px-8 py-6 flex items-center gap-4">
                             <img src={p.images[0]} className="w-10 h-10 object-cover rounded-lg" alt="" />
                             <span className="font-bold text-stone-900">{p.name}</span>
                          </td>
                          <td className="px-8 py-6 text-xs text-stone-400">{p.category}</td>
                          <td className="px-8 py-6 font-bold">₹{p.price}</td>
                          <td className="px-8 py-6 text-xs">{p.stock} units</td>
                          <td className="px-8 py-6 text-right">
                             <button onClick={() => deleteProduct(p.id)} className="text-red-400 hover:text-red-600 transition">Delete</button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'buyers' && (
          <div className="space-y-8">
            <header><h2 className="text-4xl brand-font">Buyer Ledger</h2></header>
            <div className="bg-white rounded-[40px] border border-stone-100 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-stone-100">
                     <tr className="text-[9px] font-black uppercase tracking-widest text-stone-400">
                        <th className="px-10 py-8">Identity</th>
                        <th className="px-10 py-8">Email</th>
                        <th className="px-10 py-8">Orders</th>
                        <th className="px-10 py-8">LTV (Spend)</th>
                        <th className="px-10 py-8 text-right">Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {buyers.map(b => (
                       <tr key={b.id} className="border-b border-stone-50 hover:bg-stone-50 transition">
                          <td className="px-10 py-8 font-bold text-stone-900">{b.name}</td>
                          <td className="px-10 py-8 text-xs text-stone-400">{b.email}</td>
                          <td className="px-10 py-8 font-medium">{b.orders}</td>
                          <td className="px-10 py-8 font-bold text-emerald-700">₹{b.ltv.toLocaleString()}</td>
                          <td className="px-10 py-8 text-right">
                             <span className="bg-green-100 text-green-700 text-[8px] font-black uppercase px-3 py-1 rounded-full">Active</span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="space-y-8">
            <header className="flex justify-between items-center">
               <h2 className="text-4xl brand-font">Promotional Engine</h2>
               <button onClick={() => setShowAddCoupon(true)} className="bg-stone-900 text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest">+ Create Offer</button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {coupons.map(c => (
                 <div key={c.id} className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-stone-900 flex items-center justify-center text-white font-bold text-lg -mr-4 -mt-4 transition-all group-hover:scale-110">
                       {c.discountType === 'percentage' ? '%' : '₹'}
                    </div>
                    <h3 className="text-2xl font-black text-stone-900 mb-2 uppercase tracking-tighter">{c.code}</h3>
                    <p className="text-xs text-stone-400 mb-6">{c.value}{c.discountType === 'percentage' ? '% OFF' : ' INR OFF'} | Min Spend: ₹{c.minSpend}</p>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold uppercase text-stone-300">Expires: {c.expiryDate}</span>
                       <button onClick={() => deleteCoupon(c.id)} className="text-red-400 text-[10px] font-black uppercase hover:underline">Revoke</button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'infrastructure' && (
          <div className="space-y-12">
            <header>
               <h2 className="text-4xl brand-font">Database Architect</h2>
               <p className="text-stone-500 font-light mt-2">Initialize your production MySQL server with this schema.</p>
            </header>
            <div className="bg-stone-900 text-white p-12 rounded-[56px] shadow-2xl relative group">
               <button onClick={() => { navigator.clipboard.writeText(sqlSchema); alert('SQL Copied!'); }} className="absolute top-8 right-8 bg-white/10 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition">Copy Schema</button>
               <pre className="font-mono text-[11px] leading-relaxed text-amber-200 overflow-x-auto p-4 bg-white/5 rounded-3xl border border-white/10">
                  {sqlSchema}
               </pre>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="bg-white p-10 rounded-[48px] border border-stone-100">
                  <h3 className="text-xl font-bold brand-font mb-6">Hostinger Sync Guide</h3>
                  <div className="space-y-6">
                     {[
                       { step: '01', title: 'hPanel MySQL', desc: 'Create a new database and user in Hostinger Databases section.' },
                       { step: '02', title: 'Import Schema', desc: 'Open phpMyAdmin and execute the SQL architect script.' },
                       { step: '03', title: 'REST API Bridge', desc: 'Host a simple PHP/Node.js script to handle frontend JSON requests.' }
                     ].map(s => (
                       <div key={s.step} className="flex gap-4">
                          <span className="text-xs font-black text-amber-500">{s.step}</span>
                          <div>
                             <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">{s.title}</h4>
                             <p className="text-[10px] text-stone-400 leading-relaxed">{s.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Add Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4">
           <form onSubmit={handleAddProduct} className="bg-white w-full max-w-2xl rounded-[64px] p-16 animate-in zoom-in-95 space-y-8">
              <h3 className="text-4xl brand-font tracking-tighter">Manifest New SKU</h3>
              <div className="grid grid-cols-2 gap-6">
                 <input required type="text" placeholder="Product Name" className="p-5 bg-stone-50 rounded-2xl outline-none" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                 <select className="p-5 bg-stone-50 rounded-2xl outline-none" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <input required type="number" placeholder="Price (INR)" className="p-5 bg-stone-50 rounded-2xl outline-none" value={prodForm.price || ''} onChange={e => setProdForm({...prodForm, price: Number(e.target.value)})} />
                 <input required type="number" placeholder="Stock Level" className="p-5 bg-stone-50 rounded-2xl outline-none" value={prodForm.stock || ''} onChange={e => setProdForm({...prodForm, stock: Number(e.target.value)})} />
                 <input required type="text" placeholder="Image URL" className="col-span-2 p-5 bg-stone-50 rounded-2xl outline-none" value={prodForm.images[0]} onChange={e => setProdForm({...prodForm, images: [e.target.value]})} />
                 <textarea required placeholder="Description" className="col-span-2 p-5 bg-stone-50 rounded-2xl outline-none" rows={3} value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} />
              </div>
              <div className="flex gap-4">
                 <button type="button" onClick={() => setShowAddProduct(false)} className="flex-1 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-stone-400">Cancel</button>
                 <button className="flex-[2] bg-stone-900 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl">Authorize SKU</button>
              </div>
           </form>
        </div>
      )}

      {/* Coupon Add Modal */}
      {showAddCoupon && (
        <div className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4">
           <form onSubmit={handleAddCoupon} className="bg-white w-full max-w-xl rounded-[64px] p-16 animate-in zoom-in-95 space-y-8">
              <h3 className="text-4xl brand-font tracking-tighter">Create Offer</h3>
              <div className="grid grid-cols-2 gap-6">
                 <input required type="text" placeholder="Promo Code (e.g. FESTIVE20)" className="col-span-2 p-5 bg-stone-50 rounded-2xl outline-none uppercase font-bold" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} />
                 <select className="p-5 bg-stone-50 rounded-2xl outline-none" value={couponForm.discountType} onChange={e => setCouponForm({...couponForm, discountType: e.target.value as any})}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (INR)</option>
                 </select>
                 <input required type="number" placeholder="Discount Value" className="p-5 bg-stone-50 rounded-2xl outline-none" value={couponForm.value || ''} onChange={e => setCouponForm({...couponForm, value: Number(e.target.value)})} />
                 <input required type="number" placeholder="Min Spend (INR)" className="p-5 bg-stone-50 rounded-2xl outline-none" value={couponForm.minSpend || ''} onChange={e => setCouponForm({...couponForm, minSpend: Number(e.target.value)})} />
                 <input required type="date" className="p-5 bg-stone-50 rounded-2xl outline-none text-xs" value={couponForm.expiryDate} onChange={e => setCouponForm({...couponForm, expiryDate: e.target.value})} />
              </div>
              <div className="flex gap-4">
                 <button type="button" onClick={() => setShowAddCoupon(false)} className="flex-1 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-stone-400">Cancel</button>
                 <button className="flex-[2] bg-stone-900 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl">Launch Offer</button>
              </div>
           </form>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
