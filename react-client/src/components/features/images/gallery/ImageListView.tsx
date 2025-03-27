import React from 'react';
import { Box } from '@chakra-ui/react';
import { Image as ImageType } from '../../../../types';
import { ImageListItem } from './ImageListItem';

interface ImageListViewProps {
    images: ImageType[];
    loadedImages: Record<string, boolean>;
    onImageLoad: (imageId: string) => void;
    onImageClick: (index: number) => void;
    onDeleteClick: (imageId: string) => void;
    readonly?: boolean;
}

export const ImageListView: React.FC<ImageListViewProps> = ({
    images,
    loadedImages,
    onImageLoad,
    onImageClick,
    onDeleteClick,
    readonly = false
}) => {
    return (
        <Box>
            {images.map((image, index) => (
                <ImageListItem
                    key={image.id}
                    image={image}
                    isLoaded={!!loadedImages[image.id]}
                    onImageLoad={onImageLoad}
                    onImageClick={() => onImageClick(index)}
                    onDeleteClick={onDeleteClick}
                    readonly={readonly}
                />
            ))}
        </Box>
    );
};