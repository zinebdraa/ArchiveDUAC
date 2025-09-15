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

// // Create initial user (for setup - remove in production or protect with admin auth)
// router.post("/setup", (req, res) => {
//   try {
//     const { user_name, user_email, user_num, password } = req.body;

//     if (!user_name || !user_email || !user_num || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const existingUser = db.prepare("SELECT COUNT(*) as count FROM users").get();
//     if (existingUser.count > 0) {
//       return res.status(400).json({ error: "User already exists. Use login instead." });
//     }

//     const hashedPassword = bcrypt.hashSync(password, 10);

//     const insertUser = db.prepare(`
//       INSERT INTO users (user_name, user_email, user_num, password)
//       VALUES (?, ?, ?, ?)
//     `);

//     const result = insertUser.run(user_name, user_email, user_num, hashedPassword);

//     const newUser = db.prepare("SELECT id_user, user_name, user_email, user_num FROM users WHERE id_user = ?").get(result.lastInsertRowid);

//     res.status(201).json({
//       message: "User created successfully",
//       user: newUser
//     });

//   } catch (error) {
//     console.error("Error creating user:", error);
//     if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
//       return res.status(400).json({ error: "Username or email already exists" });
//     }
//     res.status(500).json({ error: "Failed to create user" });
//   }
// });

// Forgot password (reset via email + phone number)
router.put("/forgot-password", (req, res) => {
  try {
    const { user_email, user_num, new_password } = req.body;

    if (!user_email || !user_num || !new_password) {
      return res.status(400).json({ error: "Email, phone number, and new password are required" });
    }

    const user = db.prepare("SELECT id_user FROM users WHERE user_email = ? AND user_num = ?")
                   .get(user_email, user_num);

    if (!user) {
      return res.status(404).json({ error: "No user found with the provided email and phone number" });
    }

    const hashedNewPassword = bcrypt.hashSync(new_password, 10);

    const result = db.prepare("UPDATE users SET password = ? WHERE id_user = ?")
                     .run(hashedNewPassword, user.id_user);

    if (result.changes === 0) {
      return res.status(500).json({ error: "Failed to reset password" });
    }

    res.json({ message: "Password reset successfully" });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Server error during password reset" });
  }
});

module.exports = router;