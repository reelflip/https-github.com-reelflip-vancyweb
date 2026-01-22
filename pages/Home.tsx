
import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../constants';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { getInstantLookbook } from '../services/geminiService';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=1920&q=80',
    subtitle: 'The Core Collection',
    title: 'Precision in Every Single Stitch.',
    description: 'Discover the world\'s finest Supima cotton essentials, engineered for the perfect silhouette.',
    cta: 'Shop New Arrivals',
    link: '/shop?category=Polo T-Shirts'
  },
  {
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1920&q=80',
    subtitle: 'Luxury Meets Comfort',
    title: 'Heritage Quality. Modern Fit.',
    description: 'We don\'t follow trends. We build icons. 500GSM heavyweight fleece for the ultimate embrace.',
    cta: 'Explore Hoodies',
    link: '/shop?category=Hoodies'
  },
  {
    image: 'https://images.unsplash.com/photo-1506443332154-41a3174ca3bf?auto=format&fit=crop&w=1920&q=80',
    subtitle: 'Limited Edition',
    title: 'The Blueprint of Men\'s Style.',
    description: 'Breathable, durable, and unmistakably Vancy. Tailored for the Indian lifestyle.',
    cta: 'View the Lookbook',
    link: '/shop'
  }
];

const Home: React.FC = () => {
  const { categories } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lookbookOccasion, setLookbookOccasion] = useState('');
  const [aiOutfit, setAiOutfit] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activePromo, setActivePromo] = useState(true);

  const featured = PRODUCTS.slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleAiStylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookbookOccasion.trim()) return;
    setIsAiLoading(true);
    const result = await getInstantLookbook(lookbookOccasion);
    setAiOutfit(result);
    setIsAiLoading(false);
  };

  return (
    <div className="space-y-0">
      {/* Sticky Promo Bar - Ultra Premium Styling */}
      {activePromo && (
        <div className="bg-stone-900 text-white py-2.5 px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-center flex justify-center items-center gap-4 relative z-[60]">
          <span className="animate-pulse flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            Special Offer: 15% OFF your first order
          </span>
          <span className="text-amber-400">Code: VANCY15</span>
          <button onClick={() => setActivePromo(false)} className="hover:text-amber-500 transition-colors">✕</button>
        </div>
      )}

      {/* Dynamic Hero Slider */}
      <section className="relative h-[85vh] overflow-hidden bg-stone-900">
        {SLIDES.map((slide, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${currentSlide === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'}`}
          >
            <div className="absolute inset-0 bg-stone-900/40 z-10"></div>
            <img src={slide.image} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
              <div className="max-w-4xl space-y-6">
                <span className={`block text-amber-400 font-bold uppercase tracking-[0.5em] text-xs transition-all duration-1000 delay-300 ${currentSlide === idx ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                  {slide.subtitle}
                </span>
                <h1 className={`text-5xl md:text-8xl font-black text-white leading-tight brand-font tracking-tighter transition-all duration-1000 delay-500 ${currentSlide === idx ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                  {slide.title}
                </h1>
                <p className={`text-lg md:text-xl text-stone-200 font-light max-w-2xl mx-auto tracking-wide transition-all duration-1000 delay-700 ${currentSlide === idx ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                  {slide.description}
                </p>
                <div className={`pt-8 transition-all duration-1000 delay-900 ${currentSlide === idx ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                  <Link to={slide.link} className="bg-white text-stone-900 px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-stone-100 transition shadow-2xl inline-block hover:scale-105 active:scale-95">
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Navigation Dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-4">
          {SLIDES.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-12 bg-white' : 'w-4 bg-white/30 hover:bg-white/60'}`}
            />
          ))}
        </div>
      </section>

      {/* The Vancy Quality Promise - Educational Block */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="relative">
              <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" className="rounded-[40px] shadow-2xl relative z-10" alt="Fabric Detail" />
              <div className="absolute -bottom-10 -right-10 bg-stone-900 text-white p-10 rounded-[32px] hidden sm:block z-20 shadow-2xl">
                 <p className="text-4xl font-bold brand-font mb-2">100%</p>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Pure Supima Cotton</p>
              </div>
           </div>
           <div className="space-y-8">
              <h2 className="text-4xl brand-font leading-tight">Beyond Luxury. Engineered for Life.</h2>
              <p className="text-stone-500 leading-relaxed font-light">Most "premium" brands use synthetic blends that fade after 5 washes. We use 500GSM heavyweight fabrics and pre-shrunk cotton that stays perfect for years.</p>
              
              <div className="space-y-4">
                 {[
                   { label: 'Color Retention', vancy: 'Permanent High-Gloss', other: 'Fades in 3 washes' },
                   { label: 'Fabric Grade', vancy: 'Extra-Long Staple', other: 'Mixed Carded Cotton' },
                   { label: 'Longevity', vancy: '200+ Washes Guaranteed', other: 'Loses shape quickly' }
                 ].map((row, i) => (
                   <div key={i} className="flex justify-between items-center py-5 border-b border-stone-100 last:border-0">
                      <span className="text-xs font-bold uppercase tracking-widest text-stone-400">{row.label}</span>
                      <div className="flex gap-8 text-sm">
                         <span className="font-bold text-stone-900">Vancy: {row.vancy}</span>
                         <span className="text-stone-300 line-through hidden sm:block">{row.other}</span>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="text-stone-900 font-bold border-b-2 border-stone-900 pb-2 hover:text-amber-700 hover:border-amber-700 transition-all">Our Material Science</button>
           </div>
        </div>
      </section>

      {/* AI Lookbook Generator - High Engagement */}
      <section className="bg-stone-50 py-24 border-y border-stone-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
           <span className="text-[10px] uppercase font-bold text-amber-600 tracking-[0.4em] mb-4 block">Personalized Styling</span>
           <h2 className="text-4xl brand-font mb-4">The AI Fashion Concierge</h2>
           <p className="text-stone-500 mb-12 font-light">Describe your next event, and our AI will curate your signature Vancy ensemble.</p>
           
           <form onSubmit={handleAiStylist} className="flex flex-col sm:flex-row gap-4 mb-12 relative group">
              <input 
                value={lookbookOccasion}
                onChange={e => setLookbookOccasion(e.target.value)}
                placeholder="e.g. A morning coffee date in Bandra or a winter evening at the studio..." 
                className="flex-1 bg-white p-6 rounded-[24px] outline-none border border-stone-200 shadow-sm focus:border-stone-900 transition-all"
              />
              <button 
                disabled={isAiLoading}
                className="bg-stone-900 text-white px-12 py-6 rounded-[24px] font-bold uppercase tracking-widest text-xs hover:bg-stone-800 shadow-xl flex items-center justify-center gap-2 group-hover:scale-105 transition-all"
              >
                {isAiLoading ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : 'Curate My Look'}
              </button>
           </form>

           {aiOutfit && (
             <div className="bg-white p-12 rounded-[48px] border border-stone-200 shadow-2xl animate-in zoom-in-95 duration-500">
                <div className="flex flex-col md:flex-row gap-12 items-center text-left">
                   <div className="flex-1">
                      <span className="text-[10px] uppercase font-bold text-amber-600 tracking-widest mb-4 block">Recommended Vibe</span>
                      <h3 className="text-3xl brand-font mb-4">"{aiOutfit.vibe}"</h3>
                      <p className="text-stone-500 font-light mb-8 leading-relaxed">{aiOutfit.reason}</p>
                      <div className="grid grid-cols-2 gap-4 mb-10">
                         {aiOutfit.items.map((it: string) => (
                           <div key={it} className="bg-stone-50 p-4 rounded-2xl flex items-center gap-3 border border-stone-100">
                              <span className="w-2 h-2 bg-stone-900 rounded-full"></span>
                              <span className="text-[10px] font-bold uppercase tracking-widest">{it}</span>
                           </div>
                         ))}
                      </div>
                      <Link to="/shop" className="inline-block bg-stone-900 text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg">Shop This Style</Link>
                   </div>
                   <div className="w-full md:w-72 aspect-[3/4] bg-stone-50 rounded-[32px] overflow-hidden shadow-inner">
                      <img src="https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700" alt="Stylist Suggestion" />
                   </div>
                </div>
             </div>
           )}
        </div>
      </section>

      {/* Featured Pieces */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-lg">
              <h2 className="text-5xl brand-font mb-4">The Hero Pieces</h2>
              <p className="text-stone-500 font-light leading-relaxed">The designs that defined Vancy. Meticulously engineered for the man who doesn't follow trends, but sets them.</p>
            </div>
            <Link to="/shop" className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
               Explore Full Collection
               <span className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-stone-50">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-4xl brand-font">Seen on the Vancy Insider</h2>
               <p className="text-stone-400 mt-2 uppercase tracking-[0.3em] text-[10px] font-bold">Join the community #VancyCulture</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-[800px]">
               <div className="col-span-1 row-span-2 overflow-hidden rounded-[32px] shadow-lg">
                  <img src="https://images.unsplash.com/photo-1516257984411-c033d42af7dd?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover hover:scale-110 transition duration-1000" alt="" />
               </div>
               <div className="col-span-1 row-span-1 overflow-hidden rounded-[32px] shadow-lg">
                  <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover hover:scale-110 transition duration-1000" alt="" />
               </div>
               <div className="col-span-2 row-span-1 overflow-hidden rounded-[32px] relative group shadow-lg">
                  <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover hover:scale-105 transition duration-1000" alt="" />
                  <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center p-12 backdrop-blur-sm">
                     <p className="text-white text-3xl brand-font italic text-center">"The fit is revolutionary. Never felt cotton this substantial yet breathable." <br/> <span className="text-xs font-bold uppercase tracking-[0.3em] not-italic mt-6 block text-amber-400">— Arjun K., Mumbai</span></p>
                  </div>
               </div>
               <div className="col-span-1 row-span-1 overflow-hidden rounded-[32px] shadow-lg">
                  <img src="https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover hover:scale-110 transition duration-1000" alt="" />
               </div>
               <div className="col-span-1 row-span-1 overflow-hidden rounded-[32px] shadow-lg">
                  <img src="https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover hover:scale-110 transition duration-1000" alt="" />
               </div>
            </div>
         </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-stone-900 text-white py-24">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-20 text-center">
            <div className="space-y-6">
               <div className="text-5xl">🛡️</div>
               <h4 className="font-bold text-xs uppercase tracking-[0.4em] text-amber-500">Durability First</h4>
               <p className="text-xs text-stone-400 font-light leading-relaxed max-w-xs mx-auto">Our 'Triple-Stitch' methodology ensures seams that outlast the fabric itself.</p>
            </div>
            <div className="space-y-6">
               <div className="text-5xl">🔄</div>
               <h4 className="font-bold text-xs uppercase tracking-[0.4em] text-amber-500">Easy Lifecycle</h4>
               <p className="text-xs text-stone-400 font-light leading-relaxed max-w-xs mx-auto">No-questions-asked returns. We believe in the product, and so will you.</p>
            </div>
            <div className="space-y-6">
               <div className="text-5xl">☁️</div>
               <h4 className="font-bold text-xs uppercase tracking-[0.4em] text-amber-500">Thermal Comfort</h4>
               <p className="text-xs text-stone-400 font-light leading-relaxed max-w-xs mx-auto">Optimized GSM levels for the Indian climate—warmth in winter, breathable in summer.</p>
            </div>
         </div>
      </section>

      {/* Final Conversion CTA */}
      <section className="py-40 bg-stone-100 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500 rounded-full -mr-64 -mt-64 blur-[120px] opacity-20"></div>
         <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-6xl brand-font mb-8">Evolve Your Wardrobe.</h2>
            <p className="text-stone-500 mb-12 font-light text-xl">Join 10,000+ men who chose quality over quantity. Start your Vancy journey today.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
               <Link to="/shop" className="bg-stone-900 text-white px-14 py-6 rounded-full font-bold uppercase tracking-widest text-xs shadow-2xl hover:bg-stone-800 transition-all hover:scale-105 active:scale-95">Shop the Catalog</Link>
               <Link to="/auth" className="bg-white border border-stone-200 text-stone-900 px-14 py-6 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-50 transition-all shadow-xl">Join the Inner Circle</Link>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
