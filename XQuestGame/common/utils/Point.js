var Point = {
	clonePoint: function(point) {
		return { x: point.x, y: point.y };
	}
	,
	hypotenuse: function(point) {
		return Math.sqrt(point.x * point.x + point.y * point.y);
	}
	,
	pointIsInBounds: function(point, bounds) {
		return (bounds.x <= point.x) &&
			(point.x <= (bounds.x + bounds.width)) &&
			(bounds.y <= point.y) &&
			(point.y <= (bounds.y + bounds.height));
	}
	,
	distanceTest: function(pointA, pointB, testDistance) {
		var dx, dy;
		dx = (pointA.x - pointB.x);
		if (Math.abs(dx) <= testDistance) {
			dy = (pointA.y - pointB.y);
			if (Math.abs(dy) <= testDistance) {
				var delta = { x: dx, y: dy };
				delta.distance = Point.hypotenuse(delta);
				if (delta.distance <= testDistance)
					return delta;
			}
		}
		return null;
	}
	,
	rotate: function(point, degrees) {
		var radians = (degrees * Math.PI / 180);
		var cos = Math.cos(radians), sin = Math.sin(radians);

		var rx = point.x * cos - point.y * sin
			,ry = point.x * sin + point.y * cos;
		point.x = rx;
		point.y = ry;
	}
	,
	fromAngle: function(degrees, scale) {
		var radians = (degrees * Math.PI / 180)
			,cos = Math.cos(radians)
			,sin = Math.sin(radians);
		return {
			x: scale * cos
			,y: scale * sin
		};
	}

};
