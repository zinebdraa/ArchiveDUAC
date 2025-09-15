const express = require("express");
const db = require("../db");
const { authenticateToken } = require("./auth");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");

const router = express.Router();

// Get all chemises
router.get("/", authenticateToken, (req, res) => {
  try {
    const chemises = db.prepare(`
      SELECT c.*, b.bureau_name, s.service_name 
      FROM chemises c 
      JOIN bureaus b ON c.bureau_id = b.id_bureau 
      JOIN services s ON b.service_id = s.id_service 
      ORDER BY s.service_name, b.bureau_name, c.chemise_name
    `).all();
    
    res.json(chemises);
  } catch (error) {
    console.error("Error fetching chemises:", error);
    res.status(500).json({ error: "Failed to fetch chemises" });
  }
});

// Get a single chemise by ID
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const chemise = db.prepare(`
      SELECT c.*
      FROM chemises c 
      WHERE c.id_chemise = ?
    `).get(id);
    
    if (!chemise) {
      return res.status(404).json({ error: "Chemise not found" });
    }
    
    res.json(chemise);
  } catch (error) {
    console.error("Error fetching chemise:", error);
    res.status(500).json({ error: "Failed to fetch chemise" });
  }
});

// Create new chemise
router.post("/", authenticateToken, (req, res) => {
  try {
    const { chemise_name, chemise_place, cDescription, cCreatedDate, bureau_name } = req.body;

    if (!chemise_name || !chemise_place || !cCreatedDate || !bureau_name) {
      return res.status(400).json({
        error: "Chemise name, place, date and bureau name are required"
      });
    }

    // Find bureau by name to get the ID
    const bureau = db.prepare("SELECT * FROM bureaus WHERE bureau_name = ?").get(bureau_name);
    if (!bureau) {
      return res.status(400).json({ error: "Bureau not found" });
    }

    const insertChemise = db.prepare(`
      INSERT INTO chemises (chemise_name, chemise_place, cDescription, cCreatedDate, bureau_id)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insertChemise.run(
      chemise_name,
      chemise_place,
      cDescription || null,
      cCreatedDate,
      bureau.id_bureau
    );
   
    // Get the created chemise with bureau and service info
    const newChemise = db.prepare(`
      SELECT c.*, b.bureau_name
      FROM chemises c
      JOIN bureaus b ON c.bureau_id = b.id_bureau
      WHERE c.id_chemise = ?
    `).get(result.lastInsertRowid);
   
    res.status(201).json({
      message: "Chemise created successfully",
      chemise: newChemise
    });

  } catch (error) {
    console.error("Error creating chemise:", error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: "Chemise place already exists" });
    }
    res.status(500).json({ error: "Failed to create chemise" });
  }
});

// Update chemise
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { chemise_name, chemise_place, cDescription, cCreatedDate } = req.body;

    if (!chemise_name && !chemise_place && cDescription === undefined && !cCreatedDate) {
      return res.status(400).json({ error: "At least one field must be provided for update" });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (chemise_name) {
      updates.push("chemise_name = ?");
      values.push(chemise_name);
    }

    if (chemise_place) {
      updates.push("chemise_place = ?");
      values.push(chemise_place);
    }

    if (cDescription !== undefined) {
      updates.push("cDescription = ?");
      values.push(cDescription);
    }

    if (cCreatedDate !== undefined) {
      updates.push("cCreatedDate = ?");
      values.push(cCreatedDate);
    }

    // if (bureau_id) {
    //   updates.push("bureau_id = ?");
    //   values.push(bureau_id);
    // }

    values.push(id);

    const updateQuery = `UPDATE chemises SET ${updates.join(", ")} WHERE id_chemise = ?`;
    const result = db.prepare(updateQuery).run(...values);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Chemise not found" });
    }

    // Get updated chemise with bureau and service info
    const updatedChemise = db.prepare(`
      SELECT c.*
      FROM chemises c 
      WHERE c.id_chemise = ?
    `).get(id);
    
    res.json({
      message: "Chemise updated successfully",
      chemise: updatedChemise
    });

  } catch (error) {
    console.error("Error updating chemise:", error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: "Chemise place already exists" });
    }
    res.status(500).json({ error: "Failed to update chemise" });
  }
});

// Delete chemise
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    // Get chemise info before deletion
    const chemise = db.prepare(`
      SELECT c.*
      FROM chemises c 
      WHERE c.id_chemise = ?
    `).get(id);
    
    if (!chemise) {
      return res.status(404).json({ error: "Chemise not found" });
    }

    // Delete chemise (cascade will handle related records)
    const result = db.prepare("DELETE FROM chemises WHERE id_chemise = ?").run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Chemise not found" });
    }

    res.json({
      message: "Chemise deleted successfully",
      deletedChemise: chemise
    });

  } catch (error) {
    console.error("Error deleting chemise:", error);
    res.status(500).json({ error: "Failed to delete chemise" });
  }
});

// Get all documents for a specific chemise
router.get("/:id/documents", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if chemise exists and get chemise info
    const chemise = db.prepare(`
      SELECT c.*
      FROM chemises c 
      WHERE c.id_chemise = ?
    `).get(id);
    
    if (!chemise) {
      return res.status(404).json({ error: "Chemise not found" });
    }

    const documents = db.prepare("SELECT * FROM documents WHERE chemise_id = ? ORDER BY document_titre").all(id);
    
    res.json({
      chemise: chemise,
      documents: documents
    });

  } catch (error) {
    console.error("Error fetching chemise documents:", error);
    res.status(500).json({ error: "Failed to fetch chemise documents" });
  }
});

// Download chemise as a ZIP folder
router.get("/:id/download", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    // Get chemise info
    const chemise = db.prepare(`
      SELECT c.*
      FROM chemises c 
      WHERE c.id_chemise = ?
    `).get(id);

    if (!chemise) {
      return res.status(404).json({ error: "Chemise not found" });
    }

    // Get all documents in this chemise
    const documents = db.prepare("SELECT * FROM documents WHERE chemise_id = ?").all(id);

    if (documents.length === 0) {
      return res.status(404).json({ error: "No documents found in this chemise" });
    }

    // Create ZIP archive
    const archive = archiver("zip", { zlib: { level: 9 } });
    const zipName = `${chemise.chemise_name.replace(/[^a-z0-9_\-\.]/gi, "_")}_${Date.now()}.zip`;

    // Set response headers
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${zipName}"`);

    // Handle archive errors
    archive.on("error", (err) => {
      console.error("Archive error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to create archive" });
      }
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add each document (from DB BLOBs) to archive
    documents.forEach((doc) => {
      const safeName = `${doc.document_name.replace(/[^a-z0-9_\-\.]/gi, "_")}.${doc.document_type}`;
      archive.append(Buffer.from(doc.document_data), { name: safeName });
    });

    // Add chemise info as a text file
    const chemiseInfo = `Chemise: ${chemise.chemise_name}
Bureau: ${chemise.bureau_name}
Service: ${chemise.service_name}
Place: ${chemise.chemise_place}
Created: ${chemise.cCreatedDate}
Description: ${chemise.cDescription || "N/A"}

Documents (${documents.length}):
${documents
  .map(
    (doc, i) =>
      `${i + 1}. ${doc.document_name} (${doc.document_type}) - ${doc.dCreatedDate}`
  )
  .join("\n")}`;

    archive.append(chemiseInfo, { name: "chemise_info.txt" });

    // Finalize archive
    archive.finalize();
  } catch (error) {
    console.error("Error downloading chemise:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to download chemise" });
    }
  }
});

module.exports = router;

