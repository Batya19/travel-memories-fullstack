import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  Heading,
  Text,
  Link,
  Flex,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginFormData, FormErrors } from '../../types';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      // Error is handled by the AuthContext's toast notifications
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <Box
        w="full"
        maxW="md"
        py={12}
        px={6}
        bg={bgColor}
        borderRadius="lg"
        boxShadow="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <VStack spacing={6} align="center" mb={8}>
          <Image src="/logo.png" alt="TravelMemories Logo" h="50px" />
          <Heading as="h1" size="xl" fontWeight="bold">
            Sign In
          </Heading>
          <Text fontSize="md" color="gray.600">
            Welcome back! Sign in to manage your travel memories
          </Text>
        </VStack>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                size="lg"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                size="lg"
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              width="full"
              mt={4}
              isLoading={loading}
              loadingText="Signing in"
            >
              Sign In
            </Button>
          </VStack>
        </form>

        <Text mt={6} textAlign="center">
          Don't have an account?{' '}
          <Link as={RouterLink} to="/register" color="brand.500" fontWeight="semibold">
            Sign Up Now
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default LoginForm;