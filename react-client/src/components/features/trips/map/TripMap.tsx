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
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const initMap = async () => {
            try {
                const L = (await import('leaflet')).default;
                
                // Fix leaflet's icon paths
                delete ((L.Icon.Default.prototype as unknown) as Record<string, unknown>)._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                });

                if (!mapInstanceRef.current) {
                    const map = L.map(mapRef.current!).setView([latitude, longitude], 13);
                    
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);

                    markerRef.current = L.marker([latitude, longitude]).addTo(map);
                    
                    // Create custom styled popup
                    if (locationName) {
                        const customPopupContent = `
                            <div style="
                                background: white;
                                padding: 12px 16px;
                                border-radius: 8px;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                                border: 1px solid #e2e8f0;
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                                min-width: 200px;
                                text-align: center;
                            ">
                                <div style="
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    gap: 8px;
                                ">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#e53e3e">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    <span style="
                                        font-size: 14px;
                                        font-weight: 600;
                                        color: #2d3748;
                                        margin: 0;
                                    ">${locationName}</span>
                                </div>
                            </div>
                        `;
                        
                        markerRef.current.bindPopup(customPopupContent, {
                            closeButton: true,
                            autoClose: true,
                            className: 'custom-popup'
                        }).openPopup();
                    }

                    mapInstanceRef.current = map;
                } else {
                    mapInstanceRef.current.setView([latitude, longitude], 13);
                    if (markerRef.current) {
                        markerRef.current.setLatLng([latitude, longitude]);
                        if (locationName) {
                            const customPopupContent = `
                                <div style="
                                    background: white;
                                    padding: 12px 16px;
                                    border-radius: 8px;
                                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                                    border: 1px solid #e2e8f0;
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                                    min-width: 200px;
                                    text-align: center;
                                ">
                                    <div style="
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        gap: 8px;
                                    ">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#e53e3e">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                        </svg>
                                        <span style="
                                            font-size: 14px;
                                            font-weight: 600;
                                            color: #2d3748;
                                            margin: 0;
                                        ">${locationName}</span>
                                    </div>
                                </div>
                            `;
                            
                            markerRef.current.bindPopup(customPopupContent, {
                                closeButton: true,
                                autoClose: true,
                                className: 'custom-popup'
                            }).openPopup();
                        }
                    }
                }
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        initMap();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, [latitude, longitude, locationName]);

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
                },
                // Custom popup styles to remove default leaflet styling
                '.custom-popup .leaflet-popup-content-wrapper': {
                    background: 'transparent !important',
                    boxShadow: 'none !important',
                    border: 'none !important',
                    borderRadius: 0,
                    padding: 0,
                },
                '.custom-popup .leaflet-popup-content': {
                    margin: 0,
                    padding: 0,
                },
                '.custom-popup .leaflet-popup-tip': {
                    background: 'white !important',
                    border: '1px solid #e2e8f0 !important',
                    borderTop: 'none !important',
                    borderRight: 'none !important',
                }
            }}
        />
    );
};

export default TripMap;