# TravelMemories Admin Dashboard

Admin dashboard for the TravelMemories application, built with Angular 19 and PrimeNG.

## Features

- **Dashboard**: View system statistics and user activity
- **Statistics**: Detailed analytics and activity logs
- **User Management**: Create, update, and delete users
- **System Settings**: Configure system-wide settings

## Technology Stack

- Angular 19 (Standalone Components)
- PrimeNG UI Components
- CanvasJS Charts
- JWT Authentication

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/travelmemories-admin.git
cd travelmemories-admin
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
   - Open `src/environments/environment.ts`
   - Update the API URL to point to your backend service

### Development

Start the development server:
```bash
ng serve
```

The application will be available at `http://localhost:4200`.

### Building for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── login/
│   │   ├── register/
│   │   ├── statistics/
│   │   ├── user-management/
│   │   └── system-settings/
│   ├── core/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── services/
│   ├── shared/
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
└── environments/
```

## API Endpoints

The admin dashboard interacts with the following API endpoints:

### Authentication
- `POST /api/auth/login` - Authenticate admin users
- `POST /api/auth/register` - Register new admins

### Statistics
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/user-activity` - Get user activity logs

### User Management
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/{id}` - Get a specific user
- `POST /api/admin/users` - Create a new user
- `PUT /api/admin/users/{id}` - Update a user
- `DELETE /api/admin/users/{id}` - Delete a user

### System Settings
- `GET /api/admin/settings` - Get system settings
- `PUT /api/admin/settings` - Update system settings