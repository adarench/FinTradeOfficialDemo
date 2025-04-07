import { Box, Container, SimpleGrid, Stack, Text, Flex, Image, Link } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="gray.900" color="white" as="footer" borderTop="1px solid" borderColor="gray.800">
      <Container maxW="1200px" py={10}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          <Stack spacing={6}>
            <Flex align="center">
              <Image src="/logo-white.svg" alt="FinTrade Logo" h="36px" mr={2} />
              <Box fontWeight="bold" fontSize="xl">FinTrade</Box>
            </Flex>
            <Text fontSize="sm" color="gray.400">
              FinTrade: Built to help the next generation of investors copy confidently, trade freely, and build together.
            </Text>
          </Stack>
          
          <Stack spacing={4}>
            <Text fontWeight="semibold" fontSize="lg" color="white">Product</Text>
            <Link href="#" color="gray.400" _hover={{ color: 'accent.400', textDecoration: 'none' }}>Features</Link>
            <Link href="#" color="gray.400" _hover={{ color: 'accent.400', textDecoration: 'none' }}>Pricing</Link>
            <Link href="#" color="gray.400" _hover={{ color: 'accent.400', textDecoration: 'none' }}>API</Link>
          </Stack>
          
          <Stack spacing={4}>
            <Text fontWeight="semibold" fontSize="lg" color="white">Company</Text>
            <Link href="#" color="gray.400" _hover={{ color: 'accent.400', textDecoration: 'none' }}>About</Link>
            <Link href="#" color="gray.400" _hover={{ color: 'accent.400', textDecoration: 'none' }}>Careers</Link>
            <Link href="#" color="gray.400" _hover={{ color: 'accent.400', textDecoration: 'none' }}>Contact</Link>
          </Stack>
          
          <Stack spacing={4}>
            <Text fontWeight="semibold" fontSize="lg" color="white">Legal</Text>
            <Link href="#" color="gray.400" _hover={{ color: 'accent.400', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="#" color="gray.400" _hover={{ color: 'accent.400', textDecoration: 'none' }}>Terms of Service</Link>
            <Link href="#" color="gray.400" _hover={{ color: 'accent.400', textDecoration: 'none' }}>Cookie Policy</Link>
          </Stack>
        </SimpleGrid>
        
        <Box borderTopWidth={1} borderColor="gray.800" pt={8} mt={8}>
          <Text fontSize="sm" color="gray.500">
            &copy; {new Date().getFullYear()} FinTrade. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;