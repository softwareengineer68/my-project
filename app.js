const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Body-parser middleware to parse JSON data
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (index.html)

// Database connection setup
const db = mysql.createConnection({
  host: 'localhost',   // Local MySQL server
  user: 'root',        // Default MySQL root user
  password: '',        // Empty password (if no password set)
  database: 'recipeDB' // Your database name
});


// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.stack);
    return;
  }
  console.log('Connected to the database');
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
