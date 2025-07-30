# 🛼 Tampa Blades - Skate Community Platform

A comprehensive web application for the Tampa skate community, featuring event management, skate spot discovery, user profiles, and community features with a modern, responsive design.

## ✨ Features

### 🎯 Core Features
- **Event Management** - Create, manage, and discover skate events with comprehensive details
- **Skate Spot Discovery** - Interactive map with skate spots, reviews, and real-time filtering
- **User Profiles & Authentication** - Secure login, registration, and profile management
- **Community Chat** - Real-time messaging between users
- **Photo Gallery** - Share and discover skate photos with likes and comments
- **Admin Panel** - Comprehensive event and user management for administrators
- **Responsive Design** - Beautiful, modern UI that works on all devices

### 🎨 Enhanced Event System
- **Comprehensive Event Forms** - Start/end times, location, skill levels, photo uploads
- **Event Types** - Competition, Workshop, Meetup, Demo, Tournament, Skate Jam
- **Auto-scroll Forms** - Smooth user experience when adding events
- **Photo Upload** - Upload event images with preview and validation
- **Admin Approval System** - Events require admin approval before going live
- **Event Details** - Contact information, equipment requirements, cost, max participants

### 🗺️ Interactive Maps & Location Services
- **Skate Spot Discovery** - Find skate spots in your area with detailed information
- **Dynamic Filtering** - Filter spots by type, difficulty, and location
- **City Search** - Search for skate spots in Florida cities with autocomplete
- **Real-time Updates** - Spots update based on map bounds and user location
- **Weather Integration** - Real-time weather data for skate spots
- **Google Places Integration** - Enhanced location data and photos

### 👥 Community Features
- **User Authentication** - Secure JWT-based login and registration
- **Profile Management** - Customize your skate profile with photos and details
- **Private Messaging** - Connect with other skaters through direct messages
- **Photo Sharing** - Upload and share skate photos with captions and tags
- **Event Participation** - Join and track events with notifications
- **Community Statistics** - Real-time stats showing active members, events, and content

### 🎭 User Experience Enhancements
- **Contextual Quick Actions** - Different actions based on user login status
- **Smooth Scrolling** - Enhanced navigation with smooth transitions
- **Skeleton Loading** - Beautiful loading animations for better UX
- **Responsive Navigation** - Mobile-friendly navigation with dropdown menus
- **Dark Mode Support** - Modern UI with dark/light theme options
- **Auto-scroll Forms** - Seamless form navigation with smooth scrolling

### 🔧 Admin & Management Features
- **Multi-level Admin System** - User, Admin, and Super Admin roles
- **Content Moderation** - Approve/reject events, skate spots, and photos
- **User Management** - Manage user accounts, roles, and permissions
- **System Statistics** - Comprehensive analytics and reporting
- **File Upload Management** - Secure file handling with size and type validation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tampa-blades.git
   cd tampa-blades
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `config.env` file in the backend directory:
   ```env
   PORT=4000
   JWT_SECRET=your_jwt_secret_here
   GOOGLE_PLACES_API_KEY=your_google_places_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```

5. **Start the backend server**
   ```bash
   cd backend
   node server.js
   ```

6. **Start the frontend development server**
   In a new terminal:
   ```bash
   npm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

### Alternative: Using PowerShell Scripts
- **Windows**: Run `start-app.ps1` or `start-app.bat`
- **Linux/Mac**: Run `./start-app.sh` (make executable first)

## 📁 Project Structure

```
tampa-blades/
├── backend/                 # Node.js/Express backend
│   ├── server.js           # Main server file with all API endpoints
│   ├── package.json        # Backend dependencies
│   ├── uploads/            # File uploads directory
│   ├── config.env          # Environment variables
│   └── db.sqlite           # SQLite database
├── public/                 # Static assets
│   ├── backgrounds/        # Background images
│   ├── events/            # Event-related images
│   ├── gallery/           # Gallery images
│   ├── logos/             # Logo files
│   └── members/           # Member photos
├── src/                    # React frontend source
│   ├── App.tsx            # Main application component
│   ├── App.css            # Global styles and animations
│   ├── index.tsx          # Application entry point
│   └── ...
├── package.json           # Frontend dependencies
├── tsconfig.json          # TypeScript configuration
├── start-app.ps1          # PowerShell startup script
├── start-app.bat          # Windows batch startup script
└── README.md             # This file
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type safety and better development experience
- **React Bootstrap** - Responsive UI components
- **React Router v6** - Client-side routing
- **React Leaflet** - Interactive maps with OpenStreetMap
- **Axios** - HTTP client for API communication
- **Bootstrap Icons** - Icon library
- **CSS3** - Custom animations and responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework with middleware
- **SQLite3** - Lightweight database
- **JWT** - Stateless authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### External APIs
- **Google Places API** - Location search and autocomplete
- **OpenWeatherMap API** - Weather data for skate spots
- **OpenStreetMap** - Free map tiles and geocoding

## 🎯 API Endpoints

### Authentication & Users
- `POST /api/register` - User registration with validation
- `POST /api/login` - User login with JWT token
- `GET /api/me` - Get current user profile
- `GET /api/admin/users` - Get all users (super admin)
- `POST /api/admin/users` - Create new user (super admin)
- `PUT /api/admin/users/:id/role` - Update user role (super admin)

### Events
- `GET /api/events` - Get all approved events
- `POST /api/events` - Create new event with photo upload
- `GET /api/events/pending` - Get pending events (admin)
- `POST /api/events/:id/approve` - Approve event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Skate Spots
- `GET /api/skate-spots` - Get all approved skate spots
- `GET /api/skate-spots/area` - Get spots by map bounds
- `GET /api/skate-spots/:id/enhanced` - Get spot with weather and reviews
- `POST /api/skate-spots` - Add new skate spot
- `POST /api/skate-spots/:id/rate` - Rate a skate spot
- `POST /api/skate-spots/:id/reviews` - Add review to spot
- `GET /api/skate-spots/pending` - Get pending spots (admin)

### Gallery & Photos
- `GET /api/gallery/photos` - Get public photos with pagination
- `POST /api/gallery/photos` - Upload photo with metadata
- `POST /api/gallery/photos/:id/like` - Like/unlike photo
- `POST /api/gallery/photos/:id/comments` - Add comment to photo
- `GET /api/gallery/photos/my` - Get user's photos

### Messaging
- `POST /api/messages` - Send private message
- `GET /api/messages` - Get user's messages
- `GET /api/messages/:userId` - Get conversation with user
- `PUT /api/messages/:messageId/read` - Mark message as read
- `GET /api/messages/unread/count` - Get unread message count

### Location & Weather
- `GET /api/search-location` - Search locations with autocomplete
- `GET /api/autocomplete` - Get location autocomplete predictions
- `GET /api/nearby-places` - Get nearby places
- `GET /api/weather/:lat/:lng` - Get weather for location

### Statistics
- `GET /api/stats` - Get public community statistics
- `GET /api/admin/stats` - Get system statistics (super admin)

## 🔧 Configuration

### Environment Variables
Create a `config.env` file in the backend directory with the following variables:

```env
PORT=4000
JWT_SECRET=your_secure_jwt_secret_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

### Database Setup
The application uses SQLite for simplicity and portability. The database file (`db.sqlite`) will be created automatically when you first run the server. The database includes tables for:

- Users (with role-based access)
- Events (with approval system)
- Skate Spots (with reviews and photos)
- Messages (private messaging)
- Gallery Photos (with likes and comments)
- Reviews and Ratings

### File Upload Configuration
- **Upload Directory**: `backend/uploads/`
- **File Size Limit**: 5MB per file
- **Allowed Types**: Images only (JPEG, PNG, GIF, etc.)
- **Static Serving**: Files served at `/uploads/` endpoint

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-First Approach** - Optimized for all screen sizes
- **Bootstrap Grid System** - Flexible, responsive layouts
- **Touch-Friendly Interface** - Optimized for mobile devices

### Animations & Transitions
- **Smooth Scrolling** - Enhanced navigation experience
- **Loading Animations** - Skeleton loading for better perceived performance
- **Hover Effects** - Interactive elements with smooth transitions
- **Page Transitions** - Smooth navigation between pages

### Accessibility
- **Semantic HTML** - Proper heading structure and landmarks
- **ARIA Labels** - Screen reader support
- **Keyboard Navigation** - Full keyboard accessibility
- **Color Contrast** - WCAG compliant color schemes

## 🚀 Deployment

### Frontend Deployment
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to your hosting service:
   - **Netlify**: Drag and drop the build folder
   - **Vercel**: Connect your GitHub repository
   - **AWS S3**: Upload to S3 bucket with CloudFront

### Backend Deployment
1. Deploy to a Node.js hosting service:
   - **Heroku**: Connect GitHub repository
   - **Railway**: Deploy from GitHub
   - **DigitalOcean App Platform**: Deploy from source
2. Set up environment variables on your hosting platform
3. Configure file upload storage (consider using cloud storage for production)
4. Set up SSL certificates for HTTPS

### Database Considerations
- **Development**: SQLite (included)
- **Production**: Consider PostgreSQL or MySQL for better performance
- **Backup**: Implement regular database backups
- **Migrations**: Use database migration tools for schema changes

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following the coding standards
4. **Test your changes** thoroughly
5. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request** with detailed description

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Test on multiple devices and browsers
- Ensure responsive design works
- Follow accessibility guidelines

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tampa Skate Community** - For inspiration and feedback
- **React Community** - For excellent documentation and tools
- **Bootstrap Team** - For the beautiful UI framework
- **OpenStreetMap Contributors** - For free map data
- **Node.js Community** - For the robust backend ecosystem

## 📞 Support

If you have any questions or need help:

1. **Check the Issues** - Search existing issues for solutions
2. **Create an Issue** - Report bugs or request features
3. **Contact the Team** - Reach out for direct support

### Common Issues
- **Backend not starting**: Ensure you're in the `backend` directory and have all dependencies installed
- **API errors**: Check that environment variables are properly set
- **File upload issues**: Verify the uploads directory exists and has proper permissions
- **Database errors**: Ensure SQLite is properly installed and the database file is writable

---

**Built with ❤️ for the Tampa skate community**

*Empowering skaters to connect, discover, and share their passion for skating.* 