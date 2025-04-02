import React from 'react';
import { Badge } from '@chakra-ui/react';
import { FaRobot } from 'react-icons/fa';

interface ImageBadgeProps {
    isAiGenerated: boolean;
    showIcon?: boolean;
    position?: 'inline' | 'overlay';
}

export const ImageBadge: React.FC<ImageBadgeProps> = ({
    isAiGenerated,
    showIcon = true,
    position = 'overlay',
}) => {
    if (!isAiGenerated) return null;

    if (position === 'overlay') {
        return (
            <Badge
                position="absolute"
                top={2}
                left={2}
                colorScheme="purple"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="md"
                zIndex={1}
            >
                {showIcon ? <FaRobot size="0.8em" /> : 'AI'}
            </Badge>
        );
    }

    return (
        <Badge
            colorScheme="purple"
            display="flex"
            alignItems="center"
            gap={1}
        >
            {showIcon && <FaRobot size="0.8em" />} AI Generated
        </Badge>
    );
};

export default ImageBadge;