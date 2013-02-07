var LevelGraphics = function() {
	this._setupGraphics();
};
LevelGraphics.prototype = new createjs.Shape();
LevelGraphics.implement({

	variables: {
		cornerRadius: 8
		, strokeStyle: {
			strokeWidth: 8
			, strokeColor: '#999999'
		}
	}
	,
	_setupGraphics: function(){
		var g = this.graphics, v = this.variables, bounds = Balance.level.bounds;
		g.clear();

		g.beginStyle(v.strokeStyle)
		 .drawRoundRect(bounds.x, bounds.y, bounds.width, bounds.height, v.cornerRadius)
		 .endStroke();

	}

});
