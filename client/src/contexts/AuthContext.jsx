import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import axios from 'axios';

const AuthContext = createContext();

const CACHE_KEY = 'veag_auth_user';
const CACHE_EXPIRY_DAYS = 7;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get cached user data
  const getCachedUser = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { user, timestamp } = JSON.parse(cached);
        const now = new Date().getTime();
        const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        
        if (now - timestamp < expiryTime) {
          return user;
        } else {
          localStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (error) {
      // console.error('Error reading cached user:', error);
    }
    return null;
  };

  // Cache user data
  const cacheUser = (user) => {
    try {
      const cacheData = {
        user,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      // console.error('Error caching user:', error);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Force refresh to get the latest photoURL from Firebase
      await user.reload();
      const freshUser = auth.currentUser;
      
      // Send user data to backend
      const userData = {
        email: freshUser.email,
        name: freshUser.displayName,
        photoURL: freshUser.photoURL,
        firebaseUid: freshUser.uid
      };
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/auth`,
        userData
      );
      
      // Use data from database but keep fresh photoURL from Firebase
      const userWithId = {
        email: response.data.user.email,
        name: response.data.user.name,
        photoURL: freshUser.photoURL, // Use fresh photoURL from Firebase
        firebaseUid: response.data.user.firebaseUid,
        userId: response.data.userId
      };
      
      cacheUser(userWithId);
      setCurrentUser(userWithId);
      
      return userWithId;
    } catch (error) {
      // console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem(CACHE_KEY);
      setCurrentUser(null);
    } catch (error) {
      // console.error('Error signing out:', error);
      throw error;
    }
  };

  // Update user name in context and cache
  const updateUserName = (newName) => {
    const updatedUser = { ...currentUser, name: newName };
    setCurrentUser(updatedUser);
    cacheUser(updatedUser);
  };

  useEffect(() => {
    // Check for cached user first
    const cached = getCachedUser();
    if (cached) {
      setCurrentUser(cached);
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Force refresh to get the latest photoURL from Firebase
          await user.reload();
          const freshUser = auth.currentUser;
          
          const userData = {
            email: freshUser.email,
            name: freshUser.displayName,
            photoURL: freshUser.photoURL,
            firebaseUid: freshUser.uid
          };
          
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/users/auth`,
            userData
          );
          
          // Use data from database but keep fresh photoURL from Firebase
          const userWithId = {
            email: response.data.user.email,
            name: response.data.user.name,
            photoURL: freshUser.photoURL, // Use fresh photoURL from Firebase
            firebaseUid: response.data.user.firebaseUid,
            userId: response.data.userId
          };
          
          cacheUser(userWithId);
          setCurrentUser(userWithId);
        } catch (error) {
          // console.error('Error fetching user data:', error);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem(CACHE_KEY);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signOut,
    updateUserName
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
