import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StatisticsResponse } from '../models/statistics-response.model';
import { UserActivityItem } from '../models/user-activity-item.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private readonly API_URL = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  getSystemStats(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(`${this.API_URL}/stats`);
  }

  getUserActivity(limit: number = 10): Observable<UserActivityItem[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<UserActivityItem[]>(`${this.API_URL}/user-activity`, { params });
  }

  getGrowthStats(period: 'daily' | 'weekly' | 'monthly' = 'monthly', months: number = 6): Observable<StatisticsResponse> {
    const params = new HttpParams()
      .set('period', period)
      .set('months', months.toString());

    return this.http.get<StatisticsResponse>(`${this.API_URL}/stats/growth`, { params });
  }
}