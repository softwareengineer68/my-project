const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// MySQL Database Connection (Clever Cloud)
const db = mysql.createConnection({
  host: "bpiq9wp3873wyibgxtcp-mysql.services.clever-cloud.com",
  user: "urph6ydqlay2wokw",
  password: "mpmHvc0QmIE56u5pMyJk",
  database: "bpiq9wp3873wyibgxtcp",
  port: 3306,
  ssl: { rejectUnauthorized: false }, // SSL support (Clever Cloud requirement)
});

// Check Database Connection
db.connect((err) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database (Clever Cloud)");
  }
});

// ✅ **Insert Data into MySQL Table (POST API)**
app.post("/add-recipe", (req, res) => {
  console.log("Received Data:", req.body); // Debugging

  const { name, ingredients, cooking_time } = req.body;

  if (!name || !ingredients || !cooking_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO recipes (name, ingredients, cooking_time) VALUES (?, ?, ?)";
  const values = [name, ingredients, cooking_time];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ Insert Error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    console.log("✅ Recipe Inserted Successfully!", result);
    res.json({ message: "Recipe added successfully", id: result.insertId });
  });
});

// ✅ **Fetch All Recipes (GET API)**
app.get("/recipes", (req, res) => {
  db.query("SELECT * FROM recipes", (err, results) => {
    if (err) {
      console.error("❌ Fetch Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
