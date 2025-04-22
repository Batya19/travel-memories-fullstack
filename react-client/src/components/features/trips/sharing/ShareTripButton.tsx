import React, { useState } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Box,
    Text,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { FaShare, FaCopy } from 'react-icons/fa';
import tripService from '../../../../services/tripService';

interface ShareTripButtonProps {
    trip: {
        id: string;
        name: string;
        shareId?: string;
    };
    size?: 'sm' | 'md' | 'lg';
    variant?: string;
}

const ShareTripButton: React.FC<ShareTripButtonProps> = ({
    trip,
    size = 'md',
    variant = 'outline'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const handleShare = async () => {
        if (!trip) return;

        setIsLoading(true);
        try {
            // Check if we already have a shareId
            if (trip.shareId) {
                // Construct URL from existing shareId
                const baseUrl = window.location.origin;
                const url = `${baseUrl}/trips/shared/${trip.shareId}`;
                setShareUrl(url);
            } else {
                // Generate new share link
                const response = await tripService.generateShareLink(trip.id);
                const shareId = response.shareId;

                // Construct the shareable URL
                const baseUrl = window.location.origin;
                const url = `${baseUrl}/trips/shared/${shareId}`;
                setShareUrl(url);
            }

            onOpen();
        } catch (error) {
            console.error('Error generating share link:', error);
            toast({
                title: 'Error',
                description: 'Failed to generate share link. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const copyShareUrl = () => {
        if (!shareUrl) return;

        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                toast({
                    title: 'Copied!',
                    description: 'Share link copied to clipboard.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                toast({
                    title: 'Error',
                    description: 'Failed to copy link. Please try again.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            });
    };

    return (
        <>
            <Button
                leftIcon={<FaShare />}
                variant={variant}
                onClick={handleShare}
                isLoading={isLoading}
                loadingText="Generating..."
                size={size}
            >
                Share
            </Button>

            {/* Share trip modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Share Your Trip</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb={4}>
                            Share this link with friends and family to let them view your trip:
                        </Text>
                        <Box
                            p={3}
                            borderWidth={1}
                            borderRadius="md"
                            fontFamily="mono"
                            fontSize="sm"
                            bg="gray.50"
                            wordBreak="break-all"
                            position="relative"
                        >
                            {shareUrl}
                        </Box>
                        <Text mt={4} fontSize="sm" color="gray.600">
                            Anyone with this link can view this trip without signing in.
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="brand" mr={3} onClick={copyShareUrl} leftIcon={<FaCopy />}>
                            Copy Link
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ShareTripButton;