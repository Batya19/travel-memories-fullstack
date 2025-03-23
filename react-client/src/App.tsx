import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import theme from './theme';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LoadingSpinner from './components/common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Protected Route Component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Authenticating..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: React.ReactNode;
}

// Public route that redirects authenticated users to homepage
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Authenticating..." />;
  }

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes (only accessible when not logged in) */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />
      
      {/* Protected routes (require authentication) */}
      <Route 
        path="/" 
        element={
          <HomePage />
        } 
      />
      
      {/* Add more routes here */}
      
      {/* Fallback route - redirect to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <Box width="100%" height="100vh">
        <Router>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </Router>
      </Box>
    </ChakraProvider>
  );
};

export default App;