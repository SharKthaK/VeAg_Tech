# VeAg Project Setup Guide

Follow these steps to get the VeAg application running on your machine.

## Step 1: Install Dependencies

### Server Setup
```bash
cd server
npm install
```

### Client Setup
```bash
cd client
npm install
```

## Step 2: Configure Firebase

1. Go to https://console.firebase.google.com/
2. Create a new project (or select existing)
3. Enable Google Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Add your email as test user
4. Get Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click the web icon (</>)
   - Copy the config values

## Step 3: Configure Environment Variables

### Client Environment (.env in client folder)

Create a `.env` file in the client folder and add:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000
```

### Server Environment (.env in server folder)

Create a `.env` file in the server folder and add:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/veag
```

Or for MongoDB Atlas:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/veag
```

## Step 4: Setup MongoDB

### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Create database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string and add to server/.env

## Step 5: Run the Application

### Terminal 1 - Start Server
```bash
cd server
npm run dev
```
Server will run on http://localhost:5000

### Terminal 2 - Start Client
```bash
cd client
npm run dev
```
Client will run on http://localhost:5173

## Step 6: Test the Application

1. Open http://localhost:5173 in your browser
2. Click "Start" button
3. Click "Sign In with Google"
4. Sign in with your Google account
5. You should be redirected to the dashboard

## Troubleshooting

### Firebase Issues
- Make sure Google Auth is enabled in Firebase Console
- Check that all Firebase config values are correct in .env
- Verify your domain is authorized (localhost should work by default)

### MongoDB Issues
- Check if MongoDB is running
- Verify connection string in server/.env
- For Atlas, ensure IP is whitelisted

### CORS Issues
- Server is configured with CORS enabled
- Make sure VITE_API_URL in client/.env matches server URL

### Port Already in Use
If port 5000 or 5173 is in use:
- Change PORT in server/.env
- Update VITE_API_URL in client/.env accordingly

## Project Features

✅ Landing page with VeAg branding
✅ Google Sign In authentication
✅ 7-day login cache (localStorage)
✅ Protected routes
✅ User data stored in MongoDB with auto-generated IDs
✅ Dashboard with 4 navigation options
✅ Green-themed UI with gradients
✅ Responsive design

## Next Development Steps

The following pages are placeholders ready for implementation:
- Register New Case
- Manage Old Cases
- Edit Profile
- Manage Subscription

Each page has the basic structure with header, navigation, and logout functionality.
