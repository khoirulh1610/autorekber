var mysql = require('mysql');
require('dotenv').config({ path: '../.env' });
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port : process.env.DB_PORT,
    charset : 'utf8mb4'
  });

module.exports = con;