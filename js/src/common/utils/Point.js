var Point = {
	updatePositionFromVelocity: function(point, velocity, elapsedSeconds) {
		if (velocity.x) {
			point.x += velocity.x * elapsedSeconds;
		}
		if (velocity.y) {
			point.y += velocity.y * elapsedSeconds;
		}
	}
	,
	addPoints: function(result, vector) {
		result.x += vector.x;
		result.y += vector.y;
	}
};

