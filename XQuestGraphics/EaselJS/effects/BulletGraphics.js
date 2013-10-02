EaselJSGraphics.BulletGraphics = Smart.Class(new createjs.Shape(), {
	initialize: function() {
		this._setupGraphics();
	}
	,
	_setupGraphics: function(){
		var g = this.graphics, v = Graphics.bullets;
		g.clear();

		g.beginStyle(v.strokeStyle)
		 .drawCircle(0, 0, Graphics.bullets.radius)
		 .endStroke();

	}
});
