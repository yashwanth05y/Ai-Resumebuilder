import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data));
                } catch (error) {
                    console.error("Auth Check Failed", error);
                    // Only clear if 401/403 to avoid clearing on network errors
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const updateDownloadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/track-download`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(prev => ({ ...prev, downloadCount: res.data.downloadCount }));
            localStorage.setItem('user', JSON.stringify({ ...user, downloadCount: res.data.downloadCount }));
            return true;
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast.error("Download limit reached. Upgrade to Premium!");
                return false;
            }
            return true; // Use caution, maybe false? but let's assume network error allows download for now to avoid blocking
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);
            toast.success('Formatted: Login successful!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const signup = async (fullName, email, password) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { fullName, email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);
            toast.success('Account created!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed');
            return false;
        }
    };

    const loginGoogle = async (googleData) => {
        // In a real app, send the token to backend to verify
        // For now, assume backend accepts the basic profile info
        try {
            // We need to implement this backend side properly to verify token
            // Sending dummy data to match our backend dummy endpoint
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
                email: googleData.email,
                fullName: googleData.name,
                googleId: googleData.sub
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);
            toast.success('Google Login successful!');
            return true;
        } catch (err) {
            toast.error('Google Login failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out');
    };

    const forgotPassword = async (email) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
            toast.success('OTP sent to your email');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
            return false;
        }
    };

    const resetPassword = async (email, otp, newPassword) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, { email, otp, newPassword });
            toast.success('Password reset successfully! Login now.');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, forgotPassword, resetPassword, loginGoogle, updateDownloadCount }}>
            {children}
        </AuthContext.Provider>
    );
};
