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
        if (data.role === "HR") {
          window.location.href = "hr.html";
        } else {
          window.location.href = "employee.html";
        }
      } else {
        alert("Invalid credentials");
      }
    });
}

/* ================= EMPLOYEE ================= */

// ADD employee (HR)
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
        loadEmployees(); // refresh table
      } else {
        alert("Failed to add employee");
      }
    });
}

// LOAD employees (HR dashboard)
function loadEmployees() {
  fetch("http://localhost:3000/employees")
    .then(res => res.json())
    .then(data => {
      const empTable = document.getElementById("empTable");
      if (!empTable) return;

      if (data.length === 0) {
        empTable.innerHTML =
          "<tr><td colspan='5'>No employees found</td></tr>";
        return;
      }

      empTable.innerHTML = "";

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
          </tr>
        `;
      });
    })
    .catch(err => console.error(err));
}

// DELETE employee
function deleteEmp(id) {
  fetch(`http://localhost:3000/employees/${id}`, { method: "DELETE" })
    .then(() => loadEmployees());
}

/* ================= LEAVE ================= */

function applyLeave() {
  fetch("http://localhost:3000/leave", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      employee_id: empId.value,
      from_date: from.value,
      to_date: to.value,
      leave_type: type.value,
      reason: reason.value
    })
  }).then(() => alert("Leave Applied"));
}

// LOAD leave requests (HR)
function loadLeaves() {
  fetch("http://localhost:3000/leave")
    .then(res => res.json())
    .then(data => {
      const leaveTable = document.getElementById("leaveTable");
      if (!leaveTable) return;

      leaveTable.innerHTML = "";

      data.forEach(l => {
        leaveTable.innerHTML += `
          <tr>
            <td>${l.leave_id}</td>
            <td>${l.employee_id}</td>
            <td>${l.from_date}</td>
            <td>${l.to_date}</td>
            <td>${l.status}</td>
            <td>
              <button onclick="updateLeave(${l.leave_id}, 'Approved')">Approve</button>
              <button onclick="updateLeave(${l.leave_id}, 'Rejected')">Reject</button>
            </td>
          </tr>
        `;
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

/* ================= AUTO LOAD ================= */
document.addEventListener("DOMContentLoaded", () => {
  loadEmployees();
  loadLeaves();
});
