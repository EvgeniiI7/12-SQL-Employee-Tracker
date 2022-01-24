// npm dependencies
const inquirer = require("inquirer");
const db = require("./config/connection");
const cTable = require('console.table');

// throw an error if the user fails to connect
db.connect(err => {
  if (err) throw err;
  console.log("Database connected");
  promptUser();
});

console.log("*****************************************")
     console.log("*                                       *")
     console.log("*              EMPLOYEE                 *")
     console.log("*              TRACKER                  *")
     console.log("*                                       *")
     console.log("*****************************************")

// first, lets create a main menu
const promptUser = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "pickOption",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Remove Employee",
        "Remove Department",
        "Quit"
      ] 
    }
  ])
  .then(userChoice => {
    let answer = userChoice.pickOption;
    if (answer === "View All Departments") {
      viewAllDepartments();
    }
    if (answer === "View All Roles") {
      viewAllRoles();
    }
    if (answer === "View All Employees") {
      viewAllEmployees();
    }
    if (answer === "Add Department") {
      addDepartment();
    }
    if (answer === "Add Role") {
      addRole();
    }
    if (answer === "Add Employee") {
      addEmployee();
    }
    if (answer === "Update Employee Role") {
      updateEmployeeRole();
    }

    if (answer === "Remove Employee") {
      removeEmployee();
    }

    if (answer === "Remove Department") {
      removeDepartment();
    }
    if (answer === "Quit") {
      db.end();
    }
  })
}

 //formatted table showing employee data including id's
const getEmployeeNames = () => {
  const sql = `
    SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name
    FROM employee`;
  return db.promise().query(sql)
}

const getEmployeeByName = (name) => {
  const sql = `
    SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS name
    FROM employee
    WHERE CONCAT(employee.first_name, " ", employee.last_name) = ?`;
  return db.promise().query(sql, name)
}

//get formatted table showing all department names and department ids
const getDepartmentByName = (department) => {
  const sql = `
    SELECT department.id
    FROM department
    WHERE department.name = ?`;
  return db.promise().query(sql, department)
}

const getDepartmentNames = () => {
  const sql = `
    SELECT department.name
    FROM department`;
  return db.promise().query(sql) 
}

//job titlea and role id belongs to
const getRoleTitles = () => {
  const sql_role = `
    SELECT role.title AS title
    FROM role`;
  return db.promise().query(sql_role) 
}

const getRoleId = (role) => {
  const sql_role_id = `
    SELECT role.id
    FROM role
    WHERE role.title = ?`;
  return db.promise().query(sql_role_id, role)
}

// function that show us all Employee
const viewAllEmployees = () => {
  const sql = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager  
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id`;
  db.query(sql, (err, result) => {
    if (err) throw err; 
    console.log(" ");
    console.table(result);
    promptUser();
  });
}

//function that show us all Rolles
const viewAllRoles = () => {
  const sql = `
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id
    ORDER BY role.id ASC`;
  db.query(sql, (err, result) => {
    if (err) throw err; 
    console.log(" ");
    console.table(result);
    promptUser();
  });
}

// function that show us all departments
const viewAllDepartments = () => {
  const sql = `
    SELECT department.id, department.name AS department 
    FROM department`;
  db.query(sql, (err, result) => {
    if (err) throw err; 
    console.log(" ");
    console.table(result);
    promptUser();
  });
}

  //I am prompted to enter the name of the Department 
const addDepartment = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "newDepartment",
      message: "What is the name of the department to add?"
    }
  ])
  .then(departmentName => {
    const sql =  `INSERT INTO department (name) VALUES (?)`;
    const params = departmentName.newDepartment;
    db.query(sql, params, (err, result) => {
      if (err) throw err; 
      console.log(`Added ${params} to the database`);
      promptUser();
    });
  });  
}

 //I am prompted to enter the name, salary, and department for the role 
const addRole = () => {
  getDepartmentNames()
    .then(([rows]) => {
      let departmentArray = [];
      rows.forEach(row => {
        departmentArray.push(row.name);
      })
      inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "What is the name of the role to add?"
        }, 
        {
          type: "input",
          name: "salary",
          message: "What is the salary for this role?"
        },{
          type: "list",
          name: "departmentId",
          message: "What is the role's department?",
          choices: departmentArray
        }
      ])
      .then(results => {
        getDepartmentByName(results.departmentId)
          .then(([rows]) => {
            results.departmentId = rows[0].id;
            const sql =  `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
            const params = [results.title, results.salary, results.departmentId];
            db.query(sql, params, (err, result) => {
              if (err) throw err; 
              console.log(`Added ${results.title} to the database`);
              promptUser();
            })
          })
      })
    })
}

//I am prompted to enter the employee’s first name, last name, role,
// and also we can choose from list who will be a new manager 
const addEmployee = () => {
  getEmployeeNames()
    .then(([rows]) => {
      let managerArray = ["None"];
      rows.forEach(row => {
        managerArray.push(row.name);
      })
  getRoleTitles()
    .then(([rows]) => {
      let roleArray = [];
      rows.forEach(row => {
        roleArray.push(row.title);
      })
      inquirer.prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employee's first name?"
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employee's last name?"
        },
        {
          type: "list",
          name: "roleId",
          message: "What is the employee's role?",
          choices: roleArray
        },
        {
          type: "list",
          name: "managerId",
          message: "Who is the employee's manager?",
          choices: managerArray
        }
      ])
      .then(results => {
        let firstName = results.firstName.trim();
        let lastName = results.lastName.trim();
        
        getEmployeeByName(results.managerId)
          .then(([managers]) => {
            results.managerId = managers[0].id;
            getRoleId(results.roleId)
              .then(([roles]) => {
                results.roleId = roles[0].id;
                const sql_insert_employee = `
                  INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
                const params = [firstName, lastName, results.roleId, results.managerId];
                db.query(sql_insert_employee, params, (err, result) => {
                  if (err) throw err;
                  console.log(`Added ${firstName} ${lastName} to the database`);
                  promptUser();
                })
              })
              
          })
          .catch(() => {
            getRoleId(results.roleId)
              .then(([roles]) => {
                results.roleId = roles[0].id;
                const sql_insert_employee = `
                  INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,NULL)`;
                const params = [firstName, lastName, results.roleId];
                db.query(sql_insert_employee, params, (err, result) => {
                  if (err) throw err;
                  console.log(`Added ${firstName} ${lastName} to the database`);
                  promptUser();
                })
              })
          })
        })  
    })
  })
}

// function to update an employee role
const updateEmployeeRole = () => {
  getEmployeeNames()
  .then(([rows]) => {
    let employeesArray = [];
    rows.forEach(row => {
      employeesArray.push(row.name);
    })
  getRoleTitles()
    .then(([rows]) => {
      let roleArray = [];
      rows.forEach(row => {
        roleArray.push(row.title);
      })
      inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee would you like to update?",
          choices: employeesArray
        },
        {
          type: "list",
          name: "roleId",
          message: "Pick the selected employee's new role:",
          choices: roleArray
        }
      ])
      .then(results => {
        getEmployeeByName(results.employeeId)
          .then(([employees]) => {
            results.employeeId = employees[0].id;
          const sql_new_role_id = `
            SELECT role.id, role.title as title
            FROM role
            WHERE role.title = ?`;
              db.promise().query(sql_new_role_id, results.roleId)
                .then(([roles]) => {
                  results.roleId = roles[0].id;
                  const sql_update_employee_role = `
                    UPDATE employee SET role_id = ? WHERE id = ?`;
                  const params = [results.roleId, results.employeeId];
                  db.query(sql_update_employee_role, params, (err, result) => {
                    if (err) throw err; 
                    console.log(`Updated ${employees[0].name}'s role to ${roles[0].title}`);
                    promptUser();
                  })
                })
            })  
      })
    })
    })
}
// function that allows you to delite an employee
const removeEmployee = () => {
  getEmployeeNames()
    .then(([rows]) => {
      let employeesArray = [];
      rows.forEach(row => {
        employeesArray.push(row.name);
      })
      inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Select the employee you want to delete:",
          choices: employeesArray
        }
      ])
      .then(results => {
        getEmployeeByName(results.employeeId)
          .then(([employees]) => {
            results.employeeId = employees[0].id;
            const sql_delete_employee = `
              DELETE FROM employee WHERE id = ?`;
            const params = [results.employeeId];
            db.query(sql_delete_employee, params, (err, result) => {
              if (err) throw err;
              console.log(`Deleted ${employees[0].name} from database.`);
              promptUser();
            })
          })
    })
  })
}
// function that allows you to delite department from the list
const removeDepartment = () => {
  getDepartmentNames()
    .then(([rows]) => {
      let departmentArray = [];
      rows.forEach(row => {
        departmentArray.push(row.name);
      })
      inquirer.prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Select the department you want to delete:",
          choices: departmentArray
        }
      ])
      .then(results => {
        getDepartmentByName(results.departmentId)
          .then(([departments]) => {
            results.departmentId = departments[0].id;
            const sql_delete_department = `
              DELETE FROM department WHERE id = ?`;
            const params = [results.departmentId];
            db.query(sql_delete_department, params, (err, result) => {
              if (err) throw err;
              console.log(`Deleted ${departments[0].name} from database.`);
              promptUser();
            })
          })
      })
    })
}
