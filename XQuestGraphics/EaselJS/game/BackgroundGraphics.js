var BackgroundGraphics = new Class(new createjs.Shape(), {
	initialize: function() {
		var bounds = Balance.level.bounds;
		this._size = {
			width: bounds.x*2 + bounds.width
			,height: bounds.y*2 + bounds.height
		};
		this._setupBackground();
		this._setupStars();
	}
	,
	_setupBackground: function(){
		var g = this.graphics
			,v = Graphics.background
			,size = this._size;

		g.clear();

		g.beginFill(v.backgroundColor)
		 .drawRect(0, 0, size.width, size.height);

	}
	,
	_setupStars: function() {
		var g = this.graphics
			,v = Graphics.background
			,size = this._size;
		var starColors = v.starColors;

		for (var colorIndex = 0, colorCount = starColors.length; colorIndex < colorCount; colorIndex++) {
			var starColor = starColors[colorIndex % colorCount];

			g.beginStroke(starColor);

			var starCount = Math.floor(v.starCount / colorCount);
			while (starCount--) {
				var x = Math.floor(Math.random() * size.width)
					,y = Math.floor(Math.random() * size.height);
				g.moveTo(x, y).lineTo(x+1,y);
			}
		}

		g.endStroke();
	}
});
