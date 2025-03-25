import React, { useState, RefObject } from 'react';
import {
    Box,
    SimpleGrid,
    Image as ChakraImage,
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    Flex,
    Text,
    Badge,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    HStack,
    useColorModeValue, // הוספה לשימוש בערכי צבע
} from '@chakra-ui/react';
import { FaTrash, FaArrowLeft, FaArrowRight, FaRobot, FaCalendarAlt, FaThLarge, FaList } from 'react-icons/fa';
import { Image } from '../../types';
import imageService from '../../services/imageService';
import { format } from 'date-fns';

interface ImageGalleryProps {
    images: Image[];
    onDelete?: (imageId: string) => void;
    readonly?: boolean;
}

type ViewMode = 'grid' | 'list';

const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    onDelete,
    readonly = false
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const { isOpen: isViewerOpen, onOpen: openViewer, onClose: closeViewer } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure();
    const cancelRef = React.useRef<HTMLButtonElement>(null);
    const toast = useToast();

    // צבעים מותאמים למצב בהיר/כהה
    const cardBg = useColorModeValue('white', 'gray.800');
    const cardBorderColor = useColorModeValue('gray.200', 'gray.700');
    const imageBgColor = useColorModeValue('gray.100', 'gray.700');
    const metaTextColor = useColorModeValue('gray.500', 'gray.400');

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
        openViewer();
    };

    const navigateImages = (direction: 'prev' | 'next') => {
        if (currentImageIndex === null || images.length === 0) return;

        if (direction === 'prev') {
            setCurrentImageIndex(prevIndex =>
                prevIndex !== null ? (prevIndex === 0 ? images.length - 1 : prevIndex - 1) : 0
            );
        } else {
            setCurrentImageIndex(prevIndex =>
                prevIndex !== null ? (prevIndex === images.length - 1 ? 0 : prevIndex + 1) : 0
            );
        }
    };

    const confirmDelete = (imageId: string) => {
        setImageToDelete(imageId);
        openDelete();
    };

    const handleDelete = async () => {
        if (!imageToDelete) return;

        try {
            await imageService.deleteImage(imageToDelete);

            toast({
                title: 'Image deleted',
                description: 'The image has been deleted successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            if (onDelete) {
                onDelete(imageToDelete);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete the image. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            closeDelete();
            setImageToDelete(null);
        }
    };

    const currentImage = currentImageIndex !== null ? images[currentImageIndex] : null;

    const renderGridView = () => (
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
            {images.map((image, index) => (
                <Box
                    key={image.id}
                    position="relative"
                    borderRadius="md"
                    overflow="hidden"
                    boxShadow="md"
                    borderWidth="1px"
                    borderColor={cardBorderColor}
                    transition="transform 0.2s"
                    _hover={{ transform: 'scale(1.02)' }}
                    cursor="pointer"
                    onClick={() => handleImageClick(index)}
                    bg={cardBg}
                >
                    <Box paddingBottom="100%" bg={imageBgColor} position="relative">
                        <ChakraImage
                            src={image.filePath}
                            alt={image.fileName}
                            position="absolute"
                            top={0}
                            left={0}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                            loading="lazy"
                        />

                        {image.isAiGenerated && (
                            <Badge
                                position="absolute"
                                top={2}
                                left={2}
                                colorScheme="purple"
                                display="flex"
                                alignItems="center"
                                gap={1}
                            >
                                <FaRobot /> AI
                            </Badge>
                        )}

                        {!readonly && (
                            <IconButton
                                aria-label="Delete image"
                                icon={<FaTrash />}
                                size="sm"
                                colorScheme="red"
                                position="absolute"
                                top={2}
                                right={2}
                                opacity={0}
                                _groupHover={{ opacity: 1 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDelete(image.id);
                                }}
                            />
                        )}
                    </Box>
                </Box>
            ))}
        </SimpleGrid>
    );

    const renderListView = () => (
        <Box>
            {images.map((image, index) => (
                <Flex
                    key={image.id}
                    mb={4}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={cardBorderColor}
                    overflow="hidden"
                    boxShadow="sm"
                    bg={cardBg}
                    transition="transform 0.2s"
                    _hover={{ transform: 'translateX(5px)' }}
                    cursor="pointer"
                    onClick={() => handleImageClick(index)}
                >
                    <Box width="120px" height="90px" flexShrink={0} bg={imageBgColor}>
                        <ChakraImage
                            src={image.filePath}
                            alt={image.fileName}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                            loading="lazy"
                        />
                    </Box>
                    <Flex flex="1" p={3} direction="column" justifyContent="center">
                        <Text fontWeight="medium" noOfLines={1}>
                            {image.fileName}
                        </Text>
                        <Flex fontSize="xs" color={metaTextColor} alignItems="center" mt={1}>
                            {image.takenAt && (
                                <Flex alignItems="center" mr={3}>
                                    <FaCalendarAlt size="0.8em" />
                                    <Text ml={1}>
                                        {format(new Date(image.takenAt), 'yyyy-MM-dd')}
                                    </Text>
                                </Flex>
                            )}
                            <Text>{Math.round(image.fileSize / 1024)} KB</Text>
                        </Flex>
                    </Flex>
                    <Flex p={2} alignItems="center">
                        {image.isAiGenerated && (
                            <Badge
                                colorScheme="purple"
                                display="flex"
                                alignItems="center"
                                gap={1}
                                mr={2}
                            >
                                <FaRobot /> AI
                            </Badge>
                        )}

                        {!readonly && (
                            <IconButton
                                aria-label="Delete image"
                                icon={<FaTrash />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDelete(image.id);
                                }}
                            />
                        )}
                    </Flex>
                </Flex>
            ))}
        </Box>
    );

    return (
        <Box>
            {/* View toggle */}
            <Flex justifyContent="flex-end" mb={4}>
                <HStack spacing={2}>
                    <Text fontSize="sm" color={metaTextColor}>View:</Text>
                    <IconButton
                        aria-label="Grid view"
                        icon={<FaThLarge />}
                        size="sm"
                        colorScheme={viewMode === 'grid' ? 'brand' : 'gray'}
                        variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                        onClick={() => setViewMode('grid')}
                    />
                    <IconButton
                        aria-label="List view"
                        icon={<FaList />}
                        size="sm"
                        colorScheme={viewMode === 'list' ? 'brand' : 'gray'}
                        variant={viewMode === 'list' ? 'solid' : 'ghost'}
                        onClick={() => setViewMode('list')}
                    />
                </HStack>
            </Flex>

            {/* Gallery content based on view mode */}
            {viewMode === 'grid' ? renderGridView() : renderListView()}

            {/* Full-size image viewer modal */}
            <Modal isOpen={isViewerOpen} onClose={closeViewer} size="full" isCentered>
                <ModalOverlay bg="blackAlpha.900" />
                <ModalContent bg="transparent" boxShadow="none" maxW="100vw" maxH="100vh">
                    <ModalCloseButton color="white" zIndex={2} />

                    <Flex
                        justify="center"
                        align="center"
                        height="100vh"
                        position="relative"
                        onClick={closeViewer}
                    >
                        {/* Navigation buttons */}
                        <IconButton
                            aria-label="Previous image"
                            icon={<FaArrowLeft />}
                            position="absolute"
                            left={4}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigateImages('prev');
                            }}
                            colorScheme="whiteAlpha"
                            variant="ghost"
                            fontSize="2xl"
                            zIndex={1}
                        />

                        <IconButton
                            aria-label="Next image"
                            icon={<FaArrowRight />}
                            position="absolute"
                            right={4}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigateImages('next');
                            }}
                            colorScheme="whiteAlpha"
                            variant="ghost"
                            fontSize="2xl"
                            zIndex={1}
                        />

                        {/* Current image */}
                        {currentImage && (
                            <Box
                                maxW="90vw"
                                maxH="90vh"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ChakraImage
                                    src={currentImage.filePath}
                                    alt={currentImage.fileName}
                                    maxH="80vh"
                                    maxW="90vw"
                                    objectFit="contain"
                                    borderRadius="md"
                                />

                                {/* Image info */}
                                <Box
                                    bg="blackAlpha.700"
                                    p={3}
                                    borderRadius="md"
                                    mt={2}
                                    color="white"
                                >
                                    <Flex justify="space-between" align="center">
                                        <Text fontSize="md" fontWeight="medium">
                                            {currentImage.fileName}
                                        </Text>

                                        {currentImage.isAiGenerated && (
                                            <Badge colorScheme="purple" display="flex" alignItems="center" gap={1}>
                                                <FaRobot /> AI Generated
                                            </Badge>
                                        )}
                                    </Flex>

                                    {currentImage.takenAt && (
                                        <Flex align="center" gap={1} mt={1}>
                                            <FaCalendarAlt size="0.8em" />
                                            <Text fontSize="sm">
                                                Taken on {format(new Date(currentImage.takenAt), 'MMMM d, yyyy')}
                                            </Text>
                                        </Flex>
                                    )}

                                    {currentImage.isAiGenerated && currentImage.aiPrompt && (
                                        <Text fontSize="sm" mt={1}>
                                            <strong>Prompt:</strong> {currentImage.aiPrompt}
                                        </Text>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Flex>
                </ModalContent>
            </Modal>

            {/* Delete confirmation dialog */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef as RefObject<any>}
                onClose={closeDelete}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg={cardBg}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Image
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to delete this image? This action cannot be undone.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={closeDelete}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default ImageGallery;