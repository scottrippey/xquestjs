/**
 * Animation Tweens
 */
Object.append(Animation.prototype, {
	duration: function(duration) {
		return this.addAction(function(anim){
			if (anim.position >= duration) {
				anim.position = 1;
				anim.complete = true;
			} else {
				anim.position = anim.position / duration;
			}
		});
	}
	,
	loop: function(duration, maxLoops) {
		return this.addAction(function(anim) {
			while (anim.position >= duration) {
				anim.position -= duration;
				anim.loops++;
			}
			if (maxLoops !== undefined && anim.loops >= maxLoops) {
				anim.loops = maxLoops;
				anim.position = 1;
				anim.complete = true;
			} else {
				anim.position = anim.position / duration;
			}
		})
	}
	,
	continuous: function(duration) {
		return this.addAction(function(anim) {
			anim.position = anim.position / duration;
		});
	}
});
