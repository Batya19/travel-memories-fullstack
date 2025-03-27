import React from 'react';
import { Box, Badge, IconButton, AspectRatio, Skeleton, useColorModeValue } from '@chakra-ui/react';
import { FaTrash, FaRobot } from 'react-icons/fa';
import { Image as ImageType } from '../../../../types';
import { getImageUrl } from '../../../../utils/imageUtils';

interface ImageGridItemProps {
    image: ImageType;
    isLoaded: boolean;
    onImageLoad: (imageId: string) => void;
    onImageClick: () => void;
    onDeleteClick: (imageId: string) => void;
    readonly?: boolean;
}

export const ImageGridItem: React.FC<ImageGridItemProps> = ({
    image,
    isLoaded,
    onImageLoad,
    onImageClick,
    onDeleteClick,
    readonly = false
}) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    const cardBorderColor = useColorModeValue('gray.200', 'gray.700');
    const imageBgColor = useColorModeValue('gray.100', 'gray.700');

    return (
        <Box
            position="relative"
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
            borderWidth="1px"
            borderColor={cardBorderColor}
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.02)' }}
            cursor="pointer"
            onClick={onImageClick}
            bg={cardBg}
        >
            <AspectRatio ratio={1}>
                <Box position="relative" bg={imageBgColor}>
                    {!isLoaded && (
                        <Skeleton
                            position="absolute"
                            top="0"
                            left="0"
                            width="100%"
                            height="100%"
                            startColor={useColorModeValue('gray.100', 'gray.700')}
                            endColor={useColorModeValue('gray.300', 'gray.600')}
                        />
                    )}
                    <Box
                        as="img"
                        src={getImageUrl(image)}
                        alt={image.fileName}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        loading="lazy"
                        onLoad={() => onImageLoad(image.id)}
                        style={{ opacity: isLoaded ? 1 : 0 }}
                        transition="opacity 0.3s ease-in-out"
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
                            zIndex={1}
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
                            _hover={{ opacity: 1 }}
                            zIndex={1}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClick(image.id);
                            }}
                        />
                    )}
                </Box>
            </AspectRatio>
        </Box>
    );
};