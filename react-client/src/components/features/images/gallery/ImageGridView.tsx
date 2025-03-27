import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import { Image as ImageType } from '../../../../types';
import { ImageGridItem } from './ImageGridItem';

interface ImageGridViewProps {
    images: ImageType[];
    loadedImages: Record<string, boolean>;
    onImageLoad: (imageId: string) => void;
    onImageClick: (index: number) => void;
    onDeleteClick: (imageId: string) => void;
    readonly?: boolean;
}

export const ImageGridView: React.FC<ImageGridViewProps> = ({
    images,
    loadedImages,
    onImageLoad,
    onImageClick,
    onDeleteClick,
    readonly = false
}) => {
    return (
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
            {images.map((image, index) => (
                <ImageGridItem
                    key={image.id}
                    image={image}
                    isLoaded={!!loadedImages[image.id]}
                    onImageLoad={onImageLoad}
                    onImageClick={() => onImageClick(index)}
                    onDeleteClick={onDeleteClick}
                    readonly={readonly}
                />
            ))}
        </SimpleGrid>
    );
};