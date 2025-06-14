import express from "express";
import { pool } from "../database.js"; // assumed pool connection

const router = express.Router();

// GET all jobs
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM job_tb"); //Here, pool.query() returns an array (often [rows, fields]), and we destructure to get just the rows.

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

//Update job
router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { job_status } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid Job ID" });
  }
  if (!job_status) {
    return res.status(400).json({ error: "job_status is required" });
  }

  try {
    // Check if job exists
    const [rows] = await pool.execute("SELECT * FROM job_tb WHERE job_id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Update job_status
    await pool.execute("UPDATE job_tb SET job_status = ? WHERE job_id = ?", [
      job_status,
      id,
    ]);

    // Get updated job
    const [updatedRows] = await pool.execute(
      "SELECT * FROM job_tb WHERE job_id = ?",
      [id]
    );

    res.json({ message: "Job status updated", job: updatedRows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update job status" });
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
      //array destruc
      "INSERT INTO job_tb (title, company, location, job_status) VALUES (?, ?, ?, ?)",
      [title, company, location, job_status]
    );

    const [rows] = await pool.query("SELECT * FROM job_tb where job_id = ?", [
      result.insertId, //This is where the problem was
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding job" });
  }
});

//Search and filter

router.get("/", async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query; //Obj destruc It extracts values from the req.query object (or any object), and if those values are undefined, it assigns the defaults ("", 1, and 10).
  const offset = (Number(page) - 1) * Number(limit);
  //Pagination is the process of dividing a large dataset into smaller, more manageable chunks (called pages), typically for display in a UI.
  //Instead of loading 10,000 jobs at once, you load, say, 10 or 20 per page. This reduces:

  //Database query load

  //Network usage

  //Browser rendering time

  try {
    let query = `SELECT * FROM job_tb WHERE 1=1`; //The condition WHERE 1=1 is always true, meaning that it doesn’t filter anything yet, but it provides a base condition to which additional conditions can be added.
    const values = []; //An empty array is initialized to hold the values that will be inserted into the query’s placeholders (?).

    // Add search condition (matches title, company, or location)
    if (search) {
      const like = `%${search.trim().toLowerCase()}%`; //The % symbols are added to make it a "like" search (similar to SQL's LIKE operator), which means the search term can appear anywhere in the column value.
      //The ? is a placeholder, and mysql2 will safely escape and quote the value — that’s basic sanitization and guards against SQL injection.
      //when you use the ? placeholder with mysql2, everything in the user input — even dangerous-looking SQL like '; DROP TABLE users; -- — is treated as a single safe string value, not as SQL code.

      query += `
        AND (
          LOWER(title)              LIKE ?  OR 
          LOWER(company)            LIKE ?  OR
          LOWER(TRIM(COALESCE(location,''))) COLLATE utf8mb4_general_ci LIKE ?
        )`;

      values.push(like, like, like);
    }
    query += ` LIMIT ? OFFSET ?`; //LIMIT n → Tells the database to return only n rows.

    //OFFSET m → Tells the database to skip the first m rows before starting to return results.

    values.push(limit, offset);

    const [jobs] = await pool.query(query, values);
    //.query() is a method that sends a SQL command to the database.

    //query is just a SQL statement string that defines what operation you want to perform on the database.

    //values is an array of values to replace placeholders (?) in the SQL string safely (to prevent SQL injection).
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

export default router;
