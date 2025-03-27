import React, { useState, useRef, useEffect, RefObject } from 'react';
import { Box, useDisclosure, useToast } from '@chakra-ui/react';
import { Image as ImageType } from '../../../../types';
import imageService from '../../../../services/imageService';

// Import sub-components
import { ViewModeToggle, ViewMode } from './ViewModeToggle';
import { ImageGridView } from './ImageGridView';
import { ImageListView } from './ImageListView';
import { ImageViewerModal } from './ImageViewerModal';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

interface ImageGalleryProps {
    images: ImageType[];
    onDelete?: (imageId: string) => void;
    readonly?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    onDelete,
    readonly = false
}) => {
    // State
    const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

    // Hooks
    const { isOpen: isViewerOpen, onOpen: openViewer, onClose: closeViewer } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);
    const toast = useToast();

    // Track which images have loaded
    useEffect(() => {
        const newLoadedState: Record<string, boolean> = {};
        images.forEach(img => {
            newLoadedState[img.id] = loadedImages[img.id] || false;
        });
        setLoadedImages(newLoadedState);
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
        openViewer();
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

    return (
        <Box>
            {/* View toggle */}
            <ViewModeToggle
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            {/* Gallery content based on view mode */}
            {viewMode === 'grid' ? (
                <ImageGridView
                    images={images}
                    loadedImages={loadedImages}
                    onImageLoad={handleImageLoad}
                    onImageClick={handleImageClick}
                    onDeleteClick={confirmDelete}
                    readonly={readonly}
                />
            ) : (
                <ImageListView
                    images={images}
                    loadedImages={loadedImages}
                    onImageLoad={handleImageLoad}
                    onImageClick={handleImageClick}
                    onDeleteClick={confirmDelete}
                    readonly={readonly}
                />
            )}

            {/* Full-size image viewer modal */}
            <ImageViewerModal
                isOpen={isViewerOpen}
                onClose={closeViewer}
                currentImage={currentImage}
                onPrevImage={() => navigateImages('prev')}
                onNextImage={() => navigateImages('next')}
            />

            {/* Delete confirmation dialog */}
            <DeleteConfirmationDialog
                isOpen={isDeleteOpen}
                onClose={closeDelete}
                onConfirm={handleDelete}
                cancelRef={cancelRef as RefObject<HTMLButtonElement>}
            />
        </Box>
    );
};

export default ImageGallery;