// Format date in short format: "Dec 7, 2024"
export const formatDateShort = (dateString: string | Date | null): string => {
    if (!dateString) return 'Unknown date';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Format date in long format: "December 7, 2024"
export const formatDateLong = (dateString: string | Date | null): string => {
    if (!dateString) return 'Unknown date';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Format date range: "Dec 7 - Dec 10, 2024"
export const formatDateRange = (startDate: string | Date, endDate: string | Date): string => {
    return `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
};

// Format date range in long format: "December 7 - December 10, 2024"
export const formatDateRangeLong = (startDate: string | Date, endDate: string | Date): string => {
    return `${formatDateLong(startDate)} - ${formatDateLong(endDate)}`;
};

// Calculate days between dates (inclusive)
export const calculateDaysBetween = (startDate: string | Date, endDate: string | Date): number => {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export const isPastDate = (dateString: string | Date): boolean => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date < new Date();
};

export const isFutureDate = (dateString: string | Date): boolean => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date > new Date();
};

// Format relative time: "2 days ago", "in 3 days"
export const formatRelativeTime = (dateString: string | Date): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays === -1) return 'Yesterday';
    if (diffInDays > 0) return `in ${diffInDays} days`;
    return `${Math.abs(diffInDays)} days ago`;
};

