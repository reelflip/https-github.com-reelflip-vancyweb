
import React from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  const discountPerc = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition z-10 ${isWishlisted ? 'bg-amber-50 text-amber-600' : 'bg-white text-stone-400 hover:text-stone-900'}`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </button>
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-black text-white text-[10px] uppercase font-bold px-2 py-1 tracking-widest z-10">New</span>
        )}
        {discountPerc > 0 && (
          <span className="absolute bottom-4 left-4 bg-green-600 text-white text-[9px] uppercase font-black px-2 py-1 tracking-widest z-10 rounded shadow-lg">
            {discountPerc}% OFF
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-widest mb-1 block">{product.category}</span>
          <Link to={`/product/${product.id}`} className="font-bold text-stone-900 group-hover:text-amber-700 transition line-clamp-1">{product.name}</Link>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-bold text-stone-900">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-stone-400 line-through text-xs">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
