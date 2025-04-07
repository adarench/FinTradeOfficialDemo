import { useState } from 'react';
import { Box, Flex, Text, Avatar, HStack, Button, Progress, Stat, StatLabel, StatNumber, StatHelpText, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const TraderCard = ({ trader, onFollowToggle }) => {
  const { id, name, avatar, performance, winRate, followers, status: initialStatus } = trader;
  const [status, setStatus] = useState(initialStatus);
  const isPositive = performance > 0;
  const toast = useToast();
  
  const handleFollowClick = () => {
    const newStatus = status === 'Following' ? 'Follow' : 'Following';
    setStatus(newStatus);
    
    // Show a toast notification
    toast({
      title: newStatus === 'Following' ? `Now following ${name}` : `Unfollowed ${name}`,
      status: newStatus === 'Following' ? 'success' : 'info',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });

    // Call parent handler if provided
    if (onFollowToggle) {
      onFollowToggle(id, newStatus);
    }
  };
  
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg="gray.800"
      borderRadius="xl"
      boxShadow="0 4px 20px rgba(0,0,0,0.2)"
      p={5}
      mb={4}
      borderWidth="1px"
      borderColor="gray.700"
      _hover={{ 
        boxShadow: "0 8px 30px rgba(0,0,0,0.25)", 
        transform: "translateY(-3px)",
        borderColor: "gray.600" 
      }}
      transition="all 0.2s ease"
      position="relative"
      overflow="hidden"
    >
      {/* Subtle top border gradient */}
      <Box 
        position="absolute" 
        top="0" 
        left="15%" 
        right="15%" 
        height="1px" 
        bgGradient={`linear(to-r, transparent, ${isPositive ? 'green.500' : 'gray.500'}, transparent)`} 
        opacity="0.7"
      />
      
      <Flex justify="space-between" align="center" mb={4}>
        <HStack spacing={4}>
          <Avatar 
            size="md" 
            name={name} 
            src={avatar} 
            borderWidth="2px" 
            borderColor={isPositive ? 'green.500' : 'gray.600'}
          />
          <Box>
            <Text fontWeight="bold" fontSize="md" color="white">{name}</Text>
            <Text fontSize="sm" color="gray.400">{followers} followers</Text>
          </Box>
        </HStack>
        <Button 
          size="sm" 
          bg={status === 'Following' ? 'accent.500' : 'transparent'}
          color={status === 'Following' ? 'white' : 'gray.300'}
          borderWidth="1px"
          borderColor={status === 'Following' ? 'accent.500' : 'gray.600'}
          onClick={handleFollowClick}
          _hover={{ 
            bg: status === 'Following' ? 'accent.600' : 'gray.700',
            transform: 'translateY(-1px)'
          }}
          transition="all 0.2s ease"
          borderRadius="md"
          fontWeight="medium"
          px={3}
          py={1}
        >
          {status === 'Following' ? 'Following' : 'Follow'}
        </Button>
      </Flex>
      
      <Flex 
        justify="space-between" 
        mb={4} 
        p={3} 
        bg="gray.850" 
        borderRadius="md" 
        borderWidth="1px" 
        borderColor="gray.700"
      >
        <Stat>
          <StatLabel fontSize="xs" color="gray.400">Performance</StatLabel>
          <StatNumber fontSize="md" color={isPositive ? 'green.400' : 'red.400'}>
            {isPositive ? '+' : ''}{performance}%
          </StatNumber>
          <StatHelpText fontSize="xs" color="gray.500" mt={0}>Last 30 days</StatHelpText>
        </Stat>
        
        <Stat>
          <StatLabel fontSize="xs" color="gray.400">Win Rate</StatLabel>
          <StatNumber fontSize="md" color="white">{winRate}%</StatNumber>
          <StatHelpText fontSize="xs" color="gray.500" mt={0}>Successfully closed</StatHelpText>
        </Stat>
      </Flex>
      
      <Box>
        <Flex justify="space-between" mb={2} align="center">
          <Text fontSize="xs" color="gray.400">Win/Loss Ratio</Text>
          <Text fontSize="xs" fontWeight="medium" color="white">{winRate}%</Text>
        </Flex>
        <Box position="relative" h="4px" bg="gray.700" borderRadius="full" overflow="hidden">
          <Box 
            position="absolute" 
            top="0" 
            left="0" 
            height="100%" 
            width={`${winRate}%`} 
            bg="green.500"
            bgGradient="linear(to-r, green.500, green.400)"
            borderRadius="full"
          />
        </Box>
      </Box>
    </MotionBox>
  );
};

export default TraderCard;