// @version 1.0.0
// @author Efe Karakus
(function($) {
	$.fn.mozaic = function () {
		var args = Array.prototype.slice.call(arguments, 0),
			that = this,
			param, data,
			canvas = that[0],
			sourceCanvas,
			tiles;

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

		sourceCanvas = new SourceCanvas();
		sourceCanvas.init(canvas);

		tiles = new Tiles();
		tiles.init(data.data, data.width, data.height);

		console.log(tiles.toString());

	};
})(jQuery);
