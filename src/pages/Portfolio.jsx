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
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.50">
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
                <StatLabel>Total Portfolio Value</StatLabel>
                <StatNumber>${portfolioData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
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
              <Heading size="md">Portfolio Performance</Heading>
              <HStack>
                <Button 
                  size="sm" 
                  variant={timeRange === '1w' ? 'solid' : 'ghost'} 
                  colorScheme="primary"
                  onClick={() => setTimeRange('1w')}
                >
                  1W
                </Button>
                <Button 
                  size="sm" 
                  variant={timeRange === '1m' ? 'solid' : 'ghost'} 
                  colorScheme="primary"
                  onClick={() => setTimeRange('1m')}
                >
                  1M
                </Button>
                <Button 
                  size="sm" 
                  variant={timeRange === '3m' ? 'solid' : 'ghost'} 
                  colorScheme="primary"
                  onClick={() => setTimeRange('3m')}
                >
                  3M
                </Button>
                <Button 
                  size="sm" 
                  variant={timeRange === 'all' ? 'solid' : 'ghost'} 
                  colorScheme="primary"
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#6b7280' }}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280' }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                    labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    contentStyle={{ backgroundColor: bgColor, borderColor }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0080ff" 
                    fill="#e6f7ff" 
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
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Tabs variant="enclosed" colorScheme="primary">
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
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Symbol</Th>
                          <Th>Shares</Th>
                          <Th>Avg Price</Th>
                          <Th>Current Price</Th>
                          <Th isNumeric>Value</Th>
                          <Th isNumeric>% of Portfolio</Th>
                          <Th isNumeric>Unrealized P&L</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {portfolioData.allocations.map((asset) => (
                          <Tr key={asset.symbol}>
                            <Td>
                              <Badge colorScheme={asset.symbol === 'CASH' ? 'gray' : 'primary'}>
                                {asset.symbol}
                              </Badge>
                            </Td>
                            <Td>{asset.shares ?? '-'}</Td>
                            <Td>${asset.avgPrice?.toFixed(2) ?? '-'}</Td>
                            <Td>${asset.currentPrice?.toFixed(2) ?? '-'}</Td>
                            <Td isNumeric>${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Td>
                            <Td isNumeric>{asset.percent.toFixed(2)}%</Td>
                            <Td isNumeric color={asset.unrealizedPL > 0 ? 'green.500' : asset.unrealizedPL < 0 ? 'red.500' : 'gray.500'}>
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
                    <Heading size="md">Trade History</Heading>
                    <HStack>
                      <Select size="sm" w="150px" placeholder="All Traders">
                        <option value="alex">Alex Morgan</option>
                      </Select>
                      <Select size="sm" w="120px" placeholder="All Actions">
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                      </Select>
                    </HStack>
                  </Flex>
                  
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Date</Th>
                          <Th>Action</Th>
                          <Th>Symbol</Th>
                          <Th isNumeric>Price</Th>
                          <Th isNumeric>Shares</Th>
                          <Th isNumeric>Value</Th>
                          <Th>Trader</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {tradeHistory.map((trade) => (
                          <Tr key={trade.id}>
                            <Td>{new Date(trade.date).toLocaleDateString()}</Td>
                            <Td>
                              <Badge colorScheme={trade.action === 'BUY' ? 'green' : 'red'}>
                                {trade.action}
                              </Badge>
                            </Td>
                            <Td>{trade.symbol}</Td>
                            <Td isNumeric>${trade.price.toFixed(2)}</Td>
                            <Td isNumeric>{trade.shares}</Td>
                            <Td isNumeric>${trade.value.toFixed(2)}</Td>
                            <Td>{trade.trader}</Td>
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
                      <Heading size="md" mb={4}>Portfolio Allocation</Heading>
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
                              fill="#0080ff"
                              label={({ symbol, percent }) => `${symbol} ${(percent * 100).toFixed(0)}%`}
                            >
                              {portfolioData.allocations.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.symbol === 'CASH' ? '#9ca3af' : `hsl(${index * 45}, 70%, 50%)`} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Value']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Heading size="md" mb={4}>Performance by Category</Heading>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={performanceByCategory}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `${value}%`} />
                            <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                            <Bar dataKey="value" fill="#0080ff" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Heading size="md" mb={4}>Daily P&L Changes</Heading>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={portfolioHistory.map((item, index, arr) => ({
                              date: item.date,
                              change: index === 0 ? 0 : ((item.value - arr[index - 1].value) / arr[index - 1].value) * 100
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                            <Tooltip 
                              formatter={(value) => [`${value.toFixed(2)}%`, 'Daily Change']}
                              labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="change" 
                              stroke="#10b981" 
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Heading size="md" mb={4}>Trade Activity</Heading>
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
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis />
                            <Tooltip 
                              formatter={(value) => [value, 'Trades']}
                              labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            />
                            <Bar dataKey="count" fill="#0080ff" />
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
                      <Heading size="md" mb={4}>Copy Trading Settings</Heading>
                      <VStack spacing={4} align="stretch" p={4} bg="gray.50" borderRadius="md">
                        <FormControl display="flex" alignItems="center" justifyContent="space-between">
                          <FormLabel htmlFor="auto-copy" mb={0}>
                            Automatic Copy Trading
                          </FormLabel>
                          <Switch id="auto-copy" colorScheme="primary" defaultChecked />
                        </FormControl>
                        
                        <FormControl display="flex" alignItems="center" justifyContent="space-between">
                          <FormLabel htmlFor="trade-alerts" mb={0}>
                            Trade Alerts
                          </FormLabel>
                          <Switch id="trade-alerts" colorScheme="primary" defaultChecked />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Maximum Position Size</FormLabel>
                          <Select defaultValue="10">
                            <option value="5">5% of portfolio</option>
                            <option value="10">10% of portfolio</option>
                            <option value="15">15% of portfolio</option>
                            <option value="20">20% of portfolio</option>
                          </Select>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Copy Size</FormLabel>
                          <Select defaultValue="100">
                            <option value="25">25% of trader's position</option>
                            <option value="50">50% of trader's position</option>
                            <option value="75">75% of trader's position</option>
                            <option value="100">100% of trader's position</option>
                          </Select>
                        </FormControl>
                        
                        <Button colorScheme="primary" mt={2}>
                          Save Settings
                        </Button>
                      </VStack>
                    </Box>
                    
                    <Box>
                      <Heading size="md" mb={4}>Account Information</Heading>
                      <VStack spacing={4} align="stretch" p={4} bg="gray.50" borderRadius="md">
                        <Flex justify="space-between">
                          <Text fontWeight="medium">Account Type</Text>
                          <Badge colorScheme="green">Demo Account</Badge>
                        </Flex>
                        
                        <Flex justify="space-between">
                          <Text fontWeight="medium">Account Balance</Text>
                          <Text>${portfolioData.totalValue.toFixed(2)}</Text>
                        </Flex>
                        
                        <Flex justify="space-between">
                          <Text fontWeight="medium">Creation Date</Text>
                          <Text>April 4, 2025</Text>
                        </Flex>
                        
                        <Flex justify="space-between">
                          <Text fontWeight="medium">Traders Following</Text>
                          <Text>1</Text>
                        </Flex>
                        
                        <Button colorScheme="blue" variant="outline" mt={2}>
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