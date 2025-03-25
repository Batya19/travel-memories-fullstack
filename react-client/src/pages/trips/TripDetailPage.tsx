import React, { useEffect, useState } from 'react';
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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Spinner,
    Divider,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useToast,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaShare, FaCalendarAlt, FaMapMarkerAlt, FaImages, FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import tripService from '../../services/tripService';
import imageService from '../../services/imageService';
import { Trip, Image } from '../../types';
import ImageUploader from '../../components/trips/ImageUploader';
import ImageGallery from '../../components/trips/ImageGallery';
import TripMap from '../../components/trips/TripMap';
import ImageFilter, { ImageFilters } from '../../components/trips/ImageFilter';

const TripDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [images, setImages] = useState<Image[]>([]);
    const [filteredImages, setFilteredImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState(true);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [filters, setFilters] = useState<ImageFilters>({
        searchTerm: '',
        sortBy: 'newest',
        filterType: 'all',
    });
    
    const navigate = useNavigate();
    const toast = useToast();

    // Modal controls
    const {
        isOpen: isUploadOpen,
        onOpen: onUploadOpen,
        onClose: onUploadClose
    } = useDisclosure();

    const {
        isOpen: isShareOpen,
        onOpen: onShareOpen,
        onClose: onShareClose
    } = useDisclosure();

    // Delete confirmation dialog
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose
    } = useDisclosure();
    const cancelRef = React.useRef<HTMLButtonElement>(null!) as React.RefObject<HTMLButtonElement>;

    // Fetch trip details and images
    const fetchTripData = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const tripData = await tripService.getTrip(id);
            setTrip(tripData);

            const imagesData = await imageService.getImages(id);
            setImages(imagesData);
            
            // Initially, filtered images are the same as all images
            setFilteredImages(imagesData);
        } catch (error) {
            console.error('Error fetching trip data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load trip details. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTripData();
    }, [id]);

    // Filter and sort images whenever images array or filters change
    useEffect(() => {
        let result = [...images];
        
        // Apply search filter
        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            result = result.filter(img => 
                img.fileName.toLowerCase().includes(term)
            );
        }
        
        // Apply type filter
        if (filters.filterType === 'ai') {
            result = result.filter(img => img.isAiGenerated);
        } else if (filters.filterType === 'regular') {
            result = result.filter(img => !img.isAiGenerated);
        }
        
        // Apply sorting
        result = result.sort((a, b) => {
            switch (filters.sortBy) {
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'name':
                    return a.fileName.localeCompare(b.fileName);
                case 'size':
                    return b.fileSize - a.fileSize;
                default:
                    return 0;
            }
        });
        
        setFilteredImages(result);
    }, [images, filters]);

    // Update filter state
    const handleFilterChange = (newFilters: ImageFilters) => {
        setFilters(newFilters);
    };

    // Share trip
    const handleShare = async () => {
        if (!trip) return;

        try {
            const response = await tripService.generateShareLink(trip.id);
            const shareId = response.shareId;

            // Construct the shareable URL
            const baseUrl = window.location.origin;
            const shareableUrl = `${baseUrl}/trips/shared/${shareId}`;

            setShareUrl(shareableUrl);
            onShareOpen();
        } catch (error) {
            console.error('Error generating share link:', error);
            toast({
                title: 'Error',
                description: 'Failed to generate share link. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Copy share URL to clipboard
    const copyShareUrl = () => {
        if (!shareUrl) return;

        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                toast({
                    title: 'Copied!',
                    description: 'Share link copied to clipboard.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                toast({
                    title: 'Error',
                    description: 'Failed to copy link. Please try again.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            });
    };

    // Delete trip
    const handleDelete = async () => {
        if (!trip) return;

        try {
            await tripService.deleteTrip(trip.id);
            toast({
                title: 'Trip deleted',
                description: `"${trip.name}" has been deleted successfully.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            navigate('/trips');
        } catch (error) {
            console.error('Error deleting trip:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete trip. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            onDeleteClose();
        }
    };

    // Check if there are any AI-generated images
    const hasAiImages = images.some(img => img.isAiGenerated);

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="50vh">
                <Spinner size="xl" color="brand.500" />
            </Flex>
        );
    }

    if (!trip) {
        return (
            <Container maxW="container.xl" py={8}>
                <Heading as="h1" size="xl" mb={4}>Trip Not Found</Heading>
                <Text>The trip you're looking for doesn't exist or you don't have permission to view it.</Text>
                <Button mt={4} onClick={() => navigate('/trips')}>Back to Trips</Button>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            {/* Trip header */}
            <Flex
                direction={{ base: 'column', md: 'row' }}
                justify="space-between"
                align={{ base: 'start', md: 'center' }}
                mb={6}
            >
                <Box>
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
                </Box>

                <HStack mt={{ base: 4, md: 0 }} spacing={3}>
                    <Button
                        leftIcon={<FaShare />}
                        variant="outline"
                        onClick={handleShare}
                        size={{ base: 'sm', md: 'md' }}
                    >
                        Share
                    </Button>
                    <Button
                        leftIcon={<FaEdit />}
                        variant="outline"
                        onClick={() => navigate(`/trips/${trip.id}/edit`)}
                        size={{ base: 'sm', md: 'md' }}
                    >
                        Edit
                    </Button>
                    <Button
                        leftIcon={<FaTrash />}
                        colorScheme="red"
                        variant="outline"
                        onClick={onDeleteOpen}
                        size={{ base: 'sm', md: 'md' }}
                    >
                        Delete
                    </Button>
                </HStack>
            </Flex>

            {/* Trip description */}
            {trip.description && (
                <Box mb={6}>
                    <Text>{trip.description}</Text>
                </Box>
            )}

            <Divider mb={6} />

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
                        <Flex justify="space-between" align="center" mb={4}>
                            <Heading as="h2" size="lg">Photos</Heading>
                            <Button
                                leftIcon={<FaPlus />}
                                colorScheme="brand"
                                onClick={onUploadOpen}
                            >
                                Add Photos
                            </Button>
                        </Flex>

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
                                <Heading as="h3" size="md" mb={2}>No Photos Yet</Heading>
                                <Text mb={4}>Start by adding photos to your trip</Text>
                                <Button
                                    leftIcon={<FaPlus />}
                                    colorScheme="brand"
                                    onClick={onUploadOpen}
                                >
                                    Add Photos
                                </Button>
                            </Box>
                        ) : (
                            <>
                                {/* Add ImageFilter component */}
                                <ImageFilter 
                                    onFilterChange={handleFilterChange} 
                                    hasAiImages={hasAiImages} 
                                />
                                
                                {/* Display count of filtered images */}
                                <Text fontSize="sm" color="gray.500" mb={4}>
                                    Showing {filteredImages.length} of {images.length} images
                                </Text>
                                
                                <ImageGallery
                                    images={filteredImages}
                                    onDelete={(imageId) => {
                                        // Update the state to remove the deleted image
                                        setImages(current => current.filter(img => img.id !== imageId));
                                    }}
                                />
                            </>
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

            {/* Upload images modal */}
            <Modal isOpen={isUploadOpen} onClose={onUploadClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload Photos</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <ImageUploader
                            tripId={trip.id}
                            onUploadComplete={() => {
                                fetchTripData(); // Refresh images after upload
                                onUploadClose();
                            }}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Share trip modal */}
            <Modal isOpen={isShareOpen} onClose={onShareClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Share Your Trip</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb={4}>
                            Share this link with friends and family to let them view your trip:
                        </Text>
                        <Box
                            p={3}
                            borderWidth={1}
                            borderRadius="md"
                            fontFamily="mono"
                            fontSize="sm"
                            bg="gray.50"
                            wordBreak="break-all"
                        >
                            {shareUrl}
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="brand" mr={3} onClick={copyShareUrl}>
                            Copy Link
                        </Button>
                        <Button variant="ghost" onClick={onShareClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete confirmation dialog */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Trip
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to delete "{trip.name}"? This action cannot be undone.
                            All photos associated with this trip will also be deleted.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Container>
    );
};

export default TripDetailPage;