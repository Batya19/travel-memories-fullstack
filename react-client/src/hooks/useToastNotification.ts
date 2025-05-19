import { useToast, UseToastOptions } from '@chakra-ui/react';

export function useToastNotification() {
    const toast = useToast();

    const showSuccess = (title: string, description?: string) => {
        toast({
            title,
            description,
            status: 'success',
            duration: 5000,
            isClosable: true,
        });
    };

    const showError = (title: string, description?: string) => {
        toast({
            title,
            description: description || 'An error occurred. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    };

    const showWarning = (title: string, description?: string) => {
        toast({
            title,
            description,
            status: 'warning',
            duration: 5000,
            isClosable: true,
        });
    };

    const showInfo = (title: string, description?: string) => {
        toast({
            title,
            description,
            status: 'info',
            duration: 5000,
            isClosable: true,
        });
    };

    const showCustomToast = (options: UseToastOptions) => {
        toast(options);
    };

    return {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showCustomToast
    };
}