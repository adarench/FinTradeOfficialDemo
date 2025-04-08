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
  Heading,
  FormHelperText,
  Progress
} from '@chakra-ui/react';
import { registerUser } from '../../services/auth/authService';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (passwordStrength < 60) {
      toast({
        title: 'Password too weak',
        description: 'Please choose a stronger password',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);

    // Set a timeout to prevent hanging UI
    const signupTimeout = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Signup taking longer than expected',
        description: 'Please try again or check your internet connection',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }, 8000); // 8 second timeout

    try {
      const user = await registerUser(email, password, name);
      clearTimeout(signupTimeout);
      
      toast({
        title: 'Account created!',
        description: 'Welcome to FinTrade! Please verify your email.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Navigate immediately to dashboard
      navigate('/dashboard');
    } catch (error) {
      clearTimeout(signupTimeout);
      
      const errorMessage = error.message || 'Unknown error occurred';
      const formattedError = errorMessage.includes('auth/') 
        ? errorMessage.replace('Firebase: Error (auth/', '').replace(').', '')
        : errorMessage;
      
      toast({
        title: 'Registration failed',
        description: formattedError,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length > 6) strength += 20;
    if (password.length > 10) strength += 10;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    if (password.length > 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength += 10;
    
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return 'red.500';
    if (passwordStrength < 60) return 'orange.500';
    if (passwordStrength < 80) return 'yellow.500';
    return 'green.500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
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
        Create Your Account
      </Heading>
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="name" isRequired>
            <FormLabel color="gray.300">Full Name</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              bg="gray.700"
              border="none"
              color="white"
              _placeholder={{ color: 'gray.400' }}
            />
          </FormControl>

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
            <FormHelperText color="gray.400">
              We'll send a verification link to this email
            </FormHelperText>
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel color="gray.300">Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Create a password"
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
            {password && (
              <>
                <Progress
                  value={passwordStrength}
                  colorScheme={getStrengthColor().split('.')[0]}
                  size="sm"
                  mt={2}
                  borderRadius="md"
                />
                <FormHelperText color={getStrengthColor()}>
                  Password strength: {getStrengthText()}
                </FormHelperText>
              </>
            )}
          </FormControl>

          <FormControl id="confirmPassword" isRequired>
            <FormLabel color="gray.300">Confirm Password</FormLabel>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              bg="gray.700"
              border="none"
              color="white"
              _placeholder={{ color: 'gray.400' }}
            />
            {confirmPassword && password !== confirmPassword && (
              <Text color="red.500" fontSize="sm" mt={1}>
                Passwords do not match
              </Text>
            )}
          </FormControl>

          <Button
            colorScheme="blue"
            type="submit"
            isLoading={isLoading}
            loadingText="Creating account..."
            mt={4}
            bg="accent.500"
            _hover={{ bg: "accent.600", transform: "translateY(-2px)" }}
            style={{ transition: 'all 0.2s ease' }}
            isDisabled={password !== confirmPassword || passwordStrength < 30}
          >
            Sign Up
          </Button>
        </Stack>
      </form>

      <Text mt={4} textAlign="center" color="gray.400" fontSize="sm">
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#63B3ED' }}>
          Log in
        </Link>
      </Text>
    </Box>
  );
};

export default SignupForm;