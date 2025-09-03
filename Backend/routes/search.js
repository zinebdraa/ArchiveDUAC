const express = require("express");
const db = require("../db");
const { authenticateToken } = require("./auth");

const router = express.Router();

// Global search across all entities
router.get("/", authenticateToken, (req, res) => {
  try {
    const { q, type, limit = 50 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchTerm = `%${q.trim()}%`;
    const results = {
      query: q,
      results: {
        services: [],
        bureaus: [],
        chemises: [],
        documents: []
      },
      total: 0
    };

    // Search services
    if (!type || type === 'service' || type === 'all') {
      const services = db.prepare(`
        SELECT id_service as id, 'service' as type, service_name as name, 
               service_place as place, sDescription as description, sCreatedDate as created_at
        FROM services 
        WHERE service_name LIKE ? OR service_place LIKE ? OR sDescription LIKE ?
        ORDER BY service_name
        LIMIT ?
      `).all(searchTerm, searchTerm, searchTerm, parseInt(limit));
      
      results.results.services = services;
      results.total += services.length;
    }

    // Search bureaus
    if (!type || type === 'bureau' || type === 'all') {
      const bureaus = db.prepare(`
        SELECT b.id_bureau as id, 'bureau' as type, b.bureau_name as name, 
               b.bureau_place as place, b.bDescription as description, b.bCreatedDate as created_at,
               s.service_name, s.id_service
        FROM bureaus b
        JOIN services s ON b.service_id = s.id_service
        WHERE b.bureau_name LIKE ? OR b.bureau_place LIKE ? OR b.bDescription LIKE ?
        ORDER BY b.bureau_name
        LIMIT ?
      `).all(searchTerm, searchTerm, searchTerm, parseInt(limit));
      
      results.results.bureaus = bureaus;
      results.total += bureaus.length;
    }

    // Search chemises
    if (!type || type === 'chemise' || type === 'all') {
      const chemises = db.prepare(`
        SELECT c.id_chemise as id, 'chemise' as type, c.chemise_name as name, 
               c.chemise_place as place, c.cDescription as description, c.cCreatedDate as created_at,
               b.bureau_name, b.id_bureau, s.service_name, s.id_service
        FROM chemises c
        JOIN bureaus b ON c.bureau_id = b.id_bureau
        JOIN services s ON b.service_id = s.id_service
        WHERE c.chemise_name LIKE ? OR c.chemise_place LIKE ? OR c.cDescription LIKE ?
        ORDER BY c.chemise_name
        LIMIT ?
      `).all(searchTerm, searchTerm, searchTerm, parseInt(limit));
      
      results.results.chemises = chemises;
      results.total += chemises.length;
    }

    // Search documents
    if (!type || type === 'document' || type === 'all') {
      const documents = db.prepare(`
        SELECT d.id_document as id, 'document' as type, d.document_titre as name, 
               d.file_type, d.file_size, d.created_at,
               c.chemise_name, c.id_chemise, 
               b.bureau_name, b.id_bureau, 
               s.service_name, s.id_service
        FROM documents d
        JOIN chemises c ON d.chemise_id = c.id_chemise
        JOIN bureaus b ON c.bureau_id = b.id_bureau
        JOIN services s ON b.service_id = s.id_service
        WHERE d.document_titre LIKE ?
        ORDER BY d.created_at DESC
        LIMIT ?
      `).all(searchTerm, parseInt(limit));
      
      results.results.documents = documents;
      results.total += documents.length;
    }

    res.json(results);

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to perform search" });
  }
});

// Advanced search with filters
router.post("/advanced", authenticateToken, (req, res) => {
  try {
    const { 
      query, 
      service_id, 
      bureau_id, 
      chemise_id, 
      file_types, 
      date_from, 
      date_to,
      entity_type 
    } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchTerm = `%${query.trim()}%`;
    let results = [];

    if (!entity_type || entity_type === 'document') {
      // Advanced document search with filters
      let documentQuery = `
        SELECT d.id_document as id, 'document' as type, d.document_titre as name, 
               d.file_type, d.file_size, d.created_at,
               c.chemise_name, c.id_chemise, 
               b.bureau_name, b.id_bureau, 
               s.service_name, s.id_service
        FROM documents d
        JOIN chemises c ON d.chemise_id = c.id_chemise
        JOIN bureaus b ON c.bureau_id = b.id_bureau
        JOIN services s ON b.service_id = s.id_service
        WHERE d.document_titre LIKE ?
      `;
      
      const queryParams = [searchTerm];

      // Add filters
      if (service_id) {
        documentQuery += " AND s.id_service = ?";
        queryParams.push(service_id);
      }

      if (bureau_id) {
        documentQuery += " AND b.id_bureau = ?";
        queryParams.push(bureau_id);
      }

      if (chemise_id) {
        documentQuery += " AND c.id_chemise = ?";
        queryParams.push(chemise_id);
      }

      if (file_types && file_types.length > 0) {
        const placeholders = file_types.map(() => '?').join(',');
        documentQuery += ` AND d.file_type IN (${placeholders})`;
        queryParams.push(...file_types);
      }

      if (date_from) {
        documentQuery += " AND d.created_at >= ?";
        queryParams.push(date_from);
      }

      if (date_to) {
        documentQuery += " AND d.created_at <= ?";
        queryParams.push(date_to);
      }

      documentQuery += " ORDER BY d.created_at DESC LIMIT 100";

      const documents = db.prepare(documentQuery).all(...queryParams);
      results = documents;
    }

    res.json({
      query,
      filters: {
        service_id,
        bureau_id,
        chemise_id,
        file_types,
        date_from,
        date_to,
        entity_type
      },
      results,
      total: results.length
    });

  } catch (error) {
    console.error("Advanced search error:", error);
    res.status(500).json({ error: "Failed to perform advanced search" });
  }
});

module.exports = router;