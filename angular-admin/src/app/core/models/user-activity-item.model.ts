export interface UserActivityItem {
  userId: string;
  userEmail: string;
  activityType: string;
  description: string;
  timestamp: Date;
}

export enum ActivityAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN'
}

export enum EntityType {
  USER = 'USER',
  TRIP = 'TRIP',
  IMAGE = 'IMAGE',
  SYSTEM = 'SYSTEM'
}