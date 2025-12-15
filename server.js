const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

// 🔥 Serve static HTML / CSS / JS
app.use(express.static(path.join(__dirname)));

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Server is running");
});

/* ================= REGISTER ================= */
function register(event) {
  if (event) event.preventDefault(); // 🔥 STOP browser navigation

  console.log("REGISTER BUTTON CLICKED");

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  fetch("http://localhost:3000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role })
  })
    .then(res => res.json())
    .then(data => {
      console.log("SERVER RESPONSE:", data);
      if (data.success) {
        alert("Registration successful");
        window.location.href = "login.html";
      } else {
        alert("Registration failed");
      }
    })
    .catch(err => {
      console.error("FETCH ERROR:", err);
      alert("Server error");
    });
}


/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT role FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) return res.json({ success: false });

      if (result.length > 0) {
        res.json({ success: true, role: result[0].role });
      } else {
        res.json({ success: false });
      }
    }
  );
});

/* ================= EMPLOYEES ================= */
app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, result) => {
    if (err) return res.json([]);
    res.json(result);
  });
});

app.post("/employees", (req, res) => {
  const { name, department, designation, phone } = req.body;

  db.query(
    "INSERT INTO employees (name, department, designation, phone, user_id) VALUES (?, ?, ?, ?, 2)",
    [name, department, designation, phone],
    err => {
      if (err) return res.json({ success: false });
      res.json({ success: true });
    }
  );
});

app.delete("/employees/:id", (req, res) => {
  db.query(
    "DELETE FROM employees WHERE employee_id=?",
    [req.params.id],
    () => res.json({ success: true })
  );
});

/* ================= LEAVE ================= */
app.post("/leave", (req, res) => {
  const { employee_id, from_date, to_date, leave_type, reason } = req.body;

  db.query(
    "INSERT INTO leave_requests (employee_id, from_date, to_date, leave_type, reason, status) VALUES (?, ?, ?, ?, ?, 'Pending')",
    [employee_id, from_date, to_date, leave_type, reason],
    err => {
      if (err) return res.json({ success: false });
      res.json({ success: true });
    }
  );
});

app.get("/leave", (req, res) => {
  db.query("SELECT * FROM leave_requests", (err, result) => {
    if (err) return res.json([]);
    res.json(result);
  });
});

app.get("/leave/employee/:id", (req, res) => {
  db.query(
    "SELECT * FROM leave_requests WHERE employee_id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.json([]);
      res.json(result);
    }
  );
});

app.put("/leave/:id", (req, res) => {
  const { status } = req.body;

  db.query(
    "UPDATE leave_requests SET status=? WHERE leave_id=?",
    [status, req.params.id],
    () => res.json({ success: true })
  );
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("UNHANDLED ERROR:", err);
  res.status(500).send("Server error");
});

/* ================= START SERVER ================= */
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
