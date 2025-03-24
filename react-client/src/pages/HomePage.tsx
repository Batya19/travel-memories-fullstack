import React from 'react';
import { Box, Heading, Text, Button, VStack, Container, Image, Flex, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box py={10}>
      <Container maxW="container.xl">
        {/* Hero Section */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          mb={16}
          gap={8}
        >
          <VStack spacing={6} align="flex-start" maxW="600px">
            <Heading as="h1" size="2xl">
              Welcome back, {currentUser?.firstName}!
            </Heading>
            <Text fontSize="xl" color="gray.600">
              Start documenting your travel memories with our easy-to-use platform.
            </Text>
            <Button
              as={RouterLink}
              to="/create-trip"
              colorScheme="brand"
              size="lg"
            >
              Create New Trip
            </Button>
          </VStack>
          <Image
            src="/hero-image.jpg"
            alt="Travel Memories"
            fallbackSrc="https://via.placeholder.com/500x300?text=Travel+Memories"
            maxW={{ base: "100%", md: "500px" }}
            borderRadius="lg"
            boxShadow="xl"
          />
        </Flex>

        {/* Recent Trips Section - Placeholder for now */}
        <Box mb={16}>
          <Heading as="h2" size="xl" mb={6}>
            Your Recent Trips
          </Heading>
          <Flex
            justify="center"
            align="center"
            bg={bg}
            p={10}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="md"
            minH="200px"
          >
            <VStack>
              <Text fontSize="lg" mb={4}>
                You haven't created any trips yet.
              </Text>
              <Button
                as={RouterLink}
                to="/create-trip"
                colorScheme="brand"
                variant="outline"
              >
                Create Your First Trip
              </Button>
            </VStack>
          </Flex>
        </Box>

        {/* Features Preview */}
        <Box>
          <Heading as="h2" size="xl" mb={6}>
            Discover TravelMemories Features
          </Heading>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap={6}
            justify="space-between"
          >
            {[
              {
                title: 'Photo Management',
                description: 'Upload and organize your travel photos with ease',
                icon: '📸'
              },
              {
                title: 'AI Image Generation',
                description: 'Create AI-generated images to complement your trips',
                icon: '🤖'
              },
              {
                title: 'Interactive Maps',
                description: 'Mark your travel locations on interactive maps',
                icon: '🗺️'
              }
            ].map((feature, index) => (
              <Box
                key={index}
                bg={bg}
                p={6}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                boxShadow="md"
                flex="1"
                textAlign="center"
              >
                <Text fontSize="4xl" mb={4}>{feature.icon}</Text>
                <Heading as="h3" size="md" mb={2}>
                  {feature.title}
                </Heading>
                <Text>{feature.description}</Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;