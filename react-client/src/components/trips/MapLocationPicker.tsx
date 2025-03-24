import React, { useEffect, useState } from 'react';
import { Box, Button, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapLocationPickerProps {
    onLocationSelect: (locationName: string, latitude: number, longitude: number) => void;
    initialLatitude?: number;
    initialLongitude?: number;
}

// Map controller component for events and updates
const MapController: React.FC<{
    setMarkerPosition: (lat: number, lng: number) => void;
    fetchLocationName: (lat: number, lng: number) => void;
}> = ({ setMarkerPosition, fetchLocationName }) => {
    const map = useMap();

    useEffect(() => {
        map.on('click', (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            setMarkerPosition(lat, lng);
            fetchLocationName(lat, lng);
        });

        return () => {
            map.off('click');
        };
    }, [map, setMarkerPosition, fetchLocationName]);

    return null;
};

const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
    onLocationSelect,
    initialLatitude,
    initialLongitude
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
        initialLatitude && initialLongitude ? [initialLatitude, initialLongitude] : null
    );
    const [selectedLocation, setSelectedLocation] = useState({
        lat: initialLatitude || 0,
        lng: initialLongitude || 0,
        name: ''
    });

    const fetchLocationName = async (lat: number, lng: number) => {
        try {
            // Using Nominatim for reverse geocoding (free OpenStreetMap service)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();

            let locationName = 'Unknown location';
            if (data && data.display_name) {
                locationName = data.display_name;
            }

            setSelectedLocation({
                lat,
                lng,
                name: locationName
            });
        } catch (error) {
            console.error('Error fetching location name:', error);
            setSelectedLocation({
                lat,
                lng,
                name: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`
            });
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        try {
            // Using Nominatim for geocoding (free OpenStreetMap service)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);

                setMarkerPosition([lat, lng]);
                setSelectedLocation({
                    lat,
                    lng,
                    name: result.display_name
                });
            }
        } catch (error) {
            console.error('Error searching location:', error);
        }
    };

    const handleConfirmLocation = () => {
        if (selectedLocation.lat && selectedLocation.lng) {
            onLocationSelect(
                selectedLocation.name,
                selectedLocation.lat,
                selectedLocation.lng
            );
        }
    };

    // Default to Jerusalem if no initial coordinates
    const defaultPosition: [number, number] = [
        initialLatitude || 31.7683,
        initialLongitude || 35.2137
    ];

    return (
        <Box position="relative" height="100%" width="100%">
            {/* Map container */}
            <Box height="100%" width="100%" id="map-container">
                <MapContainer
                    center={markerPosition || defaultPosition}
                    zoom={markerPosition ? 13 : 8}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {markerPosition && <Marker position={markerPosition} />}
                    <MapController
                        setMarkerPosition={(lat, lng) => setMarkerPosition([lat, lng])}
                        fetchLocationName={fetchLocationName}
                    />
                </MapContainer>
            </Box>

            {/* Search and controls overlay */}
            <VStack
                position="absolute"
                top={2}
                left={2}
                right={2}
                zIndex={1000}
                spacing={2}
                align="stretch"
                backgroundColor="rgba(255, 255, 255, 0.8)"
                p={2}
                borderRadius="md"
            >
                <InputGroup size="md">
                    <Input
                        placeholder="Search for a location"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        backgroundColor="white"
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleSearch}>
                            Search
                        </Button>
                    </InputRightElement>
                </InputGroup>

                <Button
                    colorScheme="brand"
                    onClick={handleConfirmLocation}
                    isDisabled={!selectedLocation.lat || !selectedLocation.lng}
                >
                    Confirm Location
                </Button>
            </VStack>
        </Box>
    );
};

export default MapLocationPicker;