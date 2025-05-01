import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService, UserQueryParams, CreateUserRequest, UpdateUserRequest } from '../../core/services/user.service';
import { User, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ProgressBarModule,
    ConfirmDialogModule,
    ToastModule,
    InputNumberModule,
    PasswordModule,
    CardModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  totalRecords = 0;
  loading = true;

  // Pagination
  page = 0;
  pageSize = 10;

  // Sorting
  sortField = 'createdAt';
  sortOrder = -1;

  // Filtering
  searchTerm = '';
  roleFilter: UserRole | null = null;

  // Dialog
  userDialogVisible = false;
  editMode = false;
  userForm: FormGroup;
  selectedUser: User | null = null;

  roleOptions = [
    { label: 'Regular User', value: UserRole.USER },
    { label: 'System Admin', value: UserRole.SYSTEM_ADMIN }
  ];

  roleFilterOptions = [
    { label: 'Regular Users', value: UserRole.USER },
    { label: 'System Admins', value: UserRole.SYSTEM_ADMIN }
  ];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.userForm = this.createUserForm();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  createUserForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: [UserRole.USER, Validators.required],
      storageQuota: [10240, [Validators.required, Validators.min(0)]],
      aiQuota: [50, [Validators.required, Validators.min(0)]]
    });
  }

  loadUsers(event?: any): void {
    this.loading = true;

    if (event) {
      this.page = event.first / event.rows;
      this.pageSize = event.rows;

      if (event.sortField) {
        this.sortField = event.sortField;
        this.sortOrder = event.sortOrder;
      }
    }

    const params: UserQueryParams = {
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortField,
      sortDirection: this.sortOrder === 1 ? 'asc' : 'desc'
    };

    if (this.searchTerm) {
      params.searchTerm = this.searchTerm;
    }

    if (this.roleFilter) {
      params.role = this.roleFilter;
    }

    this.userService.getUsers(params).subscribe({
      next: (response) => {
        this.users = response.users;
        this.totalRecords = response.totalCount;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
        this.loading = false;
      }
    });
  }

  onSearchTerm(): void {
    this.page = 0;
    this.loadUsers();
  }

  onRoleFilterChange(): void {
    this.page = 0;
    this.loadUsers();
  }

  showAddUserDialog(): void {
    this.editMode = false;
    this.selectedUser = null;
    this.userForm = this.createUserForm();
    this.userDialogVisible = true;
  }

  editUser(user: User): void {
    this.editMode = true;
    this.selectedUser = { ...user };

    this.userForm = this.fb.group({
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      role: [user.role, Validators.required],
      storageQuota: [user.storageQuota, [Validators.required, Validators.min(0)]],
      aiQuota: [user.aiQuota, [Validators.required, Validators.min(0)]]
    });

    this.userDialogVisible = true;
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      return;
    }

    if (this.editMode && this.selectedUser) {
      const updateData: UpdateUserRequest = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        email: this.userForm.value.email,
        role: this.userForm.value.role,
        storageQuota: this.userForm.value.storageQuota,
        aiQuota: this.userForm.value.aiQuota
      };

      this.userService.updateUser(this.selectedUser.id, updateData)
        .subscribe({
          next: (updatedUser) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User updated successfully'
            });
            this.userDialogVisible = false;
            this.loadUsers();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Failed to update user'
            });
          }
        });
    } else {
      const createData: CreateUserRequest = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        role: this.userForm.value.role,
        storageQuota: this.userForm.value.storageQuota,
        aiQuota: this.userForm.value.aiQuota
      };

      this.userService.createUser(createData)
        .subscribe({
          next: (newUser) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User created successfully'
            });
            this.userDialogVisible = false;
            this.loadUsers();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Failed to create user'
            });
          }
        });
    }
  }

  confirmDelete(user: User): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser(user);
      }
    });
  }

  deleteUser(user: User): void {
    this.userService.deleteUser(user.id)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User deleted successfully'
          });
          this.loadUsers();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to delete user'
          });
        }
      });
  }

  getStoragePercentage(user: User): number {
    if (!user.storageUsed) return 0;
    return Math.min(100, (user.storageUsed / user.storageQuota) * 100);
  }

  getAiQuotaPercentage(user: User): number {
    if (!user.aiQuotaUsed) return 0;
    return Math.min(100, (user.aiQuotaUsed / user.aiQuota) * 100);
  }

  getQuotaClass(percentage: number): string {
    if (percentage >= 90) return 'quota-critical';
    if (percentage >= 70) return 'quota-warning';
    return 'quota-normal';
  }

  formatStorage(sizeInMB: number): string {
    if (sizeInMB < 1024) {
      return `${sizeInMB.toFixed(0)} MB`;
    } else {
      return `${(sizeInMB / 1024).toFixed(2)} GB`;
    }
  }
}