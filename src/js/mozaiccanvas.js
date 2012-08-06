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
			this._tiles[row] = [];
			for(var col = 0; col < this._cols; col += 1) {
				this._tiles[row][col] = null;
			}
		} 
	}

	// Returns the tile located at row and col.
	// @param row Number representing the row of the tile image.
	// @param col Number representing the colum of the tile image.
	// @return TileImage at coordinate row,col.
	this.getTile = function(row, col) {
		if ((row < 0 || row >= this._rows) || (col<0 || col >= this._cols)) {
			throw "getTile out of range <(&.&)>";
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
			imageData = [];
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
