const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'eu-cdbr-west-02.cleardb.net',
    user: 'bfe83e2534b01b',
    password: '262d60fb',
    database: 'Projet_Web'
});
connection.connect();

module.exports = connection;
