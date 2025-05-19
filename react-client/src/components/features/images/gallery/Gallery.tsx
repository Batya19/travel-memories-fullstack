import React, { useState, useRef, useEffect } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { Image as ImageType } from '../../../../types';
import GridLayout from './layouts/GridLayout';
import { ViewModeToggle, ViewMode } from './components/ViewModeToggle';
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog';
import ImageViewer from './viewer/ImageViewer';
import ListLayout from './layouts/ListLayout';
import MasonryLayout from './layouts/MasonryLayout';
import HighlightedLayout from './layouts/HighlightedLayout';
import ShowMoreButton from './components/ShowMoreButton';

export type GalleryLayout = 'grid' | 'list' | 'masonry' | 'highlighted';

interface GalleryProps {
    images: ImageType[];
    layout?: GalleryLayout;
    readonly?: boolean;
    maxImages?: number;
    onDelete?: (imageId: string) => void;
    onImageClick?: (image: ImageType, index: number) => void;
    columns?: { base: number; sm: number; md: number; lg: number };
    spacing?: number;
    initialViewMode?: ViewMode;
}

const Gallery: React.FC<GalleryProps> = ({
    images,
    layout = 'grid',
    readonly = false,
    maxImages,
    onDelete,
    onImageClick,
    columns = { base: 2, sm: 3, md: 4, lg: 5 },
    spacing = 4,
    initialViewMode = 'grid',
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>(
        layout === 'list' ? 'list' : initialViewMode
    );
    const [visibleImages, setVisibleImages] = useState<ImageType[]>(
        maxImages && images.length > maxImages ? images.slice(0, maxImages) : images
    );
    const [showingAll, setShowingAll] = useState<boolean>(!maxImages || images.length <= maxImages);

    const { isOpen: isViewerOpen, onOpen: openViewer, onClose: closeViewer } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null!);

    useEffect(() => {
        if (maxImages && images.length > maxImages && !showingAll) {
            setVisibleImages(images.slice(0, maxImages));
        } else {
            setVisibleImages(images);
        }
    }, [images, maxImages, showingAll]);

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);

        if (onImageClick && index < images.length) {
            onImageClick(images[index], index);
        } else {
            openViewer();
        }
    };

    const navigateImages = (direction: 'prev' | 'next') => {
        if (currentImageIndex === null || images.length === 0) return;

        if (direction === 'prev') {
            setCurrentImageIndex(prevIndex =>
                prevIndex !== null ? (prevIndex === 0 ? images.length - 1 : prevIndex - 1) : 0
            );
        } else {
            setCurrentImageIndex(prevIndex =>
                prevIndex !== null ? (prevIndex === images.length - 1 ? 0 : prevIndex + 1) : 0
            );
        }
    };

    const loadMoreImages = () => {
        setShowingAll(true);
    };

    const confirmDelete = (imageId: string) => {
        setImageToDelete(imageId);
        openDelete();
    };

    const handleDelete = async () => {
        if (!imageToDelete || !onDelete) return;

        onDelete(imageToDelete);
        closeDelete();
        setImageToDelete(null);
    };

    const currentImage = currentImageIndex !== null ? images[currentImageIndex] : null;

    if (images.length === 0) {
        return null;
    }

    const renderLayout = () => {
        if (layout === 'grid' || layout === 'list') {
            return viewMode === 'grid' ? (
                <GridLayout
                    images={visibleImages}
                    columns={columns}
                    spacing={spacing}
                    onImageClick={handleImageClick}
                />
            ) : (
                <ListLayout
                    images={visibleImages}
                    spacing={spacing}
                    onImageClick={handleImageClick}
                    onDeleteClick={!readonly ? confirmDelete : undefined}
                />
            );
        }

        switch (layout) {
            case 'masonry':
                return (
                    <MasonryLayout
                        images={visibleImages}
                        columns={columns}
                        spacing={spacing}
                        onImageClick={handleImageClick}
                    />
                );
            case 'highlighted':
                return (
                    <HighlightedLayout
                        images={visibleImages}
                        columns={columns.base}
                        spacing={spacing}
                        onImageClick={handleImageClick}
                    />
                );
            default:
                return (
                    <GridLayout
                        images={visibleImages}
                        columns={columns}
                        spacing={spacing}
                        onImageClick={handleImageClick}
                    />
                );
        }
    };

    return (
        <Box>
            {(layout === 'grid' || layout === 'list') && (
                <ViewModeToggle
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />
            )}

            {renderLayout()}

            {maxImages && images.length > maxImages && !showingAll && (
                <ShowMoreButton
                    onClick={loadMoreImages}
                    totalCount={images.length}
                />
            )}

            <ImageViewer
                isOpen={isViewerOpen}
                onClose={closeViewer}
                currentImage={currentImage}
                onPrevious={() => navigateImages('prev')}
                onNext={() => navigateImages('next')}
            />

            <DeleteConfirmationDialog
                isOpen={isDeleteOpen}
                onClose={closeDelete}
                onConfirm={handleDelete}
                cancelRef={cancelRef}
            />
        </Box>
    );
};

export default Gallery;