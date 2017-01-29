/**
 * Created by Manmohan Gehlot on 11/7/2016.
 */
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var JsonSocket = require('json-socket'),
    express = require('express'),
    app = express(),
    http = require('http');
    httpserver = require('http').Server(app),
    io = require('socket.io')(httpserver),
    net = require('net'),
    path = require('path'),
    ds = require('./DataService');
    netWork = require('./network');
    //login = require('./login');
var connection = require('./dbConnectionManager');
connection.init();

var port = 3080,cnt=0,pktcnt=0;
var masterDataRecord, clientDetail;
var clientlist=[];
var newnode = new ds();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

newnode.startNode('mmgehlotN1.log');

app.use(express.static(path.join(__dirname, 'public')));

app.post("/signin",function (req,res) {
    var username = req.body.emailid;
    var password = req.body.password;
    var userType = req.body.role;
    console.log(req.body);
    //console.log(req.session.username);
    connection.acquire(function (err, connection) {
        connection.query('Select * from db_login where userID =\'' + username + '\' and password=\'' + password +
            '\' and isDeleted=0',function (err, rows) {
            if(!err && rows.length>0 && userType==='Admin' && rows[0].role==='Admin') {
                app.use(express.static(path.join(__dirname, 'public/admin')));
                res.sendFile(__dirname + '/public/admin/Admin Dashboard.html');
                console.log("Admin");
            }
            else if(!err && rows.length>0 && userType==='Consumer' && rows[0].role==='Consumer') {
                res.redirect('http://localhost:3000/dashboard.html?consumerID=' + username);
                //res.redirect('/Admin Dashboard.html');
                console.log("Consumer");
            }
            //else if(!err && rows.length>0 && userType=='Provider' && rows[0].role=='Provider') {
            else if(rows[0].role==='Provider') {
                console.log("Provider");
                res.redirect('http://localhost:4000');
                //res.redirect('/Admin Dashboard.html');
            }
            //res.redirect('/login.html?error=usernotfound');
        });
    });

});

app.post("/signup",function(req,res) {
    console.log(req.body);
    //login.signup(req);
    var data = {
        "userID" : req.body.emailid,
        "password" : req.body.password,
        "role" : req.body.role,
        "fname" : req.body.fname,
        "lname" : req.body.lname,
        "isDeleted" : 0
    }
    connection.acquire(function (err, connection) {
                connection.query('insert into db_login set ?', [data], function (err, rows) {
                    if (err) console.log(err);
                    //res.redirect("/login.html");
                });

                connection.query("insert into db_consumer(emailID,consumerID,fname,lname,isDeleted)" +
                    " values( \'" + data.userID + "\',\'" + data.userID + "\',\'" + data.fname + "\',\'" + data.lname +
                    "\',\'" + data.isDeleted + "\')" , function (err, rows) {
                    if (err) console.log(err);
                    //res.json({status: "ok"});
                    console.log(rows);
                    res.redirect("/login.html");
                });
        /*
            }
            else
            {
                res.json({status:"exist"});
            }
        });
        */
    });
});

app.get("/",function(req,res){
    res.sendFile(__dirname + '/public/login.html');
});

app.get("/getMasterRecord",function(req,res){
    res.send(masterDataRecord);
});

app.get("/getProviderData",function (req,res) {
    var data=[];
    connection.acquire(function (err, connection) {
        connection.query('select * from db_provider', function (err, rows) {
            res.send(rows);
        });
    });


    /*
    connection.acquire(function (err, connection) {
         connection.query('select substr(nodeID,1,locate(\'N\',nodeID)-1) providerID,count(*) Total from db_nodelist group by substr(nodeID,1,locate(\'N\',nodeID)-1)', function (err, rows) {
            rows.forEach(function (r) {
                connection.query('select * from db_provider where providerID = ?',[r.providerID], function (err, rows) {
                console.log(tmp);
                    for(var i=0;i<rows.length;i++)
                    {
                     data.push({providerID : rows[i].providerID,
                            name: rows[i].pFirstName + " " + rows[i].pLastName,
                            emailID : rows[i].emailID,
                            contactOffice : rows[i].contactOffice,
                            totalConsumer : r.Total,
                            isDeleted : rows[i].isDeleted
                        });
                   }
                    res.send(data);
                });
            });
        });
    });
    */
});

app.get("/getVirtualSensorData",function (req,res) {
    connection.acquire(function (err, connection) {
        connection.query('Select * from db_nodesensordetails where isActive=1', function (err, rows) {
            console.log(rows);
            res.send(rows);
        });
    });
});

app.get("/getConsumerData",function (req,res) {
//    var cData = netWork.getConsumerData();
    connection.acquire(function (err, connection) {
        connection.query('Select * from db_consumer where isDeleted=0', function (err, rows) {
            res.send(rows);
        });
    });

});

httpserver.listen(3002);

server = net.createServer();
server.listen(port);

function isNotlisted(ip){
    var flag=false;
    for(var i=0;i<clientlist.length;i++)
    {
        if(clientlist[i].IP === ip)
        {
            flag=true;
            break;
        }
    }

    if(flag==false) {
        clientlist.push(ip);
        sendToServer();
    }
}

var tmpSckt;

io.on('connection',function (socket) {
    tmpSckt = socket;
    sendToServer();
    sendPacket();
});

function sendToServer() {
    io.sockets.emit('clientdetails',clientDetail);
}

server.on('connection', function (socket)
{
    var rIP = socket.remoteAddress;
    var rPort = socket.remotePort;

    var c=0;
    for(var i=0;i<rIP.length;i++)
    {
        if(rIP[i]==":") c++;
    }
    rIP = rIP.substr(rIP.indexOf(":",c)+1,rIP.length);
    clientDetail = {IP: rIP, Port:rPort, UpTime:new Date().toISOString()};
    if(clientlist.length==0) {
        clientlist.push(rIP);
        sendToServer();
    }
    else
        isNotlisted(rIP);

    socket = new JsonSocket(socket);

    socket.on('message', function (message) {
       masterDataRecord = message;
       //netWork.saveSensorData(message);
        ++cnt;
        socket.sendMessage(cnt);
        console.log(message);
    });

    socket.on('error', function (error) {
        console.log('Error occured while starting server.' + error);
    })
});

function sendPacket() {
    io.sockets.emit('pktcnt',cnt);
    io.sockets.emit('latlong',masterDataRecord);
    io.sockets.emit('clientdetails',clientDetail);
    console.log(cnt);
    //console.log(masterDataRecord);
    //cnt=0;
}
//setInterval(sendPacket,1000);