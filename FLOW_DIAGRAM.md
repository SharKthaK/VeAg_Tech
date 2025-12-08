# VeAg Application Flow Diagram

## Visual Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         LANDING PAGE (/)                         │
│                                                                  │
│                      ╔════════════════╗                         │
│                      ║     VeAg       ║                         │
│                      ╚════════════════╝                         │
│                                                                  │
│                      [    Start    ]                            │
│                                                                  │
│    Background: Green gradient (dark → light)                    │
│    State: Public (No authentication required)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                         Click "Start"
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       LOGIN PAGE (/login)                        │
│                                                                  │
│                   Welcome to VeAg                               │
│                                                                  │
│            [ 🔐 Sign In with Google ]                          │
│                                                                  │
│    Background: Light green gradient                             │
│    State: Public (No authentication required)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                   Click "Sign In with Google"
                              ↓
                   ┌──────────────────────┐
                   │  Firebase Auth Popup  │
                   │  Google Sign In       │
                   └──────────────────────┘
                              ↓
                   User signs in with Google
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION PROCESS                        │
│                                                                  │
│  1. Firebase returns user data:                                 │
│     - email, name, photoURL, firebaseUid                       │
│                                                                  │
│  2. Frontend sends POST /api/users/auth                        │
│                                                                  │
│  3. Backend checks MongoDB by email:                           │
│     - If new: Create user with auto-generated userId           │
│     - If exists: Return existing user data                     │
│                                                                  │
│  4. Frontend receives userId                                    │
│                                                                  │
│  5. Cache user data in localStorage (7 days)                   │
│                                                                  │
│  6. Update AuthContext with user data                          │
│                                                                  │
│  7. Redirect to Dashboard                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Authentication Complete
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   DASHBOARD (/dashboard) 🔒                     │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  VeAg          [Profile Photo] User Name    [Logout]     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│                        Dashboard                                 │
│                                                                  │
│    ┌─────────────────┐       ┌─────────────────┐              │
│    │   📝            │       │   📂            │              │
│    │  Register New   │       │  Manage Old     │              │
│    │     Case        │       │     Cases       │              │
│    └─────────────────┘       └─────────────────┘              │
│                                                                  │
│    ┌─────────────────┐       ┌─────────────────┐              │
│    │   👤            │       │   💳            │              │
│    │  Edit Profile   │       │  Manage         │              │
│    │                 │       │  Subscription   │              │
│    └─────────────────┘       └─────────────────┘              │
│                                                                  │
│    Background: Light green gradient                             │
│    State: Protected (Authentication required)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Click any button
                              ↓
        ┌────────────┬────────────┬────────────┬────────────┐
        ↓            ↓            ↓            ↓            
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│REGISTER CASE│ │MANAGE CASES  │ │EDIT PROFILE  │ │SUBSCRIPTION  │
│   🔒         │ │    🔒        │ │    🔒        │ │    🔒        │
│              │ │              │ │              │ │              │
│[←Dashboard]  │ │[←Dashboard]  │ │[←Dashboard]  │ │[←Dashboard]  │
│              │ │              │ │              │ │              │
│Feature:      │ │Feature:      │ │Shows:        │ │Feature:      │
│Coming Soon   │ │Coming Soon   │ │- User ID     │ │Coming Soon   │
│              │ │              │ │- Name        │ │              │
│              │ │              │ │- Email       │ │              │
│              │ │              │ │- Photo       │ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

## Authentication State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                      AuthContext (Global State)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  State:                                                         │
│  ├─ currentUser: {                                             │
│  │    email, name, photoURL, firebaseUid, userId              │
│  │  }                                                           │
│  ├─ loading: boolean                                           │
│                                                                  │
│  Methods:                                                       │
│  ├─ signInWithGoogle()                                         │
│  ├─ signOut()                                                  │
│  ├─ getCachedUser()                                            │
│  └─ cacheUser()                                                │
│                                                                  │
│  Cache Storage:                                                 │
│  └─ localStorage['veag_auth_user']                            │
│      ├─ user: { ...user data }                                │
│      ├─ timestamp: 1234567890                                 │
│      └─ expiry: 7 days                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Protected Route Logic

```
┌─────────────────────────────────────────────────────────────────┐
│                    ProtectedRoute Component                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User tries to access protected page                           │
│          ↓                                                      │
│  Check: Is loading?                                            │
│          ├─ Yes → Show "Loading..."                            │
│          └─ No  → Continue                                      │
│                ↓                                                │
│  Check: Is currentUser exists?                                 │
│          ├─ Yes → Render requested page                        │
│          └─ No  → Redirect to /login                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## User Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Firebase   │────>│   Frontend   │────>│   MongoDB    │
│              │     │              │     │              │
│ Google Auth  │     │ AuthContext  │     │ users        │
│              │     │ localStorage │     │ collection   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                     │
       │                    │                     │
       ↓                    ↓                     ↓
  firebaseUid          Current Session        Persistent
  email, name          User State            User Record
  photoURL             (7-day cache)          with userId
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB - users Collection                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Document Structure:                                            │
│                                                                  │
│  {                                                              │
│    _id: ObjectId("..."),              [MongoDB ID]             │
│    userId: "USER_1702050123_X7K9M",   [Auto-generated]        │
│    email: "user@gmail.com",           [Unique, from Google]    │
│    name: "John Doe",                  [From Google]            │
│    photoURL: "https://...",           [From Google]            │
│    firebaseUid: "abc123...",          [From Firebase]          │
│    createdAt: ISODate("2025-12-08"),  [Auto timestamp]        │
│    updatedAt: ISODate("2025-12-08")   [Auto timestamp]        │
│  }                                                              │
│                                                                  │
│  Indexes:                                                       │
│  ├─ userId (unique)                                            │
│  ├─ email (unique)                                             │
│  └─ firebaseUid (unique)                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## API Communication

```
┌──────────────┐                           ┌──────────────┐
│   Frontend   │                           │   Backend    │
│ localhost:   │                           │ localhost:   │
│   5173       │                           │   5000       │
└──────────────┘                           └──────────────┘
       │                                           │
       │  POST /api/users/auth                    │
       │  { email, name, photoURL, firebaseUid }  │
       │──────────────────────────────────────────>│
       │                                           │
       │                                    Check MongoDB
       │                                    by email
       │                                           │
       │                                    Create or fetch
       │                                    user with userId
       │                                           │
       │  { userId, user: {...} }                 │
       │<──────────────────────────────────────────│
       │                                           │
   Store in                                   Store in
   localStorage                                MongoDB
   & Context                                       │
       │                                           │
       │  GET /api/users/:userId                  │
       │──────────────────────────────────────────>│
       │                                           │
       │  { user: {...} }                         │
       │<──────────────────────────────────────────│
       │                                           │
```

## Color Palette

```
┌────────────────────────────────────────────────────────────┐
│                    VeAg Color Scheme                        │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Primary Green (veag-green):                               │
│  #10b981  ████████████  Used for buttons, accents         │
│                                                             │
│  Dark Green (veag-dark-green):                             │
│  #065f46  ████████████  Used for headers, text            │
│                                                             │
│  Light Green (veag-light-green):                           │
│  #d1fae5  ████████████  Used for backgrounds, highlights  │
│                                                             │
│  White:                                                     │
│  #ffffff  ████████████  Used for cards, text on dark      │
│                                                             │
│  Gradients:                                                 │
│  ├─ Dark → Light: Landing page                            │
│  ├─ Green → Dark Green: Buttons, header                   │
│  └─ Light Green → White: Page backgrounds                 │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

## Session Persistence

```
┌─────────────────────────────────────────────────────────────────┐
│                    7-Day Cache Mechanism                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Day 0: User logs in                                           │
│    └─> Data stored in localStorage with timestamp              │
│                                                                  │
│  Day 1-6: User returns                                         │
│    ├─> AuthContext checks localStorage                         │
│    ├─> Calculates time difference                              │
│    ├─> If < 7 days: Restore session                           │
│    └─> User stays logged in                                    │
│                                                                  │
│  Day 7+: Cache expires                                         │
│    ├─> Time difference > 7 days                                │
│    ├─> Clear localStorage                                      │
│    └─> Redirect to login                                       │
│                                                                  │
│  Manual Logout:                                                 │
│    ├─> Clear localStorage immediately                          │
│    ├─> Sign out from Firebase                                  │
│    └─> Clear AuthContext                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Routing Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                      React Router Structure                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  App.jsx                                                        │
│  └─ <Router>                                                    │
│     └─ <AuthProvider>                                           │
│        └─ <Routes>                                              │
│           ├─ / ──────────────────→ <Landing />                 │
│           ├─ /login ──────────────→ <Login />                  │
│           ├─ /dashboard ──────────→ <ProtectedRoute>           │
│           │                          <Dashboard />              │
│           │                         </ProtectedRoute>           │
│           ├─ /register-case ───────→ <ProtectedRoute>          │
│           │                          <RegisterCase />           │
│           │                         </ProtectedRoute>           │
│           ├─ /manage-cases ────────→ <ProtectedRoute>          │
│           │                          <ManageCases />            │
│           │                         </ProtectedRoute>           │
│           ├─ /edit-profile ────────→ <ProtectedRoute>          │
│           │                          <EditProfile />            │
│           │                         </ProtectedRoute>           │
│           └─ /manage-subscription ─→ <ProtectedRoute>          │
│                                      <ManageSubscription />     │
│                                     </ProtectedRoute>           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**This visual guide provides a complete overview of the VeAg application architecture, data flow, and user experience.**
