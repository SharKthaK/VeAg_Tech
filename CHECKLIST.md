# VeAg Setup Checklist

Use this checklist to ensure you've completed all setup steps correctly.

## ✅ Prerequisites

- [ ] Node.js installed (v18 or higher)
- [ ] npm or yarn package manager
- [ ] MongoDB installed locally OR MongoDB Atlas account created
- [ ] Firebase account created
- [ ] Google account for testing

## ✅ Firebase Configuration

- [ ] Firebase project created
- [ ] Google Authentication enabled in Firebase Console
- [ ] Firebase config values copied (apiKey, authDomain, projectId, etc.)
- [ ] Test email added to authorized users (if needed)

## ✅ Server Setup

- [ ] Navigated to `server` folder
- [ ] Ran `npm install`
- [ ] Created `.env` file from `.env.example`
- [ ] Added MongoDB connection string to `.env`
- [ ] MongoDB is running (if using local)

## ✅ Client Setup

- [ ] Navigated to `client` folder
- [ ] Ran `npm install`
- [ ] Created `.env` file from `.env.example`
- [ ] Added all Firebase config values to `.env`
- [ ] Verified `VITE_API_URL` points to server (http://localhost:5000)

## ✅ Running the Application

- [ ] Server started with `npm run dev` in server folder
- [ ] Server running on http://localhost:5000
- [ ] Client started with `npm run dev` in client folder
- [ ] Client running on http://localhost:5173
- [ ] No console errors in terminal or browser

## ✅ Testing Authentication

- [ ] Landing page loads at http://localhost:5173
- [ ] VeAg heading visible on landing page
- [ ] "Start" button clickable
- [ ] Redirects to login page
- [ ] "Sign In with Google" button visible
- [ ] Google sign-in popup opens
- [ ] Successfully signed in with Google account
- [ ] Redirected to dashboard after login
- [ ] User profile photo and name visible in header
- [ ] All 4 dashboard buttons visible and clickable

## ✅ Testing Protected Routes

- [ ] Dashboard accessible after login
- [ ] Register New Case page opens
- [ ] Manage Old Cases page opens
- [ ] Edit Profile page opens (shows user info)
- [ ] Manage Subscription page opens
- [ ] All pages have back to dashboard link
- [ ] Logout button works on all pages

## ✅ Testing Cache & Persistence

- [ ] After login, refresh the page
- [ ] Still logged in (not redirected to login)
- [ ] Close browser and reopen
- [ ] Still logged in (cache working)
- [ ] Click logout
- [ ] Redirected to landing page
- [ ] Manual navigation to /dashboard redirects to /login

## ✅ Database Verification

- [ ] Check MongoDB for `veag` database
- [ ] Check `users` collection exists
- [ ] User document created with auto-generated userId
- [ ] User document contains: email, name, photoURL, firebaseUid
- [ ] Each login creates only one user per unique email

## ✅ UI/UX Verification

- [ ] Green gradient backgrounds working
- [ ] White and green color scheme throughout
- [ ] Buttons have hover effects
- [ ] Smooth transitions and animations
- [ ] Responsive design on mobile (optional test)
- [ ] All text readable and properly styled

## 🐛 Common Issues & Solutions

### Issue: Firebase authentication fails
**Solution:** 
- Verify all Firebase config values in client/.env
- Check Google Auth is enabled in Firebase Console
- Try clearing browser cache and cookies

### Issue: Cannot connect to MongoDB
**Solution:**
- Check if MongoDB service is running
- Verify connection string in server/.env
- For Atlas: Check IP whitelist and credentials

### Issue: CORS errors in browser console
**Solution:**
- Verify server is running on port 5000
- Check VITE_API_URL in client/.env is correct
- Server CORS is already configured, restart if needed

### Issue: "Logout" redirects but can't login again
**Solution:**
- Clear browser localStorage
- Clear browser cookies for localhost
- Restart both server and client

### Issue: Changes not reflecting
**Solution:**
- Both server and client have hot-reload
- Try manually refreshing browser (Ctrl+R)
- Check terminal for any compilation errors

## 📝 Next Steps After Setup

Once all items above are checked:

1. ✅ Application is fully functional
2. 🔧 Ready for feature development
3. 📚 Review PROJECT_STRUCTURE.md for code organization
4. 💡 Start implementing the placeholder pages:
   - Register New Case functionality
   - Manage Old Cases functionality
   - Edit Profile capabilities
   - Manage Subscription system

## 🎉 Success Criteria

Your setup is complete when:
- ✅ You can access landing page
- ✅ You can sign in with Google
- ✅ Dashboard shows with your profile
- ✅ All 4 navigation pages are accessible
- ✅ Logout works correctly
- ✅ Login persists for 7 days
- ✅ User data is stored in MongoDB

---

**Need Help?**
- Check SETUP.md for detailed instructions
- Review error messages in browser console (F12)
- Check terminal output for server errors
- Verify all environment variables are set correctly
