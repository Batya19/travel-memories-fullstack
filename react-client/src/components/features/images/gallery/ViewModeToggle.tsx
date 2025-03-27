import React from 'react';
import { Flex, Text, HStack, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FaThLarge, FaList } from 'react-icons/fa';

export type ViewMode = 'grid' | 'list';

interface ViewModeToggleProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
    viewMode,
    onViewModeChange
}) => {
    const metaTextColor = useColorModeValue('gray.500', 'gray.400');

    return (
        <Flex justifyContent="flex-end" mb={4}>
            <HStack spacing={2}>
                <Text fontSize="sm" color={metaTextColor}>View:</Text>
                <IconButton
                    aria-label="Grid view"
                    icon={<FaThLarge />}
                    size="sm"
                    colorScheme={viewMode === 'grid' ? 'brand' : 'gray'}
                    variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                    onClick={() => onViewModeChange('grid')}
                />
                <IconButton
                    aria-label="List view"
                    icon={<FaList />}
                    size="sm"
                    colorScheme={viewMode === 'list' ? 'brand' : 'gray'}
                    variant={viewMode === 'list' ? 'solid' : 'ghost'}
                    onClick={() => onViewModeChange('list')}
                />
            </HStack>
        </Flex>
    );
};