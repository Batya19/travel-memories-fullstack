import React from 'react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import { Image as ImageType } from '../../../../../types';
import ImageComponent from '../../../../common/media/ImageComponent';

interface HighlightedLayoutProps {
    images: ImageType[];
    columns: number;
    spacing?: number;
    onImageClick?: (index: number) => void;
}

export const HighlightedLayout: React.FC<HighlightedLayoutProps> = ({
    images,
    columns = 3,
    spacing = 4,
    onImageClick,
}) => {
    if (images.length === 0) return null;

    return (
        <Box>
            <Box mb={spacing}>
                <ImageComponent
                    image={images[0]}
                    aspectRatio={16 / 9}
                    onClick={() => onImageClick && onImageClick(0)}
                    boxShadow="lg"
                    borderRadius="md"
                    overflow="hidden"
                    transition="transform 0.2s"
                    _hover={{ transform: 'scale(1.01)' }}
                />
            </Box>

            {images.length > 1 && (
                <SimpleGrid columns={columns} spacing={spacing}>
                    {images.slice(1).map((image, idx) => (
                        <ImageComponent
                            key={image.id}
                            image={image}
                            aspectRatio={1}
                            onClick={() => onImageClick && onImageClick(idx + 1)}
                            boxShadow="md"
                            borderRadius="md"
                            overflow="hidden"
                            transition="transform 0.2s"
                            _hover={{ transform: 'scale(1.05)' }}
                        />
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
};

export default HighlightedLayout;