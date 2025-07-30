// Database migration script
// Run this to set up your database schema

const fs = require("fs");
const path = require("path");
const db = require("./connection");

async function runMigrations() {
  try {
    console.log("🚀 Starting database migration...");

    // Connect to database
    await db.connect();

    // Read schema file
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Split schema into individual statements
    const statements = schema
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    // Execute each statement
    for (const statement of statements) {
      try {
        await db.query(statement);
        console.log(
          "✅ Executed:",
          statement.split("\n")[0].substring(0, 50) + "..."
        );
      } catch (error) {
        console.error("❌ Error executing statement:", error.message);
        console.log("Statement:", statement.substring(0, 100) + "...");
      }
    }

    console.log("🎉 Database migration completed successfully!");

    // Insert sample data if in development
    if (process.env.NODE_ENV !== "production") {
      console.log("📊 Inserting sample data...");
      await insertSampleData();
    }

    await db.close();
    process.exit(0);
  } catch (error) {
    console.error("💥 Migration failed:", error);
    process.exit(1);
  }
}

async function insertSampleData() {
  // Sample users
  const sampleUsers = [
    {
      username: "admin",
      email: "admin@tampablades.com",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
      role: "super_admin",
    },
    {
      username: "skater1",
      email: "skater1@example.com",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
      role: "user",
    },
  ];

  for (const user of sampleUsers) {
    try {
      await db.query(
        "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING",
        [user.username, user.email, user.password, user.role]
      );
    } catch (error) {
      // Handle SQLite vs PostgreSQL syntax differences
      try {
        await db.query(
          "INSERT OR IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
          [user.username, user.email, user.password, user.role]
        );
      } catch (sqliteError) {
        console.log("Sample user already exists:", user.username);
      }
    }
  }

  // Sample skate spots
  const sampleSpots = [
    {
      name: "Tampa Skate Park",
      type: "park",
      difficulty: "intermediate",
      latitude: 27.9506,
      longitude: -82.4572,
      description: "Popular skate park with ramps, bowls, and street obstacles",
      features: JSON.stringify([
        "Lighting",
        "Water Fountain",
        "Restrooms",
        "Parking",
      ]),
      hours: "6 AM - 10 PM",
      rating: 4.5,
      reviews: 127,
      crowd_level: "medium",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
      ]),
      approved: true,
    },
  ];

  for (const spot of sampleSpots) {
    try {
      await db.query(
        "INSERT INTO skate_spots (name, type, difficulty, latitude, longitude, description, features, hours, rating, reviews, crowd_level, photos, approved) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (name) DO NOTHING",
        [
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
          spot.approved,
        ]
      );
    } catch (error) {
      // Handle SQLite vs PostgreSQL syntax differences
      try {
        await db.query(
          "INSERT OR IGNORE INTO skate_spots (name, type, difficulty, latitude, longitude, description, features, hours, rating, reviews, crowd_level, photos, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
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
            spot.approved,
          ]
        );
      } catch (sqliteError) {
        console.log("Sample spot already exists:", spot.name);
      }
    }
  }

  console.log("✅ Sample data inserted");
}

// Run migrations if this script is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations, insertSampleData };
