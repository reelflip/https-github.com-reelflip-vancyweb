
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

const Shop: React.FC = () => {
  const { searchQuery, categories, products } = useStore();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState(50000);
  const [sortBy, setSortBy] = useState('Featured');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'All' && selectedCategory !== 'New Arrivals') {
      result = result.filter(p => p.category === selectedCategory);
    } else if (selectedCategory === 'New Arrivals') {
      result = result.filter(p => p.isNew);
    }

    // Search Query Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q)
      );
    }

    // Price Filter
    result = result.filter(p => p.price <= priceRange);

    // Sorting
    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'Rating') result.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'Newest') result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    return result;
  }, [selectedCategory, priceRange, sortBy, searchQuery, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-64 space-y-8 shrink-0">
          <div>
            <h3 className="text-xs uppercase font-bold tracking-widest mb-4">Collections</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedCategory('All')}
                className={`block w-full text-left text-sm py-1 transition ${selectedCategory === 'All' ? 'text-stone-900 font-bold' : 'text-stone-500 hover:text-stone-900'}`}
              >
                All Collections
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left text-sm py-1 transition ${selectedCategory === cat ? 'text-stone-900 font-bold' : 'text-stone-500 hover:text-stone-900'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase font-bold tracking-widest mb-4">Max Budget (₹{priceRange.toLocaleString()})</h3>
            <input 
              type="range" 
              min="0" 
              max="10000" 
              step="500"
              value={priceRange > 10000 ? 10000 : priceRange} 
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-2 font-bold uppercase tracking-widest">
              <span>₹0</span>
              <span>₹10,000+</span>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h1 className="text-2xl font-bold brand-font">
                {searchQuery ? `Results for "${searchQuery}"` : selectedCategory} 
                <span className="text-sm font-normal text-stone-400 font-sans ml-2">({filteredProducts.length} items)</span>
              </h1>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="text-xs text-stone-400 uppercase font-bold tracking-widest whitespace-nowrap">Sort:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-stone-50 border border-stone-200 text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer w-full sm:w-48"
              >
                <option>Featured</option>
                <option>Newest</option>
                <option>Rating</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-stone-50 rounded-3xl border border-stone-100">
              <h2 className="text-xl font-bold text-stone-800 brand-font">Empty Collection</h2>
              <p className="text-stone-500 mt-2 max-w-xs mx-auto text-sm font-light">No items match your criteria in this collection.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setPriceRange(50000); }}
                className="mt-8 bg-stone-900 text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-stone-800 transition"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
