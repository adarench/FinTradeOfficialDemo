import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, DEFAULT_AVATAR } from '../firebase';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    // Set loading state immediately
    setLoading(true);
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
      console.warn("Auth state change timed out after 5 seconds");
    }, 5000);
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);
      
      try {
        if (user) {
          // User is signed in - immediately update UI state
          setCurrentUser(user);
          
          // Get user profile from Firestore in background
          const userDocRef = doc(db, 'users', user.uid);
          
          // First check if we need to wait for the user doc
          getDoc(userDocRef).then(userDoc => {
            if (userDoc.exists()) {
              // User profile exists in Firestore
              setUserProfile(userDoc.data());
            } else {
              // Create a basic profile in case it's missing
              const basicProfile = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email?.split('@')[0] || 'User',
                photoURL: user.photoURL || DEFAULT_AVATAR,
                emailVerified: user.emailVerified,
                following: [],
                followers: []
              };
              
              setUserProfile(basicProfile);
            }
          }).catch(err => {
            console.error("Error fetching user profile:", err);
            // Provide a fallback profile even if Firestore fails
            setUserProfile({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'User',
              photoURL: user.photoURL || DEFAULT_AVATAR
            });
          }).finally(() => {
            setLoading(false);
          });
        } else {
          // User is signed out
          setCurrentUser(null);
          setUserProfile(null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error in auth state change:", err);
        setError(err.message);
        setLoading(false);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  // Context value
  const value = {
    currentUser,
    userProfile,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};