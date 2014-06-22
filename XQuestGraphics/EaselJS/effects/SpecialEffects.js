EaselJSGraphics.SpecialEffects = {
	drawElectricLineTo: function(drawing, lineStart, lineEnd, segments, maxDeviation) {
		
		var diff = {
			x: (lineEnd.x - lineStart.x)
			,y: (lineEnd.y - lineStart.y)
		};
		for (var i = 1; i <= segments; i++) {
			var pos = Smart.Interpolate.points(lineStart, lineEnd, i / segments);
			var dist = Math.min(segments - i, i) / segments
				,deviation = dist * maxDeviation * (Math.random() - 0.5);
			if (diff.y)
				pos.x += -diff.y * deviation;
			if (diff.x)
				pos.y += diff.x * deviation;
			drawing.lineTo(pos.x, pos.y);
		}

	}
};