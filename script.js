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
      reason: reason
    })
  })
    .then(() => {
      alert("Leave Applied Successfully");
      loadMyLeaves(); // 🔥 auto-refresh status after apply
    })
    .catch(err => console.error(err));
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
          </tr>
        `;
      });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load leave status");
    });
}
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
          </tr>
        `;
      });
    })
    .catch(err => console.error(err));
}
/* ================= LEAVE (HR) ================= */

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
          </tr>
        `;
      });
    })
    .catch(err => console.error("Load leaves error:", err));
}

function updateLeave(id, status) {
  fetch(`http://localhost:3000/leave/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  })
    .then(res => res.json())
    .then(() => {
      alert(`Leave ${status}`);
      loadLeaves(); // 🔥 refresh table
    })
    .catch(err => console.error("Update leave error:", err));
}


document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("empTable")) {
    loadEmployees();
  }
  if (document.getElementById("leaveTable")) {
    loadLeaves();
  }
});

