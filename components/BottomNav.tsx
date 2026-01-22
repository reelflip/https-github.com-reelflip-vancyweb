
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { cart, wishlist } = useStore();
  
  const navItems = [
    { path: '/', label: 'Home', icon: (active: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    )},
    { path: '/shop', label: 'Shop', icon: (active: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    )},
    { path: '/cart', label: 'Bag', icon: (active: boolean) => (
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white">{cart.length}</span>}
      </div>
    )},
    { path: '/profile', label: 'Account', icon: (active: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    )}
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 px-6 py-3 flex justify-between items-center z-[50] safe-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      {navItems.map(item => {
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-stone-900 scale-110' : 'text-stone-400'}`}>
            {item.icon(isActive)}
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
