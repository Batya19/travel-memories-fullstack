import React from 'react';
import { SimpleGrid, BoxProps } from '@chakra-ui/react';
import { Image as ImageType } from '../../../../../types';
import ImageComponent from '../../../../common/media/ImageComponent';

interface GridLayoutProps extends BoxProps {
    images: ImageType[];
    columns?: { base: number; sm: number; md: number; lg: number; };
    spacing?: number;
    onImageClick?: (index: number) => void;
    aspectRatio?: number;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
    images,
    columns = { base: 2, sm: 3, md: 4, lg: 5 },
    spacing = 4,
    onImageClick,
    aspectRatio = 1,
    ...rest
}) => {
    return (
        <SimpleGrid columns={columns} spacing={spacing} {...rest}>
            {images.map((image, index) => (
                <ImageComponent
                    key={image.id}
                    image={image}
                    aspectRatio={aspectRatio}
                    onClick={() => onImageClick && onImageClick(index)}
                    showBadge={true}
                    boxShadow="md"
                    borderRadius="md"
                    transition="transform 0.2s"
                    _hover={{ transform: 'scale(1.02)' }}
                />
            ))}
        </SimpleGrid>
    );
};

export default GridLayout;