const mysql = require('mysql');
const config = require('../../config/credencial');

let pool = mysql.createPool(config.local_database);

function getConnection(callback) {
    pool.getConnection(function (err, conn) {
        if(!err) {
            callback(conn);
        }
        if (err) {
            console.log(err);
        }
    });
}

module.exports = getConnection;