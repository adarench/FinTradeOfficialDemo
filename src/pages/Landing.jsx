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
        bg="gray.900" 
        color="white" 
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
        borderBottom="1px solid"
        borderColor="gray.800"
      >
        {/* Animated gradient background */}
        <Box 
          position="absolute" 
          top="0" 
          left="0" 
          right="0" 
          bottom="0" 
          bgGradient="linear(to-br, gray.900, gray.900, accent.900)"
          opacity="0.4"
          zIndex="0"
        />
        
        {/* Subtle grid pattern */}
        <Box 
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.05"
          backgroundImage="url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E')"
          backgroundPosition="center"
          zIndex="0"
        />
        
        {/* Decorative glowing accent */}
        <Box
          position="absolute"
          top="0"
          right="0"
          width="40%"
          height="40%"
          bg="accent.500"
          filter="blur(150px)"
          opacity="0.08"
          zIndex="0"
        />
        
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
                  bg="accent.500"
                  color="white"
                  _hover={{ bg: 'accent.600', transform: 'translateY(-2px)' }}
                  boxShadow="0 4px 14px 0 rgba(101, 34, 239, 0.25)"
                  transition={{ transform: '0.2s ease', boxShadow: '0.2s ease', background: '0.2s ease' }}
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
                  borderWidth={1}
                  borderColor="gray.600"
                  _hover={{ bg: 'rgba(255,255,255,0.05)', borderColor: 'gray.500' }}
                  fontSize="md"
                  px={8}
                  transition={{ transform: '0.2s ease', boxShadow: '0.2s ease', background: '0.2s ease' }}
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
                className="glass"
                borderRadius="xl"
                boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
                overflow="hidden"
                p={1}
                border="1px solid rgba(255, 255, 255, 0.05)"
                position="relative"
                zIndex="1"
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
                <Box p={4} borderRadius="lg" bg="rgba(0,0,0,0.2)">
                  <Flex alignItems="center" mb={2}>
                    <Box w="2" h="2" borderRadius="full" bg="accent.400" mr={2} />
                    <Text fontWeight="medium" color="gray.200">
                      Live Trading Demo
                    </Text>
                  </Flex>
                  <TradeCard trade={sampleTrade} />
                </Box>
              </Box>
            </MotionBox>
          </Flex>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={20} bg="gray.950" position="relative" overflow="hidden">
        {/* Subtle pattern overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.03"
          backgroundImage={`url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'%3E%3C/circle%3E%3Ccircle cx='13' cy='13' r='3'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E")`}
        />
        
        <Container maxW="1200px" position="relative" zIndex="1">
          <Flex direction="column" align="center" mb={12}>
            <Box mb={3} px={3} py={1} bg="gray.800" borderRadius="full">
              <Text fontSize="sm" color="accent.300">Simple Process</Text>
            </Box>
            <Heading 
              as="h2" 
              textAlign="center" 
              size="xl"
              bgGradient="linear(to-r, gray.100, white)"
              backgroundClip="text"
            >
              How It Works
            </Heading>
          </Flex>
          
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
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  transform: '0.3s ease', 
                  boxShadow: '0.3s ease', 
                  borderColor: '0.3s ease' 
                }}
                viewport={{ once: true }}
                bg="gray.900"
                p={8}
                borderRadius="xl"
                boxShadow="0 4px 20px rgba(0,0,0,0.25)"
                textAlign="center"
                borderWidth="1px"
                borderColor="gray.800"
                position="relative"
                _hover={{
                  borderColor: "gray.700",
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.3)"
                }}
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: '-1px',
                  left: '25%',
                  right: '25%',
                  height: '1px',
                  bgGradient: 'linear(to-r, transparent, gray.700, transparent)',
                }}
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
      <Box py={20} bg="gray.900" position="relative" overflow="hidden">
        {/* Decorative elements */}
        <Box 
          position="absolute" 
          top="-10%" 
          left="-5%" 
          width="300px" 
          height="300px" 
          bg="accent.900" 
          filter="blur(150px)" 
          opacity="0.1" 
        />
        <Box 
          position="absolute" 
          bottom="-10%" 
          right="-5%" 
          width="300px" 
          height="300px" 
          bg="primary.900" 
          filter="blur(150px)" 
          opacity="0.1" 
        />
        
        <Container maxW="1200px" position="relative" zIndex="1">
          <Flex direction="column" align="center" mb={12}>
            <Box mb={3} px={3} py={1} bg="gray.800" borderRadius="full">
              <Text fontSize="sm" color="primary.300">What Makes Us Different</Text>
            </Box>
            <Heading 
              as="h2" 
              textAlign="center"
              size="xl"
              bgGradient="linear(to-r, white, gray.300)"
              backgroundClip="text"
            >
              Key Features
            </Heading>
          </Flex>
          
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
                transition={{ duration: 0.5, transform: '0.3s ease', boxShadow: '0.3s ease', borderColor: '0.3s ease' }}
                viewport={{ once: true }}
                p={6}
                bg="gray.800"
                borderRadius="xl"
                boxShadow="0 4px 20px rgba(0,0,0,0.2)"
                borderWidth="1px"
                borderColor="gray.700"
                position="relative"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                  borderColor: "gray.600"
                }}
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

      {/* Community Section */}
      <Box py={20} bg="gray.950" position="relative" overflow="hidden">
        {/* Subtle pattern overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.03"
          backgroundImage={`url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'%3E%3C/circle%3E%3Ccircle cx='13' cy='13' r='3'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E")`}
        />
        
        {/* Decorative elements */}
        <Box 
          position="absolute" 
          bottom="-10%" 
          left="10%" 
          width="300px" 
          height="300px" 
          bg="accent.700" 
          filter="blur(150px)" 
          opacity="0.1" 
          zIndex="0"
        />
        
        <Container maxW="1200px" position="relative" zIndex="1">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={16} alignItems="center">
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Flex direction="column" align={{ base: "center", md: "flex-start" }}>
                <Box mb={3} px={3} py={1} bg="gray.800" borderRadius="full" display="inline-flex" alignItems="center">
                  <Text fontSize="lg" mr={2}>🌱</Text>
                  <Text fontSize="sm" color="accent.300">Community Callout</Text>
                </Box>
                
                <Heading 
                  as="h2" 
                  size="xl"
                  mb={6}
                  textAlign={{ base: "center", md: "left" }}
                  bgGradient="linear(to-r, white, gray.300)"
                  backgroundClip="text"
                >
                  Built by traders, for traders.
                </Heading>
                
                <Text fontSize="lg" color="gray.300" mb={8} textAlign={{ base: "center", md: "left" }}>
                  Join a platform where real investors share alpha, copy each other's plays, and grow together. 
                  We're not Wall Street — we're the Discord generation. Let's build wealth together.
                </Text>
                
                <Stack 
                  direction={{ base: 'column', sm: 'row' }} 
                  spacing={4}
                  align={{ base: "center", md: "flex-start" }}
                >
                  <Button
                    as="a"
                    href="https://discord.gg/fintrade"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                    variant="outline"
                    borderWidth={1}
                    borderColor="gray.600"
                    leftIcon={<Text fontSize="lg">→</Text>}
                    _hover={{ bg: 'rgba(255,255,255,0.05)', borderColor: 'gray.500' }}
                    fontSize="md"
                    px={8}
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    Join the Community
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/signup"
                    size="lg"
                    bg="accent.500"
                    color="white"
                    leftIcon={<Text fontSize="lg">→</Text>}
                    _hover={{ bg: 'accent.600', transform: 'translateY(-2px)' }}
                    boxShadow="0 4px 14px 0 rgba(25, 118, 210, 0.25)"
                    fontSize="md"
                    px={8}
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    Start Copying Now
                  </Button>
                </Stack>
              </Flex>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              display={{ base: 'none', md: 'block' }}
            >
              <Box
                className="glass"
                borderRadius="xl"
                boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
                overflow="hidden"
                p={6}
                border="1px solid rgba(255, 255, 255, 0.05)"
                position="relative"
                zIndex="1"
                bg="gray.900"
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
                <SimpleGrid columns={2} spacing={4}>
                  {[
                    { count: '14,823', label: 'Community Members' },
                    { count: '324', label: 'Active Traders' },
                    { count: '6,482', label: 'Trades Copied' },
                    { count: '+32%', label: 'Avg. Monthly Return' }
                  ].map((stat, index) => (
                    <Box 
                      key={index} 
                      p={4} 
                      borderRadius="lg" 
                      bg="gray.800" 
                      textAlign="center"
                      borderWidth="1px"
                      borderColor="gray.700"
                    >
                      <Text fontSize="2xl" fontWeight="bold" color="accent.400" mb={1}>
                        {stat.count}
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        {stat.label}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </MotionBox>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} bg="accent.500" color="white">
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
              color="accent.400"
              _hover={{ bg: 'gray.700' }}
              fontSize="md"
              px={10}
              style={{ transition: 'all 0.2s ease' }}
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
              style={{ transition: 'all 0.2s ease' }}
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