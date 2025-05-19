import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, useBreakpointValue } from '@chakra-ui/react';
import { Image as ImageType } from '../../../../../types';
import ImageComponent from '../../../../common/media/ImageComponent';

interface MasonryLayoutProps {
    images: ImageType[];
    columns?: { base: number; sm: number; md: number; lg: number };
    spacing?: number;
    onImageClick?: (index: number) => void;
}

export const MasonryLayout: React.FC<MasonryLayoutProps> = ({
    images,
    columns = { base: 1, sm: 2, md: 3, lg: 4 },
    spacing = 4,
    onImageClick
}) => {
    const [imageLayouts, setImageLayouts] = useState<Array<{ aspectRatio: number; column: number }>>([]);
    const currentColumns = useBreakpointValue(columns) || columns.base;

    useEffect(() => {
        if (!images.length || !currentColumns) return;

        const columnHeights = Array(currentColumns).fill(0);

        const layouts = images.map(() => {
            const aspectRatio = 1;
            const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
            columnHeights[shortestColumn] += 1 / aspectRatio;
            return { aspectRatio, column: shortestColumn };
        });

        setImageLayouts(layouts);
    }, [images, currentColumns]);

    const columnGroups = Array.from({ length: currentColumns }, (_, i) =>
        images.filter((_, index) => imageLayouts[index]?.column === i)
    );

    return (
        <SimpleGrid columns={currentColumns} spacing={spacing}>
            {columnGroups.map((columnImages, columnIndex) => (
                <Box key={columnIndex} display="flex" flexDirection="column" gap={spacing}>
                    {columnImages.map((image) => {
                        const originalIndex = images.findIndex(img => img.id === image.id);

                        return (
                            <Box key={image.id}>
                                <ImageComponent
                                    image={image}
                                    onClick={() => onImageClick && onImageClick(originalIndex)}
                                    borderRadius="md"
                                    overflow="hidden"
                                    boxShadow="md"
                                />
                            </Box>
                        );
                    })}
                </Box>
            ))}
        </SimpleGrid>
    );
};

export default MasonryLayout;