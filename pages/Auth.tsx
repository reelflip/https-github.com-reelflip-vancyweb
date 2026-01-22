
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = isLogin ? login(email, password) : register(name, email, password);
    if (success) navigate('/');
  };

  const handleDemoLogin = (type: 'buyer' | 'admin') => {
    const demoEmail = type === 'admin' ? 'admin@vancy.in' : 'buyer@vancy.in';
    login(demoEmail, 'password');
    navigate(type === 'admin' ? '/admin' : '/');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-stone-50">
      <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-stone-100 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-12">
          <h1 className="text-5xl brand-font tracking-tighter text-stone-900 mb-3">VANCY</h1>
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            {isLogin ? 'Welcome back to the club' : 'Create your style identity'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-stone-400 tracking-[0.2em] ml-2">Full Name</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 outline-none focus:border-stone-900 focus:bg-white transition-all duration-300 font-medium"
                placeholder="John Doe"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-stone-400 tracking-[0.2em] ml-2">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 outline-none focus:border-stone-900 focus:bg-white transition-all duration-300 font-medium"
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] uppercase font-black text-stone-400 tracking-[0.2em]">Password</label>
              {isLogin && <button type="button" className="text-[9px] uppercase font-bold text-amber-700 tracking-widest hover:underline transition">Forgot Password?</button>}
            </div>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 outline-none focus:border-stone-900 focus:bg-white transition-all duration-300 font-medium"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-stone-800 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 mt-4">
            {isLogin ? 'Authorize Entry' : 'Join the Inner Circle'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] text-stone-400 font-bold uppercase tracking-widest hover:text-stone-900 transition-colors"
          >
            {isLogin ? "Don't have an account? Join Vancy" : "Already a member? Sign in here"}
          </button>
        </div>

        {/* Demo Section - Visual Polish */}
        <div className="mt-12 pt-10 border-t border-stone-50">
          <p className="text-[9px] text-center text-stone-300 font-black uppercase tracking-[0.4em] mb-8">Rapid Access Prototypes</p>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleDemoLogin('buyer')}
              className="flex items-center justify-center gap-3 border border-stone-100 bg-stone-50/50 py-4 rounded-2xl hover:bg-stone-100 hover:border-stone-200 transition-all duration-300 text-[9px] font-black uppercase tracking-widest group"
            >
              <span className="text-lg opacity-40 group-hover:opacity-100 transition-opacity">👤</span> Buyer
            </button>
            <button 
              onClick={() => handleDemoLogin('admin')}
              className="flex items-center justify-center gap-3 border border-stone-100 bg-stone-50/50 py-4 rounded-2xl hover:bg-stone-100 hover:border-stone-200 transition-all duration-300 text-[9px] font-black uppercase tracking-widest group"
            >
              <span className="text-lg opacity-40 group-hover:opacity-100 transition-opacity">🔑</span> Admin
            </button>
          </div>
        </div>

        <div className="mt-8">
          <button className="flex items-center justify-center gap-4 w-full bg-stone-50 border border-stone-100 py-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 text-[10px] font-bold uppercase tracking-widest text-stone-600">
             <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale group-hover:grayscale-0" alt="" />
             Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
