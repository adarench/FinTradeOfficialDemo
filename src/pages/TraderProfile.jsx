import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Avatar,
  HStack,
  Button,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TradeCard from '../components/TradeCard';
import TraderDiscussions from '../components/comments/TraderDiscussions';

// Sample trade data
const sampleTrades = [
  {
    id: 'trade1',
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
];

const traderData = {
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
};

const TraderProfile = () => {
  const { traderId } = useParams();
  const [isFollowing, setIsFollowing] = useState(true);
  const bgColor = useColorModeValue('gray.800', 'gray.800');
  const borderColor = useColorModeValue('gray.700', 'gray.700');
  
  // In a real app, you would fetch trader data based on traderId
  const trader = traderData;
  const trades = sampleTrades;
  
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };
  
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.950">
      <Header />
      
      <Box flex="1" py={8}>
        <Container maxW="1200px">
          {/* Trader Profile Header */}
          <Box 
            mb={8} 
            p={6} 
            borderRadius="xl" 
            bg={bgColor} 
            borderWidth="1px" 
            borderColor={borderColor}
            boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '1px',
              bgGradient: 'linear(to-r, transparent, rgba(255, 255, 255, 0.1), transparent)',
              zIndex: '1'
            }}
          >
            <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'center', md: 'flex-start' }} gap={6}>
              <Box>
                <Avatar 
                  size="2xl" 
                  name={trader.name} 
                  src={trader.avatar} 
                  borderWidth="4px" 
                  borderColor="accent.500"
                  mb={{ base: 4, md: 0 }}
                />
              </Box>
              
              <Box flex="1">
                <Flex justify="space-between" align="center" mb={4}>
                  <Box>
                    <Heading size="lg" color="white">{trader.name}</Heading>
                    <HStack mt={1}>
                      <Box 
                        px={2} 
                        py={1} 
                        bg="green.500" 
                        color="white" 
                        borderRadius="md" 
                        fontSize="sm"
                      >
                        +{trader.performance}% this month
                      </Box>
                      <Text color="gray.400">{trader.followers} followers</Text>
                    </HStack>
                  </Box>
                  
                  <Button
                    size="md"
                    bg={isFollowing ? "accent.500" : "transparent"}
                    color={isFollowing ? "white" : "gray.300"}
                    borderWidth="1px"
                    borderColor={isFollowing ? "accent.500" : "gray.600"}
                    onClick={handleFollowToggle}
                    _hover={{ 
                      bg: isFollowing ? "accent.600" : "gray.700",
                      transform: 'translateY(-2px)'
                    }}
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </Flex>
                
                <Text color="gray.300" mb={4}>{trader.description}</Text>
                
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  {Object.entries(trader.stats).map(([key, value]) => (
                    <Box 
                      key={key} 
                      p={3} 
                      bg="gray.750" 
                      borderRadius="md" 
                      textAlign="center"
                      borderWidth="1px"
                      borderColor="gray.700"
                    >
                      <Text fontSize="sm" color="gray.400" mb={1}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="white">{value}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </Flex>
          </Box>
          
          {/* Trader Content Tabs */}
          <Tabs 
            variant="enclosed" 
            colorScheme="accent" 
            bg={bgColor} 
            borderRadius="xl" 
            boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)" 
            borderWidth="1px" 
            borderColor={borderColor}
          >
            <TabList px={6} pt={4}>
              <Tab>Recent Trades</Tab>
              <Tab>Performance</Tab>
              <Tab>Discussions</Tab>
            </TabList>
            
            <TabPanels>
              {/* Recent Trades Tab */}
              <TabPanel p={6}>
                <Heading size="md" mb={6} color="white">Recent Trades</Heading>
                <VStack spacing={4} align="stretch">
                  {trades.map(trade => (
                    <TradeCard key={trade.id} trade={trade} />
                  ))}
                </VStack>
              </TabPanel>
              
              {/* Performance Tab */}
              <TabPanel p={6}>
                <Heading size="md" mb={6} color="white">Performance Analytics</Heading>
                <Text color="gray.400" mb={8}>
                  Detailed performance metrics and analysis coming soon.
                </Text>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
                  <Box 
                    p={4} 
                    bg="gray.750" 
                    borderRadius="xl" 
                    borderWidth="1px" 
                    borderColor="gray.700"
                  >
                    <Heading size="sm" mb={4} color="white">Win/Loss Ratio</Heading>
                    <Box h="200px" bg="gray.700" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                      <Text color="gray.400">Chart coming soon</Text>
                    </Box>
                  </Box>
                  
                  <Box 
                    p={4} 
                    bg="gray.750" 
                    borderRadius="xl" 
                    borderWidth="1px" 
                    borderColor="gray.700"
                  >
                    <Heading size="sm" mb={4} color="white">Monthly Returns</Heading>
                    <Box h="200px" bg="gray.700" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                      <Text color="gray.400">Chart coming soon</Text>
                    </Box>
                  </Box>
                </SimpleGrid>
              </TabPanel>
              
              {/* Discussions Tab */}
              <TabPanel p={6}>
                <TraderDiscussions traderId={trader.id} traderName={trader.name} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default TraderProfile;