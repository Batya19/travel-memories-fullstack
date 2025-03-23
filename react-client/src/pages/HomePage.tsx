import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Flex,
  Container,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaCamera, FaRobot, FaMapMarkedAlt, FaShareAlt } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';

interface FeatureProps {
  title: string;
  text: string;
  icon: React.ElementType;
}

const Feature: React.FC<FeatureProps> = ({ title, text, icon }) => {
  return (
    <Stack
      align="center"
      p={6}
      bg={useColorModeValue('white', 'gray.800')}
      rounded="lg"
      boxShadow="md"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      textAlign="center"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
      }}
    >
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        rounded="full"
        bg={useColorModeValue('brand.100', 'brand.900')}
        color={useColorModeValue('brand.600', 'brand.300')}
        mb={4}
      >
        <Icon as={icon} w={8} h={8} />
      </Flex>
      <Heading as="h3" size="md" mb={2}>
        {title}
      </Heading>
      <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="sm">
        {text}
      </Text>
    </Stack>
  );
};

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      
      <Box flex="1">
        {/* Hero Section */}
        <Box bg={useColorModeValue('brand.50', 'gray.800')} py={20}>
          <Container maxW="container.xl">
            <Stack
              align="center"
              spacing={8}
              py={{ base: 8, md: 16 }}
              direction={{ base: 'column', md: 'row' }}
            >
              <Stack flex={1} spacing={6} maxW="lg">
                <Heading
                  fontWeight={700}
                  fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
                  lineHeight="shorter"
                >
                  Document your journeys,{' '}
                  <Text as="span" color="brand.500">
                    preserve your memories
                  </Text>
                </Heading>
                <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="lg">
                  TravelMemories helps you create beautiful travel journals with photos, 
                  AI-generated images, and interactive maps. Share your adventures with
                  friends and family in an elegant format.
                </Text>
                <Stack spacing={4} direction={{ base: 'column', sm: 'row' }}>
                  <Button
                    as={RouterLink}
                    to={currentUser ? '/create-trip' : '/register'}
                    size="lg"
                    colorScheme="brand"
                    px={8}
                  >
                    {currentUser ? 'Create New Trip' : 'Get Started'}
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/about"
                    size="lg"
                    variant="outline"
                    colorScheme="brand"
                    px={8}
                  >
                    Learn More
                  </Button>
                </Stack>
              </Stack>
              <Flex
                flex={1}
                justify="center"
                align="center"
                position="relative"
                w="full"
                display={{ base: 'none', md: 'flex' }}
              >
                {/* כאן אפשר להוסיף תמונת הדגמה של המערכת */}
                <Box
                  position="relative"
                  height="300px"
                  width="full"
                  overflow="hidden"
                  borderRadius="xl"
                  boxShadow="2xl"
                  bg="gray.200"
                >
                  {/* Placeholder for hero image */}
                </Box>
              </Flex>
            </Stack>
          </Container>
        </Box>

        {/* Features Section */}
        <Box py={20} bg={bgColor}>
          <Container maxW="container.xl">
            <Stack spacing={4} as={Container} maxW="3xl" textAlign="center" mb={12}>
              <Heading fontSize="3xl">Key Features</Heading>
              <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="lg">
                Everything you need to document and share your travel experiences
              </Text>
            </Stack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
              <Feature
                icon={FaCamera}
                title="Photo Management"
                text="Upload and organize your travel photos in one place with easy sorting and filtering."
              />
              <Feature
                icon={FaRobot}
                title="AI Image Generation"
                text="Create AI-generated images to complete your travel stories when you're missing photos."
              />
              <Feature
                icon={FaMapMarkedAlt}
                title="Interactive Maps"
                text="Mark your travel locations on interactive maps to visualize your journey."
              />
              <Feature
                icon={FaShareAlt}
                title="Easy Sharing"
                text="Share your travel memories with friends and family through simple link sharing."
              />
            </SimpleGrid>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default HomePage;