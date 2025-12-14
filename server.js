const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* LOGIN */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.json({ message: "Invalid login" });
      }
    }
  );
});

/* EMPLOYEE CRUD */
app.post("/employees", (req, res) => {
  const { name, department, designation, phone, user_id } = req.body;

  db.query(
    "INSERT INTO employees (name,department,designation,phone,user_id) VALUES (?,?,?,?,?)",
    [name, department, designation, phone, user_id],
    () => res.json("Employee Added")
  );
});

app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, result) => {
    res.json(result);
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

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
