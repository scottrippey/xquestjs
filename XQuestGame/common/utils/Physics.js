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
				delta.distance = Physics.hypotenuse(delta);
				if (delta.distance <= testDistance)
					return delta;
			}
		}
		return null;
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

		var hv = Physics.hypotenuse(velocity)
			,hd = Physics.hypotenuse(diff)
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
	hypotenuse: function(point) {
		return Math.sqrt(point.x * point.x + point.y * point.y);
	}


	,
	sortByLocation: function(points) {
		return Sort.smoothSort(points, Physics._compareLocations);
	}
	,
	_compareLocations: function(a, b) {
		a = a.location.x; b = b.location.x;
		return (a - b);
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
				var bLookahead = bIndex;
				while (bLookahead >= 0) {
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
							collisionCallback(pointA, pointB, aIndex, bLookahead, distance);
						}
					}
					bLookahead--;
					pointB = sortedPointsB[bLookahead];
				}
				pointB = sortedPointsB[bIndex];

				aIndex--;
				pointA = sortedPointsA[aIndex];
			}

		}
	}

	,
	interpolatePoints: function(pointA, pointB, pct) {
		if (pct === 0) return pointA;
		if (pct === 1) return pointB;
		return {
			x: pointA.x + pct * (pointB.x - pointA.x)
			,y: pointA.y + pct * (pointB.y - pointA.y)
		};
	}
};

