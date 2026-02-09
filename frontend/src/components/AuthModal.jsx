import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, AlertCircle, ArrowRight, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

const AuthModal = ({ onClose, onSuccess }) => {
    const [view, setView] = useState('login'); // login, signup, forgot, reset
    const [loading, setLoading] = useState(false);
    const { login, signup, forgotPassword, resetPassword, loginGoogle, skipAuth } = useAuth();

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            // In real world, we would get profile info from Google API using this token
            // or send the token to backend directly.
            // For this simplified demo/mock, we'll fetch profile here then send to backend
            try {
                const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                }).then(res => res.json());

                const success = await loginGoogle(userInfo);
                if (success) onSuccess();
            } catch (err) {
                console.error(err);
            }
        },
        onError: errorResponse => console.log(errorResponse),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let success = false;

        if (view === 'login') {
            success = await login(email, password);
        } else if (view === 'signup') {
            success = await signup(fullName, email, password);
        } else if (view === 'forgot') {
            success = await forgotPassword(email);
            if (success) setView('reset');
        } else if (view === 'reset') {
            success = await resetPassword(email, otp, newPassword);
            if (success) setView('login');
        }

        setLoading(false);
        if (success && (view === 'login' || view === 'signup')) {
            onSuccess();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                    <h2 className="text-xl font-bold text-white">
                        {view === 'login' && 'Welcome Back'}
                        {view === 'signup' && 'Create Account'}
                        {view === 'forgot' && 'Reset Password'}
                        {view === 'reset' && 'Enter OTP'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {view === 'signup' && (
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        {(view === 'login' || view === 'signup' || view === 'forgot' || view === 'reset') && (
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-slate-500" size={16} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                        )}

                        {(view === 'login' || view === 'signup' || view === 'reset') && (
                            <div>
                                <div className="flex justify-between mb-1">
                                    <label className="block text-xs font-medium text-slate-400">Password</label>
                                    {view === 'login' && (
                                        <button type="button" onClick={() => setView('forgot')} className="text-xs text-pink-500 hover:text-pink-400">
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-slate-500" size={16} />
                                    <input
                                        type="password"
                                        required={view !== 'reset'}
                                        value={view === 'reset' ? newPassword : password}
                                        onChange={(e) => view === 'reset' ? setNewPassword(e.target.value) : setPassword(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        {view === 'reset' && (
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">One-Time Password (OTP)</label>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 tracking-widest text-center font-mono"
                                    placeholder="123456"
                                    maxLength={6}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-pink-500/20 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {view === 'login' && 'Sign In'}
                                    {view === 'signup' && 'Create Account'}
                                    {view === 'forgot' && 'Send Reset Link'}
                                    {view === 'reset' && 'Reset Password'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Social Auth */}
                    {(view === 'login' || view === 'signup') && (
                        <>
                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-slate-700" />
                                <span className="text-xs text-slate-500 font-medium">OR CONTINUE WITH</span>
                                <div className="flex-1 h-px bg-slate-700" />
                            </div>

                            <button
                                type="button"
                                onClick={() => handleGoogleLogin()}
                                className="w-full bg-white text-slate-900 font-bold py-2.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <Chrome size={18} className="text-blue-500" /> Google
                            </button>
                        </>
                    )}

                    {/* Footer toggle */}
                    <div className="mt-6 text-center text-sm text-slate-400">
                        {view === 'login' ? (
                            <>
                                Don't have an account?{' '}
                                <button onClick={() => setView('signup')} className="text-pink-500 hover:text-pink-400 font-medium">
                                    Sign up
                                </button>
                            </>
                        ) : view === 'signup' ? (
                            <>
                                Already have an account?{' '}
                                <button onClick={() => setView('login')} className="text-pink-500 hover:text-pink-400 font-medium">
                                    Log in
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setView('login')} className="text-slate-500 hover:text-white font-medium flex items-center justify-center gap-1 mx-auto">
                                <ArrowRight size={14} className="rotate-180" /> Back to Login
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthModal;
