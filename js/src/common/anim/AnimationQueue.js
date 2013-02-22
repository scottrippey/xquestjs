var AnimationQueue = function(){};
AnimationQueue.prototype = {
	/**
	 *
	 * @param {String} [animationQueueName]
	 * @param {Animation...} animation
	 */
	queueAnimation: function(animationQueueName, animation) {
		var animations;
		if (typeof animationQueueName === 'string') {
			animations = Array.slice(arguments, 1);
		} else {
			animations = Array.slice(arguments, 0);
			animationQueueName = 'default';
		}

		if (!this._animationQueues)
			this._animationQueues = {};
		if (!this._animationQueues[animationQueueName])
			this._animationQueues[animationQueueName] = [];

		this._animationQueues[animationQueueName].push(animations);
	}
	,

	/**
	 * Updates all animations, and clears up finished animations.
	 *
	 * @param {Number} deltaSeconds
	 */
	updateAnimations: function(deltaSeconds) {

		Object.eliminate(this._animationQueues, function(animationQueue, animationQueueName) {
			while (animationQueue.length) {
				var animations = animationQueue[0];
				Array.eliminate(animations, function(animation, animIndex) {

					var animInfo = animation.updateAnimation(deltaSeconds);

					var animationIsComplete = (animInfo.complete);
					return animationIsComplete;
				});

				var animationQueueIsComplete = false;
				var animationsAreComplete = (animations.length === 0);
				if (animationsAreComplete) {
					animationQueue.shift();
					continue;
				}
				break;
			}
			animationQueueIsComplete = (animationQueue.length === 0);

			return animationQueueIsComplete;
		});

	}
};