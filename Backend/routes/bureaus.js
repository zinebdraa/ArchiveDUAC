const express = require("express");
const db = require("../db");
const { authenticateToken } = require("./auth");

const router = express.Router();

// Get all bureaus
router.get("/", authenticateToken, (req, res) => {
  try {
    const bureaus = db.prepare(` 
      SELECT * FROM bureaus 
      ORDER BY bureau_name
    `).all();
    
    res.json(bureaus);
  } catch (error) {
    console.error("Error fetching bureaus:", error);
    res.status(500).json({ error: "Failed to fetch bureaus" });
  }
});

// Get a single bureau by ID
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const bureau = db.prepare(`
      SELECT b.*, s.service_name 
      FROM bureaus b 
      JOIN services s ON b.id_service = s.id_service 
      WHERE b.id_bureau = ?
    `).get(id);
    
    if (!bureau) {
      return res.status(404).json({ error: "Bureau not found" });
    }
    
    res.json(bureau);
  } catch (error) {
    console.error("Error fetching bureau:", error);
    res.status(500).json({ error: "Failed to fetch bureau" });
  }
});

// Create new bureau
router.post("/", authenticateToken, (req, res) => {
  try {
    const { bureau_name, bureau_place, bDescription, service_name, bCreatedDate } = req.body;
    
    if (!bureau_name || !bureau_place || !service_name || !bCreatedDate) {
      return res.status(400).json({ error: "Bureau name, place, date and service name are required" });
    }

    // // Validate the format 
    // const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    // if (!dateRegex.test(bCreatedDate)) {
    //   return res.status(400).json({
    //     error: "Date must be in DD-MM-YYYY format"
    //   })
    // }
    
    // Find service by name to get the ID
    const service = db.prepare("SELECT * FROM services WHERE service_name = ?").get(service_name);
    if (!service) {
      return res.status(400).json({ error: "Service not found" });
    }
    
    const insertBureau = db.prepare(`
      INSERT INTO bureaus (bureau_name, bureau_place, bDescription, service_id, bCreatedDate)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = insertBureau.run(bureau_name, bureau_place, bDescription || null, service.id_service, bCreatedDate);
        
    // Get the created bureau with service info
    const newBureau = db.prepare(`
      SELECT b.*, s.service_name 
      FROM bureaus b 
      JOIN services s ON b.service_id = s.id_service 
      WHERE b.id_bureau = ?
    `).get(result.lastInsertRowid);
        
    res.status(201).json({
      message: "Bureau created successfully",
      bureau: newBureau
    });
    
  } catch (error) {
    console.error("Error creating bureau:", error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: "Bureau name or place already exists" });
    }
    res.status(500).json({ error: "Failed to create bureau" });
  }
});

// Update bureau
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { bureau_name, bureau_place, bDescription, service_name } = req.body;

    if (!bureau_name && !bureau_place && bDescription === undefined && !service_name) {
      return res.status(400).json({ error: "At least one field must be provided for update" });
    }

    let service_id = null;

    // If service_name is provided, check if service exists and get its ID
    if (service_name) {
      const service = db.prepare("SELECT * FROM services WHERE service_name = ?").get(service_name);
      if (!service) {
        return res.status(400).json({ error: "Service not found" });
      }
      service_id = service.id_service;
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (bureau_name) {
      updates.push("bureau_name = ?");
      values.push(bureau_name);
    }

    if (bureau_place) {
      updates.push("bureau_place = ?");
      values.push(bureau_place);
    }

    if (bDescription !== undefined) {
      updates.push("bDescription = ?");
      values.push(bDescription);
    }

    if (service_id) {
      updates.push("service_id = ?");
      values.push(service_id);
    }

    values.push(id);

    const updateQuery = `UPDATE bureaus SET ${updates.join(", ")} WHERE id_bureau = ?`;
    const result = db.prepare(updateQuery).run(...values);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Bureau not found" });
    }

    // Get updated bureau with service info
    const updatedBureau = db.prepare(`
      SELECT b.*, s.service_name 
      FROM bureaus b 
      JOIN services s ON b.service_id = s.id_service 
      WHERE b.id_bureau = ?
    `).get(id);
    
    res.json({
      message: "Bureau updated successfully",
      bureau: updatedBureau
    });

  } catch (error) {
    console.error("Error updating bureau:", error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: "Bureau name or place already exists" });
    }
    res.status(500).json({ error: "Failed to update bureau" });
  }
});

// Delete bureau
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    // Get bureau info before deletion
    const bureau = db.prepare(`
      SELECT b.*, s.service_name 
      FROM bureaus b 
      JOIN services s ON b.id_service = s.id_service 
      WHERE b.id_bureau = ?
    `).get(id);
    
    if (!bureau) {
      return res.status(404).json({ error: "Bureau not found" });
    }

    // Delete bureau (cascade will handle related records)
    const result = db.prepare("DELETE FROM bureaus WHERE id_bureau = ?").run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Bureau not found" });
    }

    res.json({
      message: "Bureau deleted successfully",
      deletedBureau: bureau
    });

  } catch (error) {
    console.error("Error deleting bureau:", error);
    res.status(500).json({ error: "Failed to delete bureau" });
  }
});

// Get all chemises for a specific bureau
router.get("/:id/chemises", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if bureau exists and get bureau info
    const bureau = db.prepare(`
      SELECT b.*, s.service_name 
      FROM bureaus b 
      JOIN services s ON b.id_service = s.id_service 
      WHERE b.id_bureau = ?
    `).get(id);
    
    if (!bureau) {
      return res.status(404).json({ error: "Bureau not found" });
    }

    const chemises = db.prepare("SELECT * FROM chemises WHERE bureau_id = ? ORDER BY chemise_name").all(id);
    
    res.json({
      bureau: bureau,
      chemises: chemises
    });

  } catch (error) {
    console.error("Error fetching bureau chemises:", error);
    res.status(500).json({ error: "Failed to fetch bureau chemises" });
  }
});

module.exports = router;