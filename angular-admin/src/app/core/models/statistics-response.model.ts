import { UserActivityItem } from "./user-activity-item.model";

export interface StatisticsResponse {
    totalUsers: number;
    totalTrips: number;
    totalImages: number;
    totalAiImages: number;
    totalStorageUsedMB: number;
    recentUserActivity?: UserActivityItem[];
    usersByMonth?: { [month: string]: number };
    tripsByMonth?: { [month: string]: number };
    imagesByMonth?: { [month: string]: number };
}

export interface GrowthDataPoint {
    date: string;
    value: number;
}