const
	io = require("socket.io-client"),
	ioClient = io.connect("http://localhost:3000");

//ioClient.on("blobs", (msg) => console.info(msg));

ioClient.on('connect', function() {
	console.log('connected');
	startSending();
});


var PerlinGenerator = require("proc-noise");
var perlin = new PerlinGenerator(); // seeds itself if no seed is given as an argument

var clientId = "fake1";
var x_offset = Math.random() * 100;
var y_offset = Math.random() * 300;


function startSending() {
	setInterval(sendData, 50);
	
}


function pausecomp(millis) {

	var date = new Date();
	var curDate = null;
	do {
		curDate = new Date();
	}
	while (curDate - date < millis);
}

function sendData() {

	var x = Math.floor(pMap(perlin.noise(x_offset), 0, 1, 0, 1280));
	var y = Math.floor(pMap(perlin.noise(y_offset), 0, 1, 0, 720));

	x_offset += 0.01;
	y_offset += 0.01;
	var msg = {
	//	id: clientId,
		x: x,
		y: y
	};
	//client.publish("blobs", msg);
	console.log(msg, x_offset, y_offset);
	ioClient.emit('blobs', msg);
}



function pMap(value, istart, istop, ostart, ostop) {
	let result = ostart + (ostop - ostart) * ((value - istart) / (istop - istart));

	if (result < ostart)
		result = ostart;
	if (result > ostop)
		result = ostop;

	return result;
}