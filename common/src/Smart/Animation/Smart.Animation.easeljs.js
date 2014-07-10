/**
 * Animation Actions
 * These actions animate certain object properties that are used by EaselJS,
 * such as x, y, alpha, color, scaleX, scaleY, and rotation.
 */
_.extend(Smart.Animation.prototype, {

	/**
	 * Animates the `x` and `y` properties of the target.
	 * @param {Point} target
	 * @param {Function|Point[]|Point} keyframes
	 * @returns {Smart.Animation} this
	 */
	move: function(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromPoints(keyframes)
				|| Smart.Keyframes.fromPoints([ Smart.Point.clonePoint(target), keyframes ]);
			return interpolate(position);
		};
		return this.frame(function _move_(position, animEvent) {
			var p = interpolate(position);
			target.x = p.x; target.y = p.y;
		});

	}

	,
	/**
	 * Animates the `alpha` property of the target.
	 * @param {Object} target
	 * @param {Function|Number[]|Number} keyframes
	 * @returns {Smart.Animation} this
	 */
	fade: function(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromNumbers(keyframes)
				|| Smart.Keyframes.fromNumbers([ target.alpha !== undefined ? target.alpha : 1, keyframes ]);
			return interpolate(position);
		};

		return this.frame(function _fade_(position, animEvent) {
			target.alpha = interpolate(position);
		});
	}

	,
	/**
	 * Animates the `color` property of the target.
	 * @param {Object} target
	 * @param {Function|String[]|String} keyframes
	 * @returns {Smart.Animation} this
	 */
	color: function(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromColors(keyframes)
				|| Smart.Keyframes.fromColors([ target.color, keyframes ]);
			return interpolate(position);
		};

		return this.frame(function _color_(position, animEvent) {
			target.color = interpolate(position);
		});
	}

	,
	/**
	 * Animates the `scale` properties (scaleX, scaleY) of the target.
	 * @param {Object} target
	 * @param {Function|Number[]|Number} keyframes
	 * @returns {Smart.Animation} this
	 */
	scale: function(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromNumbers(keyframes)
				|| Smart.Keyframes.fromNumbers([ target.scaleX !== undefined ? target.scaleX : 1, keyframes ]);
			return interpolate(position);
		};
		return this.frame(function _scale_(position, animEvent) {
			target.scaleX = target.scaleY = interpolate(position);
		});
	}

	,
	/**
	 * Animates the `rotation` property of the target.
	 * @param {Object} target
	 * @param {Function|Number[]|Number} keyframes
	 * @returns {Smart.Animation} this
	 */
	rotate: function(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromNumbers(keyframes)
				|| Smart.Keyframes.fromNumbers([ target.rotation !== undefined ? target.rotation : 1, keyframes ]);
			return interpolate(position);
		};

		return this.frame(function _rotate_(position, animEvent) {
			target.rotation = interpolate(position);
		});
	}
	,
	/**
	 * Animates by calling `update` with the interpolated keyframe values.
	 * @param {Function|Number[]} keyframes
	 * @param {function(pct:Number)} update
	 * @returns {Smart.Animation} this
	 */
	tween: function(keyframes, update) {
		var interpolate =
			Smart.Keyframes.fromFunction(keyframes)
			|| Smart.Keyframes.fromNumbers(keyframes)
			|| Smart.Keyframes.fromNumbers([ keyframes ]);

		return this.frame(function _tween_(position, animEvent) {
			update(interpolate(position));
		});
	}

	,
	/**
	 * Disposes the object once animations are finished
	 * @param disposable - Any object -- must have a `dispose` method
	 * @returns {Smart.Animation} this
	 */
	queueDispose: function(disposable) {
		return this.queue(function() {
			disposable.dispose();
		});
	}
});

