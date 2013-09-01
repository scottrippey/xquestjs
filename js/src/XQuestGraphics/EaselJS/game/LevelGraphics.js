var LevelGraphics = function() {
	this._setupGraphics();
};
LevelGraphics.prototype = new createjs.Shape();
LevelGraphics.implement({
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
