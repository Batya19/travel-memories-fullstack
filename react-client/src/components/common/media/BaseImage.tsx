import React, { useState } from 'react';
import {
    Box,
    Skeleton,
    useColorModeValue,
    BoxProps
} from '@chakra-ui/react';

export interface BaseImageProps extends BoxProps {
    src: string;
    alt: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    onLoad?: () => void;
    onError?: () => void;
    isLoaded?: boolean;
    fallbackSrc?: string;
}

export const BaseImage: React.FC<BaseImageProps> = ({
    src,
    alt,
    objectFit = 'cover',
    onLoad,
    onError,
    isLoaded: externalIsLoaded,
    fallbackSrc = '/images/placeholder.jpg',
    ...rest
}) => {
    const [internalIsLoaded, setInternalIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    const isLoaded = externalIsLoaded !== undefined ? externalIsLoaded : internalIsLoaded;

    const skeletonStartColor = useColorModeValue('gray.100', 'gray.700');
    const skeletonEndColor = useColorModeValue('gray.300', 'gray.600');

    const handleLoad = () => {
        setInternalIsLoaded(true);
        if (onLoad) onLoad();
    };

    const handleError = () => {
        if (!error) {
            setError(true);
            setCurrentSrc(fallbackSrc);
            if (onError) onError();
        }
    };

    return (
        <Box position="relative" width="100%" height="100%" {...rest}>
            {!isLoaded && (
                <Skeleton
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    startColor={skeletonStartColor}
                    endColor={skeletonEndColor}
                    borderRadius={rest.borderRadius}
                />
            )}

            <Box
                as="img"
                src={currentSrc}
                alt={alt}
                width="100%"
                height="100%"
                objectFit={objectFit}
                opacity={isLoaded ? 1 : 0}
                transition="opacity 0.3s ease-in-out"
                onLoad={handleLoad}
                onError={handleError}
                position={!isLoaded ? "absolute" : "relative"}
                top={0}
                left={0}
                borderRadius={rest.borderRadius}
            />
        </Box>
    );
};

export default BaseImage;