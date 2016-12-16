var http = require('http');
var fs   = require('fs');
var ejs  = require('ejs');
var qs   = require('querystring');
var ws   = require('websocket');

var settings        = require('./settings');
var variables       = require('./variables');
var logs            = variables.logs;
var WebSocketServer = ws.server;
var WebSocketClient = ws.client;

// WebSocket Server for slave
var server = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

function originIsAllowed(origin) {
  return true;
}

function sendData(data, conn) {
  if (conn.connected) {
    conn.sendUTF(JSON.stringify(data));
  }
}

function slave(conn) {
  server.listen(settings.cwsPort, function() {
    console.log((new Date()) + 'WebSocket Server is listening on port ' + settings.cwsPort);
  });

  wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
  });

  wsServer.on('request', function(request) {
    console.log("hoge")
    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    var connection = request.accept();
    console.log((new Date()) + ' Connection accepted.');
    // receive slave message
    connection.on('message', function(message) {
      if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
        connection.sendUTF(message.utf8Data);
        // send slave message to clients

        sendData(message.utf8Data, conn);
      } else {
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
}

// WebSocket Client for front
var client = new WebSocketClient();

client.on('connectFailed', function(error) {
  console.log('Connect Error to ws server : ' + error.toString());
});

client.on('connect', function(connection) {
  console.log('WebSocket Client Connected');
  connection.on('error', function(error) {
    console.log("hoge");
    console.log('Connect Error to ws server : ' + error.toString());
  });
  connection.on('close', function(error) {
    console.log('Connection Closed');
  });
  connection.on('message', function(message) {
    console.log("Received: " + message.utf8Data);
  });
  slave(connection);
});

client.connect('ws://'+ settings.host + ':' + settings.wsPort + '/', 'status-protocol');
