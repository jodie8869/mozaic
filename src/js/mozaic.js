(function($) {
	$.fn.mozaic = function () {
		var args = Array.prototype.slice.call(arguments, 0),
			that = $(this),
			params, data;

		if (!that.is("canvas")) {
			throw "Wrong tag for mozaic, please use it on a canvas";
		} 
		
		if (typeof args[0] !== "undefined") {
			params = args[0];
		} else {
			params = {
				width: that.width(),
				height: that.height()
			};
		}
		
	};
})(jQuery);