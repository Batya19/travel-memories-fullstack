// HomePage.tsx - Main component
import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Trip } from '../types';
import tripService from '../services/tripService';
import { useAuth } from '../contexts/AuthContext';
import HeroSection from '../components/sections/HeroSection';
import RecentTripsSection from '../components/sections/RecentTripsSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import CTASection from '../components/sections/CTASection';

const HomePage: React.FC = () => {
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchRecentTrips = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const trips = await tripService.getTrips();
        // Sort trips by date (most recent first) and take only the first 4
        const sortedTrips = trips
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);
        setRecentTrips(sortedTrips);
      } catch (err) {
        console.error('Error fetching recent trips:', err);
        setError('Failed to load recent trips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTrips();
  }, [currentUser]);

  return (
    <Box>
      {/* Hero Section - Shown to everyone */}
      <HeroSection />

      {/* Recent Trips Section - Only shown to logged in users */}
      {currentUser && (
        <RecentTripsSection
          trips={recentTrips}
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