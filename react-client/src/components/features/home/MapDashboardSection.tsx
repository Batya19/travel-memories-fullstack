import React, { useMemo } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Badge,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaGlobeAmericas, FaCalendarAlt, FaImage } from 'react-icons/fa';
import { Trip, Image } from '../../../types';
import HomePageMap from '../trips/map/HomePageMap';

interface MapDashboardSectionProps {
  trips: Trip[];
  images: Image[];
  loading: boolean;
  error: string | null;
  user: {
    firstName: string;
    lastName: string;
  } | null;
}

const MapDashboardSection: React.FC<MapDashboardSectionProps> = ({ 
  trips, 
  images, 
  loading, 
  error, 
  user 
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const statsBg = useColorModeValue('brand.50', 'gray.700');

  // Calculate stats
  const stats = useMemo(() => {
    // Only include trips with coordinates for map count
    const tripsWithCoords = trips.filter(trip => trip.latitude && trip.longitude);
    
    // Calculate total duration of all trips in days
    const totalDays = trips.reduce((total, trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return total + days;
    }, 0);
    
    // Get unique countries/locations
    const uniqueLocations = new Set(
      trips
        .filter(trip => trip.locationName)
        .map(trip => trip.locationName)
    );

    return {
      totalTrips: trips.length,
      mappedTrips: tripsWithCoords.length,
      totalImages: images.length,
      totalDays,
      uniqueLocations: uniqueLocations.size,
      mostRecentTrip: trips.length > 0 ? trips[0] : null
    };
  }, [trips, images]);

  return (
    <Box py={8} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="6xl">
        <Flex
          direction="column"
          alignItems="center"
          mb={6}
        >
          {/* Welcome heading and subtext */}
          <Heading 
            as="h1" 
            size="xl" 
            mb={2}
            bgGradient="linear(to-r, brand.400, brand.600)"
            backgroundClip="text"
          >
            Welcome back, {user?.firstName || 'Traveler'}!
          </Heading>
          <Text fontSize="lg" color="gray.600" textAlign="center">
            Your travel memories are mapped and ready to explore
          </Text>
        </Flex>

        {/* Stats cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
          <Stat
            px={4}
            py={3}
            bg={cardBg}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <StatLabel fontSize="sm" color="gray.500">Total Trips</StatLabel>
            <Flex align="center">
              <Icon as={FaGlobeAmericas} color="brand.500" mr={2} />
              <StatNumber fontSize="2xl">{stats.totalTrips}</StatNumber>
            </Flex>
          </Stat>
          
          <Stat
            px={4}
            py={3}
            bg={cardBg}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <StatLabel fontSize="sm" color="gray.500">Days Traveled</StatLabel>
            <Flex align="center">
              <Icon as={FaCalendarAlt} color="brand.500" mr={2} />
              <StatNumber fontSize="2xl">{stats.totalDays}</StatNumber>
            </Flex>
          </Stat>
          
          <Stat
            px={4}
            py={3}
            bg={cardBg}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <StatLabel fontSize="sm" color="gray.500">Photos</StatLabel>
            <Flex align="center">
              <Icon as={FaImage} color="brand.500" mr={2} />
              <StatNumber fontSize="2xl">{stats.totalImages}</StatNumber>
            </Flex>
          </Stat>
          
          <Stat
            px={4}
            py={3}
            bg={cardBg}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <StatLabel fontSize="sm" color="gray.500">Places Visited</StatLabel>
            <Flex align="center">
              <Icon as={FaMapMarkerAlt} color="brand.500" mr={2} />
              <StatNumber fontSize="2xl">{stats.uniqueLocations}</StatNumber>
            </Flex>
          </Stat>
        </SimpleGrid>

        {/* Map container with nice styling */}
        <Box 
          bg={cardBg}
          borderRadius="xl"
          overflow="hidden"
          boxShadow="lg"
          borderWidth="1px"
          borderColor={borderColor}
          height="450px"
          position="relative"
          mb={4}
        >
          {error ? (
            <Flex height="100%" alignItems="center" justifyContent="center" p={4}>
              <Text color="red.500">{error}</Text>
            </Flex>
          ) : (
            <HomePageMap 
              trips={trips} 
              loading={loading}
              user={user}
            />
          )}
          
          {/* Map legend/indicator */}
          <Flex 
            position="absolute" 
            bottom={4} 
            right={4} 
            bg={statsBg} 
            p={2} 
            borderRadius="md"
            boxShadow="md"
            align="center"
            zIndex="1000"
          >
            <Icon as={FaMapMarkerAlt} mr={2} color="brand.500" />
            <Text fontSize="sm" fontWeight="medium">
              {stats.mappedTrips} of {stats.totalTrips} trips displayed
            </Text>
          </Flex>
        </Box>
        
        {/* Instructions */}
        <Text fontSize="sm" color="gray.500" textAlign="center">
          <Badge colorScheme="brand" mr={1}>Tip:</Badge>
          Hover over markers to see trip details, or click to view the full trip
        </Text>
      </Container>
    </Box>
  );
};

export default MapDashboardSection;