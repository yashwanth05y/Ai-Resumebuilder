import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Wand2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Hero = ({ onStart, onViewTemplates, onLogin }) => {
    const { user, logout } = useAuth();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
        >
            <div className="absolute top-6 right-6 z-20 flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-xs font-bold ring-2 ring-white/20">
                            {user.fullName?.charAt(0) || <User size={14} />}
                        </div>
                        <span className="text-sm font-medium hidden sm:block">{user.fullName?.split(' ')[0]}</span>
                        <button onClick={logout} className="text-xs text-slate-400 hover:text-white transition-colors">Log Out</button>
                    </div>
                ) : (
                    <button
                        onClick={onLogin}
                        className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm font-bold flex items-center gap-2 backdrop-blur-sm"
                    >
                        <User size={16} className="text-pink-500" />
                        Sign In
                    </button>
                )}
            </div>

            <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

            <div className="relative z-10 max-w-5xl text-center space-y-8">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2 mb-8 text-sm font-medium text-pink-300 shadow-2xl cursor-default"
                    >
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-spin-slow" />
                        <span>AI-Powered Resume Builder V2.0</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-tight drop-shadow-2xl">
                        Craft Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x">Dream Career</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Build a professional, ATS-friendly resume in record time. Choose from premium templates, customize with AI guidance, and impress recruiters instantly.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStart}
                        className="group relative px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl text-white font-bold text-lg shadow-xl shadow-pink-500/20 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <span className="relative flex items-center justify-center">
                            <Wand2 className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                            Build My Resume Free
                        </span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onViewTemplates}
                        className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white font-medium hover:border-white/20 transition-all duration-300 flex items-center justify-center group"
                    >
                        View Templates
                        <ChevronRight className="w-5 h-5 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </motion.div>

                {/* New Feature: Testimonials or Proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-16 flex justify-center gap-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                >
                    {/* Simple logos or text for trust */}
                    <span className="text-slate-500 font-semibold tracking-widest text-sm uppercase">Trusted by 10,000+ Job Seekers</span>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Hero;
