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
import AIImageGenerator from './pages/ai/AIImageGenerator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null; // Or loading spinner
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});



function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
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
                  <Route path="/ai-images" element={<AIImageGenerator />} />
                  <Route path="/trips/:tripId/ai-images" element={<AIImageGenerator />} />
                  {/* Catch-all route for 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
              </TripProvider>
            </AuthProvider>
          </Router>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ChakraProvider>
    </>
  );
}

export default App;