const mysql = require('mysql');


const connection = mysql.createConnection({
    /*host: 'eu-cdbr-west-02.cleardb.net',
    user: 'bfe83e2534b01b',
    password: '262d60fb',
    database: 'heroku_c5894d609f3f5f9'*/
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Projet_Web'
});

connection.connect();

module.exports = connection;
