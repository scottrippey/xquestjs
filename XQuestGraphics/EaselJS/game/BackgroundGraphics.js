EaselJSGraphics.BackgroundGraphicsBase = Smart.Class(new createjs.Shape(), {
	BackgroundGraphicsBase_initialize() {
		var bounds = Balance.level.bounds;
		this._size = {
			width: bounds.x*2 + bounds.width,
			height: bounds.y*2 + bounds.height
		};
		this._setupBackground();
		this._setupStars();

		this.cache(0, 0, this._size.width, this._size.height);
	},

	_setupBackground() {
        var g = this.graphics;
        var v = Graphics.background;
        var size = this._size;

        g.clear();

        g.beginFill(v.backgroundColor)
		 .drawRect(0, 0, size.width, size.height);
    },

	_setupStars() {
        var g = this.graphics;
        var v = Graphics.background;
        var size = this._size;
        var starColors = v.starColors;

        for (var colorIndex = 0, colorCount = starColors.length; colorIndex < colorCount; colorIndex++) {
			var starColor = starColors[colorIndex % colorCount];

			g.beginStroke(starColor);

			var starCount = Math.floor(v.starCount / colorCount);
			while (starCount--) {
                var x = Math.floor(Math.random() * size.width);
                var y = Math.floor(Math.random() * size.height);
                g.moveTo(x, y).lineTo(x+1,y+1);
            }
		}

        g.endStroke();
    }
});
EaselJSGraphics.BackgroundGraphics = Smart.Class(new EaselJSGraphics.BackgroundGraphicsBase(), {
	initialize() {
		if (!this.initialized) {
			// Using a prototype ensures the stars will be the same between the menu and game
			EaselJSGraphics.BackgroundGraphics.prototype.initialized = true;
			EaselJSGraphics.BackgroundGraphics.prototype.BackgroundGraphicsBase_initialize();
		}
	}
});
