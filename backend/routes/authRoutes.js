const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('../utils/email');

// --- Helper Functions ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// --- AUTHENTICATION ROUTES ---

// @desc    Register new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        console.log('Register attempt:', { fullName, email }); // Log connection attempt

        if (!email || !password || !fullName) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                downloadCount: user.downloadCount,
                isPremium: user.isPremium,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email });

        // Check for user email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if user has a password (might be a Google-only user)
        if (!user.password) {
            return res.status(400).json({ message: 'Account exists via Google. Please login with Google.' });
        }

        if (await bcrypt.compare(password, user.password)) {
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined');
            }
            res.json({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                downloadCount: user.downloadCount,
                isPremium: user.isPremium,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
});

// @desc    Get user data
router.get('/me', async (req, res) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
});

router.post('/track-download', async (req, res) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user.isPremium && user.downloadCount >= 1) {
            return res.status(403).json({ message: 'Download limit reached. Please upgrade.' });
        }

        user.downloadCount += 1;
        await user.save();

        res.json({
            downloadCount: user.downloadCount,
            isPremium: user.isPremium
        });
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
});


// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 Minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send Email
    const message = `Your password reset OTP is <b>${otp}</b>. It expires in 10 minutes.`;
    try {
        // Check if email sending is configured (placeholder if not)
        if (process.env.EMAIL_USER) {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP',
                html: message,
            });
            res.status(200).json({ message: 'OTP sent to email' });
        } else {
            // Dev mode fallback
            console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
            res.status(200).json({ message: 'OTP generated (Check console for Dev Mode)' });
        }
    } catch (error) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return res.status(500).json({ message: 'Email could not be sent' });
    }
});

// @desc    Verify OTP and Reset Password
// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
        email,
        otp,
        otpExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
});

// @desc    Google Login
// @route   POST /api/auth/google
router.post('/google', async (req, res) => {
    const { email, fullName, googleId } = req.body; // In real app, verify ID token

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            fullName,
            email,
            isGoogleUser: true,
            password: await bcrypt.hash(googleId + "secret", 10) // Dummy password
        });
    }

    res.json({
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        downloadCount: user.downloadCount,
        isPremium: user.isPremium,
        token: generateToken(user._id),
    });
});


module.exports = router;
