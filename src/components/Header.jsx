import { 
  Box, 
  Flex, 
  Button, 
  Image, 
  HStack, 
  useDisclosure, 
  Avatar, 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../services/auth/authService';

const Header = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

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
          
          {currentUser ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  src={userProfile?.photoURL || ''}
                  border="2px solid"
                  borderColor="accent.500"
                />
              </MenuButton>
              <MenuList bg="gray.800" borderColor="gray.700">
                <MenuItem as={RouterLink} to="/profile" bg="gray.800" _hover={{ bg: 'gray.700' }}>
                  Profile
                </MenuItem>
                <MenuDivider borderColor="gray.700" />
                <MenuItem 
                  bg="gray.800" 
                  _hover={{ bg: 'gray.700' }}
                  onClick={async () => {
                    await logoutUser();
                    navigate('/');
                  }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <HStack spacing={2}>
              <Button 
                as={RouterLink} 
                to="/login" 
                variant="ghost" 
                size="sm"
              >
                Log In
              </Button>
              <Button 
                as={RouterLink} 
                to="/register" 
                variant="accent" 
                size="sm"
                _hover={{ transform: 'translateY(-1px)' }}
                transition="all 0.2s"
              >
                Sign Up
              </Button>
            </HStack>
          )}
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
        
        {currentUser ? (
          <>
            <Button as={RouterLink} to="/profile" variant="ghost" size="sm" w="full" justifyContent="left" mb={2}>Profile</Button>
            <Button 
              variant="ghost" 
              colorScheme="red" 
              size="sm" 
              w="full" 
              justifyContent="left" 
              mb={2}
              onClick={async () => {
                await logoutUser();
                navigate('/');
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button as={RouterLink} to="/login" variant="ghost" size="sm" w="full" justifyContent="left" mb={2}>Log In</Button>
            <Button as={RouterLink} to="/register" variant="accent" size="sm" w="full">Sign Up</Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Header;