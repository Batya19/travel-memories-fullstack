import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Grid,
  Heading,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import AppLogo from '../../components/common/ui/AppLogo';
import LoginForm from '../../components/features/auth/LoginForm';

const LoginPage: React.FC = () => {
  const bgLeftColor = useColorModeValue('brand.500', 'brand.700');
  const bgRightColor = useColorModeValue('white', 'gray.800');

  return (
    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} height="100vh">
      {/* Image Section */}
      <Box
        bgColor={bgLeftColor}
        bgImage="url('/images/welcome-landscape.jpg')"
        bgSize="cover"
        bgPosition="center"
        display={{ base: 'none', md: 'flex' }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="blackAlpha.500"
          backdropFilter="blur(1px)"
        />
        <Flex
          width="100%"
          height="100%"
          direction="column"
          justifyContent="center"
          alignItems="center"
          position="relative"
          zIndex="1"
          color="white"
          p={8}
          textAlign="center"
        >
          <Heading
            fontSize={{ base: '3xl', lg: '4xl' }}
            mb={6}
            textShadow="0 2px 10px rgba(0,0,0,0.3)"
          >
            Welcome Back to TravelMemories
          </Heading>
          <Text
            fontSize={{ base: 'lg', lg: 'xl' }}
            maxW="500px"
            textShadow="0 1px 5px rgba(0,0,0,0.3)"
          >
            Your travel stories are waiting. Sign in to continue your journey.
          </Text>
        </Flex>
      </Box>

      {/* Form Section */}
      <Flex
        direction="column"
        justify="center"
        bg={bgRightColor}
        p={{ base: 4, md: 8, xl: 16 }}
      >
        <Box display={{ base: 'block', md: 'none' }} mb={8}>
          <AppLogo size="50px" />
        </Box>

        <Box maxW="500px" mx="auto" width="100%">
          <Heading size="xl" mb={8}>
            Sign In
          </Heading>

          <LoginForm />

          <Box textAlign="center" mt={6}>
            <Text mb={2}>
              Don't have an account?{' '}
              <Link as={RouterLink} to="/register" color="brand.500" fontWeight="semibold">
                Sign Up Now
              </Link>
            </Text>
          </Box>
        </Box>
      </Flex>
    </Grid>
  );
};

export default LoginPage;