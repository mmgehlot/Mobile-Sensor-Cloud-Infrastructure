/**
 * Created by Manmohan Gehlot on 11/27/2016.
 */
var router = require('express').Router();
var express = require('express');
var fs = require('fs');
var connection = require('./dbConnectionManager.js');

connection.init();

router.get('/states',function (req,res) {
    connection.acquire(function (err,connection) {
        connection.query('Select * from states', function (err, result) {
            if (err) console.log('Error while getting states list');
            res.json(result);
        });
    });
});

router.get('/cities',function (req,res) {
    connection.acquire(function (err,connection) {
        connection.query('Select * from cities', function (err, result) {
            if (err) console.log('Error while getting cities list');
            res.json(result);
        });
    });
});

router.get('/countries',function (req,res) {
    connection.acquire(function (err,connection) {
        connection.query('Select * from countries', function (err, result) {
            if (err) console.log('Error while getting countries list');
            res.json(result);
        });
    });
});

module.exports = router;