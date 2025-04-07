import { Box, Flex, HStack, Text, Badge, Avatar, Button, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const TradeCard = ({ trade }) => {
  const { trader, action, symbol, price, quantity, timestamp, gain } = trade;
  const isPositive = gain > 0;
  const bgColor = useColorModeValue('white', 'gray.800');
  
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
      <Flex justify="space-between" align="center" mb={3}>
        <HStack>
          <Avatar size="sm" name={trader.name} src={trader.avatar} />
          <Box>
            <Text fontWeight="bold">{trader.name}</Text>
            <Text fontSize="xs" color="gray.500">{trader.performance}</Text>
          </Box>
        </HStack>
        <Badge colorScheme={action === 'BUY' ? 'green' : 'red'}>
          {action}
        </Badge>
      </Flex>
      
      <Box mb={3}>
        <Flex justify="space-between" mb={1}>
          <Text fontWeight="medium">{symbol}</Text>
          <Text fontWeight="bold">
            ${price.toFixed(2)} × {quantity}
          </Text>
        </Flex>
        <Flex justify="space-between">
          <Text fontSize="sm" color="gray.500">{new Date(timestamp).toLocaleString()}</Text>
          <Text 
            fontWeight="medium"
            color={isPositive ? 'green.500' : 'red.500'}
          >
            {isPositive ? '+' : ''}{gain.toFixed(2)}%
          </Text>
        </Flex>
      </Box>
      
      <Flex justify="space-between">
        <Button size="sm" variant="outline" colorScheme="gray">Details</Button>
        <Button size="sm" colorScheme="blue">Copy Trade</Button>
      </Flex>
    </MotionBox>
  );
};

export default TradeCard;