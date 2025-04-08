import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
  Divider,
  Heading
} from '@chakra-ui/react';
import { loginUser, resetPassword } from '../../services/auth/authService';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Set a timeout to prevent hanging UI
    const loginTimeout = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Login taking longer than expected',
        description: 'Please try again or check your internet connection',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }, 8000); // 8 second timeout

    try {
      await loginUser(email, password);
      clearTimeout(loginTimeout);
      
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/dashboard');
    } catch (error) {
      clearTimeout(loginTimeout);
      
      const errorMessage = error.message || 'Unknown error occurred';
      const formattedError = errorMessage.includes('auth/') 
        ? errorMessage.replace('Firebase: Error (auth/', '').replace(').', '')
        : errorMessage;
      
      toast({
        title: 'Login failed',
        description: formattedError,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await resetPassword(email);
      setResetSent(true);
      toast({
        title: 'Reset email sent',
        description: 'Check your inbox for password reset instructions',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to send reset email',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Box 
      w={{ base: "90%", md: "450px" }} 
      mx="auto" 
      borderWidth="1px" 
      borderRadius="lg" 
      p={8}
      bg="gray.800"
      borderColor="gray.700"
      boxShadow="xl"
    >
      <Heading size="lg" mb={6} textAlign="center" color="white">
        Log into FinTrade
      </Heading>
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel color="gray.300">Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              bg="gray.700"
              border="none"
              color="white"
              _placeholder={{ color: 'gray.400' }}
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel color="gray.300">Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                bg="gray.700"
                border="none"
                color="white"
                _placeholder={{ color: 'gray.400' }}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  variant="ghost"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            colorScheme="blue"
            type="submit"
            isLoading={isLoading}
            loadingText="Logging in..."
            mt={4}
            bg="accent.500"
            _hover={{ bg: "accent.600", transform: "translateY(-2px)" }}
            style={{ transition: 'all 0.2s ease' }}
          >
            Login
          </Button>
        </Stack>
      </form>

      <Flex mt={4} justify="space-between" alignItems="center">
        <Button
          variant="link"
          colorScheme="blue"
          onClick={handleForgotPassword}
          size="sm"
        >
          Forgot password?
        </Button>
        <Text color="gray.400" fontSize="sm">
          New to FinTrade?{' '}
          <Link to="/signup" style={{ color: '#63B3ED' }}>
            Sign up
          </Link>
        </Text>
      </Flex>

      {resetSent && (
        <Box mt={4} p={3} bg="blue.900" borderRadius="md">
          <Text color="white" fontSize="sm">
            Password reset email sent. Please check your inbox.
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default LoginForm;