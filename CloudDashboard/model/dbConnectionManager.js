/**
 * Created by Manmohan Gehlot on 11/13/2016.
 */
var mysql = require('mysql');

function Connection() {
    this.pool = null;

    this.init = function () {
        this.pool = mysql.createPool({
            connectionlimit:1000,
            host:'35.165.114.176',
            user:'root',
            password:'global21',
            database: 'mobilesensorinfra'
        })
    };

    this.acquire = function (callback) {
        this.pool.getConnection(function (err, connection) {
            callback(err,connection);
        });
    };
}

module.exports = new Connection();