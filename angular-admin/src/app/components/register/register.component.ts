import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Services
import { AuthService } from '../../core/services/auth.service';

// PrimeNG Components
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    DividerModule,
    CheckboxModule,
    DropdownModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  returnUrl: string = '/';

  // Password validation
  passwordStrength = 0;
  passwordFeedback = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    // Initialize register form
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: ['SYSTEM_ADMIN'], // שינוי ברירת המחדל ל-SYSTEM_ADMIN במקום USER
      agreeTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });

    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Redirect if already logged in
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate([this.returnUrl]);
      }
    });

    // Monitor password changes for strength check
    this.f['password'].valueChanges.subscribe((password: string) => {
      this.checkPasswordStrength(password);
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  // Check password strength
  checkPasswordStrength(password: string) {
    if (!password) {
      this.passwordStrength = 0;
      this.passwordFeedback = '';
      return;
    }

    let strength = 0;

    // Has lowercase letters
    if (password.match(/[a-z]+/)) {
      strength += 1;
    }

    // Has uppercase letters
    if (password.match(/[A-Z]+/)) {
      strength += 1;
    }

    // Has numbers
    if (password.match(/[0-9]+/)) {
      strength += 1;
    }

    // Has special characters
    if (password.match(/[$@#&!]+/)) {
      strength += 1;
    }

    // Length is at least 8
    if (password.length >= 8) {
      strength += 1;
    }

    // Set strength value
    this.passwordStrength = Math.min(100, strength * 20);

    // Set feedback message
    if (this.passwordStrength <= 20) {
      this.passwordFeedback = 'Very Weak';
    } else if (this.passwordStrength <= 40) {
      this.passwordFeedback = 'Weak';
    } else if (this.passwordStrength <= 60) {
      this.passwordFeedback = 'Medium';
    } else if (this.passwordStrength <= 80) {
      this.passwordFeedback = 'Strong';
    } else {
      this.passwordFeedback = 'Very Strong';
    }
  }

  onSubmit() {
    // Stop if form is invalid
    if (this.registerForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.f).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.loading = true;

    const user = {
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      role: this.f['role'].value
    };

    console.log('Registering user with role:', user.role); // לתיעוד בקונסול

    this.authService.register(user)
      .subscribe({
        next: (success) => {
          if (success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Registration Successful',
              detail: 'Your account has been created successfully. Redirecting to login...'
            });

            // Redirect to login page after a short delay
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.loading = false;
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Registration Failed',
            detail: error.message || 'An error occurred during registration'
          });
          this.loading = false;
        }
      });
  }

  // Navigate to login page
  goToLogin() {
    this.router.navigate(['/login']);
  }
}