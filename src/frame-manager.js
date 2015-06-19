var FrameManager = function() {
	this.interaction = new Interaction();
	this.renderer = new Renderer();
	this.env = new Environment(400,this.interaction,this.renderer);
	this.renderer.setEnvironment(this.env);
	this.lastTime = Date.now();
	this.frameCall = this.frame.bind(this);
	this.fps = new Fps();
}

FrameManager.prototype.start = function(){
	this.lastTime = Date.now();
	this.anim = requestAnimationFrame(this.frameCall);	
}

FrameManager.prototype.stop = function(){
	cancelAnimationFrame(this.anim);	
}

FrameManager.prototype.clear = function(){
	this.renderer.clearEvery = !this.renderer.clearEvery;
}
	
FrameManager.prototype.frame = function(){
	var now = Date.now(),
		difference = (now - this.lastTime)/1000;
	this.lastTime = now;
	this.env.tick(difference);
	this.fps.tick();
	this.renderer.render();
	this.anim = requestAnimationFrame(this.frameCall);
}