import React, { useState, useEffect } from 'react';
import { Box, Text, useDisclosure, useBreakpointValue } from '@chakra-ui/react';
import { Image as ImageType } from '../../../../types';

import { RegularPhotoGrid } from './RegularPhotoGrid';
import { HighlightedPhotoGrid } from './HighlightedPhotoGrid';
import { ShowMoreButton } from './ShowMoreButton';
import { ImageViewerModal } from './ImageViewerModal';

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
  const [visibleImages, setVisibleImages] = useState<ImageType[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [showingAll, setShowingAll] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Determine grid columns based on screen size
  const actualColumns = useBreakpointValue(columns) || columns.base;

  // Update visible images when source changes or "show more" is clicked
  useEffect(() => {
    if (images.length > maxImages && !showingAll) {
      setVisibleImages(images.slice(0, maxImages));
      setHasMore(true);
    } else {
      setVisibleImages(images);
      setHasMore(false);
    }
  }, [images, maxImages, showingAll]);

  // Handlers
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

  // Current selected image
  const currentImage = currentIndex !== null ? images[currentIndex] : null;

  if (visibleImages.length === 0) {
    return <Text>No images to display</Text>;
  }

  return (
    <Box>
      {/* Render grid based on configuration */}
      {highlightFirst && visibleImages.length > 1 ? (
        <HighlightedPhotoGrid
          images={visibleImages}
          columns={actualColumns}
          spacing={spacing}
          onImageClick={handleImageClick}
        />
      ) : (
        <RegularPhotoGrid
          images={visibleImages}
          columns={actualColumns}
          spacing={spacing}
          onImageClick={handleImageClick}
        />
      )}

      {/* Show more button if there are more images to display */}
      {hasMore && (
        <ShowMoreButton
          onClick={loadMoreImages}
          totalCount={images.length}
        />
      )}

      {/* Image viewer modal */}
      <ImageViewerModal
        isOpen={isOpen}
        onClose={onClose}
        currentImage={currentImage}
        onPrevious={() => navigateImages('prev')}
        onNext={() => navigateImages('next')}
      />
    </Box>
  );
};

export default ResponsivePhotoGrid;