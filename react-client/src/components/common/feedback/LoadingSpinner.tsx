import React from 'react';
import { Flex, Spinner, Text, VStack } from '@chakra-ui/react';

interface LoadingSpinnerProps {
  text?: string;
  size?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = 'Loading...',
  size = 'xl'
}) => {
  return (
    <Flex justify="center" align="center" h="100%" minH="200px" w="100%">
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size={size}
        />
        {text && <Text>{text}</Text>}
      </VStack>
    </Flex>
  );
};

export default LoadingSpinner;