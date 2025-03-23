import React from 'react';
import { Flex, Spinner, Text } from '@chakra-ui/react';

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Loading...' }) => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      h="100%"
      minH="200px"
      p={8}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="brand.500"
        size="xl"
      />
      <Text mt={4} color="gray.500">
        {text}
      </Text>
    </Flex>
  );
};

export default LoadingSpinner;