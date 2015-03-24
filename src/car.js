

var Car = function (pos,vector,interaction,renderer,environment,fitness) {
	this.interaction = interaction;
	this.renderer = renderer;
	this.environment = environment;
	this.pos = pos;
	this.originalVector = vector.copy();
	this.vector = vector;
	this.following = [];
	this.colors = ['#0034FF','#00BBFF','#00FFA8','#1AFF00','#98FF00','#FFF200','#FF6B00','#FF0000']
}


Car.prototype.lookForFriend = function () {

	var all = this.environment.cars;
	this.following = [];
	for(var i=0;i<all.length;i++){
		if(all[i]===this){
			continue;
		}
		var vector = new Vector(this.pos,all[i].pos);
		if(vector.length()<50) {
			var unitA = this.vector.getUnit();
			var unitB = all[i].vector.getUnit();
			var unitC = new Vector(this.pos,all[i].pos).getUnit();
			
			var dotProduct = (unitA.x*unitB.x) + (unitA.y*unitB.y) + (unitA.z*unitB.z);
			var dotProduct2 = (unitA.x*unitC.x) + (unitA.y*unitC.y) + (unitA.z*unitC.z);
			if((dotProduct > 0.2)&&(dotProduct2 > 0)){
				this.following.push(all[i]);
			}
			
		}
	}
}

Car.prototype.lerp = function(g,c,dt) {
	var diff = g-c;
	if(diff>dt){
		return c+dt;
	}
	if(diff<-dt){
		return c-dt;
	}
	return g;
}

Car.prototype.friendFollowing = function(dt){

	if(this.following.length!=0) {
		var avHead = new Vector(new Point(0,0,0));
		var avPos = new Point(0,0,0);
		var avSep = new Vector(new Point(0,0,0));
		for(var i=0;i<this.following.length;i++){
			// A computeAlignment
			// A sum all vectors of each friend
			avHead.add(this.following[i].vector);
			// C computeCohesion
			// C sum positions of each friend
			avPos.add(this.following[i].pos);
			// S computeSeparation
			// S sum vectors to each friend
			avSep.add(new Vector(this.pos,this.following[i].pos));
		}
		var fraction = 1/(this.following.length);
		//divide by total
		avHead.scale(fraction);
		avPos.scale(fraction);
		avSep.scale(fraction);

		var aweight = 0.25;
		var cweight = 0.25;
		var sweight = 0.26;
		var mweight = 0.02;

		// A
		var alignment = avHead.getUnit().scale(aweight);
		// C get vector to point
		var cohesion = new Vector(this.pos,avPos).getUnit().scale(cweight);
		// S inverse vector
		var seperation = avSep.scale(-1).getUnit().scale(sweight);

		var mouse = new Vector(this.pos,new Point(this.interaction.mouse.x,this.interaction.mouse.y,this.renderer.height/2)).getUnit().scale(mweight);
		if(this.interaction.mouse.toggle){
			mouse.scale(-1);
		}
		
		var target = alignment.add(cohesion).add(seperation).add(mouse).getUnit(10);

		this.vector.x = this.lerp(target.x,this.vector.x,dt*50);
		this.vector.y = this.lerp(target.y,this.vector.y,dt*50);
		this.vector.z = this.lerp(target.z,this.vector.z,dt*50);
	}


}

Car.prototype.windowEdge = function(){
	if(this.pos.x<0) {
		this.pos.x = this.renderer.width;
	}
	if(this.pos.x>this.renderer.width) {
		this.pos.x = 0;
	}

	if(this.pos.y<0) {
		this.pos.y = this.renderer.height;
	}
	if(this.pos.y>this.renderer.height) {
		this.pos.y = 0;
	}

	if(this.pos.z<=0 || this.pos.z>this.renderer.height) {
		this.vector.reverseZ();
	}
	if(this.pos.z<=0) {
		this.pos.z = 0;
	}
	if(this.pos.z>=this.renderer.height) {
		this.pos.z = this.renderer.height;
	}
}

Car.prototype.tick = function(t){

	this.lookForFriend();
	
	this.friendFollowing(t);

	this.pos.add(this.vector);

	this.windowEdge();

}
Car.prototype.render = function(renderer){
	var context = renderer.context,
		zFactor = this.pos.z/this.renderer.height,
		zFactor2 = 10*zFactor;
	var col = this.colors[this.following.length];
	if(!col) {
		col = this.colors[this.colors.length-1];
	}
	context.fillStyle = col;
	context.strokeStyle = col;
	var size = 10*zFactor;
	context.beginPath();
	context.arc(this.pos.x,this.pos.y,size, 0, Math.PI*2, true); 
	context.closePath();
	context.fill();

	var v = this.vector.getUnit().scale(20);
	context.beginPath();
	context.moveTo(this.pos.x, this.pos.y);
	context.lineTo(this.pos.x+v.x, this.pos.y+v.y);
	context.stroke();
}