import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Services
import { StatsService } from '../../core/services/stats.service';

// PrimeNG Components
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { MessageService } from 'primeng/api';

declare const CanvasJS: any;

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    CalendarModule,
    SelectButtonModule,
    ToastModule,
    TableModule,
    TabViewModule
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  providers: [MessageService]
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  @ViewChild('userActivityChart') userActivityChartElement!: ElementRef;
  @ViewChild('contentActivityChart') contentActivityChartElement!: ElementRef;
  @ViewChild('aiUsageChart') aiUsageChartElement!: ElementRef;
  @ViewChild('storageDistributionChart') storageDistributionChartElement!: ElementRef;
  
  loading = true;
  
  // Date range for filtering
  startDate: Date = new Date();
  endDate: Date = new Date();
  
  // Time frame options
  timeFrameOptions = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];
  selectedTimeFrame = 'day';
  
  // Stats data
  systemStats: any = {};
  userActivityStats: any = {};
  contentStats: any = {};
  aiUsageStats: any = {};
  storageStats: any = {};
  
  // Top users data
  topUsersByStorage: any[] = [];
  topUsersByAiUsage: any[] = [];
  
  constructor(
    private statsService: StatsService,
    private messageService: MessageService
  ) {
    // Set default date range (last 30 days)
    this.endDate = new Date();
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 30);
  }
  
  ngOnInit() {
    this.loading = true;
    this.loadStatisticsData();
  }
  
  ngAfterViewInit() {
    // Charts will be rendered after data is loaded
  }
  
  loadStatisticsData() {
    this.loading = true;
    
    // Load system overview stats
    this.statsService.getSystemStats().subscribe({
      next: (data) => {
        this.systemStats = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load system statistics'
        });
        console.error('Error loading system stats:', error);
        this.loading = false;
      }
    });
    
    // Load chart data with filters
    this.loadChartData();
    
    // Load top users data
    this.loadTopUsersData();
  }
  
  loadChartData() {
    const params = {
      startDate: this.formatDate(this.startDate),
      endDate: this.formatDate(this.endDate),
      timeFrame: this.selectedTimeFrame as 'day' | 'week' | 'month'
    };
    
    // Load user activity data
    this.statsService.getUserActivityStats(params).subscribe({
      next: (data) => {
        this.userActivityStats = data;
        this.renderUserActivityChart();
      },
      error: (error) => {
        console.error('Error loading user activity stats:', error);
      }
    });
    
    // Load content stats
    this.statsService.getContentStats(params).subscribe({
      next: (data) => {
        this.contentStats = data;
        this.renderContentActivityChart();
      },
      error: (error) => {
        console.error('Error loading content stats:', error);
      }
    });
    
    // Load AI usage stats
    this.statsService.getAiUsageStats(params).subscribe({
      next: (data) => {
        this.aiUsageStats = data;
        this.renderAiUsageChart();
      },
      error: (error) => {
        console.error('Error loading AI usage stats:', error);
      }
    });
    
    // Load storage stats
    this.statsService.getStorageStats().subscribe({
      next: (data) => {
        this.storageStats = data;
        this.renderStorageDistributionChart();
      },
      error: (error) => {
        console.error('Error loading storage stats:', error);
      }
    });
  }
  
  loadTopUsersData() {
    // Load top users by storage
    this.statsService.getTopUsersByStorage(10).subscribe({
      next: (data) => {
        this.topUsersByStorage = data;
      },
      error: (error) => {
        console.error('Error loading top storage users:', error);
      }
    });
    
    // Load top users by AI usage
    this.statsService.getTopUsersByAiUsage(10).subscribe({
      next: (data) => {
        this.topUsersByAiUsage = data;
      },
      error: (error) => {
        console.error('Error loading top AI users:', error);
      }
    });
  }
  
  onDateChange() {
    this.loadChartData();
  }
  
  onTimeFrameChange() {
    this.loadChartData();
  }
  
  renderUserActivityChart() {
    if (!this.userActivityChartElement || !this.userActivityStats.newUsersOverTime) return;
    
    const chart = new CanvasJS.Chart(this.userActivityChartElement.nativeElement, {
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
        type: "spline",
        showInLegend: true,
        name: "New Users",
        markerType: "square",
        xValueFormatString: "DD MMM, YYYY",
        color: "#4caf50",
        dataPoints: this.userActivityStats.newUsersOverTime.map((item: any) => ({
          x: new Date(item.date),
          y: item.count
        }))
      },
      {
        type: "spline",
        showInLegend: true,
        name: "Active Users",
        markerType: "circle",
        color: "#2196f3",
        dataPoints: this.userActivityStats.loginActivity.map((item: any) => ({
          x: new Date(item.date),
          y: item.count
        }))
      }]
    });
    
    chart.render();
  }
  
  renderContentActivityChart() {
    if (!this.contentActivityChartElement || !this.contentStats.tripsCreatedOverTime) return;
    
    const chart = new CanvasJS.Chart(this.contentActivityChartElement.nativeElement, {
      animationEnabled: true,
      theme: "light2",
      title: {
        text: "Content Creation"
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
        type: "stackedColumn",
        showInLegend: true,
        name: "Trips",
        color: "#ff9800",
        dataPoints: this.contentStats.tripsCreatedOverTime.map((item: any) => ({
          x: new Date(item.date),
          y: item.count
        }))
      },
      {
        type: "stackedColumn",
        showInLegend: true,
        name: "Images",
        color: "#9c27b0",
        dataPoints: this.contentStats.imagesUploadedOverTime.map((item: any) => ({
          x: new Date(item.date),
          y: item.count
        }))
      },
      {
        type: "stackedColumn",
        showInLegend: true,
        name: "AI Images",
        color: "#673ab7",
        dataPoints: this.contentStats.aiImagesGeneratedOverTime.map((item: any) => ({
          x: new Date(item.date),
          y: item.count
        }))
      }]
    });
    
    chart.render();
  }
  
  renderAiUsageChart() {
    if (!this.aiUsageChartElement || !this.aiUsageStats.imagesGeneratedOverTime) return;
    
    const chart = new CanvasJS.Chart(this.aiUsageChartElement.nativeElement, {
      animationEnabled: true,
      theme: "light2",
      title: {
        text: "AI Image Generation"
      },
      axisX: {
        valueFormatString: "DD MMM",
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      axisY: {
        title: "Images Generated",
        includeZero: true,
        crosshair: {
          enabled: true
        }
      },
      data: [{
        type: "area",
        color: "#6f42c1",
        xValueFormatString: "DD MMM, YYYY",
        yValueFormatString: "#,### images",
        dataPoints: this.aiUsageStats.imagesGeneratedOverTime.map((item: any) => ({
          x: new Date(item.date),
          y: item.count
        }))
      }]
    });
    
    chart.render();
  }
  
  renderStorageDistributionChart() {
    if (!this.storageDistributionChartElement || !this.storageStats.storageByUserType) return;
    
    const chart = new CanvasJS.Chart(this.storageDistributionChartElement.nativeElement, {
      animationEnabled: true,
      theme: "light2",
      title: {
        text: "Storage Distribution by User Type"
      },
      data: [{
        type: "pie",
        showInLegend: true,
        indexLabel: "{name}: {y}%",
        legendText: "{name}: {absoluteY}",
        toolTipContent: "<b>{name}</b>: {absoluteY} ({y}%)",
        dataPoints: this.storageStats.storageByUserType.map((item: any) => ({
          name: item.label,
          y: Math.round((item.value / this.storageStats.totalCapacity) * 100),
          absoluteY: this.formatBytes(item.value)
        }))
      }]
    });
    
    chart.render();
  }
  
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}