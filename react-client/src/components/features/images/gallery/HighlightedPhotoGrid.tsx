import React from 'react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import { Image as ImageType } from '../../../../types';
import { GridImage } from './GridImage';

interface HighlightedPhotoGridProps {
    images: ImageType[];
    columns: number;
    spacing: number;
    onImageClick: (index: number) => void;
}

export const HighlightedPhotoGrid: React.FC<HighlightedPhotoGridProps> = ({
    images,
    columns,
    spacing,
    onImageClick,
}) => {
    if (images.length === 0) return null;

    return (
        <Box>
            <Box mb={spacing}>
                <GridImage
                    image={images[0]}
                    aspectRatio={16 / 9}
                    onClick={() => onImageClick(0)}
                />
            </Box>
            <SimpleGrid columns={columns} spacing={spacing}>
                {images.slice(1).map((image, idx) => (
                    <GridImage
                        key={image.id}
                        image={image}
                        onClick={() => onImageClick(idx + 1)}
                    />
                ))}
            </SimpleGrid>
        </Box>
    );
};