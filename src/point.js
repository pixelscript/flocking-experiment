var Point = function (x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
	return this;
}

Point.prototype.add = function(point) {
	this.x+=point.x;
	this.y+=point.y;
	this.z+=point.z;
	return this;
}