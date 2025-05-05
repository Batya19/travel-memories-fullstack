# 🌍 TravelMemories Admin Panel

![Angular](https://img.shields.io/badge/Angular-19-dd0031)
![PrimeNG](https://img.shields.io/badge/PrimeNG-17-02569B)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6)

> A modern administrative dashboard for managing the TravelMemories SaaS platform, built with cutting-edge web technologies for a seamless management experience.

## 🚀 Overview

This Angular-based admin panel provides a comprehensive interface for system administrators to manage users, monitor system performance, and configure platform settings. Built with Angular 19 and PrimeNG, it offers a rich set of features for efficient platform management.

## ✨ Key Features

### 📊 Dashboard
- Real-time system statistics and metrics
- User growth tracking and visualization
- Storage usage monitoring
- Recent activity feed with action notifications
- Interactive charts using Chart.js

### 👥 User Management
- Complete CRUD operations for user accounts
- Advanced filtering and search functionality
- Quota management (storage and AI images)
- Role management (USER/SYSTEM_ADMIN)
- Progress tracking for resource utilization

### 📈 Statistics & Analytics
- Growth charts for users, trips, and images
- Time range filtering (3/6/12 months)
- AI-generated vs regular images distribution
- Exportable user activity logs
- Comprehensive system performance metrics

### ⚙️ System Settings
- Default user quota configuration
- File upload size and type restrictions
- User registration toggle
- Maintenance mode controls
- Platform-wide settings management

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 19 | Frontend framework |
| **PrimeNG** | 17 | UI component library |
| **TypeScript** | 5.6 | Type-safe development |
| **RxJS** | 7.8 | Reactive programming |
| **Chart.js** | 4.4 | Data visualization |
| **JWT** | - | Authentication |

## 📂 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/           # System dashboard
│   │   ├── login/              # Authentication
│   │   ├── statistics/         # Analytics & charts
│   │   ├── user-management/    # User CRUD operations
│   │   ├── system-settings/    # Configuration panel
│   │   └── layout/
│   │       ├── header/         # Navigation header
│   │       └── sidebar/        # Side navigation menu
│   ├── core/
│   │   ├── guards/             # Route protection
│   │   ├── interceptors/       # HTTP interceptors
│   │   ├── models/             # TypeScript interfaces
│   │   └── services/           # API service layer
│   ├── app.component.*         # Root component
│   ├── app.config.ts          # Application configuration
│   └── app.routes.ts          # Route definitions
├── environments/              # Environment configurations
└── styles.css                # Global styling
```

## 🔐 Authentication & Security

- JWT-based authentication system
- Role-based access control
- Route guards for protected areas
- HTTP interceptor for token management
- Secure session handling

## 🎯 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Angular CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/Batya19/travel-memories-fullstack.git

# Navigate to admin panel
cd travel-memories-fullstack/angular-admin

# Install dependencies
npm install

# Start development server
ng serve

# Access at http://localhost:4200
```

### Environment Configuration

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://travel-memories-api.onrender.com/api'
};
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

Project Link: [https://github.com/Batya19/travel-memories-fullstack](https://github.com/Batya19/travel-memories-fullstack/tree/main/angular-admin)

---

**Built with ❤️ using Angular & PrimeNG**