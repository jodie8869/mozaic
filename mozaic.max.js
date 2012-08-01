(function($) {
	$.fn.mozaic = function () {
		var args = Array.prototype.slice.call(arguments, 0),
			that = $(this),
			params, data;

		if (!that.is("canvas")) {
			throw "Wrong tag for mozaic, please use it on a canvas";
		} 
		
		if (typeof args[0] !== "undefined") {
			params = args[0];
		} else {
			params = {
				width: that.width(),
				height: that.height()
			};
		}
		
	};
})(jQuery);function point() {
	var param = Array.prototype.slice.call(arguments, 0)[0];
	this._vals = [];
	this._k = 0;
	this._init();

	this._init = function() {
		if (typeof param === "number") {
			this._k = param;
			for(var i = 0; i < this._k; i += 1) {
				this._vals.push(0);
			}
		} else {
			this._k = param.length;
			this._vals = param;
		}
	}

	this.at = function(index) {
		if (index >= this._k) {
			throw "Point index out of range (index: "+index+",k: "+this._k+")";
		}
		return this._vals[index];
	}

	this.set = function(index, val) {
		if (index >= this._k) {
			throw "Point index out of range (index: "+index+",k: "+this._k+")";
		}
		this._vals[index] = val;
	}

	this.getK = function() {
		return this._k;
	}

	this.equals = function(p) {
		return (this === p);
	}

	this.lessThan = function(p) {
		var less = true;

		for(var i = 0; i < this._k; i += 1) {
			less &= (vals[i] < p.at(i));
		}

		return less;
	}

	this.print = function() {
		console.log(this._vals.toString(), this._k);
	}
}function kdtree() {
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