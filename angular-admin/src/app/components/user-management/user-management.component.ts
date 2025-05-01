// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { UserService } from '../../core/services/user.service';
// import { UserManagementResponse, UserManagementRequest } from '../../core/models/user-management.model';
// import { MessageService, ConfirmationService } from 'primeng/api';
// import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { InputTextModule } from 'primeng/inputtext';
// import { ButtonModule } from 'primeng/button';
// import { TableModule } from 'primeng/table';
// import { TagModule } from 'primeng/tag';
// import { ProgressBarModule } from 'primeng/progressbar';
// import { InputNumberModule } from 'primeng/inputnumber';
// import { DropdownModule } from 'primeng/dropdown';
// import { DialogModule } from 'primeng/dialog';
// import { ReactiveFormsModule } from '@angular/forms';
// import { DatePipe } from '@angular/common';
// import { RippleModule } from 'primeng/ripple';

// import { BrowserModule } from '@angular/platform-browser';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-user-management',
//   standalone: true,
//   imports: [ConfirmDialogModule,
//     InputTextModule,
//     ButtonModule,
//     TableModule,
//     TagModule,
//     ProgressBarModule,
//     InputNumberModule,
//     DropdownModule,
//     DialogModule,
//     ReactiveFormsModule,
//     DatePipe,
//     RippleModule,
//     BrowserModule,
//     FormsModule
//   ],
//   templateUrl: './user-management.component.html',
//   styleUrls: ['./user-management.component.css']
// })
// export class UserManagementComponent implements OnInit {
//   users: UserManagementResponse[] = [];
//   loading = false;
//   userDialog = false;
//   userForm!: FormGroup;
//   isNewUser = true;
//   showPassword = false;
//   searchTerm = '';

//   roles = [
//     { label: 'User', value: 'USER' },
//     { label: 'System Admin', value: 'SYSTEM_ADMIN' }
//   ];

//   constructor(
//     private userService: UserService,
//     private fb: FormBuilder,
//     private messageService: MessageService,
//     private confirmationService: ConfirmationService
//   ) { }

//   ngOnInit(): void {
//     this.initForm();
//     this.loadUsers();
//   }

//   initForm(): void {
//     this.userForm = this.fb.group({
//       id: [''],
//       email: ['', [Validators.required, Validators.email]],
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       role: ['USER', Validators.required],
//       storageQuota: [10240, [Validators.required, Validators.min(1)]],
//       aiQuota: [50, [Validators.required, Validators.min(0)]],
//       password: ['']
//     });
//   }

//   loadUsers(): void {
//     this.loading = true;
//     this.userService.getUsers().subscribe({
//       next: (data) => {
//         this.users = data;
//         this.loading = false;
//       },
//       error: (error) => {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to load users'
//         });
//         this.loading = false;
//         console.error('Error fetching users:', error);
//       }
//     });
//   }

//   onSearch(): void {
//     this.loading = true;
//     this.userService.getUsers(undefined, undefined, this.searchTerm).subscribe({
//       next: (data) => {
//         this.users = data;
//         this.loading = false;
//       },
//       error: (error) => {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to search users'
//         });
//         this.loading = false;
//       }
//     });
//   }

//   openNewUserDialog(): void {
//     this.isNewUser = true;
//     this.userForm.reset({
//       role: 'USER',
//       storageQuota: 10240,
//       aiQuota: 50
//     });
//     this.showPassword = true;
//     this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
//     this.userForm.get('password')?.updateValueAndValidity();
//     this.userDialog = true;
//   }

//   openEditUserDialog(user: UserManagementResponse): void {
//     this.isNewUser = false;
//     this.showPassword = false;
//     this.userForm.patchValue({
//       id: user.id,
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       role: user.role,
//       storageQuota: user.storageQuota,
//       aiQuota: user.aiQuota
//     });
//     this.userForm.get('password')?.clearValidators();
//     this.userForm.get('password')?.updateValueAndValidity();
//     this.userDialog = true;
//   }

//   saveUser(): void {
//     if (this.userForm.invalid) {
//       this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: 'Please fill in all required fields correctly'
//       });
//       return;
//     }

//     const userRequest: UserManagementRequest = {
//       email: this.userForm.value.email,
//       firstName: this.userForm.value.firstName,
//       lastName: this.userForm.value.lastName,
//       role: this.userForm.value.role,
//       storageQuota: this.userForm.value.storageQuota,
//       aiQuota: this.userForm.value.aiQuota
//     };

//     if (this.userForm.value.password) {
//       userRequest.password = this.userForm.value.password;
//     }

//     if (this.isNewUser) {
//       this.createUser(userRequest);
//     } else {
//       this.updateUser(this.userForm.value.id, userRequest);
//     }
//   }

//   createUser(user: UserManagementRequest): void {
//     this.loading = true;
//     this.userService.createUser(user).subscribe({
//       next: (data) => {
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Success',
//           detail: 'User created successfully'
//         });
//         this.userDialog = false;
//         this.loadUsers();
//       },
//       error: (error) => {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: error.error?.message || 'Failed to create user'
//         });
//         this.loading = false;
//       }
//     });
//   }

//   updateUser(userId: string, user: UserManagementRequest): void {
//     this.loading = true;
//     this.userService.updateUser(userId, user).subscribe({
//       next: (data) => {
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Success',
//           detail: 'User updated successfully'
//         });
//         this.userDialog = false;
//         this.loadUsers();
//       },
//       error: (error) => {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: error.error?.message || 'Failed to update user'
//         });
//         this.loading = false;
//       }
//     });
//   }

//   confirmDeleteUser(user: UserManagementResponse): void {
//     this.confirmationService.confirm({
//       message: `Are you sure you want to delete the user ${user.email}?`,
//       header: 'Confirm Deletion',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
//         this.deleteUser(user.id);
//       }
//     });
//   }

//   deleteUser(userId: string): void {
//     this.loading = true;
//     this.userService.deleteUser(userId).subscribe({
//       next: () => {
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Success',
//           detail: 'User deleted successfully'
//         });
//         this.loadUsers();
//       },
//       error: (error) => {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: error.error?.message || 'Failed to delete user'
//         });
//         this.loading = false;
//       }
//     });
//   }

//   hideDialog(): void {
//     this.userDialog = false;
//   }

//   getStorageUsagePercentage(user: UserManagementResponse): number {
//     return (user.storageUsed / user.storageQuota) * 100;
//   }

//   getProgressBarClass(percentage: number): string {
//     if (percentage < 50) {
//       return 'success-progress';
//     } else if (percentage < 80) {
//       return 'warning-progress';
//     } else {
//       return 'danger-progress';
//     }
//   }
// }
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
  template: `
    <div class="user-management-container">
      <h1>User Management</h1>
      
      <p-card styleClass="mb-4">
        <div class="flex justify-content-between align-items-center">
          <div class="search-box">
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <input
                type="text"
                pInputText
                [(ngModel)]="searchTerm"
                placeholder="Search users..."
                (keyup.enter)="onSearchTerm()"
              />
            </span>
          </div>
          
          <div class="filter-options">
            <p-dropdown
              [options]="roleFilterOptions"
              [(ngModel)]="roleFilter"
              placeholder="Filter by role"
              [showClear]="true"
              (onChange)="onRoleFilterChange()"
            ></p-dropdown>
          </div>
          
          <p-button
            icon="pi pi-plus"
            label="Add User"
            (onClick)="showAddUserDialog()"
          ></p-button>
        </div>
      </p-card>
      
      <p-table
        [value]="users"
        [lazy]="true"
        [paginator]="true"
        [rows]="pageSize"
        [totalRecords]="totalRecords"
        [loading]="loading"
        [rowsPerPageOptions]="[10, 25, 50]"
        [showCurrentPageReport]="true"
        [responsive]="true"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
        (onLazyLoad)="loadUsers($event)"
      >
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="firstName">Name <p-sortIcon field="firstName"></p-sortIcon></th>
            <th pSortableColumn="email">Email <p-sortIcon field="email"></p-sortIcon></th>
            <th pSortableColumn="role">Role <p-sortIcon field="role"></p-sortIcon></th>
            <th>Storage Usage</th>
            <th>AI Quota Usage</th>
            <th pSortableColumn="createdAt">Created At <p-sortIcon field="createdAt"></p-sortIcon></th>
            <th style="width: 120px">Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-user>
          <tr>
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span [ngClass]="'role-badge ' + (user.role === 'SYSTEM_ADMIN' ? 'admin' : 'user')">
                {{ user.role }}
              </span>
            </td>
            <td>
              <div class="quota-container">
                <p-progressBar
                  [value]="getStoragePercentage(user)"
                  [showValue]="false"
                  [styleClass]="getQuotaClass(getStoragePercentage(user))"
                ></p-progressBar>
                <span class="quota-text">
                  {{ formatStorage(user.storageUsed || 0) }} / {{ formatStorage(user.storageQuota) }}
                </span>
              </div>
            </td>
            <td>
              <div class="quota-container">
                <p-progressBar
                  [value]="getAiQuotaPercentage(user)"
                  [showValue]="false"
                  [styleClass]="getQuotaClass(getAiQuotaPercentage(user))"
                ></p-progressBar>
                <span class="quota-text">
                  {{ user.aiQuotaUsed || 0 }} / {{ user.aiQuota }}
                </span>
              </div>
            </td>
            <td>{{ user.createdAt | date }}</td>
            <td>
              <div class="action-buttons">
                <button
                  pButton
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text p-button-sm"
                  (click)="editUser(user)"
                ></button>
                <button
                  pButton
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-danger p-button-sm"
                  (click)="confirmDelete(user)"
                ></button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" class="text-center">
              No users found.
            </td>
          </tr>
        </ng-template>
      </p-table>
      
      <!-- Add/Edit User Dialog -->
      <p-dialog
        [(visible)]="userDialogVisible"
        [header]="editMode ? 'Edit User' : 'Add New User'"
        [modal]="true"
        [style]="{ width: '450px' }"
        [draggable]="false"
        [resizable]="false"
      >
        <form [formGroup]="userForm" class="user-form">
          <div class="form-field">
            <label for="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              pInputText
              formControlName="firstName"
              class="w-full"
            />
            <small
              *ngIf="userForm.get('firstName')?.invalid && userForm.get('firstName')?.touched"
              class="p-error"
            >
              First name is required
            </small>
          </div>
          
          <div class="form-field">
            <label for="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              pInputText
              formControlName="lastName"
              class="w-full"
            />
            <small
              *ngIf="userForm.get('lastName')?.invalid && userForm.get('lastName')?.touched"
              class="p-error"
            >
              Last name is required
            </small>
          </div>
          
          <div class="form-field">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              pInputText
              formControlName="email"
              class="w-full"
            />
            <small
              *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched"
              class="p-error"
            >
              Valid email is required
            </small>
          </div>
          
          <div class="form-field" *ngIf="!editMode">
            <label for="password">Password</label>
            <p-password
              id="password"
              formControlName="password"
              [toggleMask]="true"
              [feedback]="true"
              styleClass="w-full"
              inputStyleClass="w-full"
            ></p-password>
            <small
              *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched"
              class="p-error"
            >
              Password must be at least 8 characters
            </small>
          </div>
          
          <div class="form-field">
            <label for="role">Role</label>
            <p-dropdown
              id="role"
              [options]="roleOptions"
              formControlName="role"
              optionLabel="label"
              optionValue="value"
              styleClass="w-full"
            ></p-dropdown>
          </div>
          
          <div class="form-field">
            <label for="storageQuota">Storage Quota (MB)</label>
            <p-inputNumber
              id="storageQuota"
              formControlName="storageQuota"
              [min]="0"
              [max]="1000000"
              styleClass="w-full"
            ></p-inputNumber>
          </div>
          
          <div class="form-field">
            <label for="aiQuota">AI Images Quota</label>
            <p-inputNumber
              id="aiQuota"
              formControlName="aiQuota"
              [min]="0"
              [max]="1000"
              styleClass="w-full"
            ></p-inputNumber>
          </div>
        </form>
        
        <ng-template pTemplate="footer">
          <button
            pButton
            icon="pi pi-times"
            label="Cancel"
            class="p-button-text"
            (click)="userDialogVisible = false"
          ></button>
          <button
            pButton
            icon="pi pi-check"
            label="Save"
            [disabled]="userForm.invalid"
            (click)="saveUser()"
          ></button>
        </ng-template>
      </p-dialog>
      
      <p-confirmDialog></p-confirmDialog>
      <p-toast></p-toast>
    </div>
  `,
  styles: [`
    .user-management-container {
      padding: 1rem;
    }
    
    .mb-4 {
      margin-bottom: 1.5rem;
    }
    
    .flex {
      display: flex;
    }
    
    .justify-content-between {
      justify-content: space-between;
    }
    
    .align-items-center {
      align-items: center;
    }
    
    .role-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .role-badge.admin {
      background-color: #f44336;
      color: white;
    }
    
    .role-badge.user {
      background-color: #2196f3;
      color: white;
    }
    
    .quota-container {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .quota-text {
      font-size: 0.75rem;
      color: #666666;
    }
    
    .quota-critical {
      background: #f44336;
    }
    
    .quota-warning {
      background: #ff9800;
    }
    
    .quota-normal {
      background: #4caf50;
    }
    
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    
    .user-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding: 1rem 0;
    }
    
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .w-full {
      width: 100%;
    }
    
    :host ::ng-deep .p-password input {
      width: 100%;
    }
    
    :host ::ng-deep .p-dropdown {
      width: 100%;
    }
    
    :host ::ng-deep .p-inputnumber {
      width: 100%;
    }
    
    @media (max-width: 768px) {
      .flex {
        flex-direction: column;
        gap: 1rem;
      }
      
      .search-box,
      .filter-options {
        width: 100%;
      }
    }
  `]
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
  
  // Changed from onSearch to onSearchTerm
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
    
    // Remove password validator in edit mode
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