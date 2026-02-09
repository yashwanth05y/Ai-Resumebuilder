# 🚀 AI Resume Builder (Premium)

A modern, high-performance resume builder built with React, Node.js, and Tailwind CSS.
Featuring a premium glassmorphism UI/UX, smooth animations, and Razorpay integration.

## ✨ Features
- **Modern UI**: Polished glassmorphism design with Framer Motion animations.
- **Interactive Builder**: Real-time resume updates.
- **Live Preview**: See your resume as you type.
- **Premium Templates**: Professional designs.
- **PDF Download**: High-quality PDF generation.
- **Payment Gateway**: Razorpay integration for premium features.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express
- **PDF**: html2canvas, jsPDF
- **Payments**: Razorpay

## 🚀 Getting Started Locally

### 1. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```
Start the server:
```bash
npm start
# Server runs on http://localhost:5000
```
> **Note**: Create a `.env` file in `backend/` with your Razorpay keys:
> ```
> PORT=5000
> RAZORPAY_KEY_ID=your_key_id
> RAZORPAY_KEY_SECRET=your_key_secret
> ```

### 2. Frontend Setup
Open a new terminal, navigate to frontend:
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

## 🌐 Deployment

### Frontend (Vercel / Netlify)
1. Push code to GitHub.
2. Connect repository to Vercel/Netlify.
3. Set build command: `npm run build`.
4. Set output directory: `dist`.
5. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://my-resume-backend.onrender.com`)

### Backend (Render / Railway)
1. Push code to GitHub.
2. Connect repository to Render/Railway.
3. Build Command: `npm install`.
4. Start Command: `node server.js`.
5. Add Environment Variables from `.env` (RAZORPAY keys).

## 💎 Premium Features
The payment integration is set to Test Mode by default. Use Razorpay test card details to simulate payments.

## 🔐 Authentication Setup

This app uses a full JWT-based authentication system with Google Login support.

### Environment Variables

**Backend (`backend/.env`)**:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

**Frontend (`frontend/.env`)**:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Features
- **Secure Login/Signup**: Email & Password with secure hasing.
- **Google OAuth**: One-click login.
- **Forgot Password**: OTP-based password reset via Email.
- **Protected Downloads**: Resume PDF download is restricted to logged-in users.
