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
- Node.js (v14 or higher)
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
   Create a `.env` file in the backend directory:
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

## 📁 Project Structure

```
tampa-blades/
├── backend/                 # Node.js/Express backend
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── uploads/            # File uploads directory
│   └── db.sqlite           # SQLite database
├── public/                 # Static assets
├── src/                    # React frontend source
│   ├── App.tsx            # Main application component
│   ├── components/        # React components
│   └── ...
├── package.json           # Frontend dependencies
└── README.md             # This file
```

## 🛠️ Technology Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **React Bootstrap** - UI components
- **React Router** - Navigation
- **React Leaflet** - Interactive maps
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **SQLite3** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## 🎯 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/me` - Get current user

### Events
- `GET /api/events` - Get all approved events
- `POST /api/events` - Create new event
- `GET /api/events/pending` - Get pending events (admin)
- `POST /api/events/:id/approve` - Approve event (admin)

### Skate Spots
- `GET /api/skate-spots` - Get all skate spots
- `GET /api/skate-spots/area` - Get spots by area
- `POST /api/skate-spots` - Add new skate spot

### Gallery
- `GET /api/gallery/photos` - Get public photos
- `POST /api/gallery/photos` - Upload photo
- `POST /api/gallery/photos/:id/like` - Like photo

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
PORT=4000
JWT_SECRET=your_secure_jwt_secret
GOOGLE_PLACES_API_KEY=your_google_places_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

### Database Setup
The application uses SQLite for simplicity. The database file (`db.sqlite`) will be created automatically when you first run the server.

## 🚀 Deployment

### Frontend Deployment
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to your hosting service (Netlify, Vercel, etc.)

### Backend Deployment
1. Deploy to a Node.js hosting service (Heroku, Railway, etc.)
2. Set up environment variables on your hosting platform
3. Ensure the uploads directory is properly configured for file storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Tampa skate community for inspiration
- React and Node.js communities for excellent documentation
- Bootstrap for the beautiful UI components

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for the Tampa skate community** 