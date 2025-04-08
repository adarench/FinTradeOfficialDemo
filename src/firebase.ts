import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Mock user for development (until we implement auth)
export const currentUser = {
  id: 'user123',
  name: 'Demo User',
  avatar: 'https://randomuser.me/api/portraits/men/88.jpg'
};

// Initialize Firebase collections with sample data if needed
export const initializeFirestore = async () => {
  try {
    // Check if collections exist and create sample data if needed
    
    // Comments collection
    const commentsCollection = collection(db, 'comments');
    const commentsSnapshot = await getDocs(commentsCollection);
    
    if (commentsSnapshot.empty) {
      console.log('Creating sample comments');
      // Add sample comments for each trade
      await addDoc(commentsCollection, {
        userId: 'user456',
        userName: 'Jane Trader',
        userAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
        tradeId: 'trade1',
        content: 'Great setup! What was your entry signal?',
        timestamp: Date.now() - 3600000, // 1 hour ago
        reactions: {
          '🔥': ['user789'],
          '🧠': [currentUser.id]
        }
      });
      
      await addDoc(commentsCollection, {
        userId: 'user789',
        userName: 'Alex Pro',
        userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        tradeId: 'trade2',
        content: 'Bold move selling here. I would have held longer.',
        timestamp: Date.now() - 7200000, // 2 hours ago
        reactions: {
          '🧠': [currentUser.id, 'user456'],
          '❤️': ['user456']
        }
      });
    }
    
    // Discussions collection
    const discussionsCollection = collection(db, 'discussions');
    const discussionsSnapshot = await getDocs(discussionsCollection);
    
    if (discussionsSnapshot.empty) {
      console.log('Creating sample discussions');
      await addDoc(discussionsCollection, {
        traderId: 'trader1',
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        title: 'How do you approach swing trading tech stocks?',
        content: 'I\'ve noticed your success with AAPL and MSFT. What\'s your typical holding period and exit strategy?',
        timestamp: Date.now() - 86400000, // 1 day ago
        reactions: {
          '🔥': ['user456', 'user789'],
          '🧠': ['user456']
        },
        commentCount: 2
      });
    }
    
    console.log('Firestore initialized successfully');
  } catch (error) {
    console.error('Error initializing Firestore:', error);
  }
};