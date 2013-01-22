define([ 'createjs' ], function(createjs) {

	createjs.Graphics.implement({

		beginStyle: function(style) {
			var g = this.graphics;


			if (style.strokeColor)
				g.beginStroke(style.strokeColor);

			if (style.strokeWidth && style.strokeMiter)
				g.setStrokeStyle(style.strokeWidth, style.strokeMiter);
			else if (style.strokeWidth)
				g.setStrokeStyle(style.strokeWidth);


			if (style.fillColor)
				g.beginFill(style.fillColor);


			return this.graphics;
		}
	});
});