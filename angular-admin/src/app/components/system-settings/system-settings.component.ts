import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ChipsModule } from 'primeng/chips';
import { MessageService } from 'primeng/api';
import { SettingsService } from '../../core/services/settings.service';
import { SystemSettings } from '../../core/models/system-settings.model';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    CheckboxModule,
    ToastModule,
    ChipsModule
  ],
  providers: [MessageService],
  template: `
    <div class="settings-container">
      <h1>System Settings</h1>
      
      <div *ngIf="loading" class="loading-indicator">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <span>Loading settings...</span>
      </div>
      
      <form *ngIf="!loading" [formGroup]="settingsForm" (ngSubmit)="saveSettings()" class="settings-form">
        <p-card header="Default User Quotas" styleClass="settings-card">
          <div class="form-field">
            <label for="defaultUserStorageQuota">Default Storage Quota (MB)</label>
            <p-inputNumber
              id="defaultUserStorageQuota"
              formControlName="defaultUserStorageQuota"
              [min]="0"
              [max]="1000000"
              styleClass="w-full"
            ></p-inputNumber>
            <small class="help-text">
              Storage quota assigned to new users by default. Existing users are not affected.
            </small>
          </div>
          
          <div class="form-field">
            <label for="defaultUserAiQuota">Default AI Images Quota</label>
            <p-inputNumber
              id="defaultUserAiQuota"
              formControlName="defaultUserAiQuota"
              [min]="0"
              [max]="1000"
              styleClass="w-full"
            ></p-inputNumber>
            <small class="help-text">
              Monthly AI image generation quota assigned to new users by default.
            </small>
          </div>
        </p-card>
        
        <p-card header="File Upload Settings" styleClass="settings-card">
          <div class="form-field">
            <label for="maxUploadFileSizeMB">Maximum Upload File Size (MB)</label>
            <p-inputNumber
              id="maxUploadFileSizeMB"
              formControlName="maxUploadFileSizeMB"
              [min]="1"
              [max]="100"
              styleClass="w-full"
            ></p-inputNumber>
            <small class="help-text">
              Maximum allowed size for uploaded files. Larger files will be rejected.
            </small>
          </div>
          
          <div class="form-field">
            <label for="allowedFileTypes">Allowed File Types</label>
            <p-chips
              id="allowedFileTypes"
              formControlName="allowedFileTypes"
              placeholder="Add file extension (e.g., jpg)"
              styleClass="w-full"
            ></p-chips>
            <small class="help-text">
              File types allowed for upload. Enter file extensions without dots (e.g., jpg, png).
            </small>
          </div>
        </p-card>
        
        <p-card header="System Access" styleClass="settings-card">
          <div class="form-field checkbox-field">
            <div class="checkbox-container">
              <p-checkbox
                id="registrationEnabled"
                formControlName="registrationEnabled"
                [binary]="true"
              ></p-checkbox>
              <label for="registrationEnabled">Enable User Registration</label>
            </div>
            <small class="help-text">
              When disabled, new users cannot register. Existing users can still log in.
            </small>
          </div>
          
          <div class="form-field checkbox-field">
            <div class="checkbox-container">
              <p-checkbox
                id="maintenanceMode"
                formControlName="maintenanceMode"
                [binary]="true"
              ></p-checkbox>
              <label for="maintenanceMode">Enable Maintenance Mode</label>
            </div>
            <small class="help-text warning-text">
              <i class="pi pi-exclamation-triangle"></i> When enabled, only administrators can access the system. Regular users will see a maintenance message.
            </small>
          </div>
        </p-card>
        
        <div class="form-actions">
          <p-button
            type="button"
            label="Reset"
            icon="pi pi-refresh"
            styleClass="p-button-outlined p-button-secondary"
            (onClick)="resetForm()"
          ></p-button>
          
          <p-button
            type="submit"
            label="Save Settings"
            icon="pi pi-save"
            [disabled]="settingsForm.invalid || settingsForm.pristine"
          ></p-button>
        </div>
      </form>
      
      <p-toast></p-toast>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 1rem;
    }
    
    .loading-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 3rem;
    }
    
    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .settings-card {
      margin-bottom: 0;
    }
    
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    
    .form-field:last-child {
      margin-bottom: 0;
    }
    
    .help-text {
      font-size: 0.75rem;
      color: #666666;
    }
    
    .warning-text {
      color: #f44336;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    
    .checkbox-field {
      margin-bottom: 1.5rem;
    }
    
    .checkbox-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    
    .w-full {
      width: 100%;
    }
    
    @media (max-width: 768px) {
      .form-actions {
        flex-direction: column-reverse;
        gap: 0.5rem;
      }
      
      :host ::ng-deep .form-actions .p-button {
        width: 100%;
      }
    }
  `]
})
export class SystemSettingsComponent implements OnInit {
  settingsForm: FormGroup;
  originalSettings: SystemSettings | null = null;
  loading = true;
  
  constructor(
    private settingsService: SettingsService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.settingsForm = this.createSettingsForm();
  }
  
  ngOnInit(): void {
    this.loadSettings();
  }
  
  createSettingsForm(): FormGroup {
    return this.fb.group({
      defaultUserStorageQuota: [10240, [Validators.required, Validators.min(0)]],
      defaultUserAiQuota: [50, [Validators.required, Validators.min(0)]],
      registrationEnabled: [true],
      maxUploadFileSizeMB: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
      allowedFileTypes: [['jpg', 'jpeg', 'png', 'gif'], Validators.required],
      maintenanceMode: [false]
    });
  }
  
  loadSettings(): void {
    this.loading = true;
    
    this.settingsService.getSystemSettings().subscribe({
      next: (settings) => {
        this.originalSettings = settings;
        this.settingsForm.patchValue(settings);
        this.settingsForm.markAsPristine();
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load system settings'
        });
        this.loading = false;
      }
    });
  }
  
  saveSettings(): void {
    if (this.settingsForm.invalid || this.settingsForm.pristine) {
      return;
    }
    
    const settings: SystemSettings = this.settingsForm.value;
    
    this.settingsService.updateSystemSettings(settings).subscribe({
      next: (updatedSettings) => {
        this.originalSettings = updatedSettings;
        this.settingsForm.markAsPristine();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'System settings updated successfully'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to update system settings'
        });
      }
    });
  }
  
  resetForm(): void {
    if (this.originalSettings) {
      this.settingsForm.patchValue(this.originalSettings);
      this.settingsForm.markAsPristine();
    } else {
      this.settingsForm.reset();
      this.settingsForm = this.createSettingsForm();
    }
  }
}