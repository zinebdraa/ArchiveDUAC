const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Login route (password only - single user system)
router.post("/login", (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    // Get the first (and only) user from database
    const user = db.prepare("SELECT * FROM users LIMIT 1").get();
    
    if (!user) {
      return res.status(401).json({ error: "No user found. Please set up the system first." });
    }

    // Check password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id_user, 
        username: user.user_name 
      }, 
      JWT_SECRET, 
      { expiresIn: "24h" }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Verify password for profile updates
router.post("/verify-password", authenticateToken, (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.userId;

    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    // Get user from database
    const user = db.prepare("SELECT password FROM users WHERE id_user = ?").get(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({ message: "Password verified successfully" });

  } catch (error) {
    console.error("Password verification error:", error);
    res.status(500).json({ error: "Server error during password verification" });
  }
});

// Update user profile (email or phone)
router.put("/profile", authenticateToken, (req, res) => {
  try {
    const { user_email, user_num, password } = req.body;
    const userId = req.user.userId;

    if (!password) {
      return res.status(400).json({ error: "Password required for profile updates" });
    }

    if (!user_email && !user_num) {
      return res.status(400).json({ error: "At least one field (email or phone) must be provided" });
    }

    // Verify password first
    const user = db.prepare("SELECT password FROM users WHERE id_user = ?").get(userId);
    const isValidPassword = bcrypt.compareSync(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (user_email) {
      updates.push("user_email = ?");
      values.push(user_email);
    }

    if (user_num) {
      updates.push("user_num = ?");
      values.push(user_num);
    }

    values.push(userId);

    const updateQuery = `UPDATE users SET ${updates.join(", ")} WHERE id_user = ?`;
    const result = db.prepare(updateQuery).run(...values);

    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return updated user data
    const updatedUser = db.prepare("SELECT id_user, user_name, user_email, user_num FROM users WHERE id_user = ?").get(userId);
    
    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Profile update error:", error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error during profile update" });
  }
});

// Logout route
router.post("/logout", authenticateToken, (req, res) => {
  try {
    // Since JWT tokens are stateless, we can't invalidate them server-side
    // The client should remove the token from storage
    // In a more complex system, you might maintain a blacklist of tokens
    
    res.json({
      message: "Logout successful. Please remove the token from client storage."
    });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Server error during logout" });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

module.exports = router;
module.exports.authenticateToken = authenticateToken;