/**
 * Created by Amrapali on 11/13/2016.
 */
var mysql = require('mysql');

function Connection() {
    this.pool = null;

    this.init = function () {
        this.pool = mysql.createPool({
            connectionlimit:1000,
            host:'localhost',
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