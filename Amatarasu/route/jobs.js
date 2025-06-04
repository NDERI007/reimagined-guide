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

//Search and filter

router.get("/", async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  //Pagination is the process of dividing a large dataset into smaller, more manageable chunks (called pages), typically for display in a UI.
  //Instead of loading 10,000 jobs at once, you load, say, 10 or 20 per page. This reduces:

  //Database query load

  //Network usage

  //Browser rendering time

  try {
    let query = `SELECT * FROM job_tb WHERE 1=1`;
    const values = [];

    // Add search condition (matches title, company, or location)
    if (search) {
      const like = `%${search.trim().toLowerCase()}%`;

      query += `
        AND (
          LOWER(title)              LIKE ?  OR
          LOWER(company)            LIKE ?  OR
          LOWER(TRIM(COALESCE(location,''))) COLLATE utf8mb4_general_ci LIKE ?
        )`;

      values.push(like, like, like);
    }

    const [jobs] = await pool.query(query, values);
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

export default router;
