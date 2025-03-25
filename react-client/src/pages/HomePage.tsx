import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaPlus, FaImage } from 'react-icons/fa';
import { Trip } from '../types';
import tripService from '../services/tripService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ImagePlaceholder from '../components/common/ImagePlaceholder';

const HomePage: React.FC = () => {
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchRecentTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        const trips = await tripService.getTrips();
        // Sort trips by date (most recent first) and take only the first 4
        const sortedTrips = trips
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);
        setRecentTrips(sortedTrips);
      } catch (err) {
        console.error('Error fetching recent trips:', err);
        setError('Failed to load recent trips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTrips();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg={useColorModeValue('brand.500', 'brand.700')}
        color="white"
        py={16}
        px={4}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="6xl">
          <VStack spacing={6} textAlign="center" zIndex={2} position="relative">
            <Heading as="h1" size="2xl" fontWeight="bold">
              Document Your Journey, Preserve Your Memories
            </Heading>
            <Text fontSize="xl" maxW="xl" opacity={0.9}>
              TravelMemories helps you organize, manage, and share your travel experiences in one place.
            </Text>
            <Button
              as={RouterLink}
              to="/trips/new"
              size="lg"
              colorScheme="whiteAlpha"
              leftIcon={<FaPlus />}
              mt={4}
            >
              Create New Trip
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Recent Trips Section */}
      <Container maxW="6xl" py={12}>
        <Flex justify="space-between" align="center" mb={8}>
          <Heading as="h2" size="lg">
            Recent Trips
          </Heading>
          <Button
            as={RouterLink}
            to="/trips"
            variant="ghost"
            colorScheme="brand"
            size="sm"
          >
            View All
          </Button>
        </Flex>

        {loading ? (
          <LoadingSpinner text="Loading your recent trips..." />
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : recentTrips.length === 0 ? (
          <VStack spacing={4} p={8} textAlign="center" bg="gray.50" borderRadius="lg">
            <FaImage size={40} color="gray" />
            <Heading as="h3" size="md">
              No trips yet
            </Heading>
            <Text>Start by creating your first trip to document your adventures.</Text>
            <Button
              as={RouterLink}
              to="/trips/new"
              colorScheme="brand"
              leftIcon={<FaPlus />}
            >
              Create New Trip
            </Button>
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
            {recentTrips.map((trip) => (
              <Box
                key={trip.id}
                bg={cardBg}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                borderWidth="1px"
                borderColor={borderColor}
                transition="transform 0.2s"
                _hover={{ transform: 'translateY(-5px)' }}
              >
                <Box position="relative" height="180px">
                  <ImagePlaceholder
                    text="Travel Memories"
                    height="180px"
                  />
                </Box>
                <Stack p={4} spacing={2}>
                  <Heading as="h3" size="md" noOfLines={1}>
                    {trip.name}
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </Text>

                  {trip.locationName && (
                    <Flex align="center" color="gray.500" fontSize="sm">
                      <FaMapMarkerAlt />
                      <Text ml={1} noOfLines={1}>{trip.locationName}</Text>
                    </Flex>
                  )}

                  <Button
                    as={RouterLink}
                    to={`/trips/${trip.id}`}
                    size="sm"
                    colorScheme="brand"
                    variant="outline"
                    mt={2}
                  >
                    View Details
                  </Button>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>

      {/* Features Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={16}>
        <Container maxW="6xl">
          <VStack spacing={12}>
            <Heading as="h2" size="lg" textAlign="center">
              Features That Make Travel Documentation Easy
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              <FeatureCard
                title="Organize Your Photos"
                description="Upload and organize your travel photos in one place. Tag, sort, and filter them with ease."
                icon={<FaImage />}
              />
              <FeatureCard
                title="Interactive Maps"
                description="Pin your locations on interactive maps to visualize your journey and remember where each memory was made."
                icon={<FaMapMarkerAlt />}
              />
              <FeatureCard
                title="AI Image Generation"
                description="Enhance your travel stories with AI-generated images for moments you didn't capture."
                icon={<FaPlus />}
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

// Feature Card Component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <VStack
      p={6}
      bg={cardBg}
      borderRadius="lg"
      boxShadow="md"
      spacing={4}
      align="center"
      textAlign="center"
    >
      <Flex
        w="60px"
        h="60px"
        borderRadius="full"
        bg="brand.500"
        color="white"
        align="center"
        justify="center"
        fontSize="xl"
      >
        {icon}
      </Flex>
      <Heading as="h3" size="md">
        {title}
      </Heading>
      <Text color="gray.500">{description}</Text>
    </VStack>
  );
};

export default HomePage;