import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Image,
  Text,
  Heading,
  Flex,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Trip } from '../../../../types';
import L from 'leaflet';
import { useImageCache } from '../../../../contexts/ImageCacheContext';
import LoadingSpinner from '../../../common/feedback/LoadingSpinner';
import ImagePlaceholder from '../../../common/media/ImagePlaceholder';
import { getImageUrl } from '../../../../utils/imageUtils';
import { initializeLeafletIcons, createCustomIcon } from '../../../../utils/leafletUtils';
import { formatDateRange } from '../../../../utils/dateUtils';

// Initialize Leaflet icons
initializeLeafletIcons();

interface TripMarkerProps {
  trip: Trip;
}

interface HomePageMapProps {
  trips: Trip[];
  loading: boolean;
  user?: {
    firstName: string;
    lastName: string;
  } | null;
}

const TripMarker: React.FC<TripMarkerProps> = React.memo(({ trip }) => {
  const navigate = useNavigate();
  const { getCachedImages } = useImageCache();
  const popupBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const markerRef = useRef<L.Marker>(null);
  const popupRef = useRef<L.Popup>(null);

  // Get images from cache
  const images = getCachedImages(trip.id);
  const firstImage = images && images.length > 0 ? images[0] : null;
  const loading = false; // No loading since we're using cached data

  const handleClick = () => {
    navigate(`/trips/${trip.id}`);
  };

  // הוספת event handlers לתמיכה ב-hover
  const eventHandlers = {
    click: handleClick,
    mouseover: () => {
      markerRef.current?.openPopup();
    },
    mouseout: () => {
      // אם תרצה שהפופאפ ייסגר כשהעכבר עוזב את הסמן, שחרר מההערה:
      // markerRef.current?.closePopup();
    }
  };

  // Only show markers for trips with location coordinates
  if (!trip.latitude || !trip.longitude) {
    return null;
  }

  const icon = createCustomIcon();

  return (
    <Marker 
      position={[trip.latitude, trip.longitude]}
      eventHandlers={eventHandlers}
      icon={icon}
      ref={markerRef}
    >
      <Popup ref={popupRef}>
        <Box 
          width="250px" 
          bg={popupBg} 
          borderRadius="md" 
          overflow="hidden"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Box height="120px" position="relative">
            {loading ? (
              <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                <LoadingSpinner size="sm" />
              </Box>
            ) : firstImage ? (
              <Image 
                src={getImageUrl(firstImage)} 
                alt={trip.name} 
                width="100%" 
                height="100%" 
                objectFit="cover"
              />
            ) : (
              <ImagePlaceholder text={trip.name} height="120px" />
            )}
          </Box>
          
          <Box p={3}>
            <Heading as="h4" size="sm" noOfLines={1} mb={1}>
              {trip.name}
            </Heading>
            
            <Flex align="center" justify="space-between" fontSize="xs" mb={1}>
              <Text color="gray.500">
                {formatDateRange(trip.startDate, trip.endDate)}
              </Text>
            </Flex>
            
            {trip.locationName && (
              <Badge colorScheme="brand" fontSize="xs" mt={1}>
                {trip.locationName}
              </Badge>
            )}
          </Box>
        </Box>
      </Popup>
    </Marker>
  );
});

TripMarker.displayName = 'TripMarker';

const HomePageMap: React.FC<HomePageMapProps> = ({ trips, loading }) => {
  // Find center of map based on trip locations or default to a center point
  const getMapCenter = () => {
    const tripsWithCoords = trips.filter(trip => trip.latitude && trip.longitude);
    
    if (tripsWithCoords.length === 0) {
      return [31.0461, 34.8516]; // Default center (Israel)
    }
    
    // Calculate average lat/lng
    const totalLat = tripsWithCoords.reduce((sum, trip) => sum + (trip.latitude || 0), 0);
    const totalLng = tripsWithCoords.reduce((sum, trip) => sum + (trip.longitude || 0), 0);
    
    return [
      totalLat / tripsWithCoords.length,
      totalLng / tripsWithCoords.length
    ];
  };
  
  return (
    <>
      {loading ? (
        <Flex height="100%" alignItems="center" justifyContent="center">
          <LoadingSpinner text="Loading map..." />
        </Flex>
      ) : trips.filter(trip => trip.latitude && trip.longitude).length === 0 ? (
        <Flex height="100%" alignItems="center" justifyContent="center" direction="column" p={4} textAlign="center">
          <Heading as="h3" size="md" mb={2}>No trip locations found</Heading>
          <Text>Add location coordinates to your trips to see them on this map.</Text>
        </Flex>
      ) : (
        <MapContainer
          center={getMapCenter() as [number, number]}
          zoom={3}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {trips.map((trip) => (
            trip.latitude && trip.longitude && (
              <TripMarker key={trip.id} trip={trip} />
            )
          ))}
        </MapContainer>
      )}
    </>
  );
};

export default HomePageMap;