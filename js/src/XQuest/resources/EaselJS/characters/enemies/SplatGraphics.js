var SplatGraphics = function() {

	this._setupGraphics();

};
SplatGraphics.prototype = new createjs.Shape();
SplatGraphics.implement({

	_setupGraphics: function(){
		var g = this.graphics, v = Graphics.enemies.splat;
		g.clear();

		g.beginStyle(v.outerFillStyle)
			.drawCircle(0, 0, Graphics.enemies.splat.diameter)
			.endFill();
		g.beginStyle(v.innerFillStyle)
			.drawCircle(0, 0, v.innerDiameter)
			.endFill()
			.beginStyle(v.innerStrokeStyle)
			.drawCircle(0, 0, Graphics.enemies.splat.diameter * v.innerDiameterRatio)
			.endStroke();

	}

	, moveTo: function(x, y) {
		this.x = x;
		this.y = y;
	}
});
