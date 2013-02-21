var AnimationQueue = function(){};
AnimationQueue.prototype = {
	/**
	 *
	 * @param {String} [animationQueueName]
	 * @param {Animation...} animation
	 */
	addAnimation: function(animationQueueName, animation) {
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

		var completedQueues = null;

		Object.each(this._animationQueues, function(animationQueue, animationQueueName) {

			var animations = animationQueue[0];

			var completedAnimations = null;
			Array.each(animations, function(animation, animIndex){

				// Here's the 'actual' work:
				var animInfo = animation.updateAnimation(deltaSeconds);

				if (animInfo.complete) {
					if (!completedAnimations)
						completedAnimations = [];
					completedAnimations.push(animIndex);
				}
			});

			// Clean up:
			if (completedAnimations) {
				var allAnimationsAreComplete = (completedAnimations.length === animations.length);
				if (allAnimationsAreComplete) {
					animationQueue.shift();
					var animationQueueIsComplete = (animationQueue.length === 0);
					if (animationQueueIsComplete) {
						if (!completedQueues) {
							completedQueues = [];
						}
						completedQueues.push(animationQueueName);
					}
				} else {
					var i = completedAnimations.length;
					while (i--) {
						var animIndex = completedAnimations[i];
						animations.splice(animIndex, 1);
					}
				}
			}
		});

		if (completedQueues) {
			var i = completedQueues.length;
			while (i--) {
				var completedQueueName = completedQueues[i];
				delete this._animationQueues[completedQueueName];
			}
		}

	}
};