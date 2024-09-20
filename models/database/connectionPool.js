const mysql = require('mysql');
const credential = require('../../config/credencial');

let pool = mysql.createPool(credential[credential.config.db_selected]);

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