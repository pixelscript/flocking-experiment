function add(point1,point2) {
	var p = copy(point1)
	p[0]+=point2[0];
	p[1]+=point2[1];
	p[2]+=point2[2];
	return p;
};

function subtract(point1,point2) {
	var p = copy(point2)
	p[0]-=point1[0];
	p[1]-=point1[1];
	p[2]-=point1[2];
	return p;
};

function scale(point,val) {
	var p = copy(point);
	p[0]*=val;
	p[1]*=val;
	p[2]*=val;
	return p;
}

function length(point) {
	return Math.sqrt((point[0]*point[0]) + (point[1]*point[1]) + (point[2]*point[2]));
}

function lengthSqr(point) {
	return (point[0]*point[0]) + (point[1]*point[1]) + (point[2]*point[2]);
}

function reverseX(point)  {
	point[0] = 0 - point[0];
	return point;
}

function reverseY(point) {
	point[1] = 0 - point[1];
	return point;
}

function copy(point){
	return [point[0],point[1],point[2]];
}

function reverseZ(point) {
	point[2] = 0 - point[2];
	return point;
}

function getUnit(point,size,l) {
	if(l===undefined){
		l = length(point);
	}
	if(size===undefined) {
		size = 1;
	}
	return [(point[0]/l)*size,(point[1]/l)*size,(point[2]/l)*size];
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

var Fps = function(selector,prefix) {
	this.prefix = prefix;
	this.lastTime = Date.now();
	this.history = [];
	this.div = $(selector);
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
		this.div.html(this.prefix+this.calcAverage().toString());
	}
	
}

Fps.prototype.calcAverage = function(){
	var sum = 0;
	for(var i=0; i<this.history.length; i++){
		sum+=this.history[i];
	}
	return Math.round(sum / this.history.length);
}

var Interaction = function () {
	this.mouse = {'x':0,'y':0,'toggle':false};
	this.mouse.lastPoint = [0,0,0];
	$(window).on('mousemove',$.proxy(this.setMouse,this));
	$(window).on('click',$.proxy(this.clickMouse,this));
}
Interaction.prototype.setMouse = function(e){
	this.mouse.x = e.clientX;
	this.mouse.y = e.clientY;
	this.mouse.newPoint = [this.mouse.x,this.mouse.y,0];
	this.mouse.vector = subtract(this.mouse.lastPoint,this.mouse.newPoint);
	this.mouse.lastPoint = this.mouse.newPoint;
}

Interaction.prototype.clickMouse = function(e){
	this.mouse.toggle = !this.mouse.toggle;
	if(this.mouse.toggle) {
		$('body').addClass('black');
	} else {
		$('body').removeClass('black');
	}
}