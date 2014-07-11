/**
 * Animation Easing functions
 */
_.extend(Smart.Animation.prototype, {
	defaultEasing: 'quart'
	,
	/**
	 * Applies an ease-in-out function to the current animation.
	 *
	 * @param {Easing|Function|string} [easing]
	 * @returns {Smart.Animation} this
	 */
	ease: function(easing) {
		easing = Smart.Animation.Easing.easeInOut(easing || this.defaultEasing);
		return this.frame(function(animEvent) {
			animEvent.position = easing(animEvent.position);
		});
	}
	,
	/**
	 * Applies an ease-in function to the current animation.
	 *
	 * @param {Easing|Function|string} [easing]
	 * @returns {Smart.Animation} this
	 */
	easeIn: function(easing) {
		easing = Smart.Animation.Easing.easeIn(easing || this.defaultEasing);
		return this.frame(function(animEvent) {
			animEvent.position = easing(animEvent.position);
		});
	}
	,
	/**
	 * Applies an ease-out function to the current animation.
	 *
	 * @param {Easing|Function|string} [easing]
	 * @returns {Smart.Animation} this
	 */
	easeOut: function(easing) {
		easing = Smart.Animation.Easing.easeOut(easing || this.defaultEasing);
		return this.frame(function(animEvent) {
			animEvent.position = easing(animEvent.position);
		});
	}
});

Smart.Animation.Easing = {
	easeInOut: function(easing) {
		easing = Smart.Animation.Easing.from(easing);
		return function _easeInOut_(position){
			if (position <= 0){
				return 0;
			} else if (position >= 1) {
				return 1;
			} else if (position <= 0.5) {
				return easing(position * 2) / 2;
			} else {
				return 1 - easing((1 - position) * 2) / 2;
			}
		};
	},
	easeIn: function(easing) {
		easing = Smart.Animation.Easing.from(easing);
		return function _easeIn_(position){
			if (position <= 0){
				return 0;
			} else if (position >= 1) {
				return 1;
			} else {
				return easing(position);
			}
		};
	},
	easeOut: function(easing) {
		easing = Smart.Animation.Easing.from(easing);
		return function _easeOut_(position) {
			if (position <= 0){
				return 0;
			} else if (position >= 1) {
				return 1;
			} else {
				return 1 - easing(1 - position);
			}
		};
	},

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
			return Smart.Animation.Easing[easing];
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
