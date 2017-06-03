Smart.Keyframes = {
	fromFunction(keyframes) {
		if (!_.isFunction(keyframes)) return null;

		return keyframes;
	},

	fromNumbers(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return Smart.Interpolate.keyframes(keyframes, Smart.Interpolate.numbers);
	},

	fromPoints(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return Smart.Interpolate.keyframes(keyframes, Smart.Interpolate.points);
	},

	fromColors(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return Smart.Interpolate.keyframes(keyframes, Smart.Interpolate.colors);
	},

	step(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return Smart.Interpolate.keyframes(keyframes, false);
	}
};
