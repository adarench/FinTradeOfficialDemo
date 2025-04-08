import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Avatar,
  Heading,
  Text,
  useToast,
  Flex,
  Divider,
  VStack,
  HStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfile, updateUserEmail, updateUserPassword, logoutUser } from '../../services/auth/authService';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { userProfile, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [photoURL, setPhotoURL] = useState(userProfile?.photoURL || '');
  const [newEmail, setNewEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { isOpen: isEmailOpen, onOpen: onEmailOpen, onClose: onEmailClose } = useDisclosure();
  const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateUserProfile({ displayName, photoURL });
      toast({
        title: 'Profile updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to update profile',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    
    if (!currentPassword) {
      toast({
        title: 'Password required',
        description: 'Please enter your current password',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);

    try {
      await updateUserEmail(newEmail, currentPassword);
      toast({
        title: 'Email updated',
        description: 'Please verify your new email address',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onEmailClose();
      setCurrentPassword('');
    } catch (error) {
      toast({
        title: 'Failed to update email',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);

    try {
      await updateUserPassword(currentPassword, newPassword);
      toast({
        title: 'Password updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onPasswordClose();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: 'Failed to update password',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Failed to log out',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box 
      maxW="800px" 
      mx="auto" 
      p={6}
    >
      <Heading size="xl" mb={6} color="white">
        Your Profile
      </Heading>

      <Flex 
        direction={{ base: "column", md: "row" }} 
        gap={8}
        bg="gray.800"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.700"
        p={6}
        boxShadow="0 4px 20px rgba(0,0,0,0.2)"
      >
        {/* Left column - User info and stats */}
        <VStack 
          align="center" 
          flex="1" 
          spacing={4}
          p={4}
        >
          <Avatar 
            size="2xl" 
            src={userProfile?.photoURL} 
            borderWidth="4px"
            borderColor="accent.500"
            mb={2}
          />
          <Heading size="md" color="white">
            {userProfile?.displayName}
          </Heading>
          <Text color="gray.400">
            {currentUser?.email}
          </Text>
          
          {!currentUser?.emailVerified && (
            <Badge colorScheme="orange">Email not verified</Badge>
          )}
          
          <Divider my={4} />
          
          <HStack spacing={6} wrap="wrap" justify="center">
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="white">
                {userProfile?.followers?.length || 0}
              </Text>
              <Text color="gray.400" fontSize="sm">Followers</Text>
            </VStack>
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="white">
                {userProfile?.following?.length || 0}
              </Text>
              <Text color="gray.400" fontSize="sm">Following</Text>
            </VStack>
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="white">
                {userProfile?.trades?.length || 0}
              </Text>
              <Text color="gray.400" fontSize="sm">Trades</Text>
            </VStack>
          </HStack>
          
          <Button 
            mt={4} 
            colorScheme="red" 
            variant="outline" 
            onClick={handleLogout}
            size="sm"
          >
            Log Out
          </Button>
        </VStack>
        
        {/* Right column - Edit profile */}
        <VStack 
          align="stretch" 
          flex="2" 
          spacing={4}
          bg="gray.750"
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.700"
        >
          <Heading size="md" mb={2} color="white">
            Edit Profile
          </Heading>
          
          <form onSubmit={handleProfileUpdate}>
            <Stack spacing={4}>
              <FormControl id="displayName">
                <FormLabel color="gray.300">Display Name</FormLabel>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  bg="gray.700"
                  border="none"
                  color="white"
                />
              </FormControl>
              
              <FormControl id="photoURL">
                <FormLabel color="gray.300">Profile Picture URL</FormLabel>
                <Input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  bg="gray.700"
                  border="none"
                  color="white"
                />
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                loadingText="Updating..."
                bg="accent.500"
                _hover={{ bg: "accent.600" }}
              >
                Update Profile
              </Button>
            </Stack>
          </form>
          
          <Divider my={4} />
          
          <HStack spacing={4}>
            <Button 
              variant="outline" 
              colorScheme="blue" 
              onClick={onEmailOpen}
              flex="1"
            >
              Change Email
            </Button>
            <Button 
              variant="outline" 
              colorScheme="blue" 
              onClick={onPasswordOpen}
              flex="1"
            >
              Change Password
            </Button>
          </HStack>
        </VStack>
      </Flex>
      
      {/* Email Change Modal */}
      <Modal isOpen={isEmailOpen} onClose={onEmailClose}>
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.700"/>
        <ModalContent bg="gray.850" borderColor="gray.700" borderWidth="1px">
          <ModalHeader color="white">Change Email</ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody>
            <form id="email-form" onSubmit={handleEmailUpdate}>
              <Stack spacing={4}>
                <FormControl id="newEmail" isRequired>
                  <FormLabel color="gray.300">New Email</FormLabel>
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    bg="gray.700"
                    border="none"
                    color="white"
                  />
                </FormControl>
                
                <FormControl id="emailCurrentPassword" isRequired>
                  <FormLabel color="gray.300">Current Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      bg="gray.700"
                      border="none"
                      color="white"
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </Stack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEmailClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              form="email-form"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Updating..."
              bg="accent.500"
              _hover={{ bg: "accent.600" }}
            >
              Update Email
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Password Change Modal */}
      <Modal isOpen={isPasswordOpen} onClose={onPasswordClose}>
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.700"/>
        <ModalContent bg="gray.850" borderColor="gray.700" borderWidth="1px">
          <ModalHeader color="white">Change Password</ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody>
            <form id="password-form" onSubmit={handlePasswordUpdate}>
              <Stack spacing={4}>
                <FormControl id="passwordCurrentPassword" isRequired>
                  <FormLabel color="gray.300">Current Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      bg="gray.700"
                      border="none"
                      color="white"
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                
                <FormControl id="newPassword" isRequired>
                  <FormLabel color="gray.300">New Password</FormLabel>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    bg="gray.700"
                    border="none"
                    color="white"
                  />
                </FormControl>
                
                <FormControl id="confirmPassword" isRequired>
                  <FormLabel color="gray.300">Confirm New Password</FormLabel>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    bg="gray.700"
                    border="none"
                    color="white"
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      Passwords do not match
                    </Text>
                  )}
                </FormControl>
              </Stack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onPasswordClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              form="password-form"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Updating..."
              isDisabled={newPassword !== confirmPassword}
              bg="accent.500"
              _hover={{ bg: "accent.600" }}
            >
              Update Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserProfile;