var SplatGraphics = function() {

	this._setupGraphics();

};
SplatGraphics.prototype = new createjs.Shape();
SplatGraphics.implement({

	variables: {
		outerFillStyle: {
			fillColor: '#009900'
		}
		, innerDiameterRatio: 5/8
		, innerFillStyle: {
			fillColor: '#00DD00'
		}
		, innerStrokeStyle: {
			strokeColor: '#000000'
		}
	}
	,
	_setupGraphics: function(){
		var g = this.graphics, v = this.variables;
		g.clear();

		g.beginStyle(v.outerFillStyle)
			.drawCircle(0, 0, Balance.enemies.splat.diameter)
			.endFill();
		g.beginStyle(v.innerFillStyle)
			.drawCircle(0, 0, v.innerDiameter)
			.endFill()
			.beginStyle(v.innerStrokeStyle)
			.drawCircle(0, 0, Balance.enemies.splat.diameter * v.innerDiameterRatio)
			.endStroke();

	}

	, moveTo: function(x, y) {
		this.x = x;
		this.y = y;
	}
});
