var AnimationQueue = function(){};
AnimationQueue.prototype = {
	_queue: null
	,
	/**
	 * Clears the animation queue.
	 */
	clear: function() {
		this._queue = null;
	}
	,
	/**
	 *
	 * @param {Animation...|Function...} animation
	 */
	queue: function(animation) {
		var animations = Array.map(arguments, function(animation) {
			if (typeof animation === 'function') {
				return new Animation().complete().addAction(animation);
			}
			return animation;
		});
		if (!this._queue) {
			this._queue = [ animations ];
		} else {
			this._queue.push(animations);
		}

		return this;
	}
	,
	/**
	 * Updates all animations, and clears up finished animations.
	 *
	 * @param {Number} deltaSeconds
	 */
	update: function(deltaSeconds) {
		if (!this._queue || !this._queue.length)
			return true;

		var animationQueue = this._queue;
		while (animationQueue.length) {
			var animations = animationQueue[0];
			Array.eliminate(animations, function(animation, animIndex) {

				var animInfo = animation.updateAnimation(deltaSeconds);

				var animationIsComplete = (animInfo.complete);
				return animationIsComplete;
			});

			var animationsAreComplete = (animations.length === 0);
			if (animationsAreComplete) {
				animationQueue.shift();
				continue;
			}
			break;
		}

		var animationQueueIsComplete = (animationQueue.length === 0);
		return animationQueueIsComplete;
	}
};