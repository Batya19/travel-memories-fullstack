import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { StatsService } from '../../core/services/stats.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface PeriodOption {
  label: string;
  value: 'daily' | 'weekly' | 'monthly';
}

interface TimeRangeOption {
  label: string;
  value: number;
}

interface GrowthDataPoint {
  date: string;
  value: number;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ChartModule,
    SelectModule,
    TableModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {
  stats: any = null;
  activityItems: any[] = [];

  usersChartData: any;
  tripsChartData: any;
  imagesChartData: any;
  imageDistributionChartData: any;

  chartOptions: any;
  pieChartOptions: any;

  periodOptions: PeriodOption[] = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' }
  ];

  timeRangeOptions: TimeRangeOption[] = [
    { label: 'Last 3 Months', value: 3 },
    { label: 'Last 6 Months', value: 6 },
    { label: 'Last 12 Months', value: 12 }
  ];

  selectedPeriod: PeriodOption = this.periodOptions[2]; // Monthly by default
  selectedTimeRange: TimeRangeOption = this.timeRangeOptions[1]; // Last 6 months by default

  constructor(
    private statsService: StatsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initChartOptions();
    this.loadStatistics();
    this.loadUserActivity();
  }

  loadStatistics(): void {
    this.statsService.getSystemStats().pipe(
      map(response => {
        const mappedData = {
          totalUsers: response.totalUsers || 0,
          totalTrips: response.totalTrips || 0,
          totalImages: response.totalImages || 0,
          aiGeneratedImages: response.totalAiImages || 0,
          usersByMonth: response.usersByMonth || {},
          tripsByMonth: response.tripsByMonth || {},
          imagesByMonth: response.imagesByMonth || {}
        };

        return mappedData;
      }),
      catchError(error => {
        console.error('Error loading statistics:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load statistics'
        });

        return of({
          totalUsers: 0,
          totalTrips: 0,
          totalImages: 0,
          aiGeneratedImages: 0,
          usersByMonth: {},
          tripsByMonth: {},
          imagesByMonth: {}
        });
      })
    ).subscribe(data => {
      this.stats = data;
      this.updateChartData();
    });
  }

  loadUserActivity(): void {
    this.statsService.getUserActivity(50).pipe(
      catchError(error => {
        console.error('Error loading user activity:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user activity'
        });
        return of([]);
      })
    ).subscribe(data => {
      this.activityItems = data;
    });
  }

  initChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        }
      }
    };

    this.initEmptyChartData();
  }

  initEmptyChartData(): void {
    this.usersChartData = {
      labels: [],
      datasets: [
        {
          label: 'Users',
          data: [],
          borderColor: '#3f51b5',
          backgroundColor: 'rgba(63, 81, 181, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.tripsChartData = {
      labels: [],
      datasets: [
        {
          label: 'Trips',
          data: [],
          borderColor: '#009688',
          backgroundColor: 'rgba(0, 150, 136, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.imagesChartData = {
      labels: [],
      datasets: [
        {
          label: 'Images',
          data: [],
          borderColor: '#ff9800',
          backgroundColor: 'rgba(255, 152, 0, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.imageDistributionChartData = {
      labels: ['Regular Images', 'AI Generated Images'],
      datasets: [
        {
          data: [0, 0],
          backgroundColor: ['#ff9800', '#e91e63']
        }
      ]
    };
  }

  updateChartData(): void {
    if (!this.stats) return;

    const usersGrowthData = this.convertDictionaryToGrowthData(this.stats.usersByMonth || {});
    const tripsGrowthData = this.convertDictionaryToGrowthData(this.stats.tripsByMonth || {});
    const imagesGrowthData = this.convertDictionaryToGrowthData(this.stats.imagesByMonth || {});

    this.usersChartData = {
      labels: usersGrowthData.map((item: GrowthDataPoint) => item.date),
      datasets: [
        {
          label: 'Users',
          data: usersGrowthData.map((item: GrowthDataPoint) => item.value),
          borderColor: '#3f51b5',
          backgroundColor: 'rgba(63, 81, 181, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.tripsChartData = {
      labels: tripsGrowthData.map((item: GrowthDataPoint) => item.date),
      datasets: [
        {
          label: 'Trips',
          data: tripsGrowthData.map((item: GrowthDataPoint) => item.value),
          borderColor: '#009688',
          backgroundColor: 'rgba(0, 150, 136, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.imagesChartData = {
      labels: imagesGrowthData.map((item: GrowthDataPoint) => item.date),
      datasets: [
        {
          label: 'Images',
          data: imagesGrowthData.map((item: GrowthDataPoint) => item.value),
          borderColor: '#ff9800',
          backgroundColor: 'rgba(255, 152, 0, 0.2)',
          tension: 0.4
        }
      ]
    };

    const regularImages = this.stats.totalImages - this.stats.aiGeneratedImages;

    this.imageDistributionChartData = {
      labels: ['Regular Images', 'AI Generated Images'],
      datasets: [
        {
          data: [regularImages, this.stats.aiGeneratedImages],
          backgroundColor: ['#ff9800', '#e91e63']
        }
      ]
    };
  }

  private convertDictionaryToGrowthData(dict: { [key: string]: number }): GrowthDataPoint[] {
    return Object.entries(dict).map(([date, value]) => ({
      date,
      value
    }));
  }

  getActionClass(action: string | undefined): string {
    if (!action) return 'unknown';

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
        return 'unknown';
    }
  }
}