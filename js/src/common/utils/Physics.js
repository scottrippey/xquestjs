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
	bounceOffWalls: function(player, diameter, velocity, bounds) {
		var leftEdge = (player.x - diameter) - (bounds.x)
			,rightEdge = (player.x + diameter) - (bounds.x + bounds.width);
		if (leftEdge < 0) {
			player.x -= leftEdge*2;
			velocity.x *= -1;
		} else if (rightEdge > 0) {
			player.x -= rightEdge*2;
			velocity.x *= -1;
		}
		var topEdge = (player.y - diameter) - (bounds.y)
			,bottomEdge = (player.y + diameter) - (bounds.y + bounds.height);
		if (topEdge < 0) {
			player.y -= topEdge*2;
			velocity.y *= -1;
		} else if (bottomEdge > 0) {
			player.y -= bottomEdge*2;
			velocity.y *= -1;
		}

	}

	,
	pointIsInBounds: function(point, bounds) {
		return (bounds.x <= point.x) &&
			   (point.x <= (bounds.x + bounds.width)) &&
			   (bounds.y <= point.y) &&
			   (point.y <= (bounds.y + bounds.height));
	}
};

