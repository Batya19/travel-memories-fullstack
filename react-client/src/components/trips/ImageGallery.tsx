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
} from '@chakra-ui/react';
import { FaTrash, FaArrowLeft, FaArrowRight, FaRobot, FaCalendarAlt } from 'react-icons/fa';
import { Image } from '../../types';
import imageService from '../../services/imageService';
import { format } from 'date-fns';

interface ImageGalleryProps {
    images: Image[];
    onDelete?: (imageId: string) => void;
    readonly?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    onDelete,
    readonly = false
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);
    const { isOpen: isViewerOpen, onOpen: openViewer, onClose: closeViewer } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure();
    const cancelRef = React.useRef<HTMLButtonElement>(null);
    const toast = useToast();

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

    return (
        <Box>
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
                {images.map((image, index) => (
                    <Box
                        key={image.id}
                        position="relative"
                        borderRadius="md"
                        overflow="hidden"
                        boxShadow="md"
                        transition="transform 0.2s"
                        _hover={{ transform: 'scale(1.02)' }}
                        cursor="pointer"
                        onClick={() => handleImageClick(index)}
                    >
                        <Box paddingBottom="100%" bg="gray.100" position="relative">
                            <ChakraImage
                                src={image.filePath}
                                alt={image.fileName}
                                position="absolute"
                                top={0}
                                left={0}
                                width="100%"
                                height="100%"
                                objectFit="cover"
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
                    <AlertDialogContent>
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