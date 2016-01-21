/**
 * Created by Aaron.goshine on 30/09/15.
 */
var request = require('request');
var express = require('express');
var livereload = require('express-livereload');

var forward = function (pattern) {
  return function (req, res, next) {
    if (req.url.match(pattern)) {
      var path = req.url.match(pattern)[1];
      var url = ['http://api.zoopla.co.uk/', path].join('/');

      res.header('content-type', 'application/json');
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      req.pipe(request[req.method.toLowerCase()](url)).pipe(res);
    } else {
      next();
    }
  };
};

var app = express();

app.use(forward(/\/z\/(.*)/));

app.use(express.static(__dirname + '/public/'));

app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
