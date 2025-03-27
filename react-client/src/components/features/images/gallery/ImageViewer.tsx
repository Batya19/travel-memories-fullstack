import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    Flex,
    Box,
    Text,
    Badge,
    IconButton,
} from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight, FaRobot, FaCalendarAlt } from 'react-icons/fa';
import { Image as ImageType } from '../../../../types';
import { format } from 'date-fns';
import { getImageUrl } from '../../../../utils/imageUtils';

interface ImageViewerProps {
    isOpen: boolean;
    onClose: () => void;
    images: ImageType[];
    currentIndex: number | null;
    onIndexChange: (index: number) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
    isOpen,
    onClose,
    images,
    currentIndex,
    onIndexChange
}) => {
    if (!isOpen || currentIndex === null || images.length === 0) {
        return null;
    }

    const currentImage = images[currentIndex];

    const navigateImages = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
        } else {
            onIndexChange(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
            <ModalOverlay bg="blackAlpha.900" />
            <ModalContent bg="transparent" boxShadow="none" maxW="100vw" maxH="100vh">
                <ModalCloseButton color="white" zIndex={2} />

                <Flex
                    justify="center"
                    align="center"
                    height="100vh"
                    position="relative"
                    onClick={onClose}
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
                    <Box
                        maxW="90vw"
                        maxH="90vh"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Box
                            as="img"
                            src={getImageUrl(currentImage)}
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
                </Flex>
            </ModalContent>
        </Modal>
    );
};

export default ImageViewer;