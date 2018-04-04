
var socket;


var maxX = 0;
var maxY = 0;

var num_blobs = 0;

var MAX_BLOBS = 10;

var blobs = {};

var blob_colours = ['#00ff00',
					'#ff0000',
					'#0000ff',
					'#00ff00',
					'#0e00d',
					'#0f0f00',
					'#e00f55',
					'#505000',
					'#00f0ff',
					'#ffff00'];


var images = {};

var sounds = {};

var hotspots = [];

var maskImage;

function preload(){
	images['reveal1'] = loadImage('assets/reveal.jpeg');
	images['reveal2'] = loadImage('assets/reveal2.jpg');
	images['reveal3'] = loadImage('assets/reveal.gif');

	maskImage = loadImage('assets/mask.png');

	sounds['snd1'] = loadSound('assets/test.mp3');
	sounds['snd2'] = loadSound('assets/test2.mp3');
	sounds['snd3'] = loadSound('assets/test.ogg');
}

function setup(){

  createCanvas(windowWidth, windowHeight);


  var socket = io();

  //colorMode(HSB,100);
  socket.on('blobs', function(msg){
    var newX = map(msg.x, -80, 80, 0, width);
    var newY = map(msg.y, -40, 30, 0, height);
    newx = constrain(newX, )
  	if(msg.id in blobs){
  		blobs[msg.id].update(newX, newY);
  		hotspots.forEach( function(hotspot){

  			if(hotspot.collide(blobs[msg.id].pos)){
  				blobs[msg.id].setCollide(true);
  				console.log("collision:", msg.id, hotspot.pos.x, hotspot.pos.y, blobs[msg.id].collided);
  				hotspot.collidedBlob = msg.id;
  			}else{
  				//blobs[msg.id].collided = false;
  			}
  		

  		});
  	}else{

  		//Create a new blob

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

  hotspots.push(new HotSpot(random(width), random(height), 130, 130, sounds['snd1'], images['reveal1']));
  hotspots.push(new HotSpot(random(width), random(height), 130, 130, sounds['snd2'], images['reveal2']));	
  hotspots.push(new HotSpot(random(width), random(height), 130, 130, sounds['snd3'], images['reveal3']));

 images['reveal1'].mask(maskImage);
 images['reveal2'].mask(maskImage);
 images['reveal3'].mask(maskImage);
 
}

function blobsTimeout(){
	//console.log('checking blobs', millis());
	var blobs_to_remove = [];

	// Remove blobs if they haven't moved after 10s
	for(var key in blobs){
 		if(millis() - blobs[key].lastMoved > 10000){
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
	//image(images['reveal1'], 0, 0); 

	background(1);
	for(var key in blobs){
		blobs[key].show();
	}

	hotspots.forEach(function(hotspot){
		hotspot.show();
	})
}

function Blob(x,y, id, col){
	this.id = id;
	this.pos  = createVector(x,y);
	this.lastMoved = millis();
	this.r = 100;
	this.color = col;
	this.collided = false;

	this.update = function(x,y){
		this.pos.x = x;
		this.pos.y = y;
		this.lastMoved = millis();
		//console.log(this.id, this.x, this.y, this.lastMoved);
	}

	this.setCollide = function(col){
		this.collided = col;
	}

	this.show = function(){
		if(!this.collided){
			//noFill();
	 		//stroke(this.color);
	 		//ellipse(this.pos.x, this.pos.y, this.r);	
	 		image(maskImage, this.pos.x - 70, this.pos.y -70, this.r + 50, this.r +50);	
		}
	 	
	}

}

function HotSpot(x,y, w, h, snd, img){
	this.pos = createVector(x,y);
	this.w = w;
	this.h = h;	
	this.sound = snd;
	this.img = img;
	this.revealed = false;
	this.r = 50;
	this.revealed_count = 0;
	this.collidedBlob = '';
	console.log("hotspot" , x, y);

	this.collide = function(blob_pos){
		var dist = this.pos.dist(blob_pos);
		//console.log('dist', dist);
		if(dist < this.r){
			if(!this.revealed){
				this.revealed = true;
				this.sound.play();
				this.show();		
			}
			
			return true;
		}else{
			if(this.revealed){
				this.revealed = false;
				this.revealed_count++;
				// if been revealed 3 times, pick new spot
				if(this.revealed_count >= 3){
					this.revealed_count = 0;
					this.pos = createVector(random(width), random(height));
				}
				blobs[this.collidedBlob].collided = false;
				this.collidedBlob = '';
			}
			
			return false;
		}

		//var blob_pos = createVector()
	}

	this.show = function () {
		if(this.revealed){
			//console.log('here', this.pos.x, this.pos.y);
			//this.img.mask(maskImage);
			image(this.img, this.pos.x - (this.w)/ 2 , this.pos.y - (this.h)/ 2, this.w, this.h);	
		}
		
	}

}
