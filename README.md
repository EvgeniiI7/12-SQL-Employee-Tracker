# 12-SQL-Employee-Tracker
##

Developers are often tasked with creating interfaces that make it easy for non-developers to view and interact with information stored in databases. Often these interfaces are known as Content Management Systems. In this homework assignment, your challenge is to architect and build a solution for managing a company's employees using node, inquirer, and MySQL.

```
 User Story:

As a business owner, I want to be able to view and manage the departments, roles, and employees in my company so that I can organize and plan my business.
```

``` User experience:

Using the comand line, I execute the application that accepts user input.

When I start the application, then I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, update an employee role, and exit

When I choose to view all departments, then I am presented with a formatted table showing department names and department ids.

When I choose to view all roles, then I am presented with the job title, role id, the department that role belongs to, and the salary for that role.

When I choose to view all employees, then I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to.

When I choose to add a department, then I am prompted to enter the name of the department and that department is added to the database.

When I choose to add a role, then I am prompted to enter the name, salary, and department for the role and that role is added to the database.

When I choose to add an employee, then I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database.

When I choose to update an employee role, then I am prompted to select an employee to update and their new role and this information is updated in the database.
```
## Schema Database structure:

Department:

* id - INT PRIMARY KEY

* name - VARCHAR(30) to hold department name

### Role:

* id - INT PRIMARY KEY

* title - VARCHAR(30) to hold role title

* salary - DECIMAL to hold role salary

* department_id - INT to hold reference to department role belongs to

### Employee:

* id - INT PRIMARY KEY

* first_name - VARCHAR(30) to hold employee first name

* last_name - VARCHAR(30) to hold employee last name

* role_id - INT to hold reference to employee role

* manager_id - INT to hold reference to another employee that is manager of the current employee. This field may be null if the employee has no manager

### The application will be invoked by using the following command:

```
node index.js
```
## Here are some guidelines
### Dependencies:

* Use console.table to print MySQL rows to the console. There is a built-in version of console.table, but the NPM package formats the data a little better for our purposes.``` npm i console.table```
*  Use InquirerJs NPM package to interact with the user via the command-line. ```npm i inquirer```
*  Use the MySQL NPM package to connect to your MySQL database and perform queries.  ```npm i mysql2```

## Link to walkthrough video:
https://github.com/EvgeniiI7/12-SQL-Employee-Tracker/issues/1#issue-1112172304

Link to URL repository:
https://github.com/EvgeniiI7/12-SQL-Employee-Tracker
