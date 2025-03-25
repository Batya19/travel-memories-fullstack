import React from 'react';
import { Box, Flex, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaImage } from 'react-icons/fa';

interface ImagePlaceholderProps {
    text?: string;
    width?: string;
    height?: string;
    aspectRatio?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
    text = 'No Image',
    width = '100%',
    height = 'auto',
    aspectRatio = '1 / 1',
}) => {
    const bgColor = useColorModeValue('gray.100', 'gray.700');
    const textColor = useColorModeValue('gray.500', 'gray.300');
    const iconColor = useColorModeValue('gray.300', 'gray.500');

    return (
        <Box
            width={width}
            height={height}
            aspectRatio={aspectRatio}
            bg={bgColor}
            borderRadius="md"
        >
            <Flex
                height="100%"
                direction="column"
                alignItems="center"
                justifyContent="center"
                p={4}
            >
                <Icon as={FaImage} boxSize="2rem" color={iconColor} mb={2} />
                <Text
                    textAlign="center"
                    color={textColor}
                    fontSize="sm"
                    fontWeight="medium"
                    noOfLines={2}
                >
                    {text}
                </Text>
            </Flex>
        </Box>
    );
};

export default ImagePlaceholder;