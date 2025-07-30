// Database connection abstraction layer
// Supports both SQLite (development) and PostgreSQL (production)

const sqlite3 = require("sqlite3").verbose();

class DatabaseConnection {
  constructor() {
    this.db = null;
    this.isProduction = process.env.NODE_ENV === "production";
    this.databaseUrl = process.env.DATABASE_URL;
  }

  async connect() {
    if (this.isProduction && this.databaseUrl) {
      // For production: Use PostgreSQL (Vercel Postgres, Supabase, etc.)
      console.log("🔗 Connecting to cloud database...");
      try {
        const { Pool } = require("pg");
        this.pool = new Pool({
          connectionString: this.databaseUrl,
          ssl: this.databaseUrl.includes("localhost")
            ? false
            : { rejectUnauthorized: false },
        });
        await this.pool.connect();
        console.log("✅ Connected to PostgreSQL database");
        return true;
      } catch (error) {
        console.error("❌ PostgreSQL connection failed:", error);
        console.log("⚠️  Falling back to SQLite...");
      }
    }

    // Fallback to SQLite for development
    console.log("🔗 Connecting to SQLite database...");
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database("./db.sqlite", (err) => {
        if (err) {
          console.error("❌ SQLite connection failed:", err);
          reject(err);
        } else {
          console.log("✅ Connected to SQLite database");
          resolve(true);
        }
      });
    });
  }

  async query(sql, params = []) {
    if (this.pool) {
      // PostgreSQL query
      try {
        const result = await this.pool.query(sql, params);
        return result.rows;
      } catch (error) {
        console.error("Query error:", error);
        throw error;
      }
    } else if (this.db) {
      // SQLite query
      return new Promise((resolve, reject) => {
        if (sql.toLowerCase().startsWith("select")) {
          this.db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        } else {
          this.db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ changes: this.changes, lastID: this.lastID });
          });
        }
      });
    } else {
      throw new Error("No database connection available");
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
    } else if (this.db) {
      return new Promise((resolve) => {
        this.db.close(resolve);
      });
    }
  }
}

module.exports = new DatabaseConnection();
