(() => {
	var RadiansPerDegree = Math.PI / 180;

	Smart.Point = {
		subtract(pointA, pointB) {
			return { x: pointA.x - pointB.x, y: pointA.y - pointB.y };
		},
		multiply(point, factor) {
			return { x: point.x * factor, y: point.y * factor };
		},
		clonePoint(point) {
			return { x: point.x, y: point.y };
		},
		hypotenuse(point) {
			return Math.sqrt(point.x * point.x + point.y * point.y);
		},
		hypotenuseXY(x, y) {
			return Math.sqrt(x * x + y * y);
		},
		pointIsInBounds(point, bounds) {
			return (bounds.x <= point.x) &&
				(point.x <= (bounds.x + bounds.width)) &&
				(bounds.y <= point.y) &&
				(point.y <= (bounds.y + bounds.height));
		},
		distanceTest(pointA, pointB, testDistance) {
			var dx;
			var dy;
			dx = (pointA.x - pointB.x);
			if (Math.abs(dx) <= testDistance) {
				dy = (pointA.y - pointB.y);
				if (Math.abs(dy) <= testDistance) {
					var delta = { x: dx, y: dy };
					delta.distance = Smart.Point.hypotenuse(delta);
					if (delta.distance <= testDistance)
						return delta;
				}
			}
			return null;
		},
		rotate(point, degrees) {
			var radians = (degrees * RadiansPerDegree);
			var cos = Math.cos(radians);
			var sin = Math.sin(radians);
			var rx = point.x * cos - point.y * sin;
			var ry = point.x * sin + point.y * cos;
			point.x = rx;
			point.y = ry;
		},
		fromAngle(degrees, scale) {
			var radians = (degrees * RadiansPerDegree);
			return {
				x: Math.cos(radians) * scale,
				y: Math.sin(radians) * scale
			};
		},
		scaleVector(vector, scale) {
			var vectorScale = scale / Smart.Point.hypotenuse(vector);
			return {
				x: vector.x * vectorScale,
				y: vector.y * vectorScale
			}
		},
		/**
		 * Returns the angle of a vector
		 *
		 * @param {object} vector
		 * @param {number} vector.x
		 * @param {number} vector.y
		 * @returns {number}
		 */
		angleFromVector(vector) {
			return 180 - Math.atan2(vector.x, vector.y) / RadiansPerDegree;
		}
	};

})();
