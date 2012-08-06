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
		
		/*
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

		// find the closest tiles to the source image
		for (var i = 0; i < sourcePoints.length; i += 1) {
			var closestPoint = kdTree.findNearestNeighbor(sourcePoints[i]),
				tile = tiles.getTile(closestPoint),
				col = (i%numCols), row = Math.floor(i/numCols);

			mozaicCanvas.setTile(row, col, tile);
		}
		
		mozaicCanvas.draw(canvas);
		*/
		
		sourceCanvas = new SourceCanvas();
		sourceCanvas.init(canvas, data.width, data.height);
		sourcePoints = sourceCanvas.getAvgPoints();

		numRows = sourceCanvas.getNumRows();
		numCols = sourceCanvas.getNumCols();

		mozaicCanvas = new MozaicCanvas();
		mozaicCanvas.init(numRows, numCols);

		for (var i = 0; i < sourcePoints.length; i += 1) {
			var tile = new TileImage(),
				col = (i%numCols), row = Math.floor(i/numCols),
				imageData = [];

			for (var j = 0; j < data.width*data.height; j += 1) {
				imageData.push(sourcePoints[i]._vals);
			}
			tile.init(imageData, data.width, data.height);
			mozaicCanvas.setTile(row, col, tile);
		}
		
		mozaicCanvas.draw(canvas);
		
		
	};
})(jQuery);
