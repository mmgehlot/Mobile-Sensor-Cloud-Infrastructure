/**
 * Created by Manmohan Gehlot on 12/1/2016.
 */
var util=require('util'),
    http=require('http');
var newnode = require('./DataService');

var node = new newnode();

node.startNode('TCM.txt');
//var LISTEN_PORT=3000;

function MyServer(){
    http.Server.call(this, this.handle);
}
util.inherits(MyServer, http.Server);

MyServer.prototype.handle=function(req, res){
    // code
};

MyServer.prototype.start=function(port){
    this.listen(port, function(){
        console.log('Listening for HTTP requests on port %d.', port)
    });
};

MyServer.prototype.stop=function(){
    this.close(function(){
        console.log('Stopped listening.');
    });
};

module.exports=MyServer;
