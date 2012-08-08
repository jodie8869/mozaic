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
			less &= (this.at(i) < p.at(i));
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
		this._buildTree(0, l-1, 0);
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

		var start = 0, end = this._points.length - 1, d = 0,
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

		var subArray = this._pointIndex.slice(start, end+1),
			l = subArray.length,
			that = this;

		subArray.sort(function(i1, i2) { 
			if (that._smallerDimVal(that._points[i1], that._points[i2], d) ) {
				return -1;
			} else {
				return 1;
			}
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
			radius, dDistance;

		if (start > end) {
			return currentBest;
		}

		// leaf node
		if (end-start === 0) {
			if (this._shouldReplace(target, currentBest, root)) {
				return root;
			}  
			return currentBest;
		} else {
			if (this._smallerDimVal(target, root, d)) {
				// search the left subtree
				currentBest = this._nn(target, currentBest, start, median-1, (d+1)%this._k);
				if (this._shouldReplace(target, currentBest, root)) {
					currentBest = root;
				}

				radius = this._distance(target, currentBest); 
				dDistance = (target.at(d)-root.at(d))*(target.at(d)-root.at(d));

				if (dDistance <= radius) {
					currentBest = this._nn(target, currentBest, median+1, end, (d+1)%this._k);
				}
			} else {
				// search the right subtree
				currentBest = this._nn(target, currentBest, median+1, end, (d+1)%this._k);
				if (this._shouldReplace(target, currentBest, root)) {
					currentBest = root;
				}
				
				radius = this._distance(target, currentBest);
				dDistance = (target.at(d)-root.at(d))*(target.at(d)-root.at(d));

				if (dDistance <= radius) {
					currentBest = this._nn(target, currentBest, start, median-1, (d+1)%this._k);
				}
			}
			return currentBest;
		}


	}

	// Returns true if the value of point a in dimension d is smaller than the value of point b in dimension d.
	//
	// @param a Point that we want to compare.
	// @param b Point that we want to compare.
	// @param d Number represensting the dimension of the value.
	// @return true if point a has a smaller value than b in dimension d.
	this._smallerDimVal = function(a, b, d) {
		if (a.at(d) === b.at(d)) {
			return a.lessThan(b);
		} else {
			return (a.at(d) < b.at(d));
		} 
	}

	// Returns true if the potential point is closer to the target point.
	// @param target Point that we want to find the distance to.
	// @param currentBest Point that is currently the closest to target in the tree.
	// @param potential Point that can potentially be closer to target than currentBest.
	// @return true if potential is closer to target than currentBest.
	this._shouldReplace = function(target, currentBest, potential) {
		var tcDist = this._distance(target,currentBest);
		var tpDist = this._distance(target,potential);

		if (tcDist === tpDist) {
			return potential.lessThan(currentBest);
		} else {
			return (tpDist < tcDist);
		} 
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
	this._tileWidth = 0;
	this._tileHeight = 0;
	this._numRows = 0;
	this._numCols = 0;

	// Builds a Source Canvas object, where data contains Points at x,y coordinate.
	// @param canvas Canvas element from the DOM on which .mozaid() was called.
	// @param tileWidth Number representing the width of a tile.
	// @param tileHeight Number representing the height of a tile.
	this.init = function(canvas, tileWidth, tileHeight) {
		if (tileWidth === 0 || tileHeight === 0) {
			throw "The width or height of a tile can not be 0 (>#.#<)";
		}

		var context = canvas.getContext('2d'), imageData, l;
		this.width = canvas.width;
		this.height = canvas.height;
		this.src = canvas.src;
		imageData = context.getImageData(0,0, this.width, this.height).data;
		l = imageData.length;

		for(var y = 0; y < this.height; y += 1) {
			for(var x = 0; x < this.width; x += 1) {
				var r = imageData[((this.width*y)+x)*4];
				var g = imageData[((this.width*y)+x)*4 + 1];
				var b = imageData[((this.width*y)+x)*4 + 2];

				var p = new Point([r,g,b]);
				p.init();
				this.data.push(p);				
			}
		}


		this._tileWidth = tileWidth;
		this._tileHeight = tileHeight;
		this._numCols = Math.floor(this.width/tileWidth);
		this._numRows = Math.floor(this.height/tileHeight);
	}

	// Returns the number of rows necessary for creating a source image of tiles.
	// @return Number representing the number of rows necessary for creating a source image of tiles.
	this.getNumRows = function() {
		return this._numRows;
	}

	// Returns the number of columns necessary for creating a source image of tiles.
	// @return Number representing the number of columns necessary for creating a source image of tiles.
	this.getNumCols = function() {
		return this._numCols;
	}

	// Returns the point at coordinate x,y.
	// @param x Number representing the x coordinate of the point.
	// @param y Number representing the y coordinate of the point.
	// @return Point at coordinate x,y.
	this.getPoint = function(x,y) {
		if ((x < 0 || x >= this.width) || (y < 0 || y >= this.height)) {
			return null;
		} 
		var index = (this.width * y) + x;
		return this.data[index];
	}

	// Returns all the average point of each tile.
	// @return Array of average points of each tile.
	this.getAvgPoints = function() {
		var avgPoints = [];

		for(var row = 0; row < this._numRows; row += 1) {
			for(var col = 0; col < this._numCols; col += 1) {
				var points = this._getTilePoints(row,col),
					l = points.length,
					sumR = 0, sumG = 0, sumB = 0,
					point, avgPoint;
					avgR = 0, avgG = 0, avgB = 0;

				for(var i = 0; i < l; i += 1) {
					point = points[i];
					sumR += point.at(0);
					sumG += point.at(1);
					sumB += point.at(2);
				}

				avgR = Math.floor(sumR/l);
				avgG = Math.floor(sumG/l);
				avgB = Math.floor(sumB/l);

				avgPoint = new Point([avgR, avgG, avgB]);
				avgPoint.init();

				avgPoints.push(avgPoint);
			}
		}
		return avgPoints;
	}

	// Returns an array of Points that are under the tile at row,col.
	// @param row Number representing the row of the tile.
	// @param col Number representing the col of the tile.
	this._getTilePoints = function(row, col) {
		var points = [];
		for(var yi = 0; yi < this._tileHeight; yi += 1) {
			for(var xi = 0; xi < this._tileWidth; xi += 1) {
				var x = (this._tileWidth)*col + xi,
					y = (this._tileHeight)*row + yi,
					point;
				point = this.getPoint(x,y);

				if (point === null) {
					continue;
				}
				points.push(point);
			}
		}
		return points;
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
}
// @author Efe Karakus
function TileImage() {
	this._data = [];
	this._avgPoint = null;
	this._width = 0;
	this._height = 0;

	// Builds a tile image based on a single data given from the JSON object.
	// @param data Array of RGB values constituting a tile.
	this.init = function(data, width, height) {
		var l, 
			sumR = 0, sumG = 0, sumB = 0,
			avgR = 0, avgG = 0, avgB = 0;

		this._data = data;
		this._width = width;
		this._height = height;

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

	// Returns the width of the tile image.
	// @return Number representing the width of the tile image.
	this.getWidth = function() {
		return this._width;
	}

	// Returns the height of the tile image.
	// @return Number representing the height of the tile image.
	this.getHeight = function() {
		return this._height;
	}

	// Returns a String representing the average point of the tile.
	// @return String representing the average point of the tile.
	this.toString = function() {
		return this._avgPoint.toString();
	}
}
// @author Efe Karakus
function Tiles() {
	this._tiles = [];
	this._width = 0;
	this._height = 0;
	this._avgToIndex = {};

	// Builds a TileImage array of all the tiles given to us from the data file.
	// @param data Array of RGB Arrays composing a tile.
	// @param width Number representing the width of a tile.
	// @param height Number representing the height of a tile.
	this.init = function(data, width, height) {
		var l = data.length;

		this._width = width;
		this._height = height;
		for (var i = 0; i < l; i += 1) {
			var tileImage = new TileImage(),
				avgPoint = null;
			
			tileImage.init(data[i], width, height);
			this._tiles.push(tileImage);
			
			avgPoint = tileImage.getAvgPoint();
			this._avgToIndex[avgPoint] = i;
		}
	}

	// Returns the array of tile images.
	// @return Array of tile images.
	this.getTiles = function() {
		return this._tiles;
	}

	// Returns the tile image with its average point being avgPoint.
	// @param avgPoint Point representing the average RGB values of a tile.
	// @return TileImage with its average point being avgPoint.
	this.getTile = function(avgPoint) {
		var index;
		if (!(avgPoint in this._avgToIndex)) {
			return null;
		} 
		index = this._avgToIndex[avgPoint];
		return this._tiles[index];
	}

	// Returns all the average points of the tiles.
	// @return Array of Points representing the RGB values of each tile.
	this.getAvgPoints = function() {
		var points = [];
		for (var i = 0; i < this._tiles.length; i += 1) {
			var point = this._tiles[i].getAvgPoint();
			points.push(point);
		}
		return points;
	}

	// Returns a String that represents all the tiles available.
	// @return String that represents all the tiles available.
	this.toString = function() {
		var l = this._tiles.length;
		var str = "";

		for(var i = 0; i < l; i += 1) {
			str += this._tiles[i].toString() + " ";
		}

		return str;
	}
}
// @author Efe Karakus
function MozaicCanvas() {
	this._rows = 0;
	this._cols = 0;
	this._tiles = [];

	// Builds a 2D array of empty TileImages.
	// @param rows Number of image rows in the Mozaic.
	// @param cols Number of image columns in the Mozaic.
	this.init = function(rows, cols) {
		this._rows = rows;
		this._cols = cols;

		for(var row = 0; row < this._rows; row += 1) {
			this._tiles.push([]);
			for(var col = 0; col < this._cols; col += 1) {
				this._tiles[row].push(null);
			}
		} 
	}

	// Returns the tile located at row and col.
	// @param row Number representing the row of the tile image.
	// @param col Number representing the colum of the tile image.
	// @return TileImage at coordinate row,col.
	this.getTile = function(row, col) {
		if ((row < 0 || row >= this._rows) || (col<0 || col >= this._cols)) {
			return null;
		}
		return this._tiles[row][col];
	}

	// Inserts a TileImage at location row,col.
	// @param row Number representing the row of the tile image.
	// @param col Number representing the column of the tile image.
	// @param tile TileImage that we want to insert into the mozaic.
	this.setTile = function(row, col, tile) {
		if ((row < 0 || row >= this._rows) || (col<0 || col >= this._cols)) {
			throw "getTile out of range <(&.&)>";
		}
		this._tiles[row][col] = tile;		
	}

	// Draws the tiles into the canvas.
	// @param canvas Canvas Element that we want to draw the image to.
	this.draw = function(canvas) {

		var context = canvas.getContext('2d'), 
			width = canvas.width,
			height = canvas.height,
			imageData = null;
		context.clearRect(0,0, width, height);
		imageData = context.createImageData(width, height);

		for(var row = 0; row < this._rows; row += 1) {
			for(var col = 0; col < this._cols; col += 1) {
				var tile = this.getTile(row,col),
					tileData = tile.getData(),
					tileWidth = tile.getWidth(),
					tileHeight = tile.getHeight();

				for (var i = 0; i < tileData.length; i += 1) {
					var x = (col*tileWidth) + (i % tileWidth),
						y = (row*tileHeight) + Math.floor(i/tileWidth),
						rgb = tileData[i];

					if (x >= width || y >= height) {
						continue;
					}
					this._setPixel(imageData, x, y, rgb);
				}
			}
		}

		context.putImageData(imageData, 0, 0);
	}

	// Places the rgb values into the x,y coordinates in imageData.
	// @param imageData Array of rgba values.
	// @param x Number representing the x coordinate of the rgb value.
	// @param y Number representing the y coordinate of the rgb value.
	// @param rgb Array of red, green, blue values.
	this._setPixel = function(imageData, x, y, rgb) {
		var index = ((y*imageData.width) + x) * 4;
		imageData.data[index + 0] = rgb[0];
		imageData.data[index + 1] = rgb[1];
		imageData.data[index + 2] = rgb[2];
		imageData.data[index + 3] = 255;	// no opacity
	}
}
// @version 1.0.0
// @author Efe Karakus
(function($) {
	$.fn.mozaic = function () {
		var args = Array.prototype.slice.call(arguments, 0),
			that = this,
			param, data,
			canvas = that[0],
			sourceCanvas,
			sourcePoints,
			tiles,
			tilesPoints,
			kdTree,
			numRows, numCols,
			mozaicCanvas;

		if (!that.is("canvas")) {
			throw "Wrong tag for mozaic, please use it on a canvas (-I.I-)";
		} 

		if (typeof args[0] !== "undefined") {
			param = args[0];
			if (typeof param.data === "string") {
				$.ajax({
					url: param.data,
					type: 'GET',
					dataType: "json",
					async: false,
					success: function(json) {
				 		data = json;
					},
					error: function(e ,msg) {
						if(msg === "error") {
							throw "Error occured while reading the data file " + param.data;
						} else {
							data = $.parseJSON(e.responseText.toString());
						}
					}
				});
			} else {
				data = param.data
			}
		} else {
			throw "Please provide a data set <(*.*<)";
		}
		
		
		// build the source canvas
		sourceCanvas = new SourceCanvas();
		sourceCanvas.init(canvas, data.width, data.height);
		sourcePoints = sourceCanvas.getAvgPoints();

		// build the tile images
		tiles = new Tiles();
		tiles.init(data.data, data.width, data.height);
		tilesPoints = tiles.getAvgPoints();

		// set up the kd tree
		kdTree = new KDTree(tilesPoints, 3);
		kdTree.init();

		numRows = sourceCanvas.getNumRows();
		numCols = sourceCanvas.getNumCols();

		// set up the canvas
		mozaicCanvas = new MozaicCanvas();
		mozaicCanvas.init(numRows, numCols);

		var oldTime = new Date();
		// find the closest tiles to the source image
		for (var i = 0; i < sourcePoints.length; i += 1) {
			var closestPoint = kdTree.findNearestNeighbor(sourcePoints[i]),
				tile = tiles.getTile(closestPoint),
				col = (i%numCols), row = Math.floor(i/numCols);

			mozaicCanvas.setTile(row, col, tile);
		}
		

		mozaicCanvas.draw(canvas);
	};
})(jQuery);
