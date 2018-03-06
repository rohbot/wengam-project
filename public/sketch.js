
var socket;

var pos;


var maxX = 0;
var maxY = 0;

var num_blobs = 0;

var MAX_BLOBS = 10;

var blobs = {};

var blob_colours;

function Blob(x,y, id, col){
	this.id = id;
	this.x = x;
	this.y = y;
	this.lastMoved = millis();
	this.r = 50;
	this.color = col;

	this.update = function(x,y){
		this.x = x;
		this.y = y;
		this.lastMoved = millis();
		//console.log(this.id, this.x, this.y, this.lastMoved);
	}

	this.show = function(){
	 	fill(this.color);
	 	ellipse(this.x, this.y, this.r, this.r);	

	}

}

function setup(){

  createCanvas(windowWidth, windowHeight);
  blob_colours = [	'#00ff00',
					'#ff0000',
					'#0000ff',
					'#00ff00',
					'#0e00d',
					'#0f0f00',
					'#e00f55',
					'#505000',
					'#00f0ff',
					'#ffff00'];


  var socket = io();

  //colorMode(HSB,100);
  socket.on('blobs', function(msg){
    var newX = map(msg.x, -80, 80, 0, width);
    var newY = map(msg.y, -40, 30, 0, height);
    newx = constrain(newX, )
  	if(msg.id in blobs){
  		blobs[msg.id].update(newX, newY);
  	}else{
  		// Set a different color for each blob


  		blobs[msg.id]  = new Blob(newX, newY, msg.id, color(blob_colours[num_blobs]));
  		console.log('New Blob', msg.id );
  		var data =  {'id': msg.id, 'color': blob_colours[num_blobs] };
  		console.log(data);
  		socket.emit('colors',data);
  		num_blobs++;
  		if(num_blobs > 9){
  			num_blobs = 0;
  		}
  	}
    //console.log(msg);
    

    
    
  });
}

function blobsTimeout(){
	//console.log('checking blobs', millis());
	var blobs_to_remove = [];

	for(var key in blobs){
 		if(millis() - blobs[key].lastMoved > 3000){
 			console.log('Removing', key);
 			blobs_to_remove.push(key);	

 		}
 	}	 
 	
 	blobs_to_remove.forEach(function(key){
 		console.log(delete blobs[key]);
	 	console.log(blobs, key); 	

 	});

 	}


setInterval(blobsTimeout, 1000);


function draw(){
background(51);
 for(var key in blobs){
 	blobs[key].show();
 	//var blob = blobs[key];
 	//console.log(key, blob);
 	//blob.show();
 }
 
}
