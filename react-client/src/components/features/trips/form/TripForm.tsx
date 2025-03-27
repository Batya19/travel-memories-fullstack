import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    VStack,
    Heading,
    Textarea,
    Flex,
    useToast,
    Text,
    HStack,
    IconButton,
} from '@chakra-ui/react';
import { Trip } from '../../../../types';
import tripService from '../../../../services/tripService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import MapLocationPicker from '../map/MapLocationPicker';

interface TripFormProps {
    initialData?: Partial<Trip>;
    isEditing?: boolean;
}

interface FormErrors {
    [key: string]: string;
}

const TripForm: React.FC<TripFormProps> = ({ initialData, isEditing = false }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
        endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date(),
        locationName: initialData?.locationName || '',
        latitude: initialData?.latitude || undefined,
        longitude: initialData?.longitude || undefined,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [showMap, setShowMap] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setFormData({ ...formData, startDate: date });
            if (errors.startDate) {
                setErrors({ ...errors, startDate: '' });
            }

            // If the end date is before the start date, update it
            if (formData.endDate < date) {
                setFormData(prev => ({ ...prev, endDate: date }));
            }
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            setFormData({ ...formData, endDate: date });
            if (errors.endDate) {
                setErrors({ ...errors, endDate: '' });
            }
        }
    };

    const handleLocationSelect = (locationName: string, lat: number, lng: number) => {
        setFormData({
            ...formData,
            locationName,
            latitude: lat,
            longitude: lng
        });
        setShowMap(false);

        if (errors.locationName) {
            setErrors({ ...errors, locationName: '' });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Trip name is required';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'End date is required';
        }

        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
            newErrors.endDate = 'End date cannot be before start date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            const tripData = {
                name: formData.name,
                description: formData.description,
                startDate: formData.startDate.toISOString(),
                endDate: formData.endDate.toISOString(),
                locationName: formData.locationName,
                latitude: formData.latitude,
                longitude: formData.longitude,
            };

            if (isEditing && initialData?.id) {
                await tripService.updateTrip(initialData.id, tripData);
                toast({
                    title: 'Trip updated',
                    description: `${formData.name} has been updated successfully.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                navigate(`/trips/${initialData.id}`);
            } else {
                const newTrip = await tripService.createTrip(tripData);
                toast({
                    title: 'Trip created',
                    description: `${formData.name} has been created successfully.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                navigate(`/trips/${newTrip.id}`);
            }
        } catch (error) {
            console.error('Error saving trip:', error);
            toast({
                title: 'Error',
                description: 'There was an error saving your trip. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxW="800px" mx="auto" py={8} px={4}>
            <Heading as="h1" size="xl" mb={6}>
                {isEditing ? 'Edit Trip' : 'Create New Trip'}
            </Heading>

            <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="start">
                    <FormControl isInvalid={!!errors.name} isRequired>
                        <FormLabel htmlFor="name">Trip Name</FormLabel>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter a name for your trip"
                        />
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            placeholder="Describe your trip (optional)"
                            rows={4}
                        />
                    </FormControl>

                    <Flex width="100%" gap={4} direction={{ base: 'column', md: 'row' }}>
                        <FormControl isInvalid={!!errors.startDate} isRequired flex="1">
                            <FormLabel htmlFor="startDate">Start Date</FormLabel>
                            <Box border="1px solid" borderColor="gray.200" borderRadius="md">
                                <DatePicker
                                    selected={formData.startDate}
                                    onChange={handleStartDateChange}
                                    selectsStart
                                    startDate={formData.startDate}
                                    endDate={formData.endDate}
                                    dateFormat="MMMM d, yyyy"
                                    className="chakra-input"
                                    wrapperClassName="date-picker-wrapper"
                                />
                            </Box>
                            <FormErrorMessage>{errors.startDate}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.endDate} isRequired flex="1">
                            <FormLabel htmlFor="endDate">End Date</FormLabel>
                            <Box border="1px solid" borderColor="gray.200" borderRadius="md">
                                <DatePicker
                                    selected={formData.endDate}
                                    onChange={handleEndDateChange}
                                    selectsEnd
                                    startDate={formData.startDate}
                                    endDate={formData.endDate}
                                    minDate={formData.startDate}
                                    dateFormat="MMMM d, yyyy"
                                    className="chakra-input"
                                    wrapperClassName="date-picker-wrapper"
                                />
                            </Box>
                            <FormErrorMessage>{errors.endDate}</FormErrorMessage>
                        </FormControl>
                    </Flex>

                    <FormControl isInvalid={!!errors.locationName}>
                        <FormLabel htmlFor="locationName">Location</FormLabel>
                        <HStack>
                            <Input
                                id="locationName"
                                name="locationName"
                                value={formData.locationName || ''}
                                onChange={handleChange}
                                placeholder="Enter location name (optional)"
                                readOnly={!!formData.latitude && !!formData.longitude}
                            />
                            <IconButton
                                aria-label="Pick location on map"
                                icon={<FaMapMarkerAlt />}
                                onClick={() => setShowMap(!showMap)}
                                colorScheme="brand"
                            />
                        </HStack>
                        {formData.latitude && formData.longitude && (
                            <Text fontSize="sm" color="gray.500" mt={1}>
                                Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                            </Text>
                        )}
                        <FormErrorMessage>{errors.locationName}</FormErrorMessage>
                    </FormControl>

                    {showMap && (
                        <Box width="100%" height="400px" borderRadius="md" overflow="hidden">
                            <MapLocationPicker
                                onLocationSelect={handleLocationSelect}
                                initialLatitude={formData.latitude}
                                initialLongitude={formData.longitude}
                            />
                        </Box>
                    )}

                    <Flex width="100%" justify="space-between" mt={4}>
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            colorScheme="brand"
                            isLoading={loading}
                            loadingText={isEditing ? "Updating" : "Creating"}
                        >
                            {isEditing ? 'Update Trip' : 'Create Trip'}
                        </Button>
                    </Flex>
                </VStack>
            </form>
        </Box>
    );
};

export default TripForm;