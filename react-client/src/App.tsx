import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import theme from './theme';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import TripDetailPage from './pages/trips/TripDetailPage';
import TripsPage from './pages/trips/TripsPage';
import TripFormPage from './pages/trips/TripFormPage';
import SharedTripPage from './pages/trips/SharedTripPage';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null; // Or loading spinner
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/trips/shared/:shareId" element={<SharedTripPage />} />

            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />

            <Route path="/trips" element={
              <ProtectedRoute>
                <TripsPage />
              </ProtectedRoute>
            } />

            <Route path="/trips/new" element={
              <ProtectedRoute>
                <TripFormPage />
              </ProtectedRoute>
            } />

            <Route path="/trips/:id" element={
              <ProtectedRoute>
                <TripDetailPage />
              </ProtectedRoute>
            } />

            <Route path="/trips/:id/edit" element={
              <ProtectedRoute>
                <TripFormPage isEditing />
              </ProtectedRoute>
            } />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;