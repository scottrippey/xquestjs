var Physics = {
	updatePositionAndVelocity: function(elapsedSeconds, point, velocity, acceleration) {
		if (velocity) {
			if (velocity.x) {
				point.x += velocity.x * elapsedSeconds;
			}
			if (velocity.y) {
				point.y += velocity.y * elapsedSeconds;
			}
		}
		if (acceleration && (acceleration.x || acceleration.y)) {
			var oneHalfTSquared = elapsedSeconds * elapsedSeconds / 2;
			if (acceleration.x) {
				point.x += acceleration.x * oneHalfTSquared;
				velocity.x += acceleration.x * elapsedSeconds;
			}
			if (acceleration.y) {
				point.y += acceleration.y * oneHalfTSquared;
				velocity.y += acceleration.y * elapsedSeconds;
			}
		}
	}
};

