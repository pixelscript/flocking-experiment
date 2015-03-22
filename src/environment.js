var Environment = function (num,interaction,renderer) {
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	function getRandomArbitrary(min, max) {
	    return Math.random() * (max - min) + min;
	}

	var cars = this.cars = [];
	for (var i=0; i<num; i++) {
		var p = new Point(getRandomArbitrary(renderer.width/4,renderer.width-(renderer.width/4)),getRandomArbitrary(renderer.height/4,renderer.height-(renderer.height/4)),getRandomArbitrary(renderer.height/4,renderer.height-(renderer.height/4)));
		var x = 0;
		while(x==0) {
			x = getRandomArbitrary(-500,500);
		}
		var y = 0;
		while(y==0) {
			y = getRandomArbitrary(-500,500);
		}
		var z = 0;
		while(z==0) {
			z = getRandomArbitrary(-500,500);
		}
		var v = new Vector(new Point(x,y,z));
		cars.push(new Car(p,v,interaction,renderer,this));
	}
}

Environment.prototype.tick = function(t) {
	var cars = this.cars;
	for (var i=0;i<cars.length;i++) {
		cars[i].tick(t);
	}
}

Environment.prototype.render = function(renderer) {
	var cars = this.cars;
	for (var i=0;i<cars.length;i++) {
		cars[i].render(renderer);
	}
}