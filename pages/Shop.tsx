
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

const Shop: React.FC = () => {
  const { searchQuery, categories, products } = useStore();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState(10000);
  const [sortBy, setSortBy] = useState('Featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    result = result.filter(p => p.price <= priceRange);
    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    return result;
  }, [selectedCategory, priceRange, sortBy, searchQuery, products]);

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs uppercase font-black tracking-[0.2em] text-stone-900 mb-6">Collections</h3>
        <div className="flex flex-wrap gap-2 md:flex-col md:gap-2">
          {['All', ...categories].map(cat => (
            <button 
              key={cat}
              onClick={() => { setSelectedCategory(cat); setShowMobileFilters(false); }}
              className={`px-4 py-2 md:px-0 md:py-1 text-xs md:text-sm rounded-full md:rounded-none border md:border-0 transition-all ${selectedCategory === cat ? 'bg-stone-900 text-white border-stone-900 font-bold' : 'text-stone-500 bg-white border-stone-200 hover:text-stone-900'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs uppercase font-black tracking-[0.2em] text-stone-900 mb-6">Budget (₹{priceRange.toLocaleString()})</h3>
        <input 
          type="range" min="0" max="10000" step="500" value={priceRange} 
          onChange={(e) => setPriceRange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 space-y-8 shrink-0 border-r border-stone-100 pr-8">
          <FilterContent />
        </aside>

        <main className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-4xl brand-font tracking-tighter">Catalog</h1>
            <div className="flex gap-2">
               <button 
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 bg-white border border-stone-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="2" y1="14" x2="6" y2="14"/><line x1="10" y1="8" x2="14" y2="8"/><line x1="18" y1="16" x2="22" y2="16"/></svg>
                 Filters
               </button>
               <select 
                value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-stone-200 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none shadow-sm cursor-pointer"
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[40px] border border-stone-100">
               <p className="brand-font text-2xl text-stone-300">No matches found.</p>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-10 animate-in slide-in-from-bottom duration-300 shadow-2xl">
             <div className="w-12 h-1.5 bg-stone-100 rounded-full mx-auto mb-8"></div>
             <FilterContent />
             <button onClick={() => setShowMobileFilters(false)} className="w-full bg-stone-900 text-white py-5 rounded-2xl mt-12 font-black uppercase tracking-widest text-[11px] shadow-2xl">Apply Filters</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
