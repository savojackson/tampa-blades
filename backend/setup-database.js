const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('Setting up database...');

// Create a new database connection
const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

// Sample skate spots data
const sampleSpots = [
  {
    name: "Tampa Skate Park",
    type: "park",
    difficulty: "intermediate",
    latitude: 27.9506,
    longitude: -82.4572,
    description: "Popular skate park with ramps, bowls, and street obstacles",
    features: JSON.stringify(["Lighting", "Water Fountain", "Restrooms", "Parking"]),
    hours: "6 AM - 10 PM",
    rating: 4.5,
    reviews: 127,
    crowd_level: "medium",
    photos: JSON.stringify(["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"]),
    approved: 1
  },
  {
    name: "Bayshore Boulevard",
    type: "trail",
    difficulty: "beginner",
    latitude: 27.9465,
    longitude: -82.4596,
    description: "Smooth waterfront trail perfect for cruising and beginners",
    features: JSON.stringify(["Smooth Surface", "Waterfront Views", "Rest Areas", "Parking"]),
    hours: "24/7",
    rating: 4.8,
    reviews: 89,
    crowd_level: "high",
    photos: JSON.stringify(["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"]),
    approved: 1
  },
  {
    name: "Curtis Hixon Waterfront Park",
    type: "park",
    difficulty: "beginner",
    latitude: 27.9485,
    longitude: -82.4592,
    description: "Beautiful waterfront park with smooth surfaces for skating",
    features: JSON.stringify(["Waterfront Views", "Smooth Surface", "Rest Areas", "Parking"]),
    hours: "6 AM - 11 PM",
    rating: 4.3,
    reviews: 95,
    crowd_level: "medium",
    photos: JSON.stringify(["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"]),
    approved: 1
  },
  {
    name: "Riverwalk Trail",
    type: "trail",
    difficulty: "beginner",
    latitude: 27.9475,
    longitude: -82.4585,
    description: "Scenic urban trail along the Hillsborough River",
    features: JSON.stringify(["River Views", "Smooth Surface", "Restaurants", "Parking"]),
    hours: "24/7",
    rating: 4.6,
    reviews: 156,
    crowd_level: "medium",
    photos: JSON.stringify(["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"]),
    approved: 1
  },
  {
    name: "Ybor City Skate Spot",
    type: "street",
    difficulty: "advanced",
    latitude: 27.9659,
    longitude: -82.4494,
    description: "Historic district with great street skating spots",
    features: JSON.stringify(["Historic", "Street Course", "Restaurants", "Parking"]),
    hours: "24/7",
    rating: 4.2,
    reviews: 78,
    crowd_level: "low",
    photos: JSON.stringify(["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"]),
    approved: 1
  },
  {
    name: "St. Pete Skate Park",
    type: "park",
    difficulty: "intermediate",
    latitude: 27.7731,
    longitude: -82.6400,
    description: "Modern skate park with concrete bowls and street features",
    features: JSON.stringify(["Concrete Bowls", "Street Course", "Lighting", "Parking"]),
    hours: "6 AM - 10 PM",
    rating: 4.7,
    reviews: 203,
    crowd_level: "high",
    photos: JSON.stringify(["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"]),
    approved: 1
  },
  {
    name: "Pinellas Trail",
    type: "trail",
    difficulty: "beginner",
    latitude: 27.7701,
    longitude: -82.6364,
    description: "Long paved trail perfect for distance skating",
    features: JSON.stringify(["Paved Surface", "Scenic Views", "Rest Areas", "Multiple Access Points"]),
    hours: "24/7",
    rating: 4.9,
    reviews: 342,
    crowd_level: "medium",
    photos: JSON.stringify(["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"]),
    approved: 1
  },
  {
    name: "Clearwater Beach Boardwalk",
    type: "trail",
    difficulty: "beginner",
    latitude: 27.9789,
    longitude: -82.8316,
    description: "Scenic beachfront boardwalk for casual skating",
    features: JSON.stringify(["Beach Views", "Smooth Surface", "Restaurants", "Parking"]),
    hours: "24/7",
    rating: 4.4,
    reviews: 167,
    crowd_level: "high",
    photos: JSON.stringify(["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"]),
    approved: 1
  },
  {
    name: "Orlando Skate Park",
    type: "park",
    difficulty: "advanced",
    latitude: 28.5383,
    longitude: -81.3792,
    description: "Professional-grade skate park with multiple skill levels",
    features: JSON.stringify(["Multiple Bowls", "Street Course", "Pro Shop", "Parking"]),
    hours: "6 AM - 10 PM",
    rating: 4.6,
    reviews: 189,
    crowd_level: "medium",
    photos: JSON.stringify(["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"]),
    approved: 1
  },
  {
    name: "Miami Beach Skate Park",
    type: "park",
    difficulty: "intermediate",
    latitude: 25.7907,
    longitude: -80.1300,
    description: "Beachfront skate park with ocean views",
    features: JSON.stringify(["Ocean Views", "Concrete Bowls", "Street Course", "Parking"]),
    hours: "6 AM - 10 PM",
    rating: 4.3,
    reviews: 145,
    crowd_level: "high",
    photos: JSON.stringify(["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"]),
    approved: 1
  }
];

// Setup database tables and data
function setupDatabase() {
  console.log('Creating tables...');
  
  // Create skate_spots table
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
  )`, (err) => {
    if (err) {
      console.error('Error creating skate_spots table:', err);
      return;
    }
    console.log('skate_spots table created/verified.');
    
    // Clear existing data
    db.run('DELETE FROM skate_spots', (err) => {
      if (err) {
        console.error('Error clearing existing data:', err);
        return;
      }
      console.log('Cleared existing skate spots data.');
      
      // Insert sample data
      insertSampleData();
    });
  });
}

// Insert sample data
function insertSampleData() {
  console.log('Inserting sample skate spots...');
  
  const insertQuery = `
    INSERT INTO skate_spots (
      name, type, difficulty, latitude, longitude, description, 
      features, hours, rating, reviews, crowd_level, photos, approved
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  let completed = 0;
  
  sampleSpots.forEach((spot) => {
    db.run(insertQuery, [
      spot.name,
      spot.type,
      spot.difficulty,
      spot.latitude,
      spot.longitude,
      spot.description,
      spot.features,
      spot.hours,
      spot.rating,
      spot.reviews,
      spot.crowd_level,
      spot.photos,
      spot.approved
    ], function(err) {
      if (err) {
        console.error(`Error adding spot ${spot.name}:`, err);
      } else {
        console.log(`Added spot: ${spot.name} (ID: ${this.lastID})`);
      }
      
      completed++;
      if (completed === sampleSpots.length) {
        console.log('All sample spots added successfully!');
        
        // Verify the data
        db.get('SELECT COUNT(*) as count FROM skate_spots WHERE approved = 1', [], (err, row) => {
          if (err) {
            console.error('Error verifying data:', err);
          } else {
            console.log(`Database now contains ${row.count} approved skate spots.`);
          }
          
          // Close database
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err);
            } else {
              console.log('Database setup completed successfully!');
              process.exit(0);
            }
          });
        });
      }
    });
  });
}

// Run the setup
setupDatabase(); 