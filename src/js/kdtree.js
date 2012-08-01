function kdtree() {
	var param = Array.prototype.slice.call(arguments, 0)[0];
	this._points = [];
	this._pointIndex = [];
	this._init();

	this._init = function() {
		
	}

	this.smallerDimVal = function(a, b, d) {
		return (a.at(d) < b.at(d));
	}

	this.shouldReplace = function(target, currentBest, potential) {
		var tcDist = this._distance(target,currentBest);
		var tpDist = this._distance(target,potential);

		return (tcDist === tpDist) ? potential.lessThan(currentBest) : (tpDist < tcDist);
	}

	this._distance = function(a, b) {
		var k = a.getK(),
			dist = 0;

		for(var i = 0; i < k; i += 1) {
			dist += (a.at(i) - b.at(i))*(a.at(i) - b.at(i));
		}

		return dist;
	}
}