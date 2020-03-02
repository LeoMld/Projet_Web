const mysql = require('mysql');

const connection = mysql.createPool(process.env.CLEARDB_DATABASE_URL);
/*const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Projet_Web'
});*/

connection.getConnection((err, connection) => {
    if(err)
        console.error("Something went wrong connecting to the database ...")
    if(connection)
        connection.release()
    return;
});


module.exports = connection;