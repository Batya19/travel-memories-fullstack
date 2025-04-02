import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import TripProvider from './contexts/TripContext';
import theme from './theme';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/error/NotFoundPage';
import TripDetailPage from './pages/trips/TripDetailPage';
import TripsPage from './pages/trips/TripsPage';
import TripFormPage from './pages/trips/TripFormPage';
import SharedTripPage from './pages/trips/SharedTripPage';
import Header from './components/common/layout/Header';
import Footer from './components/common/layout/Footer';
import ProfilePage from './pages/ProfilePage';

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
    <>
      {/* Color mode script */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <Router>
          <AuthProvider>
            <TripProvider>
              <Header />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/trips/shared/:shareId" element={<SharedTripPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Protected routes */}
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
            </TripProvider>
          </AuthProvider>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;