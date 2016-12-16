var http            = require('http');
var qs              = require('querystring');
var settings        = require('./settings');
var variables       = require('./variables');
var WebSocketServer = require('websocket').server;

var server = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(settings.wsPort, function() {
  console.log((new Date()) + 'WebSocket Server is listening on port ' + settings.wsPort);
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  return true;
}

wsServer.on('request', function(request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }
  var connection = request.accept('status-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    }
    else {
      console.log((new Date()) + "unknown");
    }
  });
  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

server.on("connection", function(socket) {
  socket.on("message", function(data) {
    var data = JSON.parse(data);
    data = JSON.stringify(data);
    console.log("\033[96m" + data + "\033[39m");
  });
});
