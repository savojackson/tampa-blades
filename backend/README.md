# Backend Setup Guide

## 🚀 Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Keys:**
   - Edit `config.env` file
   - Add your API keys:
     ```
     GOOGLE_PLACES_API_KEY=your_google_places_api_key
     OPENWEATHER_API_KEY=your_openweather_api_key
     JWT_SECRET=your_jwt_secret
     ```

3. **Start the Server:**
   ```bash
   node server.js
   ```

## 🔑 API Keys Required

### Google Places API
- **Status**: ✅ Configured
- **Key**: `AIzaSyAJYlTR7zKAKLLIY_hY-ZI3trwZHp7CJhA`
- **Features**: Business information, ratings, photos

### OpenWeatherMap API
- **Status**: ⚠️ Needs configuration
- **Get Key**: [OpenWeatherMap](https://openweathermap.org/api)
- **Features**: Weather data for skating conditions

## 📁 File Structure

```
backend/
├── server.js          # Main server file
├── config.env         # Environment variables (API keys)
├── package.json       # Dependencies
├── .gitignore         # Git ignore rules
└── db.sqlite          # Database (auto-created)
```

## 🔒 Security Notes

- Never commit `config.env` to version control
- Change `JWT_SECRET` in production
- Restrict API keys to your domain
- Monitor API usage to avoid charges

## 🌐 API Endpoints

- **Auth**: `/api/login`, `/api/register`
- **Events**: `/api/events`
- **Map**: `/api/skate-spots`
- **Gallery**: `/api/gallery/photos`
- **Admin**: `/api/admin/*` (super admin only)

## 🛠️ Troubleshooting

1. **Port already in use**: Change PORT in config.env
2. **API key errors**: Check key restrictions and billing
3. **Database errors**: Delete db.sqlite to reset 