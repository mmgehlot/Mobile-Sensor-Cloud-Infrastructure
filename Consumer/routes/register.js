var crypto= require('crypto');
var passport = require('passport');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/login', function(req,res,next)
{
    console.log('Inside POST');
    try {
        passport.authenticate('local', function(err, user, info) {
        console.log('Inside Passport');
            if (err) {
                console.log(err);
                res.status(500).json({status: 500, message: info.message + "Connection Error. Please try again later"});
            }
            if (!user) {
                console.log(err);
                res.status(401).json({status: 401, message: info.message + "Please try again later"});
            }
            req.logIn(user, function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).json({status: 500, message: err + "Please try again later"});
                }
                res.status(200).json({username: user.username, status: 200, message:  "Successfully Logged in"});

            })

    })(req, res, next);
    }
    catch(err)
    {
        console.log(err);
    }


});

module.exports=router;