
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-stone-100">
        <div className="text-center mb-10">
          <h1 className="text-4xl brand-font mb-2">VANCY</h1>
          <p className="text-stone-400 text-sm font-light uppercase tracking-widest">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-500 tracking-widest ml-1">Full Name</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-stone-900 transition"
                placeholder="Your name"
              />
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-500 tracking-widest ml-1">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-stone-900 transition"
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-[10px] uppercase font-bold text-stone-500 tracking-widest ml-1">Password</label>
              {isLogin && <button type="button" className="text-[10px] uppercase font-bold text-amber-700 tracking-widest">Forgot?</button>}
            </div>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-stone-900 transition"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-stone-800 transition shadow-lg mt-4">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-stone-400 font-medium hover:text-stone-900 transition"
          >
            {isLogin ? "Don't have an account? Join Vancy" : "Already a member? Sign in here"}
          </button>
        </div>

        {/* Demo Section */}
        <div className="mt-10 pt-8 border-t border-stone-100">
          <p className="text-[9px] text-center text-stone-400 font-bold uppercase tracking-[0.2em] mb-6">Quick Access (Demo)</p>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleDemoLogin('buyer')}
              className="flex items-center justify-center gap-2 border border-stone-200 py-3 rounded-xl hover:bg-stone-50 transition text-[10px] font-bold uppercase tracking-widest"
            >
              <span>👤</span> Buyer Demo
            </button>
            <button 
              onClick={() => handleDemoLogin('admin')}
              className="flex items-center justify-center gap-2 border border-stone-200 py-3 rounded-xl hover:bg-stone-50 transition text-[10px] font-bold uppercase tracking-widest"
            >
              <span>🔑</span> Admin Demo
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 flex flex-col gap-3">
          <button className="flex items-center justify-center gap-3 w-full border border-stone-200 py-3 rounded-xl hover:bg-stone-50 transition text-sm font-medium">
             <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
             Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
