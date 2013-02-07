var LevelGraphics = function(size) {
	var p = this.variables.padding;
	this.bounds = {
		x: p, y: p
		,width: size.width - p*2
		,height: size.height - p*2
	};
	this._setupGraphics();

};
LevelGraphics.prototype = new createjs.Shape();
LevelGraphics.implement({

	variables: {
		padding: 10
		, cornerRadius: 8
		, strokeStyle: {
			strokeWidth: 8
			, strokeColor: '#999999'
		}
	}
	,
	_setupGraphics: function(){
		var g = this.graphics, v = this.variables, bounds = this.bounds;
		g.clear();

		g.beginStyle(v.strokeStyle)
		 .drawRoundRect(bounds.x, bounds.y, bounds.width, bounds.height, v.cornerRadius)
		 .endStroke();

	}

});
