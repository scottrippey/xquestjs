Smart.Animations = Smart.Class({
	/**
	 * Adds or creates an animation to the list.
	 *
	 * @param {Smart.Animation} [animation]
	 * @returns {Smart.Animation}
	 */
	addAnimation(animation) {
		if (!animation) animation = new Smart.Animation();
		if (!this.animations)
			this.animations = [ animation ];
		else
			this.animations.push(animation);
		return animation;
	}
	,
	/**
	 * Updates all animations in the list.
	 * Automatically removes finished animations.
	 *
	 * @param {Number} deltaSeconds
	 */
	update(deltaSeconds) {
		if (!this.animations) return;
		var i = this.animations.length;
		while (i--) {
			var animEvent = this.animations[i].update(deltaSeconds);
			if (!animEvent.stillRunning) {
				// Remove the animation, by swapping in the last one:
				var lastAnimation = this.animations.pop();
				if (i < this.animations.length)
					this.animations[i] = lastAnimation;
			}
		}
	}
});
