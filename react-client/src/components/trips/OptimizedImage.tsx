// OptimizedImage.tsx
import React, { useState } from 'react';
import { Box, Skeleton, Image as ChakraImage, ImageProps as ChakraImageProps } from '@chakra-ui/react';

interface OptimizedImageProps extends Omit<ChakraImageProps, 'onLoad' | 'onError'> {
    lowQualitySrc?: string;
    fallbackSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    lowQualitySrc,
    fallbackSrc = '/images/placeholder.jpg',
    alt,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <Box position="relative" overflow="hidden" {...props}>
            {!isLoaded && (
                <Skeleton
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    startColor="gray.100"
                    endColor="gray.300"
                />
            )}

            {lowQualitySrc && !isLoaded && (
                <ChakraImage
                    src={lowQualitySrc}
                    alt={alt}
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    filter="blur(10px)"
                    opacity={0.7}
                    transform="scale(1.05)"
                />
            )}

            <ChakraImage
                src={hasError ? fallbackSrc : src}
                alt={alt}
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                opacity={isLoaded ? 1 : 0}
                transition="opacity 0.3s ease-in-out"
                objectFit="cover"
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setHasError(true);
                    setIsLoaded(true);
                }}
            />
        </Box>
    );
};

export default OptimizedImage;