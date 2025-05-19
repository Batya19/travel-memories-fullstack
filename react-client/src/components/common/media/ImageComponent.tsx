import React from 'react';
import { AspectRatio, Box, BoxProps } from '@chakra-ui/react';
import { Image as ImageType } from '../../../types';
import ImageBadge, { BadgePosition } from './ImageBadge';
import ImagePlaceholder from './ImagePlaceholder';
import BaseImage from './BaseImage';
import { getImageUrl } from '../../../utils/imageUtils';

interface ImageComponentProps extends BoxProps {
    image: ImageType | string;
    alt?: string;
    aspectRatio?: number;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    isLoaded?: boolean;
    onLoad?: () => void;
    onClick?: () => void;
    showBadge?: boolean;
    badgePosition?: BadgePosition;
    fallbackText?: string;
    cursor?: string;
}

export const ImageComponent: React.FC<ImageComponentProps> = ({
    image,
    alt,
    aspectRatio,
    objectFit = 'cover',
    isLoaded,
    onLoad,
    onClick,
    showBadge = true,
    badgePosition = 'topLeft',
    fallbackText = 'No Image',
    cursor,
    ...rest
}) => {
    const imageObj = typeof image === 'string' ? null : image;
    const imageSrc = typeof image === 'string' ? image : getImageUrl(image);
    const imageAlt = alt || (imageObj ? imageObj.fileName : 'Image');
    const isAiGenerated = imageObj?.isAiGenerated || false;

    if (!image) {
        return <ImagePlaceholder text={fallbackText} {...rest} />;
    }

    const imageContent = (
        <Box
            position="relative"
            width="100%"
            height="100%"
            onClick={onClick}
            cursor={onClick ? "pointer" : cursor || "default"}
        >
            <BaseImage
                src={imageSrc}
                alt={imageAlt}
                objectFit={objectFit}
                isLoaded={isLoaded}
                onLoad={onLoad}
                width="100%"
                height="100%"
                borderRadius={rest.borderRadius}
            />

            {showBadge && isAiGenerated && (
                <ImageBadge
                    badgePosition={badgePosition}
                    label="AI"
                    show={true}
                />
            )}
        </Box>
    );

    if (aspectRatio) {
        return (
            <AspectRatio ratio={aspectRatio} overflow="hidden" {...rest}>
                {imageContent}
            </AspectRatio>
        );
    }

    return (
        <Box overflow="hidden" {...rest}>
            {imageContent}
        </Box>
    );
};

export default ImageComponent;