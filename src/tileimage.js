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
