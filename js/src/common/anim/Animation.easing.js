/**
 * Animation Easing functions
 */
Object.append(Animation.prototype, {
	defaultEasing: 'swing'
	,
	ease: function(easing) {
		easing = Animation.Easing.from(easing || this.defaultEasing);
		return this.addAction(function(anim){
			var pos = anim.position;
			if (pos <= 0){
				anim.position = 0;
			} else if (pos >= 1) {
				anim.position = 1;
			} else if (pos <= 0.5) {
				anim.position = easing(pos * 2) / 2;
			} else {
				anim.position = 1 - easing((1 - pos) * 2) / 2;
			}
		});
	}
	,
	easeIn: function(easing) {
		easing = Animation.Easing.from(easing || this.defaultEasing);
		return this.addAction(function(anim){
			var pos = anim.position;
			if (pos <= 0){
				anim.position = 0;
			} else if (pos >= 1) {
				anim.position = 1;
			} else {
				anim.position = easing(pos);
			}
		});
	}
	,
	easeOut: function(easing) {
		easing = Animation.Easing.from(easing || this.defaultEasing);
		return this.addAction(function(anim) {
			var pos = anim.position;
			if (pos <= 0){
				anim.position = 0;
			} else if (pos >= 1) {
				anim.position = 1;
			} else {
				anim.position = 1 - easing(1 - pos);
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
