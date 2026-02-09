import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Download, Crown, Search, RefreshCw, X } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = ({ onClose }) => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, premiumUsers: 0, totalDownloads: 0 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, statsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`),
                axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats`)
            ]);
            setUsers(usersRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredUsers = users.filter(u =>
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded">ADMIN</span> Dashboard
                </h1>
                <div className="flex items-center gap-4">
                    <button onClick={fetchData} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={onClose} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6 space-y-8">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 text-blue-500 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Users</p>
                            <h3 className="text-2xl font-bold text-white">{stats.totalUsers}</h3>
                        </div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/20 text-yellow-500 rounded-lg">
                            <Crown size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Premium Users</p>
                            <h3 className="text-2xl font-bold text-white">{stats.premiumUsers}</h3>
                        </div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 text-green-500 rounded-lg">
                            <Download size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Downloads</p>
                            <h3 className="text-2xl font-bold text-white">{stats.totalDownloads}</h3>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-lg font-bold text-white">Registered Users</h2>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search users..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-pink-500"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-900/50 text-slate-200 uppercase text-xs font-bold">
                                <tr>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Downloads</th>
                                    <th className="p-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 font-medium text-white">{user.fullName}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4">
                                            {user.isPremium ? (
                                                <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit">
                                                    <Crown size={12} /> PREMIUM
                                                </span>
                                            ) : (
                                                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-bold w-fit">
                                                    FREE
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center font-mono text-white">{user.downloadCount}</td>
                                        <td className="p-4 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-500">
                                            No users found matching "{search}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
