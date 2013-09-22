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
	 * Inverts the velocity and position when the player hits the bounds.
	 */
	bounceOffWalls: function(player, radius, velocity, bounds, dampening) {
		var bounces = 0;
		var leftEdge = (player.x - radius) - (bounds.x)
			,rightEdge = (player.x + radius) - (bounds.x + bounds.width);
		if (leftEdge < 0) {
			player.x -= leftEdge*2;
			velocity.x *= -1;
			bounces++;
		} else if (rightEdge > 0) {
			player.x -= rightEdge*2;
			velocity.x *= -1;
			bounces++;
		}
		var topEdge = (player.y - radius) - (bounds.y)
			,bottomEdge = (player.y + radius) - (bounds.y + bounds.height);
		if (topEdge < 0) {
			player.y -= topEdge*2;
			velocity.y *= -1;
			bounces++;
		} else if (bottomEdge > 0) {
			player.y -= bottomEdge*2;
			velocity.y *= -1;
			bounces++;
		}

		if (bounces && dampening) {
			while (bounces--) {
				velocity.x *= (1 - dampening);
				velocity.y *= (1 - dampening);
			}
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
	distanceTest: function(pointA, pointB, maxDistance) {
		var dx, dy;
		dx = Math.abs(pointA.x - pointB.x);
		if (dx <= maxDistance) {
			dy = Math.abs(pointA.y - pointB.y);
			if (dy <= maxDistance) {
				var realDistance = Math.sqrt(dx * dx + dy * dy);
				if (realDistance <= maxDistance)
					return true;
			}
		}
		return false;
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

