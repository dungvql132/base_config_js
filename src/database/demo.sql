DO $$
DECLARE
    tableName text;
BEGIN
    FOR tableName IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE "' || tableName || '" CASCADE;';
    END LOOP;
END $$;

DROP TABLE IF EXISTS groups_users;
DROP TABLE IF EXISTS groups_rules;
DROP TABLE IF EXISTS rules;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS offices;

-- tạo bảng office
CREATE TABLE offices (
  officeCode VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- tạo bảng employees
CREATE TABLE employees (
  employeeNumber SERIAL PRIMARY KEY,
  lastName VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  extension VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  officeCode VARCHAR(255),
  reportTo INT,
  jobTitle VARCHAR(255) NOT NULL,
  FOREIGN KEY (reportTo) REFERENCES employees(employeeNumber) ON DELETE CASCADE,
  FOREIGN KEY (officeCode) REFERENCES offices(officeCode) ON DELETE CASCADE
);

-- tạo bảng customers
CREATE TABLE customers (
  customerNumber SERIAL PRIMARY KEY,
  customerName VARCHAR(255) NOT NULL,
  contactFirstName VARCHAR(255) NOT NULL,
  contactLastName VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  addressLine1 VARCHAR(255) NOT NULL,
  addressLine2 VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  postalCode VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  salesRepEmployeeNumber INT,
  creditLimit VARCHAR(255) NOT NULL,
  FOREIGN KEY (salesRepEmployeeNumber) REFERENCES employees(employeeNumber) ON DELETE CASCADE
);

CREATE TABLE users(
  userName VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255),
  employeeNumber INT,
  FOREIGN KEY (employeeNumber) REFERENCES employees(employeeNumber) ON DELETE CASCADE
);

CREATE TABLE groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE rules (
  id SERIAL PRIMARY KEY,
  rule VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  tableName VARCHAR(255) NOT NULL
);

CREATE TABLE groups_rules (
  group_id INT REFERENCES groups(id) ON DELETE CASCADE,
  rule_id INT REFERENCES rules(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, rule_id)
);

CREATE TABLE groups_users (
  userName_key VARCHAR(255),
  group_id INT,
  PRIMARY KEY (group_id, userName_key),
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (userName_key) REFERENCES users(userName) ON DELETE CASCADE
);

-- demo data -----------------------

INSERT INTO employees (lastName, firstName, extension, email, reportTo, jobTitle) VALUES
  ('Doe', 'John', 'x123', 'john.doe@example.com', NULL, 'CEO'),
  ('Smith', 'Jane', 'x456', 'jane.smith@example.com', 1, 'CFO'),
  ('Johnson', 'Robert', 'x789', 'robert.johnson@example.com', 1, 'CTO'),
  ('Williams', 'Michael', 'x234', 'michael.williams@example.com', 2, 'HR Manager'),
  ('Brown', 'Jennifer', 'x567', 'jennifer.brown@example.com', 2, 'Marketing Manager'),
  ('Jones', 'David', 'x890', 'david.jones@example.com', 3, 'Software Engineer'),
  ('Taylor', 'Sarah', 'x345', 'sarah.taylor@example.com', 4, 'HR Assistant'),
  ('Davis', 'Christopher', 'x678', 'christopher.davis@example.com', 4, 'Marketing Assistant'),
  ('Miller', 'Jessica', 'x901', 'jessica.miller@example.com', 3, 'Junior Software Engineer'),
  ('Wilson', 'Matthew', 'x123', 'matthew.wilson@example.com', 2, 'Senior Manager');

INSERT INTO customers (customerName, contactFirstName, contactLastName, phone, addressLine1, addressLine2, city, state, postalCode, country, salesRepEmployeeNumber, creditLimit)
VALUES
  ('Customer 1', 'John', 'Doe', '123456789', 'Address 1', 'Address 2', 'City 1', 'State 1', '12345', 'Country 1', 1, '1000'),
  ('Customer 2', 'Jane', 'Smith', '987654321', 'Address 3', 'Address 4', 'City 2', 'State 2', '67890', 'Country 2', 2, '2000'),
  ('Customer 3', 'David', 'Johnson', '555555555', 'Address 5', 'Address 6', 'City 3', 'State 3', '24680', 'Country 3', 3, '1500'),
  ('Customer 4', 'Sarah', 'Williams', '111111111', 'Address 7', 'Address 8', 'City 4', 'State 4', '13579', 'Country 4', 4, '1800'),
  ('Customer 5', 'Michael', 'Brown', '999999999', 'Address 9', 'Address 10', 'City 5', 'State 5', '97531', 'Country 5', 5, '2500'),
  ('Customer 6', 'Emily', 'Taylor', '444444444', 'Address 11', 'Address 12', 'City 6', 'State 6', '86420', 'Country 6', 6, '1200'),
  ('Customer 7', 'Daniel', 'Anderson', '777777777', 'Address 13', 'Address 14', 'City 7', 'State 7', '75319', 'Country 7', 7, '900'),
  ('Customer 8', 'Olivia', 'Miller', '222222222', 'Address 15', 'Address 16', 'City 8', 'State 8', '64280', 'Country 8', 8, '3000'),
  ('Customer 9', 'James', 'Wilson', '888888888', 'Address 17', 'Address 18', 'City 9', 'State 9', '53197', 'Country 9', 9, '1700'),
  ('Customer 10', 'Sophia', 'Davis', '333333333', 'Address 19', 'Address 20', 'City 10', 'State 10', '42086', 'Country 10', 10, '2200');

INSERT INTO users (userName, password, employeeNumber)
VALUES
  ('user1', '$2b$10$mBXn6sufJBwdqSyXZEA4w.oANXH1L6v2rTHq.Fgm.c0OKksgT9xXi', 1),
  ('user2', '$2b$10$mBXn6sufJBwdqSyXZEA4w.oANXH1L6v2rTHq.Fgm.c0OKksgT9xXi', 2),
  ('user3', '$2b$10$mBXn6sufJBwdqSyXZEA4w.oANXH1L6v2rTHq.Fgm.c0OKksgT9xXi', 3),
  ('user4', '$2b$10$mBXn6sufJBwdqSyXZEA4w.oANXH1L6v2rTHq.Fgm.c0OKksgT9xXi', 4),
  ('user5', '$2b$10$mBXn6sufJBwdqSyXZEA4w.oANXH1L6v2rTHq.Fgm.c0OKksgT9xXi', 5),
  ('user6', '$2b$10$mBXn6sufJBwdqSyXZEA4w.oANXH1L6v2rTHq.Fgm.c0OKksgT9xXi', 6),
  ('user7', '$2b$10$mBXn6sufJBwdqSyXZEA4w.oANXH1L6v2rTHq.Fgm.c0OKksgT9xXi', 7),
  ('user8', '$2b$10$mBXn6sufJBwdqSyXZEA4w.oANXH1L6v2rTHq.Fgm.c0OKksgT9xXi', 1),
  ('user9', '$2b$10$mBXn6sufJBwdqSyXZEA4w.oANXH1L6v2rTHq.Fgm.c0OKksgT9xXi', 2),
  ('user10', '$2b$10$mBXn6sufJBwdqSyXZEA4w.oANXH1L6v2rTHq.Fgm.c0OKksgT9xXi', 3);

INSERT INTO groups (id, name) VALUES
  (1, 'President'),
  (2, 'Manager'),
  (3, 'Leader'),
  (4, 'Staff');

INSERT INTO groups_users (userName_key, group_id) VALUES
('user1', 1),
('user6', 2),
('user7', 3),
('user8', 4),
('user3', 2),
('user4', 2),
('user5', 3),
('user2', 4),
('user3', 4),
('user4', 3);


INSERT INTO rules (rule, type, tableName) VALUES
('rule 1', 'read', 'employees'),
('rule 2', 'read', 'employees'),
('rule 3', 'read', 'employees');

INSERT INTO groups_rules (group_id, rule_id) VALUES
(4, 1),
(3, 2);