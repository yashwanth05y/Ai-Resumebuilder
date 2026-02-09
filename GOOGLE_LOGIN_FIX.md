# 🔐 How to Fix Google Login Error (Error 401: invalid_client)

The error **"Access blocked: Authorization Error"** happens because you haven't set up a Google Cloud Project for your app yet. Google requires every app to register to use their login system.

## ✅ Solution 1: Use Demo Mode (Simplest)
If you just want to test the resume builder, you don't need Google Login!
1. Click **"Sign In"** or try to **Download** your resume.
2. In the Login box, click the **"🧪 Try Demo Mode (Skip Login)"** button at the bottom.
3. This will instantly log you in as a guest user so you can download your resume.

---

## 🔧 Solution 2: Fix Google Login (For Real App)
To make the "Sign in with Google" button work, you need a **Client ID**.

### Step 1: Create a Project
1. Go to **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Click **Select a project** (top left) → **New Project**.
3. Name it `Resume Builder` and click **Create**.

### Step 2: Configure Consent Screen
1. On the left menu, go to **APIs & Services** → **OAuth consent screen**.
2. Select **External** and click **Create**.
3. Fill in:
   - **App Name**: Resume Builder
   - **User Support Email**: Select your email
   - **Developer Contact Email**: Enter your email
4. Click **Save and Continue** (skip Scopes by clicking Save and Continue).
5. On the **Test Users** step, add your own email address so you can test it.

### Step 3: Get Client ID
1. Go to **APIs & Services** → **Credentials**.
2. Click **+ CREATE CREDENTIALS** (top) → **OAuth client ID**.
3. Application Type: **Web application**.
4. Name: `Resume Web Client`.
5. **Authorized JavaScript origins**: `http://localhost:5173`
   *(Press ENTER after pasting!)*
6. **Authorized redirect URIs**: `http://localhost:5173`
   *(Press ENTER after pasting!)*
7. Click **Create**.
8. Copy the **Client ID** (it looks like `12345...apps.googleusercontent.com`).

### Step 4: Add to your Code
1. Open the file `frontend/.env` in your project folder.
2. Paste your ID like this:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_copied_client_id_here
   ```
3. **Restart the frontend terminal** (`Ctrl+C`, then `npm run dev`) for changes to apply.

Now Google Login will work! 🚀
