
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
  
  // Logistics states
  const [pincode, setPincode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

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

  const handleCheckDelivery = () => {
    if (pincode.length !== 6) return;
    setIsCheckingPincode(true);
    setTimeout(() => {
       const days = Math.floor(Math.random() * 4) + 2;
       setDeliveryEstimate(`Delivery by ${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`);
       setIsCheckingPincode(false);
    }, 1200);
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl brand-font mb-4">Product Not Found</h2>
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
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-stone-100 shadow-2xl border border-stone-200">
            <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover transition duration-700 hover:scale-105" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-24 shrink-0 rounded-xl overflow-hidden border-2 transition ${selectedImage === i ? 'border-stone-900 shadow-xl' : 'border-transparent'}`}>
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-start">
              <div className="max-w-[80%]">
                <span className="text-[10px] text-stone-400 uppercase font-black tracking-[0.3em] mb-3 block">{product.category}</span>
                <h1 className="text-5xl font-bold brand-font text-stone-900 tracking-tighter leading-tight">{product.name}</h1>
              </div>
              <button onClick={() => toggleWishlist(product.id)} className={`p-4 rounded-full shadow-xl transition ${isWishlisted ? 'bg-amber-50 text-amber-600' : 'bg-white text-stone-400 hover:text-stone-900'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </button>
            </div>
            
            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-4xl font-black text-stone-900 tracking-tighter">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <span className="text-stone-300 line-through text-xl font-light">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
          </div>

          <p className="text-stone-500 leading-relaxed font-light text-lg">{product.description}</p>

          <div className="bg-stone-50 p-8 rounded-[32px] border border-stone-100 space-y-6">
             <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-stone-900">
                <span className="w-8 h-[1px] bg-stone-900"></span> Check Logistics
             </div>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="Enter Pincode" 
                  className="flex-1 bg-white border border-stone-100 p-4 rounded-2xl outline-none focus:border-stone-900 transition text-sm font-bold uppercase"
                  value={pincode}
                  onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                />
                <button 
                  onClick={handleCheckDelivery}
                  disabled={pincode.length !== 6 || isCheckingPincode}
                  className="bg-stone-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl disabled:opacity-50"
                >
                  {isCheckingPincode ? '...' : 'Check'}
                </button>
             </div>
             {deliveryEstimate && (
               <div className="flex items-center gap-2 text-emerald-600 animate-fade-in">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">{deliveryEstimate}</span>
               </div>
             )}
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`min-w-[64px] px-6 py-4 border-2 rounded-2xl transition-all font-bold text-xs uppercase ${selectedSize === size ? 'border-stone-900 bg-stone-900 text-white shadow-2xl' : 'border-stone-100 hover:border-stone-300 bg-white'}`}>
                  {size}
                </button>
              ))}
            </div>
            <button onClick={handleAddToCart} className={`w-full py-6 rounded-[32px] font-black uppercase tracking-[0.4em] text-[11px] transition-all shadow-3xl ${added ? 'bg-emerald-600 text-white' : 'bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.98]'}`}>
              {added ? 'Secured in Bag' : 'Add to Collection'}
            </button>
          </div>
        </div>
      </div>

      <section className="mt-32 py-24 border-t border-stone-100">
         <div className="max-w-4xl">
            <h2 className="text-5xl brand-font mb-16 tracking-tighter">Buyer Feedback</h2>
            <div className="space-y-12">
               {product.reviews && product.reviews.length > 0 ? (
                 product.reviews.map(rev => (
                   <div key={rev.id} className="p-12 bg-white border border-stone-100 rounded-[48px] shadow-sm">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <p className="text-xl font-bold text-stone-900 brand-font">{rev.userName}</p>
                            <p className="text-[9px] text-stone-400 font-black uppercase tracking-widest">{rev.date}</p>
                         </div>
                         <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={i < rev.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            ))}
                         </div>
                      </div>
                      <p className="text-lg text-stone-600 font-light leading-relaxed italic">"{rev.comment}"</p>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-20 bg-stone-50 rounded-[48px] border border-dashed border-stone-200">
                    <p className="text-stone-400 italic brand-font text-2xl">No reviews yet. Be the first to share your experience.</p>
                 </div>
               )}
            </div>
         </div>
      </section>
    </div>
  );
};

export default ProductDetail;
