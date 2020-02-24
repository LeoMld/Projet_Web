const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Projet_Web'
});
connection.connect();

module.exports = connection;
