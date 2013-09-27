/**
 * Animation Actions
 */
_.extend(Animation.prototype, {
	/**
	 * Animates the `x` and `y` properties of the target.
	 * @param moveOptions
	 * @returns {this}
	 */
	move: function(moveOptions) {
		var target = moveOptions.target;
		if (!moveOptions.keyframes && !moveOptions.from)
			moveOptions.from = { x: target.x, y: target.y };
		if (!moveOptions.update)
			moveOptions.update = function(point) { target.x = point.x; target.y = point.y; };
		if (!moveOptions.interpolate)
			moveOptions.interpolate = Animation.interpolatePoints;
		
		return this.animate(moveOptions);
	}
	,
	/**
	 * Animates the `color` property of the target.
	 * @param colorOptions
	 * @returns {this}
	 */
	color: function(colorOptions) {
		var target = colorOptions.target;
		if (!colorOptions.keyframes && !colorOptions.from)
			colorOptions.from = target.color;
		if (!colorOptions.update)
			colorOptions.update = function(color) { target.color = color; };
		if (!colorOptions.map)
			colorOptions.map = function(color) { return color.hexToRgb(); };
		if (!colorOptions.interpolate)
			colorOptions.interpolate = function(from, to, position) { return Animation.interpolateArrays(from, to, position).rgbToHex(); };

		return this.animate(colorOptions);
	}
	,
	/**
	 * Animates the `alpha` property of the target.
	 * @param fadeOptions
	 * @returns {this}
	 */
	fade: function(fadeOptions) {
		var target = fadeOptions.target;
		if (!fadeOptions.keyframes && !fadeOptions.from)
			fadeOptions.from = target.alpha;
		if (!fadeOptions.update)
			fadeOptions.update = function(alpha) { target.alpha = alpha; };

		return this.animate(fadeOptions);
	}
	,
	/**
	 * Animates by calling `update` with the interpolated values.
	 * @param animOptions
	 * @returns {this}
	 */
	animate: function(animOptions) {
		var keyframes = animOptions.keyframes || [ animOptions.from, animOptions.to ]
			,update = animOptions.update
			,interpolate = animOptions.interpolate || Animation.interpolate
			,map = animOptions.map
			;

		if (map)
			keyframes = _.map(keyframes, map);

		return this.addAction(function(animEvent) {
			var from = keyframes[(animEvent.keyframe) % keyframes.length]
				,to = keyframes[(animEvent.keyframe + 1) % keyframes.length];

			update(interpolate(from, to, animEvent.position));
		});
	}
});

/**
 * Interpolates between two numbers
 * @param {Number} from
 * @param {Number} to
 * @param {Number} pos
 * @returns {Number}
 */
Animation.interpolate = function(from, to, pos) {
	if (pos === 0) return from;
	if (pos === 1) return to;
	return from + pos * (to - from);
};
/**
 * Interpolates all values between two arrays.
 * @param {Number[]} from
 * @param {Number[]} to
 * @param {Number} pos
 * @returns {Number[]}
 */
Animation.interpolateArrays = function(from, to, pos) {
	var result = []
		,l = Math.min(from.length, to.length);
	for (var i = 0; i < l; i++) {
		result.push(Animation.interpolate(from[i], to[i], pos));
	}
	return result;
};

/**
 * Interpolates between two points.
 * @param {{x: Number, y: Number}} from
 * @param {{x: Number, y: Number}} to
 * @param {Number} position
 * @returns {{x: Number, y: Number}}
 */
Animation.interpolatePoints = function(from, to, position) {
	if (position === 0) return from;
	if (position === 1) return to;
	return {
		x: Animation.interpolate(from.x, to.x, position)
		,y: Animation.interpolate(from.y, to.y, position)
	};
};
