const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Body-parser middleware to parse JSON data
app.use(bodyParser.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// MySQL Database connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,     // Clever Cloud MySQL host
  user: process.env.DB_USER,     // Clever Cloud MySQL user
  password: process.env.DB_PASSWORD, // Clever Cloud MySQL password
  database: process.env.DB_NAME, // Clever Cloud database name
  port: 3306
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// ✅ Route to fetch all recipes (MUST start with /api)
app.get('/api/recipes', (req, res) => {
  db.query('SELECT * FROM recipes', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }
    res.json(results);
  });
});

// ✅ Route to add a new recipe (MUST start with /api)
app.post('/api/add-recipe', (req, res) => {
  const { name, ingredients, cooking_time } = req.body;
  const query = 'INSERT INTO recipes (name, ingredients, cooking_time) VALUES (?, ?, ?)';

  db.query(query, [name, ingredients, cooking_time], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }
    res.json({ message: 'Recipe added successfully' });
  });
});

// Serve the index.html page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Export the app for Vercel
module.exports = app;
