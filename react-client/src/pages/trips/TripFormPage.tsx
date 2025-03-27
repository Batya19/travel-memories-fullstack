import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Flex } from '@chakra-ui/react';
import tripService from '../../services/tripService';
import { Trip } from '../../types';
import TripForm from '../../components/features/trips/form/TripForm';

interface TripFormPageProps {
    isEditing?: boolean;
}

const TripFormPage: React.FC<TripFormPageProps> = ({ isEditing = false }) => {
    const { id } = useParams<{ id: string }>();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(isEditing);

    useEffect(() => {
        const fetchTrip = async () => {
            if (isEditing && id) {
                setLoading(true);
                try {
                    const tripData = await tripService.getTrip(id);
                    setTrip(tripData);
                } catch (error) {
                    console.error('Error fetching trip:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTrip();
    }, [id, isEditing]);

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="50vh">
                <Spinner size="xl" color="brand.500" />
            </Flex>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <TripForm initialData={trip || undefined} isEditing={isEditing} />
        </Container>
    );
};

export default TripFormPage;