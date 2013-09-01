/**
 * Animation Tweens
 */
_.extend(Animation.prototype, {
	duration: function(duration) {
		return this.addAction(function(anim){
			if (anim.position >= duration) {
				anim.position = 1;
			} else {
				anim.position = anim.position / duration;
				anim.stillRunning = true;
			}
		});
	}
	,
	loop: function(duration, maxLoops) {
		if (maxLoops === undefined)
			maxLoops = Number.MAX_VALUE;
		return this.addAction(function(anim) {
			while (anim.position >= duration) {
				anim.position -= duration;
				anim.loops++;
			}
			if (anim.loops >= maxLoops) {
				anim.loops = maxLoops;
				anim.position = 1;
			} else {
				anim.position = anim.position / duration;
				anim.stillRunning = true;
			}
		})
	}
	,
	continuous: function(duration) {
		return this.addAction(function(anim) {
			anim.position = anim.position / duration;
			anim.stillRunning = true;
		});
	}
	,
	delay: function(duration) {
		return this.addAction(function(anim) {
			anim.position = Math.max(0, anim.position - duration);
			anim.stillRunning = true;
		});
	}
	,
	savePosition: function() {
		return this.addAction(function(anim) {
			anim.savedPosition = anim.position;
		});
	}
	,
	restorePosition: function() {
		return this.addAction(function(anim) {
			anim.position = anim.savedPosition;
		});
	}
});
