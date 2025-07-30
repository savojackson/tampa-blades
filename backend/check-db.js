const sqlite3 = require("sqlite3").verbose();

// Connect to the database
const db = new sqlite3.Database("./db.sqlite", (err) => {
  if (err) {
    console.error("❌ Error opening database:", err);
    return;
  }
  console.log("✅ Connected to SQLite database");
});

// Function to check users
function checkUsers() {
  console.log("\n👥 USERS:");
  db.all(
    "SELECT id, username, email, role, verified FROM users",
    (err, rows) => {
      if (err) {
        console.error("Error fetching users:", err);
      } else {
        console.table(rows);
      }
      checkEvents();
    }
  );
}

// Function to check events
function checkEvents() {
  console.log("\n📅 EVENTS:");
  db.all(
    "SELECT id, title, eventType, date, approved, submittedBy FROM events ORDER BY date DESC LIMIT 10",
    (err, rows) => {
      if (err) {
        console.error("Error fetching events:", err);
      } else {
        console.table(rows);
      }
      checkSkateSpots();
    }
  );
}

// Function to check skate spots
function checkSkateSpots() {
  console.log("\n🛹 SKATE SPOTS:");
  db.all(
    "SELECT id, name, type, difficulty, latitude, longitude, approved FROM skate_spots LIMIT 10",
    (err, rows) => {
      if (err) {
        console.error("Error fetching skate spots:", err);
      } else {
        console.table(rows);
      }
      checkStats();
    }
  );
}

// Function to show database stats
function checkStats() {
  console.log("\n📊 DATABASE STATS:");

  const queries = [
    { name: "Total Users", query: "SELECT COUNT(*) as count FROM users" },
    { name: "Total Events", query: "SELECT COUNT(*) as count FROM events" },
    {
      name: "Approved Events",
      query: "SELECT COUNT(*) as count FROM events WHERE approved = 1",
    },
    {
      name: "Total Skate Spots",
      query: "SELECT COUNT(*) as count FROM skate_spots",
    },
    {
      name: "Approved Spots",
      query: "SELECT COUNT(*) as count FROM skate_spots WHERE approved = 1",
    },
    {
      name: "Total Photos",
      query: "SELECT COUNT(*) as count FROM gallery_photos",
    },
  ];

  let completed = 0;
  const stats = {};

  queries.forEach(({ name, query }) => {
    db.get(query, (err, row) => {
      if (!err) {
        stats[name] = row.count;
      }
      completed++;

      if (completed === queries.length) {
        console.table(stats);
        closeDatabase();
      }
    });
  });
}

// Close database connection
function closeDatabase() {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err);
    } else {
      console.log("\n✅ Database connection closed");
    }
  });
}

// Start checking
console.log("🔍 Checking Tampa Blades Database...\n");
checkUsers();
