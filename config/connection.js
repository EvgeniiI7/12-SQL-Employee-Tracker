const mysql = require('mysql2');

require('dotenv').config();

const db = mysql.createConnection(
  {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '1702Vi1702Vi!',
      database: 'employee_tracker'
  },
  console.log('Connected to Database')
)


module.exports = db;