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
                  bg="gray.800"
                  color="primary.400"
                  _hover={{ bg: 'gray.700' }}
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
                bg="gray.800"
                borderRadius="xl"
                boxShadow="xl"
                overflow="hidden"
                p={1}
              >
                <Box p={4} bg="gray.850" borderRadius="lg" borderWidth="1px" borderColor="gray.700">
                  <Text fontWeight="bold" mb={2} color="gray.100">
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
      <Box py={16} bg="gray.900">
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
                bg="gray.800"
                p={8}
                borderRadius="lg"
                boxShadow="md"
                textAlign="center"
              >
                <Text fontSize="4xl" mb={4}>{step.icon}</Text>
                <Heading as="h3" size="md" mb={4}>{step.title}</Heading>
                <Text color="gray.300">
                  {step.description}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={16} bg="gray.800">
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
                title: "Bro",
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
                bg="gray.800"
                borderRadius="lg"
                boxShadow="md"
              >
                <Heading as="h3" size="md" mb={4}>
                  {feature.title}
                </Heading>
                <Text color="gray.300">
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
              bg="gray.800"
              color="primary.400"
              _hover={{ bg: 'gray.700' }}
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