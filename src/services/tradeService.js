import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp, 
  updateDoc 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const tradesCollection = collection(db, 'trades');
const portfoliosCollection = collection(db, 'portfolios');

/**
 * Create a new trade for the current user
 */
export const createUserTrade = async (trade) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('You must be logged in to make trades');
    }
    
    const userId = user.uid;
    const traderName = user.displayName || 'Anonymous Trader';
    const traderAvatar = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(traderName)}&background=random`;
    
    // Create the trade document
    const tradeDoc = {
      ...trade,
      traderId: userId,
      traderName,
      traderAvatar,
      value: trade.price * trade.quantity,
      timestamp: serverTimestamp(),
      isBot: false,
    };
    
    // Add to Firestore
    const docRef = await addDoc(tradesCollection, tradeDoc);
    
    // Update user's portfolio
    await updatePortfolio(userId, trade);
    
    return {
      id: docRef.id,
      ...tradeDoc,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error creating trade:', error);
    throw error;
  }
};

/**
 * Create a "copy" trade based on a bot's trade
 */
export const createCopyTrade = async (originalTrade) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('You must be logged in to copy trades');
    }
    
    const userId = user.uid;
    const traderName = user.displayName || 'Anonymous Trader';
    const traderAvatar = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(traderName)}&background=random`;
    
    // Create the copy trade document
    const copyTradeDoc = {
      symbol: originalTrade.symbol,
      action: originalTrade.action,
      price: originalTrade.price,
      quantity: originalTrade.quantity,
      traderId: userId,
      traderName,
      traderAvatar,
      originalTradeId: originalTrade.id,
      originalTraderId: originalTrade.traderId || originalTrade.trader.id,
      value: originalTrade.price * originalTrade.quantity,
      timestamp: serverTimestamp(),
      rationale: `Copied trade from ${originalTrade.traderName || originalTrade.trader.name}`,
      isCopy: true,
      isBot: false,
    };
    
    // Add to Firestore
    const docRef = await addDoc(tradesCollection, copyTradeDoc);
    
    // Update user's portfolio
    await updatePortfolio(userId, copyTradeDoc);
    
    return {
      id: docRef.id,
      ...copyTradeDoc,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error copying trade:', error);
    throw error;
  }
};

/**
 * Get user's trade history
 */
export const getUserTrades = async (userId) => {
  try {
    const q = query(
      tradesCollection,
      where('traderId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const trades = [];
    
    snapshot.forEach((doc) => {
      trades.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      });
    });
    
    return trades;
  } catch (error) {
    console.error('Error fetching user trades:', error);
    throw error;
  }
};

/**
 * Get trades for a specific symbol
 */
export const getSymbolTrades = async (symbol, limitCount = 10) => {
  try {
    const q = query(
      tradesCollection,
      where('symbol', '==', symbol),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const trades = [];
    
    snapshot.forEach((doc) => {
      trades.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      });
    });
    
    return trades;
  } catch (error) {
    console.error(`Error fetching trades for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Update user's portfolio based on a trade
 */
const updatePortfolio = async (userId, trade) => {
  try {
    const portfolioRef = doc(portfoliosCollection, userId);
    const portfolioSnap = await getDoc(portfolioRef);
    
    if (!portfolioSnap.exists()) {
      // Create new portfolio if it doesn't exist
      await updateDoc(portfolioRef, {
        userId,
        cash: 100000, // Starting cash amount
        totalValue: 100000,
        lastUpdated: serverTimestamp(),
        holdings: [],
      });
    }
    
    // Get current portfolio
    const portfolio = portfolioSnap.data();
    const holdings = portfolio.holdings || [];
    let cash = portfolio.cash || 100000;
    
    // Calculate trade impact
    const tradeValue = trade.price * trade.quantity;
    
    // Update cash based on trade type
    if (trade.action === 'BUY') {
      cash -= tradeValue;
    } else { // SELL
      cash += tradeValue;
    }
    
    // Find existing holding
    const existingHoldingIndex = holdings.findIndex(h => h.symbol === trade.symbol);
    
    if (existingHoldingIndex >= 0) {
      const holding = holdings[existingHoldingIndex];
      
      if (trade.action === 'BUY') {
        // Update existing holding with new shares
        const newQuantity = holding.quantity + trade.quantity;
        const newTotalCost = holding.totalCost + tradeValue;
        
        holdings[existingHoldingIndex] = {
          ...holding,
          quantity: newQuantity,
          totalCost: newTotalCost,
          averagePrice: newTotalCost / newQuantity,
          lastPrice: trade.price,
          lastUpdated: new Date(),
        };
      } else { // SELL
        // Reduce shares in existing holding
        const newQuantity = holding.quantity - trade.quantity;
        
        if (newQuantity <= 0) {
          // Remove holding if no shares left
          holdings.splice(existingHoldingIndex, 1);
        } else {
          // Update holding with reduced shares
          holdings[existingHoldingIndex] = {
            ...holding,
            quantity: newQuantity,
            lastPrice: trade.price,
            lastUpdated: new Date(),
          };
        }
      }
    } else if (trade.action === 'BUY') {
      // Add new holding
      holdings.push({
        symbol: trade.symbol,
        quantity: trade.quantity,
        totalCost: tradeValue,
        averagePrice: trade.price,
        lastPrice: trade.price,
        lastUpdated: new Date(),
      });
    }
    
    // Calculate total value of holdings
    const holdingsValue = holdings.reduce((total, holding) => {
      return total + (holding.lastPrice * holding.quantity);
    }, 0);
    
    // Update portfolio
    await updateDoc(portfolioRef, {
      cash,
      holdings,
      totalValue: cash + holdingsValue,
      lastUpdated: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return false;
  }
};