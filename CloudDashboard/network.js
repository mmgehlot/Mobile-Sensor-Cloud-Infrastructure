/**
 * Created by Manmohan Gehlot on 12/1/2016.
 */

var connection = require('./dbConnectionManager.js');
var nodeID=[];

connection.init();

function getNodeList() {
    connection.acquire(function (err, connection) {
        connection.query('Select nodeID from db_nodelist where isActive=1', function (err, rows) {
            rows.forEach(function (id) {
                nodeID.push(id.nodeID);
            });
        });
    });
}
exports.getNodeID = function () {
    getNodeList();
    return nodeID;
}

exports.saveSensorData = function (record) {
    nodeID = record.nodeID;
    console.log(nodeID);
    connection.acquire(function (err, connection) {
        connection.query("Select consumerID,providerID from db_nodesensordetails where isActive=1 and nodeID=\'" + nodeID + "\'", function (err, row) {
            //connection.release();

            var data = {
                "nodeID": nodeID,
                "providerID": row[0].providerID,
                "consumerID": row[0].consumerID,
                "temp": record.temp,
                "loc": record.lat + "," + record.long,
                "press": record.pressure,
                "humidity": record.humidity
            }
            connection.query("insert into sensordata set ?",data,function (err,rows) {
                console.log(rows);
            });
            /*
            connection.query("insert into sensordata(nodeID,providerID,consumerID,temp,loc,press,humidity,dateCreated) " +
                "values \'" + data.nodeID + "\',\'" + data.providerID +"\',\'" +
                data.consumerID + "\',\'" + data.temp + "\',\'" +
                data.loc + "\',\'" + data.press + "\',\'" +
                data.humidity + "\',now())",function (err, rows) {
                console.log(rows);
            });
            */
        });
        });
}

exports.getVirtualSensorData = function () {
    var vsData;
    connection.acquire(function (err, connection) {
        connection.query('Select * from db_nodesensordetails where isActive=1 and isDeleted=0', function (err, rows) {
            vsData = rows;
            console.log(vsData);
            return vsData;
        });
    });
}

exports.getConsumerData = function () {
    var cData;
    connection.acquire(function (err, connection) {
        connection.query('Select * from db_consumer where isDeleted=0', function (err, rows) {
            cData = rows;
            //console.log(vsData);
            return cData;
        });
    });
}

exports.getProviderData = function (req,res) {
    var providerData;
    var data;
    connection.acquire(function (err, connection) {
        connection.query('select substr(nodeID,1,locate(\'N\',nodeID)-1) providerID,count(*) Total from db_nodelist group by substr(nodeID,1,locate(\'N\',nodeID)-1)', function (err, rows) {
            rows.forEach(function (r) {
                connection.query('select * from db_provider where providerID = ?',[r.providerID], function (err, rows) {

                    rows.forEach(function(rows)
                    {
                        data= {providerID : rows.providerID,
                            name: rows.pFirstName + " " + rows.pLastName,
                            emailID : rows.emailID,
                            contactOffice : rows.contactOffice,
                            totalConsumer : r.Total,
                            isDeleted : rows.isDeleted
                        };
                        data = data + ",";

/*
                        console.log({providerID : rows.providerID,
                            name : rows.pFirstName + " " + rows.pLastName,
                            emailID : rows.emailID,
                            contactOffice : rows.contactOffice,
                            totalConsumer : r.Total,
                            isDeleted : rows.isDeleted
                        });
                        */
                    });
                    res.send(data);
                });
            });
        });
    });
}