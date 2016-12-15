var http = require('http');
var fs   = require('fs');
var ejs  = require('ejs');
var qs   = require('querystring');

var server    = http.createServer();
var settings  = require('./settings');
var variables = require('./variables');
var ws        = require('./websocket');
var template  = fs.readFileSync(__dirname + '/public_html/logs.ejs', 'utf-8');

ws.runWebSocket();

function renderForm(logs, res) {
  var data = ejs.render(template, {
    logs: logs
  });
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(data);
  res.end();
};

server.on('request', function(req, res) {
  switch ( req.url ) {
  case '/chat':
    fs.readFile('./public_html/chat.html', 'utf-8', function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('not found!');
        return res.end();
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
    console.log("chat");
    break;
  default:
    console.log("hoge");
    break;
  }
  // if (req.method === 'POST') {
  //   req.data = "";
  //   req.on("readable", function() {
  //     req.data += req.read();
  //   });
  //   req.on("end", function(){
  //     var query = qs.parse(req.data);
  //     posts.push(query.name);
  //     renderForm(variables.logs, res);
  //   });
  // } else {
  //   renderForm(variables.logs, res);
  // }

});

server.listen(settings.port, settings.host);
console.log("server listening ...");
