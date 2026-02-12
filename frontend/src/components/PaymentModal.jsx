import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, Zap, Shield, Crown } from 'lucide-react';
import axios from 'axios';

const PaymentModal = ({ onClose }) => {
    const [loading, setLoading] = useState(false);

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log("Initiating payment with API_URL:", API_URL);

        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            // In production, use env variable for backend URL
            console.log(`Sending request to: ${API_URL}/api/create-order`);
            const { data: order } = await axios.post(`${API_URL}/api/create-order`);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
                amount: order.amount,
                currency: order.currency,
                name: 'AI Resume Builder',
                description: 'Premium Upgrade',
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const data = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        };

                        await axios.post(`${API_URL}/api/verify-payment`, data);
                        alert('Welcome to Premium! All features unlocked.');
                        onClose();
                    } catch (error) {
                        console.error("Verification Error:", error);
                        alert(`Payment verification failed: ${error.message}`);
                    }
                },
                theme: {
                    color: '#ec4899', // Pink-500
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Payment Order Error:", error);
            const errorMessage = error.response?.data?.message || error.message;
            alert(`Payment Error: ${errorMessage}\nAttempted URL: ${API_URL}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-br from-pink-600 to-purple-700 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 shadow-xl">
                            <Crown className="text-yellow-300 w-8 h-8 fill-yellow-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">Upgrade to Premium</h2>
                        <p className="text-pink-100 text-sm">Unlock the full power of AI Resume Builder</p>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <FeatureItem icon={<Star className="text-yellow-400" />} text="Remove Watermark from PDF" />
                        <FeatureItem icon={<Zap className="text-yellow-400" />} text="Access to All Premium Templates" />
                        <FeatureItem icon={<Shield className="text-green-400" />} text="AI Resume Analysis (Coming Soon)" />
                    </div>

                    <div className="text-center pt-4">
                        <div className="text-3xl font-bold text-white mb-1">₹99 <span className="text-sm font-normal text-slate-400 line-through">₹499</span></div>
                        <p className="text-xs text-slate-500 mb-6">One-time payment. Lifetime access.</p>

                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white font-bold text-lg shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div> : 'Get Premium Now'}
                        </button>
                        <p className="text-[10px] text-slate-600 mt-4 flex items-center justify-center gap-1">
                            <Shield size={10} /> Secure payment via Razorpay
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const FeatureItem = ({ icon, text }) => (
    <div className="flex items-center gap-3 text-slate-300">
        <div className="p-1 rounded-full bg-slate-800 border border-slate-700">
            {React.cloneElement(icon, { size: 14 })}
        </div>
        <span className="text-sm font-medium">{text}</span>
    </div>
);

export default PaymentModal;
