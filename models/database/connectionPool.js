const mysql = require('mysql');
const config = require('../../config/credencial');

let pool = mysql.createPool(config.database);

function getConnection(callback) {
    pool.getConnection(function (err, conn) {
        if(!err) {
            callback(conn);
        }
    });
}

module.exports = getConnection;