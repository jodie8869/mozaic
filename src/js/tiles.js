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
