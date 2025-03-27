import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Heading,
    Text,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';

const HeroSection: React.FC = () => {
    const { currentUser } = useAuth();
    const buttonColorScheme = useColorModeValue('whiteAlpha', 'whiteAlpha');

    return (
        <Box
            position="relative"
            height="100vh"
            overflow="hidden"
        >
            {/* Video Background */}
            <Box
                as="video"
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                objectFit="cover"
                autoPlay
                loop
                muted
                src="/images/IMG_0177.MOV"
            />

            {/* Dark overlay for text readability */}
            <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                bg="rgba(0,0,0,0.5)"
            />

            <Container
                maxW="container.xl"
                position="relative"
                zIndex={10}
                height="100%"
                display="flex"
                alignItems="center"
            >
                <VStack
                    spacing={6}
                    align="center"
                    color="white"
                    textAlign="center"
                >
                    <Heading
                        as="h1"
                        size="2xl"
                        fontWeight="bold"
                    >
                        Document Your Journey, Preserve Your Memories
                    </Heading>
                    <Text
                        fontSize="xl"
                        maxW="600px"
                    >
                        TravelMemories helps you organize, manage, and share your travel experiences in one place.
                    </Text>
                    {currentUser ? (
                        <Button
                            as={RouterLink}
                            to="/create-trip"
                            leftIcon={<FaPlus />}
                            colorScheme={buttonColorScheme}
                            size="lg"
                            mt={4}
                            _hover={{ bg: "white", color: "brand.500" }}
                        >
                            Create New Trip
                        </Button>
                    ) : (
                        <Button
                            as={RouterLink}
                            to="/register"
                            colorScheme={buttonColorScheme}
                            size="lg"
                            mt={4}
                        >
                            Get Started Free
                        </Button>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default HeroSection;