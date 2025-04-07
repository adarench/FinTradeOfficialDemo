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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import TradeCard from '../components/TradeCard';
import TraderCard from '../components/TraderCard';

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

const MotionBox = motion(Box);

const Dashboard = () => {
  const [newTradeAlert, setNewTradeAlert] = useState(false);
  const [traders, setTraders] = useState(sampleTraders);
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
  
  useEffect(() => {
    // Simulate new trade alerts
    const timer = setTimeout(() => {
      setNewTradeAlert(true);
      
      // Hide the alert after a few seconds
      setTimeout(() => {
        setNewTradeAlert(false);
      }, 5000);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.950">
      <Header />
      
      <Box flex="1" py={8}>
        <Container maxW="1400px">
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
                    <Flex justify="space-between" align="center" mb={6}>
                      <Heading size="md" color="white">Recent Trades</Heading>
                      <HStack>
                        <Select size="sm" w="180px" placeholder="All Traders" bg="gray.700" borderColor="gray.600" color="white" _hover={{ borderColor: "gray.500" }}>
                          <option value="alex" style={{backgroundColor: "#1e293b"}}>Alex Morgan</option>
                          <option value="sarah" style={{backgroundColor: "#1e293b"}}>Sarah Chen</option>
                          <option value="david" style={{backgroundColor: "#1e293b"}}>David Wilson</option>
                        </Select>
                        <Select size="sm" w="120px" placeholder="All Assets" bg="gray.700" borderColor="gray.600" color="white" _hover={{ borderColor: "gray.500" }}>
                          <option value="stocks" style={{backgroundColor: "#1e293b"}}>Stocks</option>
                          <option value="crypto" style={{backgroundColor: "#1e293b"}}>Crypto</option>
                          <option value="forex" style={{backgroundColor: "#1e293b"}}>Forex</option>
                        </Select>
                      </HStack>
                    </Flex>
                    
                    {/* New Trade Alert */}
                    {newTradeAlert && (
                      <MotionBox
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        mb={4}
                        p={4}
                        bg="rgba(21, 128, 61, 0.1)"
                        color="white"
                        borderRadius="md"
                        borderLeft="4px solid"
                        borderColor="green.500"
                      >
                        <Flex justify="space-between" align="center">
                          <HStack>
                            <Badge colorScheme="green">New Trade</Badge>
                            <Text fontWeight="medium">
                              Alex Morgan just bought AMZN at $183.50
                            </Text>
                          </HStack>
                          <Button 
                            size="sm" 
                            bg="accent.500"
                            color="white"
                            _hover={{ bg: 'accent.600' }}
                            style={{ transition: 'all 0.2s ease' }}
                          >
                            Copy Now
                          </Button>
                        </Flex>
                      </MotionBox>
                    )}
                    
                    {/* Trade Cards */}
                    <VStack spacing={4} align="stretch">
                      {sampleTrades.map((trade, index) => (
                        <TradeCard key={trade.id} trade={trade} />
                      ))}
                    </VStack>
                    
                    <Flex justify="center" mt={8}>
                      <Button 
                        variant="outline" 
                        size="md"
                        borderColor="gray.600"
                        color="gray.300"
                        _hover={{ bg: 'rgba(255,255,255,0.05)', borderColor: 'gray.500' }}
                        style={{ transition: 'all 0.2s ease' }}
                      >
                        Load More Trades
                      </Button>
                    </Flex>
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
                    
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      {traders.filter(trader => trader.status === 'Following').map(trader => (
                        <TraderCard key={trader.id} trader={trader} onFollowToggle={handleFollowToggle} />
                      ))}
                    </SimpleGrid>
                    
                    <Box mt={8}>
                      <Heading size="md" mb={4} color="white">Recommended For You</Heading>
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
                      <Heading size="md" color="white">Top Performing Traders</Heading>
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
                      +${portfolioData.change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </StatNumber>
                    <StatHelpText color="gray.400">
                      <StatArrow type="increase" color="green.400" />
                      {portfolioData.changePercent}% since start
                    </StatHelpText>
                  </Stat>
                  
                  <Heading size="sm" mb={2} color="white">
                    Allocations
                  </Heading>
                  
                  {portfolioData.allocations.map(allocation => (
                    <Flex 
                      key={allocation.symbol} 
                      justify="space-between" 
                      py={2} 
                      borderBottom="1px" 
                      borderColor={borderColor}
                    >
                      <HStack>
                        <Box
                          display="inline-flex"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="md"
                          py={1}
                          px={2.5}
                          fontSize="sm"
                          fontWeight="bold"
                          bg={allocation.symbol === 'CASH' ? 'gray.700' : 'rgba(25, 118, 210, 0.15)'}
                          color={allocation.symbol === 'CASH' ? 'gray.300' : 'accent.400'}
                          borderWidth="1px"
                          borderColor={allocation.symbol === 'CASH' ? 'gray.600' : 'accent.700'}
                        >
                          {allocation.symbol}
                        </Box>
                        <Text color="white">
                          ${allocation.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                      </HStack>
                      <Text color="gray.400">{allocation.percent.toFixed(1)}%</Text>
                    </Flex>
                  ))}
                  
                  <RouterLink to="/portfolio">
                    <Button 
                      variant="outline" 
                      w="full" 
                      mt={4} 
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
                
                {/* Quick Actions */}
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
                    <Button 
                      size="md" 
                      variant="outline"
                      borderColor="gray.600"
                      color="gray.300"
                      _hover={{ bg: 'rgba(255,255,255,0.05)', borderColor: 'gray.500' }}
                      style={{ transition: 'all 0.2s ease' }}
                    >
                      Invite Friends
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