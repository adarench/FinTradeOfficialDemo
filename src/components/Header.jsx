import { Box, Flex, Button, Image, HStack, useDisclosure, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box 
      as="header" 
      position="sticky" 
      top={0} 
      zIndex={10} 
      bg="gray.900" 
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderColor="gray.800"
    >
      <Flex align="center" justify="space-between" maxW="1200px" mx="auto" p={4}>
        <RouterLink to="/">
          <Flex align="center">
            <Image src="/logo.svg" alt="FinTrade Logo" h="36px" mr={2} />
            <Box fontWeight="bold" fontSize="xl" color="primary.400">FinTrade</Box>
          </Flex>
        </RouterLink>

        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          <Button as={RouterLink} to="/dashboard" variant="ghost" size="sm">Dashboard</Button>
          <Button as={RouterLink} to="/portfolio" variant="ghost" size="sm">Portfolio</Button>
          <Button 
            as={RouterLink} 
            to="/signup" 
            variant="accent" 
            size="sm"
            _hover={{ transform: 'translateY(-1px)' }}
            transition="all 0.2s"
          >
            Start Trading
          </Button>
        </HStack>

        <Box display={{ base: 'block', md: 'none' }} onClick={onToggle} cursor="pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Box>
      </Flex>

      {/* Mobile menu */}
      <Box 
        display={{ base: isOpen ? 'block' : 'none', md: 'none' }}
        p={4}
        bg="gray.900"
        borderTop="1px"
        borderColor="gray.800"
        animate={isOpen ? 'open' : 'closed'}
      >
        <Button as={RouterLink} to="/dashboard" variant="ghost" size="sm" w="full" justifyContent="left" mb={2}>Dashboard</Button>
        <Button as={RouterLink} to="/portfolio" variant="ghost" size="sm" w="full" justifyContent="left" mb={2}>Portfolio</Button>
        <Button as={RouterLink} to="/signup" variant="accent" size="sm" w="full">Start Trading</Button>
      </Box>
    </Box>
  );
};

export default Header;