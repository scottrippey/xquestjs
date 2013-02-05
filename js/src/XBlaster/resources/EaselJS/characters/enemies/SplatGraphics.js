var SplatGraphics = function() {

	this._setupGraphics();

};
SplatGraphics.prototype = new createjs.Shape();
SplatGraphics.implement({

	variables: {
		outerDiameter: 9
		, outerFillStyle: {
			fillColor: '#009900'
		}
		, innerDiameter: 5
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
			.drawCircle(0, 0, v.outerDiameter)
			.endFill();
		g.beginStyle(v.innerFillStyle)
			.drawCircle(0, 0, v.innerDiameter)
			.endFill()
			.beginStyle(v.innerStrokeStyle)
			.drawCircle(0, 0, v.innerDiameter)
			.endStroke();

	}

	, moveTo: function(x, y) {
		this.x = x;
		this.y = y;
	}
});
