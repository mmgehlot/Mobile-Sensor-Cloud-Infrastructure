var crypto = require('crypto'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose');

var db = mongoose.connection;
mongoose.connect('mongodb://user1:user1@ds151697.mlab.com:51697/cloud281project');
var user = db.collection('user');
var schema = mongoose.Schema;

module.exports=function(passport){
    passport.serializeUser(function(user, done) {
        console.log('serializeUser' + user + ":" + user.username);
        try{
            done(null, user.username);
        } catch(e){
            console.log(e);
            console.log('serializeUser:: ' + user._id + ":" + user.username);
        }
    });

    passport.deserializeUser(function(user_id, done) {

        user.findOne({username: 'test'},function(err,rows){
            if(err) {
                //console.log('deserializeUser' + err);
                return done(err);
            } else {
                //console.log('rows', rows[0]);
                return done(null, (typeof(rows) != "undefined") ? rows : false);
            }
        });
    });

    //console.log('Inside auth');
    try {
        passport.use(new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password'
            }, function (username, password, done) {
                user.findOne({username: username}, function (err, rows) {
                    if (err) {
                        console.log('Error while fetching userauthentication' + err);
                        return done(err);
                    }
                    else if (rows == null || rows == '') {
                        console.log(' ' + err);
                        return done(null, false, {'message': 'No user with this username and password exists.'});
                    }
                    else {
                        console.log(rows);
                        var pass = rows.password;
                        if (pass == password) {
                            return done(null, rows);
                        }
                        return done(null, false, {'message': 'Password Invalid'});
                    }

                });
            }
        ))
    }
    catch(err)
    {console.log(err);
    }
};
