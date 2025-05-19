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
    HStack,
    Icon,
    Spinner,
    useColorModeValue,
    Badge,
    Divider,
    VStack,
    Tag,
    TagLeftIcon,
    TagLabel,
    LinkBox,
    LinkOverlay,
} from '@chakra-ui/react';
import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaPlus,
    FaImages,
    FaCamera,
    FaClock,
    FaChevronRight,
    FaMountain,
    FaUmbrellaBeach,
    FaCity,
    FaTree,
    FaHiking
} from 'react-icons/fa';
import { format, differenceInDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import tripService from '../../services/tripService';
import imageService from '../../services/imageService';
import { getImageUrl } from '../../utils/imageUtils';

const TripsPage: React.FC = () => {
    const navigate = useNavigate();
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const cardBg = useColorModeValue('white', 'gray.800');
    const subtitleColor = useColorModeValue('gray.600', 'gray.400');
    const gradientOverlay = useColorModeValue(
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
        'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)'
    );
    const shadowHover = useColorModeValue(
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
    );

    const [tripImagesMap, setTripImagesMap] = useState<Record<string, any>>({});
    const [isImagesLoading, setIsImagesLoading] = useState(false);

    const {
        data: trips = [],
        isLoading: tripsLoading
    } = useQuery({
        queryKey: ['trips'],
        queryFn: tripService.getTrips
    });

    useEffect(() => {
        const fetchImages = async () => {
            if (!trips || trips.length === 0) return;

            setIsImagesLoading(true);
            const imageMap: Record<string, any> = {};

            try {
                const requests = trips.map(trip =>
                    imageService.getImages(trip.id)
                        .then(images => {
                            if (images && images.length > 0) {
                                imageMap[trip.id] = images[0];
                            }
                        })
                        .catch(err => {
                            console.error(`Error fetching images for trip ${trip.id}:`, err);
                        })
                );

                await Promise.all(requests);
                setTripImagesMap(imageMap);
            } catch (error) {
                console.error("Error fetching trip images:", error);
            } finally {
                setIsImagesLoading(false);
            }
        };

        fetchImages();
    }, [trips]);

    const getCoverImageUrl = (tripId: string) => {
        if (!tripImagesMap || !tripImagesMap[tripId]) {
            return null;
        }

        const coverImage = tripImagesMap[tripId];
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7051';

        if (coverImage.fileUrl) {
            if (coverImage.fileUrl.startsWith('/')) {
                const fullUrl = `${API_URL}${coverImage.fileUrl}`;
                return fullUrl;
            } else {
                return coverImage.fileUrl;
            }
        }

        if (coverImage.filePath) {
            const fullUrl = `${API_URL}/api/images/${coverImage.id}/content`;
            return fullUrl;
        }

        try {
            const url = getImageUrl(coverImage);

            if (url && url.startsWith('/')) {
                const fullUrl = `${API_URL}${url}`;
                return fullUrl;
            }

            return url;
        } catch (error) {
            if (coverImage && coverImage.id) {
                const fallbackUrl = `${API_URL}/api/images/${coverImage.id}/content`;
                return fallbackUrl;
            }

            return null;
        }
    };

    const getTripIcon = (locationName?: string) => {
        if (!locationName) return FaMapMarkerAlt;

        const location = locationName.toLowerCase();

        if (location.includes('beach') || location.includes('sea') || location.includes('ocean') || location.includes('coast')) {
            return FaUmbrellaBeach;
        }
        if (location.includes('mountain') || location.includes('hill') || location.includes('peak')) {
            return FaMountain;
        }
        if (location.includes('city') || location.includes('town') || location.includes('metropol')) {
            return FaCity;
        }
        if (location.includes('forest') || location.includes('park') || location.includes('garden')) {
            return FaTree;
        }
        if (location.includes('trek') || location.includes('trail') || location.includes('hiking')) {
            return FaHiking;
        }

        return FaMapMarkerAlt;
    };

    const getTripDuration = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return differenceInDays(end, start) + 1;
    };

    const handleCreateTrip = () => {
        navigate('/trips/new');
    };

    if (tripsLoading) {
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
                pb={6}
                borderBottom="1px solid"
                borderColor={borderColor}
            >
                <Box>
                    <Heading as="h1" size="xl" mb={2}>
                        My Trips
                    </Heading>
                    <Text color={subtitleColor}>
                        Your adventure collection - {trips.length} {trips.length === 1 ? 'trip' : 'trips'} and counting
                    </Text>
                </Box>
                <Button
                    leftIcon={<FaPlus />}
                    colorScheme="brand"
                    onClick={handleCreateTrip}
                    size={{ base: 'md', md: 'lg' }}
                    mt={{ base: 4, md: 0 }}
                    boxShadow="md"
                    _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg'
                    }}
                    transition="all 0.3s"
                >
                    Create New Trip
                </Button>
            </Flex>

            {trips.length === 0 ? (
                <Box
                    borderWidth={2}
                    borderRadius="xl"
                    borderColor="gray.200"
                    borderStyle="dashed"
                    p={12}
                    textAlign="center"
                    bg={useColorModeValue('gray.50', 'gray.900')}
                >
                    <VStack spacing={6}>
                        <Icon as={FaMapMarkerAlt} boxSize={16} color="brand.400" />
                        <Heading as="h3" size="lg" mb={2}>Your Journey Begins Here</Heading>
                        <Text fontSize="lg" maxW="lg" mx="auto" color={subtitleColor} mb={4}>
                            Start by creating your first trip and begin capturing your travel memories
                        </Text>
                        <Button
                            leftIcon={<FaPlus />}
                            colorScheme="brand"
                            onClick={handleCreateTrip}
                            size="lg"
                            px={8}
                            boxShadow="md"
                        >
                            Create First Trip
                        </Button>
                    </VStack>
                </Box>
            ) : (
                <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing={6}>
                    {trips.map((trip) => {
                        const coverImageUrl = getCoverImageUrl(trip.id);
                        const tripDuration = getTripDuration(trip.startDate, trip.endDate);
                        const TripIcon = getTripIcon(trip.locationName);

                        return (
                            <LinkBox
                                as={Card}
                                key={trip.id}
                                overflow="hidden"
                                borderRadius="lg"
                                bg={cardBg}
                                borderWidth="1px"
                                borderColor={borderColor}
                                transition="all 0.3s ease"
                                _hover={{
                                    transform: 'translateY(-8px)',
                                    boxShadow: shadowHover,
                                    borderColor: 'brand.300',
                                }}
                                height="100%"
                                position="relative"
                            >
                                <Badge
                                    position="absolute"
                                    top={3}
                                    right={3}
                                    zIndex={2}
                                    colorScheme="brand"
                                    borderRadius="full"
                                    boxShadow="md"
                                    px={3}
                                    py={1}
                                    display="flex"
                                    alignItems="center"
                                >
                                    <Icon as={FaClock} mr={1} />
                                    {tripDuration} {tripDuration === 1 ? 'day' : 'days'}
                                </Badge>

                                <Box position="relative" height="220px">
                                    {coverImageUrl ? (
                                        <>
                                            <Image
                                                src={coverImageUrl}
                                                alt={trip.name}
                                                objectFit="cover"
                                                height="100%"
                                                width="100%"
                                                transition="transform 0.5s"
                                                _groupHover={{ transform: 'scale(1.05)' }}
                                                fallback={
                                                    <Flex
                                                        height="100%"
                                                        align="center"
                                                        justify="center"
                                                        direction="column"
                                                        bg="gray.100"
                                                        p={4}
                                                        color="gray.400"
                                                    >
                                                        <Icon as={FaCamera} boxSize={10} mb={2} />
                                                        <Text>Error loading image</Text>
                                                    </Flex>
                                                }
                                            />
                                            <Box
                                                position="absolute"
                                                bottom={0}
                                                left={0}
                                                right={0}
                                                height="70%"
                                                bgGradient={gradientOverlay}
                                                zIndex={1}
                                            />

                                            <Flex
                                                position="absolute"
                                                bottom={0}
                                                left={0}
                                                right={0}
                                                direction="column"
                                                p={4}
                                                color="white"
                                                zIndex={2}
                                            >
                                                <Heading as="h3" size="md" noOfLines={1} mb={1}>
                                                    {trip.name}
                                                </Heading>

                                                {trip.locationName && (
                                                    <HStack spacing={1} fontSize="sm">
                                                        <Icon as={TripIcon} />
                                                        <Text noOfLines={1}>{trip.locationName}</Text>
                                                    </HStack>
                                                )}
                                            </Flex>
                                        </>
                                    ) : isImagesLoading ? (
                                        <Flex
                                            height="100%"
                                            align="center"
                                            justify="center"
                                            direction="column"
                                            bg="gray.100"
                                            p={4}
                                            color="gray.400"
                                        >
                                            <Spinner size="md" color="brand.500" mb={2} />
                                            <Text>Loading trip...</Text>
                                        </Flex>
                                    ) : (
                                        <Flex
                                            height="100%"
                                            align="center"
                                            justify="center"
                                            direction="column"
                                            bg={useColorModeValue('gray.100', 'gray.700')}
                                            p={4}
                                            color={useColorModeValue('gray.500', 'gray.400')}
                                        >
                                            <Icon as={FaImages} boxSize={10} mb={2} />
                                            <Text>Add photos to this trip</Text>
                                        </Flex>
                                    )}
                                </Box>

                                <CardBody pt={4} pb={2}>
                                    <VStack align="stretch" spacing={3}>
                                        <HStack>
                                            <Tag size="md" variant="subtle" colorScheme="gray">
                                                <TagLeftIcon as={FaCalendarAlt} />
                                                <TagLabel>
                                                    {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                                                </TagLabel>
                                            </Tag>
                                        </HStack>

                                        {trip.description ? (
                                            <Box>
                                                <Text
                                                    fontSize="sm"
                                                    noOfLines={2}
                                                    color={subtitleColor}
                                                >
                                                    {trip.description}
                                                </Text>
                                            </Box>
                                        ) : (
                                            <Box>
                                                <Text
                                                    fontSize="sm"
                                                    color="gray.400"
                                                    fontStyle="italic"
                                                >
                                                    No description added
                                                </Text>
                                            </Box>
                                        )}
                                    </VStack>
                                </CardBody>

                                <Divider />

                                <CardFooter pt={2} pb={3}>
                                    <LinkOverlay
                                        as={RouterLink}
                                        to={`/trips/${trip.id}`}
                                        width="100%"
                                    >
                                        <Button
                                            variant="ghost"
                                            colorScheme="brand"
                                            width="100%"
                                            rightIcon={<FaChevronRight />}
                                            justifyContent="space-between"
                                            fontWeight="normal"
                                            _hover={{
                                                bg: 'brand.50',
                                            }}
                                        >
                                            Explore Trip Details
                                        </Button>
                                    </LinkOverlay>
                                </CardFooter>
                            </LinkBox>
                        );
                    })}
                </SimpleGrid>
            )}
        </Container>
    );
};

export default TripsPage;