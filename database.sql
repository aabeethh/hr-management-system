CREATE DATABASE hr_system;
USE hr_system;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  password VARCHAR(50),
  role VARCHAR(20)
);

CREATE TABLE employees (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  department VARCHAR(50),
  designation VARCHAR(50),
  phone VARCHAR(15),
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE leave_requests (
  leave_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  from_date DATE,
  to_date DATE,
  leave_type VARCHAR(50),
  reason TEXT,
  status VARCHAR(20),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

INSERT INTO users (username,password,role)
VALUES
('hradmin','1234','HR'),
('emp1','1234','EMPLOYEE');
