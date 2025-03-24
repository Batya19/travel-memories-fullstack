import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Text,
    SimpleGrid,
    Card,
    CardBody,
    CardFooter,
    Image,
    Stack,
    HStack,
    Icon,
    Spinner,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaCalendarAlt, FaPlus, FaImages } from 'react-icons/fa';
import tripService from '../../services/tripService';
import imageService from '../../services/imageService';
import { Trip, Image as ImageType } from '../../types';
import { format } from 'date-fns';

interface TripWithCoverImage extends Trip {
    coverImage?: ImageType;
}

const TripsPage: React.FC = () => {
    const [trips, setTrips] = useState<TripWithCoverImage[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const borderColor = useColorModeValue('gray.200', 'gray.700');

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            try {
                const tripsData = await tripService.getTrips();

                // For each trip, try to get a cover image
                const tripsWithCoverImages = await Promise.all(
                    tripsData.map(async (trip) => {
                        try {
                            const images = await imageService.getImages(trip.id);
                            return {
                                ...trip,
                                coverImage: images.length > 0 ? images[0] : undefined,
                            };
                        } catch (error) {
                            console.error(`Error fetching images for trip ${trip.id}:`, error);
                            return trip;
                        }
                    })
                );

                setTrips(tripsWithCoverImages);
            } catch (error) {
                console.error('Error fetching trips:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    const handleCreateTrip = () => {
        navigate('/trips/new');
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="50vh">
                <Spinner size="xl" color="brand.500" />
            </Flex>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Flex
                direction={{ base: 'column', md: 'row' }}
                justify="space-between"
                align={{ base: 'start', md: 'center' }}
                mb={8}
            >
                <Heading as="h1" size="xl" mb={{ base: 4, md: 0 }}>
                    My Trips
                </Heading>
                <Button
                    leftIcon={<FaPlus />}
                    colorScheme="brand"
                    onClick={handleCreateTrip}
                    size={{ base: 'md', md: 'lg' }}
                >
                    Create New Trip
                </Button>
            </Flex>

            {trips.length === 0 ? (
                <Box
                    borderWidth={2}
                    borderRadius="lg"
                    borderColor="gray.200"
                    borderStyle="dashed"
                    p={12}
                    textAlign="center"
                >
                    <Icon as={FaMapMarkerAlt} boxSize={12} color="gray.300" mb={4} />
                    <Heading as="h3" size="md" mb={2}>No Trips Yet</Heading>
                    <Text mb={4}>Start by creating your first trip</Text>
                    <Button
                        leftIcon={<FaPlus />}
                        colorScheme="brand"
                        onClick={handleCreateTrip}
                    >
                        Create New Trip
                    </Button>
                </Box>
            ) : (
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                    {trips.map((trip) => (
                        <Card
                            key={trip.id}
                            overflow="hidden"
                            variant="outline"
                            borderColor={borderColor}
                            borderRadius="lg"
                            _hover={{
                                transform: 'translateY(-5px)',
                                boxShadow: 'lg',
                                borderColor: 'brand.300',
                            }}
                            transition="all 0.3s ease"
                            height="100%"
                        >
                            <Box height="200px" bg="gray.100" position="relative">
                                {trip.coverImage ? (
                                    <Image
                                        src={trip.coverImage.filePath}
                                        alt={trip.name}
                                        objectFit="cover"
                                        height="100%"
                                        width="100%"
                                    />
                                ) : (
                                    <Flex
                                        height="100%"
                                        align="center"
                                        justify="center"
                                        direction="column"
                                        p={4}
                                        color="gray.400"
                                    >
                                        <Icon as={FaImages} boxSize={10} mb={2} />
                                        <Text>No photos yet</Text>
                                    </Flex>
                                )}

                                {trip.locationName && (
                                    <HStack
                                        position="absolute"
                                        bottom={0}
                                        left={0}
                                        right={0}
                                        p={2}
                                        bg="blackAlpha.600"
                                        color="white"
                                        spacing={2}
                                    >
                                        <Icon as={FaMapMarkerAlt} />
                                        <Text fontSize="sm" noOfLines={1}>
                                            {trip.locationName}
                                        </Text>
                                    </HStack>
                                )}
                            </Box>

                            <CardBody>
                                <Stack spacing={2}>
                                    <Heading as="h3" size="md" noOfLines={1}>
                                        {trip.name}
                                    </Heading>

                                    <HStack>
                                        <Icon as={FaCalendarAlt} color="gray.500" />
                                        <Text fontSize="sm" color="gray.600">
                                            {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                                        </Text>
                                    </HStack>

                                    {trip.description && (
                                        <Text fontSize="sm" noOfLines={2} color="gray.600">
                                            {trip.description}
                                        </Text>
                                    )}
                                </Stack>
                            </CardBody>

                            <CardFooter pt={0}>
                                <Button
                                    as={RouterLink}
                                    to={`/trips/${trip.id}`}
                                    variant="solid"
                                    colorScheme="brand"
                                    width="100%"
                                >
                                    View Trip
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </SimpleGrid>
            )}
        </Container>
    );
};

export default TripsPage;