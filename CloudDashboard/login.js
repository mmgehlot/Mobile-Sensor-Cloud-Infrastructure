/**
 * Created by Manmohan Gehlot on 11/28/2016.
 */
var connection = require('./dbConnectionManager');

connection.init();

exports.signIn = function(req,res) {

   //console.log(req.params);


   connection.acquire(function (err, connection) {
      connection.query('Select * from db_login where userID =\'' + username + '\' and password=\'' + password +
          '\' and isDeleted=0',function (err, rows) {
         if(!err && rows.length>0 && userType==='Admin' && rows[0].role==='Admin') {
            console.log("Admin");
            return 'Admin';
         }
         else if(!err && rows.length>0 && userType==='Consumer' && rows[0].role==='Consumer') {
            //res.redirect('/Admin Dashboard.html');
            console.log("Consumer");
            return 'Consumer';
         }
         //else if(!err && rows.length>0 && userType=='Provider' && rows[0].role=='Provider') {
         else if(rows[0].role==='Provider') {
            console.log("Provider");
            return 'Provider';
            //res.redirect('/Admin Dashboard.html');
         }
         //res.redirect('/login.html?error=usernotfound');
      });
   });
}

exports.signup = function (data) {
   connection.acquire(function (err, connection) {
      connection.query('insert into db_login set ?', [data], function (err, res) {
         if(err) console.log(err);
      });
   });
}

exports.deleteUser = function(userID) {
   connection.acquire(function (err, connection) {
      connection.query('UPDATE provider set isActive = ? WHERE id = ? ',[0,userID], function (err, res) {
         if(err) console.log(err);
      });
   });
}

exports.updateUser = function(data,userID) {
   connection.acquire(function (err, connection) {
      connection.query('UPDATE provider set ? WHERE id = ? ',[data,userID], function (err, res) {
         if(err) console.log(err);
      });
   });
}