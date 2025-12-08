# VeAg Quick Reference

## 🚀 Quick Start Commands

### First Time Setup
```powershell
# Run installation script
.\install.ps1

# OR manually install
cd server
npm install
cd ../client
npm install
```

### Start Development
```powershell
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

### Access Application
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **API Health:** http://localhost:5000/api/health

---

## 📝 Configuration Files

### Client `.env`
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000
```

### Server `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/veag
```

---

## 🔥 Firebase Setup Steps

1. Go to: https://console.firebase.google.com/
2. Create/Select project
3. Authentication → Sign-in method → Enable Google
4. Project Settings → General → Your apps → Add web app
5. Copy config to client `.env`

---

## 🍃 MongoDB Setup

### Local MongoDB
```powershell
# Install MongoDB Community Edition
# Start service
net start MongoDB

# Connection string
MONGODB_URI=mongodb://localhost:27017/veag
```

### MongoDB Atlas (Cloud)
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Database Access → Add user
4. Network Access → Add IP (0.0.0.0/0 for dev)
5. Connect → Drivers → Copy connection string
6. Add to server `.env`

---

## 📦 NPM Commands

### Server
```powershell
npm start          # Production mode
npm run dev        # Development with hot-reload
```

### Client
```powershell
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

---

## 🗂️ Project Structure

```
VeAg_Project/
├── client/              # React frontend (port 5173)
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── config/      # Firebase config
│   │   ├── contexts/    # AuthContext
│   │   └── pages/       # All pages
│   └── package.json
│
├── server/              # Express backend (port 5000)
│   ├── config/          # Database config
│   ├── controllers/     # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   └── package.json
│
└── Documentation files
```

---

## 🛣️ Routes

### Public Routes
- `/` - Landing page
- `/login` - Google Sign In

### Protected Routes (require authentication)
- `/dashboard` - Main dashboard
- `/register-case` - Register new case
- `/manage-cases` - Manage old cases
- `/edit-profile` - Edit user profile
- `/manage-subscription` - Manage subscription

---

## 🔌 API Endpoints

```
POST   /api/users/auth              # Authenticate or create user
GET    /api/users/:userId           # Get user by ID
GET    /api/users/email/:email      # Get user by email
PUT    /api/users/:userId           # Update user
GET    /api/health                  # Health check
```

---

## 🎨 Color Variables

```javascript
veag-green: '#10b981'        // Primary green
veag-dark-green: '#065f46'   // Dark green
veag-light-green: '#d1fae5'  // Light green
```

---

## 🔐 Authentication Flow

1. User clicks "Start" on landing page
2. Redirects to login page
3. User clicks "Sign In with Google"
4. Firebase handles Google OAuth
5. Frontend sends user data to backend
6. Backend creates/fetches user from MongoDB
7. User data cached in localStorage (7 days)
8. Redirects to dashboard
9. Protected routes now accessible

---

## 💾 Data Storage

### LocalStorage (Client)
- Key: `veag_auth_user`
- Expiry: 7 days
- Contains: user data + timestamp

### MongoDB (Server)
- Database: `veag`
- Collection: `users`
- Fields: userId, email, name, photoURL, firebaseUid, createdAt, updatedAt

---

## 🛠️ Common Commands

### Check if services are running
```powershell
# MongoDB
Get-Service MongoDB

# Node processes
Get-Process node
```

### Stop all Node processes
```powershell
Stop-Process -Name node -Force
```

### Clear npm cache
```powershell
npm cache clean --force
```

### Reinstall dependencies
```powershell
# Server
cd server
Remove-Item -Recurse -Force node_modules
npm install

# Client
cd client
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 🐛 Troubleshooting

### Port already in use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process by PID
taskkill /PID <PID> /F
```

### Firebase errors
- Verify all config values in `.env`
- Check Google Auth is enabled
- Clear browser cache

### MongoDB connection failed
- Check if MongoDB service is running
- Verify connection string
- For Atlas: Check IP whitelist

### CORS errors
- Verify server is running
- Check `VITE_API_URL` in client `.env`
- Restart both server and client

---

## 📚 Documentation Files

- `README.md` - Project overview
- `SETUP.md` - Detailed setup guide
- `PROJECT_STRUCTURE.md` - Architecture
- `CHECKLIST.md` - Setup verification
- `SUMMARY.md` - Complete implementation details
- `FLOW_DIAGRAM.md` - Visual flow diagrams
- `QUICK_REFERENCE.md` - This file

---

## ✅ Verification Checklist

Quick check to ensure everything works:

1. [ ] Server starts without errors
2. [ ] Client starts without errors
3. [ ] Landing page loads
4. [ ] Can click "Start" button
5. [ ] Login page appears
6. [ ] Google Sign In works
7. [ ] Dashboard loads after login
8. [ ] All 4 buttons clickable
9. [ ] Logout works
10. [ ] Login persists after refresh

---

## 🎯 Next Development Steps

1. Implement Register Case functionality
2. Build Manage Cases with CRUD operations
3. Add Edit Profile capabilities
4. Create Subscription management system
5. Add more features as needed

---

## 🆘 Get Help

If you encounter issues:
1. Check error messages in browser console (F12)
2. Check terminal output for server errors
3. Verify all environment variables are set
4. Review SETUP.md for detailed instructions
5. Check CHECKLIST.md for verification steps

---

**Last Updated:** December 8, 2025
**Version:** 1.0.0
**Status:** Ready for Development
