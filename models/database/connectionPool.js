const mysql = require('mysql');

let pool = mysql.createPool(config.db_selected);

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