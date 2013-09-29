var Animations = Class.create({
	addAnimation: function(animation) {
		if (!animation) animation = new Animation();
		if (!this.animations)
			this.animations = [ animation ];
		else
			this.animations.push(animation);
		return animation;
	}
	,
	update: function(deltaSeconds) {
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
