XQuestGame.BaseScene = Smart.Class({
	host: null
	,initialize: function BaseScene() { }
	,BaseScene_initialize: function(host) {
		this.host = host;
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
		if (!this.scenePaused) {
			_.forEachRight(this.phases.input, function(gameItem) { gameItem.onInput(tickEvent); });
			_.forEachRight(this.phases.move, function(gameItem) { gameItem.onMove(tickEvent); });
			_.forEachRight(this.phases.act, function(gameItem) { gameItem.onAct(tickEvent); });
		}
		_.forEachRight(this.phases.draw, function(gameItem) { gameItem.onDraw(tickEvent); });
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
	,scenePause: function(scenePaused) {
		this.scenePaused = scenePaused;
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
	}

});
