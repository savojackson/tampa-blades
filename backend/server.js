// Load environment variables
require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env",
});

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Use built-in fetch for Node.js 18+ or fallback to node-fetch
let fetch;
try {
  fetch = globalThis.fetch;
} catch {
  fetch = require("node-fetch");
}

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Change this in production

// API Keys (in production, use environment variables)
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Validate required environment variables
if (!GOOGLE_PLACES_API_KEY) {
  console.warn(
    "⚠️  GOOGLE_PLACES_API_KEY not set - Google Places features will be limited"
  );
}
if (!OPENWEATHER_API_KEY) {
  console.warn(
    "⚠️  OPENWEATHER_API_KEY not set - Weather features will be disabled"
  );
}

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// SQLite setup
const db = new sqlite3.Database("./db.sqlite", (err) => {
  if (err) return console.error("DB open error:", err);
  console.log("Connected to SQLite database.");
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    verified INTEGER DEFAULT 1
  )`);
});

// Events table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    date TEXT,
    startTime TEXT,
    endTime TEXT,
    location TEXT,
    eventType TEXT,
    skillLevel TEXT,
    maxParticipants INTEGER,
    contactEmail TEXT,
    contactPhone TEXT,
    cost TEXT,
    equipment TEXT,
    eventPhoto TEXT,
    approved INTEGER DEFAULT 0,
    submittedBy TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Messages table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId INTEGER,
    receiverId INTEGER,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    read INTEGER DEFAULT 0,
    FOREIGN KEY (senderId) REFERENCES users (id),
    FOREIGN KEY (receiverId) REFERENCES users (id)
  )`);
});

// Skate spots table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS skate_spots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    description TEXT,
    features TEXT,
    hours TEXT,
    rating REAL DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    crowd_level TEXT DEFAULT 'medium',
    photos TEXT,
    submitted_by INTEGER,
    approved INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    google_places_id TEXT,
    weather_data TEXT,
    amenities TEXT,
    surface_type TEXT,
    FOREIGN KEY (submitted_by) REFERENCES users (id)
  )`);
});

// Reviews table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS spot_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spot_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    photos TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (spot_id) REFERENCES skate_spots (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

// Social media photos table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS spot_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spot_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    photo_url TEXT NOT NULL,
    caption TEXT,
    source TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (spot_id) REFERENCES skate_spots (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

// Gallery photos table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS gallery_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    photo_url TEXT NOT NULL,
    caption TEXT,
    category TEXT DEFAULT 'general',
    tags TEXT,
    location TEXT,
    is_public INTEGER DEFAULT 1,
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

// Photo likes table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS photo_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    photo_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (photo_id) REFERENCES gallery_photos (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(photo_id, user_id)
  )`);
});

// Photo comments table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS photo_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    photo_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (photo_id) REFERENCES gallery_photos (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

// Helper: create JWT
function createToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

// Helper: Get Google Places data
async function getGooglePlacesData(lat, lng, spotName) {
  try {
    // Search for nearby places
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1000&keyword=${encodeURIComponent(
      spotName
    )}&key=${GOOGLE_PLACES_API_KEY}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.results && searchData.results.length > 0) {
      const placeId = searchData.results[0].place_id;

      // Get detailed place information
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,opening_hours,photos,formatted_address,formatted_phone_number,website&key=${GOOGLE_PLACES_API_KEY}`;
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();

      return {
        placeId: placeId,
        googleRating: detailsData.result?.rating || 0,
        googleReviews: detailsData.result?.user_ratings_total || 0,
        openingHours: detailsData.result?.opening_hours?.weekday_text || [],
        photos:
          detailsData.result?.photos
            ?.slice(0, 5)
            .map(
              (photo) =>
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
            ) || [],
        address: detailsData.result?.formatted_address || "",
        phone: detailsData.result?.formatted_phone_number || "",
        website: detailsData.result?.website || "",
      };
    }
    return null;
  } catch (error) {
    console.error("Google Places API error:", error);
    return null;
  }
}

// Helper: Get weather data
async function getWeatherData(lat, lng) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    return {
      temperature: data.main?.temp || 0,
      feelsLike: data.main?.feels_like || 0,
      humidity: data.main?.humidity || 0,
      windSpeed: data.wind?.speed || 0,
      description: data.weather?.[0]?.description || "",
      icon: data.weather?.[0]?.icon || "",
      isSkateable: isGoodSkatingWeather(data),
    };
  } catch (error) {
    console.error("Weather API error:", error);
    return null;
  }
}

// Helper: Check if weather is good for skating
function isGoodSkatingWeather(weatherData) {
  const temp = weatherData.main?.temp || 0;
  const windSpeed = weatherData.wind?.speed || 0;
  const weatherMain = weatherData.weather?.[0]?.main || "";

  // Good skating conditions: 10-30°C, wind < 20 km/h, no rain/snow
  return (
    temp >= 10 &&
    temp <= 30 &&
    windSpeed < 5.5 &&
    !["Rain", "Snow", "Thunderstorm"].includes(weatherMain)
  );
}

// Register
app.post("/api/register", (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email)
    return res.status(400).json({ error: "All fields required" });
  db.get(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email],
    (err, row) => {
      if (row)
        return res
          .status(400)
          .json({ error: "Username or email already exists" });
      if (!/^\S+@\S+\.\S+$/.test(email))
        return res.status(400).json({ error: "Invalid email format" });
      const hash = bcrypt.hashSync(password, 10);
      db.run(
        "INSERT INTO users (username, email, password, role, verified) VALUES (?, ?, ?, ?, ?)",
        [username, email, hash, "user", 1],
        function (err) {
          if (err)
            return res.status(500).json({ error: "Registration failed" });
          db.get(
            "SELECT * FROM users WHERE id = ?",
            [this.lastID],
            (err, user) => {
              const token = createToken(user);
              res.json({
                token,
                user: {
                  id: user.id,
                  username: user.username,
                  email: user.email,
                  role: user.role,
                },
              });
            }
          );
        }
      );
    }
  );
});

// Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    if (!bcrypt.compareSync(password, user.password))
      return res.status(400).json({ error: "Invalid credentials" });
    const token = createToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  });
});

// Auth middleware
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  const token = auth.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Get current user
app.get("/api/me", requireAuth, (req, res) => {
  db.get(
    "SELECT id, username, email, role FROM users WHERE id = ?",
    [req.user.id],
    (err, user) => {
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json({ user });
    }
  );
});

// Submit event (pending approval)
app.post(
  "/api/events",
  requireAuth,
  upload.single("eventPhoto"),
  (req, res) => {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      eventType,
      skillLevel,
      maxParticipants,
      contactEmail,
      contactPhone,
      cost,
      equipment,
    } = req.body;

    if (
      !title ||
      !description ||
      !date ||
      !startTime ||
      !endTime ||
      !location ||
      !eventType ||
      !contactEmail
    ) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    let eventPhotoPath = null;
    if (req.file) {
      eventPhotoPath = `/uploads/${req.file.filename}`;
    }

    const query = `
    INSERT INTO events (
      title, description, date, startTime, endTime, location, eventType, 
      skillLevel, maxParticipants, contactEmail, contactPhone, cost, 
      equipment, eventPhoto, approved, submittedBy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
  `;

    const params = [
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      eventType,
      skillLevel || null,
      maxParticipants || null,
      contactEmail,
      contactPhone || null,
      cost || "Free",
      equipment || null,
      eventPhotoPath,
      req.user.username,
    ];

    db.run(query, params, function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to submit event" });
      }

      res.json({
        id: this.lastID,
        title,
        description,
        date,
        startTime,
        endTime,
        location,
        eventType,
        skillLevel,
        maxParticipants,
        contactEmail,
        contactPhone,
        cost,
        equipment,
        eventPhoto: eventPhotoPath,
        approved: 0,
        submittedBy: req.user.username,
      });
    });
  }
);

// List approved events (public)
app.get("/api/events", (req, res) => {
  db.all(
    "SELECT * FROM events WHERE approved = 1 ORDER BY date ASC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Failed to fetch events" });
      res.json({ events: rows });
    }
  );
});

// List pending events (admin only)
app.get("/api/events/pending", requireAuth, (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Admin only" });
  db.all(
    "SELECT * FROM events WHERE approved = 0 ORDER BY date ASC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Failed to fetch events" });
      res.json({ events: rows });
    }
  );
});

// Approve event (admin only)
app.post("/api/events/:id/approve", requireAuth, (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Admin only" });
  db.run(
    "UPDATE events SET approved = 1 WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err)
        return res.status(500).json({ error: "Failed to approve event" });
      res.json({ success: true });
    }
  );
});

// Reject/delete event (admin only)
app.delete("/api/events/:id", requireAuth, (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Admin only" });
  db.run("DELETE FROM events WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: "Failed to delete event" });
    res.json({ success: true });
  });
});

// Send private message
app.post("/api/messages", requireAuth, (req, res) => {
  const { receiverId, message } = req.body;
  if (!receiverId || !message)
    return res.status(400).json({ error: "Receiver ID and message required" });

  // Check if receiver exists
  db.get("SELECT id FROM users WHERE id = ?", [receiverId], (err, receiver) => {
    if (!receiver) return res.status(404).json({ error: "Receiver not found" });

    db.run(
      "INSERT INTO messages (senderId, receiverId, message) VALUES (?, ?, ?)",
      [req.user.id, receiverId, message],
      function (err) {
        if (err)
          return res.status(500).json({ error: "Failed to send message" });
        res.json({
          success: true,
          messageId: this.lastID,
          timestamp: new Date().toISOString(),
        });
      }
    );
  });
});

// Get user's messages (sent and received)
app.get("/api/messages", requireAuth, (req, res) => {
  const query = `
    SELECT 
      m.*,
      sender.username as senderName,
      receiver.username as receiverName
    FROM messages m
    JOIN users sender ON m.senderId = sender.id
    JOIN users receiver ON m.receiverId = receiver.id
    WHERE m.senderId = ? OR m.receiverId = ?
    ORDER BY m.timestamp DESC
  `;

  db.all(query, [req.user.id, req.user.id], (err, messages) => {
    if (err) return res.status(500).json({ error: "Failed to fetch messages" });
    res.json({ messages });
  });
});

// Get conversation with specific user
app.get("/api/messages/:userId", requireAuth, (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT 
      m.*,
      sender.username as senderName,
      receiver.username as receiverName
    FROM messages m
    JOIN users sender ON m.senderId = sender.id
    JOIN users receiver ON m.receiverId = receiver.id
    WHERE (m.senderId = ? AND m.receiverId = ?) OR (m.senderId = ? AND m.receiverId = ?)
    ORDER BY m.timestamp ASC
  `;

  db.all(query, [req.user.id, userId, userId, req.user.id], (err, messages) => {
    if (err)
      return res.status(500).json({ error: "Failed to fetch conversation" });
    res.json({ messages });
  });
});

// Mark message as read
app.put("/api/messages/:messageId/read", requireAuth, (req, res) => {
  const { messageId } = req.params;
  db.run(
    "UPDATE messages SET read = 1 WHERE id = ? AND receiverId = ?",
    [messageId, req.user.id],
    function (err) {
      if (err)
        return res
          .status(500)
          .json({ error: "Failed to mark message as read" });
      res.json({ success: true });
    }
  );
});

// Get unread message count
app.get("/api/messages/unread/count", requireAuth, (req, res) => {
  db.get(
    "SELECT COUNT(*) as count FROM messages WHERE receiverId = ? AND read = 0",
    [req.user.id],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Failed to get unread count" });
      res.json({ unreadCount: result.count });
    }
  );
});

// Skate Spots API Endpoints

// Get all approved skate spots
app.get("/api/skate-spots", (req, res) => {
  db.all(
    "SELECT * FROM skate_spots WHERE approved = 1 ORDER BY rating DESC",
    [],
    (err, spots) => {
      if (err)
        return res.status(500).json({ error: "Failed to fetch skate spots" });
      res.json({ spots });
    }
  );
});

// Get skate spots by area/bounds
app.get("/api/skate-spots/area", async (req, res) => {
  const { north, south, east, west } = req.query;

  if (!north || !south || !east || !west) {
    return res
      .status(400)
      .json({ error: "Map bounds required (north, south, east, west)" });
  }

  try {
    // First, get spots from our database in the area
    const dbQuery = `
      SELECT * FROM skate_spots 
      WHERE approved = 1 
      AND latitude BETWEEN ? AND ? 
      AND longitude BETWEEN ? AND ?
      ORDER BY rating DESC
    `;

    db.all(dbQuery, [south, north, west, east], async (err, dbSpots) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Failed to fetch database spots" });

      // For now, just return database spots to debug the frontend
      // We'll add Google Places API later once we confirm the basic functionality works
      res.json({ spots: dbSpots });
    });
  } catch (error) {
    console.error("Area search error:", error);
    res.status(500).json({ error: "Failed to search area" });
  }
});

// Get skate spots by type
app.get("/api/skate-spots/:type", (req, res) => {
  const { type } = req.params;
  db.all(
    "SELECT * FROM skate_spots WHERE type = ? AND approved = 1 ORDER BY rating DESC",
    [type],
    (err, spots) => {
      if (err)
        return res.status(500).json({ error: "Failed to fetch skate spots" });
      res.json({ spots });
    }
  );
});

// Submit new skate spot (pending approval)
app.post("/api/skate-spots", requireAuth, (req, res) => {
  const {
    name,
    type,
    difficulty,
    latitude,
    longitude,
    description,
    features,
    hours,
  } = req.body;

  if (!name || !type || !difficulty || !latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Name, type, difficulty, and coordinates are required" });
  }

  const featuresStr = features ? JSON.stringify(features) : null;

  db.run(
    `INSERT INTO skate_spots (name, type, difficulty, latitude, longitude, description, features, hours, submitted_by) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      type,
      difficulty,
      latitude,
      longitude,
      description,
      featuresStr,
      hours,
      req.user.id,
    ],
    function (err) {
      if (err)
        return res.status(500).json({ error: "Failed to submit skate spot" });
      res.json({
        success: true,
        id: this.lastID,
        message: "Skate spot submitted for approval",
      });
    }
  );
});

// Rate a skate spot
app.post("/api/skate-spots/:id/rate", requireAuth, (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  // Get current spot data
  db.get(
    "SELECT rating, reviews FROM skate_spots WHERE id = ?",
    [id],
    (err, spot) => {
      if (err)
        return res.status(500).json({ error: "Failed to get skate spot" });
      if (!spot) return res.status(404).json({ error: "Skate spot not found" });

      // Calculate new average rating
      const newReviews = spot.reviews + 1;
      const newRating = (spot.rating * spot.reviews + rating) / newReviews;

      db.run(
        "UPDATE skate_spots SET rating = ?, reviews = ? WHERE id = ?",
        [newRating, newReviews, id],
        function (err) {
          if (err)
            return res.status(500).json({ error: "Failed to update rating" });
          res.json({ success: true, newRating, newReviews });
        }
      );
    }
  );
});

// Get pending skate spots (admin only)
app.get("/api/skate-spots/pending", requireAuth, (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Admin only" });

  db.all(
    "SELECT * FROM skate_spots WHERE approved = 0 ORDER BY created_at DESC",
    [],
    (err, spots) => {
      if (err)
        return res.status(500).json({ error: "Failed to fetch pending spots" });
      res.json({ spots });
    }
  );
});

// Approve skate spot (admin only)
app.post("/api/skate-spots/:id/approve", requireAuth, (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Admin only" });

  db.run(
    "UPDATE skate_spots SET approved = 1 WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err)
        return res.status(500).json({ error: "Failed to approve skate spot" });
      res.json({ success: true });
    }
  );
});

// Reject/delete skate spot (admin only)
app.delete("/api/skate-spots/:id", requireAuth, (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Admin only" });

  db.run(
    "DELETE FROM skate_spots WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err)
        return res.status(500).json({ error: "Failed to delete skate spot" });
      res.json({ success: true });
    }
  );
});

// Enhanced Skate Spots API Endpoints

// Get enhanced spot data with weather and Google Places info
app.get("/api/skate-spots/:id/enhanced", async (req, res) => {
  const { id } = req.params;

  try {
    db.get(
      "SELECT * FROM skate_spots WHERE id = ?",
      [id],
      async (err, spot) => {
        if (err) return res.status(500).json({ error: "Failed to fetch spot" });
        if (!spot) return res.status(404).json({ error: "Spot not found" });

        // Get weather data
        const weather = await getWeatherData(spot.latitude, spot.longitude);

        // Get Google Places data
        const googleData = await getGooglePlacesData(
          spot.latitude,
          spot.longitude,
          spot.name
        );

        // Get reviews
        db.all(
          "SELECT r.*, u.username FROM spot_reviews r JOIN users u ON r.user_id = u.id WHERE r.spot_id = ? ORDER BY r.created_at DESC",
          [id],
          (err, reviews) => {
            if (err)
              return res.status(500).json({ error: "Failed to fetch reviews" });

            // Get photos
            db.all(
              "SELECT * FROM spot_photos WHERE spot_id = ? ORDER BY created_at DESC",
              [id],
              (err, photos) => {
                if (err)
                  return res
                    .status(500)
                    .json({ error: "Failed to fetch photos" });

                res.json({
                  spot: {
                    ...spot,
                    weather,
                    googleData,
                    reviews: reviews || [],
                    photos: photos || [],
                  },
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error("Enhanced spot fetch error:", error);
    res.status(500).json({ error: "Failed to fetch enhanced spot data" });
  }
});

// Add review to skate spot
app.post("/api/skate-spots/:id/reviews", requireAuth, (req, res) => {
  const { id } = req.params;
  const { rating, comment, photos } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  const photosStr = photos ? JSON.stringify(photos) : null;

  db.run(
    "INSERT INTO spot_reviews (spot_id, user_id, rating, comment, photos) VALUES (?, ?, ?, ?, ?)",
    [id, req.user.id, rating, comment, photosStr],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to add review" });

      // Update spot's average rating
      db.get(
        "SELECT AVG(rating) as avgRating, COUNT(*) as reviewCount FROM spot_reviews WHERE spot_id = ?",
        [id],
        (err, result) => {
          if (!err && result) {
            db.run(
              "UPDATE skate_spots SET rating = ?, reviews = ? WHERE id = ?",
              [result.avgRating, result.reviewCount, id]
            );
          }
        }
      );

      res.json({
        success: true,
        reviewId: this.lastID,
        message: "Review added successfully",
      });
    }
  );
});

// Get reviews for skate spot
app.get("/api/skate-spots/:id/reviews", (req, res) => {
  const { id } = req.params;

  db.all(
    "SELECT r.*, u.username FROM spot_reviews r JOIN users u ON r.user_id = u.id WHERE r.spot_id = ? ORDER BY r.created_at DESC",
    [id],
    (err, reviews) => {
      if (err)
        return res.status(500).json({ error: "Failed to fetch reviews" });
      res.json({ reviews: reviews || [] });
    }
  );
});

// Add photo to skate spot
app.post("/api/skate-spots/:id/photos", requireAuth, (req, res) => {
  const { id } = req.params;
  const { photoUrl, caption, source = "user" } = req.body;

  if (!photoUrl) {
    return res.status(400).json({ error: "Photo URL is required" });
  }

  db.run(
    "INSERT INTO spot_photos (spot_id, user_id, photo_url, caption, source) VALUES (?, ?, ?, ?, ?)",
    [id, req.user.id, photoUrl, caption, source],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to add photo" });

      res.json({
        success: true,
        photoId: this.lastID,
        message: "Photo added successfully",
      });
    }
  );
});

// Get photos for skate spot
app.get("/api/skate-spots/:id/photos", (req, res) => {
  const { id } = req.params;

  db.all(
    "SELECT * FROM spot_photos WHERE spot_id = ? ORDER BY created_at DESC",
    [id],
    (err, photos) => {
      if (err) return res.status(500).json({ error: "Failed to fetch photos" });
      res.json({ photos: photos || [] });
    }
  );
});

// Get weather for location
app.get("/api/weather/:lat/:lng", async (req, res) => {
  const { lat, lng } = req.params;

  try {
    const weather = await getWeatherData(parseFloat(lat), parseFloat(lng));
    res.json({ weather });
  } catch (error) {
    console.error("Weather fetch error:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Search location using Google Places Autocomplete API
app.get("/api/search-location", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    // First, get autocomplete predictions
    const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query
    )}&types=geocode&key=${GOOGLE_PLACES_API_KEY}`;
    const autocompleteResponse = await fetch(autocompleteUrl);
    const autocompleteData = await autocompleteResponse.json();

    if (
      autocompleteData.status === "OK" &&
      autocompleteData.predictions.length > 0
    ) {
      // Get the first prediction's details
      const placeId = autocompleteData.predictions[0].place_id;
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address,name&key=${GOOGLE_PLACES_API_KEY}`;
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();

      if (detailsData.status === "OK" && detailsData.result) {
        const location = detailsData.result.geometry.location;

        res.json({
          success: true,
          location: {
            lat: location.lat,
            lng: location.lng,
            formatted_address: detailsData.result.formatted_address,
            place_id: placeId,
            name: detailsData.result.name,
          },
          predictions: autocompleteData.predictions.slice(0, 5), // Return top 5 predictions
        });
      } else {
        res.status(404).json({
          error: "Location details not found",
          status: detailsData.status,
          message:
            detailsData.error_message || "Could not get location details",
        });
      }
    } else {
      res.status(404).json({
        error: "Location not found",
        status: autocompleteData.status,
        message:
          autocompleteData.error_message ||
          "No predictions found for this search",
      });
    }
  } catch (error) {
    console.error("Places Autocomplete error:", error);
    res.status(500).json({ error: "Failed to search location" });
  }
});

// Get autocomplete predictions only
app.get("/api/autocomplete", async (req, res) => {
  const { input } = req.query;

  if (!input || input.length < 2) {
    return res
      .status(400)
      .json({ error: "Input must be at least 2 characters" });
  }

  try {
    const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&types=geocode&key=${GOOGLE_PLACES_API_KEY}`;
    const response = await fetch(autocompleteUrl);
    const data = await response.json();

    if (data.status === "OK") {
      res.json({
        success: true,
        predictions: data.predictions.slice(0, 5), // Return top 5 predictions
      });
    } else {
      res.status(400).json({
        error: "Failed to get predictions",
        status: data.status,
        message: data.error_message,
      });
    }
  } catch (error) {
    console.error("Autocomplete error:", error);
    res.status(500).json({ error: "Failed to get autocomplete predictions" });
  }
});

// Get nearby places for a location
app.get("/api/nearby-places", async (req, res) => {
  const { lat, lng, radius = 5000, type = "establishment" } = req.query;

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.status === "OK") {
      res.json({
        success: true,
        places: data.results.map((place) => ({
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          rating: place.rating,
          types: place.types,
          location: place.geometry.location,
        })),
      });
    } else {
      res.status(400).json({
        error: "Failed to fetch nearby places",
        status: data.status,
        message: data.error_message,
      });
    }
  } catch (error) {
    console.error("Nearby places error:", error);
    res.status(500).json({ error: "Failed to fetch nearby places" });
  }
});

// Google Places API for skate park discovery
app.post("/api/places/nearby", async (req, res) => {
  const { location, radius = 5000, keyword } = req.body;

  if (!location || !location.lat || !location.lng) {
    return res
      .status(400)
      .json({ error: "Location with lat and lng is required" });
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return res.status(500).json({
      error: "Google Places API key not configured",
    });
  }

  try {
    let searchUrl =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${location.lat},${location.lng}&` +
      `radius=${radius}`;

    if (keyword) {
      searchUrl += `&keyword=${encodeURIComponent(keyword)}`;
    }

    searchUrl += `&key=${GOOGLE_PLACES_API_KEY}`;

    console.log(
      `Searching for skate spots: ${keyword} near ${location.lat}, ${location.lng}`
    );

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.status === "OK" || data.status === "ZERO_RESULTS") {
      res.json({
        success: true,
        results: data.results || [],
        status: data.status,
      });
    } else {
      console.error(
        "Google Places API error:",
        data.status,
        data.error_message
      );
      res.status(400).json({
        error: "Failed to search for places",
        status: data.status,
        message: data.error_message,
      });
    }
  } catch (error) {
    console.error("Places search error:", error);
    res.status(500).json({ error: "Failed to search for places" });
  }
});

// Gallery API Endpoints

// Upload photo to gallery
app.post("/api/gallery/photos", requireAuth, (req, res) => {
  const { photoUrl, caption, category, tags, location, isPublic } = req.body;

  if (!photoUrl) {
    return res.status(400).json({ error: "Photo URL is required" });
  }

  const tagsStr = tags ? JSON.stringify(tags) : null;

  db.run(
    "INSERT INTO gallery_photos (user_id, photo_url, caption, category, tags, location, is_public) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      req.user.id,
      photoUrl,
      caption,
      category || "general",
      tagsStr,
      location,
      isPublic ? 1 : 0,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to upload photo" });

      res.json({
        success: true,
        photoId: this.lastID,
        message: "Photo uploaded successfully",
      });
    }
  );
});

// Get all public photos with pagination
app.get("/api/gallery/photos", (req, res) => {
  const { page = 1, limit = 20, category, search } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT p.*, u.username as author_name,
           (SELECT COUNT(*) FROM photo_likes WHERE photo_id = p.id) as like_count,
           (SELECT COUNT(*) FROM photo_comments WHERE photo_id = p.id) as comment_count
    FROM gallery_photos p
    JOIN users u ON p.user_id = u.id
    WHERE p.is_public = 1
  `;

  const params = [];

  if (category && category !== "all") {
    query += " AND p.category = ?";
    params.push(category);
  }

  if (search) {
    query += " AND (p.caption LIKE ? OR p.tags LIKE ? OR p.location LIKE ?)";
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), offset);

  db.all(query, params, (err, photos) => {
    if (err) return res.status(500).json({ error: "Failed to fetch photos" });

    // Get total count for pagination
    let countQuery =
      "SELECT COUNT(*) as total FROM gallery_photos WHERE is_public = 1";
    const countParams = [];

    if (category && category !== "all") {
      countQuery += " AND category = ?";
      countParams.push(category);
    }

    if (search) {
      countQuery += " AND (caption LIKE ? OR tags LIKE ? OR location LIKE ?)";
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    db.get(countQuery, countParams, (err, result) => {
      if (err)
        return res.status(500).json({ error: "Failed to get photo count" });

      res.json({
        photos: photos || [],
        pagination: {
          current: parseInt(page),
          total: Math.ceil(result.total / limit),
          hasMore: parseInt(page) * parseInt(limit) < result.total,
        },
      });
    });
  });
});

// Get user's photos
app.get("/api/gallery/photos/my", requireAuth, (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  const query = `
    SELECT p.*, 
           (SELECT COUNT(*) FROM photo_likes WHERE photo_id = p.id) as like_count,
           (SELECT COUNT(*) FROM photo_comments WHERE photo_id = p.id) as comment_count
    FROM gallery_photos p
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC LIMIT ? OFFSET ?
  `;

  db.all(query, [req.user.id, parseInt(limit), offset], (err, photos) => {
    if (err) return res.status(500).json({ error: "Failed to fetch photos" });
    res.json({ photos: photos || [] });
  });
});

// Like/unlike a photo
app.post("/api/gallery/photos/:id/like", requireAuth, (req, res) => {
  const { id } = req.params;

  // Check if already liked
  db.get(
    "SELECT * FROM photo_likes WHERE photo_id = ? AND user_id = ?",
    [id, req.user.id],
    (err, existing) => {
      if (err)
        return res.status(500).json({ error: "Failed to check like status" });

      if (existing) {
        // Unlike
        db.run(
          "DELETE FROM photo_likes WHERE photo_id = ? AND user_id = ?",
          [id, req.user.id],
          function (err) {
            if (err)
              return res.status(500).json({ error: "Failed to unlike photo" });

            // Update photo like count
            db.run("UPDATE gallery_photos SET likes = likes - 1 WHERE id = ?", [
              id,
            ]);

            res.json({ success: true, liked: false });
          }
        );
      } else {
        // Like
        db.run(
          "INSERT INTO photo_likes (photo_id, user_id) VALUES (?, ?)",
          [id, req.user.id],
          function (err) {
            if (err)
              return res.status(500).json({ error: "Failed to like photo" });

            // Update photo like count
            db.run("UPDATE gallery_photos SET likes = likes + 1 WHERE id = ?", [
              id,
            ]);

            res.json({ success: true, liked: true });
          }
        );
      }
    }
  );
});

// Add comment to photo
app.post("/api/gallery/photos/:id/comments", requireAuth, (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ error: "Comment is required" });
  }

  db.run(
    "INSERT INTO photo_comments (photo_id, user_id, comment) VALUES (?, ?, ?)",
    [id, req.user.id, comment.trim()],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to add comment" });

      res.json({
        success: true,
        commentId: this.lastID,
        message: "Comment added successfully",
      });
    }
  );
});

// Get comments for a photo
app.get("/api/gallery/photos/:id/comments", (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT c.*, u.username as author_name
    FROM photo_comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.photo_id = ?
    ORDER BY c.created_at ASC
  `;

  db.all(query, [id], (err, comments) => {
    if (err) return res.status(500).json({ error: "Failed to fetch comments" });
    res.json({ comments: comments || [] });
  });
});

// Delete user's photo
app.delete("/api/gallery/photos/:id", requireAuth, (req, res) => {
  const { id } = req.params;

  // Check if user owns the photo
  db.get(
    "SELECT user_id FROM gallery_photos WHERE id = ?",
    [id],
    (err, photo) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Failed to check photo ownership" });
      if (!photo) return res.status(404).json({ error: "Photo not found" });
      if (photo.user_id !== req.user.id)
        return res
          .status(403)
          .json({ error: "Not authorized to delete this photo" });

      // Delete photo and related data
      db.run("DELETE FROM photo_likes WHERE photo_id = ?", [id]);
      db.run("DELETE FROM photo_comments WHERE photo_id = ?", [id]);
      db.run("DELETE FROM gallery_photos WHERE id = ?", [id], function (err) {
        if (err)
          return res.status(500).json({ error: "Failed to delete photo" });
        res.json({ success: true, message: "Photo deleted successfully" });
      });
    }
  );
});

// Super Admin API Endpoints

// Middleware to check if user is super admin
function requireSuperAdmin(req, res, next) {
  if (req.user.role !== "super_admin") {
    return res.status(403).json({ error: "Super admin access required" });
  }
  next();
}

// Get all users (super admin only)
app.get("/api/admin/users", requireAuth, requireSuperAdmin, (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query;
  const offset = (page - 1) * limit;

  let query =
    "SELECT id, username, email, role, verified, created_at FROM users WHERE 1=1";
  const params = [];

  if (search) {
    query += " AND (username LIKE ? OR email LIKE ?)";
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  if (role && role !== "all") {
    query += " AND role = ?";
    params.push(role);
  }

  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), offset);

  db.all(query, params, (err, users) => {
    if (err) return res.status(500).json({ error: "Failed to fetch users" });

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM users WHERE 1=1";
    const countParams = [];

    if (search) {
      countQuery += " AND (username LIKE ? OR email LIKE ?)";
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    if (role && role !== "all") {
      countQuery += " AND role = ?";
      countParams.push(role);
    }

    db.get(countQuery, countParams, (err, result) => {
      if (err)
        return res.status(500).json({ error: "Failed to get user count" });

      res.json({
        users: users || [],
        pagination: {
          current: parseInt(page),
          total: Math.ceil(result.total / limit),
          hasMore: parseInt(page) * parseInt(limit) < result.total,
        },
      });
    });
  });
});

// Create new user (super admin only)
app.post("/api/admin/users", requireAuth, requireSuperAdmin, (req, res) => {
  const { username, email, password, role = "user" } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, email, and password are required" });
  }

  if (!["user", "admin", "super_admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  // Check if username or email already exists
  db.get(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email],
    (err, existing) => {
      if (err)
        return res.status(500).json({ error: "Failed to check existing user" });
      if (existing)
        return res
          .status(400)
          .json({ error: "Username or email already exists" });

      const hash = bcrypt.hashSync(password, 10);

      db.run(
        "INSERT INTO users (username, email, password, role, verified) VALUES (?, ?, ?, ?, ?)",
        [username, email, hash, role, 1],
        function (err) {
          if (err)
            return res.status(500).json({ error: "Failed to create user" });

          res.json({
            success: true,
            user: {
              id: this.lastID,
              username,
              email,
              role,
              verified: 1,
            },
            message: "User created successfully",
          });
        }
      );
    }
  );
});

// Update user role (super admin only)
app.put(
  "/api/admin/users/:id/role",
  requireAuth,
  requireSuperAdmin,
  (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin", "super_admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Prevent super admin from demoting themselves
    if (parseInt(id) === req.user.id && role !== "super_admin") {
      return res
        .status(400)
        .json({ error: "Cannot demote yourself from super admin" });
    }

    db.run(
      "UPDATE users SET role = ? WHERE id = ?",
      [role, id],
      function (err) {
        if (err)
          return res.status(500).json({ error: "Failed to update user role" });
        if (this.changes === 0)
          return res.status(404).json({ error: "User not found" });

        res.json({ success: true, message: "User role updated successfully" });
      }
    );
  }
);

// Delete user (super admin only)
app.delete(
  "/api/admin/users/:id",
  requireAuth,
  requireSuperAdmin,
  (req, res) => {
    const { id } = req.params;

    // Prevent super admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: "Cannot delete yourself" });
    }

    // Delete user and all related data
    db.run("DELETE FROM messages WHERE senderId = ? OR receiverId = ?", [
      id,
      id,
    ]);
    db.run("DELETE FROM photo_likes WHERE user_id = ?", [id]);
    db.run("DELETE FROM photo_comments WHERE user_id = ?", [id]);
    db.run("DELETE FROM gallery_photos WHERE user_id = ?", [id]);
    db.run("DELETE FROM spot_reviews WHERE user_id = ?", [id]);
    db.run("DELETE FROM spot_photos WHERE user_id = ?", [id]);
    db.run("DELETE FROM skate_spots WHERE submitted_by = ?", [id]);
    db.run(
      "DELETE FROM events WHERE submittedBy = (SELECT username FROM users WHERE id = ?)",
      [id]
    );
    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
      if (err) return res.status(500).json({ error: "Failed to delete user" });
      if (this.changes === 0)
        return res.status(404).json({ error: "User not found" });

      res.json({ success: true, message: "User deleted successfully" });
    });
  }
);

// Get system statistics (super admin only)
app.get("/api/admin/stats", requireAuth, requireSuperAdmin, (req, res) => {
  const stats = {};

  // Get user counts by role
  db.get("SELECT COUNT(*) as total FROM users", [], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to get user stats" });
    stats.totalUsers = result.total;

    db.get(
      'SELECT COUNT(*) as count FROM users WHERE role = "admin"',
      [],
      (err, result) => {
        if (err)
          return res.status(500).json({ error: "Failed to get admin stats" });
        stats.adminUsers = result.count;

        db.get(
          'SELECT COUNT(*) as count FROM users WHERE role = "super_admin"',
          [],
          (err, result) => {
            if (err)
              return res
                .status(500)
                .json({ error: "Failed to get super admin stats" });
            stats.superAdminUsers = result.count;

            // Get content stats
            db.get(
              "SELECT COUNT(*) as count FROM events",
              [],
              (err, result) => {
                if (err)
                  return res
                    .status(500)
                    .json({ error: "Failed to get event stats" });
                stats.totalEvents = result.count;

                db.get(
                  "SELECT COUNT(*) as count FROM skate_spots",
                  [],
                  (err, result) => {
                    if (err)
                      return res
                        .status(500)
                        .json({ error: "Failed to get skate spot stats" });
                    stats.totalSkateSpots = result.count;

                    db.get(
                      "SELECT COUNT(*) as count FROM gallery_photos",
                      [],
                      (err, result) => {
                        if (err)
                          return res
                            .status(500)
                            .json({ error: "Failed to get photo stats" });
                        stats.totalPhotos = result.count;

                        db.get(
                          "SELECT COUNT(*) as count FROM messages",
                          [],
                          (err, result) => {
                            if (err)
                              return res
                                .status(500)
                                .json({ error: "Failed to get message stats" });
                            stats.totalMessages = result.count;

                            res.json({ stats });
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

// Get system logs (super admin only)
app.get("/api/admin/logs", requireAuth, requireSuperAdmin, (req, res) => {
  // For now, return a mock log structure
  // In a real implementation, you'd want to implement proper logging
  const logs = [
    {
      id: 1,
      timestamp: new Date().toISOString(),
      level: "INFO",
      message: "System started successfully",
      user: "system",
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      level: "INFO",
      message: "New user registered: testuser",
      user: "system",
    },
  ];

  res.json({ logs });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
