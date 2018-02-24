var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
connections= [];

server.listen(process.env.PORT || 3000);
console.log('listening on *:3000');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
})


app.get('/mobile', function(req, res) {
  res.sendFile(__dirname + '/public/mobile.html');
})


app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
  sid = socket.id;
  console.log(sid,'a user connected');

  socket.on('disconnect', function(){

    console.log(sid, 'user disconnected');
  });

 socket.on('blobs', function(msg){
    console.log('message: x', msg.x, 'y', msg.y);
    io.emit('blobs', msg);
   });
});
