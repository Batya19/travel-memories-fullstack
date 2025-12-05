import React, { RefObject } from 'react';
import {
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Button,
    useColorModeValue
} from '@chakra-ui/react';

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    cancelRef: RefObject<HTMLButtonElement>;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    cancelRef,
    title = 'Delete Image',
    message = 'Are you sure you want to delete this image? This action cannot be undone.',
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel'
}) => {
    const cardBg = useColorModeValue('white', 'gray.800');

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent bg={cardBg}>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {title}
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        {message}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            {cancelLabel}
                        </Button>
                        <Button colorScheme="red" onClick={onConfirm} ml={3}>
                            {confirmLabel}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default DeleteConfirmationDialog;

