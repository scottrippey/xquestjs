/**
 * Animation Core
 */
var Animation = function() {
	this._actions = [];
	this._position = 0;
	this._loops = 0;
};
Object.append(Animation.prototype, {
	updateAnimation: function(deltaSeconds) {
		this._position += deltaSeconds;

		var anim = {
			position: this._position
			,complete: false
			,loops: this._loops
			,keyframe: 0
		};

		for (var i = 0, length = this._actions.length; i < length; i++) {
			this._actions[i].call(this, anim);
		}

		this._loops = anim.loops;

		return anim;
	}
	,
	addAction: function(actionFunction) {
		this._actions.push(actionFunction);
		return this;
	}
});
