import mysql2 from "mysql2";
import "dotenv/config";

export const pool = mysql2
  .createPool({
    host: process.env.JOBdb_Host,
    user: process.env.JOBdb_User,
    password: process.env.JOBdb_Password,
    database: "jobdb",
  })
  .promise(); //callback-based API
