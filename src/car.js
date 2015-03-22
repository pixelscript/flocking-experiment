var Car = function (pos,vector,interaction,renderer,environment) {
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
		if(vector.length()<100) {
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
	this.lookForFriend();

	if(this.following.length!=0) {
		var targetVector = this.vector.copy();
		for(var i=0;i<this.following.length;i++){
			targetVector.add(this.following[i].vector);
		}
		targetVector.scale(1/(this.following.length+1));
		this.vector.x = this.lerp(targetVector.x,this.vector.x,dt*20);
		this.vector.y = this.lerp(targetVector.y,this.vector.y,dt*20);
		this.vector.z = this.lerp(targetVector.z,this.vector.z,dt*20);
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
	
	this.friendFollowing(t);

	this.pos.add(this.vector.copy().scale(t));

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
	context.fillRect(this.pos.x-2, this.pos.y-2, zFactor2,zFactor2);
}