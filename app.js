const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Body-parser middleware to parse JSON data
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (index.html)

// Database connection setup using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,     // Database host (from environment variable)
  user: process.env.DB_USER,     // Database user (from environment variable)
  password: process.env.DB_PASSWORD, // Database password (from environment variable)
  database: process.env.DB_NAME, // Database name (from environment variable)
  port: 3306,                   // Ensure correct port for your DB (default MySQL port)
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Route to fetch recipes from the database
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
