// import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';

// // Services
// import { StatsService } from '../../core/services/stats.service';

// // PrimeNG Components
// import { CardModule } from 'primeng/card';
// import { ButtonModule } from 'primeng/button';
// import { TableModule } from 'primeng/table';
// import { ProgressBarModule } from 'primeng/progressbar';
// import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';

// declare const CanvasJS: any;

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [
//     CommonModule,
//     CardModule,
//     ButtonModule,
//     TableModule,
//     ProgressBarModule,
//     ToastModule
//   ],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.scss',
//   providers: [MessageService]
// })
// export class DashboardComponent implements OnInit, AfterViewInit {
//   @ViewChild('userChart') userChartElement!: ElementRef;
//   @ViewChild('contentChart') contentChartElement!: ElementRef;
//   @ViewChild('storageChart') storageChartElement!: ElementRef;

//   loading = true;
//   systemStats: any = {};
//   topUsers: any[] = [];

//   constructor(
//     private statsService: StatsService,
//     private router: Router,
//     private messageService: MessageService
//   ) { }

//   ngOnInit() {
//     this.loading = true;
//     this.loadDashboardData();
//   }

//   ngAfterViewInit() {
//     // Charts will be initialized after data is loaded
//   }

//   loadDashboardData() {
//     // Load system stats
//     this.statsService.getSystemStats().subscribe({
//       next: (data) => {
//         this.systemStats = data;
//         this.loading = false;
//       },
//       error: (error) => {
//         this.loading = false;
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to load system statistics'
//         });
//         console.error('Error loading system stats:', error);
//       }
//     });

//     // Load top users by storage
//     this.statsService.getTopUsersByStorage(5).subscribe({
//       next: (data) => {
//         this.topUsers = data;
//       },
//       error: (error) => {
//         console.error('Error loading top users:', error);
//       }
//     });

//     // Load chart data
//     this.loadChartData();
//   }

//   loadChartData() {
//     // Load user activity data for chart
//     this.statsService.getUserActivityStats().subscribe({
//       next: (data) => {
//         this.renderUserChart(data);
//       },
//       error: (error) => {
//         console.error('Error loading user activity:', error);
//       }
//     });

//     // Load content stats for chart
//     this.statsService.getContentStats().subscribe({
//       next: (data) => {
//         this.renderContentChart(data);
//       },
//       error: (error) => {
//         console.error('Error loading content stats:', error);
//       }
//     });

//     // Load storage stats for chart
//     this.statsService.getStorageStats().subscribe({
//       next: (data) => {
//         this.renderStorageChart(data);
//       },
//       error: (error) => {
//         console.error('Error loading storage stats:', error);
//       }
//     });
//   }

//   renderUserChart(data: any) {
//     if (!this.userChartElement || !data) return;

//     const chart = new CanvasJS.Chart(this.userChartElement.nativeElement, {
//       animationEnabled: true,
//       theme: "light2",
//       title: {
//         text: "User Activity"
//       },
//       axisX: {
//         valueFormatString: "DD MMM",
//         crosshair: {
//           enabled: true,
//           snapToDataPoint: true
//         }
//       },
//       axisY: {
//         title: "Number of Users",
//         includeZero: true,
//         crosshair: {
//           enabled: true
//         }
//       },
//       toolTip: {
//         shared: true
//       },
//       legend: {
//         cursor: "pointer",
//         verticalAlign: "bottom",
//         horizontalAlign: "center"
//       },
//       data: [{
//         type: "line",
//         showInLegend: true,
//         name: "New Users",
//         markerType: "square",
//         xValueFormatString: "DD MMM, YYYY",
//         color: "#4caf50",
//         dataPoints: data.newUsersOverTime.map((item: any) => ({
//           x: new Date(item.date),
//           y: item.count
//         }))
//       },
//       {
//         type: "line",
//         showInLegend: true,
//         name: "Active Users",
//         markerType: "circle",
//         color: "#2196f3",
//         dataPoints: data.loginActivity.map((item: any) => ({
//           x: new Date(item.date),
//           y: item.count
//         }))
//       }]
//     });

//     chart.render();
//   }

//   renderContentChart(data: any) {
//     if (!this.contentChartElement || !data) return;

//     const chart = new CanvasJS.Chart(this.contentChartElement.nativeElement, {
//       animationEnabled: true,
//       theme: "light2",
//       title: {
//         text: "Content Activity"
//       },
//       axisX: {
//         valueFormatString: "DD MMM",
//         crosshair: {
//           enabled: true,
//           snapToDataPoint: true
//         }
//       },
//       axisY: {
//         title: "Count",
//         includeZero: true,
//         crosshair: {
//           enabled: true
//         }
//       },
//       toolTip: {
//         shared: true
//       },
//       legend: {
//         cursor: "pointer",
//         verticalAlign: "bottom",
//         horizontalAlign: "center"
//       },
//       data: [{
//         type: "column",
//         showInLegend: true,
//         name: "Trips",
//         color: "#ff9800",
//         dataPoints: data.tripsCreatedOverTime.map((item: any) => ({
//           x: new Date(item.date),
//           y: item.count
//         }))
//       },
//       {
//         type: "column",
//         showInLegend: true,
//         name: "Images",
//         color: "#9c27b0",
//         dataPoints: data.imagesUploadedOverTime.map((item: any) => ({
//           x: new Date(item.date),
//           y: item.count
//         }))
//       },
//       {
//         type: "column",
//         showInLegend: true,
//         name: "AI Images",
//         color: "#673ab7",
//         dataPoints: data.aiImagesGeneratedOverTime.map((item: any) => ({
//           x: new Date(item.date),
//           y: item.count
//         }))
//       }]
//     });

//     chart.render();
//   }

//   renderStorageChart(data: any) {
//     if (!this.storageChartElement || !data) return;

//     const chart = new CanvasJS.Chart(this.storageChartElement.nativeElement, {
//       animationEnabled: true,
//       theme: "light2",
//       title: {
//         text: "Storage Usage"
//       },
//       subtitles: [{
//         text: `Total: ${this.formatBytes(data.totalCapacity)}`
//       }],
//       data: [{
//         type: "doughnut",
//         indexLabel: "{name}: {y}%",
//         innerRadius: "60%",
//         toolTipContent: "<b>{name}</b>: {absoluteY} ({y}%)",
//         dataPoints: [
//           {
//             y: Math.round((data.usedStorage / data.totalCapacity) * 100),
//             name: "Used",
//             color: "#f44336",
//             absoluteY: this.formatBytes(data.usedStorage)
//           },
//           {
//             y: Math.round((data.availableStorage / data.totalCapacity) * 100),
//             name: "Available",
//             color: "#4caf50",
//             absoluteY: this.formatBytes(data.availableStorage)
//           }
//         ]
//       }]
//     });

//     chart.render();
//   }

//   formatBytes(bytes: number): string {
//     if (bytes === 0) return '0 Bytes';

//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));

//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   }

//   viewAllUsers() {
//     this.router.navigate(['/users']);
//   }

//   viewAllStats() {
//     this.router.navigate(['/statistics']);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { StatsService } from '../../core/services/stats.service';
import { StatisticsResponse } from '../../core/models/statistics-response.model';
import { UserActivityItem } from '../../core/models/user-activity-item.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    TableModule,
    ButtonModule,
    ChartModule
  ],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      
      <div class="dashboard-cards">
        <p-card styleClass="stats-card">
          <div class="stats-icon users">
            <i class="pi pi-users"></i>
          </div>
          <div class="stats-details">
            <span class="stats-title">Total Users</span>
            <span class="stats-value">{{ stats?.totalUsers || 0 }}</span>
          </div>
        </p-card>
        
        <p-card styleClass="stats-card">
          <div class="stats-icon trips">
            <i class="pi pi-map"></i>
          </div>
          <div class="stats-details">
            <span class="stats-title">Total Trips</span>
            <span class="stats-value">{{ stats?.totalTrips || 0 }}</span>
          </div>
        </p-card>
        
        <p-card styleClass="stats-card">
          <div class="stats-icon images">
            <i class="pi pi-images"></i>
          </div>
          <div class="stats-details">
            <span class="stats-title">Total Images</span>
            <span class="stats-value">{{ stats?.totalImages || 0 }}</span>
          </div>
        </p-card>
        
        <p-card styleClass="stats-card">
          <div class="stats-icon ai">
            <i class="pi pi-bolt"></i>
          </div>
          <div class="stats-details">
            <span class="stats-title">AI Generated</span>
            <span class="stats-value">{{ stats?.aiGeneratedImages || 0 }}</span>
          </div>
        </p-card>
      </div>
      
      <div class="chart-row">
        <p-card header="Users Growth" styleClass="chart-card">
          <div class="chart-container">
            <div #usersChartContainer id="usersChartContainer" style="height: 300px; width: 100%;"></div>
          </div>
        </p-card>
        
        <p-card header="Storage Usage" styleClass="chart-card">
          <div class="chart-container">
            <div #storageChartContainer id="storageChartContainer" style="height: 300px; width: 100%;"></div>
          </div>
        </p-card>
      </div>
      
      <p-card header="Recent User Activity" styleClass="activity-card">
        <p-table
          [value]="activity"
          [rows]="5"
          [paginator]="true"
          [responsive]="true"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Time</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td>{{ item.userName }}</td>
              <td>
                <span [ngClass]="'activity-badge ' + getActionClass(item.action)">
                  {{ item.action }}
                </span>
              </td>
              <td>{{ item.entityType }}: {{ item.entityName }}</td>
              <td>{{ item.timestamp | date:'medium' }}</td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="4" class="text-center">No recent activity found</td>
            </tr>
          </ng-template>
        </p-table>
        
        <div class="view-all-link">
          <a [routerLink]="['/admin/statistics']">View All Activity</a>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1rem;
    }
    
    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stats-card {
      display: flex;
      align-items: center;
      height: 100%;
    }
    
    :host ::ng-deep .stats-card .p-card-body {
      padding: 1.5rem;
    }
    
    :host ::ng-deep .stats-card .p-card-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0;
    }
    
    .stats-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      color: white;
    }
    
    .stats-icon i {
      font-size: 1.5rem;
    }
    
    .stats-icon.users {
      background-color: #3f51b5;
    }
    
    .stats-icon.trips {
      background-color: #009688;
    }
    
    .stats-icon.images {
      background-color: #ff9800;
    }
    
    .stats-icon.ai {
      background-color: #e91e63;
    }
    
    .stats-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .stats-title {
      font-size: 0.875rem;
      color: #666666;
    }
    
    .stats-value {
      font-size: 1.75rem;
      font-weight: 600;
      color: #333333;
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
    
    .view-all-link {
      text-align: right;
      margin-top: 1rem;
    }
    
    @media (max-width: 768px) {
      .chart-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: StatisticsResponse | null = null;
  activity: UserActivityItem[] = [];
  
  usersChartData: any;
  storageChartData: any;
  chartOptions: any;
  pieChartOptions: any;
  
  constructor(private statsService: StatsService) {}
  
  ngOnInit(): void {
    this.loadStats();
    this.loadUserActivity();
    this.initChartOptions();
  }
  
  loadStats(): void {
    this.statsService.getSystemStats().subscribe(data => {
      this.stats = data;
      this.updateChartData();
    });
  }
  
  loadUserActivity(): void {
    this.statsService.getUserActivity(10).subscribe(data => {
      this.activity = data;
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
    
    this.storageChartData = {
      labels: ['Used', 'Available'],
      datasets: [
        {
          data: [0, 100],
          backgroundColor: ['#ff9800', '#e0e0e0']
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
    
    // Update storage usage chart
    const usedStorage = this.stats.storageUsed / 1024; // Convert to GB
    const totalStorage = this.stats.totalStorageQuota / 1024; // Convert to GB
    const availableStorage = Math.max(0, totalStorage - usedStorage);
    
    this.storageChartData = {
      labels: ['Used Storage (GB)', 'Available Storage (GB)'],
      datasets: [
        {
          data: [usedStorage.toFixed(2), availableStorage.toFixed(2)],
          backgroundColor: ['#ff9800', '#e0e0e0']
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