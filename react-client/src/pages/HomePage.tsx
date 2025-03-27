// Updated HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Trip, Image } from '../types';
import tripService from '../services/tripService';
import imageService from '../services/imageService';
import { useAuth } from '../contexts/AuthContext';
import HeroSection from '../components/features/home/HeroSection';
import RecentTripsSection from '../components/features/home/RecentTripsSection';
import FeaturesSection from '../components/features/home/FeaturesSection';
import CTASection from '../components/features/home/CTASection';
import MapDashboardSection from '../components/features/home/MapDashboardSection';

const HomePage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch trips
        const tripsData = await tripService.getTrips();
        const sortedTrips = tripsData.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTrips(sortedTrips);
        
        // Fetch images for the recent trips
        // Limit to 5 trips to avoid too many API calls
        const recentTripsForImages = sortedTrips.slice(0, 5);
        
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
        const allImages = imageResults.flat();
        setImages(allImages);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load your travel data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <Box>
      {/* Display different content based on login status */}
      {currentUser ? (
        // For logged-in users, show the map dashboard
        <MapDashboardSection 
          trips={trips} 
          images={images}
          loading={loading}
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
          loading={loading}
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