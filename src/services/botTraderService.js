import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { 
  fetchCurrentPrice, 
  fetchHistoricalData, 
  fetchAssetMetadata,
  fetchMarketIndices
} from './marketDataService';

const tradersCollection = collection(db, 'traders');
const tradesCollection = collection(db, 'trades');
const portfoliosCollection = collection(db, 'portfolios');

// Bot trader profiles
export const BOT_TRADERS = [
  {
    id: 'bot-momentum-mike',
    name: 'Momentum Mike',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'I ride the wave of market momentum. When stocks are going up, I buy more. Simple as that!',
    tradingStyle: 'momentum',
    strategy: 'Buys stocks showing upward price momentum and strong volume',
    riskTolerance: 'high',
    tradingFrequency: 0.4, // 40% chance of trading on each check
    sectorPreferences: ['Technology', 'Consumer Cyclical', 'Communication Services'],
    initialCapital: 100000,
    performance: {
      overall: 27.5,
      monthly: 3.2,
      winRate: 62
    },
    isBot: true,
    followers: 485,
    following: 20,
    createdAt: new Date()
  },
  {
    id: 'bot-value-victoria',
    name: 'Value Victoria',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    bio: 'Fundamentals matter. I look for undervalued companies with strong balance sheets and consistent cash flow.',
    tradingStyle: 'value',
    strategy: 'Buys undervalued stocks based on P/E ratio and other fundamentals',
    riskTolerance: 'low',
    tradingFrequency: 0.15, // 15% chance of trading on each check
    sectorPreferences: ['Financial Services', 'Healthcare', 'Utilities', 'Consumer Defensive'],
    initialCapital: 250000,
    performance: {
      overall: 18.3,
      monthly: 1.5,
      winRate: 74
    },
    isBot: true,
    followers: 612,
    following: 8,
    createdAt: new Date()
  },
  {
    id: 'bot-swing-sam',
    name: 'Swing Sam',
    avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    bio: 'Catching the swings is my game. I look for short-term price movements and capitalize on market volatility.',
    tradingStyle: 'swing',
    strategy: 'Makes short-term trades based on technical indicators and market sentiment',
    riskTolerance: 'medium',
    tradingFrequency: 0.5, // 50% chance of trading on each check
    sectorPreferences: ['Technology', 'Energy', 'Basic Materials', 'Industrial'],
    initialCapital: 75000,
    performance: {
      overall: 22.8,
      monthly: 2.7,
      winRate: 58
    },
    isBot: true,
    followers: 327,
    following: 15,
    createdAt: new Date()
  },
  {
    id: 'bot-dca-deb',
    name: 'DCA Deb',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    bio: 'Slow and steady wins the race. I dollar-cost average into quality companies for the long term.',
    tradingStyle: 'value',
    strategy: 'Regularly invests in blue-chip stocks regardless of market conditions',
    riskTolerance: 'low',
    tradingFrequency: 0.25, // 25% chance of trading on each check
    sectorPreferences: ['Financial Services', 'Consumer Defensive', 'Healthcare', 'Utilities'],
    initialCapital: 150000,
    performance: {
      overall: 15.2,
      monthly: 1.3,
      winRate: 70
    },
    isBot: true,
    followers: 578,
    following: 5,
    createdAt: new Date()
  },
  {
    id: 'bot-tech-tyler',
    name: 'Tech Tyler',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
    bio: 'Technology is the future. I focus exclusively on cutting-edge tech companies with disruptive potential.',
    tradingStyle: 'growth',
    strategy: 'Invests in technology companies with high growth potential',
    riskTolerance: 'high',
    tradingFrequency: 0.3, // 30% chance of trading on each check
    sectorPreferences: ['Technology', 'Communication Services'],
    initialCapital: 120000,
    performance: {
      overall: 31.5,
      monthly: 3.8,
      winRate: 60
    },
    isBot: true,
    followers: 842,
    following: 12,
    createdAt: new Date()
  }
];

// Popular stocks for the bots to trade
const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication Services' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Communication Services' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', sector: 'Consumer Cyclical' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services' },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Financial Services' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
  { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Defensive' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
  { symbol: 'DIS', name: 'Walt Disney Co.', sector: 'Communication Services' },
  { symbol: 'NFLX', name: 'Netflix, Inc.', sector: 'Communication Services' },
  { symbol: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Defensive' },
  { symbol: 'PEP', name: 'PepsiCo, Inc.', sector: 'Consumer Defensive' }
];

/**
 * Fetch all bot traders
 */
export const fetchBotTraders = async () => {
  try {
    const q = query(
      tradersCollection,
      where('isBot', '==', true)
    );
    
    const snapshot = await getDocs(q);
    const botTraders = [];
    
    snapshot.forEach((doc) => {
      botTraders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return botTraders;
  } catch (error) {
    console.error('Error fetching bot traders:', error);
    return [];
  }
};

/**
 * Fetch recent trades by bot traders
 */
export const fetchBotTrades = async (limitCount = 20) => {
  try {
    const botIds = BOT_TRADERS.map(bot => bot.id);
    
    const q = query(
      tradesCollection,
      where('traderId', 'in', botIds),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const trades = [];
    
    snapshot.forEach((doc) => {
      trades.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      });
    });
    
    return trades;
  } catch (error) {
    console.error('Error fetching bot trades:', error);
    return [];
  }
};

/**
 * Fetch a bot trader's portfolio
 */
export const fetchBotPortfolio = async (botId) => {
  try {
    const portfolioRef = doc(portfoliosCollection, botId);
    const portfolioSnapshot = await getDoc(portfolioRef);
    
    if (!portfolioSnapshot.exists()) {
      throw new Error(`No portfolio found for bot ${botId}`);
    }
    
    return {
      id: portfolioSnapshot.id,
      ...portfolioSnapshot.data(),
      lastUpdated: portfolioSnapshot.data().lastUpdated?.toDate() || new Date()
    };
  } catch (error) {
    console.error(`Error fetching portfolio for bot ${botId}:`, error);
    return null;
  }
};

/**
 * Follow a bot trader
 */
export const followBotTrader = async (userId, botId) => {
  try {
    // Implementation would depend on your data model
    console.log(`User ${userId} is now following bot ${botId}`);
    return true;
  } catch (error) {
    console.error('Error following bot trader:', error);
    return false;
  }
};

/**
 * Unfollow a bot trader
 */
export const unfollowBotTrader = async (userId, botId) => {
  try {
    // Implementation would depend on your data model
    console.log(`User ${userId} has unfollowed bot ${botId}`);
    return true;
  } catch (error) {
    console.error('Error unfollowing bot trader:', error);
    return false;
  }
};

/**
 * Initialize bot traders in Firestore
 */
export const initializeBotTraders = async () => {
  try {
    console.log('Initializing bot traders...');
    
    // Create bot traders
    for (const bot of BOT_TRADERS) {
      const botRef = doc(tradersCollection, bot.id);
      const botDoc = await getDoc(botRef);
      
      if (!botDoc.exists()) {
        await setDoc(botRef, {
          ...bot,
          createdAt: serverTimestamp()
        });
        
        // Initialize empty portfolio
        const portfolioRef = doc(portfoliosCollection, bot.id);
        await setDoc(portfolioRef, {
          traderId: bot.id,
          cash: bot.initialCapital,
          totalValue: bot.initialCapital,
          lastUpdated: serverTimestamp(),
          holdings: []
        });
      }
    }
    
    console.log(`Initialized ${BOT_TRADERS.length} bot traders`);
    return true;
  } catch (error) {
    console.error('Error initializing bot traders:', error);
    return false;
  }
};

/**
 * Generate a trade for a bot based on real market data and strategy
 */
export const generateBotTrade = async (botId, marketState = null) => {
  try {
    // Get the bot trader
    const bot = BOT_TRADERS.find(b => b.id === botId);
    if (!bot) {
      throw new Error(`Bot trader ${botId} not found`);
    }
    
    // Get bot's portfolio to make informed decisions
    const portfolio = await fetchBotPortfolio(botId);
    
    // Get stocks based on bot's sector preferences
    const eligibleStocks = POPULAR_STOCKS.filter(stock => 
      bot.sectorPreferences.includes(stock.sector)
    );
    
    // If no market state is provided, create a default one
    if (!marketState) {
      marketState = {
        marketTrend: 'neutral',
        volatility: 'medium',
        sectorPerformance: {}
      };
    }
    
    // Use market state to influence stock selection
    // Prioritize sectors that match the bot's trading style and market conditions
    let prioritizedStocks = [...eligibleStocks];
    
    if (Object.keys(marketState.sectorPerformance).length > 0) {
      prioritizedStocks.sort((a, b) => {
        const sectorA = a.sector;
        const sectorB = b.sector;
        const perfA = marketState.sectorPerformance[sectorA];
        const perfB = marketState.sectorPerformance[sectorB];
        
        if (!perfA && !perfB) return 0;
        if (!perfA) return 1;
        if (!perfB) return -1;
        
        // Momentum traders prioritize bullish sectors
        if (bot.tradingStyle === 'momentum') {
          return perfB.change - perfA.change; // Higher change first
        }
        // Value traders prioritize bearish sectors (buying opportunity)
        else if (bot.tradingStyle === 'value') {
          return perfA.change - perfB.change; // Lower change first
        }
        // Swing traders prioritize sectors with biggest changes (any direction)
        else if (bot.tradingStyle === 'swing') {
          return Math.abs(perfB.change) - Math.abs(perfA.change); // Bigger absolute change first
        }
        
        return 0;
      });
    }
    
    // Make a more informed stock selection based on trading style
    let selectedStock;
    let action;
    let rationale;
    let price;
    let historicalData;
    
    // First, select a stock with a strategy-based approach influenced by market state
    switch (bot.tradingStyle) {
      case 'momentum':
        // For momentum traders, look for stocks with positive price movement
        // Check multiple stocks to find one with good momentum
        for (let i = 0; i < Math.min(3, eligibleStocks.length); i++) {
          const stockIndex = Math.floor(Math.random() * eligibleStocks.length);
          const stock = eligibleStocks[stockIndex];
          
          try {
            // Get current price
            const priceData = await fetchCurrentPrice(stock.symbol);
            
            // If price has positive momentum (positive change percent), select it
            if (priceData.changePercent > 0.5) {
              selectedStock = stock;
              price = priceData.price;
              action = 'BUY'; // Momentum traders typically buy on uptrends
              rationale = `${stock.symbol} shows strong upward momentum with a ${priceData.changePercent.toFixed(2)}% gain and increasing volume`;
              break;
            }
          } catch (error) {
            console.error(`Could not fetch data for ${stock.symbol}:`, error);
          }
        }
        break;
        
      case 'value':
        // For value traders, look for stocks that might be undervalued
        selectedStock = eligibleStocks[Math.floor(Math.random() * eligibleStocks.length)];
        try {
          // Try to get metadata to check valuation metrics
          const metadata = await fetchAssetMetadata(selectedStock.symbol);
          const priceData = await fetchCurrentPrice(selectedStock.symbol);
          price = priceData.price;
          
          // Value traders look for low P/E ratios or recent price drops
          if (metadata.peRatio && metadata.peRatio < 20) {
            action = 'BUY';
            rationale = `${selectedStock.symbol} is trading at an attractive P/E ratio of ${metadata.peRatio} with strong fundamentals`;
          } else if (priceData.changePercent < -1.0) {
            // Buy on dips if the company is solid
            action = 'BUY';
            rationale = `${selectedStock.symbol} is down ${Math.abs(priceData.changePercent).toFixed(2)}%, presenting a value opportunity for a quality company`;
          } else {
            // Sometimes value traders sell overvalued positions
            action = 'SELL';
            rationale = `${selectedStock.symbol} appears to be trading above its intrinsic value, taking profits`;
          }
        } catch (error) {
          console.error(`Error fetching data for ${selectedStock.symbol}:`, error);
          price = getBasePrice(selectedStock.symbol);
          action = Math.random() > 0.5 ? 'BUY' : 'SELL';
          rationale = `${selectedStock.symbol} has an attractive valuation based on recent analysis`;
        }
        break;
        
      case 'swing':
        // Swing traders look for reversals and short-term movements
        selectedStock = eligibleStocks[Math.floor(Math.random() * eligibleStocks.length)];
        try {
          const priceData = await fetchCurrentPrice(selectedStock.symbol);
          historicalData = await fetchHistoricalData(selectedStock.symbol, '1week');
          price = priceData.price;
          
          // Look for a reversal pattern (current change different from recent trend)
          const recentTrend = historicalData.length > 3 ? 
            historicalData[historicalData.length - 1].close > historicalData[historicalData.length - 3].close : true;
            
          if ((recentTrend && priceData.changePercent < -1.5) || 
              (!recentTrend && priceData.changePercent > 1.5)) {
            action = recentTrend ? 'BUY' : 'SELL'; // Buy on dips in uptrend, sell rallies in downtrend
            rationale = `Technical indicators suggest ${selectedStock.symbol} is at a key ${action === 'BUY' ? 'support' : 'resistance'} level with potential for a short-term ${action === 'BUY' ? 'bounce' : 'pullback'}`;
          } else {
            // Follow the trend
            action = recentTrend ? 'BUY' : 'SELL';
            rationale = `${selectedStock.symbol} is showing a strong ${recentTrend ? 'upward' : 'downward'} trend in the short term`;
          }
        } catch (error) {
          console.error(`Error fetching data for ${selectedStock.symbol}:`, error);
          price = getBasePrice(selectedStock.symbol);
          action = Math.random() > 0.5 ? 'BUY' : 'SELL';
          rationale = `Technical indicators suggest ${selectedStock.symbol} is at a key ${action === 'BUY' ? 'support' : 'resistance'} level`;
        }
        break;
        
      case 'growth':
        // Growth traders focus on companies with high growth potential
        // Generally favor technology and disruptive companies
        selectedStock = eligibleStocks.find(s => s.sector === 'Technology') || 
                        eligibleStocks[Math.floor(Math.random() * eligibleStocks.length)];
                        
        try {
          const priceData = await fetchCurrentPrice(selectedStock.symbol);
          price = priceData.price;
          
          // Growth traders typically buy and hold, occasionally taking profits
          if (Math.random() > 0.7) {
            action = 'SELL';
            rationale = `Taking profits on ${selectedStock.symbol} after strong performance to reinvest in new opportunities`;
          } else {
            action = 'BUY';
            rationale = `${selectedStock.symbol} has strong growth potential with innovative products and expanding market share`;
          }
        } catch (error) {
          console.error(`Error fetching data for ${selectedStock.symbol}:`, error);
          price = getBasePrice(selectedStock.symbol);
          action = 'BUY'; // Growth traders have a buy bias
          rationale = `${selectedStock.symbol} has strong growth potential in a rapidly expanding market`;
        }
        break;
        
      default:
        // Default case with some randomization
        selectedStock = eligibleStocks[Math.floor(Math.random() * eligibleStocks.length)];
        try {
          const priceData = await fetchCurrentPrice(selectedStock.symbol);
          price = priceData.price;
          action = Math.random() > 0.4 ? 'BUY' : 'SELL';
          rationale = `${selectedStock.symbol} ${action === 'BUY' ? 'shows promise' : 'has reached target'} based on recent performance`;
        } catch (error) {
          console.error(`Error fetching data for ${selectedStock.symbol}:`, error);
          price = getBasePrice(selectedStock.symbol);
          action = Math.random() > 0.4 ? 'BUY' : 'SELL';
          rationale = `${selectedStock.symbol} looks promising based on recent performance`;
        }
    }
    
    // If we still don't have a selected stock, fall back to a random one
    if (!selectedStock) {
      selectedStock = eligibleStocks[Math.floor(Math.random() * eligibleStocks.length)];
      price = await fetchCurrentPriceWithFallback(selectedStock.symbol);
      action = Math.random() > 0.3 ? 'BUY' : 'SELL';
      rationale = `${selectedStock.symbol} ${action === 'BUY' ? 'presents an opportunity' : 'has reached a target price'}`;
    }
    
    // Determine position size based on bot's risk tolerance and portfolio
    let quantity;
    const availableCash = portfolio?.cash || bot.initialCapital;
    
    switch (bot.riskTolerance) {
      case 'low':
        // Low risk: 1-2% of portfolio per trade
        quantity = action === 'BUY' ? 
          Math.floor((availableCash * 0.01) / price) : 
          Math.floor(Math.random() * 5) + 1;
        break;
      case 'medium':
        // Medium risk: 2-5% of portfolio per trade
        quantity = action === 'BUY' ? 
          Math.floor((availableCash * 0.03) / price) : 
          Math.floor(Math.random() * 10) + 2;
        break;
      case 'high':
        // High risk: 5-10% of portfolio per trade
        quantity = action === 'BUY' ? 
          Math.floor((availableCash * 0.07) / price) : 
          Math.floor(Math.random() * 20) + 5;
        break;
      default:
        quantity = Math.max(1, Math.floor((availableCash * 0.02) / price));
    }
    
    // Ensure we have at least 1 share
    quantity = Math.max(1, quantity);
    
    // Calculate realistic gain/loss based on recent price movement
    let gain;
    try {
      // If we have historical data, use it to calculate a realistic gain
      if (historicalData && historicalData.length > 5) {
        const recentPrices = historicalData.slice(-5);
        const avgChangePercent = recentPrices.reduce((sum, dataPoint, index, array) => {
          if (index === 0) return sum;
          const prevClose = array[index - 1].close;
          const changePercent = ((dataPoint.close - prevClose) / prevClose) * 100;
          return sum + changePercent;
        }, 0) / (recentPrices.length - 1);
        
        // Realistic gain with some randomization
        gain = avgChangePercent * (0.5 + Math.random());
      } else {
        // Fallback with more controlled randomization
        gain = (Math.random() * 4) - (action === 'SELL' ? 1 : 0.5);
      }
    } catch (error) {
      console.error('Error calculating gain:', error);
      gain = (Math.random() * 4) - (action === 'SELL' ? 1 : 0.5);
    }
    
    // Create the trade record
    const trade = {
      traderId: bot.id,
      traderName: bot.name,
      traderAvatar: bot.avatar,
      symbol: selectedStock.symbol,
      action: action,
      price: price,
      quantity: quantity,
      value: price * quantity,
      timestamp: serverTimestamp(),
      tradingStyle: bot.tradingStyle,
      rationale: rationale,
      sector: selectedStock.sector,
      gain: gain
    };
    
    // Add trade to Firestore
    const tradeRef = await addDoc(tradesCollection, trade);
    
    // Update bot's portfolio
    await updateBotPortfolio(botId, trade);
    
    console.log(`Generated ${action} trade for ${bot.name}: ${quantity} shares of ${selectedStock.symbol} @ $${price.toFixed(2)}`);
    return {
      id: tradeRef.id,
      ...trade,
      timestamp: new Date()
    };
  } catch (error) {
    console.error(`Error generating trade for bot ${botId}:`, error);
    return null;
  }
};

/**
 * Helper function to fetch current price with fallback
 */
const fetchCurrentPriceWithFallback = async (symbol) => {
  try {
    const priceData = await fetchCurrentPrice(symbol);
    return priceData.price;
  } catch (error) {
    console.warn(`Falling back to simulated price for ${symbol}:`, error);
    return getBasePrice(symbol) * (1 + (Math.random() * 0.06 - 0.03));
  }
};

/**
 * Update a bot's portfolio based on a trade
 */
const updateBotPortfolio = async (botId, trade) => {
  try {
    const portfolioRef = doc(portfoliosCollection, botId);
    const portfolioSnapshot = await getDoc(portfolioRef);
    
    if (!portfolioSnapshot.exists()) {
      // Get the bot to initialize portfolio
      const bot = BOT_TRADERS.find(b => b.id === botId);
      if (!bot) throw new Error(`Bot ${botId} not found`);
      
      // Create new portfolio
      await setDoc(portfolioRef, {
        traderId: botId,
        cash: bot.initialCapital,
        totalValue: bot.initialCapital,
        lastUpdated: serverTimestamp(),
        holdings: []
      });
      
      // Get the newly created portfolio
      return updateBotPortfolio(botId, trade);
    }
    
    // Get current portfolio
    const portfolio = portfolioSnapshot.data();
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
    
    const totalValue = cash + holdingsValue;
    
    // Calculate overall performance
    const bot = BOT_TRADERS.find(b => b.id === botId);
    const initialCapital = bot?.initialCapital || 100000;
    const performancePercent = ((totalValue / initialCapital) - 1) * 100;
    
    // Update portfolio
    await setDoc(portfolioRef, {
      traderId: botId,
      cash,
      holdings,
      totalValue,
      performance: {
        overall: performancePercent,
        monthly: performancePercent / 12, // Simplified monthly calculation
        winRate: bot?.performance?.winRate || 60 // Maintain existing win rate
      },
      lastUpdated: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error(`Error updating portfolio for bot ${botId}:`, error);
    return false;
  }
};

/**
 * Generate trades for all bots
 */
export const generateBotTrades = async () => {
  try {
    const trades = [];
    
    for (const bot of BOT_TRADERS) {
      // Only generate trades based on bot's trading frequency
      if (Math.random() < bot.tradingFrequency) {
        const trade = await generateBotTrade(bot.id);
        if (trade) {
          trades.push(trade);
        }
      }
    }
    
    return trades;
  } catch (error) {
    console.error('Error generating bot trades:', error);
    return [];
  }
};

/**
 * Get real-time stream of bot trades
 * This creates or retrieves a stream of trades for a specific bot
 */
export const getTradeStream = async (botIds = [], frequency = 'normal') => {
  // If no bot IDs provided, use all bots
  if (!botIds || botIds.length === 0) {
    botIds = BOT_TRADERS.map(bot => bot.id);
  }
  
  try {
    // First fetch existing trades
    const existingTrades = await fetchBotTrades(50);
    
    // Filter to only include requested bots
    const filteredTrades = existingTrades.filter(trade => 
      botIds.includes(trade.traderId)
    );
    
    // Generate new trades based on requested frequency
    const frequencyMultiplier = 
      frequency === 'high' ? 2.0 :
      frequency === 'low' ? 0.5 : 1.0;
    
    // Generate one trade for each selected bot
    const newTradesPromises = botIds.map(async (botId) => {
      const bot = BOT_TRADERS.find(b => b.id === botId);
      
      if (!bot) return null;
      
      // Apply frequency multiplier
      const adjustedFrequency = Math.min(0.9, bot.tradingFrequency * frequencyMultiplier);
      
      // Only generate a trade based on adjusted frequency
      if (Math.random() < adjustedFrequency) {
        return await generateBotTrade(botId);
      }
      
      return null;
    });
    
    const newTrades = (await Promise.all(newTradesPromises))
      .filter(trade => trade !== null);
    
    // Combine existing and new trades, sorted by timestamp
    const allTrades = [...newTrades, ...filteredTrades]
      .sort((a, b) => {
        const timeA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
        const timeB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
        return timeB - timeA;
      })
      .slice(0, 30); // Limit to 30 most recent trades
    
    return allTrades;
  } catch (error) {
    console.error('Error getting trade stream:', error);
    return [];
  }
};

/**
 * Start a continuous trade stream for bots
 * This simulates real-time trading by generating trades at varying intervals
 * based on actual market conditions
 */
export const startContinuousTradeStream = (callback, botIds = [], options = {}) => {
  const {
    minInterval = 10000,   // Minimum time between trades (10 seconds)
    maxInterval = 60000,   // Maximum time between trades (1 minute)
    frequency = 'normal',  // How frequently trades should occur
    maxTrades = 5          // Maximum trades to generate per interval
  } = options;
  
  // Keep track of the timer
  let streamTimer = null;
  
  // Set up market state to influence trading decisions
  const marketState = {
    lastCheck: Date.now(),
    marketTrend: 'neutral',  // 'bullish', 'bearish', or 'neutral'
    volatility: 'medium',    // 'low', 'medium', or 'high'
    sectorPerformance: {}    // Will track performance by sector
  };
  
  // Function to update market state based on real market data
  const updateMarketState = async () => {
    try {
      // Only update market state every 5 minutes to avoid excessive API calls
      const now = Date.now();
      if (now - marketState.lastCheck < 5 * 60 * 1000) {
        return; // Use existing market state
      }
      
      console.log('Updating market state for bot trading...');
      
      // Fetch current market index data for overall trend
      const marketIndices = await fetchMarketIndices();
      
      // Determine market trend based on index performance
      let bullishCount = 0;
      let bearishCount = 0;
      
      marketIndices.forEach(index => {
        if (index.changePercent > 0.2) bullishCount++;
        else if (index.changePercent < -0.2) bearishCount++;
      });
      
      if (bullishCount >= 2) marketState.marketTrend = 'bullish';
      else if (bearishCount >= 2) marketState.marketTrend = 'bearish';
      else marketState.marketTrend = 'neutral';
      
      // Determine volatility based on price movements
      const volatilityScore = marketIndices.reduce((sum, index) => 
        sum + Math.abs(index.changePercent), 0) / marketIndices.length;
      
      if (volatilityScore > 1.5) marketState.volatility = 'high';
      else if (volatilityScore < 0.5) marketState.volatility = 'low';
      else marketState.volatility = 'medium';
      
      // Fetch sector performance from actual stocks
      const sectorStocks = {
        'Technology': ['AAPL', 'MSFT', 'NVDA'], 
        'Consumer Cyclical': ['AMZN', 'TSLA'],
        'Financial Services': ['JPM', 'V'],
        'Healthcare': ['JNJ'],
        'Communication Services': ['GOOGL', 'META']
      };
      
      // Fetch stock prices for each sector in parallel
      const sectorPromises = Object.entries(sectorStocks).map(async ([sector, stocks]) => {
        try {
          const stockPromises = stocks.map(symbol => fetchCurrentPrice(symbol));
          const stockPrices = await Promise.allSettled(stockPromises);
          
          // Calculate sector performance based on average change percentage
          const validResults = stockPrices
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
          
          if (validResults.length > 0) {
            const avgChange = validResults.reduce((sum, price) => 
              sum + (price.changePercent || 0), 0) / validResults.length;
            
            marketState.sectorPerformance[sector] = {
              change: avgChange,
              trend: avgChange > 0.5 ? 'bullish' : 
                    avgChange < -0.5 ? 'bearish' : 'neutral'
            };
          }
        } catch (error) {
          console.error(`Error fetching sector data for ${sector}:`, error);
        }
      });
      
      // Wait for all sector data to be fetched
      await Promise.all(sectorPromises);
      
      // Update last check timestamp
      marketState.lastCheck = now;
      
      console.log('Market state updated:', {
        trend: marketState.marketTrend,
        volatility: marketState.volatility,
        sectors: Object.keys(marketState.sectorPerformance).map(sector => 
          `${sector}: ${marketState.sectorPerformance[sector]?.trend || 'unknown'}`
        )
      });
      
    } catch (error) {
      console.error('Error updating market state:', error);
      // If update fails, use default state
      marketState.marketTrend = 'neutral';
      marketState.volatility = 'medium';
    }
  };
  
  // Generate a new batch of trades based on market conditions
  const generateTradesBatch = async () => {
    try {
      // Update market state first
      await updateMarketState();
      
      // Adjust trade count based on market volatility
      let tradeCountMultiplier = 1;
      if (marketState.volatility === 'high') tradeCountMultiplier = 1.5;
      else if (marketState.volatility === 'low') tradeCountMultiplier = 0.7;
      
      const adjustedMaxTrades = Math.ceil(maxTrades * tradeCountMultiplier);
      const tradeCount = Math.floor(Math.random() * adjustedMaxTrades) + 1;
      
      console.log(`Generating batch of up to ${tradeCount} trades based on ${marketState.marketTrend} market`);
      
      const tradesPromises = [];
      
      // Generate multiple trades
      for (let i = 0; i < tradeCount; i++) {
        // Select a bot based on market conditions
        let selectedBotId;
        
        // In bullish markets, momentum and growth traders are more active
        if (marketState.marketTrend === 'bullish') {
          const bullishBots = botIds.filter(id => {
            const bot = BOT_TRADERS.find(b => b.id === id);
            return bot && (bot.tradingStyle === 'momentum' || bot.tradingStyle === 'growth');
          });
          
          if (bullishBots.length > 0) {
            selectedBotId = bullishBots[Math.floor(Math.random() * bullishBots.length)];
          }
        } 
        // In bearish markets, value traders become more active
        else if (marketState.marketTrend === 'bearish') {
          const bearishBots = botIds.filter(id => {
            const bot = BOT_TRADERS.find(b => b.id === id);
            return bot && (bot.tradingStyle === 'value');
          });
          
          if (bearishBots.length > 0) {
            selectedBotId = bearishBots[Math.floor(Math.random() * bearishBots.length)];
          }
        }
        
        // If no bot was selected based on market conditions, pick randomly
        if (!selectedBotId) {
          const botIndex = Math.floor(Math.random() * botIds.length);
          selectedBotId = botIds[botIndex];
        }
        
        // Get the bot
        const bot = BOT_TRADERS.find(b => b.id === selectedBotId);
        if (!bot) continue;
        
        // Apply frequency multiplier based on requested frequency
        const frequencyMultiplier = 
          frequency === 'high' ? 2.0 :
          frequency === 'low' ? 0.5 : 1.0;
        
        // Apply additional multiplier based on market conditions
        let marketMultiplier = 1.0;
        
        // Momentum traders trade more in bullish markets
        if (bot.tradingStyle === 'momentum' && marketState.marketTrend === 'bullish') {
          marketMultiplier = 1.5;
        }
        // Value traders trade more in bearish markets
        else if (bot.tradingStyle === 'value' && marketState.marketTrend === 'bearish') {
          marketMultiplier = 1.3;
        }
        // Swing traders trade more in volatile markets
        else if (bot.tradingStyle === 'swing' && marketState.volatility === 'high') {
          marketMultiplier = 1.8;
        }
        
        const adjustedFrequency = Math.min(0.9, 
          bot.tradingFrequency * frequencyMultiplier * marketMultiplier
        );
        
        // Only generate a trade based on bot's adjusted frequency
        if (Math.random() < adjustedFrequency) {
          // Pass market state to influence trade generation
          tradesPromises.push(generateBotTrade(selectedBotId, marketState));
        }
      }
      
      // Wait for all trades to be generated
      const trades = (await Promise.all(tradesPromises))
        .filter(trade => trade !== null);
      
      // If we have new trades, call the callback
      if (trades.length > 0 && typeof callback === 'function') {
        console.log(`Generated ${trades.length} trades`);
        callback(trades);
      } else {
        console.log('No trades generated in this batch');
      }
      
      // Adjust next interval based on market volatility
      let intervalMultiplier = 1.0;
      if (marketState.volatility === 'high') intervalMultiplier = 0.7; // Faster trading in volatile markets
      else if (marketState.volatility === 'low') intervalMultiplier = 1.5; // Slower trading in calm markets
      
      const adjustedMinInterval = Math.floor(minInterval * intervalMultiplier);
      const adjustedMaxInterval = Math.floor(maxInterval * intervalMultiplier);
      
      const nextInterval = Math.floor(Math.random() * 
        (adjustedMaxInterval - adjustedMinInterval)) + adjustedMinInterval;
      
      console.log(`Next trade batch in ${(nextInterval/1000).toFixed(1)} seconds`);
      streamTimer = setTimeout(generateTradesBatch, nextInterval);
      
    } catch (error) {
      console.error('Error in continuous trade stream:', error);
      // Try again after maxInterval
      streamTimer = setTimeout(generateTradesBatch, maxInterval);
    }
  };
  
  // Start the first batch
  streamTimer = setTimeout(generateTradesBatch, 1000);
  
  // Return a function to stop the stream
  return () => {
    if (streamTimer) {
      clearTimeout(streamTimer);
      streamTimer = null;
    }
  };
};

/**
 * Get base price for a symbol (simulated)
 */
function getBasePrice(symbol) {
  // Simulated base prices for common stocks
  const basePrices = {
    'AAPL': 180,
    'MSFT': 420,
    'GOOGL': 175,
    'AMZN': 185,
    'META': 500,
    'TSLA': 175,
    'JPM': 190,
    'V': 280,
    'JNJ': 145,
    'PG': 160,
    'NVDA': 875,
    'DIS': 110,
    'NFLX': 600,
    'KO': 60,
    'PEP': 170
  };
  
  return basePrices[symbol] || (Math.random() * 200 + 50);
}