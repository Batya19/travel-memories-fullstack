import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SystemSettings } from '../models/system-settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly API_URL = `${environment.apiUrl}/admin/settings`;

  constructor(private http: HttpClient) { }

  getSystemSettings(): Observable<SystemSettings> {
    return this.http.get<SystemSettings>(this.API_URL);
  }

  updateSystemSettings(settings: SystemSettings): Observable<SystemSettings> {
    return this.http.put<SystemSettings>(this.API_URL, settings);
  }
}