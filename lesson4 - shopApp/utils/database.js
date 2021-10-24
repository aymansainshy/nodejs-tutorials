const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node_shop_app',
    password: 'aymansql',
}); 

module.exports = pool.promise();