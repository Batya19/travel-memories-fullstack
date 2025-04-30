import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:7051/api/users'; // Replace with your actual API URL
  
  constructor(private http: HttpClient) {}
  
  getUsers(params: {
    page?: number,
    pageSize?: number,
    search?: string,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc'
  } = {}): Observable<{ items: User[], totalCount: number }> {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] !== undefined) {
        httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
      }
    });
    
    return this.http.get<{ items: User[], totalCount: number }>(this.apiUrl, { params: httpParams });
  }
  
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
  
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }
  
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  updateUserQuotas(id: string, storageQuota: number, aiQuota: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}/quotas`, { 
      storageQuota,
      aiQuota
    });
  }
}