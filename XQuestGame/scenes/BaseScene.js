XQuestGame.BaseScene = Smart.Class(new Smart.Disposable(), {
	initialize: function BaseScene() { }
	,BaseScene_initialize: function() {
		this.debugStats = { sceneItems: [] };
		this._setupEvents();
		this._setupPhases();
	}
	,_setupEvents: function() {
		this._events = new Smart.Events();
	}
	,_setupPhases: function() {
		this.phases = {
			input: []
			, move: []
			, act: []
			, draw: []
		};
	}
	,updateScene: function(tickEvent) {
		// Iterate right-to-left, because items could get removed
		var childScene = this.childScene;
		if (!childScene) {
			var inputState = (this.getDefaultInputState && this.getDefaultInputState()) || {};
			_.forEachRight(this.phases.input, function(gameItem) { gameItem.onInput(tickEvent, inputState); });
			_.forEachRight(this.phases.move, function(gameItem) { gameItem.onMove(tickEvent, inputState); });
			_.forEachRight(this.phases.act, function(gameItem) { gameItem.onAct(tickEvent); });
		}
		_.forEachRight(this.phases.draw, function(gameItem) { gameItem.onDraw(tickEvent); });

		if (childScene) {
			childScene.updateScene(tickEvent);
		}
	}
	,addSceneItem: function(sceneItem) {
		// Determine which methods the sceneItem implements,
		// and add them to the appropriate phase:
		if (sceneItem.onInput)
			this.phases.input.push(sceneItem);
		if (sceneItem.onMove)
			this.phases.move.push(sceneItem);
		if (sceneItem.onAct)
			this.phases.act.push(sceneItem);
		if (sceneItem.onDraw)
			this.phases.draw.push(sceneItem);

		this.debugStats.sceneItems.push(sceneItem);
	}
	,removeSceneItem: function(sceneItem) {
		if (sceneItem.onInput)
			_.eliminate(this.phases.input, sceneItem);
		if (sceneItem.onMove)
			_.eliminate(this.phases.move, sceneItem);
		if (sceneItem.onAct)
			_.eliminate(this.phases.act, sceneItem);
		if (sceneItem.onDraw)
			_.eliminate(this.phases.draw, sceneItem);

		_.eliminate(this.debugStats.sceneItems, sceneItem);
	}
	,
	/**
	 * Creates utility methods for adding event handlers.
	 * This makes it easier to add events and harder to have typos.
	 *
	 * Example:
	 *  game.onGamePaused(function(paused) { ... });
	 * instead of
	 *  game.addEvent('GamePaused', function(paused) { ... });
	 *
	 * @param {Object.<method,{string} event>} SceneEvents
	 */
	implementSceneEvents: function(SceneEvents) {
		_.forOwn(SceneEvents, function(eventName, onEventName) {
			this[onEventName] = function(eventHandler) {
				this._events.addEvent(eventName, eventHandler);
			};
		}, this);
		return this;
	}
	,
	/**
	 * @protected
	 * @param {string} eventName
	 * @param {array} [args]
	 */
	fireSceneEvent: function(eventName, args) {
		this._events.fireEvent(eventName, args);
	}
	,
	/** @protected */
	setChildScene: function(childScene) {
		this.childScene = childScene;
		if (childScene) {
			this.childScene.onDispose(function() {
				this.childScene = null;
			}.bind(this));
		}
	}
});