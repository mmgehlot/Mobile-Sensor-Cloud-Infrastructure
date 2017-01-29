var request = require('request');
var vs = require('./Templating');
var mapData = require('./sensorMapping');

var infLoop = require('infinite-loop');

var vsTemp= new vs.TemperatureSensor();
var vsPress = new vs.PressureSensor();
var vsHumidity = new vs.HumiditySensor();
var vsLocation = new vs.LocationSensor();

var loop = new infLoop();

loop.add(getnodeData).run();

function getnodeData()
{
    request({
        url: 'http://127.0.0.1:3002/getMasterRecord',
        method: 'GET',
        json: true
    }, function (error, response, body) {
        if(error) {
            console.log("Oops!!!, Server is not running. please start the server first.");
            process.exit();
        }
         if (!error && response.statusCode === 200)
             console.log(body);
                if (typeof body.temp !== undefined && body.temp) {
                    vsTemp.nodeID = body.nodeID;
                    vsTemp.sensorID = body.nodeID + "T";
                    vsTemp.value = body.temp;

                    vsPress.nodeID = body.nodeID;
                    vsPress.sensorID = body.nodeID + "P";
                    vsPress.value = body.pressure;

                    vsHumidity.nodeID = body.nodeID;
                    vsHumidity.sensorID = body.nodeID + "H";
                    vsHumidity.value = body.humidity;

                    vsLocation.nodeID = body.nodeID;
                    vsLocation.sensorID = body.nodeID + "L";
                    vsLocation.value = body.lat + "," + body.long;

                    mapData.mapSensorData(vsTemp,vsPress,vsHumidity,vsLocation);
                    console.log(body);
                }
    });
}

exports.getnodeData=getnodeData;
