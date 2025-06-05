// auth.js
import { Router } from "express";
import session from "express-session";
import { session as _session } from "passport";
import { pool } from "../database";
import "dotenv/config";

const router = Router();

// Session middleware (used by Passport temporarily) This sets up sessions to remember users after they log in.

//Sign-up with email instead
router.post("/signup", async (req, res) => {
  const { user_name, email, passcode } = req.body;
  if (user_name || !email || !passcode) {
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
    await pool.query(
      "INSERT INTO users user_name, email, passcode) VALUES (?, ?, ?)",
      user_name,
      email,
      hashedpasscode
    );

    res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
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
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND provider = 'local'",
      [email]
    );
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

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
  }
});

// Protected route
router.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: "Missing token" });

  try {
    const decoded = jwt.verify(
      //This decodes and verifies the JWT:

      //Checks the token’s signature using your secret

      //Checks for token expiration (exp)

      authHeader.split(" ")[1], //This splits the string "Bearer <token>" into: ["Bearer", "<token>"] split(" ")[1] grabs the actual token part (<token>).
      process.env.JWT_SECRET
    );
    res.json({ msg: "Welcome!", user: decoded });
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
});

export default router;
