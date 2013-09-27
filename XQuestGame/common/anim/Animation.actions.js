/**
 * Animation Actions
 */
_.extend(Animation.prototype, {

	/**
	 * Animates the `x` and `y` properties of the target.
	 * @param {Point} target
	 * @param {Function|Point[]|Point} keyframes
	 * @returns {this}
	 */
	move: function(target, keyframes) {
		var update = function(p) { target.x = p.x; target.y = p.y; };
		keyframes = Keyframes.fromFunction(keyframes) || Keyframes.fromPoints(keyframes) || Keyframes.fromPoints([ Point.clonePoint(target), keyframes ]);
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
		keyframes = Keyframes.fromFunction(keyframes) || Keyframes.fromValues(keyframes) || Keyframes.fromValues([ target.alpha, keyframes ]);
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
		keyframes = Keyframes.fromFunction(keyframes) || Keyframes.fromColors(keyframes) || Keyframes.fromColors([ target.color, keyframes ]);
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
		var interpolate = Keyframes.fromFunction(keyframes) || Keyframes.fromValues(keyframes) || Keyframes.fromValues([ keyframes ]);
		return this.addAction(function(animEvent) {
			var pct = animEvent.position;
			var value = interpolate(pct);
			update(value);
		});
	}

});

