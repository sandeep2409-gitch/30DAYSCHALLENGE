import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sqlite3Pkg from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const sqlite3 = sqlite3Pkg.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbPath = path.resolve(__dirname, 'realestate.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Helper function to query DB using Promises
const queryDb = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Routes
// Get all properties with optional filtering
app.get('/api/properties', async (req, res) => {
  try {
    const { minPrice, maxPrice, type, location, beds } = req.query;
    
    let sql = 'SELECT * FROM properties WHERE 1=1';
    const params = [];

    if (minPrice) {
      sql += ` AND price >= ?`;
      params.push(minPrice);
    }
    
    if (maxPrice) {
      sql += ` AND price <= ?`;
      params.push(maxPrice);
    }

    if (type) {
      sql += ` AND property_type = ?`;
      params.push(type);
    }

    if (location) {
      sql += ` AND location LIKE ?`;
      params.push(`%${location}%`);
    }

    if (beds) {
      sql += ` AND bedrooms >= ?`;
      params.push(beds);
    }

    sql += ' ORDER BY id DESC';

    const rows = await queryDb(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single property
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await queryDb('SELECT * FROM properties WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
