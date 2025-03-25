import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Skeleton, 
  useColorModeValue 
} from '@chakra-ui/react';
import { Image as ImageType } from '../../types';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  borderRadius?: string | number;
  onClick?: () => void;
  threshold?: number; // Intersection observer threshold
  fallbackSrc?: string;
  cursor?: string;
  paddingBottom?: string;
  image?: ImageType; // Optional image object to use with getImageUrl
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  objectFit = 'cover',
  borderRadius = 'md',
  onClick,
  threshold = 0.1,
  fallbackSrc = '/images/placeholder.jpg',
  cursor,
  paddingBottom,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const skeletonStartColor = useColorModeValue('gray.100', 'gray.700');
  const skeletonEndColor = useColorModeValue('gray.300', 'gray.600');

  // Create and use IntersectionObserver to detect when image is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  // When image becomes visible, set the src
  useEffect(() => {
    if (isVisible) {
      setImageSrc(src);
    }
  }, [isVisible, src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setImageSrc(fallbackSrc);
  };

  return (
    <Box
      ref={imageRef}
      position="relative"
      width={width}
      height={height}
      borderRadius={borderRadius}
      overflow="hidden"
      cursor={onClick ? 'pointer' : cursor || 'default'}
      onClick={onClick}
      paddingBottom={paddingBottom}
    >
      {(!isLoaded || !isVisible) && (
        <Skeleton
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          startColor={skeletonStartColor}
          endColor={skeletonEndColor}
        />
      )}
      
      {imageSrc && (
        <Box
          as="img"
          src={imageSrc}
          alt={alt}
          width="100%"
          height="100%"
          objectFit={objectFit}
          position="absolute"
          top={0}
          left={0}
          opacity={isLoaded ? 1 : 0}
          transition="opacity 0.3s ease-in-out"
          onLoad={handleLoad}
          onError={handleError}
          title={alt}
        />
      )}
    </Box>
  );
};

export default LazyImage;