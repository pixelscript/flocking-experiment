var boids = [];
$(function(){
	// fps tracking
	var fps = new Fps();
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
			boids.push(
				{
					pos : p,
					vector : v,
					followingNum : 0
				});
		}	
	}

	generateBoids(400);

	//render
	// render();

	requestAnimationFrame(function animate(){
		if(toggle) {
			fps.tick();
			render();
			simulate();
		}
		requestAnimationFrame(animate);
	})

	// if (window.Worker) {

	// 	var simulate = new Worker("src/simulation.js");

	// 	first.onchange = function() {
	// 		simulate.postMessage([first.value,second.value]);
	// 		console.log('Message posted to worker');
	// 	}

	// 	second.onchange = function() {
	// 		simulate.postMessage([first.value,second.value]);
	// 		console.log('Message posted to worker');
	// 	}

	// 	simulate.onmessage = function(e) {
	// 	  result.textContent = e.data;
	// 	  console.log('Message received from worker');
	// 	}

	// } else {
	// 	console.log('nope');
	// }
});

