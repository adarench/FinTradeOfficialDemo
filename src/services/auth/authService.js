import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, DEFAULT_AVATAR } from '../../firebase';

/**
 * Create a new user account with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User display name
 * @returns {Promise<Object>} - User data
 */
export const registerUser = async (email, password, name) => {
  try {
    // Create the user account in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user profile with display name - don't await this
    const profilePromise = updateProfile(user, {
      displayName: name,
      photoURL: DEFAULT_AVATAR
    }).catch(err => console.error("Error updating profile:", err));
    
    // Send email verification - don't await this
    const verificationPromise = sendEmailVerification(user)
      .catch(err => console.error("Error sending verification email:", err));
    
    // Create user document in Firestore - don't await this
    const firestorePromise = setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: DEFAULT_AVATAR,
      createdAt: serverTimestamp(),
      emailVerified: false,
      trades: [],
      following: [],
      followers: []
    }).catch(err => console.error("Error creating user document:", err));
    
    // Return the user object immediately without waiting for the above operations
    const userObj = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: DEFAULT_AVATAR
    };
    
    // These operations will continue in the background
    Promise.all([profilePromise, verificationPromise, firestorePromise])
      .then(() => console.log("All registration operations completed"))
      .catch(err => console.error("Some registration operations failed:", err));
    
    return userObj;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

/**
 * Sign in a user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - User data
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Immediately return the user object
    const userObj = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    
    // Handle Firestore operations in the background
    (async () => {
      try {
        // Get user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        // If the user document doesn't exist yet, create it
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || email.split('@')[0],
            photoURL: user.photoURL || DEFAULT_AVATAR,
            createdAt: serverTimestamp(),
            emailVerified: user.emailVerified,
            trades: [],
            following: [],
            followers: []
          });
        }
        
        // Update email verification status if needed
        else if (user.emailVerified && userDoc.exists() && !userDoc.data().emailVerified) {
          await updateDoc(doc(db, 'users', user.uid), {
            emailVerified: true
          });
        }
      } catch (err) {
        console.error("Background Firestore operations failed:", err);
      }
    })();
    
    return userObj;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

/**
 * Log out the current user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

/**
 * Update user profile information
 * @param {Object} userData - User data to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");
    
    const { displayName, photoURL } = userData;
    
    // Update Auth profile
    await updateProfile(user, {
      displayName: displayName || user.displayName,
      photoURL: photoURL || user.photoURL
    });
    
    // Update Firestore document
    await updateDoc(doc(db, 'users', user.uid), {
      displayName: displayName || user.displayName,
      photoURL: photoURL || user.photoURL,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Update user email
 * @param {string} newEmail - New email address
 * @param {string} password - Current password for verification
 * @returns {Promise<void>}
 */
export const updateUserEmail = async (newEmail, password) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");
    
    // Re-authenticate user first
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    
    // Update email in Auth
    await updateEmail(user, newEmail);
    
    // Send verification email for new address
    await sendEmailVerification(user);
    
    // Update Firestore document
    await updateDoc(doc(db, 'users', user.uid), {
      email: newEmail,
      emailVerified: false,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating email:", error);
    throw error;
  }
};

/**
 * Update user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");
    
    // Re-authenticate user first
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};