import React from 'react';
import { Heading, Text, Button, Flex } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <Flex
            minH="calc(100vh - 160px)"
            align="center"
            justify="center"
            direction="column"
            py={10}
        >
            <Heading as="h1" size="2xl" mb={4}>
                404
            </Heading>
            <Text fontSize="xl" mb={6} textAlign="center">
                Oops! The page you're looking for isn't on our map.
            </Text>
            <Button
                as={RouterLink}
                to="/"
                colorScheme="brand"
                size="lg"
            >
                Return to Home
            </Button>
        </Flex>
    );
};

export default NotFoundPage;