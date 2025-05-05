import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRole } from '../models/user.model';

export interface UserQueryParams {
  limit?: number;
  offset?: number;
  searchTerm?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  storageQuota: number;
  aiQuota: number;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  storageQuota?: number;
  aiQuota?: number;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) { }

  getUsers(queryParams: UserQueryParams = {}): Observable<User[]> {
    let params = new HttpParams();

    if (queryParams.limit !== undefined) {
      params = params.set('limit', queryParams.limit.toString());
    }

    if (queryParams.offset !== undefined) {
      params = params.set('offset', queryParams.offset.toString());
    }

    if (queryParams.searchTerm) {
      params = params.set('searchTerm', queryParams.searchTerm);
    }

    return this.http.get<User[]>(this.API_URL, { params });
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${userId}`);
  }

  createUser(userData: CreateUserRequest): Observable<User> {
    if (!userData.password) {
      throw new Error('Password is required when creating a user');
    }
    return this.http.post<User>(this.API_URL, userData);
  }

  updateUser(userId: string, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${userId}`, userData);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${userId}`);
  }
}