const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database.');
});

// Test the area query
const north = 28.0;
const south = 27.9;
const east = -82.4;
const west = -82.5;

const dbQuery = `
  SELECT * FROM skate_spots 
  WHERE approved = 1 
  AND latitude BETWEEN ? AND ? 
  AND longitude BETWEEN ? AND ?
  ORDER BY rating DESC
`;

console.log('Testing area query with bounds:', { north, south, east, west });

db.all(dbQuery, [south, north, west, east], (err, dbSpots) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Found spots:', dbSpots.length);
    dbSpots.forEach(spot => {
      console.log(`- ${spot.name} (${spot.latitude}, ${spot.longitude})`);
    });
  }
  
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database closed.');
    }
  });
}); 