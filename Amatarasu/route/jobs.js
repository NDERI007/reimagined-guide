import express from "express";
import { pool } from "../database.js"; // assumed db connection

const router = express.Router();

// GET all jobs
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM job_tb");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// POST new job
router.post("/", async (req, res) => {
  const { title, company, location, job_status } = req.body;

  // Optional: Basic validation
  if (!title || !company || !location || !job_status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO job_tb (title, company, location, job_status) VALUES (?, ?, ?, ?)",
      [title, company, location, job_status]
    );

    const newJob = {
      id: result.insertId,
    };

    res.status(201).json(newJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding job" });
  }
});

export default router;
