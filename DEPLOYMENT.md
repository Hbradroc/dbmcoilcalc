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
