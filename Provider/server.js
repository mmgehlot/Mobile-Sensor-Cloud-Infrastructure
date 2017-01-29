var express       =     require("express");
var app =  express();
var mysql     =     require("mysql");
var http      =     require('http').Server(app);
var io        =     require("socket.io")(http);
var strInc = require('string-incr');

/* Creating POOL MySQL connection.*/

var pool    =    mysql.createPool({
    connectionLimit   :   100,
    host              :   'localhost',
    user              :   'root',
    password          :   '123456',
    database          :   'mobilesensorinfra'
});

app.use(express.static(__dirname));


app.get("/",function(req,res){
    res.sendFile(__dirname + '/provider.dashboard.html');
});


http.listen(4000,function(){
    console.log("Listening on 4000:----");
});


// notification table
io.on('connection',function(socket) {

    console.log("A user is connected ---consumer list table wala");
    getnotificationData(function (err, g) {
        socket.emit('showrows4', g);

        socket.on('adddeploysensor', function (data) {
            var cnt=parseInt(data.key3);
            console.log(data);
                saveData(data.key1, data.key2,cnt);
            /*
             var l ='';
             console.log("---------------------------------------------------");
             console.log("Inside ADD DEPLOY SENSOR on server.js add deploy sensor on click button");
             console.log("key1:"+data.key1);
             console.log("key2:"+data.key2);
             console.log("key3:"+data.key3);
             console.log("key4:"+data.key4);
             console.log("---------------------------------------------------");
             console.log(data);
             // var l = data.key3;
             l = '2';

             pool.getConnection(function(err,connection){
             if (err) {
             callback(false);
             return;
             }



             /*
             console.log("length");
             console.log(l);
             console.log("length");
             /*
             l=[];
             l.push(2);
             l.push(3);

             for (var i in l)
             {
             console.log("Inside loop ");
             console.log("i ki value");
             console.log(i);
             connection.query("select max(nodeID) as lastnode from db_nodesensordetails where providerID=1", function (err, rows)
             {
             // connection.release();
             if (err) {
             console.log(err);
             }
             if (!err) {
             // console.log("########################################");
             // console.log(rows);
             // console.log("########################################");
             var a = rows[0].lastnode;
             }
             console.log("i ki value 2");
             console.log(i);
             console.log("-----------------value of lastnode-----------------");
             console.log(a);
             console.log("-----------------value of lastnode-----------------");

             if (i == 0){
             console.log("shelly");
             var b = strInc(a);
             console.log(b);
             };

             if (i != 0){
             console.log("**b1***");
             console.log(b);
             console.log("**b1***");
             var b = strInc(b);
             console.log("**b2***");
             console.log(b);
             console.log("**b2***");

             };

             var z = {nodeID: b, consumerID: data.key1, providerID: data.key2, isActive: data.key4};

             connection.query("INSERT INTO db_nodesensordetails SET ?", z, function (err, rows) {

             // connection.release();
             if (err) {
             console.log(err);
             }
             if (!err) {
             console.log("inserted row");
             // console.log(rows);
             console.log("Row no" + rows.insertId);
             }
             });
             });


             connection.on('error', function (err) {
             callback(false);
             return;
             });
             }
             });

             });
             });
             */
        });
    });
});

function saveData(cid,pid,cnt) {
    var lastNodeID;
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(false);
            return;
        }
        connection.query("select count(*) lastnode from db_nodesensordetails where providerID=?",pid, function (err, rows) {
            //lastNodeID = rows[0].lastnode;
            //newID = parseInt((rows[0].lastnode).substring(2,(rows[0].lastnode).length),10);
            console.log(rows[0].lastnode);
            console.log((rows[0].lastnode).substring(1,(rows[0].lastnode).length));
            for(var i=1;i<=cnt;i++) {
                var z = {nodeID: 'N', consumerID: cid, providerID: pid, isActive: 1};
                connection.query("INSERT INTO db_nodesensordetails SET ?", z, function (err, rows) {
                });
            }
        });
    });
}

function getnotificationData(callback) {
    pool.getConnection(function(err,connection){
        if (err) {
            callback(false);
            return;
        }

        var z = "Select consumerID , providerID,reqDate  ,  nodeCount, status  from requestdb ";

        connection.query(z,function(err,rows){
            connection.release();
            if(!err) {
                console.log("Notificatoion list table");
                //result = JSON.stringify(rows);
                //console.log(rows);
                callback(null,rows);
            }
        });

        connection.on('error', function(err) {
            callback(false);
            return;
        });
    });
};


// pricing

io.on('connection',function(socket){
    console.log("A user is connected--Pricing Page:---");

        socket.on('savePrice',function(data){

            console.log("*********************************************************************");
            console.log("Inside Pricing on server.js SAVE CHANGES on click button");
            console.log("key1:"+data.key1);
            console.log("key2:"+data.key2);
            console.log("key3:"+data.key3);
            console.log("key4:"+data.key4);
            console.log("***********************************************************************");


            pool.getConnection(function(err,connection){
                if (err) {
                    callback(false);
                    return;
                }

                // connection.query(" insert into pricedetail insert into pricedetail (providerID,hourlycharges, dailycharges, monthlycharges, yearlycharges)  values( '1', '1','2','3','4')",function(err,rows){
                var tmpPriceData = { providerID:'1',hourlycharges:data.key1, dailycharges:data.key2, monthlycharges:data.key3, yearlycharges:data.key4 };

                connection.query(" insert into pricedetail set ?",tmpPriceData,function(err,rows){
                    connection.release();
                    if(!err) {
                        console.log("abcdefghijklmnopqrstuvwxyz--------");
                        console.log(rows);
                    }
                });
                connection.on('error', function(err) {
                    callback(false);
                    return;
                });
            });

        });

});




// manage sensor html page table
io.on('connection',function(socket){
    console.log("A user is connected manage sensor table.. html page..--");
    getmanagesensorData(function (err, f) {
        socket.emit('showrows3', f);

            socket.on('remove', function(data){
                console.log(data.key2);
                pool.getConnection(function(err,connection){
                    if (err) {
                        callback(false);
                        return;
                    }
                    var autoID = data.key2;
                    console.log("gagan********");
                    console.log(autoID);

                    connection.query('delete from db_nodesensordetails where autoID=?',[autoID],function(err,rows){
                        connection.release();
                        if(err) {
                            console.log(err);
                        }
                    });
                    connection.on('error', function(err) {
                        callback(false);
                        return;
                    });
                });
            });

            socket.on('addsensor',function(data){
                console.log("add inside");
                console.log(data.key1);
                console.log(data.key2);
                console.log(data.key3);
                console.log("---------------");

                pool.getConnection(function(err,connection){
                    if (err) {
                        callback(false);
                        return;
                    }

                    connection.query(" insert into table_name (nodeCount, sensordetails,customerID) values()",function(err,rows){
                        connection.release();
                        if(!err) {
                            console.log("SHAILY...********************************");
                            console.log(rows);
                            //callback(null,rows);
                        }
                    });
                    connection.on('error', function(err) {
                        callback(false);
                        return;
                    });
                });

        });
});
});

function getmanagesensorData(callback) {
    pool.getConnection(function(err,connection){
        if (err) {
            callback(false);
            return;
        }

        connection.query("Select nodeID, consumerID, isActive , autoID from db_nodesensordetails ",function(err,rows){
            connection.release();
            if(!err) {
               // console.log("Manage sensor list table");
                //console.log(rows);
                callback(null,rows);
            }
        });
        connection.on('error', function(err) {
            callback(false);
            return;
        });
    });
};



//Node table on dashboard
io.on('connection',function(socket){
    console.log("A user is connected node table dashbaord wali");

    getdNodeData(function (err, e) {
        socket.emit('showrows2', e);
    });
});

function getdNodeData(callback) {
    pool.getConnection(function(err,connection){
        if (err) {
            callback(false);
            return;
        }

        connection.query("Select nodeID , isActive from db_nodesensordetails where providerID=1 ",function(err,rows){
            connection.release();
            if(!err) {
              //  console.log("Node table on dashboard");
              //  console.log(rows);
                callback(null,rows);
            }
        });
        connection.on('error', function(err) {
            callback(false);
            return;
        });
    });
}


// Consumer list html page table
 io.on('connection',function(socket){
    console.log("A user is connected consumer list ");

        getConsumerData(function (err, c) {
            socket.emit('showrows', c);
        });
});

 function getConsumerData(callback) {
     pool.getConnection(function (err, connection) {
         if (err) {
             callback(false);
             return;
         }

         connection.query("Select pFirstName,consumerID, emailID, Address, contactHome from db_consumer ", function (err, rows) {
             connection.release();
             if (!err) {
                // console.log("Consumer list table");
                 //console.log(rows);
                 callback(null, rows);
             }
         });
         connection.on('error', function (err) {
             callback(false);
             return;
         });
     });
 }


// //deploy sensor html page table
//  io.on('connection',function(socket){
//      console.log("A user is connected");
//
//           getdeploysensorrData(function (err, d) {
//              socket.emit('showrows1', d);
//          });
//  });
//
// function getdeploysensorrData(callback) {
//     pool.getConnection(function(err,connection){
//         if (err) {
//             callback(false);
//             return;
//         }
//
//         connection.query("Select consumerID, nodeID  from db_csubdetail ",function(err,rows){
//             connection.release();
//             if(!err) {
//                 //result = JSON.stringify(rows);
//                 console.log("Deploy sensor html page table");
//                 console.log(rows);
//                 callback(null,rows);
//             }
//         });
//         connection.on('error', function(err) {
//             callback(false);
//             return;
//         });
//     });
// }