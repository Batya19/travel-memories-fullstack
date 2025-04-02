import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, useBreakpointValue } from '@chakra-ui/react';
import { Image as ImageType } from '../../../../../types';
import { getImageUrl } from '../../../../../utils/imageUtils';
import LazyImage from '../../../../common/media/LazyImage';

interface MasonryGridProps {
  images: ImageType[];
  columns?: { base: number; sm: number; md: number; lg: number };
  spacing?: number;
  onImageClick?: (index: number) => void;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({
  images,
  columns = { base: 1, sm: 2, md: 3, lg: 4 },
  spacing = 4,
  onImageClick
}) => {
  const [imageLayouts, setImageLayouts] = useState<Array<{ aspectRatio: number; column: number }>>([]);
  const currentColumns = useBreakpointValue(columns) || columns.base;

  // Simulate image loading to calculate aspect ratios
  useEffect(() => {
    const loadImages = async () => {
      // Initialize column heights array
      const heights = Array(currentColumns).fill(0);

      // Calculate layouts based on image aspect ratios
      const layouts = await Promise.all(
        images.map(async (image) => {
          // Default aspect ratio if we can't determine it
          let aspectRatio = 1;

          try {
            // Create a promise to get the image dimensions
            const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
              const img = new Image();
              img.onload = () => {
                resolve({ width: img.width, height: img.height });
              };
              img.onerror = () => {
                resolve({ width: 1, height: 1 }); // Default 1:1 ratio on error
              };
              // Use the correct image URL here
              img.src = getImageUrl(image);
            });

            aspectRatio = dimensions.width / dimensions.height;
          } catch (error) {
            console.error('Error calculating image dimensions:', error);
          }

          // Find the shortest column
          const shortestColumn = heights.indexOf(Math.min(...heights));

          // Update the column height
          heights[shortestColumn] += 1 / aspectRatio;

          return { aspectRatio, column: shortestColumn };
        })
      );

      setImageLayouts(layouts);
    };

    if (images.length > 0 && currentColumns > 0) {
      loadImages();
    }
  }, [images, currentColumns]);

  // Group images by column
  const columnGroups = Array.from({ length: currentColumns }, (_, i) =>
    images.filter((_, index) => imageLayouts[index]?.column === i)
  );

  return (
    <SimpleGrid columns={currentColumns} spacing={spacing}>
      {columnGroups.map((columnImages, columnIndex) => (
        <Box key={columnIndex}>
          {columnImages.map((image) => {
            const originalIndex = images.findIndex(img => img.id === image.id);
            const aspectRatio = imageLayouts[originalIndex]?.aspectRatio || 1;

            return (
              <Box
                key={image.id}
                mb={spacing}
                onClick={() => onImageClick && onImageClick(originalIndex)}
              >
                <LazyImage
                  src={getImageUrl(image)}
                  alt={image.fileName}
                  width="100%"
                  height={0}
                  paddingBottom={`${100 / aspectRatio}%`}
                  objectFit="cover"
                  cursor={onImageClick ? "pointer" : "default"}
                  borderRadius="md"
                />
              </Box>
            );
          })}
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default MasonryGrid;