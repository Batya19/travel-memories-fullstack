import React, { useState, useEffect } from 'react';
import {
  Box,
  Skeleton,
  AspectRatio,
  useColorModeValue
} from '@chakra-ui/react';
import { Image as ImageType } from '../../../types';

interface OptimizedImageProps {
  src: string;
  alt: string;
  lowQualitySrc?: string;
  fallbackSrc?: string;
  aspectRatio?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  borderRadius?: string | number;
  height?: string | number;
  width?: string | number;
  onClick?: () => void;
  image?: ImageType; // Optional image object
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  lowQualitySrc,
  fallbackSrc = '/images/placeholder.jpg',
  aspectRatio = 1,
  objectFit = 'cover',
  borderRadius = 'md',
  height,
  width = '100%',
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [actualSrc, setActualSrc] = useState<string>(src);
 
  const skeletonStartColor = useColorModeValue('gray.100', 'gray.700');
  const skeletonEndColor = useColorModeValue('gray.300', 'gray.600');

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setActualSrc(src);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setActualSrc(fallbackSrc);
  };

  const renderImage = () => (
    <>
      {!isLoaded && (
        <Skeleton
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          startColor={skeletonStartColor}
          endColor={skeletonEndColor}
          borderRadius={borderRadius}
        />
      )}
     
      {lowQualitySrc && !isLoaded && (
        <Box
          as="img"
          src={lowQualitySrc}
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          objectFit={objectFit}
          opacity={0.7}
          filter="blur(10px)"
          transform="scale(1.05)"
          borderRadius={borderRadius}
        />
      )}
     
      <Box
        as="img"
        src={actualSrc}
        alt={alt}
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        objectFit={objectFit}
        opacity={isLoaded ? 1 : 0}
        transition="opacity 0.3s ease-in-out"
        borderRadius={borderRadius}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        cursor={onClick ? "pointer" : "default"}
        title={alt}
      />
    </>
  );

  // If aspectRatio is provided, wrap in AspectRatio
  if (aspectRatio) {
    return (
      <AspectRatio ratio={aspectRatio} width={width} height={height} borderRadius={borderRadius} overflow="hidden">
        <Box position="relative" width="100%" height="100%">
          {renderImage()}
        </Box>
      </AspectRatio>
    );
  }

  // Otherwise, use a regular Box
  return (
    <Box position="relative" width={width} height={height} borderRadius={borderRadius} overflow="hidden">
      {renderImage()}
    </Box>
  );
};

export default OptimizedImage;