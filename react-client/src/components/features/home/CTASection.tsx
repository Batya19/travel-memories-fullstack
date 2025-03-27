import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

const CTASection: React.FC = () => {
  const bgColor = useColorModeValue('brand.50', 'gray.800');
  const borderColor = useColorModeValue('brand.100', 'gray.700');

  return (
    <Box py={16} px={4}>
      <Container maxW="6xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          bg={bgColor}
          borderRadius="xl"
          overflow="hidden"
          boxShadow="lg"
          borderWidth="1px"
          borderColor={borderColor}
          position="relative"
        >
          {/* Background Image with Overlay */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            backgroundImage="url('/images/arizona.jpg')"
            backgroundSize="cover"
            backgroundPosition="center"
            opacity={0.1}
            zIndex={0}
          />

          {/* Content */}
          <Stack
            spacing={6}
            p={{ base: 8, md: 10 }}
            maxW={{ base: "100%", md: "60%" }}
            zIndex={1}
          >
            <Heading as="h2" size="xl" color="brand.600">
              Start Preserving Your Travel Memories Today
            </Heading>
            <Text fontSize="lg">
              Sign up for free and begin documenting your adventures. Create beautiful travel journals, organize your photos, and share your experiences with friends and family.
            </Text>
            <Stack 
              direction={{ base: 'column', sm: 'row' }}
              spacing={4}
            >
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                colorScheme="brand"
                fontWeight="bold"
                px={8}
              >
                Sign Up Free
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                size="lg"
                variant="outline"
                colorScheme="brand"
              >
                Sign In
              </Button>
            </Stack>
            <Text fontSize="sm" color="gray.500">
              No credit card required. Free account includes up to 100 photos and 10 trips.
            </Text>
          </Stack>

          {/* Image - Hidden on mobile */}
          <Box
            display={{ base: 'none', md: 'block' }}
            width={{ md: '40%' }}
            height={{ md: '400px' }}
            position="relative"
            overflow="hidden"
            zIndex={1}
          >
            <Box
              position="absolute"
              top={0}
              right={0}
              bottom={0}
              left={0}
              backgroundImage="url('/images/travel-background.jpg')"
              backgroundSize="cover"
              backgroundPosition="center"
              borderLeftWidth="1px"
              borderColor={borderColor}
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default CTASection;