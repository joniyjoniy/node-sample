var http = require('http');
var fs   = require('fs');
var ejs  = require('ejs');
var qs   = require('querystring');

var server    = http.createServer();
var settings  = require('./settings');
var variables = require('./variables');
var template  = fs.readFileSync(__dirname + '/public_html/logs.ejs', 'utf-8');

server.on('request', function(req, res) {
  console.log("hoge")
  fs.readFile('./public_html/chat.html', 'utf-8', function(err, data) {
    if (err) {
      console.log("failed access")
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('not found!');
      return res.end();
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    console.log("reach access")
    res.end();
  });
});

server.listen(settings.port, settings.host);
console.log("Http Server listening on port" + settings.port);
