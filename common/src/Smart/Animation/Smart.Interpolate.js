Smart.Interpolate = {
	/**
	 * Interpolates between two numbers
	 * @param {Number} from
	 * @param {Number} to
	 * @param {Number} pos
	 * @returns {Number}
	 */
	numbers: function(from, to, pct) {
		return from + pct * (to - from);
	}
	,
	/**
	 * Interpolates between two points.
	 * @param {{x: Number, y: Number}} from
	 * @param {{x: Number, y: Number}} to
	 * @param {Number} position
	 * @returns {{x: Number, y: Number}}
	 */
	points: function(from, to, pct) {
		if (pct === 0) return from;
		if (pct === 1) return to;
		return {
			x: Smart.Interpolate.numbers(from.x, to.x, pct)
			,y: Smart.Interpolate.numbers(from.y, to.y, pct)
		};
	}
	,
	colors: function(from, to, pct) {
		if (pct === 0) return from;
		if (pct === 1) return to;
		from = Smart.Color.parseToArray(from);
		to = Smart.Color.parseToArray(to);
		return Smart.Color.arrayToHex(Smart.Interpolate.arrays(from, to, pct));
	}
	,
	/**
	 * Interpolates all values between two arrays.
	 * @param {Number[]} from
	 * @param {Number[]} to
	 * @param {Number} pos
	 * @returns {Number[]}
	 */
	arrays: function(from, to, pct) {
		if (pct === 0) return from;
		if (pct === 1) return to;

		var i = Math.min(from.length, to.length)
			,results = [];
		while (i--) {
			results[i] = Smart.Interpolate.numbers(from[i], to[i], pct);
		}
		return results;
	}

	,
	/**
	 * Interpolates smoothly between keyframes.
	 *
	 * @param keyframes
	 * @param pct
	 * @param interpolate
	 * @returns {*}
	 */
	keyframes: function(keyframes, pct, interpolate) {
		var segments = keyframes.length - 1
			,index = (segments === 1) ? 0 : Math.floor(pct * segments)
			,from = keyframes[index];
		if (!interpolate) return from;

		var to = keyframes[index + 1]
			,subPct = (segments === 1) ? pct : (segments * pct - index);

		return interpolate(from, to, subPct);
	}

};

