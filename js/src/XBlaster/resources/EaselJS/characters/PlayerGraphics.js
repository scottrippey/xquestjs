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
		var g = this.graphics;
		g.clear();

		g.beginStyle(variables.outerStrokeStyle)
		 .drawCircle(0, 0, variables.outerDiameter)
		 .endStroke();

		g.beginStyle(variables.innerStrokeStyle)
		 .drawPolyStar(0, 0, variables.innerDiameter, variables.innerStarPoints, variables.innerStarSize, variables.innerSpin)
		 .endStroke();

	}
});
