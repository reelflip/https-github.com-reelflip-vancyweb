
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, OrderStatus, Order } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { categories, addCategory, deleteCategory, products, addProduct, deleteProduct, updateProduct, allOrders, updateOrderStatus, storeSettings, updateStoreSettings } = useStore();
  const [activeTab, setActiveTab] = useState<'inventory' | 'categories' | 'orders' | 'settings' | 'stats' | 'integrations'>('stats');
  
  // Form & UI Control
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newPartner, setNewPartner] = useState('');

  // Rich Variant Helpers
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Discount Calculation State
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(0);

  // Local state for the product form
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '', price: 0, originalPrice: 0, category: categories[0] || '', description: '',
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80'],
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Navy'], stock: 20, fabric: 'Supima Cotton', rating: 5, reviewCount: 0
  });

  // Effect to sync sale price based on MRP and Discount
  useEffect(() => {
    if (discountValue > 0 && productForm.originalPrice) {
      let finalPrice = productForm.originalPrice;
      if (discountType === 'percent') {
        finalPrice = productForm.originalPrice - (productForm.originalPrice * (discountValue / 100));
      } else {
        finalPrice = productForm.originalPrice - discountValue;
      }
      setProductForm(prev => ({ ...prev, price: Math.max(0, Math.round(finalPrice)) }));
    }
  }, [discountType, discountValue, productForm.originalPrice]);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      updateProduct(editingProductId, productForm);
      setEditingProductId(null);
    } else {
      addProduct(productForm as any);
    }
    setShowAddProductForm(false);
    resetForm();
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '', price: 0, originalPrice: 0, category: categories[0], description: '',
      images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80'],
      sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Navy'], stock: 20, fabric: 'Supima Cotton', rating: 5, reviewCount: 0
    });
    setDiscountValue(0);
  };

  const startEdit = (p: Product) => {
    setProductForm(p);
    setEditingProductId(p.id);
    // Attempt to reverse calculate discount for UI
    if (p.originalPrice > p.price) {
      const diff = p.originalPrice - p.price;
      const perc = Math.round((diff / p.originalPrice) * 100);
      setDiscountType('percent');
      setDiscountValue(perc);
    } else {
      setDiscountValue(0);
    }
    setShowAddProductForm(true);
  };

  const addImage = () => {
    if (newImageUrl && !productForm.images?.includes(newImageUrl)) {
      setProductForm(prev => ({ ...prev, images: [...(prev.images || []), newImageUrl] }));
      setNewImageUrl('');
    }
  };

  const removeImage = (url: string) => {
    setProductForm(prev => ({ ...prev, images: prev.images?.filter(i => i !== url) }));
  };

  const addSizeTag = () => {
    if (newSize && !productForm.sizes?.includes(newSize)) {
      setProductForm(prev => ({ ...prev, sizes: [...(prev.sizes || []), newSize] }));
      setNewSize('');
    }
  };

  const addColorTag = () => {
    if (newColor && !productForm.colors?.includes(newColor)) {
      setProductForm(prev => ({ ...prev, colors: [...(prev.colors || []), newColor] }));
      setNewColor('');
    }
  };

  const removeTag = (type: 'sizes' | 'colors', val: string) => {
    setProductForm(prev => ({ ...prev, [type]: (prev[type] as string[])?.filter(v => v !== val) }));
  };

  const togglePaymentGateway = (gateway: string) => {
    const current = storeSettings.enabledPaymentGateways;
    const next = current.includes(gateway) 
      ? current.filter(g => g !== gateway) 
      : [...current, gateway];
    updateStoreSettings({ enabledPaymentGateways: next });
  };

  const addDeliveryPartner = () => {
    if (newPartner.trim() && !storeSettings.deliveryPartners.includes(newPartner)) {
      updateStoreSettings({ deliveryPartners: [...storeSettings.deliveryPartners, newPartner.trim()] });
      setNewPartner('');
    }
  };

  const removeDeliveryPartner = (partner: string) => {
    updateStoreSettings({ deliveryPartners: storeSettings.deliveryPartners.filter(p => p !== partner) });
  };

  const statsData = [
    { name: 'Mon', sales: 12000 }, { name: 'Tue', sales: 15000 }, { name: 'Wed', sales: 8000 },
    { name: 'Thu', sales: 22000 }, { name: 'Fri', sales: 19000 }, { name: 'Sat', sales: 28000 }, { name: 'Sun', sales: 31000 }
  ];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'Shipped': case 'In Transit': case 'Out for Delivery': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Awaiting Pickup': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Pending': return 'bg-stone-50 text-stone-600 border-stone-200';
      case 'Cancelled': case 'Refunded': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-stone-50 text-stone-900 border-stone-200';
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Sidebar - Premium White Design */}
      <aside className="w-full lg:w-72 bg-white border-r border-stone-100 p-8 flex flex-col gap-2">
        <div className="mb-12">
          <h1 className="text-3xl brand-font text-stone-900 tracking-tighter">VANCY <span className="text-[10px] font-bold text-amber-600 align-top ml-1">CMS</span></h1>
          <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-stone-400 mt-2">Executive Dashboard</p>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'stats', label: 'Overview', icon: '📊' },
            { id: 'inventory', label: 'Inventory', icon: '👕' },
            { id: 'categories', label: 'Taxonomy', icon: '🏷️' },
            { id: 'orders', label: 'Logistics', icon: '📦' },
            { id: 'settings', label: 'Config', icon: '⚙️' },
            { id: 'integrations', label: 'Integrations', icon: '🔌' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.2em] ${activeTab === item.id ? 'bg-stone-900 text-white shadow-xl translate-x-1' : 'text-stone-400 hover:bg-stone-50 hover:text-stone-900'}`}
            >
              <span className="text-lg opacity-80">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto bg-stone-50/30 relative">
        
        {/* STATS OVERVIEW */}
        {activeTab === 'stats' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <header>
              <h2 className="text-4xl brand-font tracking-tight text-stone-900">Vancy Pulse</h2>
              <p className="text-stone-500 font-light mt-2">Real-time performance metrics across all retail channels.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {[
                 { label: 'Gross Revenue', val: `₹${(allOrders.reduce((a,b)=>a+b.total,0)/1000).toFixed(1)}k`, sub: 'Current Period' },
                 { label: 'Total Orders', val: allOrders.length, sub: 'Lifetime volume' },
                 { label: 'Active SKUs', val: products.length, sub: 'In-stock variety' },
                 { label: 'Avg Order Val', val: `₹${allOrders.length ? Math.round(allOrders.reduce((a,b)=>a+b.total,0)/allOrders.length) : 0}`, sub: 'Unit average' }
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm hover:shadow-md transition group">
                    <span className="text-[9px] uppercase font-black text-stone-300 tracking-[0.3em] mb-4 block group-hover:text-amber-600 transition-colors">{stat.label}</span>
                    <h3 className="text-4xl font-bold text-stone-900 mb-1 tracking-tighter">{stat.val}</h3>
                    <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest">{stat.sub}</p>
                 </div>
               ))}
            </div>
            <div className="bg-white p-10 rounded-[40px] border border-stone-100 shadow-sm">
               <h4 className="text-xl font-bold brand-font mb-10">Revenue Trajectory</h4>
               <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8f8f8" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#bbb', fontWeight: 'bold'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#bbb', fontWeight: 'bold'}} />
                      <Tooltip cursor={{fill: '#fcfcfc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                      <Bar dataKey="sales" fill="#1c1917" radius={[12, 12, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        )}

        {/* INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h2 className="text-4xl brand-font tracking-tight text-stone-900">Inventory Matrix</h2>
                <p className="text-stone-500 font-light mt-1">Manage SKUs, variants, and product storytelling.</p>
              </div>
              <button 
                onClick={() => { setEditingProductId(null); resetForm(); setShowAddProductForm(!showAddProductForm); }}
                className="bg-stone-900 text-white px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl hover:bg-stone-800 transition-all flex items-center gap-3 active:scale-95"
              >
                {showAddProductForm ? 'Cancel Operation' : '+ Add New Style'}
              </button>
            </header>

            {showAddProductForm && (
              <section className="bg-white p-12 rounded-[48px] border border-stone-100 shadow-2xl animate-in slide-in-from-top-6 duration-500 mb-12">
                <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-12 border-b border-stone-50 pb-8 mb-4">
                    <h3 className="text-3xl brand-font">{editingProductId ? 'Confirm Evolution' : 'Assemble New Listing'}</h3>
                  </div>
                  
                  <div className="md:col-span-8 space-y-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 ml-1">Product Title</label>
                        <input required className="w-full p-5 bg-stone-50 rounded-2xl outline-none focus:border-stone-200 transition-all font-medium text-lg" placeholder="e.g. Supima Heritage Polo" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 ml-1">Category</label>
                          <select className="w-full p-5 bg-stone-50 rounded-2xl outline-none font-bold text-xs uppercase tracking-widest" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 ml-1">Fabric Detail</label>
                          <input className="w-full p-5 bg-stone-50 rounded-2xl outline-none" placeholder="100% Supima Cotton" value={productForm.fabric} onChange={e => setProductForm({...productForm, fabric: e.target.value})} />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 ml-1">Narrative Description (Rich Editor)</label>
                        <div className="border border-stone-100 rounded-3xl overflow-hidden bg-white shadow-sm">
                           <div className="bg-stone-50 p-3 border-b border-stone-100 flex gap-2">
                              <button type="button" className="p-2 hover:bg-stone-200 rounded-lg text-xs font-bold w-10">B</button>
                              <button type="button" className="p-2 hover:bg-stone-200 rounded-lg text-xs italic font-serif w-10">I</button>
                              <button type="button" className="p-2 hover:bg-stone-200 rounded-lg text-xs w-10">List</button>
                           </div>
                           <textarea required className="w-full p-6 bg-transparent outline-none min-h-[150px] resize-none text-stone-600 leading-relaxed text-sm" placeholder="Write the style story..." value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                        </div>
                     </div>
                  </div>

                  <div className="md:col-span-4 space-y-8 bg-stone-50/50 p-8 rounded-[40px] border border-stone-100">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 ml-1">MRP (Retail Price ₹)</label>
                        <input required type="number" className="w-full p-4 bg-white rounded-xl border border-stone-100 font-bold" value={productForm.originalPrice} onChange={e => setProductForm({...productForm, originalPrice: Number(e.target.value)})} />
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 ml-1">Discount Config</label>
                         <div className="flex bg-stone-100 rounded-xl p-1 mb-2">
                            <button 
                              type="button" 
                              onClick={() => setDiscountType('percent')}
                              className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${discountType === 'percent' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400'}`}
                            >
                              Percent (%)
                            </button>
                            <button 
                              type="button"
                              onClick={() => setDiscountType('fixed')}
                              className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${discountType === 'fixed' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400'}`}
                            >
                              Fixed (₹)
                            </button>
                         </div>
                         <input 
                           type="number" 
                           placeholder={discountType === 'percent' ? "e.g. 20" : "e.g. 500"} 
                           className="w-full p-4 bg-white rounded-xl border border-stone-100 font-bold" 
                           value={discountValue} 
                           onChange={e => setDiscountValue(Number(e.target.value))} 
                         />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 ml-1">Calculated Sale Price (₹)</label>
                        <input required type="number" className="w-full p-4 bg-amber-50 rounded-xl border border-amber-200 font-bold text-stone-900" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 ml-1">Stock Level</label>
                        <input required type="number" className="w-full p-4 bg-white rounded-xl border border-stone-100 text-stone-600 font-bold" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})} />
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Size Matrix</label>
                         <div className="flex flex-wrap gap-2">
                            {productForm.sizes?.map(s => (
                              <span key={s} className="bg-stone-900 text-white text-[9px] px-3 py-1.5 rounded-full font-bold flex items-center gap-2">
                                {s} <button type="button" onClick={() => removeTag('sizes', s)}>×</button>
                              </span>
                            ))}
                         </div>
                         <div className="flex gap-2">
                            <input placeholder="Add Size" className="flex-1 p-2 bg-white rounded-lg border border-stone-100 text-[10px]" value={newSize} onChange={e => setNewSize(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSizeTag())} />
                            <button type="button" onClick={addSizeTag} className="bg-stone-200 p-2 rounded-lg">+</button>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Color Palette</label>
                         <div className="flex flex-wrap gap-2">
                            {productForm.colors?.map(c => (
                              <span key={c} className="bg-stone-100 text-stone-800 text-[9px] px-3 py-1.5 rounded-full font-bold flex items-center gap-2">
                                {c} <button type="button" onClick={() => removeTag('colors', c)}>×</button>
                              </span>
                            ))}
                         </div>
                         <div className="flex gap-2">
                            <input placeholder="Add Color" className="flex-1 p-2 bg-white rounded-lg border border-stone-100 text-[10px]" value={newColor} onChange={e => setNewColor(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addColorTag())} />
                            <button type="button" onClick={addColorTag} className="bg-stone-200 p-2 rounded-lg">+</button>
                         </div>
                      </div>
                  </div>

                  <div className="md:col-span-12 space-y-6 pt-8 border-t border-stone-50">
                     <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 block">Style Assets (Gallery)</label>
                     <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
                        {productForm.images?.map((url, i) => (
                           <div key={i} className="relative aspect-[3/4] group rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
                              <img src={url} className="w-full h-full object-cover" alt="" />
                              <button type="button" onClick={() => removeImage(url)} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg">×</button>
                           </div>
                        ))}
                        <div className="aspect-[3/4] border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center bg-stone-50/50 p-4">
                           <input placeholder="Asset URL..." className="w-full p-2 bg-white rounded-lg border border-stone-100 text-[9px] mb-4" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} />
                           <button type="button" onClick={addImage} className="text-[9px] font-bold uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-1">Ingest Image</button>
                        </div>
                     </div>
                  </div>

                  <div className="md:col-span-12 pt-12 flex justify-end gap-6">
                     <button type="button" onClick={() => { setShowAddProductForm(false); resetForm(); }} className="px-10 py-4 font-bold uppercase tracking-widest text-[10px] text-stone-400 hover:text-stone-900">Discard</button>
                     <button type="submit" className="bg-stone-900 text-white px-16 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all">
                       {editingProductId ? 'Confirm Evolution' : 'Initialize Style'}
                     </button>
                  </div>
                </form>
              </section>
            )}

            <div className="bg-white rounded-[40px] border border-stone-100 overflow-hidden shadow-sm">
               <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-stone-100">
                    <tr className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400">
                      <th className="px-10 py-8">SKU Identifier</th>
                      <th className="px-10 py-8">Taxonomy</th>
                      <th className="px-10 py-8">Inventory</th>
                      <th className="px-10 py-8">MRP / Sale</th>
                      <th className="px-10 py-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {products.map(p => {
                      const discountPerc = p.originalPrice > p.price 
                        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) 
                        : 0;
                      return (
                        <tr key={p.id} className="hover:bg-stone-50/50 transition">
                          <td className="px-10 py-8 flex items-center gap-6">
                             <img src={p.images[0]} className="w-14 h-18 object-cover rounded-2xl shadow-sm" alt="" />
                             <div className="flex flex-col">
                                <p className="font-bold text-stone-900 brand-font text-lg">{p.name}</p>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">{p.fabric}</p>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">{p.category}</td>
                          <td className="px-10 py-8">
                             <span className={`text-[10px] font-bold uppercase tracking-widest ${p.stock < 10 ? 'text-red-500' : 'text-stone-600'}`}>{p.stock} units</span>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                   <span className="font-black text-stone-900">₹{p.price.toLocaleString()}</span>
                                   {discountPerc > 0 && <span className="text-[8px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">{discountPerc}% OFF</span>}
                                </div>
                                <span className="text-[9px] text-stone-400 line-through">₹{p.originalPrice.toLocaleString()}</span>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-right space-x-6">
                             <button onClick={() => startEdit(p)} className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-900 hover:underline">Modify</button>
                             <button onClick={() => deleteProduct(p.id)} className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:text-red-600 transition">Archive</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* LOGISTICS / ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-12 animate-in fade-in duration-500">
             <header>
               <h2 className="text-4xl brand-font tracking-tight text-stone-900">Consignment Control</h2>
               <p className="text-stone-500 font-light mt-2">Manage customer fulfillment and logistics status.</p>
             </header>

             <div className="bg-white rounded-[40px] border border-stone-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                   <thead className="bg-stone-50 border-b border-stone-100">
                      <tr className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400">
                         <th className="px-10 py-8">Manifest #</th>
                         <th className="px-10 py-8">Client</th>
                         <th className="px-10 py-8">Cargo</th>
                         <th className="px-10 py-8">Status</th>
                         <th className="px-10 py-8 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-stone-50">
                      {allOrders.map(o => (
                        <tr key={o.id} className="hover:bg-stone-50 transition">
                           <td className="px-10 py-8">
                              <p className="font-bold text-stone-900">#{o.id}</p>
                              <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">{o.date}</p>
                           </td>
                           <td className="px-10 py-8">
                              <p className="text-xs font-bold text-stone-700">{o.customerEmail}</p>
                           </td>
                           <td className="px-10 py-8">
                              <span className="text-[10px] font-bold uppercase tracking-widest bg-stone-100 px-3 py-1 rounded-full">{o.items.length} Units</span>
                           </td>
                           <td className="px-10 py-8">
                              <select 
                                value={o.status}
                                onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] border shadow-sm ${getStatusColor(o.status)}`}
                              >
                                 {['Pending', 'Payment Verified', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                           </td>
                           <td className="px-10 py-8 text-right">
                              <button onClick={() => setSelectedOrder(o)} className="bg-stone-900 text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 transition">Inspect</button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             
             {selectedOrder && (
               <div className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-xl rounded-[64px] shadow-2xl p-16 animate-in zoom-in-95">
                     <div className="flex justify-between items-start mb-12">
                        <h3 className="text-4xl brand-font tracking-tighter">Manifest #{selectedOrder.id}</h3>
                        <button onClick={() => setSelectedOrder(null)} className="text-stone-300 hover:text-stone-900 transition text-4xl">×</button>
                     </div>
                     <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                           <div>
                              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Client Auth</p>
                              <p className="font-bold text-sm">{selectedOrder.customerEmail}</p>
                           </div>
                           <div>
                              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Value</p>
                              <p className="font-bold text-xl text-stone-900 tracking-tighter">₹{selectedOrder.total.toLocaleString()}</p>
                           </div>
                        </div>
                        <div className="pt-8 border-t border-stone-50">
                           <p className="text-[10px] uppercase font-black text-stone-300 tracking-[0.4em] mb-6">Cargo Breakdown</p>
                           <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                              {selectedOrder.items.map((it, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                   <img src={it.product.images[0]} className="w-12 h-16 object-cover rounded-xl border border-stone-100" alt="" />
                                   <div className="flex-1">
                                      <p className="font-bold text-stone-900 text-sm">{it.product.name}</p>
                                      <p className="text-[9px] uppercase font-bold text-stone-400 tracking-widest">Qty: {it.quantity} | {it.selectedSize}</p>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                        <button className="w-full bg-stone-900 text-white py-5 rounded-3xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl mt-4">Print Waybill</button>
                     </div>
                  </div>
               </div>
             )}
          </div>
        )}

        {/* TAXONOMY / CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <header>
               <h2 className="text-4xl brand-font tracking-tight text-stone-900">Collection Taxonomy</h2>
               <p className="text-stone-500 font-light mt-2">Architect your product collections and hierarchies.</p>
            </header>

            <section className="bg-white p-12 rounded-[48px] border border-stone-100 shadow-sm flex gap-6">
               <input required className="flex-1 p-6 bg-stone-50 rounded-3xl outline-none font-bold uppercase tracking-[0.2em] text-xs" placeholder="New Collection Identity..." value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
               <button onClick={handleAddCategory} className="bg-stone-900 text-white px-12 rounded-3xl font-bold uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition">Authorize Taxonomy</button>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {categories.map(cat => (
                 <div key={cat} className="bg-white p-12 rounded-[40px] border border-stone-100 shadow-sm flex justify-between items-center group hover:shadow-xl transition-all">
                    <div>
                       <span className="text-[9px] uppercase font-black text-amber-600 tracking-[0.4em] mb-2 block">Taxon ID</span>
                       <p className="text-2xl font-bold brand-font tracking-tighter text-stone-900">{cat}</p>
                    </div>
                    <button onClick={() => deleteCategory(cat)} className="text-stone-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">Archive</button>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* INTEGRATIONS HUB */}
        {activeTab === 'integrations' && (
          <div className="space-y-12 animate-in fade-in duration-500">
             <header>
                <h2 className="text-4xl brand-font tracking-tight text-stone-900">API & Integration Hub</h2>
                <p className="text-stone-500 font-light mt-2">Bridge the gap between your storefront and global infrastructure.</p>
             </header>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-sm space-y-10">
                   <h3 className="text-2xl brand-font">Payment Gateways</h3>
                   <div className="space-y-8">
                      <div className="p-6 bg-stone-50 rounded-[32px] border border-stone-100 space-y-4">
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Razorpay Auth</span>
                         <input type="text" placeholder="Key ID" className="w-full p-4 bg-white rounded-xl border border-stone-100 text-xs font-mono outline-none" value={storeSettings.apiCredentials?.razorpay?.keyId} onChange={e => updateStoreSettings({ apiCredentials: { ...storeSettings.apiCredentials, razorpay: { ...storeSettings.apiCredentials.razorpay!, keyId: e.target.value } } })} />
                         <input type="password" placeholder="Key Secret" className="w-full p-4 bg-white rounded-xl border border-stone-100 text-xs font-mono outline-none" value={storeSettings.apiCredentials?.razorpay?.keySecret} onChange={e => updateStoreSettings({ apiCredentials: { ...storeSettings.apiCredentials, razorpay: { ...storeSettings.apiCredentials.razorpay!, keySecret: e.target.value } } })} />
                      </div>
                      <div className="p-6 bg-stone-50 rounded-[32px] border border-stone-100 space-y-4">
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Stripe Integration</span>
                         <input type="text" placeholder="Publishable Key" className="w-full p-4 bg-white rounded-xl border border-stone-100 text-xs font-mono outline-none" value={storeSettings.apiCredentials?.stripe?.publishableKey} onChange={e => updateStoreSettings({ apiCredentials: { ...storeSettings.apiCredentials, stripe: { ...storeSettings.apiCredentials.stripe!, publishableKey: e.target.value } } })} />
                         <input type="password" placeholder="Secret Key" className="w-full p-4 bg-white rounded-xl border border-stone-100 text-xs font-mono outline-none" value={storeSettings.apiCredentials?.stripe?.secretKey} onChange={e => updateStoreSettings({ apiCredentials: { ...storeSettings.apiCredentials, stripe: { ...storeSettings.apiCredentials.stripe!, secretKey: e.target.value } } })} />
                      </div>
                   </div>
                </div>

                <div className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-sm space-y-10">
                   <h3 className="text-2xl brand-font">Logistics Nodes</h3>
                   <div className="space-y-8">
                      <div className="p-6 bg-stone-50 rounded-[32px] border border-stone-100 space-y-4">
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Delhivery API</span>
                         <input type="text" placeholder="Auth Token" className="w-full p-4 bg-white rounded-xl border border-stone-100 text-xs font-mono outline-none" value={storeSettings.apiCredentials?.delhivery?.apiToken} onChange={e => updateStoreSettings({ apiCredentials: { ...storeSettings.apiCredentials, delhivery: { apiToken: e.target.value } } })} />
                      </div>
                      <div className="p-6 bg-stone-50 rounded-[32px] border border-stone-100 space-y-4">
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">BlueDart API</span>
                         <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Login ID" className="p-4 bg-white rounded-xl border border-stone-100 text-xs font-mono outline-none" value={storeSettings.apiCredentials?.bluedart?.loginId} onChange={e => updateStoreSettings({ apiCredentials: { ...storeSettings.apiCredentials, bluedart: { ...storeSettings.apiCredentials.bluedart!, loginId: e.target.value } } })} />
                            <input type="text" placeholder="License Key" className="p-4 bg-white rounded-xl border border-stone-100 text-xs font-mono outline-none" value={storeSettings.apiCredentials?.bluedart?.licenseKey} onChange={e => updateStoreSettings({ apiCredentials: { ...storeSettings.apiCredentials, bluedart: { ...storeSettings.apiCredentials.bluedart!, licenseKey: e.target.value } } })} />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-2 bg-stone-900 text-white p-12 rounded-[56px] space-y-12">
                   <div className="max-w-2xl">
                      <h3 className="text-4xl brand-font mb-4">The Implementation Protocol</h3>
                      <p className="text-stone-400 font-light leading-relaxed">Ensure you use Production keys for live transactions. Test mode should only be used for sandbox staging. All API communications are secured via TLS 1.3 protocol.</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      <div className="space-y-4">
                         <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-amber-500">01</span>
                         <h4 className="font-bold">Fetch Credentials</h4>
                         <p className="text-stone-400 text-[10px] uppercase font-medium tracking-widest leading-relaxed">Acquire keys from partner dashboards (Razorpay/Delhivery).</p>
                      </div>
                      <div className="space-y-4">
                         <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-amber-500">02</span>
                         <h4 className="font-bold">Define Endpoints</h4>
                         <p className="text-stone-400 text-[10px] uppercase font-medium tracking-widest leading-relaxed">Map your logistics partners to the corresponding taxons.</p>
                      </div>
                      <div className="space-y-4">
                         <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-amber-500">03</span>
                         <h4 className="font-bold">Sync Webhooks</h4>
                         <p className="text-stone-400 text-[10px] uppercase font-medium tracking-widest leading-relaxed">Set callback URLs to https://vancy.in/api/v1/sync</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* CONFIGURATION / SETTINGS */}
        {activeTab === 'settings' && (
           <div className="space-y-12 animate-in fade-in duration-500">
             <header>
                <h2 className="text-4xl brand-font tracking-tight text-stone-900">Global Store Configuration</h2>
                <p className="text-stone-500 font-light mt-2">Manage commercial policies and active modules.</p>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-white p-10 rounded-[40px] border border-stone-100 shadow-sm space-y-10">
                   <h3 className="text-2xl brand-font">Module Control</h3>
                   <div className="space-y-6">
                      {[
                        { id: 'cod', label: 'Cash on Delivery', desc: 'Manual collection protocol' },
                        { id: 'razorpay', label: 'Razorpay UPI', desc: 'Domestic digital gateway' },
                        { id: 'stripe', label: 'Stripe International', desc: 'Global currency support' }
                      ].map(gw => (
                        <div key={gw.id} className="flex justify-between items-center bg-stone-50 p-6 rounded-3xl border border-stone-100 hover:border-stone-900 transition-colors">
                           <div>
                              <span className="text-sm font-black text-stone-900 uppercase tracking-widest block">{gw.label}</span>
                              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{gw.desc}</span>
                           </div>
                           <button 
                             onClick={() => togglePaymentGateway(gw.id)}
                             className={`w-14 h-7 rounded-full transition-all relative ${storeSettings.enabledPaymentGateways.includes(gw.id) ? 'bg-stone-900' : 'bg-stone-200'}`}
                           >
                              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${storeSettings.enabledPaymentGateways.includes(gw.id) ? 'left-8' : 'left-1'}`}></div>
                           </button>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] border border-stone-100 shadow-sm space-y-10">
                   <h3 className="text-2xl brand-font">Logistics Nodes</h3>
                   <div className="space-y-6">
                      <div className="flex gap-4">
                         <input type="text" placeholder="Register New Node..." className="flex-1 p-5 bg-stone-50 border border-transparent focus:border-stone-100 rounded-2xl outline-none text-xs font-bold uppercase tracking-widest" value={newPartner} onChange={(e) => setNewPartner(e.target.value)} />
                         <button onClick={addDeliveryPartner} className="bg-stone-900 text-white px-8 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-stone-800 transition">Register</button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                         {storeSettings.deliveryPartners.map(p => (
                            <div key={p} className="flex justify-between items-center bg-white p-6 rounded-3xl border border-stone-100 shadow-sm group">
                               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-900">{p}</span>
                               <button onClick={() => removeDeliveryPartner(p)} className="text-stone-300 hover:text-red-500 transition-colors">Archive</button>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
           </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
