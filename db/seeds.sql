INSERT INTO department (name)
VALUES 
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal')
  ;
INSERT INTO role (title, salary, department_id)
VALUES
  ('Sales Lead', 30000, 1),
  ('Salesperson', 20000, 1),
  ('Lead Engineer', 50000, 2),
  ('Software Engineer', 45000, 2),
  ('Accountant', 35000, 3),
  ('Legal Team Lead', 60000, 4),
  ('Lawyer', 55000, 4);
  
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES

  ('John', 'Wick', 1, NULL),
  ('John Doe', 'White', 1, 1),
  ('Ashley', 'One', 2, NULL),
  ('Kevin', 'Tupik', 2, 3),
  ('Maria', 'Sharapova', 3, NULl),
  ('Sara', 'Konor', 4, NULl),
  ('Tom', 'Anderson', 4, 6)
;
