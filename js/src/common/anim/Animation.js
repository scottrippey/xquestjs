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
