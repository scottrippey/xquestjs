Smart.Keyframes = {
	fromFunction: function(keyframes) {
		if (!_.isFunction(keyframes)) return null;

		return keyframes;
	}
	,
	fromNumbers: function(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return function(pct) {
			return Smart.Interpolate.keyframes(keyframes, pct, Smart.Interpolate.numbers);
		}
	}
	,
	fromPoints: function(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return function(pct) {
			return Smart.Interpolate.keyframes(keyframes, pct, Smart.Interpolate.points);
		};
	}
	,
	fromColors: function(keyframes) {
		if (!_.isArray(keyframes)) return null;

		var colorKeyframes = _.map(keyframes, Smart.Color.parseToArray);
		return function(pct) {
			return Smart.Interpolate.keyframes(colorKeyframes, pct, Smart.Interpolate.colors);
		}
	}
};
