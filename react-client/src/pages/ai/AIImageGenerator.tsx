import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
    Badge,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaArrowLeft, FaDownload, FaImage, FaMagic, FaSearch } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import aiImageService from '../../services/aiImageService';
import imageService from '../../services/imageService';
import { useTrip } from '../../hooks/useQueryHooks';
import { getImageUrl } from '../../utils/imageUtils';
import tripService from '../../services/tripService';

interface AIImage {
    id: string;
    url?: string;
    tripId: string;
    tripName: string;
    isAiGenerated: boolean;
    createdAt: string;
    aiPrompt?: string | null;
    aiStyle?: string;
}

interface AIQuota {
    total: number;
    used: number;
    remaining: number;
    resetDate: string;
}

interface Trip {
    id: string;
    name: string;
}

interface GenerateImageRequest {
    prompt: string;
    style: string;
    tripId?: string;
}

interface StyleOption {
    value: string;
    label: string;
}

interface SizeOption {
    value: string;
    label: string;
}

const AIImageGenerator: React.FC = () => {
    const { tripId } = useParams<{ tripId?: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const queryClient = useQueryClient();

    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.500', 'gray.400');
    const cardBg = useColorModeValue('white', 'gray.800');
    const inputBg = useColorModeValue('white', 'gray.700');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');
    const quotaBgSuccess = useColorModeValue('blue.50', 'blue.900');
    const quotaBgError = useColorModeValue('red.50', 'red.900');
    const noteBg = useColorModeValue('yellow.50', 'yellow.900');
    const noteTextColor = useColorModeValue('orange.800', 'orange.200');
    const overlayButtonBg = useColorModeValue('blackAlpha.700', 'whiteAlpha.700');
    const overlayButtonHoverBg = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');

    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('');
    const [size, setSize] = useState('512x512');
    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    
    const imageRefs = useRef<{[key: string]: HTMLImageElement | null}>({});
    const modalImageRef = useRef<HTMLImageElement | null>(null);
    
    const [currentImageObject, setCurrentImageObject] = useState<AIImage | null>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { data: trip, isLoading: tripLoading } = useTrip(tripId);

    const {
        data: quota,
        isLoading: quotaLoading
    } = useQuery<AIQuota>({
        queryKey: ['aiQuota'],
        queryFn: aiImageService.getQuota,
    });

    const {
        data: allAiImages = [],
        isLoading: aiImagesLoading
    } = useQuery<AIImage[]>({
        queryKey: ['allAiImages'],
        queryFn: async (): Promise<AIImage[]> => {
            const allTrips: Trip[] = await tripService.getTrips();

            const imagePromises = allTrips.map(trip =>
                imageService.getImages(trip.id).catch(() => [])
            );

            const allTripImages = (await Promise.all(imagePromises)).flat();

            return (allTripImages as AIImage[])
                .filter((img: AIImage) => img.isAiGenerated)
                .sort((a: AIImage, b: AIImage) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    });

    useEffect(() => {
        if (quota && allAiImages) {
            console.log("Quota info:", quota);
            console.log("Total AI images:", allAiImages.length);
            console.log("AI images dates:", allAiImages.map(img => ({ 
                date: new Date(img.createdAt).toLocaleDateString(), 
                prompt: img.aiPrompt?.substring(0, 20) 
            })));
        }
    }, [quota, allAiImages]);

    const generateImage = useMutation({
        mutationFn: (request: GenerateImageRequest) =>
            aiImageService.generateImage(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allAiImages'] });
            queryClient.invalidateQueries({ queryKey: ['aiQuota'] });

            setPrompt('');
            toast({
                title: 'Success',
                description: 'Image generated successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        },
        onError: (error) => {
            console.error('Failed to generate AI image:', error);
            toast({
                title: 'Error',
                description: 'Failed to generate AI image. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    });

    const styles: StyleOption[] = [
        { value: '', label: 'Default' },
        { value: 'realistic', label: 'Realistic' },
        { value: 'cartoon', label: 'Cartoon' },
        { value: 'painting', label: 'Painting' },
        { value: 'sketch', label: 'Sketch' },
        { value: 'fantasy', label: 'Fantasy' },
    ];

    const sizes: SizeOption[] = [
        { value: '512x512', label: '512 x 512' },
        { value: '768x768', label: '768 x 768' },
    ];

    const handleGenerateImage = async (): Promise<void> => {
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

        generateImage.mutate({
            prompt: prompt.trim(),
            style: style || 'default',
            tripId: tripId
        });
    };

    const getCorrectImageUrl = (image: AIImage): string => {
        if (image.url) {
            return getAIImageUrl(image.url);
        }
        return getImageUrl(image.id);
    };

    const handleViewImage = (image: AIImage): void => {
        setSelectedImage(getCorrectImageUrl(image));
        setCurrentImageObject(image);
        onOpen();
    };

    const handleDownloadImage = (image: AIImage, fileName: string, imageRef?: HTMLImageElement | null): void => {
        setIsDownloading(image.id);
        
        toast({
            id: 'download-toast',
            title: 'Preparing Download',
            description: 'Please wait a moment...',
            status: 'info',
            duration: null,
            isClosable: false,
            position: 'top'
        });

        if (imageRef && imageRef.complete && imageRef.naturalWidth > 0) {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = imageRef.naturalWidth;
                canvas.height = imageRef.naturalHeight;
                
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(imageRef, 0, 0);
                    
                    canvas.toBlob((blob) => {
                        if (blob) {
                            toast.close('download-toast');
                            
                            const blobUrl = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = blobUrl;
                            link.download = fileName || 'ai-image.png';
                            document.body.appendChild(link);
                            link.click();
                            
                            setTimeout(() => {
                                document.body.removeChild(link);
                                URL.revokeObjectURL(blobUrl);
                                
                                toast({
                                    title: 'Download Complete',
                                    status: 'success',
                                    duration: 2000,
                                    isClosable: true,
                                    position: 'bottom-right'
                                });
                                
                                setIsDownloading(null);
                            }, 100);
                            return;
                        } else {
                            console.log('Canvas blob creation failed, falling back to fetch method');
                            fetchAndDownload();
                        }
                    }, 'image/png', 0.95);
                } else {
                    fetchAndDownload();
                }
            } catch (canvasError) {
                console.error('Canvas method failed:', canvasError);
                fetchAndDownload();
            }
        } else {
            fetchAndDownload();
        }

        function fetchAndDownload(): void {
            const imageUrl = getCorrectImageUrl(image);
            
            fetch(imageUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    toast.close('download-toast');
                    
                    const blobUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = fileName || 'ai-image.png';
                    document.body.appendChild(link);
                    link.click();
                    
                    setTimeout(() => {
                        document.body.removeChild(link);
                        URL.revokeObjectURL(blobUrl);
                        
                        toast({
                            title: 'Download Complete',
                            status: 'success',
                            duration: 2000,
                            isClosable: true,
                            position: 'bottom-right'
                        });
                    }, 100);
                })
                .catch(error => {
                    console.error('Download error:', error);
                    
                    toast({
                        title: 'Download Failed',
                        description: 'Could not download the image. The server might be slow or unavailable.',
                        status: 'error',
                        duration: 4000,
                        isClosable: true,
                        position: 'top'
                    });
                })
                .finally(() => {
                    toast.close('download-toast');
                    setIsDownloading(null);
                });
        }
    };

    const handleBack = (): void => {
        if (tripId) {
            navigate(`/trips/${tripId}`);
        } else {
            navigate('/trips');
        }
    };

    const getPromptText = (image: AIImage): string => {
        return image.aiPrompt || 'AI generated image';
    };

    const isLoading = tripLoading || quotaLoading || aiImagesLoading;

    function getAIImageUrl(url: string): string {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7051';
        return `${API_URL}${url}`;
    }

    const handleModalDownload = (): void => {
        if (!selectedImage || !currentImageObject) return;
        handleDownloadImage(currentImageObject, 'ai-image-download.png', modalImageRef.current);
    };

    return (
        <Container maxW="container.xl" py={6}>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
                <Heading color={textColor}>AI Image Generator</Heading>
                <Button
                    leftIcon={<FaArrowLeft />}
                    onClick={handleBack}
                    variant="outline"
                    borderColor={borderColor}
                    color={textColor}
                    _hover={{ bg: hoverBg }}
                >
                    Back to {trip ? trip.name : 'Trips'}
                </Button>
            </Flex>

            {isLoading ? (
                <Flex justify="center" my={10}>
                    <Spinner size="xl" color="brand.500" />
                </Flex>
            ) : (
                <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
                    <Box
                        flex={1}
                        p={6}
                        bg={cardBg}
                        borderRadius="lg"
                        boxShadow="md"
                        borderWidth="1px"
                        borderColor={borderColor}
                    >
                        <VStack spacing={5} align="stretch">
                            <Heading size="md" color={textColor}>Create New AI Image</Heading>

                            {quotaLoading ? (
                                <Flex justify="center" py={3}>
                                    <Spinner color="brand.500" />
                                </Flex>
                            ) : quota ? (
                                <Box
                                    p={4}
                                    borderRadius="md"
                                    bg={quota.remaining > 0 ? quotaBgSuccess : quotaBgError}
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                >
                                    <Flex justify="space-between" mb={2}>
                                        <Text fontWeight="semibold" color={textColor}>AI Image Quota</Text>
                                        <Text color={textColor}>
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
                                        <Text fontSize="sm" color={textColor}>
                                            You have {quota.remaining} AI images remaining in your current quota.
                                        </Text>
                                    ) : (
                                        <Text fontSize="sm" color="red.500">
                                            You've reached your monthly quota. Quota resets on {new Date(quota.resetDate).toLocaleDateString()}.
                                        </Text>
                                    )}
                                    {quota.resetDate && (
                                        <Text fontSize="xs" mt={1} color={mutedTextColor}>
                                            Next quota reset: {new Date(quota.resetDate).toLocaleDateString()}
                                        </Text>
                                    )}
                                    {allAiImages.length > quota.used && (
                                        <Box mt={2} p={2} bg={noteBg} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                                            <Text fontSize="xs" color={noteTextColor}>
                                                <b>Note:</b> The gallery shows {allAiImages.length} AI images while your quota usage is {quota.used}. 
                                                The gallery includes all AI images you've ever created, while quota tracking may only count recent images.
                                            </Text>
                                        </Box>
                                    )}
                                </Box>
                            ) : null}

                            <FormControl isRequired>
                                <FormLabel color={textColor}>Image Description</FormLabel>
                                <Textarea
                                    placeholder="Describe the image you want to create..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    isDisabled={generateImage.isPending || (quota ? quota.remaining <= 0 : false)}
                                    rows={4}
                                    bg={inputBg}
                                    borderColor={borderColor}
                                    color={textColor}
                                    _placeholder={{ color: mutedTextColor }}
                                    _focus={{ 
                                        borderColor: 'brand.500',
                                        boxShadow: `0 0 0 1px var(--chakra-colors-brand-500)`
                                    }}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel color={textColor}>Style (Optional)</FormLabel>
                                <Select
                                    value={style}
                                    onChange={(e) => setStyle(e.target.value)}
                                    isDisabled={generateImage.isPending || (quota ? quota.remaining <= 0 : false)}
                                    bg={inputBg}
                                    borderColor={borderColor}
                                    color={textColor}
                                    _focus={{ 
                                        borderColor: 'brand.500',
                                        boxShadow: `0 0 0 1px var(--chakra-colors-brand-500)`
                                    }}
                                >
                                    {styles.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel color={textColor}>Size</FormLabel>
                                <Select
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    isDisabled={generateImage.isPending || (quota ? quota.remaining <= 0 : false)}
                                    bg={inputBg}
                                    borderColor={borderColor}
                                    color={textColor}
                                    _focus={{ 
                                        borderColor: 'brand.500',
                                        boxShadow: `0 0 0 1px var(--chakra-colors-brand-500)`
                                    }}
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
                                isLoading={generateImage.isPending}
                                loadingText="Generating..."
                                isDisabled={(quota && quota.remaining <= 0) || !prompt.trim()}
                                size="lg"
                                mt={2}
                            >
                                Generate Image
                            </Button>

                            {trip && (
                                <Text fontSize="sm" color={mutedTextColor} textAlign="center" mt={2}>
                                    Images will be added to your trip "{trip.name}".
                                </Text>
                            )}
                        </VStack>
                    </Box>

                    <Box
                        flex={1}
                        p={6}
                        bg={cardBg}
                        borderRadius="lg"
                        boxShadow="md"
                        borderWidth="1px"
                        borderColor={borderColor}
                    >
                        <Heading size="md" mb={4} color={textColor}>All Your AI Images</Heading>

                        {allAiImages.length === 0 ? (
                            <Flex
                                direction="column"
                                align="center"
                                justify="center"
                                py={12}
                                borderWidth={2}
                                borderStyle="dashed"
                                borderColor={borderColor}
                                borderRadius="md"
                            >
                                <Icon as={FaImage} boxSize={12} color={mutedTextColor} mb={4} />
                                <Text fontWeight="medium" color={textColor}>No AI images created yet</Text>
                                <Text color={mutedTextColor} fontSize="sm" mt={2}>
                                    Your AI generated images will appear here
                                </Text>
                            </Flex>
                        ) : (
                            <>
                                <Text fontSize="sm" color={mutedTextColor} mb={4}>
                                    Showing {allAiImages.length} AI-generated images from all your trips
                                </Text>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {allAiImages.map((image, index) => (
                                        <Box
                                            key={image.id}
                                            borderWidth="1px"
                                            borderRadius="md"
                                            overflow="hidden"
                                            position="relative"
                                            borderColor={borderColor}
                                            bg={cardBg}
                                            _hover={{ 
                                                transform: 'translateY(-2px)',
                                                boxShadow: 'lg',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Image
                                                ref={el => { imageRefs.current[image.id] = el; }}
                                                src={getCorrectImageUrl(image)}
                                                alt={getPromptText(image)}
                                                width="100%"
                                                height="180px"
                                                objectFit="cover"
                                                fallback={
                                                    <Box
                                                        width="100%"
                                                        height="180px"
                                                        bg={hoverBg}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                    >
                                                        <Text color={mutedTextColor}>Image loading error</Text>
                                                    </Box>
                                                }
                                            />

                                            <Flex
                                                position="absolute"
                                                top="2"
                                                right="2"
                                                gap="2"
                                            >
                                                <Button
                                                    size="sm"
                                                    borderRadius="full"
                                                    bg={overlayButtonBg}
                                                    color="white"
                                                    _hover={{ bg: overlayButtonHoverBg }}
                                                    p={1}
                                                    onClick={() => handleViewImage(image)}
                                                    isDisabled={isDownloading !== null}
                                                >
                                                    <Icon as={FaSearch} boxSize={3} />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    borderRadius="full"
                                                    bg={overlayButtonBg}
                                                    color="white"
                                                    _hover={{ bg: overlayButtonHoverBg }}
                                                    p={1}
                                                    onClick={() => handleDownloadImage(image, `ai-image-${index}.png`, imageRefs.current[image.id])}
                                                    isLoading={isDownloading === image.id}
                                                    isDisabled={isDownloading !== null}
                                                >
                                                    <Icon as={isDownloading === image.id ? undefined : FaDownload} boxSize={3} />
                                                </Button>
                                            </Flex>

                                            <Box p={3}>
                                                <Text
                                                    fontSize="sm"
                                                    noOfLines={2}
                                                    title={getPromptText(image)}
                                                    color={textColor}
                                                >
                                                    {getPromptText(image)}
                                                </Text>
                                                <Flex
                                                    justify="space-between"
                                                    fontSize="xs"
                                                    color={mutedTextColor}
                                                    mt={1}
                                                >
                                                    <Text>{new Date(image.createdAt).toLocaleString()}</Text>
                                                    {image.aiStyle && (
                                                        <Text fontStyle="italic">{image.aiStyle}</Text>
                                                    )}
                                                </Flex>
                                                <Flex justify="flex-start" mt={1}>
                                                    <Link
                                                        to={`/trips/${image.tripId}`}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        <Badge
                                                            colorScheme="brand"
                                                            variant="subtle"
                                                            fontSize="xs"
                                                            py={0.5}
                                                            px={2}
                                                            borderRadius="md"
                                                            _hover={{ bg: 'brand.100' }}
                                                            cursor="pointer"
                                                        >
                                                            {image.tripName}
                                                        </Badge>
                                                    </Link>
                                                </Flex>
                                            </Box>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                            </>
                        )}
                    </Box>
                </Flex>
            )}

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent bg={cardBg} borderColor={borderColor}>
                    <ModalHeader color={textColor}>Image Preview</ModalHeader>
                    <ModalCloseButton color={textColor} />
                    <ModalBody>
                        {selectedImage && (
                            <Image
                                ref={modalImageRef}
                                src={selectedImage}
                                alt="AI Generated"
                                width="100%"
                                borderRadius="md"
                                fallback={
                                    <Box
                                        width="100%"
                                        height="300px"
                                        bg={hoverBg}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Text color={mutedTextColor}>Failed to load image</Text>
                                    </Box>
                                }
                            />
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            colorScheme="gray" 
                            mr={3} 
                            onClick={onClose}
                            variant="outline"
                            borderColor={borderColor}
                            color={textColor}
                            _hover={{ bg: hoverBg }}
                        >
                            Close
                        </Button>
                        {selectedImage && currentImageObject && (
                            <Button
                                colorScheme="brand"
                                leftIcon={<FaDownload />}
                                onClick={handleModalDownload}
                                isLoading={isDownloading === currentImageObject.id}
                                isDisabled={isDownloading !== null}
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