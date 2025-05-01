import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { LoginRequest, AuthResponse } from '../models/auth.model';
import { UserRole } from '../models/user.model';

interface DecodedToken {
  exp: number;
  userId: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private tokenExpirationTimer: any;
  private currentUserSubject = new BehaviorSubject<{
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  } | null>(null);

  // Added isLoggedIn$ observable
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.autoLogin();
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, loginData)
      .pipe(
        tap(response => {
          this.handleAuthentication(response);
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Authentication failed'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.router.navigate(['/login']);
  }

  // Added checkAuthState method
  checkAuthState(): void {
    const token = this.getToken();
    const isAuthenticated = !!token && !this.isTokenExpired(token);
    this.isLoggedInSubject.next(isAuthenticated);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const expirationDate = new Date(decodedToken.exp * 1000);
      return expirationDate <= new Date();
    } catch {
      return true;
    }
  }

  autoLogin(): void {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
      this.isLoggedInSubject.next(false);
      return;
    }

    try {
      const userDataObj = JSON.parse(userData);
      const decodedToken = jwtDecode<DecodedToken>(token);
      const expirationDate = new Date(decodedToken.exp * 1000);

      if (expirationDate <= new Date()) {
        this.logout();
        return;
      }

      this.currentUserSubject.next(userDataObj);
      this.isLoggedInSubject.next(true);
      this.autoLogout(expirationDate.getTime() - new Date().getTime());
    } catch (error) {
      this.logout();
    }
  }

  private autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    
    // Create a user object with the correct structure for your app
    const userData = {
        userId: response.userId,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        role: response.role as UserRole // Convert the string to your enum
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));

    this.currentUserSubject.next(userData);
    this.isLoggedInSubject.next(true);
    
    // Handle token expiration
    const expirationDate = new Date(response.expiresAt);
    this.autoLogout(expirationDate.getTime() - new Date().getTime());
}

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentUserValue?.role === UserRole.SYSTEM_ADMIN;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}