# 🚀 Deployment Guide - Nursery E-Commerce

## ✅ Pre-Deployment Checklist

### 1. Files Created
- ✅ `vercel.json` - Deployment configuration
- ✅ `client/src/config/api.js` - Environment-aware API URLs

### 2. Code Updated
- ✅ All `http://localhost:5000` URLs replaced with `API_BASE_URL`
- ✅ Frontend automatically uses `/api` in production
- ✅ Backend configured as serverless functions

---

## 📦 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Vercel configuration and production API setup"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Import Project"**
3. Select your GitHub repository: `ecommerce_web`
4. Vercel will auto-detect the configuration from `vercel.json`
5. Click **"Deploy"**

### Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Production |
| `JWT_SECRET` | `your-secret-key-here` | Production |

> **Important**: Use MongoDB Atlas (cloud) for production, not localhost!

---

## 🔧 MongoDB Atlas Setup (Required for Production)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a **Free Cluster**
3. Create Database User (remember username/password)
4. **Network Access** → Add `0.0.0.0/0` (allow from anywhere)
5. Click **Connect** → **Connect your application**
6. Copy connection string and update:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/nursery_ecommerce
   ```

---

## 🌐 How It Works

### Development (localhost)
```javascript
// client/src/config/api.js
// Returns: 'http://localhost:5000/api'
```

### Production (Vercel)
```javascript
// client/src/config/api.js  
// Returns: '/api' (same domain)
```

**Routing:**
- **Frontend**: `https://your-app.vercel.app/` → Vue.js SPA
- **Backend**: `https://your-app.vercel.app/api/*` → Express serverless functions

---

## 🧪 Testing Deployment

### After Deployment:
1. **Homepage**: Should load with categories
2. **Login**: Should connect to MongoDB Atlas
3. **Products**: Should fetch from database
4. **Admin**: `admin@nursery.com` / `admin123` (run `createAdmin.js` on deployed DB)

### Create Admin User in Production:
Run this script with production MongoDB URI:
```bash
# Update server/.env with production MONGODB_URI
# Then run:
cd server
node createAdmin.js
```

---

## ⚠️ Common Issues

### Issue 1: "DEPLOYMENT_NOT_FOUND"
**Solution**: Already fixed with `vercel.json` configuration

### Issue 2: API not connecting
**Solution**: 
- Check environment variables in Vercel
- Ensure MongoDB Atlas allows connections from anywhere
- Check Network tab in browser DevTools

### Issue 3: CORS errors
**Solution**: Update `server/index.js` CORS config:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
```

---

## 📊 Deployment Architecture

```
Vercel Deployment
├─ Frontend (Static CDN)
│  └─ Vue.js built files from client/dist
│
└─ Backend (Serverless Functions)
   └─ Express API from server/index.js
```

---

## 🔄 Re-Deploying Updates

Every time you push to GitHub `main` branch:
1. Vercel automatically triggers new deployment
2. Frontend rebuilds from `client/`
3. Backend updates serverless functions
4. Live in ~2 minutes

---

## 📝 Next Steps

1. ✅ Push code to GitHub
2. ✅ Import to Vercel
3. ✅ Add environment variables
4. ✅ Setup MongoDB Atlas
5. ✅ Test deployment
6. 🎉 Your app is live!

**Your production URL will be**: `https://ecommerce-web-xxx.vercel.app`

---

## 💡 Production Optimizations (Optional)

- Add custom domain in Vercel settings
- Enable Vercel Analytics
- Setup MongoDB indexes for faster queries
- Add error monitoring (Sentry)
- Enable Vercel caching for static assets

**Happy Deploying! 🚀**
