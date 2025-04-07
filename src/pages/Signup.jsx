import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Stack,
  Divider,
  HStack,
  VStack,
  Image,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MotionBox = motion(Box);

const Signup = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleEmailPasswordSubmit = (e) => {
    e.preventDefault();
    // Email validation
    if (!email.includes('@') || !email.includes('.')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Password validation
    if (password.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 8 characters long.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setStep(2);
  };

  const handleAccountTypeSelect = (type) => {
    setAccountType(type);
    
    // Redirect based on selection
    if (type === 'demo') {
      navigate('/demo-setup');
    } else {
      // In a real app, you would redirect to IBKR authentication
      toast({
        title: 'IBKR Connection Initiated',
        description: 'Redirecting to Interactive Brokers for account connection.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      // Simulate redirect after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      
      <Flex flex="1" align="center" justify="center" py={10}>
        <Container maxW="md">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            bg={bgColor}
            p={8}
            borderRadius="xl"
            boxShadow="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            {step === 1 ? (
              <VStack spacing={6} align="stretch">
                <VStack spacing={2} align="center" mb={2}>
                  <Heading size="lg">Create Your Account</Heading>
                  <Text color="gray.500">Join thousands of traders copying the elite</Text>
                </VStack>
                
                <Button
                  variant="outline"
                  size="lg"
                  borderRadius="md"
                  borderColor="gray.300"
                  p={6}
                  bg="white"
                  justifyContent="center"
                  leftIcon={
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" h="20px" />
                  }
                  onClick={() => {
                    toast({
                      title: 'Google Sign-in',
                      description: 'This would connect with Google in a real app.',
                      status: 'info',
                      duration: 3000,
                      isClosable: true,
                    });
                    setStep(2);
                  }}
                >
                  <Text>Sign up with Google</Text>
                </Button>
                
                <HStack my={4}>
                  <Divider />
                  <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
                    or with email
                  </Text>
                  <Divider />
                </HStack>
                
                <form onSubmit={handleEmailPasswordSubmit}>
                  <Stack spacing={4}>
                    <FormControl id="email" isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@example.com"
                        size="lg"
                      />
                    </FormControl>
                    
                    <FormControl id="password" isRequired>
                      <FormLabel>Password</FormLabel>
                      <Input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="8+ characters"
                        size="lg"
                      />
                    </FormControl>
                    
                    <Button 
                      type="submit"
                      variant="primary"
                      size="lg"
                      mt={4}
                      isDisabled={!email || !password}
                    >
                      Continue
                    </Button>
                  </Stack>
                </form>
                
                <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>
                  By signing up, you agree to our{' '}
                  <Text as="span" color="primary.500" fontWeight="medium" cursor="pointer">
                    Terms of Service
                  </Text>{' '}
                  and{' '}
                  <Text as="span" color="primary.500" fontWeight="medium" cursor="pointer">
                    Privacy Policy
                  </Text>
                </Text>
              </VStack>
            ) : (
              <VStack spacing={6} align="stretch">
                <VStack spacing={2} align="center" mb={4}>
                  <Heading size="lg">Choose Experience</Heading>
                  <Text color="gray.500" textAlign="center">
                    You can try our demo or connect your Interactive Brokers account
                  </Text>
                </VStack>
                
                <MotionBox
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAccountTypeSelect('demo')}
                  cursor="pointer"
                  p={5}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                >
                  <HStack spacing={4}>
                    <Box p={2} borderRadius="md" bg="blue.50">
                      <Text fontSize="2xl">🚀</Text>
                    </Box>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">Try Demo</Text>
                      <Text fontSize="sm" color="gray.500">
                        Experience with $100K virtual cash without linking IBKR
                      </Text>
                    </VStack>
                  </HStack>
                </MotionBox>
                
                <MotionBox
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAccountTypeSelect('ibkr')}
                  cursor="pointer"
                  p={5}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                >
                  <HStack spacing={4}>
                    <Box p={2} borderRadius="md" bg="green.50">
                      <Text fontSize="2xl">💰</Text>
                    </Box>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">Link IBKR Account</Text>
                      <Text fontSize="sm" color="gray.500">
                        Connect your real Interactive Brokers account to copy trades
                      </Text>
                    </VStack>
                  </HStack>
                </MotionBox>
                
                <Button 
                  variant="ghost"
                  onClick={() => setStep(1)}
                  mt={2}
                >
                  Go Back
                </Button>
              </VStack>
            )}
          </MotionBox>
        </Container>
      </Flex>
      
      <Footer />
    </Box>
  );
};

export default Signup;