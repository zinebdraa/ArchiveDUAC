/*
const db = require("./db");   // reuse your db connection
const bcrypt = require("bcrypt");

async function createAdmin() {
  try {
    // hash the password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // insert user into DB
    const stmt = db.prepare(`
      INSERT INTO users (user_name, user_email, user_num, password)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run("admin", "admin@example.com", 12345, hashedPassword);

    console.log("✅ Admin user created successfully");
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
  }
}

createAdmin();
*/