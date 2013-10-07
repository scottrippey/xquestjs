/**
 * Animation Tweens
 */
_.extend(Smart.Animation.prototype, {
	/**
	 * Specifies the duration of the animation.
	 * Animation will stop after the duration.
	 * @param {Number} duration
	 * @returns {this}
	 */
	duration: function(duration) {
		return this.addAction(function _duration_(animEvent){
			if (animEvent.position >= duration) {
				animEvent.position = 1;
			} else {
				animEvent.position = animEvent.position / duration;
				animEvent.stillRunning = true;
			}
		});
	}
	,
	/**
	 * Loops the animation over the specified duration.
	 *
	 * @param {Number} duration
	 * @param {Number} [maxLoops] - defaults to Number.MAX_VALUE
	 * @returns {this}
	 */
	loop: function(duration, maxLoops) {
		if (maxLoops === undefined)
			maxLoops = Number.MAX_VALUE;
		return this.addAction(function _loop_(animEvent) {
			while (animEvent.position >= duration) {
				animEvent.position -= duration;
				animEvent.loops++;
			}
			if (animEvent.loops >= maxLoops) {
				animEvent.loops = maxLoops;
				animEvent.position = 1;
			} else {
				animEvent.position = animEvent.position / duration;
				animEvent.stillRunning = true;
			}
		});
	}
	,
	/**
	 * Specifies the duration of the animation.
	 * Animation will continue after the duration.
	 * @param {Number} duration
	 * @returns {this}
	 */
	continuous: function(duration) {
		return this.addAction(function _continuous_(animEvent) {
			animEvent.position = animEvent.position / duration;
			animEvent.stillRunning = true;
		});
	}
	,
	/**
	 * Waits the duration before starting animation.
	 * @param {Number} duration
	 * @returns {this}
	 */
	delay: function(duration) {
		return this.queue(function _delay_(animEvent) {
			return (animEvent.position >= duration);
		});
	}
	,
	/**
	 * Stores the current position, so it can be restored later.
	 * This allows for multiple synchronized animations.
	 * @returns {this}
	 */
	savePosition: function() {
		return this.addAction(function _savePosition_(animEvent) {
			animEvent.savedPosition = animEvent.position;
		});
	}
	,
	/**
	 * Restores the saved position.
	 * This allows for multiple synchronized animations.
	 * @returns {this}
	 */
	restorePosition: function() {
		return this.addAction(function _restorePosition_(animEvent) {
			animEvent.position = animEvent.savedPosition;
		});
	}
});
