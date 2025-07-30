const sqlite3 = require('sqlite3').verbose();

console.log('Quick database test...');

const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to database.');
  
  // Add one test spot
  const testSpot = {
    name: "Test Skate Park",
    type: "park",
    difficulty: "intermediate",
    latitude: 27.9506,
    longitude: -82.4572,
    description: "Test skate park",
    features: JSON.stringify(["Lighting", "Parking"]),
    hours: "6 AM - 10 PM",
    rating: 4.0,
    reviews: 10,
    crowd_level: "medium",
    photos: JSON.stringify(["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"]),
    approved: 1
  };
  
  const insertQuery = `
    INSERT INTO skate_spots (
      name, type, difficulty, latitude, longitude, description, 
      features, hours, rating, reviews, crowd_level, photos, approved
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(insertQuery, [
    testSpot.name,
    testSpot.type,
    testSpot.difficulty,
    testSpot.latitude,
    testSpot.longitude,
    testSpot.description,
    testSpot.features,
    testSpot.hours,
    testSpot.rating,
    testSpot.reviews,
    testSpot.crowd_level,
    testSpot.photos,
    testSpot.approved
  ], function(err) {
    if (err) {
      console.error('Error adding test spot:', err);
    } else {
      console.log(`Added test spot: ${testSpot.name} (ID: ${this.lastID})`);
    }
    
    // Check how many spots we have
    db.get('SELECT COUNT(*) as count FROM skate_spots WHERE approved = 1', [], (err, row) => {
      if (err) {
        console.error('Error counting spots:', err);
      } else {
        console.log(`Total approved spots in database: ${row.count}`);
      }
      
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Test completed.');
          process.exit(0);
        }
      });
    });
  });
}); 