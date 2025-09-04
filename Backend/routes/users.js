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

// // Step 1: Verify email and phone
// router.post("/forgot-password/verify", (req, res) => {
//   try {
//     const { user_email, user_num } = req.body;

//     if (!user_email || !user_num) {
//       return res.status(400).json({ error: "Email and phone number are required" });
//     }

//     // Check user exists
//     const user = db.prepare(
//       "SELECT id_user, user_email, user_num FROM users WHERE user_email = ? AND user_num = ?"
//     ).get(user_email.toLowerCase().trim(), user_num.trim());

//     if (!user) {
//       return res.status(404).json({ error: "Invalid email or phone number" });
//     }

//     // ✅ If found, return success
//     res.json({
//       message: "Verification successful, proceed to reset password",
//       userId: user.id_user // you can return id_user so frontend can use it
//     });

//   } catch (error) {
//     console.error("Verification error:", error);
//     res.status(500).json({ error: "Server error during verification" });
//   }
// });

// // Step 2: Reset password
// router.put("/forgot-password/reset", (req, res) => {
//   try {
//     const {userId} = req.params;
//     const { new_password } = req.body;

//     if (!new_password) {
//       return res.status(400).json({ error: "User ID and new password are required" });
//     }

//     // Hash new password
//     const hashedNewPassword = bcrypt.hashSync(new_password, 10);

//     // Update password
//     const result = db.prepare("UPDATE users SET password = ? WHERE id_user = ?")
//                      .run(hashedNewPassword, userId);

//     if (result.changes === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json({ message: "Password reset successfully" });

//   } catch (error) {
//     console.error("Password reset error:", error);
//     res.status(500).json({ error: "Server error during password reset" });
//   }
// });

// Forgot password (reset via email + phone number)
router.put("/forgot-password", (req, res) => {
  try {
    const { user_email, user_num, new_password } = req.body;

    // if (!user_email || !user_num || !new_password) {
    //   return res.status(400).json({ error: "Email, phone number, and new password are required" });
    // }

    // 1. Find user by email + phone
    const user = db.prepare("SELECT id_user FROM users WHERE user_email = ? AND user_num = ?")
                   .get(user_email, user_num);

    if (!user) {
      return res.status(404).json({ error: "No user found with the provided email and phone number" });
    }

    // 2. Hash the new password
    const hashedNewPassword = bcrypt.hashSync(new_password, 10);

    // 3. Update password
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