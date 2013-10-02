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
		var update = function(p) { target.x = p.x; target.y = p.y; };
		keyframes = Smart.Keyframes.fromFunction(keyframes) || Smart.Keyframes.fromPoints(keyframes) || Smart.Keyframes.fromPoints([ Point.clonePoint(target), keyframes ]);
		return this.tween(update, keyframes);
	}

	,
	/**
	 * Animates the `alpha` property of the target.
	 * @param {Object} target
	 * @param {Function|Number[]|Number} keyframes
	 * @returns {this}
	 */
	fade: function(target, keyframes) {
		var update = function(a) { target.alpha = a; };
		keyframes = Smart.Keyframes.fromFunction(keyframes) || Smart.Keyframes.fromNumbers(keyframes) || Smart.Keyframes.fromNumbers([ target.alpha !== undefined ? target.alpha : 1, keyframes ]);
		return this.tween(update, keyframes);
	}

	,
	/**
	 * Animates the `color` property of the target.
	 * @param {Object} target
	 * @param {Function|String[]|String} keyframes
	 * @returns {this}
	 */
	color: function(target, keyframes) {
		var update = function(c) { target.color = c; };
		keyframes = Smart.Keyframes.fromFunction(keyframes) || Smart.Keyframes.fromColors(keyframes) || Smart.Keyframes.fromColors([ target.color, keyframes ]);
		return this.tween(update, keyframes);
	}

	,
	/**
	 * Animates the `scale` properties (scaleX, scaleY) of the target.
	 * @param {Object} target
	 * @param {Function|Number[]|Number} keyframes
	 * @returns {this}
	 */
	scale: function(target, keyframes) {
		var update = function(s) {
			target.scaleX = target.scaleY = s;
		};
		keyframes = Smart.Keyframes.fromFunction(keyframes) || Smart.Keyframes.fromNumbers(keyframes) || Smart.Keyframes.fromNumbers([ target.scaleX !== undefined ? target.scaleX : 1, keyframes ]);
		return this.tween(update, keyframes);
	}

	,
	/**
	 * Animates the `rotation` property of the target.
	 * @param {Object} target
	 * @param {Function|Number[]|Number} keyframes
	 * @returns {this}
	 */
	rotate: function(target, keyframes) {
		var update = function(r) { target.rotation = r; };
		keyframes = Smart.Keyframes.fromFunction(keyframes) || Smart.Keyframes.fromNumbers(keyframes) || Smart.Keyframes.fromNumbers([ target.rotation !== undefined ? target.rotation : 1, keyframes ]);
		return this.tween(update, keyframes);
	}
	,
	/**
	 * Animates by calling `update` with the interpolated keyframe values.
	 * @param {function(pct:Number)} update
	 * @param {Function|Number[]} keyframes
	 * @returns {this}
	 */
	tween: function(update, keyframes) {
		var interpolate = Smart.Keyframes.fromFunction(keyframes) || Smart.Keyframes.fromNumbers(keyframes) || Smart.Keyframes.fromNumbers([ keyframes ]);
		return this.addAction(function(animEvent) {
			var pct = animEvent.position;
			var value = interpolate(pct);
			update(value);
		});
	}

});

