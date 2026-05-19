<<<<<<< HEAD
# DBM Coil Calculator - Deployment Guide

## Architecture

This is a **hybrid deployment**:
- **Frontend**: React app deployed to **Vercel** (cloud)
- **Backend**: Express server runs locally on your Windows machine (needed for DLL access)

The frontend makes API calls to your local backend.

---

## Step 1: Upload Code to GitHub

### Using GitHub Web Interface (Easiest)

1. **Go to your repo**: https://github.com/Hbradroc/dbmcoilcalc
2. **Click "Add file" → "Upload files"**
3. **Upload all these files and folders**:
   - Root: `.env.example`, `.gitignore`, `package.json`, `README.md`, `INSTALLATION.md`, `DEPLOYMENT.md`, `render.yaml`
   - Entire `backend/` folder (includes `package.json`, `server.js`, `dll-wrapper.js`, `routes/`, `utils/`)
   - Entire `src/` folder (React components)
   - Entire `public/` folder (HTML template)

4. **Commit**: "Add complete DBM Coil Calculator application"

### Using GitHub Desktop (Alternative)

1. Download **GitHub Desktop** (no admin): https://desktop.github.com/
2. Clone your repo locally
3. Copy all your project files into the cloned folder
4. Commit and push via GitHub Desktop UI

---

## Step 2: Deploy Frontend to Vercel

1. Go to **https://vercel.com/dashboard**
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Search for and select `dbmcoilcalc`
5. Configure settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `out` (auto-detected)

6. **Click "Deploy"** - Done! Your frontend is live in ~2 minutes

---

## Step 3: Run Backend Locally

### One-Time Setup:

1. **Open PowerShell** in your project folder
2. Navigate to backend:
   ```powershell
   cd backend
   ```

3. **Download portable Node.js** (if you don't have it):
   - Download from: https://nodejs.org/en/download/
   - Extract to a folder (e.g., `C:\nodejs`)
   - Add to PATH or run using full path

4. **Install dependencies**:
   ```powershell
   # Using full path if Node not in PATH
   C:\nodejs\node-v26.1.0-win-x64\npm install
   ```

5. **Configure `.env`**:
   - Copy `.env.example` to `.env` in the backend folder
   - Update `DLL_PATH` to your actual DLL location

### Running the Backend:

```powershell
# Start the backend server
npm start
# or with full path:
C:\nodejs\node-v26.1.0-win-x64\npm start
```

The backend runs on `http://localhost:5000`

---

## Step 4: Connect Frontend to Backend

In Vercel, add environment variable:

1. Go to **Vercel Dashboard** → Your project → **Settings**
2. Click **"Environment Variables"**
3. Add new variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `http://localhost:5000` (for local development) 
   - OR your backend server URL once deployed

4. **Redeploy** the project

---

## Deployment Summary

| Component | Host | URL | Status |
|-----------|------|-----|--------|
| Frontend (React) | Vercel | https://dbmcoilcalc.vercel.app | ☁️ Cloud |
| Backend (Express) | Your Computer | http://localhost:5000 | 💻 Local |
| DLL | Your Computer | C:\path\to\calldll.dll | 💾 Local |

---

## For Backend on Cloud (Optional - Advanced)

If you want to deploy the backend to the cloud:

### Option 1: AWS EC2 Windows Instance
1. Launch Windows Server EC2 instance
2. Install Node.js on the instance
3. Deploy backend code
4. Configure security groups to allow traffic

### Option 2: Azure Virtual Machine
1. Create Windows VM
2. Install Node.js
3. Deploy backend
4. Configure network rules

### Option 3: Docker + Render (Advanced)
- Create Docker image with Windows Server + Node
- Note: Render currently doesn't support Windows containers in free tier

---

## Troubleshooting

### Frontend deployed but can't reach backend
- Check `REACT_APP_API_URL` environment variable in Vercel
- Ensure backend is running locally on port 5000
- Check firewall settings

### Backend gives DLL errors
- Verify `DLL_PATH` in `.env` is correct
- Ensure all DLL dependencies are in the same folder
- Check that Visual C++ 2017 Runtime is installed

### Port 5000 already in use
- Change `PORT` in `.env` to another port (e.g., 5001)
- Or kill the process: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`

---

## Running Everything Locally (For Development)

If you want to test everything on your machine first:

```powershell
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend (requires Node.js)
npm start
```

Frontend runs on `http://localhost:3000`
Backend runs on `http://localhost:5000`

---

## File Structure After Deployment

```
GitHub (https://github.com/Hbradroc/dbmcoilcalc)
├── backend/
│   ├── package.json       ← Backend dependencies (Windows only)
│   ├── server.js
│   ├── dll-wrapper.js
│   ├── routes/
│   └── utils/
├── src/                   ← React source (deployed to Vercel)
│   ├── components/
│   ├── pages/
│   └── App.js
├── public/
└── package.json           ← Frontend dependencies (for Vercel)

Vercel (https://dbmcoilcalc.vercel.app)
└── Live React frontend

Your Computer (localhost:5000)
└── Running Express + DLL backend
```
=======
# DBM Coil Calculator - Deployment Guide

## Upload to GitHub (No Git Command Needed)

### Method 1: Using GitHub Web Interface (Easiest)

1. **Go to your repo**: https://github.com/Hbradroc/dbmcoilcalc
2. **Click "Add file" → "Upload files"**
3. **Select all files** from your local folder:
   - `.env.example`
   - `.gitignore`
   - `package.json`
   - `README.md`
   - `INSTALLATION.md`
   - `render.yaml` (just created)
   - Entire `backend/` folder
   - Entire `src/` folder
   - Entire `public/` folder

4. **Commit with message**: "Add complete DBM Coil Calculator application"

### Method 2: Using GitHub Desktop (Recommended)

1. **Download GitHub Desktop** (no admin required): https://desktop.github.com/
2. **Clone your repo locally** in GitHub Desktop
3. **Copy all your project files** into the cloned folder
4. **Commit and push** via GitHub Desktop UI

---

## Deploy to Render

### Step 1: Connect Repository
1. Go to https://dashboard.render.com/project/prj-d86aqv6q1p3s73d2fbb0
2. Click **"+ New"** → **"Web Service"**
3. Click **"Connect repository"** 
4. Search for and select `dbmcoilcalc`

### Step 2: Configure Service
Fill in:

| Field | Value |
|-------|-------|
| Name | `coil-calculator-api` |
| Environment | `Node` |
| Build Command | `npm install` |
| Start Command | `npm run server` |
| Instance Type | `Free` |

### Step 3: Add Environment Variables
Under **"Environment"**, add:

```
PORT=5000
NODE_ENV=production
DLL_PATH=/opt/render/project/src/calcdll.dll
```

### Step 4: Deploy Frontend (Optional)

For a complete setup, also deploy the React frontend:

1. Go to **Vercel**: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repo
4. Set **Root Directory**: `./` (or leave blank)
5. Add build settings:
   - **Framework**: React
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

---

## After Deployment

Once deployed, Render will provide you with a URL like:
```
https://coil-calculator-api.onrender.com
```

Use this URL as your `REACT_APP_API_URL` in the frontend.

---

## Important Notes

⚠️ **DLL Support on Render**:
- Render runs on Linux, but your DLL is Windows-only
- Solution: Either:
  1. Keep backend running on local Windows machine
  2. Deploy only the React frontend to Vercel
  3. Use a Windows hosting provider (AWS EC2, Azure VM)

For now, **deploy the React frontend to Vercel** and keep the backend running locally.

---

## Quick Render Deployment Link

After you push code to GitHub, use this to deploy:
[Deploy to Render](https://render.com/deploy?repo=https://github.com/Hbradroc/dbmcoilcalc)

---

Need help with any step? Let me know!
>>>>>>> bfc12cde6c003c10313d7bb9d6a3cc210d063bf4
