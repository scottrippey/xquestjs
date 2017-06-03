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
	move(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromPoints(keyframes)
				|| Smart.Keyframes.fromPoints([ Smart.Point.clonePoint(target), keyframes ]);
			return interpolate(position);
		};
		return this.frame(function _move_(animEvent) {
			var p = interpolate(animEvent.position);
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
	fade(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromNumbers(keyframes)
				|| Smart.Keyframes.fromNumbers([ target.alpha !== undefined ? target.alpha : 1, keyframes ]);
			return interpolate(position);
		};

		return this.frame(function _fade_(animEvent) {
			target.alpha = interpolate(animEvent.position);
		});
	}

	,
	/**
	 * Animates the `color` property of the target.
	 * @param {Object} target
	 * @param {Function|String[]|String} keyframes
	 * @returns {Smart.Animation} this
	 */
	color(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromColors(keyframes)
				|| Smart.Keyframes.fromColors([ target.color, keyframes ]);
			return interpolate(position);
		};

		return this.frame(function _color_(animEvent) {
			target.color = interpolate(animEvent.position);
		});
	}

	,
	/**
	 * Animates the `scale` properties (scaleX, scaleY) of the target.
	 * @param {Object} target
	 * @param {Function|Number[]|Number} keyframes
	 * @returns {Smart.Animation} this
	 */
	scale(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromNumbers(keyframes)
				|| Smart.Keyframes.fromNumbers([ target.scaleX !== undefined ? target.scaleX : 1, keyframes ]);
			return interpolate(position);
		};
		return this.frame(function _scale_(animEvent) {
			target.scaleX = target.scaleY = interpolate(animEvent.position);
		});
	}

	,
	/**
	 * Animates the `rotation` property of the target.
	 * @param {Object} target
	 * @param {Function|Number[]|Number} keyframes
	 * @returns {Smart.Animation} this
	 */
	rotate(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromNumbers(keyframes)
				|| Smart.Keyframes.fromNumbers([ target.rotation !== undefined ? target.rotation : 1, keyframes ]);
			return interpolate(position);
		};

		return this.frame(function _rotate_(animEvent) {
			target.rotation = interpolate(animEvent.position);
		});
	}
	,
	/**
	 * Animates by calling `update` with the interpolated keyframe values.
	 * @param {Function|Number[]} keyframes
	 * @param {function(pct:Number)} update
	 * @returns {Smart.Animation} this
	 */
	tween(keyframes, update) {
		var interpolate =
			Smart.Keyframes.fromFunction(keyframes)
			|| Smart.Keyframes.fromNumbers(keyframes);

		return this.frame(function _tween_(animEvent) {
			update(interpolate(animEvent.position));
		});
	}

	,
	/**
	 * Disposes the object once animations are finished
	 * @param disposable - Any object -- must have a `dispose` method
	 * @returns {Smart.Animation} this
	 */
	queueDispose(disposable) {
		return this.queue(function() {
			disposable.dispose();
		});
	}
});

