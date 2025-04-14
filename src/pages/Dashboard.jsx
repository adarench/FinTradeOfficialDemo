import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  HStack,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  useColorModeValue,
  Icon,
  IconButton,
  Collapse,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import Header from '../components/Header';
import TradeCard from '../components/TradeCard';
import TraderCard from '../components/TraderCard';
import CommentThread from '../components/comments/CommentThread';
import WatchlistSidebar from '../components/WatchlistSidebar';
import PublicTradeFeed from '../components/PublicTradeFeed';
import { fetchMarketIndicesHistory, fetchMarketIndices } from '../services/marketDataService';
import { fetchBotTraders, fetchBotTrades } from '../services/botTraderService';

// Sample data for trades
const sampleTrades = [
  {
    id: 1,
    trader: {
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
    id: 2,
    trader: {
      name: 'Sarah Chen',
      performance: '+36.5% this month',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    },
    action: 'SELL',
    symbol: 'MSFT',
    price: 418.75,
    quantity: 5,
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    gain: -1.5,
  },
  {
    id: 3,
    trader: {
      name: 'David Wilson',
      performance: '+31.2% this month',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    action: 'BUY',
    symbol: 'TSLA',
    price: 171.05,
    quantity: 15,
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    gain: 2.8,
  },
  {
    id: 4,
    trader: {
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
];

// Sample data for traders
const sampleTraders = [
  {
    id: 1,
    name: 'Alex Morgan',
    avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
    performance: 42.8,
    winRate: 78,
    followers: 2453,
    status: 'Following'
  },
  {
    id: 2,
    name: 'Sarah Chen',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    performance: 36.5,
    winRate: 72,
    followers: 1829,
    status: 'Follow'
  },
  {
    id: 3,
    name: 'David Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    performance: 31.2,
    winRate: 68,
    followers: 965,
    status: 'Follow'
  },
  {
    id: 4,
    name: 'Michael Roberts',
    avatar: 'https://randomuser.me/api/portraits/men/64.jpg',
    performance: 28.5,
    winRate: 65,
    followers: 742,
    status: 'Follow'
  },
];

// Sample portfolio data
const portfolioData = {
  totalValue: 108245.62,
  initialValue: 100000,
  change: 8245.62,
  changePercent: 8.24,
  allocations: [
    { symbol: 'AAPL', value: 18263.00, percent: 16.87 },
    { symbol: 'TSLA', value: 25657.50, percent: 23.70 },
    { symbol: 'MSFT', value: 20937.50, percent: 19.34 },
    { symbol: 'NVDA', value: 17606.00, percent: 16.27 },
    { symbol: 'CASH', value: 25781.62, percent: 23.82 },
  ]
};

// Placeholder market index data until real data is loaded
const placeholderMarketIndexData = {
  sp500: [
    { date: '2025-04-01', value: 5200 },
    { date: '2025-04-02', value: 5230 },
    { date: '2025-04-03', value: 5280 },
    { date: '2025-04-04', value: 5310 },
    { date: '2025-04-05', value: 5320 },
    { date: '2025-04-06', value: 5350 },
    { date: '2025-04-07', value: 5380 },
  ],
  nasdaq: [
    { date: '2025-04-01', value: 16800 },
    { date: '2025-04-02', value: 16920 },
    { date: '2025-04-03', value: 17050 },
    { date: '2025-04-04', value: 17200 },
    { date: '2025-04-05', value: 17150 },
    { date: '2025-04-06', value: 17300 },
    { date: '2025-04-07', value: 17450 },
  ],
  dowJones: [
    { date: '2025-04-01', value: 38500 },
    { date: '2025-04-02', value: 38600 },
    { date: '2025-04-03', value: 38700 },
    { date: '2025-04-04', value: 38650 },
    { date: '2025-04-05', value: 38750 },
    { date: '2025-04-06', value: 38900 },
    { date: '2025-04-07', value: 39050 },
  ],
  russell2000: [
    { date: '2025-04-01', value: 2050 },
    { date: '2025-04-02', value: 2070 },
    { date: '2025-04-03', value: 2080 },
    { date: '2025-04-04', value: 2100 },
    { date: '2025-04-05', value: 2090 },
    { date: '2025-04-06', value: 2110 },
    { date: '2025-04-07', value: 2130 },
  ],
};

const MotionBox = motion(Box);

const Dashboard = () => {
  const [newTradeAlert, setNewTradeAlert] = useState(false);
  const [traders, setTraders] = useState(sampleTraders);
  const [botTraders, setBotTraders] = useState([]);
  const [botTrades, setBotTrades] = useState([]);
  const [showMarketIndices, setShowMarketIndices] = useState(true);
  const [selectedIndices, setSelectedIndices] = useState({
    sp500: true,
    nasdaq: true,
    dowJones: false,
    russell2000: false
  });
  const [marketIndexData, setMarketIndexData] = useState(placeholderMarketIndexData);
  const [marketIndicesInfo, setMarketIndicesInfo] = useState([]);
  const [loadingIndices, setLoadingIndices] = useState(true);
  const [loadingBotData, setLoadingBotData] = useState(true);
  const [indexTimeframe, setIndexTimeframe] = useState('1week');
  
  const bgColor = useColorModeValue('gray.800', 'gray.800');
  const borderColor = useColorModeValue('gray.700', 'gray.700');
  const statBgColor = useColorModeValue('gray.700', 'gray.700');
  
  const handleFollowToggle = (traderId, status) => {
    // Update the traders array with new status
    setTraders(prevTraders => 
      prevTraders.map(trader => 
        trader.id === traderId ? { ...trader, status } : trader
      )
    );
  };
  
  const toggleIndex = (index) => {
    setSelectedIndices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Fetch real market index data
  const loadMarketIndices = async () => {
    try {
      setLoadingIndices(true);
      console.log('Fetching market indices data...');
      
      // Fetch current index values
      const currentIndices = await fetchMarketIndices();
      console.log('Market indices received:', currentIndices);
      setMarketIndicesInfo(currentIndices);
      
      // Fetch historical data for the indices
      console.log(`Fetching historical data for timeframe: ${indexTimeframe}`);
      const historicalData = await fetchMarketIndicesHistory(indexTimeframe);
      
      console.log('Historical data received:', Object.keys(historicalData).map(k => 
        `${k}: ${historicalData[k]?.length || 0} points`
      ));
      
      // If we got data, update our state
      if (historicalData && Object.keys(historicalData).length > 0) {
        // Verify that we have data for each index
        const hasData = Object.values(historicalData).every(arr => arr && arr.length > 0);
        
        if (hasData) {
          console.log('Setting historical market data with real values');
          setMarketIndexData(historicalData);
        } else {
          console.warn('Some indices have no data, using placeholder data');
          setMarketIndexData(placeholderMarketIndexData);
        }
      } else {
        // If API call failed, keep using placeholder data
        console.warn('No historical market data received, using placeholder data');
        setMarketIndexData(placeholderMarketIndexData);
      }
    } catch (error) {
      console.error('Error loading market indices:', error);
      console.warn('Using placeholder market index data due to error');
      // Keep using placeholder data
      setMarketIndexData(placeholderMarketIndexData);
    } finally {
      setLoadingIndices(false);
    }
  };
  
  // Fetch bot traders and their trades
  const loadBotData = async () => {
    try {
      setLoadingBotData(true);
      
      // Fetch bot traders
      const traders = await fetchBotTraders();
      setBotTraders(traders);
      
      // Fetch recent bot trades
      const trades = await fetchBotTrades();
      setBotTrades(trades);
      
      // If we have a new trade, show an alert
      if (trades.length > 0) {
        const latestTrade = trades[0];
        const timestamp = latestTrade.timestamp?.getTime() || 0;
        const now = Date.now();
        
        // Only show alert for trades in the last 5 minutes
        if (now - timestamp < 5 * 60 * 1000) {
          setNewTradeAlert(true);
          setTimeout(() => {
            setNewTradeAlert(false);
          }, 5000);
        }
      }
    } catch (error) {
      console.error('Error loading bot data:', error);
    } finally {
      setLoadingBotData(false);
    }
  };
  
  // Format bot trades into the format expected by TradeCard
  const formatBotTrades = () => {
    if (!botTrades.length) return [];
    
    return botTrades.map(trade => {
      // Find the bot trader for this trade
      const trader = botTraders.find(t => t.id === trade.traderId) || {
        id: trade.traderId,
        name: trade.traderName,
        avatar: trade.traderAvatar,
        performance: 0
      };
      
      // Calculate gain percentage if not provided
      const gain = trade.gain || 0;
      
      return {
        id: trade.id,
        trader: {
          id: trader.id,
          name: trader.name,
          performance: `${trader.performance >= 0 ? '+' : ''}${trader.performance}% this month`,
          avatar: trader.avatar,
        },
        action: trade.action,
        symbol: trade.symbol,
        price: trade.price,
        quantity: trade.quantity,
        timestamp: trade.timestamp || new Date(),
        gain: gain,
        rationale: trade.rationale || '',
        tradingStyle: trade.tradingStyle || 'momentum'
      };
    });
  };
  
  // Format bot traders into the format expected by TraderCard
  const formatBotTraders = () => {
    if (!botTraders.length) return [];
    
    return botTraders.map(bot => ({
      id: bot.id,
      name: bot.name,
      avatar: bot.avatar,
      performance: bot.performance?.overall || 0,
      winRate: bot.performance?.winRate || 0,
      followers: bot.followers || 0,
      status: 'Follow',
      isBot: true,
      tradingStyle: bot.tradingStyle,
      strategy: bot.strategy
    }));
  };
  
  // Load market indices on component mount and when timeframe changes
  useEffect(() => {
    console.log('Loading market indices...');
    const loadData = async () => {
      // Log the current state before loading
      console.log('Current market data state:', 
        { indexTimeframe, hasIndices: !!marketIndicesInfo.length }
      );
      
      // Load market indices data
      await loadMarketIndices();
      
      // Verify data was loaded
      console.log('Market indices loaded:',
        { hasIndices: !!marketIndicesInfo.length }
      );
    };
    
    loadData();
    
    // Refresh market data every 2 minutes
    const marketRefreshInterval = setInterval(() => {
      console.log('Refreshing market data...');
      loadData();
    }, 2 * 60 * 1000);
    
    return () => clearInterval(marketRefreshInterval);
  }, [indexTimeframe]);
  
  // Load bot data on component mount
  useEffect(() => {
    loadBotData();
    
    // Set up a refresh interval
    const refreshInterval = setInterval(() => {
      loadBotData();
    }, 2 * 60 * 1000); // Refresh every 2 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.950">
      <Header />
      
      <Box flex="1" py={8}>
        <Container maxW="1400px">
          {/* Market Indices */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            bg={bgColor}
            p={4}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
            mb={8}
          >
            <Flex justify="space-between" align="center" mb={3}>
              <Heading size="md" color="white">Market Indices</Heading>
              <HStack spacing={2}>
                <HStack spacing={1}>
                  <Button 
                    size="xs" 
                    colorScheme="accent"
                    variant={indexTimeframe === '1week' ? "solid" : "outline"}
                    onClick={() => setIndexTimeframe('1week')}
                  >
                    1W
                  </Button>
                  <Button 
                    size="xs" 
                    colorScheme="accent"
                    variant={indexTimeframe === '1month' ? "solid" : "outline"}
                    onClick={() => setIndexTimeframe('1month')}
                  >
                    1M
                  </Button>
                  <Button 
                    size="xs" 
                    colorScheme="accent"
                    variant={indexTimeframe === '3months' ? "solid" : "outline"}
                    onClick={() => setIndexTimeframe('3months')}
                  >
                    3M
                  </Button>
                </HStack>
                
                <Box width="2px" height="20px" bg="gray.700" mx={1} />
                
                <HStack spacing={1}>
                  <Button 
                    size="xs" 
                    colorScheme="teal"
                    variant={selectedIndices.sp500 ? "solid" : "outline"}
                    onClick={() => toggleIndex('sp500')}
                  >
                    S&P 500
                  </Button>
                  <Button 
                    size="xs" 
                    colorScheme="purple"
                    variant={selectedIndices.nasdaq ? "solid" : "outline"}
                    onClick={() => toggleIndex('nasdaq')}
                  >
                    Nasdaq
                  </Button>
                  <Button 
                    size="xs" 
                    colorScheme="blue"
                    variant={selectedIndices.dowJones ? "solid" : "outline"}
                    onClick={() => toggleIndex('dowJones')}
                  >
                    Dow Jones
                  </Button>
                  <Button 
                    size="xs" 
                    colorScheme="orange"
                    variant={selectedIndices.russell2000 ? "solid" : "outline"}
                    onClick={() => toggleIndex('russell2000')}
                  >
                    Russell 2000
                  </Button>
                </HStack>
                
                <IconButton
                  aria-label="Toggle market indices"
                  icon={showMarketIndices ? <Text fontSize="xl">−</Text> : <Text fontSize="xl">+</Text>}
                  size="xs"
                  onClick={() => setShowMarketIndices(!showMarketIndices)}
                  variant="ghost"
                  colorScheme="whiteAlpha"
                />
              </HStack>
            </Flex>
            
            {marketIndicesInfo && marketIndicesInfo.length > 0 && (
              <Flex wrap="wrap" mb={2} justify="center" gap={3}>
                {marketIndicesInfo.map((index) => (
                  <Box 
                    key={index.symbol}
                    py={1}
                    px={3}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.700"
                    bg="gray.800"
                  >
                    <Text fontSize="sm" fontWeight="bold" color="white">{index.name}</Text>
                    <Flex align="center" mt={1}>
                      <Text fontSize="sm" fontWeight="medium" color="white">
                        {index.price ? `$${index.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'}
                      </Text>
                      {index.changePercent && (
                        <Text 
                          fontSize="xs" 
                          ml={2}
                          color={index.changePercent >= 0 ? 'green.400' : 'red.400'}
                        >
                          {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                        </Text>
                      )}
                    </Flex>
                  </Box>
                ))}
              </Flex>
            )}
            
            <Collapse in={showMarketIndices} animateOpacity>
              {loadingIndices ? (
                <Center h="200px">
                  <Spinner color="accent.500" size="lg" />
                </Center>
              ) : (
                <Box h="200px" mt={2}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#9ca3af' }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        stroke="rgba(255, 255, 255, 0.1)"
                        allowDuplicatedCategory={false}
                      />
                      <YAxis 
                        tick={{ fill: '#9ca3af' }}
                        stroke="rgba(255, 255, 255, 0.1)"
                        domain={['auto', 'auto']}
                        yAxisId="right"
                        orientation="right"
                        scale="auto"
                      />
                      <YAxis 
                        tick={{ fill: '#9ca3af' }}
                        stroke="rgba(255, 255, 255, 0.1)"
                        domain={['auto', 'auto']}
                        yAxisId="left"
                        orientation="left"
                        scale="auto"
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, '']}
                        labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        contentStyle={{ backgroundColor: bgColor, borderColor, borderRadius: '8px' }}
                        itemStyle={{ color: 'white' }}
                        labelStyle={{ color: 'white' }}
                      />
                      
                      {selectedIndices.sp500 && marketIndexData.sp500 && marketIndexData.sp500.length > 0 && (
                        <Line 
                          data={marketIndexData.sp500} 
                          dataKey="value" 
                          name="S&P 500" 
                          stroke="#38b2ac" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                          yAxisId="left"
                        />
                      )}
                      
                      {selectedIndices.nasdaq && marketIndexData.nasdaq && marketIndexData.nasdaq.length > 0 && (
                        <Line 
                          data={marketIndexData.nasdaq} 
                          dataKey="value" 
                          name="Nasdaq" 
                          stroke="#805ad5" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                          yAxisId="right"
                        />
                      )}
                      
                      {selectedIndices.dowJones && marketIndexData.dowJones && marketIndexData.dowJones.length > 0 && (
                        <Line 
                          data={marketIndexData.dowJones} 
                          dataKey="value" 
                          name="Dow Jones" 
                          stroke="#4299e1" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                          yAxisId="left"
                        />
                      )}
                      
                      {selectedIndices.russell2000 && marketIndexData.russell2000 && marketIndexData.russell2000.length > 0 && (
                        <Line 
                          data={marketIndexData.russell2000} 
                          dataKey="value" 
                          name="Russell 2000" 
                          stroke="#f6ad55" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                          yAxisId="right"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Collapse>
            
            {loadingIndices && !showMarketIndices && (
              <Center mt={2}>
                <Spinner size="sm" color="accent.500" mr={2} />
                <Text fontSize="sm" color="gray.400">Fetching market data...</Text>
              </Center>
            )}
          </MotionBox>

          {/* Portfolio Overview */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Stat>
                <StatLabel color="gray.400">Total Portfolio Value</StatLabel>
                <StatNumber color="white">${portfolioData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</StatNumber>
                <StatHelpText color="green.400">
                  <StatArrow type="increase" />
                  {portfolioData.changePercent}% since start
                </StatHelpText>
              </Stat>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Stat>
                <StatLabel color="gray.400">Cash Available</StatLabel>
                <StatNumber color="white">
                  ${portfolioData.allocations.find(a => a.symbol === 'CASH').value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </StatNumber>
                <StatHelpText color="gray.400">
                  {portfolioData.allocations.find(a => a.symbol === 'CASH').percent.toFixed(1)}% of portfolio
                </StatHelpText>
              </Stat>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Stat>
                <StatLabel color="gray.400">Traders Following</StatLabel>
                <StatNumber color="white">1</StatNumber>
                <StatHelpText>
                  <RouterLink to="#traders">
                    <Text color="accent.400">View traders</Text>
                  </RouterLink>
                </StatHelpText>
              </Stat>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Stat>
                <StatLabel color="gray.400">Total Trades</StatLabel>
                <StatNumber color="white">4</StatNumber>
                <StatHelpText>
                  <RouterLink to="/portfolio">
                    <Text color="accent.400">View all trades</Text>
                  </RouterLink>
                </StatHelpText>
              </Stat>
            </MotionBox>
          </SimpleGrid>
          
          {/* Main Dashboard Content */}
          <Grid templateColumns={{ base: '1fr', xl: '7fr 3fr' }} gap={8}>
            <GridItem>
              <Tabs variant="enclosed" colorScheme="accent" bg={bgColor} borderRadius="xl" boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)" borderWidth="1px" borderColor={borderColor}>
                <TabList px={6} pt={4}>
                  <Tab>Copy Feed</Tab>
                  <Tab>My Traders</Tab>
                  <Tab>Discover</Tab>
                </TabList>
                
                <TabPanels>
                  {/* Trade Feed Tab */}
                  <TabPanel p={6}>
                    <Tabs variant="soft-rounded" colorScheme="accent" size="sm" mb={6}>
                      <TabList>
                        <Tab>Trade Feed</Tab>
                        <Tab>Community</Tab>
                      </TabList>
                      
                      <TabPanels mt={4}>
                        <TabPanel p={0}>
                          <PublicTradeFeed />
                        </TabPanel>
                        
                        {/* Community Feed Tab */}
                        <TabPanel p={0}>
                          <Flex justify="space-between" align="center" mb={6}>
                            <Heading size="md" color="white">Alex Morgan's Community</Heading>
                            <Select 
                              size="sm" 
                              w="180px" 
                              defaultValue="alex"
                              bg="gray.700" 
                              borderColor="gray.600" 
                              color="white" 
                              _hover={{ borderColor: "gray.500" }}
                            >
                              <option value="alex" style={{backgroundColor: "#1e293b"}}>Alex Morgan's Feed</option>
                              <option value="sarah" style={{backgroundColor: "#1e293b"}}>Sarah Chen's Feed</option>
                              <option value="david" style={{backgroundColor: "#1e293b"}}>David Wilson's Feed</option>
                            </Select>
                          </Flex>
                          
                          <Box 
                            bg="gray.800" 
                            borderRadius="lg" 
                            p={6} 
                            borderWidth="1px" 
                            borderColor="gray.700"
                            boxShadow="0 4px 20px rgba(0,0,0,0.2)"
                          >
                            <CommentThread tradeId="community-alex" traderId="1" />
                          </Box>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </TabPanel>
                  
                  {/* My Traders Tab */}
                  <TabPanel p={6}>
                    <Flex justify="space-between" align="center" mb={6}>
                      <Heading size="md" color="white">Traders You Follow</Heading>
                      <Button 
                        size="sm" 
                        variant="outline"
                        borderColor="accent.500"
                        color="accent.400"
                        _hover={{ bg: 'rgba(25, 118, 210, 0.1)', borderColor: 'accent.400' }}
                        style={{ transition: 'all 0.2s ease' }}
                      >
                        Find More Traders
                      </Button>
                    </Flex>
                    
                    {/* Loading State */}
                    {loadingBotData && botTraders.length === 0 && (
                      <Box textAlign="center" py={8}>
                        <Spinner size="md" color="accent.500" mb={4} />
                        <Text color="gray.400">Loading traders...</Text>
                      </Box>
                    )}
                    
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      {/* Show human traders you're following */}
                      {traders.filter(trader => trader.status === 'Following').map(trader => (
                        <TraderCard key={trader.id} trader={trader} onFollowToggle={handleFollowToggle} />
                      ))}
                      
                      {/* Show bot traders you're following */}
                      {formatBotTraders().filter(bot => bot.status === 'Following').map(bot => (
                        <TraderCard key={bot.id} trader={bot} onFollowToggle={handleFollowToggle} />
                      ))}
                    </SimpleGrid>
                    
                    <Box mt={8}>
                      <Heading size="md" mb={4} color="white">Bot Traders</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        {formatBotTraders().slice(0, 4).map(bot => (
                          <TraderCard 
                            key={bot.id} 
                            trader={bot} 
                            onFollowToggle={handleFollowToggle}
                            showStrategy={true}
                          />
                        ))}
                      </SimpleGrid>
                    </Box>
                    
                    <Box mt={8}>
                      <Heading size="md" mb={4} color="white">Human Traders</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        {traders.filter(trader => trader.status !== 'Following').slice(0, 2).map(trader => (
                          <TraderCard key={trader.id} trader={trader} onFollowToggle={handleFollowToggle} />
                        ))}
                      </SimpleGrid>
                    </Box>
                  </TabPanel>
                  
                  {/* Discover Tab */}
                  <TabPanel p={6}>
                    <Flex justify="space-between" align="center" mb={6}>
                      <Heading size="md" color="white">Leaderboards</Heading>
                      <HStack>
                        <Select 
                          size="sm" 
                          w="180px" 
                          defaultValue="performance"
                          bg="gray.700" 
                          borderColor="gray.600" 
                          color="white" 
                          _hover={{ borderColor: "gray.500" }}
                        >
                          <option value="performance" style={{backgroundColor: "#1e293b"}}>Highest Performance</option>
                          <option value="winrate" style={{backgroundColor: "#1e293b"}}>Best Win Rate</option>
                          <option value="followers" style={{backgroundColor: "#1e293b"}}>Most Followers</option>
                        </Select>
                      </HStack>
                    </Flex>
                    
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      {traders.map(trader => (
                        <TraderCard key={trader.id} trader={trader} onFollowToggle={handleFollowToggle} />
                      ))}
                    </SimpleGrid>
                    
                    <Flex justify="center" mt={8}>
                      <Button 
                        variant="outline" 
                        size="md"
                        borderColor="gray.600"
                        color="gray.300"
                        _hover={{ bg: 'rgba(255,255,255,0.05)', borderColor: 'gray.500' }}
                        style={{ transition: 'all 0.2s ease' }}
                      >
                        Show More Traders
                      </Button>
                    </Flex>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </GridItem>
            
            {/* Side Panel */}
            <GridItem>
              <VStack spacing={8} align="stretch">
                {/* Account Summary */}
                <MotionBox
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  bg={bgColor}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Heading size="md" mb={4} color="white">
                    Portfolio Summary
                  </Heading>
                  
                  <Stat mb={4}>
                    <StatLabel color="gray.400">Total P&L</StatLabel>
                    <StatNumber color="green.400">
                      +${portfolioData.change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (+{portfolioData.changePercent}%)
                    </StatNumber>
                    <StatHelpText color="gray.400">
                      <StatArrow type="increase" color="green.400" />
                      {portfolioData.changePercent}% since start
                    </StatHelpText>
                  </Stat>
                  
                  <RouterLink to="/portfolio">
                    <Button 
                      variant="outline" 
                      w="full" 
                      mt={2} 
                      size="sm"
                      borderColor="gray.600"
                      color="gray.300"
                      _hover={{ bg: 'rgba(255,255,255,0.05)', borderColor: 'gray.500' }}
                      style={{ transition: 'all 0.2s ease' }}
                    >
                      View Full Portfolio
                    </Button>
                  </RouterLink>
                </MotionBox>
                
                {/* Watchlist */}
                <MotionBox
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  bg={bgColor}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <WatchlistSidebar />
                </MotionBox>
                
                {/* Quick Actions */}
                <MotionBox
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  bg={bgColor}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Heading size="md" mb={4} color="white">
                    Quick Actions
                  </Heading>
                  
                  <SimpleGrid columns={1} spacing={3}>
                    <Button 
                      size="md" 
                      bg="accent.500"
                      color="white"
                      _hover={{ bg: 'accent.600', transform: 'translateY(-2px)' }}
                      boxShadow="0 4px 14px 0 rgba(25, 118, 210, 0.25)"
                      style={{ transition: 'all 0.2s ease' }}
                    >
                      Discover Top Traders
                    </Button>
                    <Button 
                      size="md" 
                      variant="outline"
                      borderColor="gray.600"
                      color="gray.300"
                      _hover={{ bg: 'rgba(255,255,255,0.05)', borderColor: 'gray.500' }}
                      style={{ transition: 'all 0.2s ease' }}
                    >
                      Connect IBKR Account
                    </Button>
                    <Button 
                      size="md" 
                      variant="outline"
                      borderColor="gray.600"
                      color="gray.300"
                      _hover={{ bg: 'rgba(255,255,255,0.05)', borderColor: 'gray.500' }}
                      style={{ transition: 'all 0.2s ease' }}
                    >
                      Adjust Copy Settings
                    </Button>
                  </SimpleGrid>
                </MotionBox>
              </VStack>
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;