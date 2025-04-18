import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  Image,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import TraderCard from '../components/TraderCard';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Sample trader data
const topTraders = [
  {
    id: 1,
    name: 'Alex Morgan',
    avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
    performance: 42.8,
    winRate: 78,
    followers: 2453,
    status: 'Follow'
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
  }
];

const DemoSetup = () => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(30);
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.800', 'gray.800');
  
  useEffect(() => {
    if (step === 1) {
      setProgress(30);
    } else if (step === 2) {
      setProgress(60);
    } else if (step === 3) {
      setProgress(100);
    }
  }, [step]);

  const handleSelectTrader = (trader) => {
    // Update the trader's status to "Following"
    const updatedTrader = { ...trader, status: 'Following' };
    setSelectedTrader(updatedTrader);
    setStep(3);
  };
  
  const handleFollowToggle = (traderId, status) => {
    // If we're selecting a trader by clicking the follow button
    if (status === 'Following') {
      const trader = topTraders.find(t => t.id === traderId);
      if (trader) {
        setSelectedTrader({ ...trader, status: 'Following' });
        setStep(3);
      }
    }
  };

  const handleComplete = () => {
    setLoading(true);
    // Simulate setting up the account
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.950">
      <Header />
      
      <Box flex="1" py={8}>
        <Container maxW="1000px">
          <Box mb={8}>
            <Progress 
              value={progress} 
              size="sm" 
              colorScheme="accent" 
              borderRadius="full" 
              mb={4}
              bg="gray.800"
            />
            <Flex justify="space-between">
              <Text 
                fontWeight={step >= 1 ? "bold" : "normal"}
                color={step >= 1 ? "accent.400" : "gray.500"}
              >
                1. Create Demo Account
              </Text>
              <Text 
                fontWeight={step >= 2 ? "bold" : "normal"}
                color={step >= 2 ? "accent.400" : "gray.500"}
              >
                2. Choose Trader
              </Text>
              <Text 
                fontWeight={step >= 3 ? "bold" : "normal"}
                color={step >= 3 ? "accent.400" : "gray.500"}
              >
                3. Start Trading
              </Text>
            </Flex>
          </Box>
          
          {step === 1 && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <VStack spacing={6} align="flex-start">
                  <Heading size="lg" color="white">Your Demo Account is Ready!</Heading>
                  <Text color="gray.400">
                    We've created a demo account with $100,000 in virtual cash for you to 
                    experience copy trading without any risk.
                  </Text>
                  
                  <Box 
                    w="full" 
                    p={6} 
                    bg={bgColor} 
                    borderRadius="xl" 
                    boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
                    borderWidth="1px"
                    borderColor="gray.700"
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
                    <Heading size="md" mb={4} color="white">Your Demo Account Balance</Heading>
                    <Stat>
                      <StatLabel color="gray.400">Available Funds</StatLabel>
                      <StatNumber color="accent.400">$100,000.00</StatNumber>
                      <StatHelpText color="gray.500">Ready to invest</StatHelpText>
                    </Stat>
                  </Box>
                  
                  <Text color="gray.400">
                    Next, choose an elite trader to follow. You'll see their trades in 
                    real-time and learn their strategies.
                  </Text>
                  
                  <Button 
                    bg="accent.500"
                    color="white"
                    _hover={{ bg: 'accent.600', transform: 'translateY(-2px)' }}
                    boxShadow="0 4px 14px 0 rgba(25, 118, 210, 0.25)"
                    size="lg"
                    onClick={() => setStep(2)}
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    Choose a Trader to Follow
                  </Button>
                </VStack>
                
                <Flex align="center" justify="center">
                  <MotionBox
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Image 
                      src="/demo-account.svg" 
                      fallbackSrc="https://via.placeholder.com/400x300?text=Demo+Account" 
                      alt="Demo Account Illustration" 
                      maxW="400px"
                    />
                  </MotionBox>
                </Flex>
              </SimpleGrid>
            </MotionBox>
          )}
          
          {step === 2 && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Heading size="lg" mb={2} color="white">Choose a Trader to Follow</Heading>
              <Text color="gray.400" mb={8}>
                Select one of our top-performing traders to automatically copy their trades.
              </Text>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                {topTraders.map((trader) => (
                  <MotionBox
                    key={trader.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectTrader(trader)}
                    cursor="pointer"
                  >
                    <TraderCard 
                    trader={trader} 
                    onFollowToggle={handleFollowToggle} 
                  />
                  </MotionBox>
                ))}
              </SimpleGrid>
              
              <Button 
                variant="ghost" 
                mt={8}
                onClick={() => setStep(1)}
                color="gray.400"
                _hover={{ bg: 'rgba(255,255,255,0.05)' }}
              >
                Go Back
              </Button>
            </MotionBox>
          )}
          
          {step === 3 && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <VStack spacing={6} align="flex-start">
                  <Box 
                    p={1} 
                    borderRadius="full" 
                    bg="rgba(21, 128, 61, 0.2)" 
                    color="green.400"
                    px={4}
                    py={1}
                  >
                    <Text fontWeight="bold">Almost ready!</Text>
                  </Box>
                  
                  <Heading size="lg" color="white">Setup Complete!</Heading>
                  
                  <Text color="gray.400">
                    You've successfully set up your demo account and selected{' '}
                    <Text as="span" fontWeight="bold" color="white">
                      {selectedTrader?.name}
                    </Text>{' '}
                    as your trader to follow.
                  </Text>
                  
                  <Box 
                    w="full" 
                    p={6} 
                    bg={bgColor} 
                    borderRadius="xl" 
                    boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
                    borderWidth="1px"
                    borderColor="gray.700"
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
                    <HStack align="start" spacing={4}>
                      <Image 
                        src={selectedTrader?.avatar} 
                        fallbackSrc="https://via.placeholder.com/60x60" 
                        alt="Trader Avatar" 
                        borderRadius="full"
                        boxSize="60px"
                        borderWidth="2px" 
                        borderColor="green.500"
                      />
                      <Box>
                        <Heading size="md" color="white">{selectedTrader?.name}</Heading>
                        <Text color="green.400" fontWeight="bold">
                          +{selectedTrader?.performance}% Performance
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          {selectedTrader?.followers} followers
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  
                  <Text color="gray.400">
                    Your demo account is now configured to copy{' '}
                    <Text as="span" fontWeight="bold" color="white">
                      {selectedTrader?.name}
                    </Text>'s trades automatically. Head to 
                    the dashboard to see it in action!
                  </Text>
                  
                  <Button 
                    bg="accent.500"
                    color="white"
                    _hover={{ bg: 'accent.600', transform: 'translateY(-2px)' }}
                    boxShadow="0 4px 14px 0 rgba(25, 118, 210, 0.25)"
                    size="lg"
                    onClick={handleComplete}
                    isLoading={loading}
                    loadingText="Setting up your dashboard..."
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    Go to Dashboard
                  </Button>
                </VStack>
                
                <Flex align="center" justify="center">
                  <MotionFlex
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    justify="center"
                    align="center"
                    h="100%"
                  >
                    <Box textAlign="center">
                      <Text fontSize="8xl" mb={4}>🚀</Text>
                      <Heading size="md" color="accent.400">Ready to Trade!</Heading>
                    </Box>
                  </MotionFlex>
                </Flex>
              </SimpleGrid>
              
              <Button 
                variant="ghost" 
                mt={8}
                onClick={() => setStep(2)}
                color="gray.400"
                _hover={{ bg: 'rgba(255,255,255,0.05)' }}
              >
                Go Back
              </Button>
            </MotionBox>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default DemoSetup;