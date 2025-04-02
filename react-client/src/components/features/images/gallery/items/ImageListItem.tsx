import React from 'react';
import { Box, Flex, Text, IconButton, Skeleton, useColorModeValue } from '@chakra-ui/react';
import { FaTrash, FaCalendarAlt } from 'react-icons/fa';
import { Image as ImageType } from '../../../../../types';
import { getImageUrl } from '../../../../../utils/imageUtils';
import { format } from 'date-fns';
import { ImageBadge } from '../components/ImageBadge';

interface ImageListItemProps {
    image: ImageType;
    isLoaded: boolean;
    onImageLoad: (imageId: string) => void;
    onImageClick: () => void;
    onDeleteClick: (imageId: string) => void;
    readonly?: boolean;
}

export const ImageListItem: React.FC<ImageListItemProps> = ({
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
    const metaTextColor = useColorModeValue('gray.500', 'gray.400');

    return (
        <Flex
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
            onClick={onImageClick}
        >
            <Box width="120px" height="90px" flexShrink={0} bg={imageBgColor} position="relative">
                {!isLoaded && (
                    <Skeleton
                        position="absolute"
                        top="0"
                        left="0"
                        width="100%"
                        height="100%"
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
                {/* שימוש ב-ImageBadge במקום מימוש ישיר */}
                {image.isAiGenerated && (
                    <Box mr={2}>
                        <ImageBadge isAiGenerated={image.isAiGenerated} position="inline" />
                    </Box>
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
                            onDeleteClick(image.id);
                        }}
                    />
                )}
            </Flex>
        </Flex>
    );
};

export default ImageListItem;