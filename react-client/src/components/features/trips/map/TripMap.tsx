import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';

interface TripMapProps {
    latitude: number;
    longitude: number;
    locationName?: string;
}

const TripMap: React.FC<TripMapProps> = ({ latitude, longitude, locationName }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const initMap = async () => {
            try {
                // Dynamically import leaflet to avoid SSR issues
                const L = (await import('leaflet')).default;

                // Fix leaflet's icon paths
                delete (L.Icon.Default.prototype as any)._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                });

                // Create map if it doesn't exist
                if (!mapInstanceRef.current) {
                    // Initialize the map
                    const map = L.map(mapRef.current!).setView([latitude, longitude], 13);

                    // Add OpenStreetMap tiles
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);

                    // Add marker
                    markerRef.current = L.marker([latitude, longitude]).addTo(map);

                    // Add popup with location name if provided
                    if (locationName) {
                        markerRef.current.bindPopup(locationName).openPopup();
                    }

                    // Store map instance
                    mapInstanceRef.current = map;
                } else {
                    // If map exists, update the view and marker position
                    mapInstanceRef.current.setView([latitude, longitude], 13);

                    if (markerRef.current) {
                        markerRef.current.setLatLng([latitude, longitude]);

                        if (locationName) {
                            markerRef.current.bindPopup(locationName).openPopup();
                        }
                    }
                }
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        initMap();

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, [latitude, longitude, locationName]);

    // Handle window resize to update map size
    useEffect(() => {
        const handleResize = () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Box
            ref={mapRef}
            height="100%"
            width="100%"
            borderRadius="md"
            className="leaflet-container"
            sx={{
                '.leaflet-container': {
                    height: '100%',
                    width: '100%',
                }
            }}
        />
    );
};

export default TripMap;