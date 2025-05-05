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
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule,
    PasswordModule, CardModule, ToastModule,],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
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