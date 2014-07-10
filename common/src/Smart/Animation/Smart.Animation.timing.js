/**
 * Animation Tweens
 */
_.extend(Smart.Animation.prototype, {
	/**
	 * Specifies the duration of the animation.
	 * Animation will stop after the duration.
	 * @param {Number} duration
	 * @returns {Smart.Animation} this
	 */
	duration: function(duration) {
		return this.frame(function _duration_(position, animEvent){
			if (position >= duration) {
				return 1;
			} else {
				animEvent.stillRunning = true;
				return position / duration;
			}
		});
	}
	,
	/**
	 * Loops the animation over the specified duration.
	 *
	 * @param {Number} duration
	 * @param {Number} [maxLoops] - defaults to Number.MAX_VALUE
	 * @returns {Smart.Animation} this
	 */
	loop: function(duration, maxLoops) {
		if (maxLoops === undefined)
			maxLoops = Number.MAX_VALUE;
		return this.frame(function _loop_(position, animEvent) {
			while (position >= duration) {
				position -= duration;
				animEvent.loops++;
			}
			if (animEvent.loops >= maxLoops) {
				animEvent.loops = maxLoops;
				return 1;
			} else {
				animEvent.stillRunning = true;
				return position / duration;
			}
		});
	}
	,
	/**
	 * Specifies the duration of the animation.
	 * Animation will continue after the duration.
	 * @param {Number} duration
	 * @returns {Smart.Animation} this
	 */
	continuous: function(duration) {
		return this.frame(function _continuous_(position, animEvent) {
			animEvent.stillRunning = true;
			return position / duration;
		});
	}
	,
	/**
	 * Waits the duration before starting animation.
	 * @param {Number} duration
	 * @returns {Smart.Animation} this
	 */
	delay: function(duration) {
		return this.frame(function _delay_(position, animEvent) {
			if (position < duration) {
				animEvent.stillRunning = true;
				animEvent.stopUpdate();
			}
		});
	}
	,
	/**
	 * Stores the current position, so it can be restored later.
	 * This allows for multiple synchronized animations.
	 * @returns {Smart.Animation} this
	 */
	savePosition: function() {
		return this.frame(function _savePosition_(position, animEvent) {
			animEvent.savedPosition = position;
		});
	}
	,
	/**
	 * Restores the saved position.
	 * This allows for multiple synchronized animations.
	 * @returns {Smart.Animation} this
	 */
	restorePosition: function() {
		return this.frame(function _restorePosition_(position, animEvent) {
			return animEvent.savedPosition;
		});
	}
});
