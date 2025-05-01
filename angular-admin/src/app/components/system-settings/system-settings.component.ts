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
  templateUrl: './system-settings.component.html',
  styleUrl: './system-settings.component.css'
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