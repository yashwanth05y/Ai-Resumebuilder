const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
require('dotenv').config();

console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://ai-resumebuilder-8dxcn40zh-yashwanths-projects-dc8d4a92.vercel.app', 'https://ai-resumebuilder.vercel.app', 'https://ai-resumebuilder-git-main-yashwanths-projects-dc8d4a92.vercel.app', 'https://ai-resumebuilder-alpha.vercel.app', 'https://ai-resume-builder-yash.vercel.app'],
  credentials: true
}));
app.use(bodyParser.json());

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// Create Order Route
app.post('/api/create-order', async (req, res) => {
  try {
    // Determine amount based on plan type if needed, default to 499 INR
    const options = {
      amount: 9900, // Amount in paise (99 INR)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send('Error creating order');
  }
});

// Verify Payment Route
app.post('/api/verify-payment', (req, res) => {
  const crypto = require('crypto');
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
    .update(sign.toString())
    .digest('hex');

  if (razorpay_signature === expectedSign) {
    res.json({ success: true, message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
});

const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/resume-builder")
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

app.use('/api/auth', authRoutes);

// --- Admin Routes for Viewing Data ---
// Protected by a simple secret key for now (in production use proper middleware)
const User = require('./models/User');

app.get('/api/admin/users', async (req, res) => {
  console.log('HIT ADMIN ROUTE');
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error in /api/admin/users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ isPremium: true });
    const totalDownloads = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$downloadCount" } } }
    ]);

    res.json({
      totalUsers,
      premiumUsers,
      totalDownloads: totalDownloads[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
