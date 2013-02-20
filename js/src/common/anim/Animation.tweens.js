/**
 * Animation Tweens
 */
var defaultEasingPower = 3;
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
	,
	ease: function(power) {
		if (!power) power = defaultEasingPower;
		return this.addAction(function(anim){
			var pos = anim.position;
			if (pos <= 0){
				anim.position = 0;
			} else if (pos >= 1) {
				anim.position = 1;
			} else {
				pos = pos * 2;
				if (pos <= 1) {
					pos = Math.pow(pos, power) / 2;
				} else {
					pos--;
					pos = 1 - Math.pow(1 - pos, power) / 2;
				}
				anim.position = pos;
			}
		});
	}
	,
	easeIn: function(power) {
		if (!power) power = defaultEasingPower;
		return this.addAction(function(anim){
			var pos = anim.position;
			if (pos <= 0){
				anim.position = 0;
			} else if (pos >= 1) {
				anim.position = 1;
			} else {
				pos = Math.pow(pos, power);
				anim.position = pos;
			}
		});
	}
	,
	easeOut: function(power) {
		if (!power) power = defaultEasingPower;
		return this.addAction(function(anim) {
			var pos = anim.position;
			if (pos <= 0){
				anim.position = 0;
			} else if (pos >= 1) {
				anim.position = 1;
			} else {
				pos = 1 - Math.pow(1 - pos, power);
				anim.position = pos;
			}
		});
	}
});
