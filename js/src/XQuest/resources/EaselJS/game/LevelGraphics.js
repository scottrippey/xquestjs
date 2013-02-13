var LevelGraphics = function() {
	this._setupGraphics();
};
LevelGraphics.prototype = new createjs.Shape();
LevelGraphics.implement({
	_setupGraphics: function(){
		var g = this.graphics, v = Graphics.level, bounds = Graphics.level.bounds;
		g.clear();

		g.beginStyle(v.strokeStyle)
		 .drawRoundRect(bounds.x, bounds.y, bounds.width, bounds.height, v.cornerRadius)
		 .endStroke();

	}

});
