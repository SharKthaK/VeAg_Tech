# VeAg Project Structure

```
VeAg_Project/
│
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx   # Route protection wrapper
│   │   │
│   │   ├── config/
│   │   │   └── firebase.js          # Firebase configuration
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # Auth state management + 7-day cache
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Landing page with "Start" button
│   │   │   ├── Login.jsx            # Google Sign In page
│   │   │   ├── Dashboard.jsx        # Main dashboard with 4 buttons
│   │   │   ├── RegisterCase.jsx     # Register New Case page
│   │   │   ├── ManageCases.jsx      # Manage Old Cases page
│   │   │   ├── EditProfile.jsx      # Edit Profile page
│   │   │   └── ManageSubscription.jsx # Manage Subscription page
│   │   │
│   │   ├── App.jsx                  # Main app with routing
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Tailwind CSS imports
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js           # Tailwind with green theme
│   ├── postcss.config.js
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
│
├── server/                          # Express Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   │
│   ├── models/
│   │   └── User.js                  # User schema with auto-generated userId
│   │
│   ├── controllers/
│   │   └── userController.js        # User CRUD operations
│   │
│   ├── routes/
│   │   └── userRoutes.js            # User API endpoints
│   │
│   ├── server.js                    # Express server entry point
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
│
├── README.md                        # Main project README
├── SETUP.md                         # Detailed setup guide
└── install.ps1                      # PowerShell installation script
```

## Key Features Implementation

### Authentication Flow
```
Landing Page (/)
    ↓ [Click "Start"]
Login Page (/login)
    ↓ [Google Sign In via Firebase]
    ↓ [Store user in MongoDB with unique userId]
    ↓ [Cache auth for 7 days in localStorage]
Dashboard (/dashboard) [PROTECTED]
    ↓
    ├── /register-case [PROTECTED]
    ├── /manage-cases [PROTECTED]
    ├── /edit-profile [PROTECTED]
    └── /manage-subscription [PROTECTED]
```

### User Data Storage
```
Firebase Auth
    ↓ User signs in with Google
    ↓ Get: email, name, photoURL, firebaseUid
    ↓
MongoDB
    ↓ Create/Update user with:
    ├── userId (auto-generated: USER_timestamp_random)
    ├── email (unique identifier)
    ├── name
    ├── photoURL
    ├── firebaseUid
    ├── createdAt
    └── updatedAt
```

### Tech Stack

**Frontend:**
- React 18 (UI library)
- Vite (build tool)
- React Router DOM (routing)
- Firebase Auth (authentication)
- Tailwind CSS + PostCSS (styling)
- Axios (HTTP client)

**Backend:**
- Node.js + Express (server)
- MongoDB + Mongoose (database)
- Express Validator (validation)
- CORS (cross-origin requests)

**State Management:**
- Context API (AuthContext)
- localStorage (7-day cache)

## API Endpoints

```
POST   /api/users/auth              # Authenticate/create user
GET    /api/users/:userId           # Get user by userId
GET    /api/users/email/:email      # Get user by email
PUT    /api/users/:userId           # Update user profile
GET    /api/health                  # Health check
```

## Color Theme

- Primary: `#10b981` (veag-green)
- Dark: `#065f46` (veag-dark-green)
- Light: `#d1fae5` (veag-light-green)
- Background: White with green gradients
