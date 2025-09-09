const express = require("express");
const db = require("../db");
const { authenticateToken } = require("./auth");

const router = express.Router();

// Get all services
router.get("/", authenticateToken, (req, res) => {
  try {
    const services = db.prepare("SELECT * FROM services ORDER BY service_name").all();
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

// Get a single service by ID  
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const service = db.prepare("SELECT * FROM services WHERE id_service = ?").get(id);
    
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    
    res.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ error: "Failed to fetch service" });
  }
}); 

// Create new service
router.post("/", authenticateToken, (req, res) => {
  try {
    const { service_name, service_place, sDescription, sCreatedDate } = req.body;

    if (!service_name || !service_place || !sCreatedDate) {
      return res.status(400).json({ error: "Service name, place and creation date are required" });
    }

    const insertService = db.prepare(`
      INSERT INTO services (service_name, service_place, sDescription, sCreatedDate)
      VALUES (?, ?, ?, ?)
    `);

    const result = insertService.run(service_name, service_place, sDescription || null, sCreatedDate);
    
    // Get the created service
    const newService = db.prepare("SELECT * FROM services WHERE id_service = ?").get(result.lastInsertRowid);
    
    res.status(201).json({
      message: "Service created successfully",
      service: newService
    });

  } catch (error) {
    console.error("Error creating service:", error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: "Service name or place already exists" });
    }
    res.status(500).json({ error: "Failed to create service" });
  }
});

// Update service 
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { service_name, service_place, sDescription, sCreatedDate } = req.body;

    if (!service_name && !service_place && sDescription && sCreatedDate === undefined) {
      return res.status(400).json({ error: "At least one field must be provided for update" });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (service_name) {
      updates.push("service_name = ?");
      values.push(service_name);
    }

    if (service_place) {
      updates.push("service_place = ?");
      values.push(service_place);
    }

    if (sDescription !== undefined) {
      updates.push("sDescription = ?");
      values.push(sDescription);
    }

    if (sCreatedDate !== undefined) {
      updates.push("sCreatedDate = ?");
      values.push(sCreatedDate);
    }

    values.push(id);

    const updateQuery = `UPDATE services SET ${updates.join(", ")} WHERE id_service = ?`;
    const result = db.prepare(updateQuery).run(...values);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Get updated service
    const updatedService = db.prepare("SELECT * FROM services WHERE id_service = ?").get(id);
    
    res.json({
      message: "Service updated successfully",
      service: updatedService
    });

  } catch (error) {
    console.error("Error updating service:", error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: "Service name or place already exists" });
    }
    res.status(500).json({ error: "Failed to update service" });
  }
});

// Delete service
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    // Check if service exists
    const service = db.prepare("SELECT * FROM services WHERE id_service = ?").get(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Delete service (cascade will handle related records)
    const result = db.prepare("DELETE FROM services WHERE id_service = ?").run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json({
      message: "Service deleted successfully",
      deletedService: service
    });

  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

// Get all bureaus for a specific service
router.get("/:id/bureaus", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if service exists
    const service = db.prepare("SELECT * FROM services WHERE id_service = ?").get(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    const bureaus = db.prepare("SELECT * FROM bureaus WHERE service_id = ? ORDER BY bureau_name").all(id);
    
    res.json({
      service: service,
      bureaus: bureaus
    });

  } catch (error) {
    console.error("Error fetching service bureaus:", error);
    res.status(500).json({ error: "Failed to fetch service bureaus" });
  }
});

module.exports = router;