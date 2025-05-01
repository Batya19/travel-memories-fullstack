import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
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
    <div class="register-container">
      <p-card styleClass="register-card">
        <ng-template pTemplate="header">
          <div class="register-header">
            <img src="assets/logo.svg" alt="TravelMemories Logo" class="logo" />
            <h2>Admin Registration</h2>
          </div>
        </ng-template>
        
        <div *ngIf="!registrationEnabled" class="registration-disabled">
          <i class="pi pi-lock" style="font-size: 3rem"></i>
          <h3>Registration is currently disabled</h3>
          <p>Please contact your system administrator for access.</p>
          <p-button label="Back to Login" (click)="navigateToLogin()"></p-button>
        </div>
        
        <form *ngIf="registrationEnabled" [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <div class="p-grid">
            <div class="field p-col-12 p-md-6">
              <label for="firstName">First Name</label>
              <input id="firstName" type="text" pInputText formControlName="firstName" class="w-full" />
              <small 
                *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" 
                class="p-error"
              >
                First name is required
              </small>
            </div>
            
            <div class="field p-col-12 p-md-6">
              <label for="lastName">Last Name</label>
              <input id="lastName" type="text" pInputText formControlName="lastName" class="w-full" />
              <small 
                *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" 
                class="p-error"
              >
                Last name is required
              </small>
            </div>
          </div>
          
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
              *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" 
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
              [feedback]="true"
              placeholder="Password"
              styleClass="w-full"
              inputStyleClass="w-full"
            ></p-password>
            <small 
              *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" 
              class="p-error"
            >
              Password must be at least 8 characters
            </small>
          </div>
          
          <div class="field">
            <label for="confirmPassword">Confirm Password</label>
            <p-password 
              id="confirmPassword" 
              formControlName="confirmPassword" 
              [toggleMask]="true" 
              [feedback]="false"
              placeholder="Confirm password"
              styleClass="w-full"
              inputStyleClass="w-full"
            ></p-password>
            <small 
              *ngIf="registerForm.hasError('passwordMismatch')" 
              class="p-error"
            >
              Passwords do not match
            </small>
          </div>
          
          <div class="register-actions">
            <p-button 
              type="submit" 
              label="Register" 
              [disabled]="registerForm.invalid || isLoading"
              styleClass="w-full"
            ></p-button>
            
            <div class="login-link">
              Already have an account? <a href="javascript:void(0)" (click)="navigateToLogin()">Login</a>
            </div>
          </div>
        </form>
      </p-card>
      
      <p-toast></p-toast>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem 0;
      background-color: #f5f7fa;
    }
    
    .register-card {
      width: 500px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    
    .register-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
    }
    
    .logo {
      height: 80px;
      margin-bottom: 1rem;
    }
    
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .register-actions {
      margin-top: 1rem;
    }
    
    .login-link {
      text-align: center;
      margin-top: 1rem;
    }
    
    .registration-disabled {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 2rem;
      text-align: center;
    }
    
    :host ::ng-deep .p-password input {
      width: 100%;
    }
    
    .w-full {
      width: 100%;
    }
    
    .p-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .p-col-12 {
      flex: 0 0 100%;
    }
    
    @media (min-width: 768px) {
      .p-md-6 {
        flex: 0 0 calc(50% - 0.5rem);
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  registrationEnabled = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.checkRegistrationEnabled();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  checkRegistrationEnabled(): void {
    this.http.get<{ registrationEnabled: boolean }>(`${environment.apiUrl}/auth/registration-status`)
      .subscribe({
        next: (response) => {
          this.registrationEnabled = response.registrationEnabled;
        },
        error: () => {
          this.registrationEnabled = false;
        }
      });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;

    const registerData = {
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: UserRole.SYSTEM_ADMIN
    };

    this.http.post(`${environment.apiUrl}/auth/register`, registerData)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Registration Successful',
            detail: 'You can now login with your credentials'
          });

          setTimeout(() => {
            this.navigateToLogin();
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Registration Failed',
            detail: error.error?.message || 'Registration failed. Please try again.'
          });
        }
      });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}