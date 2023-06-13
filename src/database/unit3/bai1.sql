-- Create (Insert data)
INSERT INTO employees (employeeNumber, lastName, firstName, extension, email, officeCode, reportTo, jobTitle, role)
VALUES (1, 'Doe', 'John', '1234', 'john.doe@example.com', '1', NULL, 'Manager', 1);

-- Read (Select data)
SELECT * FROM employees WHERE employeeNumber = 1;

-- Update (Modify data)
UPDATE employees SET email = 'newemail@example.com' WHERE employeeNumber = 1;

-- Delete (Remove data)
DELETE FROM employees WHERE employeeNumber = 1;

-- -----------------------------------

SELECT employees.employeeNumber, employees.lastName, employees.firstName, COUNT(customers.customerNumber) AS numCustomers
FROM employees
LEFT JOIN customers ON employees.employeeNumber = customers.salesRepEmployeeNumber
GROUP BY employees.employeeNumber, employees.lastName, employees.firstName
ORDER BY numCustomers DESC;

-- -----------------------------------

SELECT offices.officeCode, offices.city, COUNT(customers.customerNumber) AS numCustomers
FROM offices
LEFT JOIN employees ON offices.officeCode = employees.officeCode
LEFT JOIN customers ON employees.employeeNumber = customers.salesRepEmployeeNumber
GROUP BY offices.officeCode, offices.city
ORDER BY numCustomers DESC;

-- -----------------------------------

SELECT employees.employeeNumber, employees.lastName, employees.firstName, SUM(customers.creditLimit) AS totalCreditLimit
FROM employees
LEFT JOIN customers ON employees.employeeNumber = customers.salesRepEmployeeNumber
GROUP BY employees.employeeNumber, employees.lastName, employees.firstName
ORDER BY totalCreditLimit DESC;

-- ------------------------------------

SELECT offices.officeCode, offices.city, AVG(customers.creditLimit) AS avgCreditLimit
FROM offices
LEFT JOIN employees ON offices.officeCode = employees.officeCode
LEFT JOIN customers ON employees.employeeNumber = customers.salesRepEmployeeNumber
GROUP BY offices.officeCode, offices.city
ORDER BY avgCreditLimit DESC;
