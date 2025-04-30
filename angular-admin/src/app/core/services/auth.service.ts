import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { User } from '../models/user.model';

// עדכון ממשק תגובת ההתחברות להתאים למבנה האמיתי שמוחזר מהשרת
interface LoginResponse {
  userId: string;
  token: string;
  expiresAt: string; // ISO date string
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  storageQuota?: number;
  aiQuota?: number;
  createdAt?: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = "https://localhost:7051/api";

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private tokenExpirationTimer: any = null;

  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) { }

  /**
   * Authenticates a user with email and password
   * @param email User's email
   * @param password User's password
   * @returns Observable<boolean> True if login successful
   */
  login(email: string, password: string): Observable<boolean> {
    console.log('Attempting login with email:', email);
    
    // הוספת headers לבקשה
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const loginData = { email, password };
    console.log('Login request payload:', loginData);

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, loginData, { headers })
      .pipe(
        tap(response => {
          console.log('Login response structure:', JSON.stringify(response, null, 2));
          
          // מאפשר גם למשתמש רגיל וגם למנהל להתחבר
          if (response && (response.role === 'USER' || response.role === 'SYSTEM_ADMIN')) {
            // בנייה של אובייקט User מהתגובה
            const user: User = {
              id: response.userId,
              firstName: response.firstName,
              lastName: response.lastName,
              email: response.email,
              role: response.role,
              storageQuota: response.storageQuota || 0, // ברירת מחדל אם חסר
              aiQuota: response.aiQuota || 0, // ברירת מחדל אם חסר
              createdAt: response.createdAt ? new Date(response.createdAt) : new Date() // ברירת מחדל אם חסר
            };
            
            // שמירת המידע
            this.setSession(response, user);
            this.currentUserSubject.next(user);
            this.isLoggedInSubject.next(true);

            // הגדרת טיימר לניתוק אוטומטי
            const expiresAt = new Date(response.expiresAt).getTime();
            this.setAutoLogoutTimer(expiresAt);

            this.messageService.add({
              severity: 'success',
              summary: 'Login Successful',
              detail: `Welcome back, ${response.firstName}!`
            });
          } else {
            console.warn('Invalid role in response:', response.role);
            throw new Error('Invalid role or authentication failed.');
          }
        }),
        map(() => true),
        catchError(error => {
          console.error('Login error details:', error);
          
          if (error.error) {
            console.error('Server error details:', error.error);
          }
          
          let errorMessage = 'Authentication failed';

          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.status === 500) {
            errorMessage = 'Server error occurred. Please contact support.';
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: errorMessage
          });

          return of(false);
        })
      );
  }

  /**
   * Registers a new user
   * @param userData User registration data
   * @returns Observable<boolean> True if registration successful
   */
  register(userData: RegisterData): Observable<boolean> {
    console.log('Registering user with data:', userData);
    
    // הוספת headers לבקשה
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/auth/register`, userData, { headers })
      .pipe(
        tap(response => {
          console.log('Registration response:', response);
        }),
        map(() => true),
        catchError(error => {
          console.error('Registration error:', error);
          
          if (error.error) {
            console.error('Server error details:', error.error);
          }
          
          let errorMessage = 'Registration failed';

          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.status === 500) {
            errorMessage = 'Server error occurred. Please contact support.';
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Registration Failed',
            detail: errorMessage
          });

          return of(false);
        })
      );
  }
  /**
   * Logs out the current user
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_expires');
    localStorage.removeItem('auth_user');

    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }

    this.router.navigate(['/login']);

    this.messageService.add({
      severity: 'info',
      summary: 'Logged Out',
      detail: 'You have been logged out successfully'
    });
  }

  /**
   * Checks if there's a valid token in localStorage and sets auth state accordingly
   */
  checkAuthState(): void {
    const token = localStorage.getItem('auth_token');
    const expiresAt = localStorage.getItem('auth_expires');
    const userJson = localStorage.getItem('auth_user');

    if (token && expiresAt && userJson) {
      const now = new Date().getTime();
      const expiration = parseInt(expiresAt);

      if (expiration > now) {
        try {
          const user = JSON.parse(userJson) as User;

          // מאפשר גם למשתמש רגיל להתחבר
          if (user.role === 'SYSTEM_ADMIN' || user.role === 'USER') {
            this.currentUserSubject.next(user);
            this.isLoggedInSubject.next(true);

            // Set auto logout timer
            this.setAutoLogoutTimer(expiration);
          } else {
            this.logout();
          }
        } catch (e) {
          this.logout();
        }
      } else {
        // Token expired
        this.logout();
        this.messageService.add({
          severity: 'warn',
          summary: 'Session Expired',
          detail: 'Your session has expired. Please log in again.'
        });
      }
    }
  }

  /**
   * Gets the current authentication token
   * @returns The token or null if not logged in
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Stores authentication data in localStorage
   * @param authResult Authentication response data
   * @param user User data extracted from the response
   */
  private setSession(authResult: LoginResponse, user: User): void {
    // המרת תאריך פג תוקף ל-timestamp
    const expiresAt = new Date(authResult.expiresAt).getTime();
    
    localStorage.setItem('auth_token', authResult.token);
    localStorage.setItem('auth_expires', expiresAt.toString());
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  /**
   * Sets a timer to automatically log out when token expires
   * @param expirationTime Timestamp when token expires
   */
  private setAutoLogoutTimer(expirationTime: number): void {
    const now = new Date().getTime();
    const expiresIn = expirationTime - now;

    // Only set timer if expiration is in the future
    if (expiresIn > 0) {
      this.tokenExpirationTimer = setTimeout(() => {
        this.logout();
        this.messageService.add({
          severity: 'warn',
          summary: 'Session Expired',
          detail: 'Your session has expired. Please log in again.'
        });
      }, expiresIn);
    } else {
      this.logout();
    }
  }
}