import React from 'react';
import { Flex, Button } from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';

interface ShowMoreButtonProps {
    onClick: () => void;
    totalCount: number;
}

export const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({
    onClick,
    totalCount,
}) => {
    return (
        <Flex justify="center" mt={4}>
            <Button
                rightIcon={<FaChevronDown />}
                onClick={onClick}
                colorScheme="brand"
                variant="outline"
            >
                Show all {totalCount} images
            </Button>
        </Flex>
    );
};

export default ShowMoreButton;