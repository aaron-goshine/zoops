/**
 * Created by Aaron.goshine on 30/09/15.
 */
var request = require('request');
var express = require('express');
var livereload = require('express-livereload');


var forward = function(pattern){
  return function(req, res, next){
    if(req.url.match(pattern)){
      var path = req.url.match(pattern)[1]
        , url = ["http://api.zoopla.co.uk", path].join('/');

      res.header('content-type', 'application/json');
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      req.pipe(request[req.method.toLowerCase()](url)).pipe(res);
    }else{
      next();
    }
  }
};

var app = express();
livereload(app, config={
 watchDir : "dist/"

});
app.use(forward(/\/z\/(.*)/));
app.use(express.static("dist/"));

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});



