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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
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
      SELECT d.id_document, d.document_name, d.document_place, d.dCreatedDate, d.dDescription, d.document_type,
             c.chemise_name, b.bureau_name, s.service_name
      FROM documents d
      JOIN chemises c ON d.chemise_id = c.id_chemise
      JOIN bureaus b ON c.bureau_id = b.id_bureau
      JOIN services s ON b.service_id = s.id_service
      ORDER BY d.dCreatedDate DESC
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
      SELECT d.*
      FROM documents d 
      WHERE d.id_document = ?
    `).get(id);
    
    if (!document) {
      return res.status(404).json({ error: "document not found" });
    }
    
    res.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ error: "Failed to fetch document" });
  }
});

// Upload new document
router.post("/upload", authenticateToken, upload.single('document'), async (req, res) => {
  try {
    const { document_name, document_place, dCreatedDate, dDescription, chemise_name } = req.body;
    const file = req.file;

    if (!document_name || !document_place || !chemise_name || !dCreatedDate) {
      if (file) fs.unlinkSync(file.path);
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const createdDate = new Date(dCreatedDate);
    if (isNaN(createdDate.getTime())) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: "Invalid date format" });
    }

    const chemise = db.prepare("SELECT id_chemise FROM chemises WHERE chemise_name = ?").get(chemise_name);
    if (!chemise) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: `Chemise '${chemise_name}' not found` });
    }

    const fileExtension = path.extname(file.originalname).substring(1).toLowerCase();

    const insert = db.prepare(`
      INSERT INTO documents (
        document_name, document_place, dCreatedDate, dDescription,
        chemise_id, document_type, document_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      document_name,
      document_place,
      dCreatedDate,
      dDescription,
      chemise.id_chemise,
      fileExtension,
      fs.readFileSync(file.path)
    );

    fs.unlinkSync(file.path); // delete temp file

    const newDoc = db.prepare(`
      SELECT d.id_document, d.document_name, d.document_place, d.dCreatedDate, d.dDescription, d.document_type,
             c.chemise_name, b.bureau_name, s.service_name
      FROM documents d
      JOIN chemises c ON d.chemise_id = c.id_chemise
      JOIN bureaus b ON c.bureau_id = b.id_bureau
      JOIN services s ON b.service_id = s.id_service
      WHERE d.id_document = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({ success: true, document: newDoc });

  } catch (error) {
    console.error("Error uploading document:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "Failed to upload document" });
  }
});

// Update document
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { document_name, chemise_id } = req.body;

    if (!document_name && !chemise_id) {
      return res.status(400).json({ error: "Provide at least document_name or chemise_id" });
    }

    if (chemise_id) {
      const chemise = db.prepare("SELECT * FROM chemises WHERE id_chemise = ?").get(chemise_id);
      if (!chemise) return res.status(400).json({ error: "Chemise not found" });
    }

    const updates = [];
    const values = [];

    if (document_name) {
      updates.push("document_name = ?");
      values.push(document_name);
    }
    if (chemise_id) {
      updates.push("chemise_id = ?");
      values.push(chemise_id);
    }
    values.push(id);

    const updateQuery = `UPDATE documents SET ${updates.join(", ")} WHERE id_document = ?`;
    const result = db.prepare(updateQuery).run(...values);

    if (result.changes === 0) return res.status(404).json({ error: "Document not found" });

    const updated = db.prepare(`
      SELECT d.id_document, d.document_name, d.document_place, d.dCreatedDate, d.dDescription, d.document_type,
             c.chemise_name, b.bureau_name, s.service_name
      FROM documents d
      JOIN chemises c ON d.chemise_id = c.id_chemise
      JOIN bureaus b ON c.bureau_id = b.id_bureau
      JOIN services s ON b.service_id = s.id_service
      WHERE d.id_document = ?
    `).get(id);

    res.json({ message: "Document updated successfully", document: updated });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Failed to update document" });
  }
});

// Delete document
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const doc = db.prepare("SELECT * FROM documents WHERE id_document = ?").get(id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    db.prepare("DELETE FROM documents WHERE id_document = ?").run(id);
    res.json({ message: "Document deleted successfully", deletedDocument: doc });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

// Download document
router.get("/:id/download", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const doc = db.prepare("SELECT * FROM documents WHERE id_document = ?").get(id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    const mimeTypes = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      txt: "text/plain",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    };

    res.setHeader("Content-Disposition", `attachment; filename="${doc.document_name}.${doc.document_type}"`);
    res.setHeader("Content-Type", mimeTypes[doc.document_type] || "application/octet-stream");

    res.send(doc.document_data);
    console.log(`Document [${doc.document_name}] is being downloaded...`);
  } catch (error) {
    console.error("Error downloading document:", error);
    res.status(500).json({ error: "Failed to download document" });
  }
});

// View document inline
router.get("/:id/view", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const doc = db.prepare("SELECT * FROM documents WHERE id_document = ?").get(id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    const mimeTypes = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      txt: "text/plain",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    };

    res.setHeader("Content-Type", mimeTypes[doc.document_type] || "application/octet-stream");
    res.setHeader("Content-Disposition", `inline; filename="${doc.document_name}.${doc.document_type}"`);

    res.send(doc.document_data);
    console.log(`Document [${doc.document_name}] is being viewed inline...`);
  } catch (error) {
    console.error("Error viewing document:", error);
    res.status(500).json({ error: "Failed to view document" });
  }
});

module.exports = router;