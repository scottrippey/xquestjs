define('Physics'
	, function() {
		var Physics = {
			move: function(elapsed, position, velocity, acceleration) {
				return (position + (elapsed * velocity) + (.5 * acceleration * elapsed * elapsed));
			}
		};

		return Physics;
	}
);