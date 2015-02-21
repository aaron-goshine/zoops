/**
 * Created by Aaron.goshine on 30/09/15.
 */
var request = require('request');
var express = require('express');
var livereload = require('express-livereload');
var React = require('React');
var router = express.Router();
var ndjsx = require("node-jsx-babel");


ndjsx.install({
  harmony: true,
  extension: ".jsx"
});


var forward = function (pattern) {
  return function (req, res, next) {
    if (req.url.match(pattern)) {
      var path = req.url.match(pattern)[1]
        , url = ["http://api.zoopla.co.uk", path].join('/');

      res.header('content-type', 'application/json');
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      req.pipe(request[req.method.toLowerCase()](url)).pipe(res);
    } else {
      next();
    }
  }
};

var app = express();
livereload(app, config = {
  watchDir: "dist/"

});
app.use(forward(/\/z\/(.*)/));
app.set('views', "./app/views/");
app.set('view engine', 'jade');


app.use("/", function (req, res) {
  var Server_app = React.createFactory(require("./app/src/Server_app"));
  var markup = React.renderToString(Server_app());
  console.log(markup);
  res.render("index", {markup: markup})

});

//app.use(express.static("dist/"));

var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});



