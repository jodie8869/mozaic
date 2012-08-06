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
}
