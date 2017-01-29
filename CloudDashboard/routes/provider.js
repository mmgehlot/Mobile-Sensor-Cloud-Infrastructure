/**
 * Created by Manmohan Gehlot on 11/27/2016.
 */
var connection = require('./dbConnectionManager.js');
var fs=require('fs');

exports.deployNode =function(nodeID,consumerID) {
    connection.acquire(function (err, connection) {
        connection.query('Select count(*) count from db_nodelist where nodeID like ?', [nodeID + '%'], function (err, result) {
            connection.release();

            var nextID = parseInt(result[0].count, 10) + 1;
            var newNodeID = nodeID + 'N' + nextID;
            //console.log(newNodeID);
            var values = {nodeID:newNodeID,consumerID:consumerID,isActive:1};
            connection.query('insert into db_nodelist set ? ',
                [values],function (err,result) {
                    if(err) console.log(err);
                    fs.stat('../nodeFile/' + newNodeID + '.log', function (err, stat) {
                        if (err !== null) {
                            if (err.code == 'ENOENT') {
                                fs.createReadStream('../nodeFile/TCM.txt').pipe(fs.createWriteStream('../nodeFile/' + newNodeID + '.log'));
                                console.log("Node " + newNodeID + " has deployed");
                                if(err) console.log("Error while inserting record : " + err);
                            }
                        }
                        else
                            console.log("Node is already deployed");
                    });
                });
        });
    });
}


exports.list = function (req,res) {
    connection.query('Select * from provider',function (err,rows) {
        if(err) console.log('Error while querying provider :' + err);
        res.render('provider',{page_title:"Provider - Node.js",data:rows});
    });
}

exports.save = function (req,res) {
    var input = JSON.parse(JSON.stringify(req.body));
    var data = {
        emailid : input.emailid,
        orgName : input.organization,
        pFirstName : input.fname,
        pLastName : input.lname,
        Address : input.add1,
        contactOffice : input.phoneO,
        contactHome : input.phoneH,
        dateofReg : new Date().now,
        city : input.city,
        state : input.state,
        country : input.country,
        zip : input.zip
    }
    connection.query('insert into provider set ?',[data], function (err,rows) {
        if(err) console.log('Error while saving provider record : %s ', err);
        res.redirect('/provider');
    });
}

exports.update = function (req,res) {
    var pid = JSON.parse(JSON.stringify(req.params.id));
    var input = JSON.parse(JSON.stringify(req.body));
    var data = {
        emailid : input.emailid,
        orgName : input.organization,
        pFirstName : input.fname,
        pLastName : input.lname,
        Address : input.add1,
        contactOffice : input.phoneO,
        contactHome : input.phoneH,
        dateofReg : new Date().now,
        city : input.city,
        state : input.state,
        country : input.country,
        zip : input.zip
    }

    connection.query("UPDATE provider set ? WHERE id = ? ",[data,id], function(err, rows)
    {
        if (err) console.log("Error Updating : %s ",err );
        res.redirect('/provider');
    });
}

exports.delete = function (req,res) {
    var id = req.params.id;

    connection.query('delete from provider where providerID = ?',[id], function (err,rows) {
        if(err) console.log('Error while deleting provider :' + err);
        res.redirect('/provider');
    });
}
