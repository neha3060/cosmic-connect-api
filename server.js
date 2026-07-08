// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initDB = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let db;

app.post('/api/bookings', async (req, res) => {
  const { name, email, reading, date, time, message } = req.body || {};

  if (!name || !email || !reading || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await db.execute({
      sql: `INSERT INTO bookings (name, email, reading, date, time, message)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [name, email, reading, date, time, message || null]
    });
    res.status(201).json({ id: Number(result.lastInsertRowid), success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save booking' });
  }
});

app.get('/api/bookings', async (req, res) => {
  const result = await db.execute('SELECT * FROM bookings ORDER BY created_at DESC');
  res.json(result.rows);
});

app.get('/api/bookings', async (req, res) => {
  const bookings = await db.all('SELECT * FROM bookings ORDER BY created_at DESC');
  res.json(bookings);
});

const PORT = 3000;
initDB().then((database) => {
  db = database;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});

