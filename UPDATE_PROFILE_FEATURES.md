# VeAg Update - Profile Management Features

## New Features Implemented

### 1. ✅ PhotoURL Auto-Update on Sign-In
**Description:** The user's profile photo URL from Google is now automatically updated in MongoDB every time they sign in.

**Implementation:**
- Modified `authenticateUser` in `userController.js`
- Compares current photoURL with stored photoURL
- Updates MongoDB if changed
- Returns updated user data

**Why this matters:** Google profile photos can change over time. This ensures the app always displays the current profile picture.

---

### 2. ✅ Profile Photo Loader
**Description:** A spinning loader is displayed while profile photos are loading instead of showing "Profile" text or blank space.

**Implementation:**
- Created reusable `Header` component with loader
- Uses `onLoad` event to detect when image finishes loading
- Shows green spinning loader while image loads
- Smooth opacity transition when image is ready

**Components Updated:**
- `Dashboard.jsx`
- `EditProfile.jsx`
- `RegisterCase.jsx`
- `ManageCases.jsx`
- `ManageSubscription.jsx`
- New: `Header.jsx` (reusable component)

---

### 3. ✅ Edit Profile with Name Change
**Description:** Users can now edit their name in the Edit Profile page. The interface provides:
- View mode (default): Name displayed with "Edit" button
- Edit mode: Editable text field with "Save" and "Cancel" buttons
- Success/error messages
- Real-time validation

**Features:**
- Minimum 2 characters validation
- No-change detection
- Loading states during save
- Updates reflected immediately across the app
- User-friendly error messages

---

### 4. ✅ Name Change History Tracking
**Description:** All name changes are tracked in a separate MongoDB collection with full history.

**New Collection:** `namehistories`

**Schema:**
```javascript
{
  userId: String (indexed),
  oldName: String,
  newName: String,
  changedAt: Date
}
```

**Display Features:**
- Shows chronological history of all name changes
- Displays old name → new name
- Shows timestamp of each change
- Green-themed cards for visual consistency
- Sorted by newest first

---

## API Changes

### Updated Endpoint
**PUT /api/users/:userId**
- Now only accepts `name` field
- `photoURL` removed (auto-updated from Google)
- Creates history entry on name change
- Returns updated user data

### New Endpoint
**GET /api/users/:userId/name-history**
- Returns array of name changes
- Sorted by date (newest first)
- Includes: oldName, newName, changedAt, userId

---

## Database Structure

### users Collection (Modified)
- `photoURL` now auto-updated on each sign-in
- Name can be changed by user

### namehistories Collection (New)
```json
{
  "_id": ObjectId,
  "userId": "USER_1234567890_ABC",
  "oldName": "John Doe",
  "newName": "John Smith",
  "changedAt": "2025-12-08T10:30:00.000Z"
}
```

**Indexes:**
- `userId` (for fast queries by user)
- `userId + changedAt` (for sorted history)

---

## User Experience Flow

### Sign In Process
1. User signs in with Google
2. Frontend receives photoURL from Firebase
3. Backend checks if photoURL changed
4. If changed: Update in MongoDB
5. Return updated user data
6. Cache updated data in localStorage

### Edit Profile Process
1. User navigates to Edit Profile
2. Sees current name with "Edit" button
3. Clicks "Edit" → text field becomes editable
4. Changes name and clicks "Save"
5. Validation runs (min 2 chars, not empty)
6. API call to update name
7. Creates entry in name history collection
8. Updates user document in MongoDB
9. Updates AuthContext and localStorage
10. Success message shown
11. Name history list refreshes automatically

### Profile Photo Loading
1. Profile photo URL loaded from currentUser
2. Spinner shows immediately
3. Image loads in background (opacity: 0)
4. onLoad event fires when ready
5. Spinner fades out
6. Image fades in (opacity: 100)

---

## Files Modified

### Backend
1. **server/models/NameHistory.js** (NEW)
   - New model for tracking name changes

2. **server/controllers/userController.js**
   - Updated `authenticateUser` for photoURL updates
   - Modified `updateUserProfile` for name-only updates
   - Added `getNameHistory` function

3. **server/routes/userRoutes.js**
   - Removed `photoURL` from validation
   - Added new route for name history

### Frontend
1. **client/src/components/Header.jsx** (NEW)
   - Reusable header with loader

2. **client/src/contexts/AuthContext.jsx**
   - Added `updateUserName` function
   - Updates context and cache

3. **client/src/pages/Dashboard.jsx**
   - Added image loader functionality

4. **client/src/pages/EditProfile.jsx**
   - Complete redesign with edit functionality
   - Name change form with validation
   - Name history display
   - Profile photo with loader

5. **client/src/pages/RegisterCase.jsx**
   - Now uses Header component

6. **client/src/pages/ManageCases.jsx**
   - Now uses Header component

7. **client/src/pages/ManageSubscription.jsx**
   - Now uses Header component

---

## Technical Details

### Image Loader Implementation
```javascript
const [imageLoaded, setImageLoaded] = useState(false);

// Spinner (shown by default)
{!imageLoaded && currentUser?.photoURL && (
  <div className="spinner"></div>
)}

// Image (hidden until loaded)
<img 
  src={currentUser.photoURL}
  className={imageLoaded ? 'opacity-100' : 'opacity-0'}
  onLoad={() => setImageLoaded(true)}
/>
```

### Name Update with History
```javascript
// 1. Create history entry
const nameHistory = new NameHistory({
  userId: user.userId,
  oldName: user.name,
  newName: name
});
await nameHistory.save();

// 2. Update user
user.name = name;
await user.save();
```

### PhotoURL Auto-Update
```javascript
if (user) {
  // Update photoURL if changed
  if (photoURL && user.photoURL !== photoURL) {
    user.photoURL = photoURL;
    await user.save();
  }
  return user;
}
```

---

## Testing Checklist

- [x] Profile photo loads with spinner
- [x] PhotoURL updates in MongoDB on sign-in
- [x] Edit Profile shows current user data
- [x] Can click "Edit" to enable name editing
- [x] Save button updates name successfully
- [x] Cancel button reverts changes
- [x] Name change creates history entry
- [x] History displays chronologically
- [x] Updated name shows across all pages
- [x] localStorage updates with new name
- [x] Validation prevents short names
- [x] Header component works on all pages
- [x] Image loader appears on all pages

---

## Benefits

### User Benefits
✅ Always see current profile photo
✅ Visual feedback during photo loading
✅ Can customize display name
✅ See complete history of name changes
✅ Smooth, professional UI experience

### System Benefits
✅ Reduced code duplication (Header component)
✅ Better data consistency (photo always current)
✅ Audit trail for name changes
✅ Scalable history system
✅ Better UX with loading states

---

## Future Enhancements

Potential additions based on this foundation:
- Profile photo upload (custom photos)
- Edit other fields (bio, phone, etc.)
- History for all profile changes
- Undo recent name changes
- Export profile history
- Privacy settings for name visibility

---

**All features are now live and ready to use!**
