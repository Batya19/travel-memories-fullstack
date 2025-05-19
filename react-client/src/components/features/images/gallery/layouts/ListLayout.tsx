import React from 'react';
import { Box, Flex, Text, IconButton, VStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaTrash, FaCalendarAlt } from 'react-icons/fa';
import { Image as ImageType } from '../../../../../types';
import { format } from 'date-fns';
import ImageComponent from '../../../../common/media/ImageComponent';
import ImageBadge from '../../../../common/media/ImageBadge';

interface ListLayoutProps {
    images: ImageType[];
    spacing?: number;
    onImageClick?: (index: number) => void;
    onDeleteClick?: (imageId: string) => void;
}

export const ListLayout: React.FC<ListLayoutProps> = ({
    images,
    spacing = 4,
    onImageClick,
    onDeleteClick
}) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    const cardBorderColor = useColorModeValue('gray.200', 'gray.700');
    const metaTextColor = useColorModeValue('gray.500', 'gray.400');

    return (
        <VStack spacing={spacing} align="stretch">
            {images.map((image, index) => (
                <Flex
                    key={image.id}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={cardBorderColor}
                    overflow="hidden"
                    boxShadow="sm"
                    bg={cardBg}
                    transition="transform 0.2s"
                    _hover={{ transform: 'translateX(5px)' }}
                    cursor={onImageClick ? 'pointer' : 'default'}
                >
                    <Box width="120px" height="90px" flexShrink={0} position="relative">
                        <ImageComponent
                            image={image}
                            height="100%"
                            width="100%"
                            showBadge={false}
                            onClick={() => onImageClick && onImageClick(index)}
                        />
                    </Box>

                    <Flex flex="1" p={3} direction="column" justifyContent="center">
                        <Text fontWeight="medium" noOfLines={1}>
                            {image.fileName}
                        </Text>
                        <Flex fontSize="xs" color={metaTextColor} alignItems="center" mt={1}>
                            {image.takenAt && (
                                <Flex alignItems="center" mr={3}>
                                    <Icon as={FaCalendarAlt} size="0.8em" />
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
                            <Box mr={2}>
                                <ImageBadge badgePosition="inline" show={true} />
                            </Box>
                        )}

                        {onDeleteClick && (
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
            ))}
        </VStack>
    );
};

export default ListLayout;