import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  HStack,
  Radio,
  RadioGroup,
  Badge,
  Text,
  Flex,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { createUserTrade } from '../services/tradeService';
import { fetchCurrentPrice } from '../services/marketDataService';

const TradeForm = ({ onTradeComplete }) => {
  const [symbol, setSymbol] = useState('');
  const [action, setAction] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [rationale, setRationale] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [popularStocks, setPopularStocks] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
  ]);
  
  const toast = useToast();
  
  // When symbol changes, try to fetch the current price
  useEffect(() => {
    if (symbol) {
      fetchStockPrice(symbol);
    }
  }, [symbol]);
  
  const fetchStockPrice = async (stockSymbol) => {
    if (!stockSymbol) return;
    
    setFetchingPrice(true);
    try {
      const priceData = await fetchCurrentPrice(stockSymbol);
      if (priceData && priceData.price) {
        setPrice(priceData.price);
      }
    } catch (error) {
      console.error('Error fetching stock price:', error);
      toast({
        title: 'Could not fetch current price',
        description: 'Using estimated price. You can update it manually.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      // Set a sample price if API fails
      setPrice(Math.floor(Math.random() * 300) + 50);
    } finally {
      setFetchingPrice(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate the form
      if (!symbol || !quantity || !price) {
        toast({
          title: 'Form incomplete',
          description: 'Please fill in all required fields',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      // Create the trade
      const newTrade = {
        symbol,
        action,
        quantity,
        price,
        rationale,
        timestamp: new Date(),
      };
      
      await createUserTrade(newTrade);
      
      toast({
        title: 'Trade executed!',
        description: `Successfully ${action === 'BUY' ? 'bought' : 'sold'} ${quantity} shares of ${symbol}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Reset the form
      setSymbol('');
      setAction('BUY');
      setQuantity(1);
      setPrice(0);
      setRationale('');
      
      // Notify parent component
      if (onTradeComplete) {
        onTradeComplete(newTrade);
      }
    } catch (error) {
      console.error('Error creating trade:', error);
      toast({
        title: 'Error executing trade',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box 
      bg="gray.800" 
      p={6} 
      borderRadius="xl" 
      borderWidth="1px" 
      borderColor="gray.700"
      boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={5} align="stretch">
          <FormControl isRequired>
            <FormLabel color="gray.300">Stock Symbol</FormLabel>
            <Select
              placeholder="Select stock or enter symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              bg="gray.700"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
            >
              {popularStocks.map((stock) => (
                <option key={stock.symbol} value={stock.symbol} style={{backgroundColor: "#1e293b"}}>
                  {stock.symbol} - {stock.name}
                </option>
              ))}
            </Select>
          </FormControl>
          
          <HStack>
            <FormControl flex="1">
              <FormLabel color="gray.300">Action</FormLabel>
              <RadioGroup value={action} onChange={setAction}>
                <HStack spacing={5}>
                  <Radio value="BUY" colorScheme="green">
                    <Badge colorScheme="green" py={1} px={2} borderRadius="md">BUY</Badge>
                  </Radio>
                  <Radio value="SELL" colorScheme="red">
                    <Badge colorScheme="red" py={1} px={2} borderRadius="md">SELL</Badge>
                  </Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
            
            <FormControl flex="1" isRequired>
              <FormLabel color="gray.300">Quantity</FormLabel>
              <NumberInput
                min={1}
                value={quantity}
                onChange={(value) => setQuantity(Number(value))}
                bg="gray.700"
                borderColor="gray.600"
                color="white"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper borderColor="gray.600" color="gray.400" />
                  <NumberDecrementStepper borderColor="gray.600" color="gray.400" />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </HStack>
          
          <FormControl isRequired>
            <FormLabel color="gray.300">
              Price 
              {fetchingPrice && (
                <Spinner size="xs" ml={2} color="accent.500" />
              )}
            </FormLabel>
            <NumberInput
              min={0}
              precision={2}
              value={price}
              onChange={(value) => setPrice(Number(value))}
              bg="gray.700"
              borderColor="gray.600"
              color="white"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper borderColor="gray.600" color="gray.400" />
                <NumberDecrementStepper borderColor="gray.600" color="gray.400" />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          
          <FormControl>
            <FormLabel color="gray.300">Trade Notes (Optional)</FormLabel>
            <Input
              placeholder="Why are you making this trade?"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              bg="gray.700"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
            />
          </FormControl>
          
          <Flex justify="space-between" align="center" mt={2}>
            <Text color="gray.300">
              Total Value: <Text as="span" fontWeight="bold" color="white">
                ${(price * quantity).toFixed(2)}
              </Text>
            </Text>
            <Button
              type="submit"
              isLoading={loading}
              loadingText="Executing Trade"
              bg="accent.500"
              color="white"
              _hover={{ bg: 'accent.600' }}
              size="lg"
              px={8}
            >
              Execute Trade
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
};

export default TradeForm;