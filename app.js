
console.log("APP.JS LOADED - NEW FILE");
document.addEventListener("click", () => {
  console.log("CLICK DETECTED");
});

/* ================= LOGIN ================= */
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.href =
          data.role === "HR" ? "hr.html" : "employee.html";
      } else {
        alert("Invalid credentials");
      }
    });
}

/* ================= HR : EMPLOYEE ================= */

function addEmployee() {
  const name = document.getElementById("name").value;
  const dept = document.getElementById("dept").value;
  const desg = document.getElementById("desg").value;
  const phone = document.getElementById("phone").value;

  fetch("http://localhost:3000/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      department: dept,
      designation: desg,
      phone
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Employee added successfully");
        loadEmployees();
      } else {
        alert("Failed to add employee");
      }
    });
}

function loadEmployees() {
  fetch("http://localhost:3000/employees")
    .then(res => res.json())
    .then(data => {
      const empTable = document.getElementById("empTable");
      if (!empTable) return;

      empTable.innerHTML = "";

      if (data.length === 0) {
        empTable.innerHTML =
          "<tr><td colspan='6'>No employees found</td></tr>";
        return;
      }

      data.forEach(e => {
        empTable.innerHTML += `
          <tr>
            <td>${e.employee_id}</td>
            <td>${e.name}</td>
            <td>${e.department}</td>
            <td>${e.designation}</td>
            <td>${e.phone}</td>
            <td>
              <button onclick="deleteEmp(${e.employee_id})">Delete</button>
            </td>
          </tr>`;
      });
    });
}

function deleteEmp(id) {
  fetch(`http://localhost:3000/employees/${id}`, { method: "DELETE" })
    .then(() => loadEmployees());
}

/* ================= EMPLOYEE : APPLY LEAVE ================= */

function applyLeave() {
  const empId = document.getElementById("empId").value;
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const type = document.getElementById("type").value;
  const reason = document.getElementById("reason").value;

  if (!empId || !from || !to || !type || !reason) {
    alert("Please fill all fields");
    return;
  }

  fetch("http://localhost:3000/leave", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      employee_id: empId,
      from_date: from,
      to_date: to,
      leave_type: type,
      reason
    })
  })
    .then(() => {
      alert("Leave Applied Successfully");
      loadMyLeaves(); // refresh status
    });
}

/* ================= EMPLOYEE : VIEW LEAVE STATUS ================= */

function loadMyLeaves() {
  const empId = document.getElementById("empId").value;
  const table = document.getElementById("myLeaveTable");

  if (!empId) {
    alert("Please enter Employee ID");
    return;
  }

  fetch(`http://localhost:3000/leave/employee/${empId}`)
    .then(res => res.json())
    .then(data => {
      table.innerHTML = "";

      if (data.length === 0) {
        table.innerHTML =
          "<tr><td colspan='5'>No leave records found</td></tr>";
        return;
      }

      data.forEach(l => {
        table.innerHTML += `
          <tr>
            <td>${l.leave_id}</td>
            <td>${new Date(l.from_date).toLocaleDateString()}</td>
            <td>${new Date(l.to_date).toLocaleDateString()}</td>
            <td>${l.leave_type}</td>
            <td>${l.status}</td>
          </tr>`;
      });
    });
}

/* ================= HR : VIEW & APPROVE LEAVE ================= */

function loadLeaves() {
  fetch("http://localhost:3000/leave")
    .then(res => res.json())
    .then(data => {
      const leaveTable = document.getElementById("leaveTable");
      if (!leaveTable) return;

      leaveTable.innerHTML = "";

      if (data.length === 0) {
        leaveTable.innerHTML =
          "<tr><td colspan='6'>No leave requests</td></tr>";
        return;
      }

      data.forEach(l => {
        leaveTable.innerHTML += `
          <tr>
            <td>${l.leave_id}</td>
            <td>${l.employee_id}</td>
            <td>${new Date(l.from_date).toLocaleDateString()}</td>
            <td>${new Date(l.to_date).toLocaleDateString()}</td>
            <td>${l.status}</td>
            <td>
              <button onclick="updateLeave(${l.leave_id}, 'Approved')">Approve</button>
              <button onclick="updateLeave(${l.leave_id}, 'Rejected')">Reject</button>
            </td>
          </tr>`;
      });
    });
}

function updateLeave(id, status) {
  fetch(`http://localhost:3000/leave/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  }).then(() => loadLeaves());
}

/* ================= REGISTER ================= */

function register() {
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
      alert("Server not reachable");
    });
}

