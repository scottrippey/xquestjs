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
	,
	drawElectricRectangle: function(drawing, rectangle, electricOptions) {
		var left = rectangle.x || 0, top = rectangle.y || 0, right = left + rectangle.width, bottom = top + rectangle.height;
		var segmentsH = electricOptions.segmentsH, devH = electricOptions.deviationH;
		var segmentsV = electricOptions.segmentsV, devV = electricOptions.deviationV;
		
		drawing.moveTo(left, top);
		this.drawElectricLineTo(drawing, { x: left, y: top }, { x: right, y: top }, segmentsH, devH);
		this.drawElectricLineTo(drawing, { x: right, y: top }, { x: right, y: bottom }, segmentsV, devV);
		this.drawElectricLineTo(drawing, { x: right, y: bottom }, { x: left, y: bottom }, segmentsH, devH);
		this.drawElectricLineTo(drawing, { x: left, y: bottom }, { x: left, y: top }, segmentsV, devV);
		
	}
};