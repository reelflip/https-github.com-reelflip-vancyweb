
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { cart, user, role, setRole, searchQuery, setSearchQuery, products } = useStore();
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = searchQuery.length > 1 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl md:text-3xl font-black tracking-tighter brand-font text-stone-900">VANCY</Link>
            
            <div className="hidden lg:flex items-center relative" ref={searchRef}>
               <div className={`flex items-center bg-stone-50 rounded-full px-4 py-2 border transition-all duration-300 ${isSearchFocused ? 'w-80 border-stone-900 ring-4 ring-stone-900/5 shadow-lg' : 'w-48 border-stone-200'}`}>
                 <svg className="text-stone-400 mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                 <input 
                  type="text" 
                  placeholder="Search collections..." 
                  className="bg-transparent text-xs w-full outline-none font-medium placeholder:text-stone-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                 />
               </div>
               {isSearchFocused && suggestions.length > 0 && (
                 <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-50">
                    {suggestions.map(s => (
                      <button key={s.id} onClick={() => { setSearchQuery(''); setIsSearchFocused(false); navigate(`/product/${s.id}`); }} className="w-full text-left px-5 py-3 hover:bg-stone-50 flex items-center gap-4 group transition-colors">
                        <img src={s.images[0]} className="w-8 h-10 object-cover rounded-lg" alt="" />
                        <div><p className="text-[11px] font-bold text-stone-900">{s.name}</p></div>
                      </button>
                    ))}
                 </div>
               )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Admin Switch (Visible on Desktop) */}
            <div className="hidden md:flex items-center gap-2 bg-stone-50 rounded-full px-3 py-1.5 border border-stone-200">
              <span className="text-[9px] uppercase font-bold text-stone-400">Node:</span>
              <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="bg-transparent text-[9px] font-bold focus:outline-none cursor-pointer">
                <option value={UserRole.BUYER}>Buyer</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
            </div>

            {/* Desktop Account & Cart */}
            <div className="hidden md:flex items-center gap-2">
              <Link to={user ? "/profile" : "/auth"} className="p-2.5 bg-stone-50 text-stone-900 rounded-full hover:bg-stone-100 border border-stone-200 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>
              <Link to="/cart" className="p-2.5 bg-stone-900 text-white rounded-full hover:bg-stone-800 relative shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-900 text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">{cart.length}</span>}
              </Link>
            </div>

            {/* Mobile Search Button */}
            <button onClick={() => navigate('/shop')} className="md:hidden p-2 text-stone-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
