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

				// LAST TEN ARE NAN

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
