import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Flex, Spinner } from '@chakra-ui/react';
import { useTrip } from '../../hooks/useQueryHooks';
import TripForm from '../../components/features/trips/form/TripForm';

interface TripFormPageProps {
    isEditing?: boolean;
}

const TripFormPage: React.FC<TripFormPageProps> = ({ isEditing = false }) => {
    const { id } = useParams<{ id: string }>();

    // Only fetch trip data if we're editing
    const { 
        data: trip, 
        isLoading: isLoadingTrip,
        error 
    } = useTrip(isEditing ? id : undefined);

    if (isEditing && isLoadingTrip) {
        return (
            <Flex justify="center" align="center" minH="50vh">
                <Spinner size="xl" color="brand.500" />
            </Flex>
        );
    }

    if (isEditing && error) {
        return (
            <Container maxW="container.xl" py={8}>
                <Flex direction="column" align="center">
                    <Spinner size="xl" color="brand.500" mb={4} />
                    <p>Error loading trip data. Please try again.</p>
                </Flex>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <TripForm initialData={trip} isEditing={isEditing} />
        </Container>
    );
};

export default TripFormPage;