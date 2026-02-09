const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        // Not required for Google Auth users
    },
    fullName: {
        type: String,
        required: true
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
