/**
 * Created by Manmohan Gehlot on 11/8/2016.
 */
var JsonSocket = require('json-socket'),
    request = require('request'),
    ds = require('./DataSimulator'),
    net = require('net'),
    LineByLine = require('n-readlines');
var connection = require('./dbConnectionManager.js');
const curDir = './nodeFile/';
var line,liner, recordCount = 0,nodeID,timerID;
var value,lat,longt, temp, temp_min, humidity, pressure;
var reqtoServer,reqtoSource;
var nodeStatus=true;

connection.init();

function myNode() {
}

myNode.prototype.startNode=function(id){
    liner = new LineByLine(curDir + id);
    nodeID = id.substring(0,id.indexOf('.'));
    console.log(nodeID);
    timerID = setInterval(myNode.prototype.CoreDataService,200);
}

myNode.prototype.stopNode = function(){
    clearInterval(timerID);
    //reqtoServer.abort();
    //reqtoSource.abort();
    console.log("Node has stopped");
}


myNode.prototype.CoreDataService = function () {
    if (line = liner.next())
    {
        value = line.toString('ascii');

        if ((value.substr(0, 6) == '$GPGGA') && (value.length>50))
        {
            var cnt = 1;
            value.split(",").forEach(function (temp)
            {
                if (typeof temp !== 'undefined' && temp)
                {
                    switch (cnt++) {
                        case 3:
                            lat = temp.substr(0, 2) + "." + temp.substr(2, 2) + temp.substr(6, 6);
                            break;
                        case 5:
                            longt = temp.substr(0, 3) + "." + temp.substr(3, 2) + temp.substr(6, 6);
                            break;
                    }
                    if (temp == "W")
                        longt = "-" + longt;
                    if (temp == "S")
                        lat = "-" + lat;
                }
            });
            myNode.prototype.DataInputStream("lat=" + lat + "&lon=" + longt);
        }
    }
    else
    {
        clearInterval(timerID);
    }
    recordCount++;
}

myNode.prototype.updateNodeStatus=function(nodeId,status) {
    console.log("Node : " + nodeId + " has "+ status);
    connection.acquire(function (err, connection) {
        connection.query('UPDATE db_nodelist SET status = ? WHERE nodeID = ? and isActive=1', [status, nodeId]);
    });
}

process.on('SIGINT',function () {
    connection.acquire(function (err, connection) {
        connection.query('UPDATE db_nodelist SET status = ? WHERE nodeID = ? and isActive=1', ['Stop', nodeID]);
    });
    process.exit(0);
});

myNode.prototype.DataInputStream = function(latlong) {
    /*
    var latlong = 'lat=37.2117517&lon=-121.58648129';
    lat = '37.2117517';
    longt = '-121.58648129';
*/
    var remotepath="http://api.openweathermap.org/data/2.5/weather?" + latlong + "&appid=8c46310679348c01e3f748c46d43a4b8";
    reqtoSource = request({
        url: remotepath,
        json: true,
        //agent: false
    }, function (error, response, body) {

        var out = request({uri: remotepath});
        out.on('error', function (err) {
            if ((err.message).indexOf('ETIMEDOUT') > -1);
            if ((err.message).indexOf('ECONNRESET') > -1);
            if ((err.message).indexOf('ENOBUFS') > -1);
        });

        if (!error && response.statusCode === 200) {
            //console.dir(body);
            var d = ds.getObjects(body, 'temp_min', '');
            var r = JSON.stringify(d);
            var cnt = 1;

            var result;
            result = "{\"nodeID\":\"" + nodeID + "\"," + "\"lat\":" + lat + ",\"long\":" + longt + ",\"temp\":";

            r.split(',').forEach(function (tempX) {
                switch (cnt++) {
                    case 1 :
                        temp = tempX.substr(9, tempX.length - 9);
                        result = result + temp;
                        break;
                    case 2 :
                        pressure = tempX.substr(11, tempX.length - 11);
                        result = result + ",\"pressure\":" + pressure;
                        break;
                    case 3 :
                        humidity = tempX.substr(11, tempX.length - 11);
                        result = result + ",\"humidity\":" + humidity + "}";
                        break;
                }
            });

            if(nodeStatus) {
                myNode.prototype.updateNodeStatus(nodeID,'Start');
                nodeStatus = false;
            }

            myNode.prototype.DataOutputStream(JSON.parse(result));
            //console.log(JSON.parse(result));
        }
    });
}

myNode.prototype.DataOutputStream=function(data) {
    //console.log(data);
    /*
reqtoServer = request({
        url: "http://35.165.114.176:3005",
        method : 'POST',
        agent : false,
        json: true,
        headers: {
            'content-type' : 'application/json',
            'Content-Length': data.length
        },
        body: data
    }, function (error, response, body) {


        if(error)
        {
            myNode.prototype.updateNodeStatus(nodeID,'Stop');
            console.log(error);
            console.log('Oops!! Something happened wrong. Connection to server failed...!!');
            process.exit(0);
        }
    });

*/
    var socket = new JsonSocket(new net.Socket());
    var port = 3080;
    var host = '127.0.0.1';

    socket.connect(port, host);

    socket.on('error', function (err) {
        console.log("Oops!!! Connection to server failed." + err);
        process.exit();
    });

    socket.on('connect', function () {
        socket.sendMessage(data);
        socket.on('message', function (message) {
            //console.log("Number of packet sent successfully : " + message);
            //console.dir(message);
        });
    });
}

module.exports=myNode;
/*

 //emitter.setMaxListeners(0);
 var latlong = 'lat=37.2117517&lon=-121.58648129';
 lat = '37.2117517';
 longt = '-121.58648129';
 //var remotepath = "http://api.openweathermap.org/data/2.5/weather?" + latlong + "&appid=8c46310679348c01e3f748c46d43a4b8";
 var remotepath = "/data/2.5/weather?" + latlong + "&appid=8c46310679348c01e3f748c46d43a4b8";
 //http.globalAgent.maxSockets = 100;
 var options = {
 host: "api.openweathermap.org",//data/2.5/weather?" + latlong + "&appid=8c46310679348c01e3f748c46d43a4b8",
 port: 80,
 path: remotepath,
 method: 'GET',
 //headers: {"Connection": "Keep-Alive"},
 json: true,
 agent: false
 };

 var req = http.request(options, function (resp) {
 str = "";

 resp.on('data', function (chunk) {
 //console.log(chunk);
 str += chunk;
 });

 resp.on('end', function () {
 //console.log(JSON.parse(str));
 body = JSON.parse(str);
 var d = ds.getObjects(body, 'temp_min', '');
 var r = JSON.stringify(d);
 var cnt = 1;

 var result;
 result = "{\"nodeID\":\"" + nodeID + "\"," + "\"lat\":" + lat + ",\"long\":" + longt + ",\"temp\":";

 r.split(',').forEach(function (tempX) {
 switch (cnt++) {
 case 1 :
 temp = tempX.substr(9, tempX.length - 9);
 result = result + temp;
 break;
 case 2 :
 pressure = tempX.substr(11, tempX.length - 11);
 result = result + ",\"pressure\":" + pressure;
 break;
 case 3 :
 humidity = tempX.substr(11, tempX.length - 11);
 result = result + ",\"humidity\":" + humidity + "}";
 break;
 }
 });
 console.log(JSON.parse(result));
 //    resp.emit('close');
 });
 });
 req.setTimeout(2000, function () {
 req.abort();
 });
 }

 req.on('socket', function (socket) {
 socket.setTimeout(10*1000); //10 sec timeout
 socket.on('timeout', function() {
 req.abort();
 });
 });
 }
*/