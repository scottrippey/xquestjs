/**
 * Animation Core
 */
Smart.Animation = Smart.Class({
	initialize: function Animation() {
		this._actions = [];
		this._position = 0;

		/**
		 * @name Smart.AnimationEvent
		 * @property {number} position
		 * @property {boolean} stillRunning
		 * @property {function(value:boolean)} clearCurrentActions
		 * @property {function(value:boolean)} stopUpdate
		 */
		this._animEvent = {
			/** The current position, according to the duration and easing functions. */
			position: 0,

			/** Indicates that the animation is still running */
			stillRunning: false,

			/** Dequeues the current actions */
			clearCurrentActions: function(value) {
				this._clearCurrentActions = (value === undefined) ? true : value;
			},
			_clearCurrentActions: false,

			/** Prevents the rest of the queue from executing */
			stopUpdate: function(value) {
				this._stopUpdate = (value === undefined) ? true : value;
			},
			_stopUpdate: false
		};
	}
	,

	/**
	 * Updates the animation with the elapsed time.
	 * @param {Number} deltaSeconds
	 * @returns {Smart.AnimationEvent}
	 */
	update: function(deltaSeconds) {
		this._position += deltaSeconds;

		var thisAnimation = this,
			animEvent = this._animEvent;

		animEvent.position = this._position;
		animEvent.stillRunning = false;

		for (var i = 0; i < this._actions.length; i++) {
			this._actions[i](animEvent, thisAnimation);

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
	 * @param {function(animEvent:Smart.AnimationEvent, thisAnimation:Smart.Animation)} frameCallback
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
	 * @param {function(animEvent:Smart.AnimationEvent, thisAnimation:Smart.Animation)} [callback]
	 * @returns {Smart.Animation} this
	 */
	queue: function(callback) {
		return this.frame(function _queue_(animEvent, thisAnimation) {
			if (animEvent.stillRunning === true) {
				animEvent.stopUpdate();
			} else {
				if (callback)
					callback(animEvent.position, animEvent, thisAnimation);
				animEvent.clearCurrentActions();
			}
		});
	}
	,
	/**
	 * Cancels the animation queue
	 */
	cancelAnimation: function() {
		this._actions.length = 0;
	}
});
