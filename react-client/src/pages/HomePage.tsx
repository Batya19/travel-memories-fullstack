import React from 'react';
import { Box } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import HeroSection from '../components/features/home/HeroSection';
import RecentTripsSection from '../components/features/home/RecentTripsSection';
import FeaturesSection from '../components/features/home/FeaturesSection';
import CTASection from '../components/features/home/CTASection';
import MapDashboardSection from '../components/features/home/MapDashboardSection';
import { useQuery } from '@tanstack/react-query';
import tripService from '../services/tripService';
import imageService from '../services/imageService';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();

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

  // Fetch images for the recent trips
  const { 
    data: images = [], 
    isLoading: imagesLoading,
    error: imagesError 
  } = useQuery({
    queryKey: ['homeImages', trips],
    queryFn: async () => {
      // Limit to 5 trips to avoid too many API calls
      const recentTripsForImages = trips.slice(0, 5);
      
      // Create an array of promises for fetching images
      const imagePromises = recentTripsForImages.map(trip => 
        imageService.getImages(trip.id).catch(err => {
          console.error(`Error fetching images for trip ${trip.id}:`, err);
          return []; // Return empty array if error occurs
        })
      );
      
      // Wait for all image fetch operations to complete
      const imageResults = await Promise.all(imagePromises);
      
      // Flatten the array of image arrays into a single array
      return imageResults.flat();
    },
    enabled: !!currentUser && trips.length > 0,
  });

  const isLoading = tripsLoading || imagesLoading;
  const error = tripsError || imagesError ? 
    (tripsError as Error)?.message || (imagesError as Error)?.message : 
    null;

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