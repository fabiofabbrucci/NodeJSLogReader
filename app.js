var port = 8080;
 
var app     = require('express')(), 
    server  = require('http').createServer(app), 
    io      = require('socket.io').listen(server),
    fs      = require('fs'),
    spawn   = require('child_process').spawn;
    
var filename = process.argv[2];
if (!filename) {
    console.log("Usage: node <server.js> <filename>");
    return false;
}

server.listen(port);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  console.log('Client connected');
  var tail = spawn("tail", ["-f", filename]);
 
  tail.stdout.on("data", function (data) {
    console.log('file changed');
    socket.emit('tail', data.toString('utf-8'));
  });
  
});