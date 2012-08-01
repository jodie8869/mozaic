function point() {
	var param = Array.prototype.slice.call(arguments, 0)[0];
	this._vals = [];
	this._k = 0;
	this._init();

	// Builds a point with either all values set to 0 if only the dimension is specified
	// else sets its values to be the array of values passed into the function.
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

	// Returns the value at dimension index.
	// @param index Dimension of the value.
	// @return Value at dimension index.
	this.at = function(index) {
		if (index >= this._k) {
			throw "Point index out of range (index: "+index+",k: "+this._k+")";
		}
		return this._vals[index];
	}

	// Replaces the value at dimension index with val.
	// @param index Dimension of the value.
	// @param val Number representing the value at dimension index.
	this.set = function(index, val) {
		if (index >= this._k) {
			throw "Point index out of range (index: "+index+",k: "+this._k+")";
		}
		this._vals[index] = val;
	}

	// Returns true if this point is the same as p.
	// @param p Point that we want to compare this to.
	// @return true if p equals this, false otherwise.
	this.equals = function(p) {
		return (this === p);
	}

	// Returns true if all the values of this is smaller than p's.
	// @param p Point that we want to compare this to.
	// @return true if this has smaller values than p, false otherwise.
	this.lessThan = function(p) {
		var less = true;

		for(var i = 0; i < this._k; i += 1) {
			less &= (vals[i] < p.at(i));
		}

		return less;
	}

	// Returns a String representing the values and the dimension of the point.
	// @return String representing the values and the dimension of the point.
	this.toString = function() {
		return "(" + this._vals.toString()+ ", "+ this._k+ ")";
	}
}
