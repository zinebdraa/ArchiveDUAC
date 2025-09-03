const Database = require("better-sqlite3");

const db = new Database("./database.sqlite");

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
      document_titre TEXT NOT NULL,
      file_path TEXT NOT NULL,  
      file_type TEXT, 
      file_size INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      chemise_id INTEGER NOT NULL,
      FOREIGN KEY (chemise_id) REFERENCES chemises (id_chemise) ON DELETE CASCADE,
      CHECK (file_type IN ('pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'xls', 'xlsx', 'ppt', 'pptx'))
    )
  `).run();

  // Create indexes for better performance
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_bureaus_service_id ON bureaus(service_id)`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_chemises_bureau_id ON chemises(bureau_id)`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_documents_chemise_id ON documents(chemise_id)`).run();
});

createTables();

module.exports = db;