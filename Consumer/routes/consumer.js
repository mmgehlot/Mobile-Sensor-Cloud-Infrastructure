var router = require('express').Router();
var mongojs = require('mongojs');
var db = mongojs('user1:user1@ds151697.mlab.com:51697/cloud281project');
var consumer = db.collection('consumer');
var transaction = db.collection('transaction');
var sensor = db.collection('sensor');
var cart = db.collection('cart');
var user = db.collection('user');

var session = require('express-session');
var sessionNew;

var express= require('express');



//Get all the list of consumers
router.get('/consumer', function (req, res) {
    console.log('I received a GET request');
    consumer.find(function (err, docs) {
        console.log(docs);
        res.json(docs);
    });
});

//Get consumer based on the id provided
router.get('/consumer/:username', function (req, res) {
    consumer.findOne({"username": req.params.username}, function (err, doc) {
        console.log(doc);
        res.json(doc);
    });
});

//Create Consumer (POST)
router.post('/consumer', function(req, res){
    console.log(req.body);
    consumer.insert(req.body, function(err, doc){
        res.json(doc);
    });
});

//Insert in User Table
router.post('/user', function(req, res){
    console.log(req.body);
    var data =
    {
        "username" : req.body.username,
        "password" : req.body.password
    };
    user.insert(data, function(err, doc){
        console.log("User Addition." +data);
        res.json(doc);
    })

});

//Update Consumer
router.put('/consumer/:id', function (req, res) {
    var id = req.params.id;
    console.log(req.body.name);
    consumer.findAndModify({
            query: {_id: mongojs.ObjectId(id)},
            update: {$set: {custName: req.body.custName, custEmail: req.body.custEmail,
                contactNumber: req.body.contactNumber, dateOfRegistration: req.body.dateOfRegistration,
                subscriptionPlanId: req.body.subscriptionPlanId, organizationName: req.body.organizationName}},
            new: true}, function (err, doc) {
            res.json(doc);
        }
    );
});


//Delete Consumer
router.delete('/consumer/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    consumer.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
        res.json(doc);
    });
});


//get transaction details
router.get('/transaction/:username', function (req, res) {
    console.log('I received a GET request');
    transaction.find({"username": req.params.username},function (err, docs) {
        console.log(docs);
        res.json(docs);
    });
});

//Insert Transactions after Checkout
router.post('/transaction', function(req, res){
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
        transaction.insert(datainsert, function(err, doc){
            console.log("Transaction Addition." +data);
            resarray.push(doc);
            cart.remove({_id: mongojs.ObjectId(data._id)}, function (err, doc) {
                console.log('Item Deleted'+data._id);
                //res.json(doc);
            });
            //res.json(doc);
        });
    });
    res.status(204);
});


//Delete From Transaction
router.delete('/transaction/:id', function (req, res) {
    console.log('Inside delete transaction');
    var id = req.params.id;
    console.log(id);
    transaction.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
        res.json(doc);
    });
});

//Get Sensor Data
router.get('/sensor', function (req, res) {
    console.log('I received a GET server');
    sensor.find(function (err, docs) {
        console.log(docs);
        res.json(docs);
    });
});


//GET Cart
router.get('/cart/:username', function (req, res) {
    console.log('I received a GET server');
    cart.find({"username": req.params.username},function (err, docs) {
        console.log(docs);
        res.json(docs);
    });
});

//To calculate cart total
router.get('/carttotal/:username', function (req, res) {
    console.log('I received a cart server');
    var totalCart;
    cart.find({"username": req.params.username}).count(function (err, total) {
        console.log(total);
        totalCart=total;
        res.json(total);
    });
    //console.log("Total number of items : "+totalCart);
});

//Delete From Cart
router.delete('/cart/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    cart.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
        res.json(doc);
    });
});


//Add Sensor Cart (POST)
router.post('/cart/:username', function(req, res){
    console.log(req.body);
    var data ={ "sensorId" : req.body.sensorId,
                "sensorType" : req.body.sensorType,
                "sensorPrice" : req.body.sensorPrice,
                "providerName" : req.body.providerName,
                 "username" : req.params.username
    };
    cart.insert(data, function(err, doc){
        console.log("Addition in cart."+data);
        res.json(doc);
    })

});

//To calculate count of Motion Sensors
router.get('/transaction/motion/:username', function (req, res) {
    console.log('I received a cart server');
    //var motion;
    transaction.find({"username": req.params.username, "sensorType": "Motion"}).count(function (err, sensor) {
        console.log(sensor);
        //motion=sensor;
        res.json(sensor);
    });
});

//To calculate count of Temperature Sensors
router.get('/transaction/temperature/:username', function (req, res) {
    console.log('I received a cart server');
    transaction.find({"username": req.params.username, "sensorType": "Temperature"}).count(function (err, sensor) {
        console.log(sensor);
        res.json(sensor);
    });
});

//To calculate count of Temperature Sensors
router.get('/transaction/humidity/:username', function (req, res) {
    console.log('I received a cart server');
    transaction.find({"username": req.params.username, "sensorType": "Humidity"}).count(function (err, sensor) {
        console.log(sensor);
        res.json(sensor);
    });
});




module.exports = router;