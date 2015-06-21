var boids = [];
$(function(){
	// fps tracking
	var fps = new Fps('#fps','fps: ');
	// mouse
	var interaction = window.interaction = new Interaction();
	// setup canvas
	var width = window.width = $('body').width();
	var height = window.height = $('body').height();
	var $canvas = $('<canvas></canvas>');
	var canvas = window.canvas = $canvas[0];
	canvas.width = width;
	canvas.height = height;
	var context = window.context = canvas.getContext("2d");
	$('body').append($canvas);

	//generate boids
	function generateBoids(num){
		for (var i=0; i<num; i++) {
			var p = [getRandomArbitrary(width/4, width -(width/4)),
					 getRandomArbitrary(height/4,height-(height/4)),
					 getRandomArbitrary(height/4,height-(height/4))];
			var x = 0;
			while(x==0) {
				x = getRandomArbitrary(-5,5);
			}
			var y = 0;
			while(y==0) {
				y = getRandomArbitrary(-5,5);
			}
			var z = 0;
			while(z==0) {
				z = getRandomArbitrary(-5,5);
			}
			var v = [x,y,z];
			boids.push({
				pos : p,
				vector : v,
				followingNum : 0
			});
		}	
	}

	generateBoids(400);
	var simulateWorker;
	function createWorker(){
		if (window.Worker && useWorker) {
			if(!simulateWorker) {
				simulateWorker = new Worker("src/simulation-worker.js");

				simulateWorker.onmessage = function(e) {
					boids = e.data;
				}

				simulateWorker.postMessage({'boids':boids, 'width':width, 'height':height});
			}
		} else {
			useWorker = false;
		}
	}
	createWorker();

	requestAnimationFrame(function animate(){
		if(toggle) {
			fps.tick();
			render();
			if(!window.Worker || !useWorker){
				simulate();
				if(simulateWorker){
					simulateWorker.terminate();
					simulateWorker = null;
				}
			} else if(window.Worker && useWorker && !simulateWorker){
				createWorker();
			}
		}
		requestAnimationFrame(animate);
	});
});

