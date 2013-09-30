var Physics = {
	applyVelocity: function(point, velocity, elapsedSeconds) {
		if (velocity.x) {
			point.x += velocity.x * elapsedSeconds;
		}
		if (velocity.y) {
			point.y += velocity.y * elapsedSeconds;
		}
	}
	,
	applyAcceleration: function(point, acceleration, elapsedSeconds) {
		if (acceleration.x || acceleration.y) {
			var oneHalfTSquared = elapsedSeconds * elapsedSeconds / 2;
			if (acceleration.x)
				point.x += acceleration.x * oneHalfTSquared;
			if (acceleration.y)
				point.y += acceleration.y * oneHalfTSquared;
		}
	}
	,
	applyAccelerationToVelocity: function(velocity, acceleration) {
		velocity.x += acceleration.x;
		velocity.y += acceleration.y;
	}
	,
	applyFrictionToVelocity: function(velocity, friction, elapsedSeconds) {
		var threshold = 0.5;
		var remainingPercent = Math.pow(1 - friction, elapsedSeconds);

		if (velocity.x < threshold && velocity.x > -threshold)
			velocity.x = 0;
		else
			velocity.x *= remainingPercent;

		if (velocity.y < threshold && velocity.y > -threshold)
			velocity.y = 0;
		else
			velocity.y *= remainingPercent;

	}
	,
	/**
	 * Inverts the velocity and position when the location hits the bounds.
	 */
	bounceOffWalls: function(location, radius, velocity, bounds, dampening) {
		var wall = this.checkBounds(location, radius, bounds);
		if (wall) {
			this.bounceOffWall(wall, location, velocity, dampening);
		}
		return wall;
	}
	,
	checkBounds: function(location, radius, bounds) {
		var leftEdge = (location.x - radius) - (bounds.x);
		if (leftEdge < 0) {
			return { edge: 'left', distance: leftEdge };
		}

		var rightEdge = (location.x + radius) - (bounds.x + bounds.width);
		if (rightEdge > 0) {
			return { edge: 'right', distance: rightEdge };
		}

		var topEdge = (location.y - radius) - (bounds.y);
		if (topEdge < 0) {
			return { edge: 'top', distance: topEdge };
		}

		var bottomEdge = (location.y + radius) - (bounds.y + bounds.height);
		if (bottomEdge > 0) {
			return { edge: 'bottom', distance: bottomEdge };
		}

		return null;
	}
	,
	bounceOffWall: function(wall, location, velocity, dampening) {
		switch (wall.edge) {
			case 'left':
				location.x -= wall.distance * 2;
				velocity.x *= -1;
				break;
			case 'right':
				location.x -= wall.distance * 2;
				velocity.x *= -1;
				break;
			case 'top':
				location.y -= wall.distance * 2;
				velocity.y *= -1;
				break;
			case 'bottom':
				location.y -= wall.distance * 2;
				velocity.y *= -1;
				break;
		}
		if (dampening) {
			velocity.x *= (1 - dampening);
			velocity.y *= (1 - dampening);
		}
	}


	,
	bounceOffPoint: function(location, velocity, bouncePoint, radius, dampening) {
		// This algorithm is not too accurate.
		// It bounces straight away from the bouncePoint,
		// not taking into account the angle of collision.

		var diff = {
			x: location.x - bouncePoint.x
			,y: location.y - bouncePoint.y
		};

		var hv = Point.hypotenuse(velocity)
			,hd = Point.hypotenuse(diff)
			,vScale = hv/hd
			,lScale = radius/hd;

		velocity.x = diff.x * vScale;
		velocity.y = diff.y * vScale;

		location.x = bouncePoint.x + diff.x * lScale;
		location.y = bouncePoint.y + diff.y * lScale;

		if (dampening) {
			velocity.x *= (1 - dampening);
			velocity.y *= (1 - dampening);
		}
	}


	,
	sortByLocation: function(points) {
		return Sort.smoothSort(points, Physics._compareLocations);
	}
	,
	_compareLocations: function(a, b) {
		// Compare horizontally:
		return (a.location.x - b.location.x);
	}
	,
	detectCollisions: function(sortedPointsA, sortedPointsB, maxDistance, collisionCallback) {

		var aIndex = sortedPointsA.length - 1
			,bIndex = sortedPointsB.length - 1
			,pointA = sortedPointsA[aIndex]
			,pointB = sortedPointsB[bIndex]
			;

		while (aIndex >= 0 && bIndex >= 0) {
			// Rough-compare X:
			var dx = pointA.location.x - pointB.location.x;
			if (maxDistance < dx) {
				aIndex--;
				pointA = sortedPointsA[aIndex];
			} else if (dx < -maxDistance) {
				bIndex--;
				pointB = sortedPointsB[bIndex];
			} else {
				var bLookAhead = bIndex;
				while (bLookAhead >= 0) {
					dx = pointA.location.x - pointB.location.x;
					if (dx < -maxDistance) {
						break;
					}
					// Rough-compare Y:
					var dy = pointA.location.y - pointB.location.y;
					if (-maxDistance <= dy && dy <= maxDistance) {
						// Deep-compare:
						var distance = Math.sqrt(dx * dx + dy * dy);
						if (distance <= maxDistance) {
							collisionCallback(pointA, pointB, aIndex, bLookAhead, distance);
						}
					}
					bLookAhead--;
					pointB = sortedPointsB[bLookAhead];
				}
				pointB = sortedPointsB[bIndex];

				aIndex--;
				pointA = sortedPointsA[aIndex];
			}

		}
	}

	,
	findClosestPoint: function(target, points) {
		var closestPointIndex = -1, distance = Number.MAX_VALUE;

		var i = points.length;
		while (i--) {
			var point = points[i];

			// Let's do rough comparisons, and short-circuit when possible:
			var dx = point.x - target.x;
			if (Math.abs(dx) >= distance) continue;
			var dy = point.y - target.y;
			if (Math.abs(dy) >= distance) continue;

			// Now do a precise comparison:
			var actualDistance = Point.hypotenuseXY(dx, dy);
			if (actualDistance < distance) {
				distance = actualDistance;
				closestPointIndex = i;
			}
		}
		return closestPointIndex;
	}
};

