import React, { ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingStateProps {
    isLoading: boolean;
    loadingText?: string;
    children: ReactNode;
    minHeight?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    isLoading,
    loadingText = 'Loading...',
    children,
}) => {
    if (isLoading) {
        return <LoadingSpinner text={loadingText} />;
    }

    return <>{children}</>;
};

export default LoadingState;