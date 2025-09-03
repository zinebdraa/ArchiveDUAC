const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { authenticateToken } = require("./auth");

const router = express.Router();

// Get current user profile
router.get("/profile", authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = db.prepare("SELECT id_user, user_name, user_email, user_num FROM users WHERE id_user = ?").get(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Create initial user (for setup - remove in production or protect with admin auth)
router.post("/setup", (req, res) => {
  try {
    const { user_name, user_email, user_num, password } = req.body;

    if (!user_name || !user_email || !user_num || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if any user already exists
    const existingUser = db.prepare("SELECT COUNT(*) as count FROM users").get();
    if (existingUser.count > 0) {
      return res.status(400).json({ error: "User already exists. Use login instead." });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user
    const insertUser = db.prepare(`
      INSERT INTO users (user_name, user_email, user_num, password)
      VALUES (?, ?, ?, ?)
    `);

    const result = insertUser.run(user_name, user_email, user_num, hashedPassword);

    // Return user data (without password)
    const newUser = db.prepare("SELECT id_user, user_name, user_email, user_num FROM users WHERE id_user = ?").get(result.lastInsertRowid);

    res.status(201).json({
      message: "User created successfully",
      user: newUser
    });

  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: "Username or email already exists" });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Change password
router.put("/change-password", authenticateToken, (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const userId = req.user.userId;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" });
    }

    // Get current user
    const user = db.prepare("SELECT password FROM users WHERE id_user = ?").get(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isValidPassword = bcrypt.compareSync(current_password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = bcrypt.hashSync(new_password, 10);

    // Update password
    const result = db.prepare("UPDATE users SET password = ? WHERE id_user = ?").run(hashedNewPassword, userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
});

module.exports = router;