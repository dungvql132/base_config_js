DO $$
DECLARE
    tableName text;
BEGIN
    FOR tableName IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE "' || tableName || '" CASCADE;';
    END LOOP;
END $$;

DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS offices;
DROP TABLE IF EXISTS roles;

-- create table roles
CREATE TABLE roles (
id SERIAL PRIMARY KEY,
role VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE offices (
officeCode VARCHAR(50) PRIMARY KEY,
city VARCHAR(100),
phone VARCHAR(50),
addressLine1 VARCHAR(200),
addressLine2 VARCHAR(200),
state VARCHAR(100),
country VARCHAR(100),
postalCode VARCHAR(50),
territory VARCHAR(100)
);
INSERT INTO offices (officeCode, city, phone, addressLine1, addressLine2, state, country, postalCode, territory)
VALUES
('O001', 'New York', '123456789', '123 Main Street', 'Suite 100', 'NY', 'USA', '10001', 'NA'),
('O002', 'London', '987654321', '456 High Street', 'Floor 2', 'London', 'UK', 'SW1 1AA', 'EMEA'),
('O003', 'Tokyo', '555555555', '789 Ginza Street', 'Building A', 'Tokyo', 'Japan', '100-0001', 'APAC'),
('O004', 'Paris', '111111111', '321 Champs-Élysées', 'Unit 50', 'Paris', 'France', '75008', 'EMEA'),
('O005', 'Sydney', '222222222', '456 George Street', 'Level 10', 'NSW', 'Australia', '2000', 'APAC'),
('O006', 'Berlin', '333333333', '789 Friedrichstraße', 'Apartment 5', 'Berlin', 'Germany', '10117', 'EMEA'),
('O007', 'San Francisco', '444444444', '123 Market Street', 'Suite 200', 'CA', 'USA', '94111', 'NA'),
('O008', 'Toronto', '666666666', '456 Bay Street', 'Unit 300', 'ON', 'Canada', 'M5J 2T3', 'NA'),
('O009', 'Beijing', '777777777', '789 Wangfujing Street', 'Building B', 'Beijing', 'China', '100006', 'APAC'),
('O010', 'Mexico City', '888888888', '123 Reforma Avenue', 'Piso 15', 'Mexico City', 'Mexico', '06600', 'NA');

CREATE TABLE employees (
employeeNumber INT PRIMARY KEY,
lastName VARCHAR(100),
firstName VARCHAR(100),
extension VARCHAR(20),
email VARCHAR(100),
officeCode VARCHAR(50) REFERENCES offices(officeCode),
reportTo INT REFERENCES employees(employeeNumber),
jobTitle VARCHAR(100)
);
INSERT INTO employees (employeeNumber, lastName, firstName, extension, email, officeCode, reportTo, jobTitle)
VALUES
(1001, 'Smith', 'John', '123', 'john.smith@example.com', 'O001', NULL, 'Manager'),
(1002, 'Johnson', 'Emily', '456', 'emily.johnson@example.com', 'O002', 1001, 'Assistant Manager'),
(1003, 'Williams', 'Michael', '789', 'michael.williams@example.com', 'O002', 1001, 'Sales Representative'),
(1004, 'Brown', 'Emma', '111', 'emma.brown@example.com', 'O003', 1002, 'Sales Representative'),
(1005, 'Jones', 'Daniel', '222', 'daniel.jones@example.com', 'O003', 1002, 'Sales Representative'),
(1006, 'Davis', 'Olivia', '333', 'olivia.davis@example.com', 'O004', 1001, 'Assistant Manager'),
(1007, 'Miller', 'Sophia', '444', 'sophia.miller@example.com', 'O004', 1006, 'Sales Representative'),
(1008, 'Wilson', 'James', '555', 'james.wilson@example.com', 'O005', 1001, 'Manager'),
(1009, 'Moore', 'Ava', '666', 'ava.moore@example.com', 'O006', 1008, 'Assistant Manager'),
(1010, 'Taylor', 'Liam', '777', 'liam.taylor@example.com', 'O006', 1009, 'Sales Representative');

CREATE TABLE customers (
customerNumber INT PRIMARY KEY,
customerName VARCHAR(100),
contactFirstName VARCHAR(100),
contactLastName VARCHAR(100),
phone VARCHAR(50),
addressLine1 VARCHAR(200),
addressLine2 VARCHAR(200),
city VARCHAR(100),
state VARCHAR(100),
postalCode VARCHAR(50),
country VARCHAR(100),
salesRepEmployeeNumber INT REFERENCES employees(employeeNumber),
creditLimit DECIMAL(10,2)
);
INSERT INTO customers (customerNumber, customerName, contactFirstName, contactLastName, phone, addressLine1, addressLine2, city, state, postalCode, country, salesRepEmployeeNumber, creditLimit)
VALUES
(1001, 'ABC Company', 'John', 'Smith', '123456789', '123 Main Street', 'Suite 100', 'New York', 'NY', '10001', 'USA', 1001, 10000.00),
(1002, 'XYZ Corporation', 'Emily', 'Johnson', '987654321', '456 High Street', 'Floor 2', 'London', NULL, 'SW1 1AA', 'UK', 1001, 15000.00),
(1003, '123 Industries', 'Michael', 'Williams', '555555555', '789 Ginza Street', 'Building A', 'Tokyo', NULL, '100-0001', 'Japan', 1002, 20000.00),
(1004, 'ACME Corp', 'Emma', 'Brown', '111111111', '321 Champs-Élysées', 'Unit 50', 'Paris', NULL, '75008', 'France', 1003, 25000.00),
(1005, 'Global Solutions', 'Daniel', 'Jones', '222222222', '456 George Street', 'Level 10', 'Sydney', 'NSW', '2000', 'Australia', 1004, 30000.00),
(1006, 'Tech Innovators', 'Olivia', 'Davis', '333333333', '789 Friedrichstraße', 'Apartment 5', 'Berlin', NULL, '10117', 'Germany', 1001, 20000.00),
(1007, 'Superior Products', 'Sophia', 'Miller', '444444444', '123 Market Street', 'Suite 200', 'San Francisco', 'CA', '94111', 'USA', 1001, 15000.00),
(1008, 'ABC Ltd.', 'James', 'Wilson', '555555555', '456 Bay Street', 'Unit 300', 'Toronto', 'ON', 'M5J 2T3', 'Canada', 1005, 25000.00),
(1009, 'Great Wall Enterprises', 'Ava', 'Moore', '666666666', '789 Wangfujing Street', 'Building B', 'Beijing', NULL, '100006', 'China', 1006, 30000.00),
(1010, 'Mexican Imports', 'Liam', 'Taylor', '777777777', '123 Reforma Avenue', 'Piso 15', 'Mexico City', NULL, '06600', 'Mexico', 1007, 20000.00);

-- Insert values (President, Manager, Leader, Staff) with corresponding permissions defined in API session into the table
INSERT INTO roles (role) VALUES
('President'),
('Manager'),
('Leader'),
('Staff');

-- Add new column 'role' into employees table that references 'roles' table.
ALTER TABLE employees
ADD COLUMN role INT,
ADD FOREIGN KEY (role) REFERENCES roles(id);

-- Update all employees 'Sales Manager (APAC)', 'Sale Manager (EMEA)', 'Sales Manager (NA)' to 'Manager' role
UPDATE employees
SET role = (SELECT id FROM roles WHERE role = 'Manager')
WHERE jobTitle IN ('Sales Manager (APAC)', 'Sales Manager (EMEA)', 'Sales Manager (NA)');

-- Update all employees who have a person reporting to them as 'Leader'
UPDATE employees
SET role = (SELECT id FROM roles WHERE role = 'Leader')
WHERE employeeNumber IN (
SELECT reportTo FROM employees
WHERE reportTo IS NOT NULL
);

-- Update all remaining employees, 'Sales Rep', 'VP Sales', 'VP Marketing' to 'Staff' role.
UPDATE employees
SET role = (SELECT id FROM roles WHERE role = 'Staff')
WHERE jobTitle IN ('Sales Rep', 'VP Sales', 'VP Marketing');

