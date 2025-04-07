import { Box, Container, SimpleGrid, Stack, Text, Flex, Image, Link } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="neutral.900" color="white" as="footer">
      <Container maxW="1200px" py={10}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          <Stack spacing={6}>
            <Flex align="center">
              <Image src="/logo-white.svg" alt="FinTrade Logo" h="36px" mr={2} />
              <Box fontWeight="bold" fontSize="xl">FinTrade</Box>
            </Flex>
            <Text fontSize="sm" color="neutral.400">
              Built to help the next generation of investors copy confidently, trade freely, and build together.
            </Text>
          </Stack>
          
          <Stack spacing={4}>
            <Text fontWeight="semibold" fontSize="lg">Product</Text>
            <Link href="#">Features</Link>
            <Link href="#">Pricing</Link>
            <Link href="#">API</Link>
          </Stack>
          
          <Stack spacing={4}>
            <Text fontWeight="semibold" fontSize="lg">Company</Text>
            <Link href="#">About</Link>
            <Link href="#">Careers</Link>
            <Link href="#">Contact</Link>
          </Stack>
          
          <Stack spacing={4}>
            <Text fontWeight="semibold" fontSize="lg">Legal</Text>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Cookie Policy</Link>
          </Stack>
        </SimpleGrid>
        
        <Box borderTopWidth={1} borderColor="neutral.800" pt={8} mt={8}>
          <Text fontSize="sm" color="neutral.500">
            &copy; {new Date().getFullYear()} FinTrade. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;