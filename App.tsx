
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import { UserRole } from './types';

const AppContent: React.FC = () => {
  const { role, user } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-stone-900 selection:text-white font-sans overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={user ? <Navigate to="/profile" /> : <Auth />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route 
            path="/admin" 
            element={role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/auth" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <ChatBot />
      <BottomNav />
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <AppContent />
      </Router>
    </StoreProvider>
  );
};

export default App;
