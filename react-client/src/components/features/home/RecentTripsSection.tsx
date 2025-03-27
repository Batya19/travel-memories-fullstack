import React from 'react';
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
import { Trip } from '../../../types';
import LoadingSpinner from '../../common/feedback/LoadingSpinner';
import ImagePlaceholder from '../../common/media/ImagePlaceholder';

interface RecentTripsSectionProps {
    trips: Trip[];
    loading: boolean;
    error: string | null;
}

const RecentTripsSection: React.FC<RecentTripsSectionProps> = ({ trips, loading, error }) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
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
            ) : trips.length === 0 ? (
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
                    {trips.map((trip) => (
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
    );
};

export default RecentTripsSection;