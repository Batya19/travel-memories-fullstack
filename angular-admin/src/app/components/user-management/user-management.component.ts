import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Services
import { UserService } from '../../core/services/user.service';

// Models
import { User } from '../../core/models/user.model';

// PrimeNG Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    DropdownModule,
    InputNumberModule,
    TagModule,
    ProgressBarModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  totalRecords = 0;

  // Table state
  first = 0;
  rows = 10;
  sortField = 'lastName';
  sortOrder = 1; // 1 for ascending, -1 for descending
  searchQuery = '';

  // User dialog
  userDialog = false;
  editingUser: Partial<User> = {};
  dialogMode: 'create' | 'edit' = 'create';

  // Quotas dialog
  quotasDialog = false;
  selectedUser: User | null = null;
  newStorageQuota = 0;
  newAiQuota = 0;

  // Dropdown options
  roleOptions = [
    { label: 'Regular User', value: 'USER' },
    { label: 'System Admin', value: 'SYSTEM_ADMIN' }
  ];

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;

    this.userService.getUsers({
      page: this.first / this.rows + 1,
      pageSize: this.rows,
      search: this.searchQuery || undefined,
      sortBy: this.sortField,
      sortDirection: this.sortOrder === 1 ? 'asc' : 'desc'
    }).subscribe({
      next: (result) => {
        this.users = result.items;
        this.totalRecords = result.totalCount;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.first = 0;
    this.loadUsers();
  }

  onLazyLoad(event: any) {
    this.first = event.first;
    this.rows = event.rows;

    if (event.sortField) {
      this.sortField = event.sortField;
      this.sortOrder = event.sortOrder;
    }

    this.loadUsers();
  }

  openNew() {
    this.editingUser = {};
    this.dialogMode = 'create';
    this.userDialog = true;
  }

  editUser(user: User) {
    this.editingUser = { ...user };
    this.dialogMode = 'edit';
    this.userDialog = true;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(user.id).subscribe({
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
              detail: 'Failed to delete user'
            });
            console.error('Error deleting user:', error);
          }
        });
      }
    });
  }

  openQuotasDialog(user: User) {
    this.selectedUser = user;
    this.newStorageQuota = user.storageQuota;
    this.newAiQuota = user.aiQuota;
    this.quotasDialog = true;
  }

  saveUser() {
    if (!this.editingUser.firstName || !this.editingUser.lastName || !this.editingUser.email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields'
      });
      return;
    }

    if (this.dialogMode === 'create') {
      this.userService.createUser(this.editingUser).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User created successfully'
          });
          this.userDialog = false;
          this.loadUsers();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create user'
          });
          console.error('Error creating user:', error);
        }
      });
    } else {
      this.userService.updateUser(this.editingUser.id!, this.editingUser).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated successfully'
          });
          this.userDialog = false;
          this.loadUsers();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update user'
          });
          console.error('Error updating user:', error);
        }
      });
    }
  }

  updateQuotas() {
    if (!this.selectedUser) return;

    this.userService.updateUserQuotas(this.selectedUser.id, this.newStorageQuota, this.newAiQuota).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Quotas updated successfully'
        });
        this.quotasDialog = false;
        this.loadUsers();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update quotas'
        });
        console.error('Error updating quotas:', error);
      }
    });
  }

  hideDialog() {
    this.userDialog = false;
  }

  hideQuotasDialog() {
    this.quotasDialog = false;
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getSeverity(role: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    switch (role) {
      case 'SYSTEM_ADMIN':
        return 'danger';
      case 'BUSINESS_ADMIN':
        return 'success';
      case 'USER':
        return 'info';
      default:
        return 'secondary';
    }
  }
}