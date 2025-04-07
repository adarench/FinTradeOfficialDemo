import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Image,
  Icon,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TradeCard from '../components/TradeCard';

// Sample trade data for demo purposes
const sampleTrade = {
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
};

const MotionBox = motion(Box);

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      <Header />

      {/* Hero Section */}
      <Box 
        bg="primary.500" 
        color="white" 
        py={{ base: 16, md: 24 }}
        backgroundImage="linear-gradient(135deg, #0080ff 0%, #004d99 100%)"
        position="relative"
        overflow="hidden"
      >
        {/* Abstract shapes for background */}
        <Box position="absolute" top="-10%" right="-5%" opacity={0.1} w="500px" h="500px" borderRadius="full" bg="white" />
        <Box position="absolute" bottom="-20%" left="-10%" opacity={0.1} w="600px" h="600px" borderRadius="full" bg="white" />
        
        <Container maxW="1200px">
          <Flex 
            direction={{ base: 'column', lg: 'row' }} 
            align="center"
            justify="space-between"
            gap={10}
          >
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              maxW={{ base: 'full', lg: '600px' }}
            >
              <Heading 
                as="h1" 
                size="2xl" 
                lineHeight="1.2"
                mb={6}
              >
                Copy Elite Investors. <br/>
                In Real Time. <br/>
                On Your Own Account.
              </Heading>
              
              <Text fontSize="xl" mb={8} opacity={0.9}>
                FinTrade lets you automatically copy the trading strategies of top-performing investors
                and execute them on your brokerage account in real-time.
              </Text>
              
              <Stack 
                direction={{ base: 'column', sm: 'row' }} 
                spacing={4}
              >
                <Button
                  as={RouterLink}
                  to="/demo-setup"
                  size="lg"
                  bg="white"
                  color="primary.500"
                  _hover={{ bg: 'gray.100' }}
                  fontSize="md"
                  px={8}
                  className="animate-pulse"
                >
                  Try Demo Now
                </Button>
                <Button
                  as={RouterLink}
                  to="/signup"
                  size="lg" 
                  variant="outline"
                  borderWidth={2}
                  _hover={{ bg: 'rgba(255,255,255,0.1)' }}
                  fontSize="md"
                  px={8}
                >
                  Connect IBKR & Start Trading
                </Button>
              </Stack>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              maxW={{ base: '100%', lg: '450px' }}
              w="full"
            >
              <Box
                bg="white"
                borderRadius="xl"
                boxShadow="xl"
                overflow="hidden"
                p={1}
              >
                <Box p={4} bg="gray.50" borderRadius="lg">
                  <Text fontWeight="bold" mb={2} color="gray.700">
                    Live Trading Demo
                  </Text>
                  <TradeCard trade={sampleTrade} />
                </Box>
              </Box>
            </MotionBox>
          </Flex>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={16}>
        <Container maxW="1200px">
          <Heading 
            as="h2" 
            textAlign="center" 
            mb={12}
            size="xl"
          >
            How It Works
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {[
              {
                title: "1. Choose Your Traders",
                description: "Browse our leaderboard of elite traders with verified track records and follow the ones that match your style.",
                icon: "👥",
              },
              {
                title: "2. Set Your Parameters",
                description: "Define your risk limits, allocation percentage, and other preferences to maintain full control.",
                icon: "⚙️",
              },
              {
                title: "3. Watch Your Portfolio Grow",
                description: "Our platform automatically copies trades to your account in real-time when your followed traders make moves.",
                icon: "📈",
              }
            ].map((step, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                bg={useColorModeValue('white', 'gray.800')}
                p={8}
                borderRadius="lg"
                boxShadow="md"
                textAlign="center"
              >
                <Text fontSize="4xl" mb={4}>{step.icon}</Text>
                <Heading as="h3" size="md" mb={4}>{step.title}</Heading>
                <Text color={useColorModeValue('gray.600', 'gray.400')}>
                  {step.description}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="1200px">
          <Heading as="h2" textAlign="center" mb={12} size="xl">
            Key Features
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            {[
              {
                title: "Real-Time Trade Copying",
                description: "Every trade is copied to your account within seconds, ensuring you never miss an opportunity.",
              },
              {
                title: "Verified Traders Only",
                description: "We only feature traders with proven track records, verified through our proprietary vetting process.",
              },
              {
                title: "Full Risk Control",
                description: "Set maximum position sizes, stop losses, and other parameters to manage risk according to your comfort level.",
              },
              {
                title: "Seamless IBKR Integration",
                description: "Works directly with your Interactive Brokers account, with no need to transfer funds to a third party.",
              },
            ].map((feature, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                p={6}
                bg={useColorModeValue('white', 'gray.800')}
                borderRadius="lg"
                boxShadow="md"
              >
                <Heading as="h3" size="md" mb={4}>
                  {feature.title}
                </Heading>
                <Text color={useColorModeValue('gray.600', 'gray.400')}>
                  {feature.description}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} bg="primary.500" color="white">
        <Container maxW="1200px" textAlign="center">
          <Heading as="h2" size="xl" mb={6}>
            Ready to Revolutionize Your Trading?
          </Heading>
          <Text fontSize="xl" maxW="700px" mx="auto" mb={8} opacity={0.9}>
            Join thousands of traders who are already copying the best and seeing consistent results.
          </Text>
          <HStack spacing={6} justify="center" wrap="wrap">
            <Button
              as={RouterLink}
              to="/demo-setup"
              size="lg"
              bg="white"
              color="primary.500"
              _hover={{ bg: 'gray.100' }}
              fontSize="md"
              px={10}
            >
              Try Free Demo
            </Button>
            <Button
              as={RouterLink}
              to="/signup"
              size="lg" 
              variant="outline"
              borderWidth={2}
              _hover={{ bg: 'rgba(255,255,255,0.1)' }}
              fontSize="md"
              px={10}
            >
              Create Account
            </Button>
          </HStack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Landing;