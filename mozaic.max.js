// @author Efe Karakus
function Point() {
	var param = Array.prototype.slice.call(arguments, 0)[0];
	this._vals = [];
	this._k = 0;

	// Builds a point with either all values set to 0 if only the dimension is specified
	// else sets its values to be the array of values passed into the function.
	this.init = function() {
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
			less &= (this._vals[i] < p.at(i));
		}

		return less;
	}

	// Returns a String representing the values and the dimension of the point.
	// @return String representing the values and the dimension of the point.
	this.toString = function() {
		return "(" + this._vals.toString()+ ", "+ this._k+ ")";
	}
}
// @author Efe Karakus
function KDTree() {
	this._points = Array.prototype.slice.call(arguments, 0)[0];
	this._k = Array.prototype.slice.call(arguments,1)[0];
	this._pointIndex = [];


	// Builds a kdtree with the given points, mainly assigns the correct indices to the array pointIndex
	// such that the median of each subarray represents the root of a subtree.
	this.init = function() {
		var l = this._points.length;
		for(var i = 0; i < l; i += 1) {
			this._pointIndex.push(i);
		}
		this._buildTree(0, l, 0);
	}

	// Searches the kdtree in two steps:
	//
	//	1-	Recursively traverses the tree to find the hyperrectangle that could be dimensionally closer to
	//		the target point, this is done with a regular BST search functionality. 
	//
	//	2-	Backup to check if parent is closer to target point, if so we gotta search for the points that are 
	//		now within radius of the parent point.
	//
	// @param target Point that we want to find nearest neighbor to.
	// @return Point in this._points that is closest to target.
	this.findNearestNeighbor = function(target) {
		if (this._points.length === 0) {
			return null;
		}

		var start = 0, end = this._points.length, d = 0,
			median = Math.floor( (start+end)/2 ),
			medianIndex = this._pointIndex[median],
			best = this._points[medianIndex];
		return this._nn(target, best, start, end, d);
	}

	// Builds the tree recursively by sorting each subarray and partitioning it into two again.
	// @param start Number representing the start index for pointIndex.
	// @param end Number representing the end index for pointIndex.
	// @param d Number representing the current dimension that we are on the tree.
	this._buildTree = function(start, end, d) {
		var median;

		if (end-start <= 0) {
			return;
		}

		this._sort(start,end,d);
		median = Math.floor( (start+end)/2 );
		d = (d+1) % this._k;
		
		this._buildTree(start, median-1, d);
		this._buildTree(median+1, end, d);
	}

	// Sorts pointIndex using Array.sort() hence mergesort between the indices start and end on dimension d.
	// @param start Number representing the start index for pointIndex.
	// @param end Number representing the end index for pointIndex.
	// @param d Number representing the dimension on which we want to sort at.
	this._sort = function(start, end, d) {
		var subArray = this._pointIndex.slice(start, end),
			l = subArray.length,
			that = this;

		subArray.sort(function(i1, i2) { 
			return that._smallerDimVal(that._points[i1], that._points[i2], d);
		});

		for (var i = 0; i < l; i += 1) {
			this._pointIndex[start + i] = subArray[i];
		}
	}

	// Nearest Neighbor algorithm on kdtrees.
	// Recurse down dimensions to find the best hyperrectangle.
	// Recurse backup to find the closest points within the radius of the best hyperrectangle.
	//
	// @param target Point that we want to find nearest neighbor to.
	// @param currentBest Point that represents the closest point to target so far.
	// @param start Number representing the start index of the subarray.
	// @param end Number representing the end index of the subarray.
	// @param d Number representing the dimension that we are on.
	// @return Point in this._points that is closest to target.
	this._nn = function(target, currentBest, start, end, d) {
		var median = Math.floor( (start+end)/2 ),
			medianIndex = this._pointIndex[median],
			root = this._points[medianIndex],
			radius,
			rc, lc,
			rcIndex, lcIndex,
			childDistance;

		if (typeof root === "undefined") {
			return currentBest;
		}

		// leaf node
		if (end-start <= 0) {
			if (this._shouldReplace(target, currentBest, root)) {
				return root;
			}  
			return currentBest;
		} else {
			if (this._smallerDimVal(target, root, d)) {
				// search the left subtree
				currentBest = this._nn(target, currentBest, start, median-1, (d+1)%this._k);
				if (!this._shouldReplace(target, currentBest, root)) {
					return currentBest;
				}
				currentBest = root;

				radius = this._distance(target, currentBest); 
				rc = Math.floor( (median+1+end)/2 );
				if (this._isInBounds(rc)) {
					rcIndex = this._pointIndex[rc];
					childDistance = this._distance(target, this._points[rcIndex]);
					if (childDistance < radius) {
						currentBest = this._nn(target, currentBest, median+1, end, (d+1)%this._k);
					}
				}
				return currentBest;
			} else {
				// search the right subtree
				currentBest = this._nn(target, currentBest, median+1, end, (d+1)%this._k);
				if (!this._shouldReplace(target, currentBest, root)) {
					return currentBest;
				}
				currentBest = root;

				radius = this._distance(target, currentBest);
				lc = Math.floor( (start+median-1)/2 );
				if (this._isInBounds(lc)) {
					lcIndex = this._pointIndex[lc];
					childDistance = this._distance(target, this._points[lcIndex]);

					if (childDistance < radius) {
						currentBest = this._nn(target, currentBest, start, median-1, (d+1)%this._k);
					}					
				}

				return currentBest;
			}
		}


	}

	// Returns true if the value of point a in dimension d is smaller than the value of point b in dimension d.
	//
	// @param a Point that we want to compare.
	// @param b Point that we want to compare.
	// @param d Number represensting the dimension of the value.
	// @return true if point a has a smaller value than b in dimension d.
	this._smallerDimVal = function(a, b, d) {
		return (a.at(d) < b.at(d));
	}

	// Returns true if the potential point is closer to the target point.
	// @param target Point that we want to find the distance to.
	// @param currentBest Point that is currently the closest to target in the tree.
	// @param potential Point that can potentially be closer to target than currentBest.
	// @return true if potential is closer to target than currentBest.
	this._shouldReplace = function(target, currentBest, potential) {
		var tcDist = this._distance(target,currentBest);
		var tpDist = this._distance(target,potential);

		return (tcDist === tpDist) ? potential.lessThan(currentBest) : (tpDist < tcDist);
	}

	// Computes the Euclidian distance between points a and b.
	// @param a Point that represents the start.
	// @param b Point that represents the end.
	// @return Number that represents the distance between points a and b.
	this._distance = function(a, b) {
		var dist = 0.0;

		for(var i = 0; i < this._k; i += 1) {
			dist += (a.at(i) - b.at(i))*(a.at(i) - b.at(i));
		}

		return dist;
	}

	// Returns true if the given index is within the size of this._points.
	// @param index Number that we want to find if its in bounds.
	// @return true if index is in bounds, false otherwise.
	this._isInBounds = function(index) {
		return ((index >= 0) && (index < this._points.length));
	}

	// Returns a string that represents the tree in a level-by-level fashion.
	// @return String representing the kdtree.
	this.toString = function() {
		var str = "",
			l = this._pointIndex.length, 
			start = 0, end = l,
			index, node;

		if (end-start <= 0) {
			return "The tree is empty (>^.^)>";
		}

		for(var i=0; i < l; i += 1) {
			index = this._pointIndex[i];
			node = this._points[index];
			str += node.toString() + " ";
		}
		return str;
	}
}
// @author Efe Karakus
function SourceCanvas() {
	this.width = 0;
	this.height = 0;
	this.src = 0;
	this.data = [];

	// Builds a Source Canvas object, where data contains Points at x,y coordinate.
	// @param canvas Canvas element from the DOM on which .mozaid() was called.
	this.init = function(canvas) {
		var context = canvas.getContext('2d'), imageData, l;
		this.width = canvas.width;
		this.height = canvas.height;
		this.src = canvas.src;
		imageData = context.getImageData(0,0, this.width, this.height).data;
		l = imageData.length;
		console.log(l);

		for (var i = 0; i < l; i += 4) {
			var r = imageData[i];
			var g = imageData[i + 1];
			var b = imageData[i + 2];

			var p = new Point([r,g,b]);
			p.init();
			this.data.push(p);
		}
	}

	// Returns the point at coordinate x,y.
	// @param x Number representing the x coordinate of the point.
	// @param y Number representing the y coordinate of the point.
	// @return Point at coordinate x,y.
	this.getPoint = function(x,y) {
		if ((x < 0 || x >= this.width) || (y < 0 || y >= this.height)) {
			throw "x,y coordinates out of bounds <(*.*)>";
		} 
		var index = (this.width * y) + x;
		return this.data[index];
	}

	// Returns a string representing the points in the source canvas.
	// @return String that describes the points in the source canvas.
	this.toString = function() {
		var str = "";
		if (this.width === 0 || this.height === 0) {
			return "Image has no width or height (>^.^<)";
		}

		for (var x = 0; x < this.width; x += 1) {
			for (var y = 0; y < this.height; y += 1) {
				str += this.getPoint(x,y).toString() + " ";
			}
			str += "\n";
		}

		return str;
	}
}// @author Efe Karakus
function TileImage() {
	this._data = [];
	this._avgPoint = null;

	// Builds a tile image based on a single data given from the JSON object.
	// @param data Array of RGB values constituting a tile.
	this.init = function(data) {
		var l, 
			sumR = 0, sumG = 0, sumB = 0,
			avgR = 0, avgG = 0, avgB = 0;

		this._data = data;
		l = this._data.length;
		for (var i = 0; i < l; i += 1) {
			sumR += this._data[i][0];
			sumG += this._data[i][1];
			sumB += this._data[i][2];
		}

		avgR = Math.floor(sumR/l);
		avgG = Math.floor(sumG/l);
		avgB = Math.floor(sumB/l);

		this._avgPoint = new Point([avgR, avgG, avgB]);
		this._avgPoint.init();
	}	

	// Returns an array of RGB values representing the tile.
	// @return Array of RGB values representing the tile.
	this.getData = function() {
		return this._data;
	}

	// Returns a Point with values the average of RGB of the whole tile.
	// @return Point with values the average of RGB of the whole tile.
	this.getAvgPoint = function() {
		return this._avgPoint;
	}
}// @version 1.0.0
// @author Efe Karakus
(function($) {
	$.fn.mozaic = function () {
		var args = Array.prototype.slice.call(arguments, 0),
			that = this,
			param, data,
			canvas = that[0],
			sourceCanvas;

		if (!that.is("canvas")) {
			throw "Wrong tag for mozaic, please use it on a canvas (-I.I-)";
		} 
		
		if (typeof args[0] !== "undefined") {
			param = args[0];
			if (typeof param.data === "string") {
				$.getJSON(param.data, function(json){
				 	data = json;
					console.log(json);
				});
			} else {
				data = param.data
			}
		} else {
			throw "Please provide a data set <(*.*<)";
		}

		sourceCanvas = new SourceCanvas();
		sourceCanvas.init(canvas);
	};
})(jQuery);
