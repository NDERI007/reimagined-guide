// auth.js
import { Router } from "express";
import { pool } from "../database.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = Router();

// Session middleware (used by Passport temporarily) This sets up sessions to remember users after they log in.

//Sign-up with email instead
router.post("/signup", async (req, res) => {
  console.log("Signup route hit");
  const { user_name, email, passcode } = req.body;
  if (!user_name || !email || !passcode) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedpasscode = await bcrypt.hash(passcode, 10);
    const [newUser] = await pool.query(
      "INSERT INTO users (user_name, email, passcode) VALUES (?, ?, ?)",
      [user_name, email, hashedpasscode]
    );

    const token = jwt.sign(
      { id: newUser.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );
    res.status(201).json({ msg: "User created successfully", token });
  } catch (err) {
    console.error("Error occurred during signup:");
    console.error("Request body:", req.body);
    console.error("Error details:", err);
    res.status(500).json({ msg: "Server error", error: err });
  }
});

// Login (local)
router.post("/login", async (req, res) => {
  const { email, passcode } = req.body;
  if (!email || !passcode) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(passcode, user.passcode);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      msg: "Login successful",
      user: { id: user.id, email: user.email, token },
    }); // No token
  } catch (err) {
    console.error("Error occurred during signup:");
    console.error("Request body:", req.body);
    console.error("Error details:", err);
    res.status(500).json({ msg: "Server error", error: err });
  }
});

export default router;
