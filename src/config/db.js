const mysql = require("mysql2/promise");
require("dotenv").config();

// Database connection
const dbConPromise = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the database connection without table creation logic
dbConPromise
  .getConnection()
  .then((connection) => {
    console.log("DB connected");
    connection.release(); // Release the connection back to the pool
  })
  .catch((error) => {
    console.error("DB connection error:", error);
  });

module.exports = dbConPromise;
