var Keyframes = {
	fromFunction: function(keyframes) {
		if (!_.isFunction(keyframes)) return null;

		return keyframes;
	}
	,
	fromNumbers: function(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return function(pct) {
			return Interpolate.keyframes(keyframes, pct, Interpolate.numbers);
		}
	}
	,
	fromPoints: function(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return function(pct) {
			return Interpolate.keyframes(keyframes, pct, Interpolate.points);
		};
	}
	,
	fromColors: function(keyframes) {
		if (!_.isArray(keyframes)) return null;

		var colorKeyframes = _.map(keyframes, Color.parseToArray);
		return function(pct) {
			return Interpolate.keyframes(colorKeyframes, pct, Interpolate.colors);
		}
	}
};