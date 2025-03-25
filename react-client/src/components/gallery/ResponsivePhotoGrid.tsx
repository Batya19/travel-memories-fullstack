import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Flex,
  IconButton,
  Text,
  Badge,
  useDisclosure,
  useBreakpointValue,
  Button,
} from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight, FaRobot, FaChevronDown } from 'react-icons/fa';
import { format } from 'date-fns';
import { Image as ImageType } from '../../types';
import OptimizedImage from '../common/OptimizedImage';
import { getImageUrl } from '../../utils/imageUtils';

interface ResponsivePhotoGridProps {
  images: ImageType[];
  columns?: { base: number; sm: number; md: number; lg: number };
  spacing?: number;
  maxImages?: number;
  highlightFirst?: boolean;
}

const ResponsivePhotoGrid: React.FC<ResponsivePhotoGridProps> = ({
  images,
  columns = { base: 2, sm: 3, md: 4, lg: 5 },
  spacing = 4,
  maxImages = 12,
  highlightFirst = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [visibleImages, setVisibleImages] = useState<ImageType[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [showingAll, setShowingAll] = useState(false);

  // Determine grid columns based on screen size
  const actualColumns = useBreakpointValue(columns) || columns.base;

  useEffect(() => {
    if (images.length > maxImages && !showingAll) {
      setVisibleImages(images.slice(0, maxImages));
      setHasMore(true);
    } else {
      setVisibleImages(images);
      setHasMore(false);
    }
  }, [images, maxImages, showingAll]);

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    onOpen();
  };

  const loadMoreImages = () => {
    setShowingAll(true);
  };

  const navigateImages = (direction: 'prev' | 'next') => {
    if (currentIndex === null || images.length === 0) return;

    if (direction === 'prev') {
      setCurrentIndex((prevIndex) => 
        prevIndex === null ? 0 : (prevIndex === 0 ? images.length - 1 : prevIndex - 1)
      );
    } else {
      setCurrentIndex((prevIndex) => 
        prevIndex === null ? 0 : (prevIndex === images.length - 1 ? 0 : prevIndex + 1)
      );
    }
  };

  const currentImage = currentIndex !== null ? images[currentIndex] : null;

  // Create a grid with first image larger if highlightFirst is true
  const renderGrid = () => {
    if (visibleImages.length === 0) {
      return <Text>No images to display</Text>;
    }

    if (highlightFirst && visibleImages.length > 1) {
      return (
        <Box>
          <Box mb={spacing} onClick={() => handleImageClick(0)}>
            <OptimizedImage
              src={getImageUrl(visibleImages[0])}
              alt={visibleImages[0].fileName}
              aspectRatio={16/9}
              objectFit="cover"
              width="100%"
              onClick={() => handleImageClick(0)}
            />
          </Box>
          <SimpleGrid columns={actualColumns} spacing={spacing}>
            {visibleImages.slice(1).map((image, idx) => (
              <Box key={image.id} position="relative">
                <OptimizedImage
                  src={getImageUrl(image)}
                  alt={image.fileName}
                  aspectRatio={1}
                  objectFit="cover"
                  onClick={() => handleImageClick(idx + 1)}
                />
                {image.isAiGenerated && (
                  <Badge
                    position="absolute"
                    top={2}
                    left={2}
                    colorScheme="purple"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    AI
                  </Badge>
                )}
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      );
    }

    // Regular grid for all images
    return (
      <SimpleGrid columns={actualColumns} spacing={spacing}>
        {visibleImages.map((image, idx) => (
          <Box key={image.id} position="relative">
            <OptimizedImage
              src={getImageUrl(image)}
              alt={image.fileName}
              aspectRatio={1}
              objectFit="cover"
              onClick={() => handleImageClick(idx)}
            />
            {image.isAiGenerated && (
              <Badge
                position="absolute"
                top={2}
                left={2}
                colorScheme="purple"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="md"
              >
                AI
              </Badge>
            )}
          </Box>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <Box>
      {renderGrid()}
      
      {/* Show more button if there are more images to display */}
      {hasMore && (
        <Flex justify="center" mt={4}>
          <Button 
            rightIcon={<FaChevronDown />} 
            onClick={loadMoreImages} 
            colorScheme="brand" 
            variant="outline"
          >
            Show all {images.length} images
          </Button>
        </Flex>
      )}
      
      {/* Image viewer modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay bg="blackAlpha.900" />
        <ModalContent bg="transparent" boxShadow="none" maxW="100vw" maxH="100vh">
          <ModalCloseButton color="white" zIndex={2} />
          
          <Flex
            justify="center"
            align="center"
            height="100vh"
            position="relative"
            onClick={onClose}
          >
            {/* Navigation buttons */}
            <IconButton
              aria-label="Previous image"
              icon={<FaArrowLeft />}
              position="absolute"
              left={4}
              onClick={(e) => {
                e.stopPropagation();
                navigateImages('prev');
              }}
              colorScheme="whiteAlpha"
              variant="ghost"
              fontSize="2xl"
              zIndex={1}
            />
            
            <IconButton
              aria-label="Next image"
              icon={<FaArrowRight />}
              position="absolute"
              right={4}
              onClick={(e) => {
                e.stopPropagation();
                navigateImages('next');
              }}
              colorScheme="whiteAlpha"
              variant="ghost"
              fontSize="2xl"
              zIndex={1}
            />
            
            {/* Current image */}
            {currentImage && (
              <Box
                maxW="90vw"
                maxH="90vh"
                onClick={(e) => e.stopPropagation()}
              >
                <Box
                  as="img"
                  src={getImageUrl(currentImage)}
                  alt={currentImage.fileName}
                  maxH="80vh"
                  maxW="90vw"
                  objectFit="contain"
                  borderRadius="md"
                />
                
                {/* Image info */}
                <Box
                  bg="blackAlpha.700"
                  p={3}
                  borderRadius="md"
                  mt={2}
                  color="white"
                >
                  <Flex justify="space-between" align="center">
                    <Text fontSize="md" fontWeight="medium">
                      {currentImage.fileName}
                    </Text>
                    
                    {currentImage.isAiGenerated && (
                      <Badge colorScheme="purple" display="flex" alignItems="center" gap={1}>
                        <FaRobot size="0.8em" /> AI Generated
                      </Badge>
                    )}
                  </Flex>
                  
                  {currentImage.takenAt && (
                    <Text fontSize="sm" mt={1}>
                      Taken on {format(new Date(currentImage.takenAt), 'MMMM d, yyyy')}
                    </Text>
                  )}
                  
                  {currentImage.isAiGenerated && currentImage.aiPrompt && (
                    <Text fontSize="sm" mt={1}>
                      <strong>Prompt:</strong> {currentImage.aiPrompt}
                    </Text>
                  )}
                </Box>
              </Box>
            )}
          </Flex>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ResponsivePhotoGrid;