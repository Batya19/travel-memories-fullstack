import React from 'react';
import { Box } from '@chakra-ui/react';
import { Image as ImageType } from '../../../../../types';
import { getImageUrl } from '../../../../../utils/imageUtils';
import OptimizedImage from '../../../../common/media/OptimizedImage';
import { ImageBadge } from '../components/ImageBadge';

interface GridImageProps {
    image: ImageType;
    aspectRatio?: number;
    onClick: () => void;
}

export const GridImage: React.FC<GridImageProps> = ({
    image,
    aspectRatio = 1,
    onClick,
}) => {
    return (
        <Box position="relative">
            <OptimizedImage
                src={getImageUrl(image)}
                alt={image.fileName}
                aspectRatio={aspectRatio}
                objectFit="cover"
                onClick={onClick}
            />
            <ImageBadge isAiGenerated={image.isAiGenerated} />
        </Box>
    );
};

export default GridImage;