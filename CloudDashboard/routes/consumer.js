/**
 * Created by Manmohan Gehlot on 11/27/2016.
 */
/**
 * Created by Manmohan Gehlot on 11/27/2016.
 */
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
