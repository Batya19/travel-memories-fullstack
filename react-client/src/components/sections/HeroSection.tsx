// src/components/sections/HeroSection.tsx
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
import { useAuth } from '../../contexts/AuthContext';

const HeroSection: React.FC = () => {
    const { currentUser } = useAuth();
    const buttonColorScheme = useColorModeValue('whiteAlpha', 'whiteAlpha');

    return (
        <Box
            position="relative"
            color="white"
            py={{ base: 16, md: 24 }}
            px={4}
            overflow="hidden"
            _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: "url('/images/travel-background.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: -1,
            }}
        >
            {/* Dark overlay for text readability */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="rgba(0,0,0,0.5)"
                zIndex={-1}
            />

            <Container maxW="6xl">
                <VStack spacing={6} textAlign="center" zIndex={2} position="relative" py={8}>
                    <Heading as="h1" size="2xl" fontWeight="bold" textShadow="0 2px 4px rgba(0,0,0,0.4)">
                        Document Your Journey, Preserve Your Memories
                    </Heading>
                    <Text fontSize="xl" maxW="xl" opacity={0.9} textShadow="0 1px 3px rgba(0,0,0,0.6)">
                        TravelMemories helps you organize, manage, and share your travel experiences in one place.
                    </Text>

                    {currentUser ? (
                        <Button
                            as={RouterLink}
                            to="/trips/new"
                            size="lg"
                            colorScheme={buttonColorScheme}
                            leftIcon={<FaPlus />}
                            mt={4}
                            _hover={{ bg: "white", color: "brand.500" }}
                        >
                            Create New Trip
                        </Button>
                    ) : (
                        <Button
                            as={RouterLink}
                            to="/register"
                            size="lg"
                            colorScheme={buttonColorScheme}
                            mt={4}
                            _hover={{ bg: "white", color: "brand.500" }}
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