import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    HStack,
    Icon,
    Spinner,
    Divider,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaCalendarAlt, FaMapMarkerAlt, FaImages, FaArrowLeft } from 'react-icons/fa';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import tripService from '../../services/tripService';
import TripMap from '../../components/features/trips/map/TripMap';
import Gallery from '../../components/features/images/gallery/Gallery';

const SharedTripPage: React.FC = () => {
    const { shareId } = useParams<{ shareId: string }>();
    const navigate = useNavigate();
    const bgColor = useColorModeValue('white', 'gray.800');

    const { 
        data: trip, 
        isLoading, 
        error 
    } = useQuery({
        queryKey: ['sharedTrip', shareId],
        queryFn: () => tripService.getSharedTrip(shareId!),
        enabled: !!shareId,
    });

    // Compute images from trip data (in shared trip response, images are included)
    const images = trip?.images || [];

    if (isLoading) {
        return (
            <Flex justify="center" align="center" minH="50vh">
                <Spinner size="xl" color="brand.500" />
            </Flex>
        );
    }

    if (error || !trip) {
        return (
            <Container maxW="container.xl" py={8}>
                <Box
                    bg={bgColor}
                    p={8}
                    borderRadius="lg"
                    boxShadow="lg"
                    textAlign="center"
                >
                    <Heading as="h1" size="xl" mb={4}>Trip Not Found</Heading>
                    <Text mb={6}>
                        {error ? 
                            `Error: ${(error as Error).message}` : 
                            "The trip you're looking for doesn't exist or is no longer shared."}
                    </Text>
                    <Button
                        leftIcon={<FaArrowLeft />}
                        colorScheme="brand"
                        onClick={() => navigate('/')}
                    >
                        Back to Home
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Box
                bg={bgColor}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                mb={6}
                position="relative"
            >
                {/* "Shared Trip" badge */}
                <Box
                    position="absolute"
                    top={2}
                    right={2}
                    bg="brand.50"
                    color="brand.600"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight="bold"
                >
                    Shared Trip
                </Box>

                <Heading as="h1" size="xl">{trip.name}</Heading>
                <HStack mt={2} spacing={4}>
                    <HStack>
                        <Icon as={FaCalendarAlt} color="gray.500" />
                        <Text color="gray.600">
                            {format(new Date(trip.startDate), 'MMM d, yyyy')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                        </Text>
                    </HStack>
                    {trip.locationName && (
                        <HStack>
                            <Icon as={FaMapMarkerAlt} color="gray.500" />
                            <Text color="gray.600">{trip.locationName}</Text>
                        </HStack>
                    )}
                </HStack>

                {trip.description && (
                    <>
                        <Divider my={4} />
                        <Text>{trip.description}</Text>
                    </>
                )}
            </Box>

            {/* Tabs for different trip content */}
            <Tabs colorScheme="brand" isLazy>
                <TabList>
                    <Tab><HStack><Icon as={FaImages} /><Text>Photos</Text></HStack></Tab>
                    {(trip.latitude && trip.longitude) && (
                        <Tab><HStack><Icon as={FaMapMarkerAlt} /><Text>Map</Text></HStack></Tab>
                    )}
                </TabList>

                <TabPanels>
                    {/* Photos tab */}
                    <TabPanel px={0}>
                        {images.length === 0 ? (
                            <Box
                                borderWidth={2}
                                borderRadius="md"
                                borderColor="gray.200"
                                borderStyle="dashed"
                                p={12}
                                textAlign="center"
                            >
                                <Icon as={FaImages} boxSize={12} color="gray.300" mb={4} />
                                <Heading as="h3" size="md" mb={2}>No Photos</Heading>
                                <Text>This trip doesn't have any photos yet.</Text>
                            </Box>
                        ) : (
                            <Gallery
                                images={images}
                                layout="grid"
                                readonly={true}
                            />
                        )}
                    </TabPanel>

                    {/* Map tab */}
                    {(trip.latitude && trip.longitude) && (
                        <TabPanel px={0}>
                            <Box height="600px" borderRadius="md" overflow="hidden">
                                <TripMap
                                    latitude={trip.latitude}
                                    longitude={trip.longitude}
                                    locationName={trip.locationName || 'Trip Location'}
                                />
                            </Box>
                        </TabPanel>
                    )}
                </TabPanels>
            </Tabs>

            <Box
                textAlign="center"
                mt={8}
                p={4}
                borderTop="1px"
                borderColor="gray.200"
            >
                <Text fontSize="sm" color="gray.500">
                    This trip was shared via TravelMemories
                </Text>
            </Box>
        </Container>
    );
};

export default SharedTripPage;