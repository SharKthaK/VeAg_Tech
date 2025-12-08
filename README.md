# VeAg Project

A MERN stack application with Firebase authentication, Tailwind CSS, and protected routes.

## Project Structure

```
VeAg_Project/
├── client/          # React frontend application
└── server/          # Express.js backend server
```

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas account)
- Firebase project with Google Authentication enabled

### 1. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Google Authentication in Authentication > Sign-in method
4. Get your Firebase configuration from Project Settings

### 2. Setup Server

```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your MongoDB URI
npm run dev
```

Server will run on http://localhost:5000

### 3. Setup Client

```bash
cd client
npm install
cp .env.example .env
# Edit .env and add your Firebase configuration
npm run dev
```

Client will run on http://localhost:5173

## Features

### Authentication
- Landing page with "Start" button
- Google Sign In with Firebase
- 7-day authentication cache
- Protected routes for authenticated users

### User Management
- Auto-generated unique user IDs
- User data stored in MongoDB
- Email-based user identification
- Profile information from Google

### Dashboard
- Register New Case
- Manage Old Cases
- Edit Profile
- Manage Subscription
- Logout functionality

### UI/UX
- Green-themed design with gradients
- Clean and simple interface
- Responsive design with Tailwind CSS
- Smooth transitions and hover effects

## Technology Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Firebase Authentication
- Tailwind CSS with PostCSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Express Validator
- CORS

## Environment Configuration

### Client (.env)
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000
```

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/veag
```

## Development

Both client and server use hot-reload for development:

- Client: Vite dev server with HMR
- Server: Node.js with --watch flag

## Next Steps

The following features are placeholders and ready for implementation:
- Register New Case functionality
- Manage Old Cases functionality
- Edit Profile capabilities
- Manage Subscription system
