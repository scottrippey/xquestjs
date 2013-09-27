/**
 * Animation Core
 */
var Animation = function() {
	this._actions = [];
	this._position = 0;

	/**
	 * @name AnimationEvent
	 * @type {Object}
	 */
	this._animEvent = {
		position: 0
		,
		loops: 0
		,
		keyframe: 0
		,
		/** Indicates that the animation is still running */
		stillRunning: false
		,
		/** Dequeues the current actions */
		clearCurrentActions: function(value) { this._clearCurrentActions = (value === undefined) || value; }
		,
		_clearCurrentActions: false
		,
		/** Prevents the rest of the queue from executing */
		stopUpdate: function(value) { this._stopUpdate = (value === undefined) || value; }
		,
		_stopUpdate: false
	};

};
_.extend(Animation.prototype, {
	/**
	 * Updates the animation with the elapsed time.
	 * @param {Number} deltaSeconds
	 * @returns {AnimationEvent}
	 */
	update: function(deltaSeconds) {
		this._position += deltaSeconds;

		var animEvent = this._animEvent;
		animEvent.position = this._position;
		animEvent.stillRunning = false;

		for (var i = 0; i < this._actions.length; i++) {
			this._actions[i](animEvent, this);

			if (animEvent._clearCurrentActions) {
				animEvent._clearCurrentActions = false;
				this._actions.splice(0, i + 1);
				i = -1;
			}
			if (animEvent._stopUpdate) {
				animEvent._stopUpdate = false;
				break;
			}
		}
		if (animEvent.stillRunning === false && this._actions.length) {
			this._actions = [];
		}

		return animEvent;
	}
	,
	/**
	 * Adds an action to the animation queue.
	 * @param {function(AnimationEvent)} actionFunction
	 * @returns {this}
	 */
	addAction: function(actionFunction) {
		this._actions.push(actionFunction);
		return this;
	}
	,
	/**
	 * Waits for the current animations to complete, before continuing the chain.
	 * If supplied, the callback will be executed.
	 * @param {function(AnimationEvent)} [callback]
	 * @returns {this}
	 */
	queue: function(callback) {
		return this.addAction(function(animEvent) {
			if (animEvent.stillRunning === true) {
				animEvent.stopUpdate();
			} else {
				animEvent.clearCurrentActions();
				if (callback) callback(animEvent);
			}
		});
	}
});
_.extend(Animation, {
	/**
	 * Updates a set of animations.
	 * Removes all completed animations from the array.
	 *
	 * @param {Animation[]} animations
	 * @param {Number} deltaSeconds
	 */
	updateAndEliminate: function(animations, deltaSeconds) {
		_.eliminate(animations, function(animation) {
			var anim = animation.update(deltaSeconds);
			return !anim.stillRunning;
		});
	}
});
