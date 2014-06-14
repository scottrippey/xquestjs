XQuestGame.Scene = Smart.Class({
	game: null
	,initialize: function(game) {
		this.game = game;
		this.debugStats = { sceneItems: [] };
		this._setupPhases();
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

});
