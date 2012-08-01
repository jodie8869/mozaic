function point() {
	var param = Array.prototype.slice.call(arguments, 0)[0];
	this._vals = [];
	this._k = 0;
	this._init();

	this._init = function() {
		if (typeof param === "number") {
			this._k = param;
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

	this.print = function() {
		console.log(this._vals.toString(), this._k);
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
}