const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "aabeethh",        // put your real password here
  database: "hr_system"
});

db.connect(err => {
  if (err) {
    console.error("DATABASE CONNECTION FAILED:", err);
  } else {
    console.log("Database Connected");
  }
});

module.exports = db;
