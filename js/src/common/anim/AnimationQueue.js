var AnimationQueue = function(){};
AnimationQueue.prototype = {
	addAnimation: function(animationQueueName, animation) {
		if (animation === undefined) {
			animation = animationQueueName;
			animationQueueName = 'default';
		}

		if (!this._animationQueues)
			this._animationQueues = {};
		if (!this._animationQueues[animationQueueName])
			this._animationQueues[animationQueueName] = [];

		this._animationQueues[animationQueueName].push(animation);
	}
	,
	updateAnimations: function(deltaSeconds) {
		Object.each(this._animationQueues, function(animationQueue) {
			Array.each(animationQueue, function(animation) {
				var animInfo = animation.updateAnimation(deltaSeconds);
			});
		});
	}
};