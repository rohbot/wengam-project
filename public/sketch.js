
var socket;

var pos;

var BALL_SIZE = 50;

function setup(){
  createCanvas(windowWidth, windowHeight);
  var socket = io();
  pos = createVector();
  socket.on('blobs', function(msg){
    console.log(msg);
    pos.x = map(msg.x, 0, 100, 0, width);
    pos.y = map(msg.y, 0, 100, 0, height);

  });
}




function draw(){
 background(51);
 ellipse(pos.x, pos.y, BALL_SIZE, BALL_SIZE);
}
