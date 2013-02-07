var PlayerGraphics = function() {

	this._setupGraphics();

};
PlayerGraphics.prototype = new createjs.Shape();
PlayerGraphics.implement({

	variables: {
		outerDiameter: 12
		, outerStrokeStyle: {
			strokeWidth: 3
			, strokeColor: 'white'
		}

		, innerDiameter: 9
		, innerStrokeStyle: {
			strokeWidth: 2
			, strokeColor: 'yellow'
		}
		, innerStarPoints: 5
		, innerStarSize: 0.7
		, innerSpin: 0
	}
	,
	_setupGraphics: function(){
		var g = this.graphics, v = this.variables;
		g.clear();

		g.beginStyle(v.outerStrokeStyle)
		 .drawCircle(0, 0, v.outerDiameter)
		 .endStroke();

		g.beginStyle(v.innerStrokeStyle)
		 .drawPolyStar(0, 0, v.innerDiameter, v.innerStarPoints, v.innerStarSize, v.innerSpin)
		 .endStroke();

	}

	, moveTo: function(x, y) {
		this.x = x;
		this.y = y;
	}
});
