/**
 * Created by Manmohan Gehlot on 11/12/2016.
 */
var connection = require('./dbConnectionManager');

connection.init();

var tmpNodeID;

var mapSensorData = function (vsT,vsP,vsH,vsL) {

    tmpNodeID = vsT.nodeID;

    connection.acquire(function (err,connection) {
          connection.query('Select providerID from db_nodelist where nodeID = ?',[vsT.nodeID],function (err,result) {

        if(err)
            console.log('No provider has this node');

        if(result.length>0) {
            vsT.providerID = vsP.providerID = vsH.providerID = vsL.providerID = result[0].providerID;
            connection.query('Select consumerID from db_csubdetail where db_csubdetail.providerID= ?'
                , [result[0].providerID], function (err, r) {
                    if (err) console.log('No consumer exist with this provider');

                    console.log(r);

                    if(r.length>0) {

                        vsT.consumerID = vsP.consumerID = vsH.consumerID = vsL.consumerID = r[0].consumerID;

                        var tmpData = {nodeID : tmpNodeID, consumerID : r[0].consumerID, sTempID : tmpNodeID + 'T' , sPressID : tmpNodeID + 'P',
                            sHumidityID : tmpNodeID + 'H', sLocID : tmpNodeID + 'L', dateCreated : vsT.dateCreated,
                            isActive : 1, isDeleted : 0,providerID : result[0].providerID };

                        connection.query('insert into db_nodesensordetails set ?', tmpData, function (err, res) {
                           if(err) throw err;
                        });

                        connection.query('insert into db_Temperature set ?', vsT, function (err, res) {
                            if (err) throw err;
                        });

                        connection.query('insert into db_Pressure set ?', vsP, function (err, res) {
                            if (err) throw err;
                        });

                        connection.query('insert into db_humidity set ?', vsH, function (err, res) {
                            if (err) throw err;
                        });

                        connection.query('insert into db_Location set ?', vsL, function (err, res) {
                            if (err) throw err;
                        });
                    }
                    else{
                        console.log("No consumer exist with provider ID" + result[0].providerID);
                    }
                });
        }
      });
    });

};

exports.mapSensorData = mapSensorData;