const express = require("express");
const multer = require("multer");
const db = require("../db");
const { authenticateToken } = require("./auth");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types (you can modify this list)
    const allowedTypes = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'xls', 'xlsx', 'ppt', 'pptx'];
    const ext = path.extname(file.originalname).toLowerCase().substring(1);
    
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type .${ext} is not allowed`));
    }
  }
});

// Get all documents
router.get("/", authenticateToken, (req, res) => {
  try {
    const documents = db.prepare(`
      SELECT d.*, c.chemise_name, b.bureau_name, s.service_name 
      FROM documents d 
      JOIN chemises c ON d.chemise_id = c.id_chemise 
      JOIN bureaus b ON c.bureau_id = b.id_bureau 
      JOIN services s ON b.service_id = s.id_service 
      ORDER BY d.created_at DESC
    `).all();
    
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// Get a single document by ID
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const document = db.prepare(`
      SELECT d.*, c.chemise_name, b.bureau_name, s.service_name 
      FROM documents d 
      JOIN chemises c ON d.chemise_id = c.id_chemise 
      JOIN bureaus b ON c.bureau_id = b.id_bureau 
      JOIN services s ON b.service_id = s.id_service 
      WHERE d.id_document = ?
    `).get(id);
    
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }
    
    res.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ error: "Failed to fetch document" });
  }
});

// Upload new document
router.post("/upload", authenticateToken, upload.single('document'), (req, res) => {
  try {
    const { document_titre, chemise_name, created_at } = req.body;
    const file = req.file;

    if (!document_titre || !chemise_name || !created_at) {
      // Delete uploaded file if validation fails
      if (file) {
        fs.unlinkSync(file.path);
      }
      return res.status(400).json({ 
        error: "Document title, chemise name, and date are required" 
      });
    }

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Find chemise by name to get the ID
    const chemise = db.prepare("SELECT * FROM chemises WHERE chemise_name = ?").get(chemise_name);
    if (!chemise) {
      // Delete uploaded file if chemise doesn't exist
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: "Chemise not found" });
    }
    
    // Insert document record
    const insertDocument = db.prepare(`
      INSERT INTO documents (document_titre, file_path, created_at, chemise_name)
      VALUES (?, ?, ?, ?)
    `);

    const result = insertDocument.run(
      document_titre,
      file.path.replace(path.join(__dirname, '..'), ''), // Store relative path
      created_at,
      chemise.id_chemise // Use the found chemise ID
    );

    // Get the created document with related info
    const newDocument = db.prepare(`
      SELECT d.*, c.chemise_name, b.bureau_name, s.service_name 
      FROM documents d 
      JOIN chemises c ON d.chemise_name = c.id_chemise 
      JOIN bureaus b ON c.bureau_id = b.id_bureau 
      JOIN services s ON b.id_service = s.id_service 
      WHERE d.id_document = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      message: "Document uploaded successfully",
      document: newDocument
    });

  } catch (error) {
    // Delete uploaded file if there's an error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (deleteError) {
        console.error("Error deleting file after upload error:", deleteError);
      }
    }

    console.error("Error uploading document:", error);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "File too large. Maximum size is 50MB" });
    }
    res.status(500).json({ error: "Failed to upload document" });
  }
});

// Update document (rename)
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { document_titre, chemise_id } = req.body;

    if (!document_titre && !chemise_id) {
      return res.status(400).json({ error: "At least document title or chemise ID must be provided for update" });
    }

    // If chemise_id is provided, check if chemise exists
    if (chemise_id) {
      const chemise = db.prepare("SELECT * FROM chemises WHERE id_chemise = ?").get(chemise_id);
      if (!chemise) {
        return res.status(400).json({ error: "Chemise not found" });
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (document_titre) {
      updates.push("document_titre = ?");
      values.push(document_titre);
    }

    if (chemise_id) {
      updates.push("chemise_id = ?");
      values.push(chemise_id);
    }

    values.push(id);

    const updateQuery = `UPDATE documents SET ${updates.join(", ")} WHERE id_document = ?`;
    const result = db.prepare(updateQuery).run(...values);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Get updated document with related info
    const updatedDocument = db.prepare(`
      SELECT d.*, c.chemise_name, b.bureau_name, s.service_name 
      FROM documents d 
      JOIN chemises c ON d.chemise_id = c.id_chemise 
      JOIN bureaus b ON c.bureau_id = b.id_bureau 
      JOIN services s ON b.service_id = s.id_service 
      WHERE d.id_document = ?
    `).get(id);

    res.json({
      message: "Document updated successfully",
      document: updatedDocument
    });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Failed to update document" });
  }
});

// Delete document
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    // Get document info before deletion
    const document = db.prepare(`
      SELECT d.*, c.chemise_name, b.bureau_name, s.service_name 
      FROM documents d 
      JOIN chemises c ON d.chemise_id = c.id_chemise 
      JOIN bureaus b ON c.bureau_id = b.id_bureau 
      JOIN services s ON b.service_id = s.id_service 
      WHERE d.id_document = ?
    `).get(id);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Delete physical file
    const filePath = path.join(__dirname, '..', document.file_path);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (fileError) {
        console.error(`Error deleting file ${filePath}:`, fileError);
      }
    }

    // Delete document record
    const result = db.prepare("DELETE FROM documents WHERE id_document = ?").run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({
      message: "Document deleted successfully",
      deletedDocument: document
    });

  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

// Download document
router.get("/:id/download", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    // Get document info
    const document = db.prepare("SELECT * FROM documents WHERE id_document = ?").get(id);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    const filePath = path.join(__dirname, '..', document.file_path);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on disk" });
    }

    // Set appropriate headers
    const fileName = `${document.document_titre}.${document.file_type}`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream file to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download file' });
      }
    });

  } catch (error) {
    console.error("Error downloading document:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to download document" });
    }
  }
});

// View document (serve for preview)
router.get("/:id/view", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    // Get document info
    const document = db.prepare("SELECT * FROM documents WHERE id_document = ?").get(id);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    const filePath = path.join(__dirname, '..', document.file_path);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on disk" });
    }

    // Set appropriate content type based on file type
    const mimeTypes = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'txt': 'text/plain',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    };

    const contentType = mimeTypes[document.file_type] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'inline');

    // Stream file to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to view file' });
      }
    });

  } catch (error) {
    console.error("Error viewing document:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to view document" });
    }
  }
});

module.exports = router;