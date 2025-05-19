import React from 'react';
import { Badge, Box, BadgeProps } from '@chakra-ui/react';
import { FaRobot } from 'react-icons/fa';

export type BadgePosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'inline';

export interface ImageBadgeProps extends Omit<BadgeProps, 'position'> {
    label?: string;
    icon?: React.ReactElement;
    badgePosition?: BadgePosition;
    show?: boolean;
}

export const ImageBadge: React.FC<ImageBadgeProps> = ({
    label = 'AI',
    icon = <FaRobot size="0.8em" />,
    badgePosition = 'topLeft',
    show = true,
    colorScheme = 'purple',
    ...rest
}) => {
    if (!show) return null;

    if (badgePosition === 'inline') {
        return (
            <Badge
                display="flex"
                alignItems="center"
                gap={1}
                colorScheme={colorScheme}
                {...rest}
            >
                {icon} {label}
            </Badge>
        );
    }

    const positionStyles = {
        topLeft: { top: 2, left: 2 },
        topRight: { top: 2, right: 2 },
        bottomLeft: { bottom: 2, left: 2 },
        bottomRight: { bottom: 2, right: 2 },
    };

    return (
        <Badge
            position="absolute"
            {...positionStyles[badgePosition]}
            colorScheme={colorScheme}
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="md"
            zIndex={2}
            display="flex"
            alignItems="center"
            {...rest}
        >
            {icon && <Box mr={label ? 1 : 0}>{icon}</Box>}
            {label}
        </Badge>
    );
};

export default ImageBadge;