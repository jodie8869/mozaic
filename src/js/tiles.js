// @author Efe Karakus
function Tiles() {
	this._tiles = [];
	this.width = 0;
	this.height = 0;

	// Builds a TileImage array of all the tiles given to us from the data file.
	// @param data Array of RGB Arrays composing a tile.
	// @param width Number representing the width of a tile.
	// @param height Number representing the height of a tile.
	this.init = function(data, width, height) {
		var l = data.length;

		this.width = width;
		this.height = height;
		for (var i = 0; i < l; i += 1) {
			var tileImage = new TileImage();
			tileImage.init(data[i], width, height);
			this._tiles.push(tileImage);
		}
	}

	// Returns the array of tile images.
	// @return Array of tile images.
	this.getTiles = function() {
		return this._tiles;
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
