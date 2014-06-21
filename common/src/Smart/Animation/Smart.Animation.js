/**
 * Animation Core
 */
Smart.Animation = Smart.Class({
	initialize: function Animation() {
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

	}
	,
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
				animEvent.position = this._position = 0;
				this._actions.splice(0, i + 1);
				i = -1;
			}
			if (animEvent._stopUpdate) {
				animEvent._stopUpdate = false;
				break;
			}
		}
		if (animEvent.stillRunning === false && this._actions.length) {
			this._actions.length = 0;
		}

		return animEvent;
	}
	,
	/**
	 * Adds an action to the animation queue.
	 * @param {function(AnimationEvent)} actionFunction
	 * @returns {Animation} this
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
	 * @returns {Animation} this
	 */
	queue: function(callback) {
		return this.addAction(function _queue_(animEvent) {
			if (animEvent.stillRunning === true) {
				animEvent.stopUpdate();
			} else if (callback && callback(animEvent) === false) {
				animEvent.stopUpdate();
				animEvent.stillRunning = true;
			} else {
				animEvent.clearCurrentActions();
			}
		});
	}
	,
	/**
	 * Cancels the animation queue and removes the animation
	 */
	cancelAnimation: function() {
		this._actions.length = 0;
	}
});
