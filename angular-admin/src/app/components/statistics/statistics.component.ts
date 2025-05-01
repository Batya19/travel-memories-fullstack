// import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { StatsService } from '../../core/services/stats.service';
// import { StatisticsResponse } from '../../core/models/statistics-response.model';
// import { MessageService } from 'primeng/api';
// import * as CanvasJS from '@canvasjs/charts';

// @Component({
//   selector: 'app-statistics',
//   templateUrl: './statistics.component.html',
//   styleUrls: ['./statistics.component.css']
// })
// export class StatisticsComponent implements OnInit {
//   @ViewChild('usersChart', { static: true }) usersChartRef!: ElementRef;
//   @ViewChild('tripsChart', { static: true }) tripsChartRef!: ElementRef;
//   @ViewChild('imagesChart', { static: true }) imagesChartRef!: ElementRef;

//   stats: StatisticsResponse | null = null;
//   loading = true;
//   usersChart: any;
//   tripsChart: any;
//   imagesChart: any;

//   constructor(
//     private statsService: StatsService,
//     private messageService: MessageService
//   ) { }

//   ngOnInit(): void {
//     this.loadStatistics();
//   }

//   loadStatistics(): void {
//     this.loading = true;
//     this.statsService.getStatistics().subscribe({
//       next: (data) => {
//         this.stats = data;
//         this.loading = false;
        
//         // Initialize charts after data is loaded
//         setTimeout(() => {
//           this.initializeCharts();
//         }, 100);
//       },
//       error: (error) => {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to load statistics'
//         });
//         this.loading = false;
//         console.error('Error fetching statistics:', error);
//       }
//     });
//   }

//   initializeCharts(): void {
//     if (!this.stats) return;

//     // Create users chart
//     this.renderUsersChart();
    
//     // Create trips chart
//     this.renderTripsChart();
    
//     // Create images chart
//     this.renderImagesChart();
//   }

//   renderUsersChart(): void {
//     if (!this.stats) return;

//     const data = Object.keys(this.stats.usersByMonth).map(month => ({
//       label: month,
//       y: this.stats!.usersByMonth[month]
//     }));

//     this.usersChart = new CanvasJS.Chart(this.usersChartRef.nativeElement, {
//       animationEnabled: true,
//       exportEnabled: false,
//       theme: "light2",
//       title: {
//         text: "New Users by Month"
//       },
//       axisX: {
//         margin: 10,
//         labelPlacement: "inside",
//         tickPlacement: "inside"
//       },
//       axisY: {
//         includeZero: true,
//         title: "Number of Users",
//         titleFontSize: 13
//       },
//       data: [{
//         type: "column",
//         dataPoints: data
//       }]
//     });

//     this.usersChart.render();
//   }

//   renderTripsChart(): void {
//     if (!this.stats) return;

//     const data = Object.keys(this.stats.tripsByMonth).map(month => ({
//       label: month,
//       y: this.stats!.tripsByMonth[month]
//     }));

//     this.tripsChart = new CanvasJS.Chart(this.tripsChartRef.nativeElement, {
//       animationEnabled: true,
//       exportEnabled: false,
//       theme: "light2",
//       title: {
//         text: "Trips Created by Month"
//       },
//       axisX: {
//         margin: 10,
//         labelPlacement: "inside",
//         tickPlacement: "inside"
//       },
//       axisY: {
//         includeZero: true,
//         title: "Number of Trips",
//         titleFontSize: 13
//       },
//       data: [{
//         type: "line",
//         dataPoints: data
//       }]
//     });

//     this.tripsChart.render();
//   }

//   renderImagesChart(): void {
//     if (!this.stats) return;

//     const data = [
//       { y: this.stats.totalImages - this.stats.totalAiImages, name: "Regular Images" },
//       { y: this.stats.totalAiImages, name: "AI-Generated Images" }
//     ];

//     this.imagesChart = new CanvasJS.Chart(this.imagesChartRef.nativeElement, {
//       animationEnabled: true,
//       exportEnabled: false,
//       theme: "light2",
//       title: {
//         text: "Image Distribution"
//       },
//       data: [{
//         type: "pie",
//         startAngle: 240,
//         yValueFormatString: "##0",
//         indexLabel: "{name}: {y}",
//         dataPoints: data
//       }]
//     });

//     this.imagesChart.render();
//   }

//   refreshStatistics(): void {
//     this.loadStatistics();
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { StatsService } from '../../core/services/stats.service';
import { StatisticsResponse } from '../../core/models/statistics-response.model';
import { UserActivityItem } from '../../core/models/user-activity-item.model';

interface PeriodOption {
  label: string;
  value: 'daily' | 'weekly' | 'monthly';
}

interface TimeRangeOption {
  label: string;
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
    DropdownModule,
    TableModule,
    ButtonModule
  ],
  template: `
    <div class="statistics-container">
      <h1>System Statistics</h1>
      
      <div class="filter-row">
        <div class="filter-item">
          <label for="period">Time Period</label>
          <p-dropdown 
            id="period"
            [options]="periodOptions" 
            [(ngModel)]="selectedPeriod" 
            (onChange)="loadStatistics()"
            optionLabel="label"
          ></p-dropdown>
        </div>
        
        <div class="filter-item">
          <label for="timeRange">Time Range</label>
          <p-dropdown 
            id="timeRange"
            [options]="timeRangeOptions" 
            [(ngModel)]="selectedTimeRange" 
            (onChange)="loadStatistics()"
            optionLabel="label"
          ></p-dropdown>
        </div>
      </div>
      
      <div class="chart-row">
        <p-card header="Users Growth" styleClass="chart-card">
          <div class="chart-container">
            <p-chart type="line" [data]="usersChartData" [options]="chartOptions"></p-chart>
          </div>
        </p-card>
        
        <p-card header="Trips Growth" styleClass="chart-card">
          <div class="chart-container">
            <p-chart type="line" [data]="tripsChartData" [options]="chartOptions"></p-chart>
          </div>
        </p-card>
      </div>
      
      <div class="chart-row">
        <p-card header="Images Growth" styleClass="chart-card">
          <div class="chart-container">
            <p-chart type="line" [data]="imagesChartData" [options]="chartOptions"></p-chart>
          </div>
        </p-card>
        
        <p-card header="Images Distribution" styleClass="chart-card">
          <div class="chart-container">
            <p-chart type="doughnut" [data]="imageDistributionChartData" [options]="pieChartOptions"></p-chart>
          </div>
        </p-card>
      </div>
      
      <p-card header="User Activity Log" styleClass="activity-card">
        <p-table
          [value]="activityItems"
          [paginator]="true"
          [rows]="10"
          [showCurrentPageReport]="true"
          [rowsPerPageOptions]="[10, 25, 50]"
          [responsive]="true"
          styleClass="p-datatable-sm"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="timestamp">Time <p-sortIcon field="timestamp"></p-sortIcon></th>
              <th pSortableColumn="userName">User <p-sortIcon field="userName"></p-sortIcon></th>
              <th pSortableColumn="action">Action <p-sortIcon field="action"></p-sortIcon></th>
              <th pSortableColumn="entityType">Entity Type <p-sortIcon field="entityType"></p-sortIcon></th>
              <th>Entity</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td>{{ item.timestamp | date:'medium' }}</td>
              <td>{{ item.userName }}</td>
              <td>
                <span [ngClass]="'activity-badge ' + getActionClass(item.action)">
                  {{ item.action }}
                </span>
              </td>
              <td>{{ item.entityType }}</td>
              <td>{{ item.entityName }}</td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center">No activity found</td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: [`
    .statistics-container {
      padding: 1rem;
    }
    
    .filter-row {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .filter-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .chart-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .chart-container {
      height: 300px;
    }
    
    .activity-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .activity-badge.create {
      background-color: #4caf50;
      color: white;
    }
    
    .activity-badge.update {
      background-color: #2196f3;
      color: white;
    }
    
    .activity-badge.delete {
      background-color: #f44336;
      color: white;
    }
    
    .activity-badge.login {
      background-color: #9c27b0;
      color: white;
    }
    
    @media (max-width: 768px) {
      .chart-row {
        grid-template-columns: 1fr;
      }
      
      .filter-row {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class StatisticsComponent implements OnInit {
  stats: StatisticsResponse | null = null;
  activityItems: UserActivityItem[] = [];
  
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
  
  constructor(private statsService: StatsService) {}
  
  ngOnInit(): void {
    this.initChartOptions();
    this.loadStatistics();
    this.loadUserActivity();
  }
  
  loadStatistics(): void {
    this.statsService.getGrowthStats(
      this.selectedPeriod.value,
      this.selectedTimeRange.value
    ).subscribe(data => {
      this.stats = data;
      this.updateChartData();
    });
  }
  
  loadUserActivity(): void {
    this.statsService.getUserActivity(50).subscribe(data => {
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
    
    // Initialize empty chart data
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
    
    // Update users growth chart
    this.usersChartData = {
      labels: this.stats.usersGrowth.map(item => item.date),
      datasets: [
        {
          label: 'Users',
          data: this.stats.usersGrowth.map(item => item.value),
          borderColor: '#3f51b5',
          backgroundColor: 'rgba(63, 81, 181, 0.2)',
          tension: 0.4
        }
      ]
    };
    
    // Update trips growth chart
    this.tripsChartData = {
      labels: this.stats.tripsGrowth.map(item => item.date),
      datasets: [
        {
          label: 'Trips',
          data: this.stats.tripsGrowth.map(item => item.value),
          borderColor: '#009688',
          backgroundColor: 'rgba(0, 150, 136, 0.2)',
          tension: 0.4
        }
      ]
    };
    
    // Update images growth chart
    this.imagesChartData = {
      labels: this.stats.imagesGrowth.map(item => item.date),
      datasets: [
        {
          label: 'Images',
          data: this.stats.imagesGrowth.map(item => item.value),
          borderColor: '#ff9800',
          backgroundColor: 'rgba(255, 152, 0, 0.2)',
          tension: 0.4
        }
      ]
    };
    
    // Update image distribution chart
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
  
  getActionClass(action: string): string {
    switch (action) {
      case 'CREATE':
        return 'create';
      case 'UPDATE':
        return 'update';
      case 'DELETE':
        return 'delete';
      case 'LOGIN':
        return 'login';
      default:
        return '';
    }
  }
}