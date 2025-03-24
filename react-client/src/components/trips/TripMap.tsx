import React from 'react';
import { Box } from '@chakra-ui/react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TripMapProps {
  latitude: number;
  longitude: number;
  locationName?: string;
}

const TripMap: React.FC<TripMapProps> = ({ latitude, longitude, locationName }) => {
  const position: [number, number] = [latitude, longitude];
  
  return (
    <Box 
      height="100%" 
      width="100%" 
      borderRadius="md"
      overflow="hidden"
    >
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          {locationName && <Popup>{locationName}</Popup>}
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default TripMap;