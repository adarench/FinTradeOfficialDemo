import { Box } from '@chakra-ui/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserProfile from '../components/auth/UserProfile';

const Profile = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.950">
      <Header />
      
      <Box flex="1" py={8}>
        <UserProfile />
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Profile;