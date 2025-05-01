export interface UserActivityItem {
  id: string;
  userId: string;
  userName: string;
  action: ActivityAction;
  entityType: EntityType;
  entityId: string;
  entityName: string;
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