var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var mqtt = require('mqtt');

var client = mqtt.connect('mqtt://localhost')

var idMap = new Map();

var numConnections = 0;

var osc = require("osc");

var udpPort = new osc.UDPPort({
  // This is the port we're listening on.
  localAddress: "127.0.0.1",
  localPort: 9994,

  // This is where sclang is listening for OSC messages.
  remoteAddress: "127.0.0.1",
  remotePort: 9995,
});
// Open the socket.
udpPort.open();

function sendOSC(id, x, y) {

  var msg = {
    address: "/blobs",
    args: [{ type: "s", value: id },
    { type: "i", value: x},
    { type: "i", value: y }]
  };
  console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
  udpPort.send(msg);
}


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
  res.sendFile(__dirname + '/public/mobile.html');
})

app.get('/fake', function(req, res) {
  res.sendFile(__dirname + '/public/fake.html');

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
    //let _x = convertToXY(msg.x, -80, 80, 0, 1280);
    //let _y = convertToXY(msg.y, -40, 30, 0, 720);
    let _x = msg.x;
    let _y = msg.y;
    //let _id = lookupId(socket.id).toString();

    let blob = socket.id + "," + _x.toString() + "," + _y.toString();

    //console.log('message: x', msg.x, 'y', msg.y, blob);
    //console.log(blob);
    sendOSC(socket.id, _x, _y);
    io.emit('blobs', msg);
    client.publish('blobs', blob);
    //detectSound(_x, _y);
  });
});

let sounds = [false, false, false, false];

function detectSound(x, y) {
  console.log(x, y);
  if (x > 165 && x < 370 && y > 418 && y < 620) {
    if (!sounds[0]) {
      sounds[0] = true;
      sendOSC(1, 1);
      setTimeout(function() {
        sendOSC(1, 0);
        sounds[0] = false;
      }, 1000);
    }

  }
}


function convertToXY(value, istart, istop, ostart, ostop) {
  let result = ostart + (ostop - ostart) * ((value - istart) / (istop - istart));

  if (result < ostart)
    result = ostart;
  if (result > ostop)
    result = ostop;

  return Math.floor(result);
}

// sendOSC(0, 1);
// setTimeout(function() {
//   sendOSC(0, 0);
//   sendOSC(1, 1);
//   setTimeout(function() {
//     sendOSC(1, 0);
//   }, 1000);
//   setTimeout(function() {
//     sendOSC(1, 0);
//     sendOSC(2, 1);
//     setTimeout(function() {
//       sendOSC(2, 0);
//       sendOSC(3, 1);
//       setTimeout(function() {
//         sendOSC(3, 0);

//       }, 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);