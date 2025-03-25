// src/components/sections/FeaturesSection.tsx
import React from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaImage, FaShareAlt } from 'react-icons/fa';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <VStack
      p={6}
      bg={cardBg}
      borderRadius="lg"
      boxShadow="md"
      spacing={4}
      align="center"
      textAlign="center"
      h="100%"
    >
      <Flex
        w="60px"
        h="60px"
        borderRadius="full"
        bg="brand.500"
        color="white"
        align="center"
        justify="center"
        fontSize="xl"
      >
        {icon}
      </Flex>
      <Heading as="h3" size="md">
        {title}
      </Heading>
      <Text color="gray.500">{description}</Text>
    </VStack>
  );
};

const FeaturesSection: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="6xl">
        <VStack spacing={12}>
          <Heading as="h2" size="lg" textAlign="center">
            Features That Make Travel Documentation Easy
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <FeatureCard
              title="Organize Your Photos"
              description="Upload and organize your travel photos in one place. Tag, sort, and filter them with ease for better memories management."
              icon={<FaImage />}
            />
            <FeatureCard
              title="Interactive Maps"
              description="Pin your locations on interactive maps to visualize your journey and remember where each memory was made."
              icon={<FaMapMarkerAlt />}
            />
            <FeatureCard
              title="Share Your Adventures"
              description="Generate shareable links to let friends and family experience your travels through your curated collection of memories."
              icon={<FaShareAlt />}
            />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default FeaturesSection;