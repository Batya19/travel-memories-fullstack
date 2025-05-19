import React, { useState } from 'react';
import {
  Button,
  VStack,
  HStack,
  Checkbox,
  Link,
  Text,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { RegisterFormData } from '../../../types';
import { useForm } from '../../../hooks/useForm';
import FormInput from '../../common/forms/FormInput';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register, loading } = useAuth();
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  // Validation function
  const validateForm = (values: RegisterFormData) => {
    const errors: Record<string, string> = {};

    if (!values.firstName) {
      errors.firstName = 'First name is required';
    }

    if (!values.lastName) {
      errors.lastName = 'Last name is required';
    }

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!termsAccepted) {
      errors.terms = 'You must agree to the terms and conditions';
    }

    return errors;
  };

  // Form submission handler
  const handleSubmit = async (values: RegisterFormData) => {
    try {
      await register(
        values.email,
        values.password,
        values.firstName,
        values.lastName
      );
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is handled by the AuthContext's toast notifications
    }
  };

  // Use our custom form hook
  const { values, errors, handleChange, handleSubmit: submitForm } = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={submitForm}>
      <VStack spacing={4} align="stretch">
        <HStack spacing={4} w="full">
          <FormInput
            name="firstName"
            label="First Name"
            value={values.firstName}
            onChange={handleChange}
            placeholder="First name"
            size="lg"
            error={errors.firstName}
            isRequired
            formControlProps={{ flex: 1 }}
          />

          <FormInput
            name="lastName"
            label="Last Name"
            value={values.lastName}
            onChange={handleChange}
            placeholder="Last name"
            size="lg"
            error={errors.lastName}
            isRequired
            formControlProps={{ flex: 1 }}
          />
        </HStack>

        <FormInput
          name="email"
          label="Email Address"
          type="email"
          value={values.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          size="lg"
          error={errors.email}
          isRequired
        />

        <FormInput
          name="password"
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange}
          placeholder="Create a password (at least 8 characters)"
          size="lg"
          error={errors.password}
          isRequired
        />

        <FormInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={values.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          size="lg"
          error={errors.confirmPassword}
          isRequired
        />

        <VStack align="start" spacing={1}>
          <Checkbox
            colorScheme="brand"
            isChecked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          >
            I agree to the{' '}
            <Link as={RouterLink} to="/terms" color="brand.500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link as={RouterLink} to="/privacy" color="brand.500">
              Privacy Policy
            </Link>
          </Checkbox>
          {errors.terms && <Text color="red.500" fontSize="sm">{errors.terms}</Text>}
        </VStack>

        <Button
          type="submit"
          colorScheme="brand"
          size="lg"
          width="full"
          mt={4}
          isLoading={loading}
          loadingText="Creating Account"
        >
          Sign Up
        </Button>
      </VStack>
    </form>
  );
};

export default RegisterForm;