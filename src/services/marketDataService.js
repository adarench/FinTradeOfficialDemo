import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  where,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';

// Alpha Vantage API key
const API_KEY = 'GYOQO9HRU7DRKT4T';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

// Debug mode to log API calls and responses
const DEBUG = true;

// Firestore collections for caching
const marketDataCollection = collection(db, 'marketData');
const historicalDataCollection = collection(db, 'historicalData');
const assetMetadataCollection = collection(db, 'assetMetadata');

/**
 * Fetch current price for a symbol with caching
 */
export const fetchCurrentPrice = async (symbol) => {
  try {
    // Check cache first
    const cacheRef = doc(marketDataCollection, symbol);
    const cachedData = await getDoc(cacheRef);
    
    // If we have recent cached data, use it
    if (cachedData.exists()) {
      const data = cachedData.data();
      const now = Date.now();
      const timestamp = data.timestamp?.toMillis ? data.timestamp.toMillis() : 0;
      
      if (now - timestamp < CACHE_TTL) {
        console.log(`Using cached data for ${symbol}`);
        return data;
      }
    }
    
    // Otherwise fetch from API
    console.log(`Fetching live data for ${symbol}`);
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    const result = await response.json();
    
    if (DEBUG) console.log(`API response for ${symbol}:`, result);
    
    // Check if we got valid data
    if (result['Global Quote'] && result['Global Quote']['05. price']) {
      const price = parseFloat(result['Global Quote']['05. price']);
      const change = parseFloat(result['Global Quote']['09. change']);
      const changePercent = parseFloat(result['Global Quote']['10. change percent'].replace('%', ''));
      const volume = parseInt(result['Global Quote']['06. volume']);
      
      // Format the data
      const priceData = {
        symbol,
        price,
        change,
        changePercent,
        volume,
        timestamp: serverTimestamp(),
        lastUpdated: new Date().toISOString()
      };
      
      if (DEBUG) console.log(`✅ Valid price data for ${symbol}:`, priceData);
      
      // Cache the data
      await setDoc(cacheRef, priceData);
      
      return priceData;
    } else if (result.Note && result.Note.includes('API call frequency')) {
      // Handle API rate limit
      console.warn(`Alpha Vantage API rate limit reached for ${symbol}. Using fallback data.`);
      
      // Use cached data if available, otherwise simulate
      if (cachedData.exists()) {
        const data = cachedData.data();
        // Slightly modify the data to simulate an update
        const simulatedData = {
          ...data,
          lastUpdated: new Date().toISOString(),
        };
        return simulatedData;
      } else {
        return simulatedStockData(symbol);
      }
    } else {
      console.error(`Invalid data received from Alpha Vantage API for ${symbol}:`, result);
      throw new Error('Invalid data received from Alpha Vantage API');
    }
  } catch (error) {
    console.error(`Error fetching current price for ${symbol}:`, error);
    // Instead of failing, return simulated data
    return simulatedStockData(symbol);
  }
};

/**
 * Fetch historical data for a symbol with caching
 */
export const fetchHistoricalData = async (symbol, timeframe = '1month') => {
  try {
    // Check cache first
    const cacheKey = `${symbol}_${timeframe}`;
    const cacheRef = doc(historicalDataCollection, cacheKey);
    const cachedData = await getDoc(cacheRef);
    
    // If we have recent cached data, use it
    if (cachedData.exists()) {
      const data = cachedData.data();
      const now = Date.now();
      const timestamp = data.timestamp?.toMillis ? data.timestamp.toMillis() : 0;
      
      if (now - timestamp < CACHE_TTL) {
        console.log(`Using cached historical data for ${symbol}`);
        return data.timeSeriesData;
      }
    }
    
    // Map timeframe to Alpha Vantage function and interval
    let functionName, interval;
    switch (timeframe) {
      case '1day':
        functionName = 'TIME_SERIES_INTRADAY';
        interval = '15min';
        break;
      case '1week':
        functionName = 'TIME_SERIES_DAILY';
        break;
      case '1month':
        functionName = 'TIME_SERIES_DAILY';
        break;
      case '3months':
        functionName = 'TIME_SERIES_DAILY';
        break;
      case 'all':
      default:
        functionName = 'TIME_SERIES_WEEKLY';
        break;
    }
    
    // Fetch from API
    let url = `https://www.alphavantage.co/query?function=${functionName}&symbol=${symbol}&apikey=${API_KEY}`;
    if (interval) {
      url += `&interval=${interval}`;
    }
    if (functionName === 'TIME_SERIES_DAILY') {
      url += '&outputsize=compact';
    }
    
    const response = await fetch(url);
    const result = await response.json();
    
    // Extract the time series data
    let timeSeriesKey;
    if (functionName === 'TIME_SERIES_INTRADAY') {
      timeSeriesKey = `Time Series (${interval})`;
    } else if (functionName === 'TIME_SERIES_DAILY') {
      timeSeriesKey = 'Time Series (Daily)';
    } else if (functionName === 'TIME_SERIES_WEEKLY') {
      timeSeriesKey = 'Weekly Time Series';
    }
    
    if (!result[timeSeriesKey]) {
      throw new Error(`No time series data found for ${symbol}`);
    }
    
    // Format the data for our charts
    const timeSeriesData = Object.entries(result[timeSeriesKey]).map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'])
    }));
    
    // Sort by date ascending
    timeSeriesData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Get the correct number of data points based on timeframe
    let filteredData;
    const currentDate = new Date();
    
    switch (timeframe) {
      case '1day':
        // Last 24 hours of data (96 points at 15min intervals)
        filteredData = timeSeriesData.slice(-96);
        break;
      case '1week':
        // Last 7 days
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredData = timeSeriesData.filter(item => new Date(item.date) >= oneWeekAgo);
        break;
      case '1month':
        // Last 30 days
        const oneMonthAgo = new Date(currentDate);
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
        filteredData = timeSeriesData.filter(item => new Date(item.date) >= oneMonthAgo);
        break;
      case '3months':
        // Last 90 days
        const threeMonthsAgo = new Date(currentDate);
        threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
        filteredData = timeSeriesData.filter(item => new Date(item.date) >= threeMonthsAgo);
        break;
      case 'all':
      default:
        // All available data
        filteredData = timeSeriesData;
        break;
    }
    
    // Cache the data
    await setDoc(cacheRef, {
      symbol,
      timeframe,
      timeSeriesData: filteredData,
      timestamp: serverTimestamp(),
      lastUpdated: new Date().toISOString()
    });
    
    return filteredData;
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Fetch asset metadata (company info, sector, etc.)
 */
export const fetchAssetMetadata = async (symbol) => {
  try {
    // Check cache first
    const cacheRef = doc(assetMetadataCollection, symbol);
    const cachedData = await getDoc(cacheRef);
    
    // Metadata can be cached for longer periods
    if (cachedData.exists()) {
      const data = cachedData.data();
      // For metadata, we can use a longer TTL (1 day)
      const now = Date.now();
      const timestamp = data.timestamp?.toMillis ? data.timestamp.toMillis() : 0;
      
      if (now - timestamp < 24 * 60 * 60 * 1000) {
        console.log(`Using cached metadata for ${symbol}`);
        return data;
      }
    }
    
    // Fetch from API
    const response = await fetch(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
    );
    const result = await response.json();
    
    // Check if we got valid data
    if (result.Symbol) {
      const metadata = {
        symbol: result.Symbol,
        name: result.Name,
        description: result.Description,
        sector: result.Sector || 'Unknown',
        industry: result.Industry || 'Unknown',
        instrumentType: 'Stock', // Default to stock
        exchange: result.Exchange || 'Unknown',
        marketCap: result.MarketCapitalization ? parseInt(result.MarketCapitalization) : null,
        peRatio: result.PERatio ? parseFloat(result.PERatio) : null,
        timestamp: serverTimestamp(),
        lastUpdated: new Date().toISOString()
      };
      
      // Cache the data
      await setDoc(cacheRef, metadata);
      
      return metadata;
    } else {
      throw new Error('Invalid metadata received from Alpha Vantage API');
    }
  } catch (error) {
    console.error(`Error fetching metadata for ${symbol}:`, error);
    
    // For metadata, return a default object if API fails
    return {
      symbol,
      name: symbol,
      description: '',
      sector: 'Technology', // Default sector
      industry: 'Unknown',
      instrumentType: 'Stock',
      exchange: 'NASDAQ',
      marketCap: null,
      peRatio: null,
      timestamp: new Date().getTime(),
      lastUpdated: new Date().toISOString()
    };
  }
};

/**
 * Fetch market indices data
 */
export const fetchMarketIndices = async () => {
  if (DEBUG) console.log('Fetching market indices data...');
  
  // Define the indices we want to track
  const indices = [
    { symbol: 'SPY', name: 'S&P 500', type: 'index' },
    { symbol: 'QQQ', name: 'Nasdaq', type: 'index' },
    { symbol: 'DIA', name: 'Dow Jones', type: 'index' },
    { symbol: 'IWM', name: 'Russell 2000', type: 'index' }
  ];
  
  try {
    // Fetch current prices for all indices in parallel
    const indicesData = await Promise.all(
      indices.map(async (index) => {
        try {
          const priceData = await fetchCurrentPrice(index.symbol);
          return {
            ...index,
            price: priceData.price,
            change: priceData.change,
            changePercent: priceData.changePercent
          };
        } catch (error) {
          console.error(`Error fetching index data for ${index.symbol}:`, error);
          return {
            ...index,
            price: null,
            change: null,
            changePercent: null,
            error: true
          };
        }
      })
    );
    
    return indicesData;
  } catch (error) {
    console.error('Error fetching market indices:', error);
    throw error;
  }
};

/**
 * Generate simulated stock data
 */
function simulatedStockData(symbol) {
  // Base prices for common stocks to make simulated data more realistic
  const basePrices = {
    'SPY': 500,     // S&P 500 ETF
    'QQQ': 420,     // Nasdaq ETF
    'DIA': 380,     // Dow Jones ETF
    'IWM': 200,     // Russell 2000 ETF
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
  
  // Get base price or generate random one
  const basePrice = basePrices[symbol] || Math.floor(Math.random() * 300) + 50;
  
  // Generate small random change
  const changePercent = (Math.random() * 4) - 2; // -2% to +2%
  const change = basePrice * (changePercent / 100);
  const price = basePrice + change;
  const volume = Math.floor(Math.random() * 5000000) + 100000;
  
  return {
    symbol,
    price,
    change,
    changePercent,
    volume,
    timestamp: Date.now(),
    lastUpdated: new Date().toISOString(),
    simulated: true
  };
}

/**
 * Fetch historical data for market indices
 */
export const fetchMarketIndicesHistory = async (timeframe = '1month') => {
  if (DEBUG) console.log(`Fetching market indices history for timeframe: ${timeframe}`);
  
  // Define the indices we want to track
  const indices = [
    { symbol: 'SPY', name: 'sp500' },
    { symbol: 'QQQ', name: 'nasdaq' },
    { symbol: 'DIA', name: 'dowJones' },
    { symbol: 'IWM', name: 'russell2000' }
  ];
  
  try {
    // Fetch historical data for all indices in parallel
    const indicesData = {};
    
    await Promise.all(
      indices.map(async (index) => {
        try {
          const historicalData = await fetchHistoricalData(index.symbol, timeframe);
          // Format the data for our charts
          indicesData[index.name] = historicalData.map(dataPoint => ({
            date: dataPoint.date,
            value: dataPoint.close
          }));
          
          if (DEBUG) console.log(`✅ Got historical data for ${index.name} (${historicalData.length} data points)`);
        } catch (error) {
          console.error(`Error fetching index history for ${index.symbol}:`, error);
          // Generate simulated historical data
          indicesData[index.name] = generateSimulatedHistoricalData(index.symbol, timeframe);
          console.log(`⚠️ Using simulated data for ${index.name}`);
        }
      })
    );
    
    if (DEBUG) {
      Object.keys(indicesData).forEach(key => {
        console.log(`${key}: ${indicesData[key].length} data points`);
      });
    }
    
    return indicesData;
  } catch (error) {
    console.error('Error fetching market indices history:', error);
    // Generate simulated data for all indices
    const simulatedData = {};
    
    for (const index of indices) {
      simulatedData[index.name] = generateSimulatedHistoricalData(index.symbol, timeframe);
    }
    
    return simulatedData;
  }
};

/**
 * Generate simulated historical data when API fails
 */
function generateSimulatedHistoricalData(symbol, timeframe) {
  // Determine number of data points based on timeframe
  let days;
  switch (timeframe) {
    case '1week': days = 7; break;
    case '1month': days = 30; break;
    case '3months': days = 90; break;
    default: days = 30;
  }
  
  // Get base price for the symbol
  const basePrices = {
    'SPY': 500,
    'QQQ': 420,
    'DIA': 380,
    'IWM': 200
  };
  
  const basePrice = basePrices[symbol] || 100;
  const volatility = 0.01; // 1% daily volatility
  let currentPrice = basePrice;
  
  // Generate data points
  const data = [];
  
  // Start from days ago and move forward
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Generate realistic price movement
    const change = currentPrice * volatility * (Math.random() * 2 - 1);
    currentPrice += change;
    
    // Ensure price doesn't go too low
    if (currentPrice < basePrice * 0.7) currentPrice = basePrice * 0.7;
    
    // Add data point
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(currentPrice.toFixed(2))
    });
  }
  
  return data;
};

/**
 * Update cached data for all symbols in a watchlist
 */
export const updateWatchlistData = async (symbols) => {
  if (!symbols || symbols.length === 0) return;
  
  try {
    // Update in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      await Promise.all(batch.map(symbol => fetchCurrentPrice(symbol)));
      
      // Small delay between batches to avoid API rate limits
      if (i + batchSize < symbols.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`Updated data for ${symbols.length} symbols`);
    return true;
  } catch (error) {
    console.error('Error updating watchlist data:', error);
    return false;
  }
};

/**
 * Get all cached market data
 */
export const getAllCachedMarketData = async () => {
  try {
    const snapshot = await getDocs(marketDataCollection);
    const data = {};
    
    snapshot.forEach(doc => {
      data[doc.id] = doc.data();
    });
    
    return data;
  } catch (error) {
    console.error('Error getting cached market data:', error);
    return {};
  }
};