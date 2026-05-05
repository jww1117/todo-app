const express = require("express");
const app = express();

const { Pool } = require("pg");

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Create table on startup (safe to run multiple times)
pool.query(`
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
)
`);

// =======================
// ADD TASK (CREATE)
// =======================
app.post("/add", async (req, res) => {
  try {
    const { name } = req.body;

    await pool.query(
      "INSERT INTO tasks (name) VALUES ($1)",
      [name]
    );

    res.status(200).send("Task added");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding task");
  }
});

// =======================
// GET TASKS (READ)
// =======================
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching tasks");
  }
});

// =======================
// DELETE TASK
// =======================
app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);

    res.send("Task deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting task");
  }
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});