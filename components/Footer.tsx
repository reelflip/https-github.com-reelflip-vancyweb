
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-stone-100 pt-16 pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1">
          <Link to="/" className="text-2xl font-black brand-font text-stone-900 mb-6 block">VANCY</Link>
          <p className="text-stone-500 text-xs font-light leading-relaxed">
            Curating the finest in Men's premium essentials. Handcrafted for the modern silhouette.
          </p>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-900 mb-6">Collections</h4>
          <ul className="space-y-4 text-xs text-stone-400 font-bold uppercase tracking-widest">
            <li><Link to="/shop" className="hover:text-stone-900">All</Link></li>
            <li><Link to="/shop?category=Polo T-Shirts" className="hover:text-stone-900">Polos</Link></li>
            <li><Link to="/shop?category=Joggers" className="hover:text-stone-900">Joggers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-900 mb-6">Help</h4>
          <ul className="space-y-4 text-xs text-stone-400 font-bold uppercase tracking-widest">
            <li><Link to="/profile" className="hover:text-stone-900">Returns</Link></li>
            <li><Link to="/shop" className="hover:text-stone-900">Size Guide</Link></li>
            <li><Link to="/auth" className="hover:text-stone-900">Account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-900 mb-6">Contact</h4>
          <p className="text-xs text-stone-500 font-medium">support@vancy.in</p>
          <p className="text-[10px] text-stone-400 mt-2 uppercase tracking-widest">Mumbai, India</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-stone-50 flex flex-col sm:flex-row justify-between items-center text-[9px] text-stone-300 uppercase tracking-widest font-black">
        <p>© 2024 Vancy. All Rights Reserved.</p>
        <div className="flex gap-6 mt-4 sm:mt-0">
          <Link to="/">Privacy</Link>
          <Link to="/">Terms</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
