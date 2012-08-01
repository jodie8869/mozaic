(function($) {
	$.fn.mozaic = function () {
		var args = Array.prototype.slice.call(arguments, 0),
			that = $(this),
			params, data;

		if (!that.is("img")) {
			throw "Wrong tag for mozaic, please use it on an image";
		} 
		
		if (typeof args[0] !== "undefined") {
			params = args[0];
		} else {
			params = {
				width: that.width(),
				height: that.height(),
				prune: false
			};
		}
		
	};
})(jQuery);