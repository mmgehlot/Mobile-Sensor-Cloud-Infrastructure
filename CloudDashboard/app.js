var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var geoLoc = require('./routes/GeoLocation');
var providers = require('./routes/provider');
var login = require('./login');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.static('./public'));
//
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('./public'));

app.get("/",function (req,res) {
  res.sendFile(__dirname + '/public/login.html');
});




/*
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


//app.use(express.static(__dirname + '/public'));
*/
//app.use('/', index);
//app.use('/', geoLoc);
//app.use('/country', geoLoc);
//app.use('/state', geoLoc);
//app.use('/users', users);

// catch 404 and forward to error handler
/*
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

app.get('/providers', providers.list);//route add customer, get n post
app.get('/providers/add', providers.save);//route delete customer
app.post('/providers/add', providers.save);//route delete customer
app.get('/providers/delete/:id', providers.delete);//edit customer route , get n post
app.get('/providers/edit/:id', providers.update);
//app.use(app.router);
 */

http.createServer(app).listen(3007, function(){
  console.log('Express server listening on port : 3007');
});

//module.exports = app;
