import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, ColorModeScript, Spinner, Flex } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import TripProvider from './contexts/TripContext';
import { ImageCacheProvider } from './contexts/ImageCacheContext';
import theme from './theme';
import HomePage from './pages/HomePage';
import Header from './components/common/layout/Header';
import Footer from './components/common/layout/Footer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Lazy load heavy components
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const NotFoundPage = lazy(() => import('./pages/error/NotFoundPage'));
const TripDetailPage = lazy(() => import('./pages/trips/TripDetailPage'));
const TripsPage = lazy(() => import('./pages/trips/TripsPage'));
const TripFormPage = lazy(() => import('./pages/trips/TripFormPage'));
const SharedTripPage = lazy(() => import('./pages/trips/SharedTripPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AIImageGenerator = lazy(() => import('./pages/ai/AIImageGenerator'));
const TermsOfServicePage = lazy(() => import('./pages/legal/TermsOfServicePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'));

// Loading component
const PageLoader = () => (
  <Flex justify="center" align="center" minH="60vh">
    <Spinner size="xl" color="brand.500" thickness="4px" />
  </Flex>
);

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
      staleTime: 1000 * 60 * 10, // 10 minutes cache
      gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Don't refetch on component mount if data exists
      refetchOnReconnect: false,
      retry: 1,
      networkMode: 'online', // Only run queries when online
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
              <ImageCacheProvider>
                <TripProvider>
                  <Header />
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/trips/shared/:shareId" element={<SharedTripPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/terms" element={<TermsOfServicePage />} />
                      <Route path="/privacy" element={<PrivacyPolicyPage />} />

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
                  </Suspense>
                  <Footer />
                </TripProvider>
              </ImageCacheProvider>
            </AuthProvider>
          </Router>
        </QueryClientProvider>
      </ChakraProvider>
    </>
  );
}

export default App;