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
                Copy Traders You Trust. <br/>
                In Real Time. <br/>
                On Any Broker.
              </Heading>
              
              <Text fontSize="xl" mb={8} opacity={0.9}>
                FinTrade lets you follow verified retail legends -- from Discord to YouTube --
                and mirror their moves instantly ln your own account. No delays. No BS. 
                Just real trades, real-time.
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
                  Try the Demo
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
                  Connect my Broker & Start Trading
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
                title: "1. Find Your People",
                description: "Scroll the leaderboard, Find traders you vibe with. Long-term, short-term, YOLO options -- it's all here.",
                icon: "👥",
              },
              {
                title: "2. Set Your Rules",
                description: "Define your risk tolerance, trade size caps, and filters. You stay in control.",
                icon: "⚙️",
              },
              {
                title: "3. Let it Ride",
                description: "Once you've copied your friends, we broadcast their trades live to your account.",
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
                description: "No lag. No stale trades. You're plugged into every move.",
              },
              {
                title: "All your internet favorites",
                description: "Only real ones. We vet traders on every platform based on track record, not hype. ",
              },
              {
                title: "Full Risk Control",
                description: "Cap trades. Limit exposure. You're always in the drivers seat.",
              },
              {
                title: "Broker Agnostic",
                description: "Works with IBKR today -- more coming soon. Your money stays in your account, always.",
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

      {/* Community Section */}
      <Box py={20} bg="gray.50">
        <Container maxW="1200px" textAlign="center">
          <Box 
            fontSize="4xl" 
            mb={4}
            opacity={0.9}
          >
            🌱
          </Box>
          <Heading as="h2" size="xl" mb={4}>
            Community Callout
          </Heading>
          <Heading as="h3" size="md" mb={6} fontWeight="medium" color="gray.700">
            Built by traders, for traders.
          </Heading>
          <Text fontSize="xl" maxW="700px" mx="auto" mb={8} lineHeight="tall">
            Join a platform where real investors share alpha, copy each other's plays, and grow together. 
            We're not Wall Street — we're the Discord generation. Let's build wealth together.
          </Text>
          <HStack spacing={6} justify="center" wrap="wrap">
            <Button
              as="a"
              href="https://discord.gg/fintrade"
              target="_blank"
              size="lg"
              variant="outline"
              colorScheme="gray"
              fontSize="md"
              px={8}
              leftIcon={
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
              }
            >
              Join the Community
            </Button>
            <Button
              as={RouterLink}
              to="/signup"
              size="lg" 
              colorScheme="primary"
              fontSize="md"
              px={8}
            >
              Start Copying Now
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} bg="primary.500" color="white">
        <Container maxW="1200px" textAlign="center">
          <Heading as="h2" size="xl" mb={6}>
            Join the Movement
          </Heading>
          <Text fontSize="xl" maxW="700px" mx="auto" mb={8} opacity={0.9}>
            Join thousands of traders who are already copying the best and building wealth together.
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