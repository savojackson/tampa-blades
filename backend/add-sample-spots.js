const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database.');
});

// Sample Tampa skate spots
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
  }
];

// Insert sample spots
function addSampleSpots() {
  console.log('Adding sample skate spots...');
  
  const insertQuery = `
    INSERT INTO skate_spots (
      name, type, difficulty, latitude, longitude, description, 
      features, hours, rating, reviews, crowd_level, photos, approved
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  sampleSpots.forEach((spot, index) => {
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
      
      // Close database after adding all spots
      if (index === sampleSpots.length - 1) {
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('Database closed. Sample spots added successfully!');
          }
        });
      }
    });
  });
}

// Run the script
addSampleSpots(); 