import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="login-container">
      <p-card styleClass="login-card">
        <ng-template pTemplate="header">
          <div class="login-header">
            <img src="assets/logo.svg" alt="TravelMemories Logo" class="logo" />
            <h2>Admin Dashboard</h2>
          </div>
        </ng-template>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="field">
            <label for="email">Email</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-envelope"></i>
              <input 
                id="email" 
                type="email" 
                pInputText 
                formControlName="email" 
                placeholder="Email address"
                class="w-full"
              />
            </span>
            <small 
              *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
              class="p-error"
            >
              Valid email is required
            </small>
          </div>
          
          <div class="field">
            <label for="password">Password</label>
            <p-password 
              id="password" 
              formControlName="password" 
              [toggleMask]="true" 
              [feedback]="false"
              placeholder="Password"
              styleClass="w-full"
              inputStyleClass="w-full"
            ></p-password>
            <small 
              *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
              class="p-error"
            >
              Password is required
            </small>
          </div>
          
          <div class="login-actions">
            <p-button 
              type="submit" 
              label="Login" 
              [disabled]="loginForm.invalid || isLoading"
              styleClass="w-full"
            ></p-button>
          </div>
        </form>
      </p-card>
      
      <p-toast></p-toast>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #f5f7fa;
    }
    
    .login-card {
      width: 400px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    
    .login-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
    }
    
    .logo {
      height: 80px;
      margin-bottom: 1rem;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .login-actions {
      margin-top: 1rem;
    }
    
    :host ::ng-deep .p-password input {
      width: 100%;
    }
    
    .w-full {
      width: 100%;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    
    // Redirect if already logged in
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/admin/dashboard']);
    }
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        
        if (this.authService.isAdmin) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Access Denied',
            detail: 'You do not have admin privileges'
          });
          this.authService.logout();
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: error.message || 'Invalid credentials'
        });
      }
    });
  }
}