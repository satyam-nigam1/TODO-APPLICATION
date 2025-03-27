const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// ✅ Database File Create (or Open)
const dbPath = path.join(__dirname, "todo.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
    db.run(
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      )`,
      (err) => {
        if (err) {
          console.error("Error creating table:", err.message);
        } else {
          console.log("✅ Tasks table ready.");
        }
      }
    );
  }
});

module.exports = db;
