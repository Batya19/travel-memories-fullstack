import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StatisticsResponse } from '../models/statistics-response.model';
import { UserActivityItem } from '../models/user-activity-item.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getSystemStats(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(`${this.apiUrl}/admin/stats`);
  }

  getUserActivity(limit: number): Observable<UserActivityItem[]> {
    return this.http.get<UserActivityItem[]>(`${this.apiUrl}/admin/user-activity?limit=${limit}`);
  }
}