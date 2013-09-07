/**
 * Animation Core
 */
var Animation = function() {
	this._actions = [];
	this._position = 0;
	/**
	 * @name AnimationInfo
	 * @type {Object}
	 * @property position
	 */
	this._anim = {
		position: 0
		,
		loops: 0
		,
		keyframe: 0
		,
		/**
		 * Indicates that the animation is still running
		 */
		stillRunning: false
		,
		/**
		 * Dequeues the current actions
		 */
		clearCurrentActions: function(value) { this._clearCurrentActions = (value === undefined) || value; }
		,
		_clearCurrentActions: false
		,
		/**
		 * Prevents the rest of the queue from executing
		 */
		stopUpdate: function(value) { this._stopUpdate = (value === undefined) || value; }
		,
		_stopUpdate: false
	};

};
_.extend(Animation.prototype, {
	update: function(deltaSeconds) {
		this._position += deltaSeconds;

		var anim = this._anim;
		anim.position = this._position;
		anim.stillRunning = false;

		for (var i = 0; i < this._actions.length; i++) {
			this._actions[i](anim, this);

			if (anim._clearCurrentActions) {
				anim._clearCurrentActions = false;
				this._actions.splice(0, i + 1);
				i = -1;
			}
			if (anim._stopUpdate) {
				anim._stopUpdate = false;
				break;
			}
		}
		if (anim.stillRunning === false && this._actions.length) {
			this._actions = [];
		}

		return anim;
	}
	,
	addAction: function(actionFunction) {
		this._actions.push(actionFunction);
		return this;
	}
	,
	queue: function(fn) {
		return this.addAction(function(anim) {
			if (anim.stillRunning === true) {
				anim.stopUpdate();
			} else {
				anim.clearCurrentActions();
				if (fn) fn(anim);
			}
		});
	}
});
_.extend(Animation, {
	updateAndEliminate: function(animations, deltaSeconds) {
		_.eliminate(animations, function(animation) {
			var anim = animation.update(deltaSeconds);
			return !anim.stillRunning;
		});
	}
});
