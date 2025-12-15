const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* LOGIN */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT role FROM users WHERE username=? AND password=?";
  db.query(sql, [username, password], (err, result) => {
    if (err) return res.json({ success: false });

    if (result.length > 0) {
      res.json({
        success: true,
        role: result[0].role
      });
    } else {
      res.json({ success: false });
    }
  });
});

/* EMPLOYEE CRUD */
app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, result) => {
    if (err) {
      console.error(err);
      return res.json([]);
    }
    res.json(result);
  });
});

app.post("/employees", (req, res) => {
  const { name, department, designation, phone } = req.body;

  const sql = `
    INSERT INTO employees (name, department, designation, phone, user_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, department, designation, phone, 2], (err) => {
    if (err) {
      console.error("Insert error:", err);
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});


app.delete("/employees/:id", (req, res) => {
  db.query(
    "DELETE FROM employees WHERE employee_id=?",
    [req.params.id],
    () => res.json("Employee Deleted")
  );
});

/* LEAVE MANAGEMENT */
app.post("/leave", (req, res) => {
  const { employee_id, from_date, to_date, leave_type, reason } = req.body;

  db.query(
    "INSERT INTO leave_requests VALUES (NULL,?,?,?,?,?,'Pending')",
    [employee_id, from_date, to_date, leave_type, reason],
    () => res.json("Leave Submitted")
  );
});

app.get("/leave", (req, res) => {
  db.query("SELECT * FROM leave_requests", (err, result) => {
    res.json(result);
  });
});

app.put("/leave/:id", (req, res) => {
  const { status } = req.body;

  db.query(
    "UPDATE leave_requests SET status=? WHERE leave_id=?",
    [status, req.params.id],
    () => res.json("Leave Updated")
  );
});
// GET all employees (HR dashboard)
app.get("/employees", (req, res) => {
  const sql = "SELECT * FROM employees";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Fetch employees error:", err);
      return res.status(500).json([]);
    }
    res.json(result);
  });
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
