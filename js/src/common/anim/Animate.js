var Animate = function(target) {
	return new Animation(target);
};

var Animation = function(target) {
	this._target = target;
	this._updates = [];
};
Animation.prototype = {
	updateAnimation: function(pos) {
		for (var i = 0, length = this._updates.length; i < length; i++) {
			this._updates[i].call(this, pos);
		}
	}
	,
	onUpdate: function(onUpdate) {
		this._updates.push(onUpdate);
		return this;
	}
	,
	moveTo: function(source, destination) {
		if (!destination) {
			destination = source;
			source = { x: this._target.x, y: this._target.y };
		}
		this.onUpdate(function(pos) {
			this._target.x = interpolate(source.x, destination.x, pos);
			this._target.y = interpolate(source.y, destination.y, pos);
		});

		return this;
	}
};

function interpolate(start, end, pos) {
	return start + pos * (end - start);
}