
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, toggleWishlist, wishlist, user, addReview } = useStore();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);
  
  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0]);
      setSelectedImage(0);
    }
    window.scrollTo(0, 0);
  }, [product, id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl brand-font mb-4">Product Not Found</h2>
        <p className="text-stone-500 mb-8 font-light">The item you're looking for might have been moved or is out of stock.</p>
        <button onClick={() => navigate('/shop')} className="bg-stone-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest shadow-xl">Back to Shop</button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }
    addReview(product.id, {
      productId: product.id,
      userName: user.name,
      rating: reviewRating,
      comment: reviewComment
    });
    setReviewComment('');
  };

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100">
            <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover transition duration-700 hover:scale-105" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-24 shrink-0 rounded-lg overflow-hidden border-2 transition ${selectedImage === i ? 'border-stone-900 shadow-lg' : 'border-transparent'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-stone-400 uppercase font-bold tracking-widest mb-2 block">{product.category}</span>
                <h1 className="text-4xl font-bold brand-font text-stone-900">{product.name}</h1>
              </div>
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-full shadow-md transition ${isWishlisted ? 'bg-amber-50 text-amber-600' : 'bg-stone-100 text-stone-400'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </button>
            </div>
            
            <div className="mt-4 flex items-center gap-4">
              <span className="text-3xl font-bold text-stone-900">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <span className="text-stone-400 line-through text-lg">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1 mt-4 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ))}
              <span className="text-stone-500 text-sm ml-2">{product.rating} ({product.reviewCount} reviews)</span>
            </div>
          </div>

          <p className="text-stone-600 leading-relaxed font-light">{product.description}</p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs uppercase font-bold tracking-widest mb-3 flex justify-between">
                Select Size <span className="text-stone-400 normal-case font-normal underline cursor-pointer">Size Guide</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[50px] px-4 py-2 border rounded-lg transition-all ${selectedSize === size ? 'border-stone-900 bg-stone-900 text-white shadow-lg' : 'border-stone-200 hover:border-stone-900'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase font-bold tracking-widest mb-3">Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-full text-xs font-medium transition-all ${selectedColor === color ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-600 hover:bg-stone-100'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              className={`flex-1 py-4 rounded-full font-bold uppercase tracking-widest transition-all shadow-xl ${added ? 'bg-green-600 text-white' : 'bg-stone-900 text-white hover:bg-stone-800'}`}
            >
              {added ? 'Added to Bag' : 'Add to Bag'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <span className="text-xs font-bold text-stone-600 uppercase tracking-tighter">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22l-5-5-5 5"/><path d="M17 2l-5 5-5-5"/></svg>
              </div>
              <span className="text-xs font-bold text-stone-600 uppercase tracking-tighter">Premium Fabric: {product.fabric}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-24 py-12 border-t border-stone-100">
         <div className="max-w-4xl">
            <h2 className="text-3xl brand-font mb-10">Authentic Reviews</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
               <div className="space-y-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map(rev => (
                      <div key={rev.id} className="p-8 bg-white border border-stone-100 rounded-3xl shadow-sm">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <p className="font-bold text-stone-900">{rev.userName}</p>
                               <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{rev.date}</p>
                            </div>
                            <div className="flex text-amber-500">
                               {[...Array(5)].map((_, i) => (
                                 <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={i < rev.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                               ))}
                            </div>
                         </div>
                         <p className="text-sm text-stone-600 font-light leading-relaxed">"{rev.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-400 italic">No reviews yet. Be the first to share your experience.</p>
                  )}
               </div>

               <div className="bg-stone-50 p-10 rounded-[40px] border border-stone-100 h-fit">
                  <h3 className="text-xl font-bold brand-font mb-6">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Your Rating</label>
                        <div className="flex gap-2">
                           {[1, 2, 3, 4, 5].map(star => (
                             <button 
                               key={star} 
                               type="button" 
                               onClick={() => setReviewRating(star)}
                               className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${reviewRating >= star ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-stone-300 border border-stone-100'}`}
                             >
                               {star}
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Feedback</label>
                        <textarea 
                           required
                           rows={4}
                           placeholder="How does it feel? How's the fit?"
                           className="w-full p-6 bg-white border border-stone-100 rounded-2xl outline-none focus:ring-1 focus:ring-stone-900 text-sm"
                           value={reviewComment}
                           onChange={e => setReviewComment(e.target.value)}
                        />
                     </div>
                     <button className="w-full bg-stone-900 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-stone-800 transition">Publish Review</button>
                  </form>
               </div>
            </div>
         </div>
      </section>

      {/* Related */}
      <section className="mt-24">
        <h2 className="text-2xl brand-font mb-10">Complete the Look</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {related.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
