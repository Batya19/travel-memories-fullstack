import React from 'react';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react'; // נוסף useColorModeValue
import { format } from 'date-fns';
import { Image as ImageType } from '../../../../../types';
import ImageBadge from '../../../../common/media/ImageBadge';

interface ImageDetailsProps {
    image: ImageType;
}

export const ImageDetails: React.FC<ImageDetailsProps> = ({ image }) => {
    // הגדרת צבעים דינמיים למצב בהיר וכהה
    // שינויים:
    // הרקע הופך ל-gray.700 במצב בהיר (כדי שהטקסט הלבן יהיה קריא), ונשאר blackAlpha.700 בכהה.
    // הטקסט נשאר לבן בשני המצבים, או שניתן לשנות אותו ל-gray.100 בכהה אם נדרש גוון אחר.
    const bgColor = useColorModeValue('gray.700', 'blackAlpha.700');
    const textColor = useColorModeValue('white', 'white'); // ניתן לשנות ל-useColorModeValue('white', 'gray.100') אם תרצה גוון לבן מעט שונה בכהה

    return (
        <Box
            bg={bgColor} // השתמש בצבע הרקע הדינמי
            p={3}
            borderRadius="md"
            mt={2}
            color={textColor} // השתמש בצבע הטקסט הדינמי
        >
            <Flex justify="space-between" align="center">
                <Text fontSize="md" fontWeight="medium">
                    {image.fileName}
                </Text>

                {image.isAiGenerated && (
                    <ImageBadge
                        badgePosition="inline"
                        label="AI Generated"
                        show={true}
                    />
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

            <Text fontSize="sm" mt={1}>
                <strong>Size:</strong> {Math.round(image.fileSize / 1024)} KB
            </Text>
        </Box>
    );
};

export default ImageDetails;