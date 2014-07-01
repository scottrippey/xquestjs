Smart.Keyframes = {
	fromFunction: function(keyframes) {
		if (!_.isFunction(keyframes)) return null;

		return keyframes;
	}
	,
	fromNumbers: function(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return Smart.Interpolate.keyframes(keyframes, Smart.Interpolate.numbers);
	}
	,
	fromPoints: function(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return Smart.Interpolate.keyframes(keyframes, Smart.Interpolate.points);
	}
	,
	fromColors: function(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return Smart.Interpolate.keyframes(keyframes, Smart.Interpolate.colors);
	}
	,
	step: function(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return Smart.Interpolate.keyframes(keyframes, false);
	}
};
