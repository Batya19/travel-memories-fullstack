import React from 'react';
import {
  Button,
  VStack,
} from '@chakra-ui/react';
import { useAuth } from '../../../contexts/AuthContext';
import { LoginFormData } from '../../../types';
import { useForm } from '../../../hooks/useForm';
import FormInput from '../../common/forms/FormInput';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, loading } = useAuth();

  // Validation function
  const validateForm = (values: LoginFormData) => {
    const errors: Record<string, string> = {};

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  // Form submission handler
  const handleSubmit = async (values: LoginFormData) => {
    try {
      await login(values.email, values.password);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is handled by the AuthContext's toast notifications
    }
  };

  // Use our custom form hook
  const { values, errors, handleChange, handleSubmit: submitForm } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={submitForm}>
      <VStack spacing={5} align="stretch">
        <FormInput
          name="email"
          label="Email Address"
          type="email"
          value={values.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          size="lg"
          error={errors.email}
        />

        <FormInput
          name="password"
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange}
          placeholder="Enter your password"
          size="lg"
          error={errors.password}
        />

        <Button
          type="submit"
          colorScheme="brand"
          size="lg"
          width="full"
          isLoading={loading}
          loadingText="Signing in"
          mt={4}
        >
          Sign In
        </Button>
      </VStack>
    </form>
  );
};

export default LoginForm;