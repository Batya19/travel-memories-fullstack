export interface StatisticsResponse {
    totalUsers: number;
    totalTrips: number;
    totalImages: number;
    aiGeneratedImages: number;
    usersGrowth: GrowthDataPoint[];
    tripsGrowth: GrowthDataPoint[];
    imagesGrowth: GrowthDataPoint[];
    storageUsed: number;
    totalStorageQuota: number;
}

export interface GrowthDataPoint {
    date: string;
    value: number;
}
