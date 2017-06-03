EaselJSGraphics.SpecialEffects = {
	drawElectricLineTo(drawing, lineStart, lineEnd, segments, maxDeviation) {

		var diff = {
			x: (lineEnd.x - lineStart.x),
			y: (lineEnd.y - lineStart.y)
		};
		var interpolate = Smart.Interpolate.points(lineStart, lineEnd);

		for (var i = 1; i <= segments; i++) {
            var pos = interpolate(i / segments);
            var dist = Math.min(segments - i, i) / segments;
            var deviation = dist * maxDeviation * (Math.random() - 0.5);
            if (diff.y)
				pos.x += -diff.y * deviation;
            if (diff.x)
				pos.y += diff.x * deviation;
            drawing.lineTo(pos.x, pos.y);
        }

	},

	drawElectricRectangle(drawing, rectangle, electricOptions) {
        var left = rectangle.x || 0;
        var top = rectangle.y || 0;
        var right = left + rectangle.width;
        var bottom = top + rectangle.height;
        var segmentsH = electricOptions.segmentsH;
        var devH = electricOptions.deviationH;
        var segmentsV = electricOptions.segmentsV;
        var devV = electricOptions.deviationV;

        drawing.moveTo(left, top);
        this.drawElectricLineTo(drawing, { x: left, y: top }, { x: right, y: top }, segmentsH, devH);
        this.drawElectricLineTo(drawing, { x: right, y: top }, { x: right, y: bottom }, segmentsV, devV);
        this.drawElectricLineTo(drawing, { x: right, y: bottom }, { x: left, y: bottom }, segmentsH, devH);
        this.drawElectricLineTo(drawing, { x: left, y: bottom }, { x: left, y: top }, segmentsV, devV);
        drawing.closePath();
    }
};
