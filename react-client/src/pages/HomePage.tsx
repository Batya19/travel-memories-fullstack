import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useImageCache } from '../contexts/ImageCacheContext';
import HeroSection from '../components/features/home/HeroSection';
import RecentTripsSection from '../components/features/home/RecentTripsSection';
import FeaturesSection from '../components/features/home/FeaturesSection';
import CTASection from '../components/features/home/CTASection';
import MapDashboardSection from '../components/features/home/MapDashboardSection';
import { useQuery } from '@tanstack/react-query';
import tripService from '../services/tripService';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { preloadImagesForTrips, getCachedImages } = useImageCache();

  // Fetch trips if user is logged in
  const { 
    data: trips = [], 
    isLoading: tripsLoading, 
    error: tripsError 
  } = useQuery({
    queryKey: ['homeTrips'],
    queryFn: tripService.getTrips,
    enabled: !!currentUser,
    select: (data) => data.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  });

  // Preload images when trips are loaded
  useEffect(() => {
    if (trips.length > 0) {
      const tripIds = trips.slice(0, 5).map(t => t.id);
      preloadImagesForTrips(tripIds);
    }
  }, [trips, preloadImagesForTrips]);

  // Get images from cache
  const images = trips.slice(0, 5).flatMap(trip => getCachedImages(trip.id) || []);
  
  const isLoading = tripsLoading;
  const error = tripsError ? (tripsError as Error)?.message : null;

  return (
    <Box>
      {/* Display different content based on login status */}
      {currentUser ? (
        // For logged-in users, show the map dashboard
        <MapDashboardSection 
          trips={trips} 
          images={images}
          loading={isLoading}
          error={error}
          user={{
            firstName: currentUser.firstName,
            lastName: currentUser.lastName
          }}
        />
      ) : (
        // For non-logged-in users, show the original hero section with video
        <HeroSection />
      )}

      {/* Recent Trips Section - Only shown to logged in users */}
      {currentUser && (
        <RecentTripsSection
          trips={trips.slice(0, 4)} // Show only 4 trips in this section
          loading={isLoading}
          error={error}
        />
      )}

      {/* Features Section - Shown to everyone */}
      <FeaturesSection />

      {/* Call to Action Section - Only shown to non-logged in users */}
      {!currentUser && <CTASection />}
    </Box>
  );
};

export default HomePage;