import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7QQ_k8FJS7a9Xqe2A2eyyUW-H3Hg9-NM",
  authDomain: "fintradeofficialdemo.firebaseapp.com",
  projectId: "fintradeofficialdemo",
  storageBucket: "fintradeofficialdemo.firebasestorage.app",
  messagingSenderId: "391753221869",
  appId: "1:391753221869:web:68eef512d30d158cfdeee4",
  measurementId: "G-2VS66YE7R8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample traders
const sampleTraders = [
  {
    id: 'trader1',
    name: 'Alex Morgan',
    avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
    performance: 42.8,
    winRate: 78,
    followers: 2453,
    description: 'Tech-focused trader specializing in momentum plays and swing trading. I focus on high-growth tech companies with strong fundamentals and technical breakouts.',
    stats: {
      avgHoldTime: '5.2 days',
      totalTrades: 156,
      successRate: '68%',
      monthlyReturn: '+12.3%',
    }
  },
  {
    id: 'trader2',
    name: 'Sarah Chen',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    performance: 31.5,
    winRate: 72,
    followers: 1872,
    description: 'Value investor with focus on undervalued dividend stocks. I look for companies with strong cash flow and sustainable dividend growth.',
    stats: {
      avgHoldTime: '27.4 days',
      totalTrades: 83,
      successRate: '77%',
      monthlyReturn: '+8.2%',
    }
  },
  {
    id: 'trader3',
    name: 'Michael Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    performance: 56.2,
    winRate: 64,
    followers: 3128,
    description: 'Day trader specializing in volatility and market reversals. I use technical analysis and volume patterns to find high-probability setups.',
    stats: {
      avgHoldTime: '1.3 days',
      totalTrades: 312,
      successRate: '61%',
      monthlyReturn: '+15.8%',
    }
  }
];

// Sample trades
const sampleTrades = [
  {
    id: 'trade1',
    traderId: 'trader1',
    trader: {
      id: 'trader1',
      name: 'Alex Morgan',
      performance: '+42.8% this month',
      avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
    },
    action: 'BUY',
    symbol: 'AAPL',
    price: 182.63,
    quantity: 10,
    timestamp: new Date().toISOString(),
    gain: 3.2,
  },
  {
    id: 'trade2',
    traderId: 'trader1',
    trader: {
      id: 'trader1',
      name: 'Alex Morgan',
      performance: '+42.8% this month',
      avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
    },
    action: 'SELL',
    symbol: 'MSFT',
    price: 418.75,
    quantity: 5,
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    gain: -1.5,
  },
  {
    id: 'trade3',
    traderId: 'trader1',
    trader: {
      id: 'trader1',
      name: 'Alex Morgan',
      performance: '+42.8% this month',
      avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
    },
    action: 'BUY',
    symbol: 'NVDA',
    price: 880.30,
    quantity: 2,
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    gain: 5.7,
  },
  {
    id: 'trade4',
    traderId: 'trader2',
    trader: {
      id: 'trader2',
      name: 'Sarah Chen',
      performance: '+31.5% this month',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
    action: 'BUY',
    symbol: 'JNJ',
    price: 147.52,
    quantity: 15,
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    gain: 2.1,
  },
  {
    id: 'trade5',
    traderId: 'trader3',
    trader: {
      id: 'trader3',
      name: 'Michael Rodriguez',
      performance: '+56.2% this month',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    },
    action: 'BUY',
    symbol: 'TSLA',
    price: 176.89,
    quantity: 8,
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    gain: 8.4,
  }
];

// Sample comments
const sampleComments = [
  {
    id: 'comment1',
    userId: 'demo-user1',
    userName: 'Jane Trader',
    userAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
    tradeId: 'trade1',
    content: 'Great trade! What indicators led you to this decision?',
    timestamp: Date.now() - 3600000, // 1 hour ago
    reactions: {
      '🔥': ['demo-user2'],
      '🧠': ['demo-user3']
    }
  },
  {
    id: 'comment2',
    userId: 'demo-user2',
    userName: 'Mark Wilson',
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    tradeId: 'trade3',
    content: 'Bold move buying NVDA at this level. I think it still has room to run.',
    timestamp: Date.now() - 7200000, // 2 hours ago
    reactions: {
      '👍': ['demo-user1'],
      '🧠': ['demo-user3']
    }
  },
  {
    id: 'comment3',
    userId: 'demo-user3',
    userName: 'Sophia Lee',
    userAvatar: 'https://randomuser.me/api/portraits/women/23.jpg',
    tradeId: 'trade3',
    content: "I'm concerned about the semiconductor sector in the short term. What's your thesis here?",
    timestamp: Date.now() - 5400000, // 1.5 hours ago
    reactions: {
      '❤️': ['demo-user1']
    }
  },
  {
    id: 'comment4',
    userId: 'trader1',
    userName: 'Alex Morgan',
    userAvatar: 'https://randomuser.me/api/portraits/men/43.jpg',
    tradeId: 'trade3',
    content: "I'm playing the AI growth story. NVDA's dominance in AI chips gives them a long runway for growth.",
    timestamp: Date.now() - 3600000, // 1 hour ago
    parentId: 'comment3',
    reactions: {
      '🔥': ['demo-user1', 'demo-user2', 'demo-user3']
    }
  }
];

// Sample discussions
const sampleDiscussions = [
  {
    id: 'discussion1',
    traderId: 'trader1',
    userId: 'demo-user1',
    userName: 'Jane Trader',
    userAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
    title: 'How do you approach swing trading tech stocks?',
    content: "I've noticed your success with AAPL and MSFT. What's your typical holding period and exit strategy?",
    timestamp: Date.now() - 86400000, // 1 day ago
    reactions: {
      '🔥': ['demo-user2', 'demo-user3'],
      '🧠': ['trader1']
    },
    commentCount: 2
  },
  {
    id: 'discussion2',
    traderId: 'trader2',
    userId: 'demo-user3',
    userName: 'Sophia Lee',
    userAvatar: 'https://randomuser.me/api/portraits/women/23.jpg',
    title: 'Dividend investing in rising interest rate environment',
    content: "I'm curious how you're adjusting your dividend strategy with higher interest rates. Are you shifting toward any particular sectors?",
    timestamp: Date.now() - 172800000, // 2 days ago
    reactions: {
      '👍': ['demo-user1'],
      '🧠': ['trader2']
    },
    commentCount: 1
  }
];

// Initialize the database with sample data
async function initializeFirestore() {
  try {
    console.log("Starting to initialize Firestore with sample data...");
    
    // Add sample traders
    console.log("Adding sample traders...");
    for (const trader of sampleTraders) {
      await setDoc(doc(db, 'traders', trader.id), {
        ...trader,
        createdAt: serverTimestamp()
      });
      console.log(`Added trader: ${trader.name}`);
    }
    
    // Add sample trades
    console.log("Adding sample trades...");
    for (const trade of sampleTrades) {
      await setDoc(doc(db, 'trades', trade.id), {
        ...trade,
        createdAt: serverTimestamp()
      });
      console.log(`Added trade: ${trade.id} - ${trade.symbol}`);
    }
    
    // Add sample comments
    console.log("Adding sample comments...");
    for (const comment of sampleComments) {
      await setDoc(doc(db, 'comments', comment.id), comment);
      console.log(`Added comment: ${comment.id}`);
    }
    
    // Add sample discussions
    console.log("Adding sample discussions...");
    for (const discussion of sampleDiscussions) {
      await setDoc(doc(db, 'discussions', discussion.id), discussion);
      console.log(`Added discussion: ${discussion.id} - ${discussion.title}`);
    }
    
    console.log("Successfully initialized Firestore with sample data!");
  } catch (error) {
    console.error("Error initializing Firestore:", error);
  }
}

// Run the initialization
initializeFirestore();