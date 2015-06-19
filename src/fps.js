var Fps = function() {
	this.lastTime = Date.now();
	this.history = [];
	this.div = $('#fps');
	this.count = 0;
	this.bound = 100;
}

Fps.prototype.tick = function(){
	var now = Date.now(),
		fps = 1000/(now - this.lastTime);
	this.count++;
	this.history.push(Math.round(fps));
	if(this.history.length>=this.bound) {
		this.history.splice(0,1);
	}
	this.lastTime = now;
	if(this.count>=this.bound){
		this.count = 0;
		this.div.html(this.calcAverage());
	}
	
}

Fps.prototype.calcAverage = function(){
	var sum = 0;
	for(var i=0; i<this.history.length; i++){
		sum+=this.history[i];
	}
	return Math.round(sum / this.history.length);
}