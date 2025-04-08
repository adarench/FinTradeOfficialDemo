import { Box, Flex } from '@chakra-ui/react';
import SignupForm from '../components/auth/SignupForm';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Register = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.950">
      <Header />
      
      <Flex
        flex="1"
        direction="column"
        align="center"
        justify="center"
        p={8}
        position="relative"
      >
        {/* Background gradient effect */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgGradient="linear(to-b, gray.900, transparent, gray.900)"
          zIndex="0"
          pointerEvents="none"
        />
        
        <Box
          position="absolute"
          top="30%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="300px"
          height="300px"
          bg="accent.500"
          filter="blur(120px)"
          opacity="0.15"
          zIndex="0"
          pointerEvents="none"
        />
        
        <Box
          maxW="500px"
          width="100%"
          p={4}
          zIndex="1"
        >
          <SignupForm />
        </Box>
      </Flex>
      
      <Footer />
    </Box>
  );
};

export default Register;