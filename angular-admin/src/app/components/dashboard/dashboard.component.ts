import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { StatsService } from '../../core/services/stats.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { GrowthDataPoint } from '../../core/models/statistics-response.model';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule, ProgressBarModule, ToastModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [MessageService]
})
export class DashboardComponent implements OnInit {
  loading = true;
  systemStats: any = {
    totalUsers: 0,
    totalTrips: 0,
    totalImages: 0,
    aiGeneratedImages: 0,
    storageUsed: 0,
    totalStorageQuota: 0,
    usersGrowth: [],
    tripsGrowth: [],
    imagesGrowth: []
  };

  recentActivity: any[] = [];

  constructor(
    private statsService: StatsService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.statsService.getSystemStats().pipe(
      map(response => {
        return {
          totalUsers: response.totalUsers || 0,
          totalTrips: response.totalTrips || 0,
          totalImages: response.totalImages || 0,
          aiGeneratedImages: response.totalAiImages || 0,
          storageUsed: (response.totalStorageUsedMB || 0) * 1024 * 1024,
          totalStorageQuota: 10240 * 1024 * 1024,
          usersGrowth: this.convertDictionaryToGrowthData(response.usersByMonth),
          tripsGrowth: this.convertDictionaryToGrowthData(response.tripsByMonth),
          imagesGrowth: this.convertDictionaryToGrowthData(response.imagesByMonth)
        };
      }),
      catchError(error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load system statistics'
        });
        return of({
          totalUsers: 0,
          totalTrips: 0,
          totalImages: 0,
          aiGeneratedImages: 0,
          storageUsed: 0,
          totalStorageQuota: 10240,
          usersGrowth: [],
          tripsGrowth: [],
          imagesGrowth: []
        });
      })
    ).subscribe(data => {
      this.systemStats = data;
      this.loading = false;
    });

    this.statsService.getUserActivity(5).pipe(
      map(activities => {
        return activities.map(activity => ({
          userName: activity.userEmail || 'Unknown',
          action: activity.activityType || 'UNKNOWN',
          entityType: this.extractEntityType(activity.description),
          entityName: this.extractEntityName(activity.description),
          timestamp: activity.timestamp
        }));
      }),
      catchError(error => {
        console.error('Error loading user activity:', error);
        return of([]);
      })
    ).subscribe(data => {
      this.recentActivity = data;
    });
  }

  private convertDictionaryToGrowthData(dict: { [key: string]: number } | undefined): GrowthDataPoint[] {
    if (!dict) return [];
    return Object.entries(dict).map(([date, value]) => ({
      date,
      value
    }));
  }

  private extractEntityType(description: string | undefined): string {
    return description || 'N/A';
  }

  private extractEntityName(description: string | undefined): string {
    return description || 'N/A';
  }

  refreshDashboard() {
    this.loading = true;
    this.loadDashboardData();
    this.messageService.add({
      severity: 'info',
      summary: 'Refreshing',
      detail: 'Dashboard data has been refreshed'
    });
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getStoragePercentage(): number {
    if (!this.systemStats.totalStorageQuota) return 0;
    return Math.min(100, (this.systemStats.storageUsed / this.systemStats.totalStorageQuota) * 100);
  }

  getStorageClass(): string {
    const percentage = this.getStoragePercentage();
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return 'success';
  }

  getActivityClass(action: string | undefined): string {
    if (!action) return 'default';

    switch (action.toUpperCase()) {
      case 'CREATE':
      case 'CREATED':
        return 'create';
      case 'UPDATE':
      case 'UPDATED':
        return 'update';
      case 'DELETE':
      case 'DELETED':
        return 'delete';
      case 'LOGIN':
        return 'login';
      default:
        return 'default';
    }
  }

  getTimeSince(date: Date): string {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }

  exportActivityToExcel(): void {
    if (!this.recentActivity || this.recentActivity.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Data',
        detail: 'No activity data to export'
      });
      return;
    }

    const dataToExport = this.recentActivity.map(activity => ({
      'Time': this.getTimeSince(activity.timestamp),
      'User': activity.userName,
      'Action': activity.action || 'Unknown',
      'Entity Type': activity.entityType || 'N/A',
      'Entity Name': activity.entityName || 'N/A',
      'Full Timestamp': new Date(activity.timestamp).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    const columnWidths = [
      { wch: 15 },
      { wch: 25 },
      { wch: 12 },
      { wch: 15 },
      { wch: 25 },
      { wch: 20 }
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Activity');

    const summaryData = [
      { 'Report Type': 'User Activity Log' },
      { 'Generated Date': new Date().toLocaleString() },
      { 'Total Activities': this.recentActivity.length },
      { 'Period': 'Recent Activities' }
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(data, `user_activity_${new Date().toISOString().split('T')[0]}.xlsx`);

    this.messageService.add({
      severity: 'success',
      summary: 'Export Successful',
      detail: `Exported ${this.recentActivity.length} activity records`
    });
  }
}