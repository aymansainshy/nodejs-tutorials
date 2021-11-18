// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost', 
//     user: 'root',
//     database: 'node_shop_app',
//     password: 'aymansql',
// }); 

// module.exports = pool.promise();

const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_shop_app', 'root', 'aymansql', {
    dialect: 'mysql',
    host: 'localhost',
});


module.exports = sequelize;