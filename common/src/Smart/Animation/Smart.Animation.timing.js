import { Animation } from './Smart.Animation.js';

/**
 * Animation Tweens
 */
Object.assign(Animation.prototype, {
	/**
	 * Specifies the duration of the animation.
	 * Animation will stop after the duration.
	 * @param {Number} duration
	 * @returns {Animation} this
	 */
	duration(duration) {
		return this.frame(function _duration_(animEvent) {
			if (animEvent.position >= duration) {
				animEvent.position = 1;
			} else {
				animEvent.stillRunning = true;
				animEvent.position = animEvent.position / duration;
			}
		});
	},

	/**
	 * Loops the animation over the specified duration.
	 *
	 * @param {Number} duration
	 * @param {Number} [maxLoops] - defaults to Number.MAX_VALUE
	 * @returns {Animation} this
	 */
	loop(duration, maxLoops) {
		if (maxLoops === undefined)
			maxLoops = Number.MAX_VALUE;
		return this.frame(function _loop_(animEvent) {
			if (animEvent._loops === undefined)
				animEvent._loops = 0;

			while (animEvent.position >= duration) {
				animEvent.position -= duration;
				animEvent._loops++;
			}
			if (animEvent._loops >= maxLoops) {
				animEvent._loops = maxLoops;
				animEvent.position = 1;
			} else {
				animEvent.stillRunning = true;
				animEvent.position = animEvent.position / duration;
			}
		});
	},

	/**
	 * Specifies the duration of the animation.
	 * Animation will continue after the duration.
	 * @param {Number} duration
	 * @returns {Animation} this
	 */
	continuous(duration) {
		return this.frame(function _continuous_(animEvent) {
			animEvent.stillRunning = true;
			animEvent.position = animEvent.position / duration;
		});
	},

	/**
	 * Waits the duration before starting animation.
	 * @param {Number} duration
	 * @returns {Animation} this
	 */
	delay(duration) {
		return this.frame(function _delay_(animEvent) {
			if (animEvent.position < duration) {
				animEvent.stillRunning = true;
				animEvent.stopUpdate();
			} else {
				animEvent.position -= duration;
			}
		});
	},

	/**
	 * Stores the current position, so it can be restored later.
	 * This allows for multiple synchronized animations.
	 * @returns {Animation} this
	 */
	savePosition() {
		return this.frame(function _savePosition_(animEvent) {
			animEvent.savedPosition = animEvent.position;
		});
	},

	/**
	 * Restores the saved position.
	 * This allows for multiple synchronized animations.
	 * @returns {Animation} this
	 */
	restorePosition() {
		return this.frame(function _restorePosition_(animEvent) {
			animEvent.position = animEvent.savedPosition;
		});
	}
});
