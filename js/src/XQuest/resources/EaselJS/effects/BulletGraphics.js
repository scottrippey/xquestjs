var BulletGraphics = function() {

	this._setupGraphics();

};
BulletGraphics.prototype = new createjs.Shape();
BulletGraphics.implement({

	variables: {
		bulletDiameter: 2
		, strokeStyle: {
			strokeWidth: 2
			, strokeColor: 'white'
		}
	}
	,
	_setupGraphics: function(){
		var g = this.graphics, v = this.variables;
		g.clear();

		g.beginStyle(v.strokeStyle)
		 .drawCircle(0, 0, v.bulletDiameter)
		 .endStroke();

	}

	, moveTo: function(x, y) {
		this.x = x;
		this.y = y;
	}
});
