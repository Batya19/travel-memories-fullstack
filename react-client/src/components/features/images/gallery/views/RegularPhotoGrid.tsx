import React from 'react';
import { SimpleGrid, Text } from '@chakra-ui/react';
import { Image as ImageType } from '../../../../../types';
import { GridImage } from '../items/GridImage';

interface RegularPhotoGridProps {
    images: ImageType[];
    columns: number;
    spacing: number;
    onImageClick: (index: number) => void;
}

export const RegularPhotoGrid: React.FC<RegularPhotoGridProps> = ({
    images,
    columns,
    spacing,
    onImageClick,
}) => {
    if (images.length === 0) {
        return <Text>No images to display</Text>;
    }

    return (
        <SimpleGrid columns={columns} spacing={spacing}>
            {images.map((image, idx) => (
                <GridImage
                    key={image.id}
                    image={image}
                    onClick={() => onImageClick(idx)}
                />
            ))}
        </SimpleGrid>
    );
};

export default RegularPhotoGrid;