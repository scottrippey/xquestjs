var BaseGame = Smart.Class({
	gfx: null
	, input: null
	, timer: null
	,
	initializeGame: function(graphics) {
		if (!graphics)
			console.error("You must provide a Canvas element!");

		this.debugStats = {
			gameItems: []
		};

		this._setupHandlers();
		this._setupGraphics(graphics);
		this._setupInput();
		this._setupTimer();
	}
	,
	_setupHandlers: function() {
		this.handlers = {
			input: []
			, move: []
			, act: []
			, draw: []
		};
	}
	,
	_setupGraphics: function(graphics) {
		this.gfx = graphics; //new EaselJSGraphics(canvas);
		this.addGameItem(this.gfx);
	}
	,
	_setupInput: function() {
		this.input = new GameInput();
	}
	,
	_setupTimer: function() {
		this.timer = new EaselJSTimer();
		this.timer.addTickHandler(this._tickHandler.bind(this));
	}
	,
	_tickHandler: function(tickEvent) {
		// Iterate right-to-left, because items could be removed
		_.forEachRight(this.handlers.input, function(gameItem) { gameItem.onInput(tickEvent); });
		_.forEachRight(this.handlers.move, function(gameItem) { gameItem.onMove(tickEvent); });
		_.forEachRight(this.handlers.act, function(gameItem) { gameItem.onAct(tickEvent); });
		_.forEachRight(this.handlers.draw, function(gameItem) { gameItem.onDraw(tickEvent); });
	}
	,
	addGameItem: function(gameItem) {
		// Determine which methods the gameItem implements,
		// and add them to the appropriate queue:
		if (gameItem.onInput)
			this.handlers.input.push(gameItem);
		if (gameItem.onMove)
			this.handlers.move.push(gameItem);
		if (gameItem.onAct)
			this.handlers.act.push(gameItem);
		if (gameItem.onDraw)
			this.handlers.draw.push(gameItem);

		this.debugStats.gameItems.push(gameItem);
	}
	,
	removeGameItem: function(gameItem) {
		if (gameItem.onInput)
			_.eliminate(this.handlers.input, gameItem);
		if (gameItem.onMove)
			_.eliminate(this.handlers.move, gameItem);
		if (gameItem.onAct)
			_.eliminate(this.handlers.act, gameItem);
		if (gameItem.onDraw)
			_.eliminate(this.handlers.draw, gameItem);

		_.eliminate(this.debugStats.gameItems, gameItem);
	}

});
