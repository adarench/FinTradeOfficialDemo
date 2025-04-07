import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  Switch,
  FormControl,
  FormLabel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Sample portfolio value history data
const portfolioHistory = [
  { date: '2025-04-01', value: 100000 },
  { date: '2025-04-02', value: 100230 },
  { date: '2025-04-03', value: 101200 },
  { date: '2025-04-04', value: 102500 },
  { date: '2025-04-05', value: 103100 },
  { date: '2025-04-06', value: 105400 },
  { date: '2025-04-07', value: 108245.62 },
];

// Sample portfolio data
const portfolioData = {
  totalValue: 108245.62,
  initialValue: 100000,
  change: 8245.62,
  changePercent: 8.24,
  allocations: [
    { symbol: 'AAPL', value: 18263.00, percent: 16.87, shares: 100, avgPrice: 182.63, currentPrice: 182.63, unrealizedPL: 0 },
    { symbol: 'TSLA', value: 25657.50, percent: 23.70, shares: 150, avgPrice: 171.05, currentPrice: 171.05, unrealizedPL: 0 },
    { symbol: 'MSFT', value: 20937.50, percent: 19.34, shares: 50, avgPrice: 418.75, currentPrice: 418.75, unrealizedPL: 0 },
    { symbol: 'NVDA', value: 17606.00, percent: 16.27, shares: 20, avgPrice: 880.30, currentPrice: 880.30, unrealizedPL: 0 },
    { symbol: 'CASH', value: 25781.62, percent: 23.82, shares: null, avgPrice: null, currentPrice: null, unrealizedPL: null },
  ]
};

// Sample trade history data
const tradeHistory = [
  { id: 1, date: '2025-04-07', action: 'BUY', symbol: 'NVDA', price: 880.30, shares: 20, value: 17606.00, trader: 'Alex Morgan' },
  { id: 2, date: '2025-04-06', action: 'BUY', symbol: 'TSLA', price: 171.05, shares: 150, value: 25657.50, trader: 'Alex Morgan' },
  { id: 3, date: '2025-04-05', action: 'BUY', symbol: 'MSFT', price: 418.75, shares: 50, value: 20937.50, trader: 'Alex Morgan' },
  { id: 4, date: '2025-04-04', action: 'BUY', symbol: 'AAPL', price: 182.63, shares: 100, value: 18263.00, trader: 'Alex Morgan' },
];

// Sample performance data by asset category
const performanceByCategory = [
  { name: 'Technology', value: 76.18 },
  { name: 'Cash', value: 23.82 },
];

const MotionBox = motion(Box);

const Portfolio = () => {
  const [timeRange, setTimeRange] = useState('all');
  const bgColor = useColorModeValue('gray.800', 'gray.800');
  const borderColor = useColorModeValue('gray.700', 'gray.700');
  
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.950">
      <Header />
      
      <Box flex="1" py={8}>
        <Container maxW="1400px">
          {/* Portfolio Overview */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Stat>
                <StatLabel color="gray.400">Total Portfolio Value</StatLabel>
                <StatNumber color="white">${portfolioData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</StatNumber>
                <StatHelpText color="green.400">
                  <StatArrow type="increase" color="green.400" />
                  {portfolioData.changePercent}% since start
                </StatHelpText>
              </Stat>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Stat>
                <StatLabel>Total P&L</StatLabel>
                <StatNumber color="green.500">
                  +${portfolioData.change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </StatNumber>
                <StatHelpText>
                  Since account creation
                </StatHelpText>
              </Stat>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Stat>
                <StatLabel>Cash Available</StatLabel>
                <StatNumber>
                  ${portfolioData.allocations.find(a => a.symbol === 'CASH').value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </StatNumber>
                <StatHelpText>
                  {portfolioData.allocations.find(a => a.symbol === 'CASH').percent.toFixed(1)}% of portfolio
                </StatHelpText>
              </Stat>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Stat>
                <StatLabel>Total Trades</StatLabel>
                <StatNumber>{tradeHistory.length}</StatNumber>
                <StatHelpText>
                  Last trade: {new Date(tradeHistory[0].date).toLocaleDateString()}
                </StatHelpText>
              </Stat>
            </MotionBox>
          </SimpleGrid>
          
          {/* Portfolio Charts */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
            mb={8}
          >
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="md" color="white">Portfolio Performance</Heading>
              <HStack>
                <Button 
                  size="sm" 
                  variant={timeRange === '1w' ? 'solid' : 'ghost'} 
                  colorScheme="accent"
                  onClick={() => setTimeRange('1w')}
                >
                  1W
                </Button>
                <Button 
                  size="sm" 
                  variant={timeRange === '1m' ? 'solid' : 'ghost'} 
                  colorScheme="accent"
                  onClick={() => setTimeRange('1m')}
                >
                  1M
                </Button>
                <Button 
                  size="sm" 
                  variant={timeRange === '3m' ? 'solid' : 'ghost'} 
                  colorScheme="accent"
                  onClick={() => setTimeRange('3m')}
                >
                  3M
                </Button>
                <Button 
                  size="sm" 
                  variant={timeRange === 'all' ? 'solid' : 'ghost'} 
                  colorScheme="accent"
                  onClick={() => setTimeRange('all')}
                >
                  All
                </Button>
              </HStack>
            </Flex>
            
            <Box h="400px">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={portfolioHistory}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#9ca3af' }}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    stroke="rgba(255, 255, 255, 0.1)"
                  />
                  <YAxis 
                    tick={{ fill: '#9ca3af' }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    stroke="rgba(255, 255, 255, 0.1)"
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                    labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    contentStyle={{ backgroundColor: bgColor, borderColor, borderRadius: '8px' }}
                    itemStyle={{ color: 'white' }}
                    labelStyle={{ color: 'white' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#1976d2" 
                    fill="rgba(25, 118, 210, 0.08)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </MotionBox>
          
          {/* Portfolio Details Tabs */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            bg={bgColor}
            borderRadius="xl"
            boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
            borderWidth="1px"
            borderColor={borderColor}
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '1px',
              bgGradient: 'linear(to-r, transparent, rgba(255, 255, 255, 0.1), transparent)',
              zIndex: '1'
            }}
          >
            <Tabs variant="enclosed" colorScheme="accent">
              <TabList px={6} pt={4}>
                <Tab>Holdings</Tab>
                <Tab>Trade History</Tab>
                <Tab>Analytics</Tab>
                <Tab>Settings</Tab>
              </TabList>
              
              <TabPanels>
                {/* Holdings Tab */}
                <TabPanel p={6}>
                  <Box overflowX="auto">
                    <Table variant="simple" colorScheme="whiteAlpha">
                      <Thead>
                        <Tr bg="gray.700">
                          <Th color="gray.300" borderColor="gray.600">Symbol</Th>
                          <Th color="gray.300" borderColor="gray.600">Shares</Th>
                          <Th color="gray.300" borderColor="gray.600">Avg Price</Th>
                          <Th color="gray.300" borderColor="gray.600">Current Price</Th>
                          <Th isNumeric color="gray.300" borderColor="gray.600">Value</Th>
                          <Th isNumeric color="gray.300" borderColor="gray.600">% of Portfolio</Th>
                          <Th isNumeric color="gray.300" borderColor="gray.600">Unrealized P&L</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {portfolioData.allocations.map((asset) => (
                          <Tr 
                            key={asset.symbol} 
                            bg="gray.750" 
                            _hover={{ bg: 'gray.700' }}
                            transition="background-color 0.2s"
                          >
                            <Td borderColor="gray.700">
                              <Box
                                display="inline-flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="md"
                                py={1}
                                px={2.5}
                                fontSize="sm"
                                fontWeight="bold"
                                bg={asset.symbol === 'CASH' ? 'gray.700' : 'rgba(25, 118, 210, 0.15)'}
                                color={asset.symbol === 'CASH' ? 'gray.300' : 'accent.400'}
                                borderWidth="1px"
                                borderColor={asset.symbol === 'CASH' ? 'gray.600' : 'accent.700'}
                              >
                                {asset.symbol}
                              </Box>
                            </Td>
                            <Td color="white" borderColor="gray.700">{asset.shares ?? '-'}</Td>
                            <Td color="white" borderColor="gray.700">${asset.avgPrice?.toFixed(2) ?? '-'}</Td>
                            <Td color="white" borderColor="gray.700">${asset.currentPrice?.toFixed(2) ?? '-'}</Td>
                            <Td isNumeric color="white" borderColor="gray.700">${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Td>
                            <Td isNumeric color="white" borderColor="gray.700">{asset.percent.toFixed(2)}%</Td>
                            <Td isNumeric borderColor="gray.700" color={asset.unrealizedPL > 0 ? 'green.400' : asset.unrealizedPL < 0 ? 'red.400' : 'gray.400'}>
                              {asset.unrealizedPL !== null ? `$${asset.unrealizedPL.toFixed(2)}` : '-'}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>
                
                {/* Trade History Tab */}
                <TabPanel p={6}>
                  <Flex justify="space-between" align="center" mb={6}>
                    <Heading size="md" color="white">Trade History</Heading>
                    <HStack>
                      <Select 
                        size="sm" 
                        w="150px" 
                        placeholder="All Traders" 
                        bg="gray.700" 
                        borderColor="gray.600" 
                        color="white" 
                        _hover={{ borderColor: "gray.500" }}
                      >
                        <option value="alex" style={{backgroundColor: "#1e293b"}}>Alex Morgan</option>
                      </Select>
                      <Select 
                        size="sm" 
                        w="120px" 
                        placeholder="All Actions" 
                        bg="gray.700" 
                        borderColor="gray.600" 
                        color="white" 
                        _hover={{ borderColor: "gray.500" }}
                      >
                        <option value="buy" style={{backgroundColor: "#1e293b"}}>Buy</option>
                        <option value="sell" style={{backgroundColor: "#1e293b"}}>Sell</option>
                      </Select>
                    </HStack>
                  </Flex>
                  
                  <Box overflowX="auto">
                    <Table variant="simple" colorScheme="whiteAlpha">
                      <Thead>
                        <Tr bg="gray.700">
                          <Th color="gray.300" borderColor="gray.600">Date</Th>
                          <Th color="gray.300" borderColor="gray.600">Action</Th>
                          <Th color="gray.300" borderColor="gray.600">Symbol</Th>
                          <Th isNumeric color="gray.300" borderColor="gray.600">Price</Th>
                          <Th isNumeric color="gray.300" borderColor="gray.600">Shares</Th>
                          <Th isNumeric color="gray.300" borderColor="gray.600">Value</Th>
                          <Th color="gray.300" borderColor="gray.600">Trader</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {tradeHistory.map((trade) => (
                          <Tr 
                            key={trade.id} 
                            bg="gray.750" 
                            _hover={{ bg: 'gray.700' }}
                            transition="background-color 0.2s"
                          >
                            <Td color="white" borderColor="gray.700">{new Date(trade.date).toLocaleDateString()}</Td>
                            <Td borderColor="gray.700">
                              <Box
                                display="inline-flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="md"
                                py={1}
                                px={2.5}
                                fontSize="sm"
                                fontWeight="bold"
                                bg={trade.action === 'BUY' ? 'rgba(21, 128, 61, 0.15)' : 'rgba(220, 38, 38, 0.15)'}
                                color={trade.action === 'BUY' ? 'green.400' : 'red.400'}
                                borderWidth="1px"
                                borderColor={trade.action === 'BUY' ? 'green.700' : 'red.700'}
                              >
                                {trade.action}
                              </Box>
                            </Td>
                            <Td color="white" borderColor="gray.700">{trade.symbol}</Td>
                            <Td isNumeric color="white" borderColor="gray.700">${trade.price.toFixed(2)}</Td>
                            <Td isNumeric color="white" borderColor="gray.700">{trade.shares}</Td>
                            <Td isNumeric color="white" borderColor="gray.700">${trade.value.toFixed(2)}</Td>
                            <Td color="white" borderColor="gray.700">{trade.trader}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>
                
                {/* Analytics Tab */}
                <TabPanel p={6}>
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                    <Box>
                      <Heading size="md" mb={4} color="white">Portfolio Allocation</Heading>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={portfolioData.allocations}
                              dataKey="value"
                              nameKey="symbol"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#1976d2"
                              stroke="rgba(255, 255, 255, 0.1)"
                              label={({ symbol, percent }) => `${symbol} ${(percent * 100).toFixed(0)}%`}
                              labelLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                            >
                              {portfolioData.allocations.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.symbol === 'CASH' ? '#4b5563' : index === 0 ? '#1976d2' : index === 1 ? '#2196f3' : index === 2 ? '#42a5f5' : index === 3 ? '#64b5f6' : '#90caf9'} 
                                />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [`$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Value']} 
                              contentStyle={{ backgroundColor: bgColor, borderColor, borderRadius: '8px' }}
                              itemStyle={{ color: 'white' }}
                              labelStyle={{ color: 'white' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Heading size="md" mb={4} color="white">Performance by Category</Heading>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={performanceByCategory}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} stroke="rgba(255, 255, 255, 0.1)" />
                            <YAxis tickFormatter={(value) => `${value}%`} tick={{ fill: '#9ca3af' }} stroke="rgba(255, 255, 255, 0.1)" />
                            <Tooltip 
                              formatter={(value) => [`${value}%`, 'Allocation']} 
                              contentStyle={{ backgroundColor: bgColor, borderColor, borderRadius: '8px' }}
                              itemStyle={{ color: 'white' }}
                              labelStyle={{ color: 'white' }}
                            />
                            <Bar dataKey="value" fill="#1976d2" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Heading size="md" mb={4} color="white">Daily P&L Changes</Heading>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={portfolioHistory.map((item, index, arr) => ({
                              date: item.date,
                              change: index === 0 ? 0 : ((item.value - arr[index - 1].value) / arr[index - 1].value) * 100
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              tick={{ fill: '#9ca3af' }} 
                              stroke="rgba(255, 255, 255, 0.1)"
                            />
                            <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} tick={{ fill: '#9ca3af' }} stroke="rgba(255, 255, 255, 0.1)" />
                            <Tooltip 
                              formatter={(value) => [`${value.toFixed(2)}%`, 'Daily Change']}
                              labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                              contentStyle={{ backgroundColor: bgColor, borderColor, borderRadius: '8px' }}
                              itemStyle={{ color: 'white' }}
                              labelStyle={{ color: 'white' }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="change" 
                              stroke="#22c55e" 
                              strokeWidth={2}
                              dot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Heading size="md" mb={4} color="white">Trade Activity</Heading>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { date: '2025-04-04', count: 1 },
                              { date: '2025-04-05', count: 1 },
                              { date: '2025-04-06', count: 1 },
                              { date: '2025-04-07', count: 1 },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              tick={{ fill: '#9ca3af' }} 
                              stroke="rgba(255, 255, 255, 0.1)"
                            />
                            <YAxis tick={{ fill: '#9ca3af' }} stroke="rgba(255, 255, 255, 0.1)" />
                            <Tooltip 
                              formatter={(value) => [value, 'Trades']}
                              labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                              contentStyle={{ backgroundColor: bgColor, borderColor, borderRadius: '8px' }}
                              itemStyle={{ color: 'white' }}
                              labelStyle={{ color: 'white' }}
                            />
                            <Bar dataKey="count" fill="#1976d2" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                  </SimpleGrid>
                </TabPanel>
                
                {/* Settings Tab */}
                <TabPanel p={6}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    <Box>
                      <Heading size="md" mb={4} color="white">Copy Trading Settings</Heading>
                      <VStack 
                        spacing={4} 
                        align="stretch" 
                        p={6} 
                        bg="gray.750" 
                        borderRadius="xl"
                        borderWidth="1px"
                        borderColor="gray.700"
                        boxShadow="0 4px 20px rgba(0,0,0,0.2)"
                        position="relative"
                        _before={{
                          content: '""',
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          right: '0',
                          height: '1px',
                          bgGradient: 'linear(to-r, transparent, rgba(255, 255, 255, 0.1), transparent)',
                          zIndex: '1'
                        }}
                      >
                        <FormControl display="flex" alignItems="center" justifyContent="space-between">
                          <FormLabel htmlFor="auto-copy" mb={0} color="white">
                            Automatic Copy Trading
                          </FormLabel>
                          <Switch id="auto-copy" colorScheme="accent" defaultChecked />
                        </FormControl>
                        
                        <FormControl display="flex" alignItems="center" justifyContent="space-between">
                          <FormLabel htmlFor="trade-alerts" mb={0} color="white">
                            Trade Alerts
                          </FormLabel>
                          <Switch id="trade-alerts" colorScheme="accent" defaultChecked />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel color="white">Maximum Position Size</FormLabel>
                          <Select 
                            defaultValue="10"
                            bg="gray.700" 
                            borderColor="gray.600" 
                            color="white" 
                            _hover={{ borderColor: "gray.500" }}
                          >
                            <option value="5" style={{backgroundColor: "#1e293b"}}>5% of portfolio</option>
                            <option value="10" style={{backgroundColor: "#1e293b"}}>10% of portfolio</option>
                            <option value="15" style={{backgroundColor: "#1e293b"}}>15% of portfolio</option>
                            <option value="20" style={{backgroundColor: "#1e293b"}}>20% of portfolio</option>
                          </Select>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel color="white">Copy Size</FormLabel>
                          <Select 
                            defaultValue="100"
                            bg="gray.700" 
                            borderColor="gray.600" 
                            color="white" 
                            _hover={{ borderColor: "gray.500" }}
                          >
                            <option value="25" style={{backgroundColor: "#1e293b"}}>25% of trader's position</option>
                            <option value="50" style={{backgroundColor: "#1e293b"}}>50% of trader's position</option>
                            <option value="75" style={{backgroundColor: "#1e293b"}}>75% of trader's position</option>
                            <option value="100" style={{backgroundColor: "#1e293b"}}>100% of trader's position</option>
                          </Select>
                        </FormControl>
                        
                        <Button 
                          bg="accent.500"
                          color="white"
                          _hover={{ bg: 'accent.600', transform: 'translateY(-2px)' }}
                          boxShadow="0 4px 14px 0 rgba(25, 118, 210, 0.25)"
                          style={{ transition: 'all 0.2s ease' }}
                          mt={2}
                        >
                          Save Settings
                        </Button>
                      </VStack>
                    </Box>
                    
                    <Box>
                      <Heading size="md" mb={4} color="white">Account Information</Heading>
                      <VStack 
                        spacing={4} 
                        align="stretch" 
                        p={6} 
                        bg="gray.750" 
                        borderRadius="xl"
                        borderWidth="1px"
                        borderColor="gray.700"
                        boxShadow="0 4px 20px rgba(0,0,0,0.2)"
                        position="relative"
                        _before={{
                          content: '""',
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          right: '0',
                          height: '1px',
                          bgGradient: 'linear(to-r, transparent, rgba(255, 255, 255, 0.1), transparent)',
                          zIndex: '1'
                        }}
                      >
                        <Flex justify="space-between" borderBottom="1px" borderColor="gray.700" pb={2}>
                          <Text fontWeight="medium" color="gray.300">Account Type</Text>
                          <Badge colorScheme="green">Demo Account</Badge>
                        </Flex>
                        
                        <Flex justify="space-between" borderBottom="1px" borderColor="gray.700" pb={2}>
                          <Text fontWeight="medium" color="gray.300">Account Balance</Text>
                          <Text color="white">${portfolioData.totalValue.toFixed(2)}</Text>
                        </Flex>
                        
                        <Flex justify="space-between" borderBottom="1px" borderColor="gray.700" pb={2}>
                          <Text fontWeight="medium" color="gray.300">Creation Date</Text>
                          <Text color="white">April 4, 2025</Text>
                        </Flex>
                        
                        <Flex justify="space-between" borderBottom="1px" borderColor="gray.700" pb={2}>
                          <Text fontWeight="medium" color="gray.300">Traders Following</Text>
                          <Text color="white">1</Text>
                        </Flex>
                        
                        <Button 
                          variant="outline" 
                          mt={2}
                          borderColor="accent.500"
                          color="accent.400"
                          _hover={{ bg: 'rgba(25, 118, 210, 0.1)', borderColor: 'accent.400' }}
                          style={{ transition: 'all 0.2s ease' }}
                        >
                          Connect Real IBKR Account
                        </Button>
                      </VStack>
                    </Box>
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </MotionBox>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};


export default Portfolio;