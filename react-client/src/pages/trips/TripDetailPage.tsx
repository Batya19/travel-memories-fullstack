import React, { useState, useRef, MutableRefObject } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Divider,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaCalendarAlt, FaMapMarkerAlt, FaImages, FaPlus, FaMagic } from 'react-icons/fa';
import { format } from 'date-fns';
import { useTrip, useTripImages, useDeleteTrip, useDeleteImage } from '../../hooks/useQueryHooks';
import { ImageFilters } from '../../components/features/trips/filters/ImageFilter';
import TripMap from '../../components/features/trips/map/TripMap';
import ImageFilter from '../../components/features/trips/filters/ImageFilter';
import Gallery from '../../components/features/images/gallery/Gallery';
import ImageUploader from '../../components/features/images/gallery/upload/ImageUploader';
import ShareTripButton from '../../components/features/trips/sharing/ShareTripButton';
import Card from '../../components/common/ui/Card';
import LoadingState from '../../components/common/feedback/LoadingState';
import { useToastNotification } from '../../hooks/useToastNotification';

const TripDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [filters, setFilters] = useState<ImageFilters>({
        searchTerm: '',
        sortBy: 'newest',
        filterType: 'all',
    });
    const navigate = useNavigate();
    const { showSuccess, showError } = useToastNotification();
    
    // React Query hooks
    const { 
        data: trip, 
        isLoading: tripLoading,
        error: tripError 
    } = useTrip(id);
    
    const { 
        data: images = [], 
        isLoading: imagesLoading,
        refetch: refetchImages
    } = useTripImages(id);
    
    const deleteTrip = useDeleteTrip();
    const deleteImage = useDeleteImage();

    // Modal controls
    const {
        isOpen: isUploadOpen,
        onOpen: onUploadOpen,
        onClose: onUploadClose
    } = useDisclosure();

    const {
        isOpen: isShareOpen,
        onClose: onShareClose
    } = useDisclosure();

    // Delete confirmation dialog
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose
    } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement | null>(null) as MutableRefObject<HTMLButtonElement>;

    // Filter and sort images
    const filteredImages = React.useMemo(() => {
        if (!images.length) return [];
        
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

        return result;
    }, [images, filters]);

    // Update filter state
    const handleFilterChange = (newFilters: ImageFilters) => {
        setFilters(newFilters);
    };

    // Delete trip
    const handleDelete = () => {
        if (!trip) return;

        deleteTrip.mutate(trip.id, {
            onSuccess: () => {
                showSuccess(
                    'Trip deleted',
                    `"${trip?.name}" has been deleted successfully.`
                );
                navigate('/trips');
            },
            onError: (error) => {
                console.error('Error deleting trip:', error);
                showError(
                    'Error',
                    'Failed to delete trip. Please try again.'
                );
            },
            onSettled: () => {
                onDeleteClose();
            }
        });
    };

    // Handle image upload completion
    const handleUploadComplete = async () => {
        onUploadClose();
        await refetchImages();
    };

    // Handle image deletion
    const handleImageDelete = (imageId: string) => {
        deleteImage.mutate(imageId, {
            onSuccess: () => {
                showSuccess(
                    'Image deleted',
                    'The image has been deleted successfully.'
                );
            },
            onError: (error) => {
                console.error('Error deleting image:', error);
                showError(
                    'Error',
                    'Failed to delete the image. Please try again.'
                );
            }
        });
    };

    // Calculate loading and error states
    const isLoading = tripLoading || imagesLoading;
    const error = tripError;
    
    // Check if there are any AI-generated images
    const hasAiImages = images.some(img => img.isAiGenerated);

    return (
        <Container maxW="container.xl" py={8}>
            <LoadingState isLoading={isLoading} loadingText="Loading trip details...">
                {error ? (
                    <Card p={6}>
                        <Heading as="h1" size="xl" mb={4}>Error Loading Trip</Heading>
                        <Text>We couldn't load the trip details. Please try again later.</Text>
                        <Button mt={4} onClick={() => navigate('/trips')}>Back to Trips</Button>
                    </Card>
                ) : !trip ? (
                    <Card p={6}>
                        <Heading as="h1" size="xl" mb={4}>Trip Not Found</Heading>
                        <Text>The trip you're looking for doesn't exist or you don't have permission to view it.</Text>
                        <Button mt={4} onClick={() => navigate('/trips')}>Back to Trips</Button>
                    </Card>
                ) : (
                    <>
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
                                    as={Link}
                                    to={`/trips/${trip.id}/ai-images`}
                                    leftIcon={<FaMagic />}
                                    variant="outline"
                                    colorScheme="purple"
                                    size={{ base: 'sm', md: 'md' }}
                                >
                                    AI Images
                                </Button>
                                <ShareTripButton trip={trip} />
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

                                    <LoadingState isLoading={imagesLoading} loadingText="Loading images...">
                                        {images.length === 0 ? (
                                            <Card
                                                borderWidth={2}
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
                                            </Card>
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

                                                <Gallery
                                                    images={filteredImages}
                                                    layout="grid"
                                                    onDelete={handleImageDelete}
                                                />
                                            </>
                                        )}
                                    </LoadingState>
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
                                        onUploadComplete={handleUploadComplete}
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
                                        {trip.shareUrl || `${window.location.origin}/trips/shared/${trip.shareId}`}
                                    </Box>
                                </ModalBody>
                                <ModalFooter>
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
                                        <Button 
                                            colorScheme="red" 
                                            onClick={handleDelete} 
                                            ml={3}
                                            isLoading={deleteTrip.isPending}
                                        >
                                            Delete
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialogOverlay>
                        </AlertDialog>
                    </>
                )}
            </LoadingState>
        </Container>
    );
};

export default TripDetailPage;