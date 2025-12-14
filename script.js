function login() {
  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.role === "HR") location.href = "hr.html";
    else location.href = "employee.html";
  });
}

/* EMPLOYEE */
function addEmployee() {
  fetch("http://localhost:3000/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value,
      department: dept.value,
      designation: desg.value,
      phone: phone.value,
      user_id: userId.value
    })
  }).then(() => location.reload());
}

fetch("http://localhost:3000/employees")
  .then(res => res.json())
  .then(data => {
    if (!document.getElementById("empTable")) return;
    empTable.innerHTML = data.map(e =>
      `<tr>
        <td>${e.employee_id}</td>
        <td>${e.name}</td>
        <td>${e.department}</td>
        <td>${e.designation}</td>
        <td>${e.phone}</td>
        <td><button onclick="deleteEmp(${e.employee_id})">Delete</button></td>
      </tr>`
    ).join("");
  });

function deleteEmp(id) {
  fetch(`http://localhost:3000/employees/${id}`, { method: "DELETE" })
    .then(() => location.reload());
}

/* LEAVE */
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

fetch("http://localhost:3000/leave")
  .then(res => res.json())
  .then(data => {
    if (!document.getElementById("leaveTable")) return;
    leaveTable.innerHTML = data.map(l =>
      `<tr>
        <td>${l.leave_id}</td>
        <td>${l.employee_id}</td>
        <td>${l.from_date}</td>
        <td>${l.to_date}</td>
        <td>${l.status}</td>
        <td>
          <button onclick="updateLeave(${l.leave_id},'Approved')">Approve</button>
          <button onclick="updateLeave(${l.leave_id},'Rejected')">Reject</button>
        </td>
      </tr>`
    ).join("");
  });

function updateLeave(id, status) {
  fetch(`http://localhost:3000/leave/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  }).then(() => location.reload());
}
