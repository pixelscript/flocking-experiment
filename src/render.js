var colors = ['#0034FF','#00BBFF','#00FFA8','#1AFF00','#98FF00','#FFF200','#FF6B00','#FF0000']
var twopi = Math.PI*2
function render() {
	context.clearRect(0, 0, canvas.width, canvas.height );
	
	for(var i=0;i<boids.length;i++){
		renderBoid(boids[i]);
	}
}

function renderBoid(boid){
	var zFactor = boid.pos[2]/canvas.height;
	var col = colors[boid.followingNum];
	if(!col) {
		col = colors[colors.length-1];
	}
	context.fillStyle = col;
	context.strokeStyle = col;
	var size = 10*zFactor;
	if(size<=0) {
		size = 1;
	}
	context.beginPath();
	context.arc(boid.pos[0],boid.pos[1],size, 0, twopi, true); 
	context.closePath();
	context.fill();

	var v = getUnit(boid.vector,20);
	context.beginPath();
	context.moveTo(boid.pos[0], boid.pos[1]);
	context.lineTo(boid.pos[0]+v[0], boid.pos[1]+v[1]);
	context.stroke();
}