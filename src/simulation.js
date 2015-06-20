// lastTime = Date.now();
// dt=1;
function simulate(){
	// var now = Date.now();
	// dt = now - lastTime;
	// lastTime = now;
	for(var i=0;i<boids.length;i++){
		advance(boids[i]);
	}

}

function advance(boid){

	var following = lookForFriends(boid);

	boid.followingNum = following.length;

	calculateHeading(boid,following);

	boid.pos = add(boid.pos,boid.vector);

	windowEdge(boid);

}

 function lookForFriends (boid) {

	var following = [];
	for(var i=0;i<boids.length;i++){
		// oooh friend! boid friend!
		if(boids[i]===boid){
			continue;
		}
		var vector = subtract(boid.pos,boids[i].pos);
		var len = length(vector);
		if(len<50) {
			var unitA = getUnit(boid.vector,1);
			var unitB = getUnit(boids[i].vector,1);
			var unitC = getUnit(vector,1);
			
			var dotProduct = (unitA[0]*unitB[0]) + (unitA[1]*unitB[1]) + (unitA[2]*unitB[2]);
			var dotProduct2 = (unitA[0]*unitC[0]) + (unitA[1]*unitC[1]) + (unitA[2]*unitC[2]);
			if((dotProduct > 0.2)&&(dotProduct2 > 0)){
				following.push(boids[i]);
			}
			
		}
	}
	return following;
}

function calculateHeading(boid,following) {
	if(following.length!=0) {
		var avHead = [0,0,0];
		var avPos = [0,0,0];
		var avSep = [0,0,0];
		for(var i=0;i<following.length;i++){
			// A computeAlignment
			// A sum all vectors of each friend
			avHead = add(avHead,following[i].vector);
			// C computeCohesion
			// C sum positions of each friend
			avPos = add(avPos,following[i].pos);
			// S computeSeparation
			// S sum vectors to each friend
			avSep = add(avSep,subtract(boid.pos,following[i].pos));
		}
		var fraction = 1/(following.length);
		//divide by total
		avHead = scale(avHead,fraction);
		avPos = scale(avPos,fraction);
		avSep = scale(avSep,fraction);

		var aweight = 0.25;
		var cweight = 0.25;
		var sweight = 0.26;
		var mweight = 0.02;

		// A
		var alignment = getUnit(avHead,aweight);
		// C get vector to point
		var cohesion = getUnit(subtract(boid.pos,avPos),cweight);
		// S inverse vector
		var seperation = getUnit(scale(avSep,-1),sweight);

		var mouse = getUnit(subtract(boid.pos,[interaction.mouse.x,interaction.mouse.y,height/2]),mweight);
		if(interaction.mouse.toggle){
			mouse = scale(mouse,-1);
		}
		
		var target = getUnit(add(add(add(alignment,cohesion),seperation),mouse),10);

		boid.vector[0] = lerp(target[0],boid.vector[0],3);
		boid.vector[1] = lerp(target[1],boid.vector[1],3);
		boid.vector[2] = lerp(target[2],boid.vector[2],3);
	}
}

function lerp(g,c,dt) {
	var diff = g-c;
	if(diff>dt){
		return c+dt;
	}
	if(diff<-dt){
		return c-dt;
	}
	return g;
}

function windowEdge(boid){
	if(boid.pos[0]<0) {
		boid.pos[0] = width;
	}
	if(boid.pos[0]>width) {
		boid.pos[0] = 0;
	}

	if(boid.pos[1]<0) {
		boid.pos[1] = height;
	}
	if(boid.pos[1]>height) {
		boid.pos[1] = 0;
	}

	if(boid.pos[2]<=0 || boid.pos[2]>height) {
		reverseZ(boid.vector);
	}
	if(boid.pos[2]<=0) {
		boid.pos[2] = 0;
	}
	if(boid.pos[2]>=height) {
		boid.pos[2] = height;
	}
}