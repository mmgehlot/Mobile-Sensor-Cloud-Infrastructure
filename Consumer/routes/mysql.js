var router = require('express').Router();
var connection = require('./dbConnectionManager.js');
var app = require('express');
connection.init();

console.log("Mysql Running..");

//Get Sensor Data
router.get('/sensor', function (req, res) {
    console.log(' sensor GET server');
    connection.acquire(function (err, connection) {
        connection.query('Select * from sensordb',function (err, docs){
            connection.release();
            if(err) {
                console.log('error occured'+ err);
            }
        console.log('Sensor get->'+docs);
        res.json(docs);
        })
    })
});

//Get Transaction Data
router.get('/transaction', function (req, res) {
    console.log('transaction GET transaction');
    connection.acquire(function (err, connection) {
        connection.query('Select * from transaction',function (err, docs)
        {
            console.log(docs);
            res.json(docs);
        })
    })
});

//get transaction details of a user
router.get('/transaction/:username', function (req, res) {
    console.log('I received a GET Transaction');
    connection.acquire(function (err, connection) {
        connection.query('Select * from transaction where username = ?',[req.params.username],function (err, docs) {
        console.log(docs);
        res.json(docs);
    })
    })
});

//Insert Transactions after Checkout
router.post('/transaction', function(req, res){
    connection.acquire(function (err, connection){
        console.log("Transactions Received : "+ JSON.stringify(req.body));
        var dataarray=req.body;
        var resarray=[];
        dataarray.forEach(function (data) {
            var datainsert =
            {
                "providerName" : data.providerName,
                "price" : data.sensorPrice,
                "sensorType" : data.sensorType,
                "username" : data.username
            };
            connection.query('insert into transaction SET ?',[datainsert],function (err, doc){
                console.log("Transaction Addition." +JSON.stringify(data));
                resarray.push(doc);
                connection.query('delete from cart where id = ?',[data.id], function (err, docs) {
                    console.log('Item Deleted '+data.id);
                    //res.json(doc);
                });
                //res.json(doc);
            });
        });
        res.status(204);
    });
});

//Get Cart
router.get('/cart/:username', function (req, res) {
    console.log('I received a GET Cart');
    connection.acquire(function (err, connection) {
        connection.query('Select * from cart where username = ?',[req.params.username],function (err, docs) {
        console.log(docs);
        res.json(docs);
        })
    })
});

//Add Sensor Cart (POST)
router.post('/cart/:username', function(req, res){
    console.log('I received a Add Cart' + req.body);
    var data ={
        "sensorId" : req.body.sensorID,
        "sensorType" : req.body.sType,
        "sensorPrice" : req.body.sensorPrice,
        "providerName" : req.body.providerID,
        "username" : req.params.username
    };
    //cart.insert(data, function(err, doc){
    connection.acquire(function (err, connection) {
        connection.query('insert into cart SET ?',[data],function (err, doc) {
        console.log("Addition in cart."+data);
        res.json(doc);
        })
    })
});

//Delete From Cart
router.delete('/cart/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    connection.acquire(function (err, connection) {
        connection.query('delete from cart where id = ?',[req.params.id], function (err, doc) {
        res.json(doc);
        })
    })
});

//To calculate cart total
router.get('/carttotal/:username', function (req, res) {
    console.log('I received a cart server');
    connection.acquire(function (err, connection) {
        connection.query('select count(*) as count from cart where username = ?',[req.params.username],function (err, total){
        console.log("Total: "+total[0].count);
        res.json(total[0].count);
        })
    })
});


//To calculate count of Motion Sensors
router.get('/transaction/motion/:username', function (req, res) {
    console.log('I received a transaction motion');
    connection.acquire(function (err, connection) {
        connection.query('select count(*) as count from transaction where username = ? and sensorType = "Motion"'
            ,[req.params.username],function (err, sensor) {
            console.log("Total: "+sensor[0].count);
            res.json(sensor[0].count);
        })
    })
});

//To calculate count of Temperature Sensors
router.get('/transaction/temperature/:username', function (req, res) {
    console.log('I received a transaction temperature');
    connection.acquire(function (err, connection) {
        connection.query('select count(*) as count from transaction where username = ? and sensorType = "Temperature"'
            ,[req.params.username],function (err, sensor) {
            console.log("Total: "+sensor[0].count);
            res.json(sensor[0].count);
        })
    })
});

//To calculate count of Motion Sensors
router.get('/transaction/humidity/:username', function (req, res) {
    console.log('I received a transaction humidity');
    connection.acquire(function (err, connection) {
        connection.query('select count(*) as count from transaction where username = ? and sensorType = "Humidity"'
            ,[req.params.username],function (err, sensor) {
            console.log("Total: "+sensor[0].count);
            res.json(sensor[0].count);
        })
    })
});

module.exports = router;