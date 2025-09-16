const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const { app } = require("electron");

let dbPath ;




// If running inside Electron (packaged app)
if (app && app.getPath) {
  const userDataPath = app.getPath("userData");
  dbPath = path.join(userDataPath, "database.sqlite");

   if (!fs.existsSync(dbPath)) {
    const packagedDbPath = path.join(process.resourcesPath, "database.sqlite");
    if (fs.existsSync(packagedDbPath)) {
      fs.copyFileSync(packagedDbPath, dbPath);
      console.log("Copied pre-filled database to userData folder.");
    }else {
      console.warn("[db] No packaged DB found, empty DB will be created.");
    }
  }else {
    console.log("[db] Using existing DB in userData.");
  }
} else {
  // Fallback for dev mode
  dbPath = path.join(__dirname, "../database.sqlite");
}

const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

// create tables
const createTables = db.transaction(() => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id_user INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT NOT NULL UNIQUE,
      user_email TEXT NOT NULL UNIQUE,
      user_num TEXT NOT NULL,
      password TEXT NOT NULL,
      CHECK (user_email LIKE '%@%')
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS services (
      id_service INTEGER PRIMARY KEY AUTOINCREMENT,
      service_name TEXT NOT NULL UNIQUE,
      service_place TEXT NOT NULL UNIQUE,
      sCreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      sDescription TEXT 
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS bureaus (
      id_bureau INTEGER PRIMARY KEY AUTOINCREMENT,
      bureau_name TEXT NOT NULL UNIQUE,
      bureau_place TEXT NOT NULL UNIQUE,
      bCreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      bDescription TEXT,
      service_id INTEGER NOT NULL,
      FOREIGN KEY (service_id) REFERENCES services (id_service) ON DELETE CASCADE
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS chemises (
      id_chemise INTEGER PRIMARY KEY AUTOINCREMENT,
      chemise_name TEXT NOT NULL,
      chemise_place TEXT NOT NULL UNIQUE,
      cCreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      cDescription TEXT,
      bureau_id INTEGER NOT NULL,
      FOREIGN KEY (bureau_id) REFERENCES bureaus (id_bureau) ON DELETE CASCADE
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS documents (
      id_document INTEGER PRIMARY KEY AUTOINCREMENT,
      document_name TEXT NOT NULL,
      document_place TEXT NOT NULL,
      dDescription TEXT,
      dCreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      document_type TEXT NOT NULL, 
      document_data BLOB, 
      chemise_id INTEGER NOT NULL,
      FOREIGN KEY (chemise_id) REFERENCES chemises (id_chemise) ON DELETE CASCADE,
      CHECK (document_type IN ('pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'xls', 'xlsx', 'ppt', 'pptx'))
    )
  `).run();

  // Create indexes for better performance
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_bureaus_service_id ON bureaus(service_id)`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_chemises_bureau_id ON chemises(bureau_id)`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_documents_chemise_id ON documents(chemise_id)`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type)`).run();
});

createTables();

module.exports = db;