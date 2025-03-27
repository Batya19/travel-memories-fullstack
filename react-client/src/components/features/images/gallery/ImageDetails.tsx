import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { Image as ImageType } from '../../../../types';
import { ImageBadge } from './ImageBadge';

interface ImageDetailsProps {
    image: ImageType;
}

export const ImageDetails: React.FC<ImageDetailsProps> = ({ image }) => {
    return (
        <Box
            bg="blackAlpha.700"
            p={3}
            borderRadius="md"
            mt={2}
            color="white"
        >
            <Flex justify="space-between" align="center">
                <Text fontSize="md" fontWeight="medium">
                    {image.fileName}
                </Text>

                {image.isAiGenerated && (
                    <ImageBadge isAiGenerated={true} position="inline" />
                )}
            </Flex>

            {image.takenAt && (
                <Text fontSize="sm" mt={1}>
                    Taken on {format(new Date(image.takenAt), 'MMMM d, yyyy')}
                </Text>
            )}

            {image.isAiGenerated && image.aiPrompt && (
                <Text fontSize="sm" mt={1}>
                    <strong>Prompt:</strong> {image.aiPrompt}
                </Text>
            )}
        </Box>
    );
};