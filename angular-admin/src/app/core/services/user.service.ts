import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRole } from '../models/user.model';

export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  role?: UserRole;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface UserListResponse {
  users: User[];
  totalCount: number;
  page: number;
  pageSize: number;
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
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) { }

  getUsers(queryParams: UserQueryParams = {}): Observable<UserListResponse> {
    let params = new HttpParams();

    if (queryParams.page !== undefined) {
      params = params.set('page', queryParams.page.toString());
    }

    if (queryParams.pageSize !== undefined) {
      params = params.set('pageSize', queryParams.pageSize.toString());
    }

    if (queryParams.searchTerm) {
      params = params.set('searchTerm', queryParams.searchTerm);
    }

    if (queryParams.role) {
      params = params.set('role', queryParams.role);
    }

    if (queryParams.sortBy) {
      params = params.set('sortBy', queryParams.sortBy);
    }

    if (queryParams.sortDirection) {
      params = params.set('sortDirection', queryParams.sortDirection);
    }

    return this.http.get<UserListResponse>(this.API_URL, { params });
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${userId}`);
  }

  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.API_URL, userData);
  }

  updateUser(userId: string, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${userId}`, userData);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${userId}`);
  }
}