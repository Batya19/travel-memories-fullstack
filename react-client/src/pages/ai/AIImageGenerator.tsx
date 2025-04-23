import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Icon,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Progress,
    Select,
    SimpleGrid,
    Spinner,
    Text,
    Textarea,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { FaArrowLeft, FaDownload, FaImage, FaMagic, FaSearch } from 'react-icons/fa';
import aiImageService, { AIImageResponse, AIQuotaResponse } from '../../services/aiImageService';
import tripService from '../../services/tripService';
import { Trip } from '../../types';
import { getAIImageUrl } from '../../utils/imageUtils';

const AIImageGenerator: React.FC = () => {
    const { tripId } = useParams<{ tripId?: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    // State for trip details
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(false);

    // State for quota
    const [quota, setQuota] = useState<AIQuotaResponse | null>(null);
    const [quotaLoading, setQuotaLoading] = useState(false);

    // State for image generation
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('');
    const [size, setSize] = useState('512x512');
    const [generating, setGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<AIImageResponse[]>([]);

    // Modal for image preview
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Styles for AI image generation
    const styles = [
        { value: '', label: 'Default' },
        { value: 'realistic', label: 'Realistic' },
        { value: 'cartoon', label: 'Cartoon' },
        { value: 'painting', label: 'Painting' },
        { value: 'sketch', label: 'Sketch' },
        { value: 'fantasy', label: 'Fantasy' },
    ];

    // Sizes for AI image generation
    const sizes = [
        { value: '512x512', label: '512 x 512' },
        { value: '768x768', label: '768 x 768' },
    ];

    // Load trip data if tripId is provided
    useEffect(() => {
        const fetchTripData = async () => {
            if (!tripId) return;

            try {
                setLoading(true);
                const tripData = await tripService.getTrip(tripId);
                setTrip(tripData);
            } catch (error) {
                console.error('Failed to load trip:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load trip details',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTripData();
    }, [tripId]);

    // Load quota information
    useEffect(() => {
        const fetchQuota = async () => {
            try {
                setQuotaLoading(true);
                const quota = await aiImageService.getQuota();
                setQuota(quota);
            } catch (error) {
                console.error('Failed to load quota:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load AI image quota information',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setQuotaLoading(false);
            }
        };

        fetchQuota();
    }, []);

    // Generate AI image
    const handleGenerateImage = async () => {
        if (!prompt.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a description for the image',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            setGenerating(true);

            const request = {
                prompt: prompt.trim(),
                style: style === '' ? 'default' : style,  // Never send undefined for required fields
                tripId: tripId || undefined
            };

            if (tripId && typeof tripId === 'string') {
                // בדיקה פשוטה שזה פורמט של GUID
                const isValidGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tripId);
                if (!isValidGuid) {
                    console.warn('Invalid tripId format:', tripId);
                }
            }
            console.log('Sending request to API:', request);

            const response = await aiImageService.generateImage(request);

            // Add to generated images
            setGeneratedImages(prev => [response, ...prev]);

            // Update quota
            if (quota) {
                setQuota({
                    ...quota,
                    used: quota.used + 1,
                    remaining: quota.remaining - 1
                });
            }

            toast({
                title: 'Success',
                description: 'Image generated successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Clear input
            setPrompt('');

        } catch (error) {
            console.error('Failed to generate AI image:', error);
            toast({
                title: 'Error',
                description: 'Failed to generate AI image. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setGenerating(false);
        }
    };

    // Convert relative URL to absolute URL
    const getFullImageUrl = (url: string) => {
        return getAIImageUrl(url);
    };

    // View image in modal
    const handleViewImage = (imageUrl: string) => {
        setSelectedImage(getFullImageUrl(imageUrl));
        onOpen();
    };

    // Download image
    const handleDownloadImage = (imageUrl: string, fileName: string) => {
        const fullUrl = getFullImageUrl(imageUrl);
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Navigate back
    const handleBack = () => {
        if (tripId) {
            navigate(`/trips/${tripId}`);
        } else {
            navigate('/trips');
        }
    };

    return (
        <Container maxW="container.xl" py={6}>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
                <Heading>AI Image Generator</Heading>
                <Button
                    leftIcon={<FaArrowLeft />}
                    onClick={handleBack}
                    variant="outline"
                >
                    Back to {trip ? trip.name : 'Trips'}
                </Button>
            </Flex>

            {loading ? (
                <Flex justify="center" my={10}>
                    <Spinner size="xl" />
                </Flex>
            ) : (
                <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
                    {/* Left Column - Image Generation Form */}
                    <Box
                        flex={1}
                        p={6}
                        bg="white"
                        borderRadius="lg"
                        boxShadow="md"
                    >
                        <VStack spacing={5} align="stretch">
                            <Heading size="md">Create New AI Image</Heading>

                            {/* Quota Information */}
                            {quotaLoading ? (
                                <Flex justify="center" py={3}>
                                    <Spinner />
                                </Flex>
                            ) : quota ? (
                                <Box
                                    p={4}
                                    borderRadius="md"
                                    bg={quota.remaining > 0 ? "blue.50" : "red.50"}
                                >
                                    <Flex justify="space-between" mb={2}>
                                        <Text fontWeight="semibold">AI Image Quota</Text>
                                        <Text>
                                            {quota.used} of {quota.total} used
                                        </Text>
                                    </Flex>
                                    <Progress
                                        value={(quota.used / quota.total) * 100}
                                        colorScheme={quota.remaining > 0 ? "blue" : "red"}
                                        size="sm"
                                        mb={2}
                                    />
                                    {quota.remaining > 0 ? (
                                        <Text fontSize="sm">
                                            You have {quota.remaining} AI images remaining this month.
                                        </Text>
                                    ) : (
                                        <Text fontSize="sm" color="red.500">
                                            You've reached your monthly quota. Quota resets on {new Date(quota.resetDate).toLocaleDateString()}.
                                        </Text>
                                    )}
                                </Box>
                            ) : null}

                            {/* Image Form */}
                            <FormControl isRequired>
                                <FormLabel>Image Description</FormLabel>
                                <Textarea
                                    placeholder="Describe the image you want to create..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    isDisabled={generating || (quota ? quota.remaining <= 0 : false)}
                                    rows={4}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Style (Optional)</FormLabel>
                                <Select
                                    value={style}
                                    onChange={(e) => setStyle(e.target.value)}
                                    isDisabled={generating || (quota ? quota.remaining <= 0 : false)}
                                >
                                    {styles.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Size</FormLabel>
                                <Select
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    isDisabled={generating || (quota ? quota.remaining <= 0 : false)}
                                >
                                    {sizes.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button
                                colorScheme="brand"
                                leftIcon={<FaMagic />}
                                onClick={handleGenerateImage}
                                isLoading={generating}
                                loadingText="Generating..."
                                isDisabled={(quota && quota.remaining <= 0) || !prompt.trim()}
                                size="lg"
                                mt={2}
                            >
                                Generate Image
                            </Button>

                            {trip && (
                                <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
                                    Images will be added to your trip "{trip.name}".
                                </Text>
                            )}
                        </VStack>
                    </Box>

                    {/* Right Column - Generated Images */}
                    <Box
                        flex={1}
                        p={6}
                        bg="white"
                        borderRadius="lg"
                        boxShadow="md"
                    >
                        <Heading size="md" mb={4}>Generated Images</Heading>

                        {generatedImages.length === 0 ? (
                            <Flex
                                direction="column"
                                align="center"
                                justify="center"
                                py={12}
                                borderWidth={2}
                                borderStyle="dashed"
                                borderColor="gray.200"
                                borderRadius="md"
                            >
                                <Icon as={FaImage} boxSize={12} color="gray.300" mb={4} />
                                <Text fontWeight="medium">No images generated yet</Text>
                                <Text color="gray.500" fontSize="sm" mt={2}>
                                    Your AI generated images will appear here
                                </Text>
                            </Flex>
                        ) : (
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                {generatedImages.map((image, index) => (
                                    <Box
                                        key={image.imageId || index}
                                        borderWidth="1px"
                                        borderRadius="md"
                                        overflow="hidden"
                                        position="relative"
                                    >
                                        <Image
                                            src={getFullImageUrl(image.url)}
                                            alt={image.prompt}
                                            width="100%"
                                            height="180px"
                                            objectFit="cover"
                                            fallback={
                                                <Box
                                                    width="100%"
                                                    height="180px"
                                                    bg="gray.100"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <Text color="gray.500">Image loading error</Text>
                                                </Box>
                                            }
                                        />

                                        {/* Image Actions */}
                                        <Flex
                                            position="absolute"
                                            top="2"
                                            right="2"
                                            gap="2"
                                        >
                                            <Button
                                                size="sm"
                                                borderRadius="full"
                                                bg="blackAlpha.700"
                                                color="white"
                                                _hover={{ bg: "blackAlpha.800" }}
                                                p={1}
                                                onClick={() => handleViewImage(image.url)}
                                            >
                                                <Icon as={FaSearch} boxSize={3} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                borderRadius="full"
                                                bg="blackAlpha.700"
                                                color="white"
                                                _hover={{ bg: "blackAlpha.800" }}
                                                p={1}
                                                onClick={() => handleDownloadImage(image.url, `ai-image-${index}.png`)}
                                            >
                                                <Icon as={FaDownload} boxSize={3} />
                                            </Button>
                                        </Flex>

                                        {/* Image Info */}
                                        <Box p={3}>
                                            <Text
                                                fontSize="sm"
                                                noOfLines={2}
                                                title={image.prompt}
                                            >
                                                {image.prompt}
                                            </Text>
                                            <Flex
                                                justify="space-between"
                                                fontSize="xs"
                                                color="gray.500"
                                                mt={1}
                                            >
                                                <Text>{new Date(image.createdAt).toLocaleString()}</Text>
                                                {image.style && (
                                                    <Text fontStyle="italic">{image.style}</Text>
                                                )}
                                            </Flex>
                                        </Box>
                                    </Box>
                                ))}
                            </SimpleGrid>
                        )}
                    </Box>
                </Flex>
            )}

            {/* Image Preview Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Image Preview</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedImage && (
                            <Image
                                src={selectedImage}
                                alt="AI Generated"
                                width="100%"
                                borderRadius="md"
                                fallback={
                                    <Box
                                        width="100%"
                                        height="300px"
                                        bg="gray.100"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Text color="gray.500">Failed to load image</Text>
                                    </Box>
                                }
                            />
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="gray" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        {selectedImage && (
                            <Button
                                colorScheme="brand"
                                leftIcon={<FaDownload />}
                                onClick={() => handleDownloadImage(selectedImage, 'ai-image-download.png')}
                            >
                                Download
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default AIImageGenerator;