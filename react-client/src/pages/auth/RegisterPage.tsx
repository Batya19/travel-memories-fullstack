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
import RegisterForm from '../../components/features/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  const bgRightColor = useColorModeValue('brand.500', 'brand.700');
  const bgLeftColor = useColorModeValue('white', 'gray.800');

  return (
    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} height="100vh">
      {/* Form Section */}
      <Flex
        direction="column"
        justify="center"
        bg={bgLeftColor}
        p={{ base: 4, md: 8, xl: 12 }}
      >
        <Box display={{ base: 'block', md: 'none' }} mb={8}>
          <AppLogo size="50px" />
        </Box>

        <Box maxW="500px" mx="auto" width="100%">
          <Heading size="xl" mb={6}>
            Create Account
          </Heading>
          <Text mb={8} color="gray.600">
            Join TravelMemories to document and share your adventures
          </Text>

          {/* שימוש בקומפוננט המופרד */}
          <RegisterForm />

          <Box textAlign="center" mt={4}>
            <Text>
              Already have an account?{' '}
              <Link as={RouterLink} to="/login" color="brand.500" fontWeight="semibold">
                Sign In Here
              </Link>
            </Text>
          </Box>
        </Box>
      </Flex>

      {/* Image Section */}
      <Box
        bgColor={bgRightColor}
        bgImage="url('/images/journey1.jpg')"
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
            Start Your Travel Journey
          </Heading>
          <Text
            fontSize={{ base: 'lg', lg: 'xl' }}
            maxW="500px"
            textShadow="0 1px 5px rgba(0,0,0,0.3)"
          >
            Create, collect, and share your travel experiences with friends and family.
          </Text>
        </Flex>
      </Box>
    </Grid>
  );
};

export default RegisterPage;