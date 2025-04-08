import { Box, Flex, HStack, Text, Badge, Avatar, Button, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import CommentPreview from './comments/CommentPreview';

const MotionBox = motion(Box);

const TradeCard = ({ trade }) => {
  const { trader, action, symbol, price, quantity, timestamp, gain, id = `trade-${Date.now()}` } = trade;
  const isPositive = gain > 0;
  
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg="gray.800"
      borderRadius="lg"
      boxShadow="0 4px 20px rgba(0,0,0,0.2)"
      p={4}
      mb={4}
      borderWidth="1px"
      borderColor="gray.700"
      _hover={{ 
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)", 
        transform: "translateY(-2px)",
        borderColor: "gray.600" 
      }}
      style={{ transition: 'all 0.2s ease' }}
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
        bgGradient={`linear(to-r, transparent, ${isPositive ? 'green.500' : 'red.500'}, transparent)`} 
        opacity="0.7"
      />
      
      <Flex justify="space-between" align="center" mb={3}>
        <HStack spacing={3}>
          <Box 
            position="relative"
            width="36px" 
            height="36px"
          >
            <Avatar 
              size="sm" 
              name={trader.name} 
              src={trader.avatar} 
              borderWidth="2px"
              borderColor="transparent"
              bg="gray.700"
            />
            <Box
              position="absolute"
              bottom="-1px"
              right="-1px"
              width="12px"
              height="12px"
              borderRadius="full"
              bg={isPositive ? "green.500" : "red.500"}
              borderWidth="2px"
              borderColor="gray.800"
            />
          </Box>
          <Box>
            <RouterLink to={`/trader/${trader.id || 'trader1'}`}>
              <Text 
                fontWeight="medium" 
                fontSize="sm"
                _hover={{ color: 'accent.400' }}
                transition="color 0.2s"
              >
                {trader.name}
              </Text>
            </RouterLink>
            <Text fontSize="xs" color="gray.400">{trader.performance}</Text>
          </Box>
        </HStack>
        <Badge 
          bg={action === 'BUY' ? 'green.500' : 'red.500'} 
          color="white"
          px={2}
          py={1}
          borderRadius="md"
          fontSize="xs"
          fontWeight="medium"
          textTransform="uppercase"
          letterSpacing="0.5px"
        >
          {action}
        </Badge>
      </Flex>
      
      <Box mb={3} p={3} bg="gray.850" borderRadius="md" borderWidth="1px" borderColor="gray.700">
        <Flex justify="space-between" mb={1}>
          <Text fontWeight="bold" fontSize="md" color="white">{symbol}</Text>
          <Text fontWeight="bold" fontSize="md" color="white">
            ${price.toFixed(2)} × {quantity}
          </Text>
        </Flex>
        <Flex justify="space-between">
          <Text fontSize="xs" color="gray.400">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text 
            fontWeight="medium"
            fontSize="sm"
            color={isPositive ? 'green.400' : 'red.400'}
          >
            {isPositive ? '+' : ''}{gain.toFixed(2)}%
          </Text>
        </Flex>
      </Box>
      
      <Flex justify="space-between" align="center">
        <CommentPreview tradeId={id} traderId={trader.id || 'trader1'} />
        
        <Button 
          size="sm" 
          bg="accent.500"
          color="white"
          _hover={{ 
            bg: 'accent.600',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 92, 187, 0.2)'
          }}
          style={{ transition: 'all 0.2s ease' }}
          fontSize="xs"
          fontWeight="medium"
        >
          Copy Trade
        </Button>
      </Flex>
    </MotionBox>
  );
};

export default TradeCard;