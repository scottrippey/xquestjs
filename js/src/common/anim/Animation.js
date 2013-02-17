/**
 * Animation Core
 */
var Animation = function() {
	this._actions = [];
	this._position = 0;
};
Object.append(Animation.prototype, {
	updateAnimation: function(deltaSeconds) {
		this._position += deltaSeconds;

		var anim = {
			position: this._position
			,complete: false
			,keyframe: 0
		};

		for (var i = 0, length = this._actions.length; i < length; i++) {
			this._actions[i].call(this, anim);
		}
	}
	,
	addAction: function(actionFunction) {
		this._actions.push(actionFunction);
		return this;
	}
});

/**
 * Animation Actions
 */
Object.append(Animation.prototype, {
	move: function(moveOptions) {

		if (!moveOptions.keyframes) {
			var target = moveOptions.target
				,from = moveOptions.from || { x: target.x, y: target.y }
				,to = moveOptions.to;
			moveOptions.keyframes = [from, to];
		}

		return this.addAction(function(anim){
			var pos = anim.position
				,keyframe = (anim.keyframe % moveOptions.keyframes.length);
			var target = moveOptions.target
				,from = moveOptions.keyframes[keyframe]
				,to = moveOptions.keyframes[keyframe + 1];

			target.x = interpolate(from.x, to.x, pos);
			target.y = interpolate(from.y, to.y, pos);
		});
	}
});
function interpolate(start, end, pos) {
	return start + pos * (end - start);
}

/**
 * Animation Tweens
 */
var defaultEasingPower = 3;
Object.append(Animation.prototype, {
	duration: function(durationS) {
		return this.addAction(function(anim){
			if (anim.position >= durationS) {
				anim.position = 1;
				anim.complete = true;
			} else {
				anim.position = anim.position / durationS;
			}
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
