import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = 'http://localhost:7051/api/admin/stats'; // Replace with your actual API URL
  
  constructor(private http: HttpClient) {}
  
  getSystemStats(): Observable<{
    totalUsers: number;
    activeUsers: number;
    totalTrips: number;
    totalImages: number;
    totalAiImages: number;
    totalStorageUsed: number;
  }> {
    return this.http.get<any>(`${this.apiUrl}/system`);
  }
  
  getStorageStats(): Observable<{
    totalCapacity: number;
    usedStorage: number;
    availableStorage: number;
    storageByUserType: { label: string; value: number }[];
  }> {
    return this.http.get<any>(`${this.apiUrl}/storage`);
  }
  
  getUserActivityStats(params: {
    startDate?: string;
    endDate?: string;
    timeFrame?: 'day' | 'week' | 'month';
  } = {}): Observable<{
    newUsersOverTime: { date: string; count: number }[];
    loginActivity: { date: string; count: number }[];
  }> {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] !== undefined) {
        httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
      }
    });
    
    return this.http.get<any>(`${this.apiUrl}/user-activity`, { params: httpParams });
  }
  
  getContentStats(params: {
    startDate?: string;
    endDate?: string;
    timeFrame?: 'day' | 'week' | 'month';
  } = {}): Observable<{
    tripsCreatedOverTime: { date: string; count: number }[];
    imagesUploadedOverTime: { date: string; count: number }[];
    aiImagesGeneratedOverTime: { date: string; count: number }[];
  }> {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] !== undefined) {
        httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
      }
    });
    
    return this.http.get<any>(`${this.apiUrl}/content`, { params: httpParams });
  }
  
  getAiUsageStats(params: {
    startDate?: string;
    endDate?: string;
    timeFrame?: 'day' | 'week' | 'month';
  } = {}): Observable<{
    imagesGeneratedOverTime: { date: string; count: number }[];
  }> {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] !== undefined) {
        httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
      }
    });
    
    return this.http.get<any>(`${this.apiUrl}/ai-usage`, { params: httpParams });
  }
  
  getTopUsersByStorage(limit: number = 5): Observable<{
    userId: string;
    username: string;
    email: string;
    storageUsed: number;
    quota: number;
    percentUsed: number;
  }[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-users/storage`, {
      params: { limit: limit.toString() }
    });
  }
  
  getTopUsersByAiUsage(limit: number = 5): Observable<{
    userId: string;
    username: string;
    email: string;
    aiImagesGenerated: number;
    quota: number;
    percentUsed: number;
  }[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-users/ai`, {
      params: { limit: limit.toString() }
    });
  }
}