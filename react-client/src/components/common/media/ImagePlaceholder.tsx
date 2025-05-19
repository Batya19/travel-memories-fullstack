import React from 'react';
import { Box, Flex, Text, Icon, useColorModeValue, BoxProps } from '@chakra-ui/react';
import { FaImage } from 'react-icons/fa';

interface ImagePlaceholderProps extends BoxProps {
    text?: string;
    icon?: React.ReactElement;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
    text = 'No Image',
    icon = <FaImage />,
    ...rest
}) => {
    const bgColor = useColorModeValue('gray.100', 'gray.700');
    const textColor = useColorModeValue('gray.500', 'gray.300');
    const iconColor = useColorModeValue('gray.300', 'gray.500');

    return (
        <Box
            bg={bgColor}
            borderRadius="md"
            overflow="hidden"
            {...rest}
        >
            <Flex
                height="100%"
                direction="column"
                alignItems="center"
                justifyContent="center"
                p={4}
            >
                <Icon as={() => icon} boxSize="2rem" color={iconColor} mb={2} />
                {text && (
                    <Text
                        textAlign="center"
                        color={textColor}
                        fontSize="sm"
                        fontWeight="medium"
                        noOfLines={2}
                    >
                        {text}
                    </Text>
                )}
            </Flex>
        </Box>
    );
};

export default ImagePlaceholder;