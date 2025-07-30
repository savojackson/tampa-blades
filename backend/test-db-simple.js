const sqlite3 = require('sqlite3').verbose();

console.log('Testing database connection...');

const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database.');
  
  // Test a simple query
  db.get('SELECT COUNT(*) as count FROM skate_spots', [], (err, row) => {
    if (err) {
      console.error('Error querying database:', err);
    } else {
      console.log(`Found ${row.count} skate spots in database`);
    }
    
    // Close database
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database test completed.');
      }
    });
  });
}); 