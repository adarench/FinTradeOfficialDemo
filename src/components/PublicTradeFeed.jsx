import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Flex,
  Select,
  HStack,
  Spinner,
  useToast,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import TradeCard from './TradeCard';
import TradeForm from './TradeForm';
import { 
  fetchBotTrades, 
  getTradeStream, 
  startContinuousTradeStream,
  BOT_TRADERS
} from '../services/botTraderService';
import { createCopyTrade } from '../services/tradeService';

const MotionBox = motion(Box);

const PublicTradeFeed = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copyingTrade, setCopyingTrade] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [traderFilter, setTraderFilter] = useState('all');
  const [assetFilter, setAssetFilter] = useState('all');
  const [newTradeAlert, setNewTradeAlert] = useState(false);
  const [liveTrading, setLiveTrading] = useState(true);
  const [tradeFrequency, setTradeFrequency] = useState('normal');
  const tradeStreamRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Initialize trade stream on component mount
  useEffect(() => {
    loadInitialTrades();
    
    if (liveTrading) {
      startTradeStream();
    }
    
    return () => {
      // Clean up the trade stream when component unmounts
      if (tradeStreamRef.current) {
        tradeStreamRef.current();
      }
    };
  }, []);
  
  // Handle changes to trade filters
  useEffect(() => {
    loadInitialTrades();
    
    // Restart the stream with new filters if live trading is enabled
    if (liveTrading) {
      if (tradeStreamRef.current) {
        tradeStreamRef.current(); // Stop current stream
      }
      startTradeStream();
    }
  }, [traderFilter, assetFilter, tradeFrequency]);
  
  // Start the live trade stream
  const startTradeStream = () => {
    // Get bot IDs based on filter
    let botIds = [];
    if (traderFilter !== 'all') {
      botIds = [traderFilter];
    } else {
      botIds = BOT_TRADERS.map(bot => bot.id);
    }
    
    // Start continuous trade stream
    tradeStreamRef.current = startContinuousTradeStream(
      (newTrades) => handleNewTrades(newTrades),
      botIds,
      {
        frequency: tradeFrequency,
        minInterval: tradeFrequency === 'high' ? 5000 : 10000,
        maxInterval: tradeFrequency === 'high' ? 20000 : 60000,
      }
    );
    
    console.log(`Started live trade stream with ${botIds.length} bots at ${tradeFrequency} frequency`);
  };
  
  // Handle new trades from the stream
  const handleNewTrades = (newTrades) => {
    // Apply sector filter
    let filteredTrades = newTrades;
    if (assetFilter !== 'all') {
      filteredTrades = filteredTrades.filter(trade => {
        if (assetFilter === 'tech') return trade.sector === 'Technology';
        if (assetFilter === 'finance') return trade.sector === 'Financial Services';
        if (assetFilter === 'consumer') return ['Consumer Cyclical', 'Consumer Defensive'].includes(trade.sector);
        return true;
      });
    }
    
    if (filteredTrades.length === 0) return;
    
    // Format for TradeCard
    const formattedTrades = filteredTrades.map(formatTradeForDisplay);
    
    // Show notification for new trades
    const latestTrade = formattedTrades[0];
    toast({
      title: 'New trade activity',
      description: `${latestTrade.trader.name} just ${latestTrade.action.toLowerCase()} ${latestTrade.symbol}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    
    // Show alert
    setNewTradeAlert(true);
    setTimeout(() => setNewTradeAlert(false), 5000);
    
    // Update trades list
    setTrades(prevTrades => {
      // Combine new trades with existing ones, remove duplicates, sort by timestamp
      const allTrades = [...formattedTrades, ...prevTrades];
      const uniqueTrades = [];
      const seenIds = new Set();
      
      for (const trade of allTrades) {
        if (!seenIds.has(trade.id)) {
          seenIds.add(trade.id);
          uniqueTrades.push(trade);
        }
      }
      
      // Sort by timestamp (newest first)
      uniqueTrades.sort((a, b) => {
        const timeA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
        const timeB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
        return timeB - timeA;
      });
      
      return uniqueTrades.slice(0, 30); // Limit to 30 most recent trades
    });
  };
  
  // Load initial trades on first render
  const loadInitialTrades = async () => {
    setLoading(true);
    
    try {
      // Use getTradeStream to get a mix of existing and new trades
      const botIds = traderFilter !== 'all' ? [traderFilter] : [];
      const fetchedTrades = await getTradeStream(botIds, tradeFrequency);
      
      // Apply sector filter
      let filteredTrades = fetchedTrades;
      if (assetFilter !== 'all') {
        filteredTrades = filteredTrades.filter(trade => {
          if (assetFilter === 'tech') return trade.sector === 'Technology';
          if (assetFilter === 'finance') return trade.sector === 'Financial Services';
          if (assetFilter === 'consumer') return ['Consumer Cyclical', 'Consumer Defensive'].includes(trade.sector);
          return true;
        });
      }
      
      // Format for TradeCard
      const formattedTrades = filteredTrades.map(formatTradeForDisplay);
      
      setTrades(formattedTrades);
    } catch (error) {
      console.error('Error loading trades:', error);
      toast({
        title: 'Error loading trades',
        description: error.message || 'Could not load trading activity',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to format trades for display
  const formatTradeForDisplay = (trade) => ({
    id: trade.id,
    trader: {
      id: trade.traderId,
      name: trade.traderName,
      avatar: trade.traderAvatar,
    },
    action: trade.action,
    symbol: trade.symbol,
    price: trade.price,
    quantity: trade.quantity,
    timestamp: trade.timestamp || new Date(),
    gain: trade.gain || 0,
    rationale: trade.rationale || '',
    tradingStyle: trade.tradingStyle || 'momentum',
    sector: trade.sector
  });
  
  // Toggle live trading
  const handleLiveTradingToggle = () => {
    const newState = !liveTrading;
    setLiveTrading(newState);
    
    if (newState) {
      // Start the stream
      startTradeStream();
      toast({
        title: 'Live trading enabled',
        description: 'You will now receive real-time trade updates',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Stop the stream
      if (tradeStreamRef.current) {
        tradeStreamRef.current();
        tradeStreamRef.current = null;
      }
      toast({
        title: 'Live trading disabled',
        description: 'Real-time trade updates paused',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Handle trade frequency change
  const handleFrequencyChange = (e) => {
    const newFrequency = e.target.value;
    setTradeFrequency(newFrequency);
    
    // Restart stream with new frequency if live trading is enabled
    if (liveTrading && tradeStreamRef.current) {
      tradeStreamRef.current(); // Stop current stream
      startTradeStream();
    }
    
    toast({
      title: 'Trading frequency updated',
      description: `Trade frequency set to ${newFrequency}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCopyTrade = async (trade) => {
    try {
      setCopyingTrade(true);
      const result = await createCopyTrade(trade);
      
      toast({
        title: 'Trade copied successfully',
        description: `You've copied ${trade.trader.name}'s ${trade.action} order for ${trade.quantity} shares of ${trade.symbol}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Refresh trades to show the copied trade
      await loadTrades(true);
    } catch (error) {
      console.error('Error copying trade:', error);
      toast({
        title: 'Error copying trade',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setCopyingTrade(false);
    }
  };
  
  const handleOpenTradeForm = () => {
    onOpen();
  };
  
  const handleTradeComplete = (trade) => {
    onClose();
    loadTrades();
    
    toast({
      title: 'Trade submitted successfully',
      description: `${trade.action} ${trade.quantity} shares of ${trade.symbol} at $${trade.price}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={3}>
        <Heading size="md" color="white">Public Trading Feed</Heading>
        <HStack>
          <Button
            size="sm"
            colorScheme="accent"
            onClick={handleOpenTradeForm}
          >
            New Trade
          </Button>
        </HStack>
      </Flex>
      
      <Flex justify="space-between" align="center" wrap="wrap" mb={6} gap={2}>
        <HStack spacing={4}>
          <FormControl display="flex" alignItems="center" width="auto">
            <FormLabel htmlFor="live-trading" mb="0" color="gray.300" fontSize="sm">
              Live Trading
            </FormLabel>
            <Switch 
              id="live-trading" 
              colorScheme="green" 
              isChecked={liveTrading}
              onChange={handleLiveTradingToggle}
            />
          </FormControl>
          
          <Select 
            size="sm" 
            w="140px" 
            bg="gray.700" 
            borderColor="gray.600" 
            color="white" 
            _hover={{ borderColor: "gray.500" }}
            value={tradeFrequency}
            onChange={handleFrequencyChange}
          >
            <option value="low" style={{backgroundColor: "#1e293b"}}>Low Frequency</option>
            <option value="normal" style={{backgroundColor: "#1e293b"}}>Normal Frequency</option>
            <option value="high" style={{backgroundColor: "#1e293b"}}>High Frequency</option>
          </Select>
        </HStack>
        
        <HStack>
          <Select 
            size="sm" 
            w="180px" 
            placeholder="All Traders" 
            bg="gray.700" 
            borderColor="gray.600" 
            color="white" 
            _hover={{ borderColor: "gray.500" }}
            value={traderFilter}
            onChange={(e) => setTraderFilter(e.target.value)}
          >
            <option value="all" style={{backgroundColor: "#1e293b"}}>All Traders</option>
            <option value="bot-momentum-mike" style={{backgroundColor: "#1e293b"}}>Momentum Mike</option>
            <option value="bot-value-victoria" style={{backgroundColor: "#1e293b"}}>Value Victoria</option>
            <option value="bot-swing-sam" style={{backgroundColor: "#1e293b"}}>Swing Sam</option>
            <option value="bot-dca-deb" style={{backgroundColor: "#1e293b"}}>DCA Deb</option>
            <option value="bot-tech-tyler" style={{backgroundColor: "#1e293b"}}>Tech Tyler</option>
          </Select>
          <Select 
            size="sm" 
            w="140px" 
            placeholder="All Assets" 
            bg="gray.700" 
            borderColor="gray.600" 
            color="white" 
            _hover={{ borderColor: "gray.500" }}
            value={assetFilter}
            onChange={(e) => setAssetFilter(e.target.value)}
          >
            <option value="all" style={{backgroundColor: "#1e293b"}}>All Sectors</option>
            <option value="tech" style={{backgroundColor: "#1e293b"}}>Technology</option>
            <option value="finance" style={{backgroundColor: "#1e293b"}}>Financial</option>
            <option value="consumer" style={{backgroundColor: "#1e293b"}}>Consumer</option>
          </Select>
        </HStack>
      </Flex>
      
      {/* New Trade Alert */}
      {newTradeAlert && trades.length > 0 && (
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          mb={4}
          p={4}
          bg="rgba(21, 128, 61, 0.1)"
          color="white"
          borderRadius="md"
          borderLeft="4px solid"
          borderColor="green.500"
        >
          <Flex justify="space-between" align="center">
            <HStack>
              <Badge colorScheme="green">New Trade</Badge>
              <Text fontWeight="medium">
                {trades[0].trader.name} just {trades[0].action === 'BUY' ? 'bought' : 'sold'} {trades[0].symbol} at ${trades[0].price.toFixed(2)}
              </Text>
            </HStack>
            <Button 
              size="sm" 
              bg="accent.500"
              color="white"
              _hover={{ bg: 'accent.600' }}
              isLoading={copyingTrade}
              onClick={() => handleCopyTrade(trades[0])}
            >
              Copy Now
            </Button>
          </Flex>
        </MotionBox>
      )}
      
      {/* Loading State */}
      {loading && (
        <Box textAlign="center" py={8}>
          <Spinner size="md" color="accent.500" mb={4} />
          <Text color="gray.400">Loading trading activity...</Text>
        </Box>
      )}
      
      {/* Trade Cards */}
      {!loading && (
        <VStack spacing={4} align="stretch">
          {trades.length > 0 ? (
            trades.map((trade) => (
              <TradeCard 
                key={trade.id} 
                trade={trade} 
                onCopyTrade={() => handleCopyTrade(trade)}
                showCopyButton={true}
              />
            ))
          ) : (
            <Box p={6} textAlign="center" bg="gray.750" borderRadius="md">
              <Text color="gray.400">No trading activity found matching your filters.</Text>
            </Box>
          )}
        </VStack>
      )}
      
      {trades.length > 0 && (
        <Flex justify="center" mt={8}>
          <Button 
            variant="outline" 
            size="md"
            borderColor="gray.600"
            color="gray.300"
            _hover={{ bg: 'rgba(255,255,255,0.05)', borderColor: 'gray.500' }}
            onClick={() => loadTrades()}
          >
            Refresh Trades
          </Button>
        </Flex>
      )}
      
      {/* Trade Form Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg="gray.900" color="white" borderColor="gray.700" borderWidth="1px">
          <ModalHeader>Create New Trade</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <TradeForm onTradeComplete={handleTradeComplete} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PublicTradeFeed;