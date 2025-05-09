# 🌍 TravelMemories

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-Latest-61DAFB?logo=react)](https://reactjs.org/)
[![Angular](https://img.shields.io/badge/Angular-Latest-DD0031?logo=angular)](https://angular.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?logo=postgresql)](https://www.postgresql.org/)
[![AWS S3](https://img.shields.io/badge/AWS_S3-Latest-232F3E?logo=amazon-aws)](https://aws.amazon.com/s3/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**TravelMemories** is an advanced SaaS platform for managing and documenting travel memories. The platform allows users to create, store, and share travel experiences through media files and text. The system integrates artificial intelligence (AI) capabilities to create images that enhance travel stories and provides display of travel locations on maps.

<!-- Screenshots will be added once the UI is finalized -->

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Technologies](#-technologies)
- [Development Timeline](#-development-timeline)
- [Frontend Architecture](#-frontend-architecture)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 📸 **Media Management**: Upload, organize, and manage photos from your travels
- 🤖 **AI-Generated Images**: Create AI images to complement your travel stories
- 🗺️ **Map Integration**: Mark and visualize your travel locations on interactive maps
- 📤 **Sharing**: Share your trips with others through unique links
- 👥 **User Management**: Register, login, and manage user profiles
- 🔍 **Search & Filter**: Find media files quickly with advanced search options
- 🏷️ **Tagging System**: Organize content with customizable tags
- ⚙️ **Admin Dashboard**: Manage users and view system statistics

## 🏗 Architecture

TravelMemories follows a clean, layered architecture pattern:

<!-- Architecture diagram will be added in future updates -->

- **Presentation Layer**: API controllers handling HTTP requests/responses
- **Service Layer**: Business logic implementation
- **Data Access Layer**: Repository pattern for database operations
- **Core Layer**: Domain models, interfaces, and DTOs

## 📁 Project Structure

```
TravelMemories
│   TravelMemories.sln
│
├───TravelMemories (API Layer)
│   │   Program.cs
│   │   ServiceExtensions.cs
│   │
│   ├───Controllers
│   │       AIImageController.cs
│   │       AuthController.cs
│   │       ImageController.cs
│   │       TripController.cs
│   │       UsersController.cs
│   │
│   └───Middleware
│           ExceptionMiddleware.cs
│           JwtMiddleware.cs
│
├───TravelMemories.Core (Domain Layer)
│   ├───DTOs
│   │   ├───Admin
│   │   ├───AIImage
│   │   ├───Auth
│   │   ├───Image
│   │   ├───Tag
│   │   ├───Trip
│   │   └───User
│   │
│   ├───Interfaces
│   │   ├───External
│   │   └───Repositories
│   │
│   └───Models
│           Trip.cs
│           User.cs
│           Image.cs
│           Tag.cs
│
├───TravelMemories.Data (Data Access Layer)
│   ├───Context
│   │       ApplicationDbContext.cs
│   │
│   ├───Migrations
│   │
│   └───Repositories
│           Repository.cs
│           TripRepository.cs
│           UserRepository.cs
│
└───TravelMemories.Service (Business Logic Layer)
    ├───External
    │       HuggingFaceClient.cs
    │       S3Service.cs
    │
    ├───Helpers
    │       JwtHelper.cs
    │       ImageHelper.cs
    │
    └───Services
            AIImageService.cs
            AuthService.cs
            ImageService.cs
            TripService.cs
            UserService.cs
```

## 🚀 Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Node.js](https://nodejs.org/) (for React frontend)
- AWS Account (for S3 storage)
- [Hugging Face API Key](https://huggingface.co/) (for AI image generation)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Batya19/travel-memories-fullstack.git
   cd travel-memories
   ```

2. Update the connection string in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Database=travelmemories;Username=postgres;Password=yourpassword"
   }
   ```

3. Set up AWS S3 and Hugging Face API keys in `appsettings.json`:
   ```json
   "AWS": {
     "Profile": "default",
     "Region": "us-east-1",
     "S3BucketName": "your-bucket-name"
   },
   "HuggingFace": {
     "ApiKey": "your-api-key",
     "ModelEndpoint": "stabilityai/stable-diffusion-2"
   }
   ```

4. Run database migrations:
   ```bash
   cd TravelMemories
   dotnet ef database update
   ```

5. Start the API:
   ```bash
   dotnet run
   ```
   The API will run on `https://localhost:7051` by default

### Frontend Setup

#### React App (Main User Interface)
```bash
cd ../frontend/travel-memories-client
npm install
npm start
```
The React app will run on `http://localhost:3000` by default

#### Angular App (Admin Dashboard)
```bash
cd ../admin-dashboard
npm install
ng serve
```
The Angular app will run on `http://localhost:4200` by default

## 📝 API Documentation

The API documentation is available when running the application by navigating to:
```
https://localhost:7001/swagger
```

### Key API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

#### Trips
- `GET /api/trips` - Get all trips
- `GET /api/trips/{id}` - Get trip details
- `POST /api/trips` - Create new trip
- `PUT /api/trips/{id}` - Update trip
- `DELETE /api/trips/{id}` - Delete trip
- `POST /api/trips/{id}/share` - Generate share link

#### Images
- `POST /api/images/upload` - Upload images
- `GET /api/images` - Get images with filters
- `DELETE /api/images/{id}` - Delete image

#### AI Images
- `POST /api/ai-images` - Generate AI image
- `GET /api/ai-images/quota` - Get AI generation quota

## 🛠 Technologies

### Backend
- **.NET 9 Core**: Modern, high-performance framework
- **Entity Framework Core**: ORM for database operations
- **AutoMapper**: Object-to-object mapping
- **FluentValidation**: Request validation
- **Serilog**: Structured logging
- **JWT Authentication**: Secure API access
- **PostgreSQL**: Robust, reliable database

### Frontend
- **React**: Main application UI
- **Chakra UI**: Component library for consistent design
- **React Context API**: Centralized state management
- **React Router**: Navigation and routing
- **OpenStreetMap**: Interactive mapping
- **AWS S3**: Secure file storage

### AI Integration
- **Hugging Face API**: Access to Stable Diffusion 2 model
- **SixLabors.ImageSharp**: Image processing

## 📅 Development Timeline

The project is developed using Agile methodology with 5 one-week sprints:

1. **Sprint 1**: Setup & User Management (✅ Completed)
2. **Sprint 2**: Media & Trip Management (✅ Completed)
3. **Sprint 3**: Gallery View & Basic Sharing (✅ Completed)
4. **Sprint 4**: Map Integration & AI Image Generation (✅ Completed)
5. **Sprint 5**: Admin Interface & Polishing (✅ Completed)

### Current Status

The project is in its final development phase with the admin dashboard now fully functional:

- **Admin Dashboard**: Complete Angular-based admin interface with PrimeNG
- **System Statistics**: Real-time monitoring of users, trips, and storage
- **User Management**: Full CRUD operations with quota management
- **Analytics**: Interactive charts and user activity tracking
- **System Settings**: Configurable platform settings

All core functionalities have been implemented and tested. The system is ready for deployment and initial user feedback.

## 🖥️ Admin Panel (Angular Dashboard)

The admin dashboard is built with Angular 19 and PrimeNG, providing comprehensive management capabilities:

### Key Features

#### 📊 Dashboard
- Real-time statistics display (users, trips, images)
- Storage usage monitoring with visual progress bars
- Recent user activity feed with action tracking
- System health metrics and alerts

#### 👥 User Management
- Complete user lifecycle management
- Storage and AI quota allocation
- Role-based access control (USER/SYSTEM_ADMIN)
- Advanced search and filtering capabilities
- Bulk operations support

#### 📈 Analytics & Statistics
- Interactive charts for platform metrics
- User growth tracking over time
- Image statistics (regular vs AI-generated)
- Activity logs with exportable reports
- Time-range filtering (3/6/12 months)

#### ⚙️ System Configuration
- Default quota settings
- File upload restrictions
- User registration toggle
- Maintenance mode control
- Platform-wide announcements

### Admin Panel Setup

1. Navigate to the admin dashboard directory:
   ```bash
   cd angular-admin
   npm install
   ng serve
   ```

2. Access the admin panel at `http://localhost:4200`

3. Login with SYSTEM_ADMIN credentials to access all features

### Technologies Used
- Angular 19 - Latest frontend framework
- PrimeNG - Rich UI component library
- Chart.js - Interactive data visualization
- JWT Authentication - Secure admin access
- Responsive design for all devices

## 🖥 Frontend Architecture

### React State Management

The frontend uses React Context API for efficient state management:

1. **AuthContext**: Manages user authentication state, login/logout functionality, and user profile information
2. **TripContext**: Centralizes trip data management including:
   - Fetching and caching trips and their images
   - Creating, updating and deleting trips
   - Managing trip images (upload, delete)
   - Handling share link generation

### Image Viewing Experience

The image gallery has been enhanced with several features:

1. **Optimized Loading**: Lazy loading with placeholder/blur effects for improved performance
2. **Flexible Views**: Toggle between grid and list view modes
3. **Advanced Filtering**: Filter by image type (AI or regular), search by filename, and sort by various criteria
4. **Responsive Design**: Adapts to various screen sizes for optimal viewing experience

### Component Structure

```
src/
├── components/
│   ├── common/
│   │   └── ImagePlaceholder.tsx
│   │
│   └── trips/
│       ├── ImageGallery.tsx
│       ├── ImageFilter.tsx
│       ├── OptimizedImage.tsx
│       ├── ImageUploader.tsx
│       ├── TripMap.tsx
│       └── MapLocationPicker.tsx
│
├── contexts/
│   ├── AuthContext.tsx
│   └── TripContext.tsx
│
├── pages/
│   └── trips/
│       ├── TripDetailPage.tsx
│       ├── TripFormPage.tsx
│       └── TripsPage.tsx
```

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by Batya Z.