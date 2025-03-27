import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    Flex,
    IconButton,
    Box,
    Text,
    Badge
} from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight, FaRobot, FaCalendarAlt } from 'react-icons/fa';
import { Image as ImageType } from '../../../../types';
import { getImageUrl } from '../../../../utils/imageUtils';
import { format } from 'date-fns';

// קומפוננטת המידע של התמונה
interface ImageDetailsProps {
    image: ImageType;
}

export const ImageDetails: React.FC<ImageDetailsProps> = ({ image }) => {
    return (
        <Box
            bg="blackAlpha.700"
            p={3}
            borderRadius="md"
            mt={2}
            color="white"
        >
            <Flex justify="space-between" align="center">
                <Text fontSize="md" fontWeight="medium">
                    {image.fileName}
                </Text>

                {image.isAiGenerated && (
                    <Badge colorScheme="purple" display="flex" alignItems="center" gap={1}>
                        <FaRobot /> AI Generated
                    </Badge>
                )}
            </Flex>

            {image.takenAt && (
                <Flex align="center" gap={1} mt={1}>
                    <FaCalendarAlt size="0.8em" />
                    <Text fontSize="sm">
                        Taken on {format(new Date(image.takenAt), 'MMMM d, yyyy')}
                    </Text>
                </Flex>
            )}

            {image.isAiGenerated && image.aiPrompt && (
                <Text fontSize="sm" mt={1}>
                    <strong>Prompt:</strong> {image.aiPrompt}
                </Text>
            )}
        </Box>
    );
};

interface ImageViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentImage: ImageType | null;
    onPrevImage?: () => void;      // תמיכה בשם הישן
    onNextImage?: () => void;      // תמיכה בשם הישן
    onPrevious?: () => void;       // תמיכה בשם החדש
    onNext?: () => void;           // תמיכה בשם החדש
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
    isOpen,
    onClose,
    currentImage,
    onPrevImage,
    onNextImage,
    onPrevious,
    onNext
}) => {
    // אחדות בין השמות הישנים והחדשים
    const handlePrevious = onPrevious || onPrevImage;
    const handleNext = onNext || onNextImage;

    if (!currentImage || !handlePrevious || !handleNext) return null;

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
                            handlePrevious();
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
                            handleNext();
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

                        <ImageDetails image={currentImage} />
                    </Box>
                </Flex>
            </ModalContent>
        </Modal>
    );
};

export default ImageViewerModal;