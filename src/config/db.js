const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database successfully.");
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
