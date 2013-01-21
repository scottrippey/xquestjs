define('CanvasGraphics', function(){
	var CanvasGraphics = new Class({
		canvas: null
		,
		initialize: function(canvas) {
			this.canvas = canvas;
		}
	});
	return CanvasGraphics;
});