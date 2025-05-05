export interface UserActivityItem {
  userId: string;
  userEmail: string;
  activityType: string;
  description: string;
  timestamp: Date;
}

export enum EntityType {
  USER = 'USER',
  TRIP = 'TRIP',
  IMAGE = 'IMAGE',
  SYSTEM = 'SYSTEM'
}