import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import ResumeBuilder from './components/ResumeBuilder';
import PaymentModal from './components/PaymentModal';
import AuthModal from './components/AuthModal';

import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [initialStep, setInitialStep] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Secret shortcut: Ctrl + Shift + A to toggle Admin Panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startBuilder = (step = 0) => {
    setInitialStep(step);
    setShowBuilder(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden selection:bg-pink-500 selection:text-white">
      <AnimatePresence mode="wait">
        {!showBuilder ? (
          <Hero key="hero" onStart={() => startBuilder(0)} onViewTemplates={() => startBuilder(5)} onLogin={() => setShowAuthModal(true)} />
        ) : (
          <ResumeBuilder key="builder" onUpgrade={() => setShowPayment(true)} onBack={() => setShowBuilder(false)} initialStep={initialStep} />
        )}
      </AnimatePresence>

      {showPayment && (
        <PaymentModal onClose={() => setShowPayment(false)} />
      )}

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={() => setShowAuthModal(false)} />
        )}
      </AnimatePresence>

      {/* Secret Admin Panel Trigger (e.g., specific key combo or hidden button, for now just a prop or state) */}
      {showAdmin && (
        <AdminDashboard onClose={() => setShowAdmin(false)} />
      )}
    </div>
  );
}

export default App;
