var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var connection = require('./dbConnectionManager.js');

var expressValidator = require('express-validator'),
    passport = require('passport'),
    crypto = require('crypto');

var index = require('./routes/index');
var users = require('./routes/users');
var register= require('./routes/register');
var consumer= require('./routes/consumer');
var mysql= require('./routes/mysql');

var app = express();
connection.init();
//Authentication
require('./routes/auth')(passport);


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(expressValidator());
app.use(logger('dev'));
app.use(cookieSession({ secret: '@cMpE@8#' , cookie: { maxAge: 60000 }}));
app.use(passport.initialize());
app.use(passport.session());


//app.use('/', index);
app.use('/users', users);
app.use('/register', register);
app.use('/consumer', consumer);
//app.use('/mysql', mysql);

app.use(express.static(path.join(__dirname, 'public')));

app.get("/",function (req,res) {
  res.sendFile(__dirname + '/public/dashboard.html');
})

app.get("/mysql",function (req,res) {
  console.log(' sensor GET server');
  connection.acquire(function (err, connection) {
    connection.query('Select * from sensordb',function (err, docs){
      connection.release();
      if(err) {
        console.log('error occured'+ err);
      }
      //console.log('Sensor get->'+docs);
      res.json(docs);
    })
  })
});


app.get("/requestNode",function(req,res) {
    //console.log("Mera text : " + req.query.consumerID);
    var data = {
        "consumerID": req.query.consumerID,
        "providerID": req.query.providerID,
        "consumerName": req.query.consumerName,
        "nodeCount": req.query.nodeCount,
    }
    var v = parseInt(data.nodeCount,10);
    console.log("val" + v);
    connection.acquire(function (err, connection) {
        connection.query("insert into requestdb(consumerID,providerID,consumerName,nodeCount,requestDate,status)" +
            " values( \'" + data.consumerID + "\',\'" + data.providerID + "\',\'" + data.consumerName + "\'," +
            v + ",now(),0)", function (err, rows) {
            if (err) console.log(err);
            res.json({status: "ok"});
            console.log(rows);
        });
    });
});

app.get("/getUserInfo",function (req,res) {
  console.log(' sensor GET server');
    //console.log(req.query.consumerID);
  connection.acquire(function (err, connection) {
    connection.query("Select * from db_consumer where consumerID = \'" + req.query.consumerID + "\'",function (err, docs){
      connection.release();
      //console.log(docs);
      if(err) {
        console.log('error occured'+ err);
      }
      res.send(docs);
    })
  })
});


app.get("/getProvider",function (req,res) {
  console.log(' sensor GET server');
  connection.acquire(function (err, connection) {
    connection.query("select pFirstName,pLastName, pricedetail.* from db_provider " +
        "left join pricedetail on db_provider.providerID =pricedetail.providerID ",function (err, docs){
      connection.release();
      console.log(docs);
      if(err) {
        console.log('error occured'+ err);
      }
      res.send(docs);
    })
  })
});


app.get("/getNodeDetail",function (req,res) {
    console.log(' sensor GET server');
    connection.acquire(function (err, connection) {
        connection.query("select db_provider.providerID ,pFirstName,pLastName,dateCreated,nodeID " +
            "from db_provider left join db_nodesensordetails on " +
            "db_provider.providerID=db_nodesensordetails.providerID and db_nodesensordetails.isActive=1 ",function (err, docs){
            connection.release();
            console.log(docs);
            if(err) {
                console.log('error occured'+ err);
            }
            res.send(docs);
        })
    })
});


app.get("/getSensorCount",function (req,res) {
    console.log(' sensor GET server');
    console.log(req.query.ID);
    var tmp = req.query.ID;
    connection.acquire(function (err, connection) {
        connection.query("select sum(nodeCount) nc from requestdb group by consumerID having consumerID=\'" + tmp + "\'",function (err, docs){
            connection.release();
            console.log(docs);
            if(err) {
                console.log('error occured'+ err);
            }
            res.send({nodeCount:docs[0].nc});
        })
    })
});


app.get("/deactivateNode",function (req,res) {
    var nodeID = req.query.nodeID;
    console.log(nodeID);
    connection.acquire(function (err, connection) {
        connection.query("update db_nodesensordetails set isActive=false where nodeID=?",[nodeID],function (err, docs){
            connection.release();
            //console.log(docs);
            if(err) {
                console.log('error occured'+ err);
            }
            res.json({message:"ok"});
        })
    })
});

app.get("/Profile",function (req,res) {
  var dataList = req.body;
  dataList.forEach(function (data) {
    var record ={
      "emailID" : data.emailID,
      "orgName" : data.orgname,
      "Address" : data.address,
      "contactOffice" : data.contactOffice,
      "contactHome" : data.contactHome,
      "dateofReg" : new Date.now(),
      "isDeleted" : 0,
      "city" : data.city,
      "state" : data.state,
      "country" : data.country,
      "zip" : data.zip,
      "lname" : data.lname,
      "fname" : data.fname,
     }
  });
  connection.acquire(function (err, connection) {
    connection.query("update db_consumer set ? where consumerID = ?",[record],[req.query.consumerID],function (err, docs){
      connection.release();
      console.log(docs);
      if(err) {
        console.log('error occured'+ err);
      }
      res.send("Saved");
    });
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
