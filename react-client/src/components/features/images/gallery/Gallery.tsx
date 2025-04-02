import React, { useState, useRef, useEffect } from 'react';
import { Box, useDisclosure, useToast, useBreakpointValue } from '@chakra-ui/react';
import { Image as ImageType } from '../../../../types';
import imageService from '../../../../services/imageService';

// Import sub-components
import { ViewModeToggle, ViewMode } from './components/ViewModeToggle';
import ImageGridView from './views/ImageGridView';
import ImageListView from './views/ImageListView';
import ImageViewerModal from './modal/ImageViewerModal';
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog';
import RegularPhotoGrid from './views/RegularPhotoGrid';
import HighlightedPhotoGrid from './views/HighlightedPhotoGrid';
import MasonryGrid from './views/MasonryGrid';
import ShowMoreButton from './views/ShowMoreButton';

export type GalleryLayout = 'grid' | 'list' | 'regular' | 'highlighted' | 'masonry';

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
    highlightFirst?: boolean;
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
    // State
    const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>(
        layout === 'list' ? 'list' : initialViewMode
    );
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
    const [visibleImages, setVisibleImages] = useState<ImageType[]>(
        maxImages && images.length > maxImages ? images.slice(0, maxImages) : images
    );
    const [showingAll, setShowingAll] = useState<boolean>(!maxImages || images.length <= maxImages);

    // Responsive columns
    const actualColumns = useBreakpointValue(columns) || columns.base;

    // Hooks
    const { isOpen: isViewerOpen, onOpen: openViewer, onClose: closeViewer } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null!);
    const toast = useToast();

    // Effect to update visible images when images, maxImages, or showingAll changes
    useEffect(() => {
        if (maxImages && images.length > maxImages && !showingAll) {
            setVisibleImages(images.slice(0, maxImages));
        } else {
            setVisibleImages(images);
        }
    }, [images, maxImages, showingAll]);

    // Separate effect to initialize loading state for new images
    useEffect(() => {
        // Only initialize loaded state for new images
        const newLoadedState = { ...loadedImages };
        let hasNewImages = false;
        
        images.forEach(img => {
            if (newLoadedState[img.id] === undefined) {
                newLoadedState[img.id] = false;
                hasNewImages = true;
            }
        });
        
        // Only update state if we have new images
        if (hasNewImages) {
            setLoadedImages(newLoadedState);
        }
    }, [images]);

    // Event handlers
    const handleImageLoad = (imageId: string) => {
        setLoadedImages(prev => ({
            ...prev,
            [imageId]: true
        }));
    };

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
        if (!imageToDelete) return;

        try {
            await imageService.deleteImage(imageToDelete);

            toast({
                title: 'Image deleted',
                description: 'The image has been deleted successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            if (onDelete) {
                onDelete(imageToDelete);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete the image. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            closeDelete();
            setImageToDelete(null);
        }
    };

    // Current image for viewer
    const currentImage = currentImageIndex !== null ? images[currentImageIndex] : null;

    // אם אין תמונות, אין מה להציג
    if (images.length === 0) {
        return null;
    }

    // פונקציה לרינדור תצוגת הגלריה הנבחרת
    const renderGalleryView = () => {
        // אם layout הוא grid או list, נשתמש ב-viewMode שנבחר
        if (layout === 'grid' || layout === 'list') {
            return viewMode === 'grid' ? (
                <ImageGridView
                    images={visibleImages}
                    loadedImages={loadedImages}
                    onImageLoad={handleImageLoad}
                    onImageClick={handleImageClick}
                    onDeleteClick={confirmDelete}
                    readonly={readonly}
                />
            ) : (
                <ImageListView
                    images={visibleImages}
                    loadedImages={loadedImages}
                    onImageLoad={handleImageLoad}
                    onImageClick={handleImageClick}
                    onDeleteClick={confirmDelete}
                    readonly={readonly}
                />
            );
        }

        // אחרת, נבחר לפי הלייאאוט הספציפי
        switch (layout) {
            case 'regular':
                return (
                    <RegularPhotoGrid
                        images={visibleImages}
                        columns={actualColumns}
                        spacing={spacing}
                        onImageClick={handleImageClick}
                    />
                );
            case 'highlighted':
                return (
                    <HighlightedPhotoGrid
                        images={visibleImages}
                        columns={actualColumns}
                        spacing={spacing}
                        onImageClick={handleImageClick}
                    />
                );
            case 'masonry':
                return (
                    <MasonryGrid
                        images={visibleImages}
                        columns={columns}
                        spacing={spacing}
                        onImageClick={handleImageClick}
                    />
                );
            default:
                return (
                    <ImageGridView
                        images={visibleImages}
                        loadedImages={loadedImages}
                        onImageLoad={handleImageLoad}
                        onImageClick={handleImageClick}
                        onDeleteClick={confirmDelete}
                        readonly={readonly}
                    />
                );
        }
    };

    return (
        <Box>
            {/* View toggle - מוצג רק אם layout הוא grid או list */}
            {(layout === 'grid' || layout === 'list') && (
                <ViewModeToggle
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />
            )}

            {/* Gallery content based on layout */}
            {renderGalleryView()}

            {/* Show more button if there are more images to display */}
            {maxImages && images.length > maxImages && !showingAll && (
                <ShowMoreButton
                    onClick={loadMoreImages}
                    totalCount={images.length}
                />
            )}

            {/* Full-size image viewer modal */}
            <ImageViewerModal
                isOpen={isViewerOpen}
                onClose={closeViewer}
                currentImage={currentImage}
                onPrevious={() => navigateImages('prev')}
                onNext={() => navigateImages('next')}
            />

            {/* Delete confirmation dialog */}
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