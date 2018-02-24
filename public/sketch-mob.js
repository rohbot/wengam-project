
var socket;

var pos;

var prev_pos;

function setup(){
  createCanvas(windowWidth, windowHeight);
  socket = io();
  pos = createVector();
  prev_pos = createVector();
  // socket.on('blobs', function(msg){
  //   console.log(msg);
  // });

  background(51);
  textSize(20);

}

function draw(){
  background(51);
  read_tilt();
  text(pos.x, width/2, 100);
  text(pos.y, width/2, 200);
  // text(accelerationZ, width/2, 300);

}

function read_tilt(){
  //reverse them to make sense
  var updated = false;
  var y = int(map(-accelerationX, -40, 40, 0 , 100));
  var x = int(map(accelerationY, -40, 40, 0, 100)) ;
  if(Math.abs(prev_pos.x - x) > 1){
    pos.x = x;
    updated = true;
  }
  if(Math.abs(prev_pos.y - y) > 1){
    pos.y = y;
    updated = true;
  }
  if(updated){
      socket.emit('blobs', { 'x': pos.x, 'y': pos.y });
  }
}

function mouseDragged() {
  ellipse(mouseX, mouseY, 5, 5);
  pos.x = map(mouseX, 0, width, 0 , 100);
  pos.y = map(mouseY, 0, height, 0 , 100);

  socket.emit('blobs', { 'x': pos.x, 'y': pos.y });
  // prevent default
  return false;
}

function keyPressed(){
  background(51);
}
