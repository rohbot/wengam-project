var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var mqtt = require('mqtt');

var client = mqtt.connect('mqtt://localhost')

var idMap = new Map();

var numConnections = 0;

client.on('connect', function() {
  client.subscribe('hello')
  client.publish('presence', 'Hello mqtt')
})

client.on('message', function(topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})

connections = [];

server.listen(process.env.PORT || 3000);
console.log('listening on *:', process.env.PORT || 3000);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
})


app.get('/mobile', function(req, res) {
  res.sendFile(__dirname + '/public/mobile.html');
})

app.get('/end', function(req, res) {
  res.sendFile(__dirname + '/public/end.html');
})


app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
  sid = socket.id;
  console.log(sid, 'a user connected');

  socket.on('disconnect', function() {

    console.log(sid, 'user disconnected');
  });

  socket.on('moveLeftRight', function(msg) {
    console.log(msg);
  });

  socket.on('colors', function(msg) {
    console.log(msg);
    socket.broadcast.emit('colors', msg);
  });

  socket.on('blobs', function(msg) {
    let _x = convertToXY(msg.x, -80, 80, 0, 1024);
    let _y = convertToXY(msg.y, -40, 30, 0, 768);
    //let _id = lookupId(socket.id).toString();
    
    let blob = socket.id + "," + _x + "," + _y;
    
    //console.log('message: x', msg.x, 'y', msg.y, blob);
    console.log(blob);
    io.emit('blobs', msg);
    client.publish('blobs', blob);
  });
});



function convertToXY(value, istart, istop, ostart, ostop) {
  let result = ostart + (ostop - ostart) * ((value - istart) / (istop - istart));

  if (result < ostart)
    result = ostart;
  if (result > ostop)
    result = ostop;

  return Math.round(result).toString();
}