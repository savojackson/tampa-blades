# 🛼 Tampa Blades - Skate Community Platform

A comprehensive web application for the Tampa skate community, featuring event management, skate spot discovery, user profiles, and community features.

## ✨ Features

### 🎯 Core Features

- **Event Management** - Create, manage, and discover skate events
- **Skate Spot Discovery** - Interactive map with skate spots and reviews
- **User Profiles** - Connect with fellow skaters
- **Community Chat** - Real-time messaging between users
- **Photo Gallery** - Share and discover skate photos
- **Admin Panel** - Event and user management for administrators

### 🎨 Enhanced Event System

- **Comprehensive Event Forms** - Start/end times, location, skill levels, photo uploads
- **Event Types** - Competition, Workshop, Meetup, Demo, Tournament, Skate Jam
- **Auto-scroll Forms** - Smooth user experience when adding events
- **Photo Upload** - Upload event images with preview
- **Admin Approval** - Events require admin approval before going live

### 🗺️ Interactive Maps

- **Skate Spot Discovery** - Find skate spots in your area
- **Dynamic Filtering** - Filter spots by type, difficulty, and location
- **City Search** - Search for skate spots in Florida cities
- **Real-time Updates** - Spots update based on map bounds

### 👥 Community Features

- **User Authentication** - Secure login and registration
- **Profile Management** - Customize your skate profile
- **Private Messaging** - Connect with other skaters
- **Photo Sharing** - Upload and share skate photos
- **Event Participation** - Join and track events

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js) or yarn
- Git - [Download here](https://git-scm.com/)

### 📥 Installation

#### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/tampa-blades.git
cd tampa-blades

# Run automated setup
npm run setup
```

#### Option 2: Manual Setup

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

### 🔧 Environment Setup

1. **Backend Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development
   
   # JWT Secret (Change this in production!)
   JWT_SECRET=your_secure_jwt_secret_change_this_in_production
   
   # Database (leave empty for SQLite in development)
   DATABASE_URL=
   
   # API Keys
   GOOGLE_PLACES_API_KEY=your_google_places_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000
   ```

2. **Frontend Environment Variables (Optional)**
   
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:4000
   REACT_APP_ENVIRONMENT=development
   REACT_APP_SITE_NAME=Tampa Blades
   REACT_APP_SITE_DESCRIPTION=Skate Community Platform
   ```

### 🗄️ Database Setup

The application supports both SQLite (development) and PostgreSQL (production).

#### Development (SQLite)
```bash
cd backend
npm run migrate
```

#### Production (PostgreSQL)
1. Set up a PostgreSQL database (Vercel Postgres, Supabase, etc.)
2. Add `DATABASE_URL` to your environment variables
3. Run migrations:
   ```bash
   cd backend
   NODE_ENV=production npm run migrate
   ```

### 🎯 API Keys Setup

#### Required API Keys

1. **Google Places API Key** - [Get it here](https://developers.google.com/maps/documentation/places/web-service/get-api-key)
   - Enable Places API
   - Enable Geocoding API
   - Enable Places Autocomplete

2. **OpenWeatherMap API Key** - [Get it here](https://openweathermap.org/api)
   - Free tier available
   - Used for weather data at skate spots

### 🏃‍♂️ Running the Application

#### Development Mode

**Windows:**
```cmd
npm run dev:windows
```

**macOS/Linux:**
```bash
npm run dev:macos
```

**Alternative (Manual):**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
npm start
```

#### Production Build

```bash
npm run build
cd backend
npm start
```

## 🔐 User Login & Access

### 🚀 First Time Setup

After running the application for the first time, the database will be automatically populated with default accounts for testing.

### 👤 Default Login Accounts

#### Super Admin Account
- **Username:** `admin`
- **Password:** `password`
- **Email:** `admin@tampablades.com`
- **Access:** Full admin panel, user management, event/spot approval

#### Regular User Account  
- **Username:** `skater1`
- **Password:** `password`
- **Email:** `skater1@example.com`
- **Access:** Standard user features, create events/spots (requires approval)

### 🌐 Accessing the Application

1. **Start the application** (see [Running the Application](#-running-the-application))
2. **Open your browser** and go to: `http://localhost:3000`
3. **Click "Login"** in the top navigation
4. **Enter credentials** from the default accounts above

### 🔑 User Roles & Permissions

| Feature | User | Admin | Super Admin |
|---------|------|-------|-------------|
| Browse events/spots | ✅ | ✅ | ✅ |
| Create events/spots | ✅ (needs approval) | ✅ (auto-approved) | ✅ (auto-approved) |
| Upload photos | ✅ | ✅ | ✅ |
| Approve events/spots | ❌ | ✅ | ✅ |
| User management | ❌ | ❌ | ✅ |
| System administration | ❌ | ❌ | ✅ |

### 📝 Creating New Accounts

#### For Regular Users:
1. Click **"Register"** on the login page
2. Fill in your details (username, email, password)  
3. Start exploring the skate community!

#### For Admins (Super Admin Only):
1. Login as super admin
2. Navigate to **Admin Panel** → **User Management**
3. Create new admin accounts with appropriate roles

### 🔒 Security Notes

- **Change default passwords** in production!
- **Admin accounts** should use strong, unique passwords
- **JWT tokens** expire after 7 days for security
- **Email verification** can be enabled for production use

### 🎯 Quick Start for New Users

1. **Register** a new account or use `skater1` / `password`
2. **Explore** the map to find local skate spots
3. **Join events** or create your own (admin approval required)
4. **Upload photos** to share with the community
5. **Connect** with other skaters in your area

### 🛠️ Troubleshooting Login Issues

**Can't login?**
- Check that backend is running on port 4000
- Verify database was set up: `cd backend && npm run migrate`
- Clear browser cache/localStorage
- Check browser console for error messages

**Forgot admin password?**
- Reset database: `npm run db:reset`
- This will restore default accounts

**Check database status:**
- View all data: `npm run db:check`
- Quick stats: `npm run db:stats`
- List users: `npm run db:users`

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set Environment Variables in Vercel:**
   - `REACT_APP_API_URL` = Your backend API URL
   - `REACT_APP_ENVIRONMENT` = production

### Backend Deployment Options

#### Option 1: Vercel (Serverless)
```bash
cd backend
vercel
```

#### Option 2: Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

#### Option 3: Render
1. Connect your GitHub repository
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`

### Database for Production

#### Recommended: Vercel Postgres
```bash
# Add to your Vercel project
vercel postgres create
```

#### Alternative: Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your connection string
3. Add to `DATABASE_URL` environment variable

## 📁 Project Structure

```
tampa-blades/
├── backend/                 # Node.js/Express backend
│   ├── database/           # Database abstraction and migrations
│   │   ├── connection.js   # Database connection handler
│   │   ├── migrate.js      # Migration script
│   │   └── schema.sql      # Database schema
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── .env                # Backend environment variables
│   └── uploads/            # File uploads directory
├── api/                    # Vercel serverless functions
├── public/                 # Static assets
├── src/                    # React frontend source
│   ├── App.tsx            # Main application component
│   ├── config/            # Configuration files
│   └── components/        # React components
├── package.json           # Frontend dependencies
├── vercel.json           # Vercel deployment config
└── README.md             # This file
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework with latest features
- **TypeScript** - Type safety and better development experience
- **React Bootstrap** - UI components and responsive design
- **React Router** - Client-side routing
- **React Leaflet** - Interactive maps
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **SQLite/PostgreSQL** - Database (SQLite for dev, PostgreSQL for prod)
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### External APIs
- **Google Places API** - Location data and autocomplete
- **OpenWeatherMap API** - Weather data for skate spots

## 🎯 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/me` - Get current user info

### Events
- `GET /api/events` - Get all approved events
- `POST /api/events` - Create new event
- `GET /api/events/pending` - Get pending events (admin)
- `POST /api/events/:id/approve` - Approve event (admin)

### Skate Spots
- `GET /api/skate-spots` - Get all approved skate spots
- `GET /api/skate-spots/area` - Get spots by geographic area
- `POST /api/skate-spots` - Submit new skate spot

### Gallery
- `GET /api/gallery/photos` - Get public photos
- `POST /api/gallery/photos` - Upload photo
- `POST /api/gallery/photos/:id/like` - Like photo

### Admin
- `GET /api/admin/users` - Get all users (super admin)
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/logs` - Get admin action logs

## 🔧 Development Scripts

### Frontend Scripts
```bash
npm start              # Start development server
npm run build         # Build for production
npm test              # Run tests
npm run setup         # Install all dependencies
```

### Backend Scripts
```bash
cd backend
npm start             # Start production server
npm run dev           # Start with nodemon (auto-restart)
npm run migrate       # Run database migrations
npm run setup         # Run database setup with sample data
```

### 🗄️ Database Scripts (Run from project root)
```bash
# Comprehensive database check
npm run db:check       # Full database overview with tables and stats

# Quick database queries
npm run db:users       # List all users
npm run db:spots       # List skate spots (first 10)
npm run db:events      # List events (first 10)
npm run db:stats       # Quick count of all tables

# Database management
npm run db:migrate     # Run database migrations
npm run db:reset       # Reset database (delete and recreate)
```

### 🚀 Development Commands
```bash
# Start full application
npm run dev            # Both frontend and backend (cross-platform)
npm run dev:windows    # Optimized for Windows
npm run dev:macos      # Optimized for macOS/Linux

# Backend only
npm run backend        # Start backend server only
npm run server         # Alternative backend start command
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for type safety
- Follow existing code style and formatting
- Write descriptive commit messages
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 4000 (backend)
   lsof -ti:4000 | xargs kill -9
   
   # Kill process on port 3000 (frontend)
   lsof -ti:3000 | xargs kill -9
   ```

2. **Database connection errors**
   ```bash
   # Reset SQLite database
   cd backend
   rm db.sqlite
   npm run migrate
   ```

3. **API key errors**
   - Check that API keys are correctly set in `.env`
   - Verify API key restrictions and billing status
   - Check browser console for specific error messages

4. **Build errors**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Clear backend dependencies
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```

### Environment-Specific Issues

**Windows:**
- Use `npm run dev:windows` instead of `npm run dev`
- Ensure Windows Subsystem for Linux (WSL) is up to date
- Use PowerShell or Command Prompt as administrator if needed

**macOS:**
- Install Xcode Command Line Tools: `xcode-select --install`
- Use `npm run dev:macos` for optimal experience
- Ensure Homebrew is up to date if using it for Node.js

## 📊 Performance Optimizations

- **Code Splitting** - Lazy loading of route components
- **Image Optimization** - Responsive images and lazy loading
- **Caching** - Browser caching for static assets
- **Database Indexing** - Optimized queries for better performance
- **API Rate Limiting** - Prevents abuse and ensures stability

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Input Validation** - Server-side validation for all inputs
- **CORS Configuration** - Controlled cross-origin requests
- **File Upload Security** - Type checking and size limits
- **SQL Injection Prevention** - Parameterized queries

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Tampa skate community for inspiration and testing
- React and Node.js communities for excellent documentation
- Bootstrap for the beautiful UI components
- Google Maps and OpenWeatherMap for API services

## 📞 Support

If you need help or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/yourusername/tampa-blades/issues)
3. Create a new issue with detailed information
4. Contact the development team

---

**Built with ❤️ for the Tampa skate community**

*Happy skating! 🛹*