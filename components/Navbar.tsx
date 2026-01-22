
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { cart, user, role, setRole, wishlist, searchQuery, setSearchQuery } = useStore();
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (window.location.hash !== '#/shop') navigate('/shop');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-3xl font-black tracking-tighter brand-font text-stone-900 hover:text-amber-800 transition-colors">VANCY</Link>
            
            <div className="hidden lg:flex items-center relative group">
               <div className={`flex items-center bg-stone-50 rounded-full px-4 py-2 border transition-all duration-300 ${isSearchFocused ? 'w-80 border-stone-900 ring-4 ring-stone-900/5 shadow-lg' : 'w-48 border-stone-200'}`}>
                 <svg className="text-stone-400 mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                 <input 
                  type="text" 
                  placeholder="Search collections..." 
                  className="bg-transparent text-xs w-full outline-none font-medium placeholder:text-stone-400"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                 />
               </div>
            </div>

            <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">
              <Link to="/shop" className="hover:text-stone-900 transition-colors relative group">
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-stone-900 transition-all group-hover:w-full"></span>
              </Link>
              <Link to="/shop?category=New Arrivals" className="hover:text-stone-900 transition-colors relative group">
                New Arrivals
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-stone-900 transition-all group-hover:w-full"></span>
              </Link>
              {role === UserRole.ADMIN && (
                <Link to="/admin" className="text-amber-600 hover:text-amber-800 transition-colors">Admin Console</Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-stone-50 rounded-full px-3 py-1.5 mr-2 border border-stone-200">
              <span className="text-[9px] uppercase font-bold text-stone-400">View as:</span>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="bg-transparent text-[9px] font-bold focus:outline-none cursor-pointer text-stone-700"
              >
                <option value={UserRole.BUYER}>Buyer</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
            </div>

            <Link to={user ? "/profile" : "/auth"} className="p-2 text-stone-600 hover:text-stone-900 transition flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full bg-stone-50 flex items-center justify-center border border-stone-200 group-hover:border-stone-900 group-hover:bg-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-stone-500 group-hover:text-stone-900">{user ? user.name : 'Log In'}</span>
            </Link>

            <Link to="/profile?tab=wishlist" className="p-2 text-stone-500 hover:text-stone-900 relative transition-colors group">
              <svg className="group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              {wishlist.length > 0 && <span className="absolute top-1 right-1 bg-amber-600 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center border-2 border-white shadow-sm">{wishlist.length}</span>}
            </Link>

            <Link to="/cart" className="p-2.5 bg-stone-900 text-white rounded-full hover:bg-stone-800 relative transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-900 text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
