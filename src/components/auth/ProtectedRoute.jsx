import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Spinner, Center, Text, Image, Flex } from '@chakra-ui/react';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // For a very quick check
  const [showSpinner, setShowSpinner] = useState(false);
  
  // Only show spinner if loading takes more than 300ms
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setShowSpinner(true), 300);
    } else {
      setShowSpinner(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading && showSpinner) {
    return (
      <Center minH="100vh" bg="gray.900">
        <Flex direction="column" align="center" justifyContent="center">
          <Image src="/logo.svg" alt="FinTrade Logo" h="50px" mb={4} />
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.700"
            color="accent.500"
            size="xl"
            mb={4}
          />
          <Text color="gray.400">Loading your account...</Text>
        </Flex>
      </Center>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;