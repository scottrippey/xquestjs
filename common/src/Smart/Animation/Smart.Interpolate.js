import { Color } from '../Smart.Color.js';

/**
 * Interpolate between numbers, colors, points, and shapes.
 * Does so as efficiently as possible, by pre-processing the interpolation
 */
export const Interpolate = {
	/**
	 * Determines the type of the values, and interpolates between them
	 * @param {Number|Color|Point|Array} from
	 * @param {Number|Color|Point|Array} to
	 * @returns {interpolate}
	 */
	from(from, to) {
		var fromType = (typeof from);
		if (fromType !== typeof to) return null;

		if (fromType === 'number')
			return Interpolate.numbers(from, to);

		if (fromType === 'string')
			return Interpolate.colors(from, to);

		if (fromType === 'object') {
			if (typeof fromType.length === 'number')
				return Interpolate.arrays(from, to);
			if ('x' in fromType && 'y' in fromType)
				return Interpolate.points(from, to);
		}

	},


	/**
	 * Interpolates between two numbers
	 * @param {Number} from
	 * @param {Number} to
	 * @returns {interpolateNumbers}
	 */
	numbers(from, to) {
		var difference = (to - from);
		/**
		 * @callback interpolateNumbers
		 * @param {number} pct
		 * @returns {number}
		 */
		return function(pct) {
			return from + pct * difference;
		};
	},

	/**
	 * @type Point
	 * @property {Number} x
	 * @property {Number} y
	 */
	/**
	 * Interpolates between two points.
	 * @param {Point} from
	 * @param {Point} to
	 * @returns {interpolatePoints}
	 */
	points(from, to) {
		/**
		 * @callback interpolatePoints
		 * @param {number} pct
		 * @returns {Point}
		 */
		return function(pct) {
			return {
				x: from.x + pct * (to.x - from.x),
				y: from.y + pct * (to.y - from.y)
			};
		};
	},

	/**
	 * Interpolates between two colors.
	 * @param {String} from
	 * @param {String} to
	 * @returns {interpolateColors}
	 */
	colors(from, to) {
		/**
		 * @callback interpolateColors
		 * @param {Number} pct
		 * @returns {String}
		 */

		var fromHSL = Color.parseHSL(from);
		if (fromHSL) {
			var toHSL = Color.parseHSL(to);
			var interpolateHSL = Interpolate.arrays(fromHSL, toHSL);
			return function(pct) {
				return Color.toHSL(interpolateHSL(pct));
			};
		}
		var fromRGB = Color.parseRGB(from);
		if (fromRGB) {
			var toRGB = Color.parseRGB(to);
			var interpolateRGB = Interpolate.arrays(fromRGB, toRGB);
			return function(pct) {
				return Color.toRGB(interpolateRGB(pct));
			};
		}
		return null;
	},

	/**
	 * Interpolates all numbers between two arrays.
	 * @param {Number[]} from
	 * @param {Number[]} to
	 * @returns {interpolateArrays}
	 */
	arrays(from, to) {
		var length = Math.min(from.length, to.length);
		var interpolate = new Array(length);
		var i = length;
		while (i--) {
			interpolate[i] = Interpolate.from(from[i], to[i]);
		}
		/**
		 * @callback interpolateArrays
		 * @param {number} pct
		 * @returns {Number[]}
		 */
		return function(pct) {
			var results = new Array(length);
			var i = length;
			while (i--) {
				results[i] = interpolate[i](pct);
			}
			return results;
		};
	},

	/**
	 * Interpolates smoothly between keyframes.
	 *
	 * @param {*[]} keyframes
	 * @param {function({*} from, {*} to)} interpolateMethod
	 * @returns {interpolateKeyframes}
	 */
	keyframes(keyframes, interpolateMethod) {
		/**
		 * @callback interpolateKeyframes
		 * @param {number} pct
		 * @returns {*}
		 */

		var segments = keyframes.length - 1;
		if (segments === 1 && interpolateMethod)
			return interpolateMethod(keyframes[0], keyframes[1]);

		var lastIndex = -1;
		var lastInterpolate;
		return function(pct) {
			// Min / max:
			if (pct <= 0)
				return keyframes[0];
			else if (pct >= 1)
				return keyframes[segments + 1];

			// Current Index & Next Index:
			var pctSegments = pct * segments;
			var index = Math.floor(pctSegments);

			if (!interpolateMethod)
				return keyframes[index];

			if (lastIndex !== index) {
				lastIndex = index;
				lastInterpolate = interpolateMethod(keyframes[index], keyframes[index + 1]);
			}

			// Interpolate:
			var subPct = (pctSegments - index);
			return lastInterpolate(subPct);
		};
	}

};
