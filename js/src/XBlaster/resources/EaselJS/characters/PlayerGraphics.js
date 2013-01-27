var playerGraphics = (function() {
	var PlayerGraphics = new createjs.Shape();
	var variables = {
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
    };

	Physics.setPosition(PlayerGraphics, 100, 100);

	PlayerGraphics.onTick = function(elapsed) {
		if (elapsed)
			variables.innerSpin += 360 * 1/5 * (elapsed / 1000);

		PlayerGraphics.graphics.clear();

		PlayerGraphics.graphics
			.beginStyle(variables.outerStrokeStyle)
			.drawCircle(0, 0, variables.outerDiameter)
			.endStroke();

		PlayerGraphics.graphics
			.beginStyle(variables.innerStrokeStyle)
			.drawPolyStar(0, 0, variables.innerDiameter, variables.innerStarPoints, variables.innerStarSize, variables.innerSpin)
			.endStroke();
	};

	return PlayerGraphics;
})();
