/**
 * Animation Actions
 */
_.extend(Smart.Animation.prototype, {

	/**
	 * Animates the `x` and `y` properties of the target.
	 * @param {Point} target
	 * @param {Function|Point[]|Point} keyframes
	 * @returns {this}
	 */
	move: function(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromPoints(keyframes)
				|| Smart.Keyframes.fromPoints([ Smart.Point.clonePoint(target), keyframes ]);
			return interpolate(position);
		};
		return this.addAction(function _move_(animEvent) {
			var p = interpolate(animEvent.position);
			target.x = p.x; target.y = p.y;
		});

	}

	,
	/**
	 * Animates the `alpha` property of the target.
	 * @param {Object} target
	 * @param {Function|Number[]|Number} keyframes
	 * @returns {this}
	 */
	fade: function(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromNumbers(keyframes)
				|| Smart.Keyframes.fromNumbers([ target.alpha !== undefined ? target.alpha : 1, keyframes ]);
			return interpolate(position);
		};

		return this.addAction(function _fade_(animEvent) {
			target.alpha = interpolate(animEvent.position);
		});
	}

	,
	/**
	 * Animates the `color` property of the target.
	 * @param {Object} target
	 * @param {Function|String[]|String} keyframes
	 * @returns {this}
	 */
	color: function(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromColors(keyframes)
				|| Smart.Keyframes.fromColors([ target.color, keyframes ]);
			return interpolate(position);
		};

		return this.addAction(function _color_(animEvent) {
			target.color = interpolate(animEvent.position);
		});
	}

	,
	/**
	 * Animates the `scale` properties (scaleX, scaleY) of the target.
	 * @param {Object} target
	 * @param {Function|Number[]|Number} keyframes
	 * @returns {this}
	 */
	scale: function(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromNumbers(keyframes)
				|| Smart.Keyframes.fromNumbers([ target.scaleX !== undefined ? target.scaleX : 1, keyframes ]);
			return interpolate(position);
		};
		return this.addAction(function _scale_(animEvent) {
			target.scaleX = target.scaleY = interpolate(animEvent.position);
		});
	}

	,
	/**
	 * Animates the `rotation` property of the target.
	 * @param {Object} target
	 * @param {Function|Number[]|Number} keyframes
	 * @returns {this}
	 */
	rotate: function(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromNumbers(keyframes)
				|| Smart.Keyframes.fromNumbers([ target.rotation !== undefined ? target.rotation : 1, keyframes ]);
			return interpolate(position);
		};

		return this.addAction(function _rotate_(animEvent) {
			target.rotation = interpolate(animEvent.position);
		});
	}
	,
	/**
	 * Animates by calling `update` with the interpolated keyframe values.
	 * @param {function(pct:Number)} update
	 * @param {Function|Number[]} keyframes
	 * @returns {this}
	 */
	tween: function(update, keyframes) {
		var interpolate =
			Smart.Keyframes.fromFunction(keyframes)
			|| Smart.Keyframes.fromNumbers(keyframes)
			|| Smart.Keyframes.fromNumbers([ keyframes ]);

		return this.addAction(function _tween_(animEvent) {
			update(interpolate(animEvent.position));
		});
	}

});

