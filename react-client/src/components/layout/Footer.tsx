import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import AppLogo from '../common/AppLogo';

interface ListHeaderProps {
  children: React.ReactNode;
}

const ListHeader: React.FC<ListHeaderProps> = ({ children }) => {
  return (
    <Text fontWeight="bold" fontSize="lg" mb={2}>
      {children}
    </Text>
  );
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const bg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bg}
      color={useColorModeValue('gray.700', 'gray.200')}
      borderTop="1px"
      borderColor={borderColor}
    >
      <Container as={Stack} maxW="6xl" py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align="flex-start">
            <AppLogo />
            <Text fontSize="sm" color="gray.500" mt={4}>
              Create, manage, and share your travel memories with ease.
            </Text>
          </Stack>

          <Stack align="flex-start">
            <ListHeader>Features</ListHeader>
            <Link as={RouterLink} to="#">Photo Management</Link>
            <Link as={RouterLink} to="#">AI Image Generation</Link>
            <Link as={RouterLink} to="#">Interactive Maps</Link>
            <Link as={RouterLink} to="#">Trip Sharing</Link>
          </Stack>

          <Stack align="flex-start">
            <ListHeader>Quick Links</ListHeader>
            <Link as={RouterLink} to="/">Home</Link>
            <Link as={RouterLink} to="/trips">My Trips</Link>
            <Link as={RouterLink} to="/trips/new">Create New Trip</Link>
          </Stack>

          <Stack align="flex-start">
            <ListHeader>Legal</ListHeader>
            <Link as={RouterLink} to="/terms">Terms of Service</Link>
            <Link as={RouterLink} to="/privacy">Privacy Policy</Link>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box
        borderTopWidth={1}
        borderColor={borderColor}
        py={4}
      >
        <Text pt={2} fontSize="sm" textAlign="center">
          &copy; {currentYear} TravelMemories. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
};

export default Footer;