import { useState } from 'react';
import { Box, Flex, Text, Avatar, HStack, Button, Progress, Stat, StatLabel, StatNumber, StatHelpText, useColorModeValue, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const TraderCard = ({ trader, onFollowToggle }) => {
  const { id, name, avatar, performance, winRate, followers, status: initialStatus } = trader;
  const [status, setStatus] = useState(initialStatus);
  const isPositive = performance > 0;
  const bgColor = useColorModeValue('white', 'gray.800');
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
      bg={bgColor}
      borderRadius="lg"
      boxShadow="sm"
      p={4}
      mb={4}
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <HStack>
          <Avatar size="md" name={name} src={avatar} />
          <Box>
            <Text fontWeight="bold" fontSize="lg">{name}</Text>
            <Text fontSize="sm" color="gray.500">{followers} followers</Text>
          </Box>
        </HStack>
        <Button 
          size="sm" 
          colorScheme={status === 'Following' ? 'blue' : 'gray'}
          variant={status === 'Following' ? 'solid' : 'outline'}
          onClick={handleFollowClick}
        >
          {status === 'Following' ? 'Following' : 'Follow'}
        </Button>
      </Flex>
      
      <Flex justify="space-between" mb={4}>
        <Stat>
          <StatLabel>Performance</StatLabel>
          <StatNumber color={isPositive ? 'green.500' : 'red.500'}>
            {isPositive ? '+' : ''}{performance}%
          </StatNumber>
          <StatHelpText fontSize="xs">Last 30 days</StatHelpText>
        </Stat>
        
        <Stat>
          <StatLabel>Win Rate</StatLabel>
          <StatNumber>{winRate}%</StatNumber>
          <StatHelpText fontSize="xs">Successfully closed</StatHelpText>
        </Stat>
      </Flex>
      
      <Box>
        <Flex justify="space-between" mb={1}>
          <Text fontSize="sm">Win/Loss Ratio</Text>
          <Text fontSize="sm" fontWeight="medium">{winRate}%</Text>
        </Flex>
        <Progress value={winRate} colorScheme="green" size="sm" borderRadius="full" />
      </Box>
    </MotionBox>
  );
};

export default TraderCard;