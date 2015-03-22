var Simulate = function (num) {
	var environments = this.environments = [new Environment(50)];
}

Environment.prototype.tick = function() {
	var environments = this.environments;
	for (var i=0;i<environments.length;i++) {
		environments[i].tick();
	}
}