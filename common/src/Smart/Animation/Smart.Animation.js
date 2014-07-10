/**
 * Animation Core
 */
Smart.Animation = Smart.Class({
	initialize: function Animation() {
		this._actions = [];
		this._position = 0;

		/**
		 * @name AnimationEvent
		 * @property {number} loops
		 * @property {boolean} stillRunning
		 * @property {function(value:boolean)} clearCurrentActions
		 * @property {function(value:boolean)} stopUpdate
		 */
		this._animEvent = {
			loops: 0
			,
			/** Indicates that the animation is still running */
			stillRunning: false
			,
			/** Dequeues the current actions */
			clearCurrentActions: function(value) {
				this._clearCurrentActions = (value === undefined) ? true : value;
			}
			,
			_clearCurrentActions: false
			,
			/** Prevents the rest of the queue from executing */
			stopUpdate: function(value) {
				this._stopUpdate = (value === undefined) ? true : value;
			}
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

		var thisAnimation = this,
			animEvent = this._animEvent;

		var position = this._position;
		animEvent.stillRunning = false;

		for (var i = 0; i < this._actions.length; i++) {
			var frame = this._actions[i];
			var result = frame(position, animEvent, thisAnimation);
			if (result !== undefined) {
				position = result;
			}

			if (animEvent._clearCurrentActions) {
				animEvent._clearCurrentActions = false;
				position = this._position = 0;
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
	 * @param {function(position:Number, animEvent:AnimationEvent, thisAnimation:Smart.Animation)} frameCallback
	 * @returns {Smart.Animation} this
	 */
	frame: function(frameCallback) {
		this._actions.push(frameCallback);
		return this;
	}
	,
	/**
	 * Waits for the current animations to complete, before continuing the chain.
	 * If supplied, the callback will be executed.
	 * @param {function(position:Number, animEvent:AnimationEvent, thisAnimation:Smart.Animation)} [callback]
	 * @returns {Smart.Animation} this
	 */
	queue: function(callback) {
		return this.frame(function _queue_(position, animEvent, thisAnimation) {
			if (animEvent.stillRunning === true) {
				animEvent.stopUpdate();
			} else {
				if (callback)
					callback(position, animEvent, thisAnimation);
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
