// @author Efe Karakus
(function($) {
	$.fn.mozaic = function () {
		var args = Array.prototype.slice.call(arguments, 0),
			that = this,
			param, data,
			numOfTiles;

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

		console.log(canvas);
		console.log(canvas.width, canvas.height);
	};
})(jQuery);
