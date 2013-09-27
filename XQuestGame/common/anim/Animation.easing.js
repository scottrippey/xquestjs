/**
 * Animation Easing functions
 */
_.extend(Animation.prototype, {
	defaultEasing: 'swing'
	,
	/**
	 * Applies an ease-in-out function to the current animation.
	 *
	 * @param {Easing|Function|string} [easing]
	 * @returns {this}
	 */
	ease: function(easing) {
		easing = Animation.Easing.from(easing || this.defaultEasing);
		return this.addAction(function(animEvent){
			var pos = animEvent.position;
			if (pos <= 0){
				animEvent.position = 0;
			} else if (pos >= 1) {
				animEvent.position = 1;
			} else if (pos <= 0.5) {
				animEvent.position = easing(pos * 2) / 2;
			} else {
				animEvent.position = 1 - easing((1 - pos) * 2) / 2;
			}
		});
	}
	,
	/**
	 * Applies an ease-in function to the current animation.
	 *
	 * @param {Easing|Function|string} [easing]
	 * @returns {this}
	 */
	easeIn: function(easing) {
		easing = Animation.Easing.from(easing || this.defaultEasing);
		return this.addAction(function(animEvent){
			var pos = animEvent.position;
			if (pos <= 0){
				animEvent.position = 0;
			} else if (pos >= 1) {
				animEvent.position = 1;
			} else {
				animEvent.position = easing(pos);
			}
		});
	}
	,
	/**
	 * Applies an ease-out function to the current animation.
	 *
	 * @param {Easing|Function|string} [easing]
	 * @returns {this}
	 */
	easeOut: function(easing) {
		easing = Animation.Easing.from(easing || this.defaultEasing);
		return this.addAction(function(animEvent) {
			var pos = animEvent.position;
			if (pos <= 0){
				animEvent.position = 0;
			} else if (pos >= 1) {
				animEvent.position = 1;
			} else {
				animEvent.position = 1 - easing(1 - pos);
			}
		});
	}
});

Animation.Easing = {
	/**
	 * Returns an easing function from the specified string.
	 * Alternatively, a custom function can be supplied.
	 *
	 * @param {String|Function} easing
	 * @return {Function}
	 */
	from: function(easing) {
		if (typeof easing === 'function') {
			return easing;
		} else {
			return Animation.Easing[easing];
		}
	}
	,
	linear: function(position) {
		return position;
	}
	,
	quad: function(position) {
		return (position * position);
	}
	,
	cube: function(position) {
		return Math.pow(position, 3);
	}
	,
	quart: function(position) {
		return Math.pow(position, 4);
	}
	,
	quint: function(position) {
		return Math.pow(position, 5);
	}
	,
	sine: function(position) {
		return (Math.cos(position * Math.PI) - 1) / -2;
	}
	,
	swing: function(position) {
		return position - Math.sin(position * Math.PI) / Math.PI;
	}
};
