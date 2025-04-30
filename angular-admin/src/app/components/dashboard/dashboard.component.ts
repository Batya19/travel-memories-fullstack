import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Services
import { StatsService } from '../../core/services/stats.service';

// PrimeNG Components
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

declare const CanvasJS: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    ProgressBarModule,
    ToastModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [MessageService]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('userChart') userChartElement!: ElementRef;
  @ViewChild('contentChart') contentChartElement!: ElementRef;
  @ViewChild('storageChart') storageChartElement!: ElementRef;

  loading = true;
  systemStats: any = {};
  topUsers: any[] = [];

  constructor(
    private statsService: StatsService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadDashboardData();
  }

  ngAfterViewInit() {
    // Charts will be initialized after data is loaded
  }

  loadDashboardData() {
    // Load system stats
    this.statsService.getSystemStats().subscribe({
      next: (data) => {
        this.systemStats = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load system statistics'
        });
        console.error('Error loading system stats:', error);
      }
    });

    // Load top users by storage
    this.statsService.getTopUsersByStorage(5).subscribe({
      next: (data) => {
        this.topUsers = data;
      },
      error: (error) => {
        console.error('Error loading top users:', error);
      }
    });

    // Load chart data
    this.loadChartData();
  }

  loadChartData() {
    // Load user activity data for chart
    this.statsService.getUserActivityStats().subscribe({
      next: (data) => {
        this.renderUserChart(data);
      },
      error: (error) => {
        console.error('Error loading user activity:', error);
      }
    });

    // Load content stats for chart
    this.statsService.getContentStats().subscribe({
      next: (data) => {
        this.renderContentChart(data);
      },
      error: (error) => {
        console.error('Error loading content stats:', error);
      }
    });

    // Load storage stats for chart
    this.statsService.getStorageStats().subscribe({
      next: (data) => {
        this.renderStorageChart(data);
      },
      error: (error) => {
        console.error('Error loading storage stats:', error);
      }
    });
  }

  renderUserChart(data: any) {
    if (!this.userChartElement || !data) return;

    const chart = new CanvasJS.Chart(this.userChartElement.nativeElement, {
      animationEnabled: true,
      theme: "light2",
      title: {
        text: "User Activity"
      },
      axisX: {
        valueFormatString: "DD MMM",
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      axisY: {
        title: "Number of Users",
        includeZero: true,
        crosshair: {
          enabled: true
        }
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "bottom",
        horizontalAlign: "center"
      },
      data: [{
        type: "line",
        showInLegend: true,
        name: "New Users",
        markerType: "square",
        xValueFormatString: "DD MMM, YYYY",
        color: "#4caf50",
        dataPoints: data.newUsersOverTime.map((item: any) => ({
          x: new Date(item.date),
          y: item.count
        }))
      },
      {
        type: "line",
        showInLegend: true,
        name: "Active Users",
        markerType: "circle",
        color: "#2196f3",
        dataPoints: data.loginActivity.map((item: any) => ({
          x: new Date(item.date),
          y: item.count
        }))
      }]
    });

    chart.render();
  }

  renderContentChart(data: any) {
    if (!this.contentChartElement || !data) return;

    const chart = new CanvasJS.Chart(this.contentChartElement.nativeElement, {
      animationEnabled: true,
      theme: "light2",
      title: {
        text: "Content Activity"
      },
      axisX: {
        valueFormatString: "DD MMM",
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      axisY: {
        title: "Count",
        includeZero: true,
        crosshair: {
          enabled: true
        }
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "bottom",
        horizontalAlign: "center"
      },
      data: [{
        type: "column",
        showInLegend: true,
        name: "Trips",
        color: "#ff9800",
        dataPoints: data.tripsCreatedOverTime.map((item: any) => ({
          x: new Date(item.date),
          y: item.count
        }))
      },
      {
        type: "column",
        showInLegend: true,
        name: "Images",
        color: "#9c27b0",
        dataPoints: data.imagesUploadedOverTime.map((item: any) => ({
          x: new Date(item.date),
          y: item.count
        }))
      },
      {
        type: "column",
        showInLegend: true,
        name: "AI Images",
        color: "#673ab7",
        dataPoints: data.aiImagesGeneratedOverTime.map((item: any) => ({
          x: new Date(item.date),
          y: item.count
        }))
      }]
    });

    chart.render();
  }

  renderStorageChart(data: any) {
    if (!this.storageChartElement || !data) return;

    const chart = new CanvasJS.Chart(this.storageChartElement.nativeElement, {
      animationEnabled: true,
      theme: "light2",
      title: {
        text: "Storage Usage"
      },
      subtitles: [{
        text: `Total: ${this.formatBytes(data.totalCapacity)}`
      }],
      data: [{
        type: "doughnut",
        indexLabel: "{name}: {y}%",
        innerRadius: "60%",
        toolTipContent: "<b>{name}</b>: {absoluteY} ({y}%)",
        dataPoints: [
          {
            y: Math.round((data.usedStorage / data.totalCapacity) * 100),
            name: "Used",
            color: "#f44336",
            absoluteY: this.formatBytes(data.usedStorage)
          },
          {
            y: Math.round((data.availableStorage / data.totalCapacity) * 100),
            name: "Available",
            color: "#4caf50",
            absoluteY: this.formatBytes(data.availableStorage)
          }
        ]
      }]
    });

    chart.render();
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  viewAllUsers() {
    this.router.navigate(['/users']);
  }

  viewAllStats() {
    this.router.navigate(['/statistics']);
  }
}