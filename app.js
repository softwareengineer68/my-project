const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Set the port to the environment's PORT or fallback to 3000
const port = process.env.PORT || 3000;

// Body-parser middleware to parse JSON data
app.use(bodyParser.json());

// Serve static files (like index.html) from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Database connection setup (for Clever Cloud)
const db = mysql.createConnection({
  host: 'bpiq9wp3873wyibgxtcp-mysql.services.clever-cloud.com',
  user: 'urph6ydqlay2wokw',
  password: 'mpmHvc0QmIE56u5pMyJk',
  database: 'bpiq9wp3873wyibgxtcp',
  port: 3306
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.stack);
    return;
  }
  console.log('✅ Connected to the database');
});

// Route to fetch recipes from database
app.get('/recipes', (req, res) => {
  db.query('SELECT * FROM recipes', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Database error');
      return;
    }
    res.json(results); // Send the recipes as JSON response
  });
});

// Route to add a new recipe to the database
app.post('/add-recipe', (req, res) => {
  const { name, ingredients, cooking_time } = req.body;
  const query = 'INSERT INTO recipes (name, ingredients, cooking_time) VALUES (?, ?, ?)';
  
  db.query(query, [name, ingredients, cooking_time], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Database error');
      return;
    }
    res.send('Recipe added successfully');
  });
});

// Serve the index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
