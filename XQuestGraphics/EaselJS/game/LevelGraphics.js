var LevelGraphics = new Class(new createjs.Shape(), {
	initialize: function() {
		this._setupGraphics();
	}
	,
	_setupGraphics: function(){
		var g = this.graphics
			, v = Graphics.level
			, bounds = Graphics.level.bounds
			, strokeWidth = Graphics.level.strokeStyle.strokeWidth - 2;
		g.clear();

		g.beginStyle(v.strokeStyle)
		 .drawRoundRect(bounds.x - strokeWidth/2, bounds.y - strokeWidth/2, bounds.width + strokeWidth, bounds.height + strokeWidth, v.cornerRadius)
		 .endStroke();

	}
});
