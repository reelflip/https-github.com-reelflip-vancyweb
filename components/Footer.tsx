
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-stone-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="text-3xl font-bold brand-font text-stone-900 mb-6 block">VANCY</Link>
          <p className="text-stone-500 text-sm font-light leading-relaxed">
            Curating the finest in Men's premium essentials. Handcrafted with love, tailored for the modern silhouette.
          </p>
          <div className="flex gap-4 mt-8">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-900 hover:text-white transition cursor-pointer">f</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-900 hover:text-white transition cursor-pointer">i</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-900 hover:text-white transition cursor-pointer">t</a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Collections</h4>
          <ul className="space-y-4 text-sm text-stone-500 font-light">
            <li><Link to="/shop" className="hover:text-stone-900 transition">Shop All</Link></li>
            <li><Link to="/shop?category=Polo T-Shirts" className="hover:text-stone-900 transition">Polo T-Shirts</Link></li>
            <li><Link to="/shop?category=Joggers" className="hover:text-stone-900 transition">Joggers</Link></li>
            <li><Link to="/shop?category=Hoodies" className="hover:text-stone-900 transition">Hoodies & Sweatshirts</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Account</h4>
          <ul className="space-y-4 text-sm text-stone-500 font-light">
            <li><Link to="/profile?tab=orders" className="hover:text-stone-900 transition">Order Tracking</Link></li>
            <li><Link to="/profile?tab=orders" className="hover:text-stone-900 transition">Returns & Exchanges</Link></li>
            <li><Link to="/shop" className="hover:text-stone-900 transition">Size Guide</Link></li>
            <li><Link to="/profile" className="hover:text-stone-900 transition">My Profile</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Contact</h4>
          <ul className="space-y-4 text-sm text-stone-500 font-light">
            <li>123 Premium Way, Mumbai, India</li>
            <li>support@vancy.in</li>
            <li>+91 90000 12345</li>
            <li className="pt-2 text-[10px] text-stone-400 italic">Mon-Sat, 09:00 AM - 08:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-stone-50 flex flex-col sm:flex-row justify-between items-center text-[10px] text-stone-400 uppercase tracking-widest font-bold">
        <p>© 2024 Vancy Premium Apparel. All Rights Reserved.</p>
        <div className="flex gap-6 mt-4 sm:mt-0">
          <Link to="/" className="hover:text-stone-900 transition">Privacy Policy</Link>
          <Link to="/" className="hover:text-stone-900 transition">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
